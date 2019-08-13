import {
  Avatar,
  Divider,
  Grid,
  IconButton,
  makeStyles,
  Paper,
  Typography,
} from '@material-ui/core';
import AddIcon from '@material-ui/icons/Add';
import { map } from 'ramda';
import React, { Fragment, useCallback, useEffect } from 'react';

import ButtonSpinner from '../components/ButtonSpinner';
import Spinner from '../components/Spinner';
import { JobModel } from '../models/job.model';
import { ProfileModel } from '../models/profile.model';
import { ProjectModel } from '../models/project.model';
import { UserModel } from '../models/user.model';
import { UUID } from '../models/uuid.model';
import {
  AddJobAction,
  AddProjectAction,
  DeleteJobAction,
  DeleteProjectAction,
  InitializeJobsAction,
  UpdateJobDayAction,
  UpdateJobEndDateAction,
  UpdateJobHolidaysPerYearAction,
  UpdateJobNameAction,
  UpdateJobStartDateAction,
  UpdateProjectEndDateAction,
  UpdateProjectNameAction,
  UpdateProjectStartDateAction,
  useProfileReducer,
} from './Profile.store';
import { ProfileJobForm } from './ProfileJobForm';

const useStyles = makeStyles(theme => ({
  paper: { padding: theme.spacing(2, 3) },
}));

export interface ProfileInputs {
  user: UserModel;
  profile: ProfileModel;
  isGetBusy: boolean;
  isUpdateBusy: boolean;
}

export interface ProfileDispatches {
  onUpdate: (model: ProfileModel) => void;
}

type ProfileProps = ProfileInputs & ProfileDispatches;

export const ProfileComponent: React.FC<ProfileProps> = props => {
  const classes = useStyles(props);

  const { profile, isGetBusy, isUpdateBusy, onUpdate, user } = props;

  const [state, dispatch] = useProfileReducer();

  const handleAddJob = useCallback(() => dispatch(AddJobAction()), []);
  const handleJobDelete = useCallback((job: JobModel) => dispatch(DeleteJobAction(job)), []);
  const handleJobNameChange = useCallback(
    (job: JobModel, name: string) => dispatch(UpdateJobNameAction(job, name)),
    [],
  );
  const handleJobStartDateChange = useCallback(
    (job: JobModel, start: Date) => dispatch(UpdateJobStartDateAction(job, start)),
    [],
  );
  const handleJobEndDateChange = useCallback(
    (job: JobModel, end: Date) => dispatch(UpdateJobEndDateAction(job, end)),
    [],
  );
  const handleJobHolidaysPerYearChange = useCallback(
    (job: JobModel, days: number) => dispatch(UpdateJobHolidaysPerYearAction(job, days)),
    [],
  );
  const handleJobDayChange = useCallback(
    (job: JobModel, day: string, hours: number) => dispatch(UpdateJobDayAction(job, day, hours)),
    [],
  );

  const handleAddProject = useCallback((job: JobModel) => dispatch(AddProjectAction(job)), []);
  const handleProjectDelete = useCallback(
    (job: JobModel, project: ProjectModel) => dispatch(DeleteProjectAction(job, project)),
    [],
  );
  const handleProjectNameChange = useCallback(
    (job: JobModel, project: ProjectModel, name: string) =>
      dispatch(UpdateProjectNameAction(job, project, name)),
    [],
  );
  const handleProjectStartDateChange = useCallback(
    (job: JobModel, project: ProjectModel, start: Date) =>
      dispatch(UpdateProjectStartDateAction(job, project, start)),
    [],
  );
  const handleProjectEndDateChange = useCallback(
    (job: JobModel, project: ProjectModel, end: Date) =>
      dispatch(UpdateProjectEndDateAction(job, project, end)),
    [],
  );

  const handleUpdate = useCallback(() => {
    onUpdate(new ProfileModel(UUID.Generate(), state.jobs));
  }, [onUpdate, state.jobs]);

  useEffect(() => {
    dispatch(InitializeJobsAction(profile.jobs));
  }, [profile]);

  return (
    <Spinner show={isGetBusy || isUpdateBusy}>
      <Grid container spacing={3} direction="column">
        <Grid item>
          <Paper className={classes.paper}>
            <Grid container alignItems="center" spacing={2}>
              <Grid item>
                <Avatar alt={user.given_name} src={user.picture} />
              </Grid>
              <Grid item>
                <Typography component="h1" variant="h6" color="inherit" noWrap>
                  {user.name}
                </Typography>
              </Grid>
            </Grid>
          </Paper>
        </Grid>
        <Grid item>
          <Paper className={classes.paper}>
            <Grid container justify="space-between" alignItems="center">
              <Grid item>
                <Typography color="inherit" noWrap display="inline">
                  Jobs
                </Typography>
              </Grid>
              <Grid item>
                <IconButton onClick={handleAddJob}>
                  <AddIcon />
                </IconButton>
              </Grid>
            </Grid>
          </Paper>
          {!!state.jobs.length ? (
            map(
              job => (
                <Fragment key={job.id.toString()}>
                  <ProfileJobForm
                    job={job}
                    onJobDelete={handleJobDelete}
                    onJobNameChange={handleJobNameChange}
                    onJobStartDateChange={handleJobStartDateChange}
                    onJobEndDateChange={handleJobEndDateChange}
                    onJobHolidaysPerYearChange={handleJobHolidaysPerYearChange}
                    onJobDayChange={handleJobDayChange}
                    onProjectAdd={handleAddProject}
                    onProjectDelete={handleProjectDelete}
                    onProjectNameChange={handleProjectNameChange}
                    onProjectStartDateChange={handleProjectStartDateChange}
                    onProjectEndDateChange={handleProjectEndDateChange}
                  />
                  <Divider />
                </Fragment>
              ),
              state.jobs,
            )
          ) : (
            <Paper className={classes.paper}>
              <Typography color="inherit" noWrap display="inline">
                No Jobs defined
              </Typography>
            </Paper>
          )}
        </Grid>
        <Grid item>
          <ButtonSpinner onClick={handleUpdate} isBusy={isUpdateBusy} disabled={isUpdateBusy}>
            Update
          </ButtonSpinner>
        </Grid>
      </Grid>
    </Spinner>
  );
};
