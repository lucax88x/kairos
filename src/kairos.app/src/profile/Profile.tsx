import { Trans } from '@lingui/macro';
import { Avatar, Divider, IconButton, makeStyles, Paper, Typography } from '@material-ui/core';
import AddIcon from '@material-ui/icons/Add';
import SaveIcon from '@material-ui/icons/Save';
import clsx from 'clsx';
import { map } from 'ramda';
import React, { Fragment, useCallback, useEffect } from 'react';
import ButtonSpinner from '../components/ButtonSpinner';
import Spinner from '../components/Spinner';
import { Language } from '../models/language-model';
import { ProfileModel } from '../models/profile.model';
import { UserModel } from '../models/user.model';
import { UUID } from '../models/uuid.model';
import { AddJobAction, DeleteJobAction, InitializeJobsAction, UpdateJobDayAction, UpdateJobEndDateAction, UpdateJobHolidaysPerYearAction, UpdateJobNameAction, UpdateJobStartDateAction, useProfileReducer } from './Profile.store';
import { ProfileJobForm } from './ProfileJobForm';

const useStyles = makeStyles(theme => ({
  rows: {
    display: 'grid',
    gridGap: theme.spacing(1),
    alignItems: 'center',
  },
  columns: {
    display: 'grid',
    gridAutoFlow: 'column',
    gridGap: theme.spacing(1),
    justifyContent: 'left',
    alignItems: 'center',
  },
  noGap: {
    gridGap: 0,
  },
  between: {
    justifyContent: 'space-between',
  },
  selfCenter: {
    justifySelf: 'center',
  },
  paper: {
    padding: theme.spacing(2, 3),
  },
  marginLeft: {
    marginLeft: theme.spacing(1),
  },
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

  const handleAddJob = useCallback(() => dispatch(AddJobAction()), [dispatch]);
  const handleJobDelete = useCallback((jobId: UUID) => dispatch(DeleteJobAction(jobId)), [
    dispatch,
  ]);
  const handleJobNameChange = useCallback(
    (jobId: UUID, name: string) => dispatch(UpdateJobNameAction(jobId, name)),
    [dispatch],
  );
  const handleJobStartDateChange = useCallback(
    (jobId: UUID, start: Date) => dispatch(UpdateJobStartDateAction(jobId, start)),
    [dispatch],
  );
  const handleJobEndDateChange = useCallback(
    (jobId: UUID, end: Date) => dispatch(UpdateJobEndDateAction(jobId, end)),
    [dispatch],
  );
  const handleJobHolidaysPerYearChange = useCallback(
    (jobId: UUID, days: number) => dispatch(UpdateJobHolidaysPerYearAction(jobId, days)),
    [dispatch],
  );
  const handleJobDayChange = useCallback(
    (jobId: UUID, day: string, hours: number) => dispatch(UpdateJobDayAction(jobId, day, hours)),
    [dispatch],
  );

  const handleUpdate = useCallback(() => onUpdate(new ProfileModel(UUID.Generate(), state.jobs)), [
    onUpdate,
    state.jobs,
  ]);

  useEffect(() => {
    dispatch(InitializeJobsAction(profile.jobs));
  }, [dispatch, profile]);

  return (
    <Spinner show={isGetBusy || isUpdateBusy}>
      <div className={classes.rows}>
        <Paper className={classes.paper}>
          <div className={classes.columns}>
            <Avatar alt={user.given_name} src={user.picture} />
            <Typography component="h1" variant="h6" color="inherit" noWrap>
              {user.name}
            </Typography>
          </div>
        </Paper>
        <Paper className={classes.paper}>
          <div className={clsx(classes.columns, classes.between)}>
            <Typography color="inherit" noWrap display="inline">
              <Trans>Profile.JobsTitle</Trans>
            </Typography>
            <IconButton onClick={handleAddJob}>
              <AddIcon />
            </IconButton>
          </div>
        </Paper>

        <div className={clsx(classes.rows, classes.noGap)}>
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
        </div>

        <ButtonSpinner onClick={handleUpdate} isBusy={isUpdateBusy} disabled={isUpdateBusy}>
          <Trans>Buttons.Update</Trans>
          <SaveIcon className={classes.marginLeft} />
        </ButtonSpinner>
      </div>
    </Spinner>
  );
};
