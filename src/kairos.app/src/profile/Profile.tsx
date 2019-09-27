import { Trans } from '@lingui/macro';
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
import { Language } from '../models/language-model';
import { ProfileModel } from '../models/profile.model';
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
  UpdateProjectAllocationAction,
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
  selectedLanguage: Language;
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

  const { selectedLanguage, user, profile, isGetBusy, isUpdateBusy, onUpdate } = props;

  const [state, dispatch] = useProfileReducer();

  const handleAddJob = useCallback(() => dispatch(AddJobAction()), []);
  const handleJobDelete = useCallback((jobId: UUID) => dispatch(DeleteJobAction(jobId)), []);
  const handleJobNameChange = useCallback(
    (jobId: UUID, name: string) => dispatch(UpdateJobNameAction(jobId, name)),
    [],
  );
  const handleJobStartDateChange = useCallback(
    (jobId: UUID, start: Date) => dispatch(UpdateJobStartDateAction(jobId, start)),
    [],
  );
  const handleJobEndDateChange = useCallback(
    (jobId: UUID, end: Date) => dispatch(UpdateJobEndDateAction(jobId, end)),
    [],
  );
  const handleJobHolidaysPerYearChange = useCallback(
    (jobId: UUID, days: number) => dispatch(UpdateJobHolidaysPerYearAction(jobId, days)),
    [],
  );
  const handleJobDayChange = useCallback(
    (jobId: UUID, day: string, hours: number) => dispatch(UpdateJobDayAction(jobId, day, hours)),
    [],
  );

  const handleAddProject = useCallback((jobId: UUID) => dispatch(AddProjectAction(jobId)), []);
  const handleProjectDelete = useCallback(
    (jobId: UUID, projectId: UUID) => dispatch(DeleteProjectAction(jobId, projectId)),
    [],
  );
  const handleProjectNameChange = useCallback(
    (jobId: UUID, projectId: UUID, name: string) =>
      dispatch(UpdateProjectNameAction(jobId, projectId, name)),
    [],
  );
  const handleProjectAllocationChange = useCallback(
    (jobId: UUID, projectId: UUID, allocation: number) =>
      dispatch(UpdateProjectAllocationAction(jobId, projectId, allocation)),
    [],
  );
  const handleProjectStartDateChange = useCallback(
    (jobId: UUID, projectId: UUID, start: Date) =>
      dispatch(UpdateProjectStartDateAction(jobId, projectId, start)),
    [],
  );
  const handleProjectEndDateChange = useCallback(
    (jobId: UUID, projectId: UUID, end: Date) =>
      dispatch(UpdateProjectEndDateAction(jobId, projectId, end)),
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
                  <Trans>Profile.JobsTitle</Trans>
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
                    selectedLanguage={selectedLanguage}
                    job={job}
                    onJobDelete={handleJobDelete}
                    onJobNameChange={handleJobNameChange}
                    onJobStartDateChange={handleJobStartDateChange}
                    onJobEndDateChange={handleJobEndDateChange}
                    onJobHolidaysPerYearChange={handleJobHolidaysPerYearChange}
                    onJobDayChange={handleJobDayChange}
                    onProjectAdd={handleAddProject}
                    onProjectDelete={handleProjectDelete}
                    onProjectAllocationChange={handleProjectAllocationChange}
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
                <Trans>Profile.NoJobsDefined</Trans>
              </Typography>
            </Paper>
          )}
        </Grid>
        <Grid item>
          <ButtonSpinner onClick={handleUpdate} isBusy={isUpdateBusy} disabled={isUpdateBusy}>
            <Trans>Buttons.Update</Trans>
          </ButtonSpinner>
        </Grid>
      </Grid>
    </Spinner>
  );
};
