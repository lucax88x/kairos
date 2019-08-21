import { Fab, Grid, makeStyles, TextField, Typography } from '@material-ui/core';
import CheckIcon from '@material-ui/icons/Check';
import SaveIcon from '@material-ui/icons/Save';
import { format, isValid, parseISO } from 'date-fns';
import { chain, indexBy, split } from 'ramda';
import indexOf from 'ramda/es/indexOf';
import React, { ChangeEvent, useCallback, useMemo, useState } from 'react';
import { Index } from 'react-virtualized';
import { formatAsDateTime } from '../code/constants';
import FabButtonSpinner from '../components/FabButtonSpinner';
import { VirtualizedTable } from '../components/VirtualizedTable';
import { ProfileModel } from '../models/profile.model';
import { ProjectModel } from '../models/project.model';
import { TimeEntryModel, TimeEntryTypes } from '../models/time-entry.model';
import { UUID } from '../models/uuid.model';
import { isString } from '../code/is';

interface TimeEntryInvalidModel {
  when: Date | string;
  type: TimeEntryTypes | string;
  job: UUID | string;
  project: UUID | string;
}

const useStyles = makeStyles(theme => ({
  scroll: {
    overflow: 'auto',
    height: '250px',
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
              when: isWhenValid ? when : 'Invalid Date',
              type: isTypeValid ? (type as TimeEntryTypes) : 'Invalid Type',
              job: isJobValid ? job.id : 'Invalid Job',
              project: isProjectValid ? project.id : 'Invalid Project',
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
  const dateFormatter = useCallback((date: Date | string) => {
    if (!isString(date)) {
      return format(date, formatAsDateTime);
    }

    return date;
  }, []);
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
          Bulk insert of Time Entries (CSV)
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
      <Grid item>
        <Grid container justify="center">
          <Fab color="primary" onClick={handleParse} disabled={!csv}>
            <CheckIcon />
          </Fab>
        </Grid>
      </Grid>
      {!!validModels.length && (
        <>
          <Grid item>
            <Typography component="h1" variant="h6" noWrap>
              Valid Entries
            </Typography>
          </Grid>
          <Grid item className={classes.scroll}>
            <VirtualizedTable
              rowCount={validModels.length}
              noRowsRenderer={noRowsRenderer}
              rowGetter={validModelsRowGetter}
              columns={[
                {
                  width: 100,
                  label: 'Type',
                  dataKey: 'type',
                },
                {
                  width: 200,
                  label: 'When',
                  dataKey: 'when',
                  flexGrow: 1,
                  formatter: dateFormatter,
                },
                {
                  width: 200,
                  label: 'Job',
                  dataKey: 'job',
                  formatter: jobFormatter,
                },
                {
                  width: 200,
                  label: 'Project',
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
            <Typography component="h1" variant="h6" noWrap>
              Invalid Entries
            </Typography>
          </Grid>
          <Grid item className={classes.scroll}>
            <VirtualizedTable
              rowCount={invalidModels.length}
              noRowsRenderer={noRowsRenderer}
              rowGetter={invalidModelsRowGetter}
              columns={[
                {
                  width: 100,
                  label: 'Type',
                  dataKey: 'type',
                },
                {
                  width: 200,
                  label: 'When',
                  dataKey: 'when',
                  flexGrow: 1,
                  formatter: dateFormatter,
                },
                {
                  width: 200,
                  label: 'Job',
                  dataKey: 'job',
                  formatter: jobFormatter,
                },
                {
                  width: 200,
                  label: 'Project',
                  dataKey: 'project',
                  formatter: projectFormatter,
                },
              ]}
            />
          </Grid>
        </>
      )}
      {!!validModels.length && (
        <Grid item>
          <Grid container justify="center">
            <FabButtonSpinner onClick={handleBulkInsert} isBusy={isBusy} disabled={isBusy}>
              <SaveIcon />
            </FabButtonSpinner>
          </Grid>
        </Grid>
      )}
    </Grid>
  );
};
