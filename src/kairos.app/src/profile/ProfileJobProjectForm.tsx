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
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import { DatePicker, MaterialUiPickersDate, MuiPickersUtilsProvider } from '@material-ui/pickers';
import { endOfDay, format } from 'date-fns';
import React, { ChangeEvent, useCallback } from 'react';
import { formatAsDate } from '../code/constants';
import { isNumber } from '../code/is';
import { Themes } from '../code/variables';
import { JobModel } from '../models/job.model';
import { ProjectModel } from '../models/project.model';
import { UUID } from '../models/uuid.model';

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
    backgroundColor: Themes.Second.backgroundColor,
    color: Themes.Second.color,
  },
}));

export interface ProfileJobProjectFormInputs {
  job: JobModel;
  project: ProjectModel;
}

export interface ProfileJobProjectFormDispatches {
  onDelete: (jobId: UUID, project: UUID) => void;
  onNameChange: (jobId: UUID, project: UUID, name: string) => void;
  onAllocationChange: (jobId: UUID, project: UUID, allocation: number) => void;
  onStartDateChange: (jobId: UUID, project: UUID, date: Date) => void;
  onEndDateChange: (jobId: UUID, project: UUID, date: Date) => void;
}

type ProfileJobProjectFormProps = ProfileJobProjectFormInputs & ProfileJobProjectFormDispatches;

export const ProfileJobProjectForm: React.FC<ProfileJobProjectFormProps> = props => {
  const classes = useStyles(props);

  const {
    job,
    project,
    onDelete,
    onNameChange,
    onAllocationChange,
    onStartDateChange,
    onEndDateChange,
  } = props;

  const handleDelete = useCallback(() => onDelete(job.id, project.id), [onDelete, job, project]);

  const handleNameChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>) =>
      onNameChange(job.id, project.id, event.currentTarget.value),
    [onNameChange, job, project],
  );

  const handleAllocationChange = useCallback(
    (_, val: number | number[]) => {
      if (isNumber(val)) {
        onAllocationChange(job.id, project.id, val);
      }
    },
    [onAllocationChange, job, project],
  );

  const handleStartDateChange = useCallback(
    (date: MaterialUiPickersDate) => {
      if (!!date) {
        onStartDateChange(job.id, project.id, date);
      }
    },
    [onStartDateChange, job, project],
  );

  const handleEndDateChange = useCallback(
    (date: MaterialUiPickersDate) => {
      if (!!date) {
        onEndDateChange(job.id, project.id, endOfDay(date));
      }
    },
    [onEndDateChange, job, project],
  );

  return (
    <ExpansionPanel className={classes.secondaryPaper}>
      <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
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
                onChange={handleAllocationChange}
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
