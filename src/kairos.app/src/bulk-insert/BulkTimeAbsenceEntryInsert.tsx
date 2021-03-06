import { t, Trans } from '@lingui/macro';
import {
  Fab,
  Grid,
  makeStyles,
  TextField,
  Typography,
} from '@material-ui/core';
import CheckIcon from '@material-ui/icons/Check';
import SaveIcon from '@material-ui/icons/Save';
import { isValid, parseISO } from 'date-fns';
import { indexBy, map, split, indexOf } from 'ramda';
import React, { ChangeEvent, useCallback, useMemo, useState } from 'react';
import { Index } from 'react-virtualized';
import { absenceTypeFormatter, dateTimeFormatter } from '../code/formatters';
import FabButtonSpinner from '../components/FabButtonSpinner';
import { VirtualizedTable } from '../components/VirtualizedTable';
import { i18n } from '../i18nLoader';
import { ProfileModel } from '../models/profile.model';
import {
  TimeAbsenceEntryModel,
  TimeAbsenceEntryTypes,
} from '../models/time-absence-entry.model';
import { UUID } from '../models/uuid.model';
import { isString } from '../code/is';

interface TimeAbsenceEntryInvalidModel {
  id: UUID;
  start: Date | string;
  end: Date | string;
  description: string;
  type: TimeAbsenceEntryTypes | string;
  job: UUID | string;
}

const useStyles = makeStyles(() => ({
  center: {
    display: 'grid',
    justifyContent: 'center',
  },
}));

export interface BulkTimeAbsenceEntryInsertInputs {
  isOnline: boolean;
  isBusy: boolean;
  profile: ProfileModel;
}

export interface BulkTimeAbsenceEntryInsertDispatches {
  onBulkInsert: (models: TimeAbsenceEntryModel[]) => void;
}

type BulkTimeAbsenceEntryInsertProps = BulkTimeAbsenceEntryInsertInputs &
  BulkTimeAbsenceEntryInsertDispatches;

export const BulkTimeAbsenceEntryInsertComponent: React.FC<BulkTimeAbsenceEntryInsertProps> = props => {
  const classes = useStyles(props);

  const { isOnline, isBusy, profile, onBulkInsert } = props;

  const [csv, setCsv] = useState('');
  const [validModels, setValidModels] = useState<TimeAbsenceEntryModel[]>([]);
  const [invalidModels, setInvalidModels] = useState<
    TimeAbsenceEntryInvalidModel[]
  >([]);

  const handleBulkInsert = useCallback(() => onBulkInsert(validModels), [
    onBulkInsert,
    validModels,
  ]);

  const handleCsvChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => setCsv(event.currentTarget.value),
    [setCsv],
  );

  const indexedJobsByName = useMemo(
    () => indexBy(job => job.name, profile.jobs),
    [profile],
  );
  const indexedJobsById = useMemo(
    () => indexBy(job => job.id.toString(), profile.jobs),
    [profile],
  );

  const handleParse = useCallback(() => {
    const validModels: TimeAbsenceEntryModel[] = [];
    const invalidModels: TimeAbsenceEntryInvalidModel[] = [];
    if (!!csv) {
      const lines = split('\n', csv);
      const splitByComma = split(',');
      for (let i = 0; i < lines.length; i++) {
        const cells = splitByComma(lines[i]);
        if (cells.length >= 4) {
          const start = parseISO(cells[0]);
          const end = parseISO(cells[1]);
          const type = cells[2];
          const jobName = cells[3];
          const description = cells[4];

          const job = indexedJobsByName[jobName.toString()];

          const isStartValid = isValid(start);
          const isEndValid = isValid(end);
          const isTypeValid =
            indexOf(type.toUpperCase(), [
              TimeAbsenceEntryTypes.VACATION,
              TimeAbsenceEntryTypes.ILLNESS,
              TimeAbsenceEntryTypes.COMPENSATION,
              TimeAbsenceEntryTypes.PERMIT,
            ]) !== -1;
          const isJobValid = !!job;

          if (isStartValid && isEndValid && isTypeValid && isJobValid) {
            validModels.push(
              new TimeAbsenceEntryModel(
                UUID.Generate(),
                description,
                start,
                end,
                type.toUpperCase() as TimeAbsenceEntryTypes,
                job.id,
              ),
            );
          } else {
            invalidModels.push({
              id: UUID.Generate(),
              description,
              start: isStartValid ? start : i18n._(t`Invalid Date`),
              end: isEndValid ? end : i18n._(t`Invalid Date`),
              type: isTypeValid
                ? (type as TimeAbsenceEntryTypes)
                : i18n._(t`Invalid Type`),
              job: isJobValid ? job.id : i18n._(t`Invalid Job`),
            });
          }
        } else {
          invalidModels.push({
            id: UUID.Generate(),
            description: '',
            start: i18n._(t`Invalid Date`),
            end: i18n._(t`Invalid Date`),
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
  const validModelsRowGetter = useCallback(
    ({ index }: Index) => validModels[index],
    [validModels],
  );
  const invalidModelsRowGetter = useCallback(
    ({ index }: Index) => invalidModels[index],
    [invalidModels],
  );
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
          <Trans>Absences</Trans>
        </Typography>
      </Grid>
      <Grid item>
        <TextField
          placeholder="START(yyyy-mm-ddThh:MMZ),END(yyyy-mm-ddThh:MMZ),TYPE(VACATION/ILLNESS),JOB,DESCRIPTION"
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
              title={i18n._(t`Valid Absences`)}
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
                  formatter: absenceTypeFormatter,
                },
                {
                  width: 200,
                  label: i18n._(t`Description`),
                  dataKey: 'description',
                },
                {
                  width: 200,
                  label: i18n._(t`Start`),
                  dataKey: 'start',
                  flexGrow: 1,
                  formatter: dateTimeFormatter,
                },
                {
                  width: 200,
                  label: i18n._(t`End`),
                  dataKey: 'end',
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
              title={i18n._(t`Invalid Absences`)}
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
                  formatter: absenceTypeFormatter,
                },
                {
                  width: 200,
                  label: i18n._(t`Description`),
                  dataKey: 'description',
                },
                {
                  width: 200,
                  label: i18n._(t`Start`),
                  dataKey: 'start',
                  flexGrow: 1,
                  formatter: dateTimeFormatter,
                },
                {
                  width: 200,
                  label: i18n._(t`End`),
                  dataKey: 'end',
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
          <FabButtonSpinner
            onClick={handleBulkInsert}
            isBusy={isBusy}
            disabled={!isOnline || isBusy}
          >
            <SaveIcon />
          </FabButtonSpinner>
        </Grid>
      )}
    </Grid>
  );
};
