import { t, Trans } from '@lingui/macro';
import { Fab, Grid, makeStyles, TextField, Typography } from '@material-ui/core';
import CheckIcon from '@material-ui/icons/Check';
import SaveIcon from '@material-ui/icons/Save';
import { isValid, parseISO } from 'date-fns';
import { chain, indexBy, split, map } from 'ramda';
import indexOf from 'ramda/es/indexOf';
import React, { ChangeEvent, useCallback, useMemo, useState } from 'react';
import { Index } from 'react-virtualized';
import { dateTimeFormatter, entryTypeFormatter } from '../code/formatters';
import { isString } from '../code/is';
import FabButtonSpinner from '../components/FabButtonSpinner';
import { VirtualizedTable } from '../components/VirtualizedTable';
import { i18n } from '../i18nLoader';
import { ProfileModel } from '../models/profile.model';
import { ProjectModel } from '../models/project.model';
import { TimeEntryModel, TimeEntryTypes } from '../models/time-entry.model';
import { UUID } from '../models/uuid.model';

interface TimeEntryInvalidModel {
  id: UUID;
  when: Date | string;
  type: TimeEntryTypes | string;
  job: UUID | string;
  project: UUID | string;
}

const useStyles = makeStyles(theme => ({
  center: {
    display: 'flex',
    justifyContent: 'center',
  },
}));

export interface BulkTimeEntryInsertInputs {
  isBusy: boolean;
  profile: ProfileModel;
}

export interface BulkTimeEntryInsertDispatches {
  onBulkInsert: (models: TimeEntryModel[]) => void;
}

type BulkTimeEntryInsertProps = BulkTimeEntryInsertInputs & BulkTimeEntryInsertDispatches;

export const BulkTimeEntryInsertComponent: React.FC<BulkTimeEntryInsertProps> = props => {
  const classes = useStyles(props);

  const { isBusy, profile, onBulkInsert } = props;

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
  const indexedProjectsByName = useMemo(
    () =>
      indexBy((project: ProjectModel) => project.name, chain(job => job.projects, profile.jobs)),
    [profile],
  );
  const indexedProjectsById = useMemo(
    () =>
      indexBy(
        (project: ProjectModel) => project.id.toString(),
        chain(job => job.projects, profile.jobs),
      ),
    [profile],
  );

  const handleParse = useCallback(() => {
    const validModels: TimeEntryModel[] = [];
    const invalidModels: TimeEntryInvalidModel[] = [];
    if (!!csv) {
      const lines = split('\n', csv);
      const splitByComma = split(',');
      for (let i = 0; i < lines.length; i++) {
        const cells = splitByComma(lines[i]);
        if (cells.length >= 4) {
          const when = parseISO(cells[0]);
          const type = cells[1];
          const jobName = cells[2];
          const projectName = cells[3];

          const job = indexedJobsByName[jobName.toString()];
          const project = indexedProjectsByName[projectName.toString()];

          const isWhenValid = isValid(when);
          const isTypeValid = indexOf(type, [TimeEntryTypes.IN, TimeEntryTypes.OUT]) !== -1;
          const isJobValid = !!job;
          const isProjectValid = !!project;
          if (isWhenValid && isTypeValid && isJobValid && isProjectValid) {
            validModels.push(
              new TimeEntryModel(UUID.Generate(), when, type as TimeEntryTypes, job.id, project.id),
            );
          } else {
            invalidModels.push({
              id: UUID.Generate(),
              when: isWhenValid ? when : i18n._(t`Validation.InvalidDate`),
              type: isTypeValid ? (type as TimeEntryTypes) : i18n._(t`Validation.InvalidType`),
              job: isJobValid ? job.id : i18n._(t`Validation.InvalidJob`),
              project: isProjectValid ? project.id : i18n._(t`Validation.InvalidProject`),
            });
          }
        }
      }
    }
    setValidModels(validModels);
    setInvalidModels(invalidModels);
  }, [indexedJobsByName, indexedProjectsByName, setValidModels, setInvalidModels, csv]);

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
  const projectFormatter = useCallback(
    (projectId: UUID | string) => {
      if (!isString(projectId)) {
        return indexedProjectsById[projectId.toString()].name;
      }
      return projectId;
    },
    [indexedProjectsById],
  );

  return (
    <Grid container spacing={2} direction="column" justify="center">
      <Grid item>
        <Typography component="h1" variant="h6" noWrap>
          <Trans>BulkTimeEntryInsert.Title</Trans>
        </Typography>
      </Grid>
      <Grid item>
        <TextField
          placeholder="DATE(dd/mm/yyyy hh:MM),TYPE(IN/OUT),JOB,PROJECT"
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
              title={i18n._(t`TimeHolidayEntries.Title`)}
              height="250px"
              rowCount={validModels.length}
              rowIds={map(m => m.id.toString(), validModels)}
              noRowsRenderer={noRowsRenderer}
              rowGetter={validModelsRowGetter}
              columns={[
                {
                  width: 100,
                  label: i18n._(t`BulkTimeEntryInsert.TypeTableHeader`),
                  dataKey: 'type',
                  formatter: entryTypeFormatter,
                },
                {
                  width: 200,
                  label: i18n._(t`BulkTimeEntryInsert.WhenTableHeader`),
                  dataKey: 'when',
                  flexGrow: 1,
                  formatter: dateTimeFormatter,
                },
                {
                  width: 200,
                  label: i18n._(t`BulkTimeEntryInsert.JobTableHeader`),
                  dataKey: 'job',
                  formatter: jobFormatter,
                },
                {
                  width: 200,
                  label: i18n._(t`BulkTimeEntryInsert.ProjectTableHeader`),
                  dataKey: 'project',
                  formatter: projectFormatter,
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
              title={i18n._(t`BulkTimeEntryInsert.InvalidEntries`)}
              height="250px"
              rowCount={invalidModels.length}
              rowIds={map(m => m.id.toString(), invalidModels)}
              noRowsRenderer={noRowsRenderer}
              rowGetter={invalidModelsRowGetter}
              columns={[
                {
                  width: 100,
                  label: i18n._(t`BulkTimeEntryInsert.TypeTableHeader`),
                  dataKey: 'type',
                  formatter: entryTypeFormatter,
                },
                {
                  width: 200,
                  label: i18n._(t`BulkTimeEntryInsert.WhenTableHeader`),
                  dataKey: 'when',
                  flexGrow: 1,
                  formatter: dateTimeFormatter,
                },
                {
                  width: 200,
                  label: i18n._(t`BulkTimeEntryInsert.JobTableHeader`),
                  dataKey: 'job',
                  formatter: jobFormatter,
                },
                {
                  width: 200,
                  label: i18n._(t`BulkTimeEntryInsert.ProjectTableHeader`),
                  dataKey: 'project',
                  formatter: projectFormatter,
                },
              ]}
            />
          </Grid>
        </>
      )}
      {!!validModels.length && (
        <Grid item className={classes.center}>
          <FabButtonSpinner onClick={handleBulkInsert} isBusy={isBusy} disabled={isBusy}>
            <SaveIcon />
          </FabButtonSpinner>
        </Grid>
      )}
    </Grid>
  );
};
