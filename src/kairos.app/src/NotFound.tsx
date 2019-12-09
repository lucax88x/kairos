import { Typography, makeStyles } from '@material-ui/core';
import React from 'react';

const useStyles = makeStyles(theme => ({
  root: {
    width: '100%',
    height: '100%',
    display: 'grid',
    alignItems: 'center',
    justifyContent: 'center',
  },
}));

export const NotFound: React.FC = props => {
  const classes = useStyles(props);

  return (
    <div className={classes.root}>
      <Typography component="h1" variant="h3" color="inherit" noWrap>
        404 - Not Found
      </Typography>
    </div>
  );
};
