import { Trans } from '@lingui/macro';
import {
  Button,
  Container,
  Divider,
  makeStyles,
  Typography,
} from '@material-ui/core';
import React from 'react';
import { ReactComponent as LogoIcon } from '../assets/images/logo.svg';

const useStyles = makeStyles(theme => ({
  container: {
    marginTop: theme.spacing(4),
    display: 'grid',
    gridAutoFlow: 'row',
  },
  title: {
    display: 'grid',
    alignItems: 'center',
    justifyItems: 'center',
    padding: theme.spacing(3),
  },
  logo: {
    width: 100,
  },
  text: {
    padding: theme.spacing(3),
  },
  button: {
    display: 'grid',
    gridAutoFlow: 'row',
    alignItems: 'center',
    justifyItems: 'center',
    padding: theme.spacing(3),
  },
}));

export interface LoginInputs {
  isOnline: boolean;
}

export interface LoginDispatches {
  onLogin: () => void;
}

type LoginProps = LoginInputs & LoginDispatches;

export const LoginFormComponent: React.FC<LoginProps> = props => {
  const classes = useStyles(props);

  const { isOnline, onLogin } = props;

  return (
    <Container component="main" maxWidth="lg">
      <div className={classes.container}>
        <div className={classes.title}>
          <LogoIcon className={classes.logo} />
          <Typography component="h1" variant="h6" color="inherit">
            kairos
          </Typography>
        </div>
        <Divider></Divider>
        <div className={classes.text}>
          <Typography component="h1" variant="h6" color="inherit">
            <Trans>Kairos is a free time-tracking system. It has been built by myself as tool to be used every day in a quick way to track time, absences and holidays. The goal is to have a clear visualization of how many we have worked, how many vacations we are missing and how many extra-time hours we need to compensate.</Trans>
          </Typography>
        </div>
        <Divider></Divider>
        <div className={classes.button}>
          {isOnline ? (
            <Button variant="contained" color="primary" onClick={onLogin}>
              <Trans>Sign in</Trans>
            </Button>
          ) : (
            <Trans>You need to be online in order to sign in.</Trans>
          )}
        </div>
      </div>
    </Container>
  );
};
