import DateFnsUtils from '@date-io/date-fns';
import {
  Divider,
  ExpansionPanel,
  ExpansionPanelDetails,
  ExpansionPanelSummary,
  Grid,
  IconButton,
  makeStyles,
  TextField,
  Typography,
} from '@material-ui/core';
import AddIcon from '@material-ui/icons/Add';
import BuildIcon from '@material-ui/icons/Build';
import DeleteIcon from '@material-ui/icons/Delete';
import { DatePicker, MaterialUiPickersDate, MuiPickersUtilsProvider } from '@material-ui/pickers';
import { endOfDay, format } from 'date-fns';
import { map } from 'ramda';
import React, { ChangeEvent, Fragment, useCallback, useEffect, useState } from 'react';

import { formatAsDate } from '../code/constants';
import { Colors } from '../code/variables';
import { JobModel } from '../models/job.model';
import { ProjectModel } from '../models/project.model';
import { ProfileJobProjectForm } from './ProfileJobProjectForm';

const useStyles = makeStyles(theme => ({
  paper: { padding: theme.spacing(3) },
  heading: {
    fontSize: theme.typography.pxToRem(15),
    flexBasis: '33.33%',
    flexShrink: 0,
  },
  secondaryHeading: {
    fontSize: theme.typography.pxToRem(15),
    color: theme.palette.text.secondary,
  },
  secondaryPaper: {
    backgroundColor: Colors.Secondary,
    padding: theme.spacing(2, 3),
  },
}));

export interface ProfileJobFormInputs {
  job: JobModel;
}

export interface ProfileJobFormDispatches {
  onJobDelete: (job: JobModel) => void;
  onJobNameChange: (job: JobModel, name: string) => void;
  onJobStartDateChange: (job: JobModel, date: Date) => void;
  onJobEndDateChange: (job: JobModel, date: Date) => void;
  onJobHolidaysPerYearChange: (job: JobModel, days: number) => void;
  onJobDayChange: (job: JobModel, day: string, hours: number) => void;

  onProjectAdd: (job: JobModel) => void;
  onProjectDelete: (job: JobModel, project: ProjectModel) => void;
  onProjectNameChange: (job: JobModel, project: ProjectModel, name: string) => void;
  onProjectStartDateChange: (job: JobModel, project: ProjectModel, date: Date) => void;
  onProjectEndDateChange: (job: JobModel, project: ProjectModel, date: Date) => void;
}

type ProfileJobFormProps = ProfileJobFormInputs & ProfileJobFormDispatches;

export const ProfileJobForm: React.FC<ProfileJobFormProps> = props => {
  const classes = useStyles(props);

  const {
    job,
    onJobDelete,
    onJobNameChange,
    onJobStartDateChange,
    onJobEndDateChange,
    onJobHolidaysPerYearChange,
    onJobDayChange,

    onProjectAdd,
    onProjectDelete,
    onProjectNameChange,
    onProjectStartDateChange,
    onProjectEndDateChange,
  } = props;

  const handleJobDelete = useCallback(() => onJobDelete(job), [onJobDelete]);

  const handleJobNameChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => onJobNameChange(job, event.currentTarget.value),
    [onJobNameChange, job],
  );

  const handleJobStartDateChange = useCallback(
    (date: MaterialUiPickersDate) => {
      if (!!date) {
        onJobStartDateChange(job, date);
      }
    },
    [onJobStartDateChange, job],
  );

  const handleJobEndDateChange = useCallback(
    (date: MaterialUiPickersDate) => {
      if (!!date) {
        onJobEndDateChange(job, endOfDay(date));
      }
    },
    [onJobEndDateChange, job],
  );

  const handleHolidaysPerYear = useCallback(
    (event: ChangeEvent<HTMLInputElement>) =>
      onJobHolidaysPerYearChange(job, event.currentTarget.valueAsNumber),
    [onJobHolidaysPerYearChange, job],
  );

  const handleJobDayChange = useCallback(
    (day: string) => (event: ChangeEvent<HTMLInputElement>) =>
      onJobDayChange(job, day, event.currentTarget.valueAsNumber),
    [onJobDayChange, job],
  );

  const handleMondayChange = useCallback(handleJobDayChange('monday'), [handleJobDayChange]);
  const handleTuesdayChange = useCallback(handleJobDayChange('tuesday'), [handleJobDayChange]);
  const handleWednesdayChange = useCallback(handleJobDayChange('wednesday'), [handleJobDayChange]);
  const handleThursdayChange = useCallback(handleJobDayChange('thursday'), [handleJobDayChange]);
  const handleFridayChange = useCallback(handleJobDayChange('friday'), [handleJobDayChange]);
  const handleSaturdayChange = useCallback(handleJobDayChange('saturday'), [handleJobDayChange]);
  const handleSundayChange = useCallback(handleJobDayChange('sunday'), [handleJobDayChange]);

  const handleProjectAdd = useCallback(() => onProjectAdd(job), [onProjectAdd, job]);

  return (
    <ExpansionPanel>
      <ExpansionPanelSummary>
        <Grid container alignItems={'center'} justify={'space-between'}>
          <Grid item>
            <Typography className={classes.heading}>
              {!!job.name ? job.name : 'Unknown'}
            </Typography>
          </Grid>
          <Grid item>
            <Typography className={classes.secondaryHeading}>
              {`${format(job.start, formatAsDate)} - ${
                !!job.end ? format(job.end, formatAsDate) : 'current'
              }`}
            </Typography>
          </Grid>
          <Grid item>
            <IconButton color="inherit" aria-label="Delete entry" onClick={handleJobDelete}>
              <DeleteIcon />
            </IconButton>
          </Grid>
        </Grid>
      </ExpansionPanelSummary>
      <ExpansionPanelDetails>
        <Grid container direction="column" spacing={3}>
          <Grid container item>
            <Grid container item alignItems={'center'} justify={'space-between'} spacing={2}>
              <Grid item xs={3}>
                <TextField
                  margin="dense"
                  fullWidth
                  label="Name"
                  type="text"
                  value={job.name}
                  onChange={handleJobNameChange}
                />
              </Grid>
              <MuiPickersUtilsProvider utils={DateFnsUtils}>
                <Grid item xs={3}>
                  <DatePicker
                    autoOk
                    fullWidth
                    value={job.start}
                    // maxDate={end}
                    onChange={handleJobStartDateChange}
                    label="Start"
                  />
                </Grid>
                <Grid item xs={3}>
                  <DatePicker
                    autoOk
                    fullWidth
                    value={job.end}
                    // minDate={start}
                    onChange={handleJobEndDateChange}
                    label="End"
                  />
                </Grid>
              </MuiPickersUtilsProvider>
              <Grid item xs={3}>
                <TextField
                  margin="dense"
                  fullWidth
                  label="Holidays (days per year)"
                  inputProps={{ min: 0, max: 365, step: 1 }}
                  type="number"
                  value={job.holidaysPerYear}
                  onChange={handleHolidaysPerYear}
                />
              </Grid>
            </Grid>
            <Grid container item alignItems={'center'} justify={'space-between'}>
              <Grid item>
                <TextField
                  label="Monday"
                  inputProps={{ min: 0, max: 23.59, step: 0.1 }}
                  type="number"
                  value={job.monday}
                  onChange={handleMondayChange}
                />
              </Grid>
              <Grid item>
                <TextField
                  margin="dense"
                  label="Tuesday"
                  inputProps={{ min: 0, max: 23.59, step: 0.1 }}
                  type="number"
                  value={job.tuesday}
                  onChange={handleTuesdayChange}
                />
              </Grid>
              <Grid item>
                <TextField
                  margin="dense"
                  label="Wednesday"
                  inputProps={{ min: 0, max: 23.59, step: 0.1 }}
                  type="number"
                  value={job.wednesday}
                  onChange={handleWednesdayChange}
                />
              </Grid>
              <Grid item>
                <TextField
                  margin="dense"
                  label="Thursday"
                  inputProps={{ min: 0, max: 23.59, step: 0.1 }}
                  type="number"
                  value={job.thursday}
                  onChange={handleThursdayChange}
                />
              </Grid>
              <Grid item>
                <TextField
                  margin="dense"
                  label="Friday"
                  inputProps={{ min: 0, max: 23.59, step: 0.1 }}
                  type="number"
                  value={job.friday}
                  onChange={handleFridayChange}
                />
              </Grid>
              <Grid item>
                <TextField
                  margin="dense"
                  label="Saturday"
                  inputProps={{ min: 0, max: 23.59, step: 0.1 }}
                  type="number"
                  value={job.saturday}
                  onChange={handleSaturdayChange}
                />
              </Grid>
              <Grid item>
                <TextField
                  margin="dense"
                  label="Sunday"
                  inputProps={{ min: 0, max: 23.59, step: 0.1 }}
                  type="number"
                  value={job.sunday}
                  onChange={handleSundayChange}
                />
              </Grid>
            </Grid>
          </Grid>

          <Grid item>
            <Divider />
          </Grid>

          <Grid item>
            <Grid
              container
              justify="space-between"
              alignItems="center"
              className={classes.secondaryPaper}
            >
              <Grid item>
                <Typography color="inherit" noWrap display="inline">
                  Projects
                </Typography>
              </Grid>

              <Grid item>
                <IconButton onClick={handleProjectAdd}>
                  <AddIcon />
                </IconButton>
              </Grid>
            </Grid>
            {map(
              project => (
                <Fragment key={project.id.toString()}>
                  <ProfileJobProjectForm
                    job={job}
                    project={project}
                    onDelete={onProjectDelete}
                    onNameChange={onProjectNameChange}
                    onStartDateChange={onProjectStartDateChange}
                    onEndDateChange={onProjectEndDateChange}
                  />
                  <Divider />
                </Fragment>
              ),
              job.projects,
            )}
          </Grid>
        </Grid>
      </ExpansionPanelDetails>
    </ExpansionPanel>
  );
};
