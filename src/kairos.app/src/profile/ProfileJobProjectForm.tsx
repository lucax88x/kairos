import DateFnsUtils from '@date-io/date-fns';
import {
  ExpansionPanel,
  ExpansionPanelDetails,
  ExpansionPanelSummary,
  Grid,
  IconButton,
  makeStyles,
  TextField,
  Typography,
} from '@material-ui/core';
import Slider from '@material-ui/core/Slider';
import DeleteIcon from '@material-ui/icons/Delete';
import { DatePicker, MaterialUiPickersDate, MuiPickersUtilsProvider } from '@material-ui/pickers';
import { endOfDay, format } from 'date-fns';
import React, { ChangeEvent, Fragment, useCallback, useEffect, useState } from 'react';

import { formatAsDate } from '../code/constants';
import { Colors } from '../code/variables';
import { JobModel } from '../models/job.model';
import { ProjectModel } from '../models/project.model';

const useStyles = makeStyles(theme => ({
  heading: {
    fontSize: theme.typography.pxToRem(15),
    flexBasis: '33.33%',
    flexShrink: 0,
  },
  secondaryHeading: {
    fontSize: theme.typography.pxToRem(15),
    color: theme.palette.text.secondary,
  },
  slider: {
    width: '100%',
  },
  secondaryPaper: {
    backgroundColor: Colors.Secondary,
  },
}));

export interface ProfileJobProjectFormInputs {
  job: JobModel;
  project: ProjectModel;
}

export interface ProfileJobProjectFormDispatches {
  onDelete: (job: JobModel, project: ProjectModel) => void;
  onNameChange: (job: JobModel, project: ProjectModel, name: string) => void;
  onStartDateChange: (job: JobModel, project: ProjectModel, date: Date) => void;
  onEndDateChange: (job: JobModel, project: ProjectModel, date: Date) => void;
}

type ProfileJobProjectFormProps = ProfileJobProjectFormInputs & ProfileJobProjectFormDispatches;

export const ProfileJobProjectForm: React.FC<ProfileJobProjectFormProps> = props => {
  const classes = useStyles(props);

  const { job, project, onDelete, onNameChange, onStartDateChange, onEndDateChange } = props;

  const handleDelete = useCallback(() => onDelete(job, project), [onDelete, job, project]);

  const handleNameChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => onNameChange(job, project, event.currentTarget.value),
    [onNameChange, job, project],
  );

  const handleStartDateChange = useCallback(
    (date: MaterialUiPickersDate) => {
      if (!!date) {
        onStartDateChange(job, project, date);
      }
    },
    [onStartDateChange, job, project],
  );

  const handleEndDateChange = useCallback(
    (date: MaterialUiPickersDate) => {
      if (!!date) {
        onEndDateChange(job, project, endOfDay(date));
      }
    },
    [onEndDateChange, job, project],
  );

  return (
    <ExpansionPanel className={classes.secondaryPaper}>
      <ExpansionPanelSummary>
        <Grid container alignItems={'center'} justify={'space-between'}>
          <Grid item>
            <Typography className={classes.heading}>
              {!!project.name ? project.name : 'Unknown'}
            </Typography>
          </Grid>
          <Grid item>
            <Typography className={classes.secondaryHeading}>
              {`${format(project.start, formatAsDate)} - ${
                !!project.end ? format(project.end, formatAsDate) : 'current'
              } - ${project.allocation}%`}
            </Typography>
          </Grid>
          <Grid item>
            <IconButton
              color="inherit"
              aria-label="Delete entry"
              onClick={handleDelete}
              disabled={job.projects.length === 1}
            >
              <DeleteIcon />
            </IconButton>
          </Grid>
        </Grid>
      </ExpansionPanelSummary>
      <ExpansionPanelDetails>
        <Grid container>
          <Grid container item alignItems={'center'} justify={'space-between'}>
            <Grid item xs={5}>
              <TextField
                fullWidth
                margin="dense"
                label="Name"
                type="text"
                value={project.name}
                onChange={handleNameChange}
              />
            </Grid>
            <Grid item xs={5}>
              <Typography gutterBottom>Allocation</Typography>
              <Slider
                className={classes.slider}
                defaultValue={100}
                valueLabelDisplay="auto"
                step={10}
                marks
                min={10}
                max={100}
                value={project.allocation}
              />
            </Grid>
          </Grid>
          <Grid container item alignItems={'center'} justify={'space-between'}>
            <MuiPickersUtilsProvider utils={DateFnsUtils}>
              <Grid item xs={5}>
                <DatePicker
                  autoOk
                  fullWidth
                  value={project.start}
                  // maxDate={end}
                  onChange={handleStartDateChange}
                  label="Start"
                />
              </Grid>
              <Grid item xs={5}>
                <DatePicker
                  autoOk
                  fullWidth
                  value={project.end}
                  // minDate={start}
                  onChange={handleEndDateChange}
                  label="End"
                />
              </Grid>
            </MuiPickersUtilsProvider>
          </Grid>
        </Grid>
      </ExpansionPanelDetails>
    </ExpansionPanel>
  );
};
