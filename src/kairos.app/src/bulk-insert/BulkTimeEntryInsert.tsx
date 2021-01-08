import { t, Trans } from '@lingui/macro';
import { Fab, Grid, makeStyles, TextField, Typography } from '@material-ui/core';
import CheckIcon from '@material-ui/icons/Check';
import SaveIcon from '@material-ui/icons/Save';
import { isValid, parseISO } from 'date-fns';
import { indexBy, map, split } from 'ramda';
import indexOf from 'ramda/es/indexOf';
import React, { ChangeEvent, useCallback, useMemo, useState } from 'react';
import { Index } from 'react-virtualized';
import { dateTimeFormatter, entryTypeFormatter } from '../code/formatters';
import { isString } from '../code/is';
import FabButtonSpinner from '../components/FabButtonSpinner';
import { VirtualizedTable } from '../components/VirtualizedTable';
import { i18n } from '../i18nLoader';
import { ProfileModel } from '../models/profile.model';
import { TimeEntryModel, TimeEntryTypes } from '../models/time-entry.model';
import { UUID } from '../models/uuid.model';

interface TimeEntryInvalidModel {
  id: UUID;
  when: Date | string;
  type: TimeEntryTypes | string;
  job: UUID | string;
}

const useStyles = makeStyles(() => ({
  center: {
    display: 'grid',
    justifyContent: 'center',
  },
}));

export interface BulkTimeEntryInsertInputs {
  isOnline: boolean;
  isBusy: boolean;
  profile: ProfileModel;
}

export interface BulkTimeEntryInsertDispatches {
  onBulkInsert: (models: TimeEntryModel[]) => void;
}

type BulkTimeEntryInsertProps = BulkTimeEntryInsertInputs & BulkTimeEntryInsertDispatches;

export const BulkTimeEntryInsertComponent: React.FC<BulkTimeEntryInsertProps> = props => {
  const classes = useStyles(props);

  const { isOnline, isBusy, profile, onBulkInsert } = props;

  const [csv, setCsv] = useState('');
  const [validModels, setValidModels] = useState<TimeEntryModel[]>([]);
  const [invalidModels, setInvalidModels] = useState<TimeEntryInvalidModel[]>([]);

  const handleBulkInsert = useCallback(() => onBulkInsert(validModels), [
    onBulkInsert,
    validModels,
  ]);

  const handleCsvChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => setCsv(event.currentTarget.value),
    [setCsv],
  );

  const indexedJobsByName = useMemo(() => indexBy(job => job.name, profile.jobs), [profile]);
  const indexedJobsById = useMemo(() => indexBy(job => job.id.toString(), profile.jobs), [profile]);

  const handleParse = useCallback(() => {
    const validModels: TimeEntryModel[] = [];
    const invalidModels: TimeEntryInvalidModel[] = [];
    if (!!csv) {
      const lines = split('\n', csv);
      const splitByComma = split(',');
      for (let i = 0; i < lines.length; i++) {
        const cells = splitByComma(lines[i]);
        if (cells.length >= 3) {
          const when = parseISO(cells[0]);
          const type = cells[1];
          const jobName = cells[2];

          const job = indexedJobsByName[jobName.toString()];

          const isWhenValid = isValid(when);
          const isTypeValid = indexOf(type.toUpperCase(), [TimeEntryTypes.IN, TimeEntryTypes.OUT]) !== -1;
          const isJobValid = !!job;
          
          if (isWhenValid && isTypeValid && isJobValid) {
            validModels.push(
              new TimeEntryModel(UUID.Generate(), when, type as TimeEntryTypes, job.id),
            );
          } else {
            invalidModels.push({
              id: UUID.Generate(),
              when: isWhenValid ? when : i18n._(t`Invalid Date`),
              type: isTypeValid ? (type.toUpperCase() as TimeEntryTypes) : i18n._(t`Invalid Type`),
              job: isJobValid ? job.id : i18n._(t`Invalid Job`),
            });
          }
        } else {
          invalidModels.push({
            id: UUID.Generate(),
            when: i18n._(t`Invalid Date`),
            type: i18n._(t`Invalid Type`),
            job: i18n._(t`Invalid Job`),
          });
        }
      }
    }
    setValidModels(validModels);
    setInvalidModels(invalidModels);
  }, [indexedJobsByName, setValidModels, setInvalidModels, csv]);

  const noRowsRenderer = useCallback(() => <p>Empty or Invalid CSV</p>, []);
  const validModelsRowGetter = useCallback(({ index }: Index) => validModels[index], [validModels]);
  const invalidModelsRowGetter = useCallback(({ index }: Index) => invalidModels[index], [
    invalidModels,
  ]);
  const jobFormatter = useCallback(
    (jobId: UUID | string) => {
      if (!isString(jobId)) {
        return indexedJobsById[jobId.toString()].name;
      }
      return jobId;
    },
    [indexedJobsById],
  );

  return (
    <Grid container spacing={2} direction="column" justify="center">
      <Grid item>
        <Typography component="h1" variant="h6" noWrap>
          <Trans>Entries</Trans>
        </Typography>
      </Grid>
      <Grid item>
        <TextField
          placeholder="DATE(yyyy-mm-ddThh:MMZ),TYPE(IN/OUT),JOB"
          multiline
          variant="filled"
          rows={4}
          rowsMax={12}
          fullWidth
          value={csv}
          onChange={handleCsvChange}
        />
      </Grid>
      <Grid item className={classes.center}>
        <Fab color="primary" onClick={handleParse} disabled={!csv}>
          <CheckIcon />
        </Fab>
      </Grid>
      {!!validModels.length && (
        <>
          <Grid item>
            <VirtualizedTable
              title={i18n._(t`Valid Entries`)}
              height="250px"
              rowCount={validModels.length}
              rowIds={map(m => m.id.toString(), validModels)}
              noRowsRenderer={noRowsRenderer}
              rowGetter={validModelsRowGetter}
              columns={[
                {
                  width: 100,
                  label: i18n._(t`Type`),
                  dataKey: 'type',
                  formatter: entryTypeFormatter,
                },
                {
                  width: 200,
                  label: i18n._(t`When`),
                  dataKey: 'when',
                  flexGrow: 1,
                  formatter: dateTimeFormatter,
                },
                {
                  width: 200,
                  label: i18n._(t`Job`),
                  dataKey: 'job',
                  formatter: jobFormatter,
                },
              ]}
            />
          </Grid>
        </>
      )}
      {!!invalidModels.length && (
        <>
          <Grid item>
            <VirtualizedTable
              title={i18n._(t`Invalid Entries`)}
              height="250px"
              rowCount={invalidModels.length}
              rowIds={map(m => m.id.toString(), invalidModels)}
              noRowsRenderer={noRowsRenderer}
              rowGetter={invalidModelsRowGetter}
              columns={[
                {
                  width: 100,
                  label: i18n._(t`Type`),
                  dataKey: 'type',
                  formatter: entryTypeFormatter,
                },
                {
                  width: 200,
                  label: i18n._(t`When`),
                  dataKey: 'when',
                  flexGrow: 1,
                  formatter: dateTimeFormatter,
                },
                {
                  width: 200,
                  label: i18n._(t`Job`),
                  dataKey: 'job',
                  formatter: jobFormatter,
                },
              ]}
            />
          </Grid>
        </>
      )}
      {!!validModels.length && (
        <Grid item className={classes.center}>
          <FabButtonSpinner onClick={handleBulkInsert} isBusy={isBusy} disabled={!isOnline || isBusy}>
            <SaveIcon />
          </FabButtonSpinner>
        </Grid>
      )}
    </Grid>
  );
};
