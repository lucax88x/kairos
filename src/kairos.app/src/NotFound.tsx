import { makeStyles, Typography } from '@material-ui/core';
import React from 'react';
import { Link } from 'react-router-dom';
import { RouteMatcher } from './routes';

const useStyles = makeStyles(theme => ({
  root: {
    width: '100%',
    height: '100%',
    display: 'grid',
    gridGap: theme.spacing(2),
    alignItems: 'center',
    justifyContent: 'center',
    textAlign: 'center',
  },
}));

export const NotFound: React.FC = props => {
  const classes = useStyles(props);

  return (
    <div className={classes.root}>
      <Link to={RouteMatcher.RedirectDashboard}>
        <Typography component="h3" variant="h4" color="inherit" noWrap>
          Home
        </Typography>
      </Link>
      <Typography component="h1" variant="h3" color="inherit" noWrap>
        404 - Not Found
      </Typography>
    </div>
  );
};
