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
            <Trans>
              Kairos is a free time-tracking tools done by a developer for
              developers. It is a pretty simple and straightforward tool.
            </Trans>
            <br />
            <br />
            <Trans>It helps you on:</Trans>
            <br />
            <ul>
              <li>
                <Trans>tracking in&out during your work days</Trans>
              </li>
              <li>
                <Trans>tracking your absences</Trans>
              </li>
              <li>
                <Trans>report & export</Trans>
              </li>
            </ul>
            <br />
            <Trans>
              Thanks to this and some other informations it's easy to calculate
              your extra-times, vacation, holidays, illness, etc.
            </Trans>
            <br />
            <br />
            <strong>
              <Trans>
                It's a PWA, it means it can be also installed on your pc, on your
                smartphone and also works offline.
              </Trans>
            </strong>
            <br />
            <br />
            <Trans>
              Feel free to request for new bugfixes / features with any link in the footer.
            </Trans>
            <br />
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
