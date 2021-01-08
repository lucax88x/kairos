import { CircularProgress } from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';
import clsx from 'clsx';
import React from 'react';
import './Spinner.scss';

export interface SpinnerProps {
  show: boolean;
}

const useStyles = makeStyles(() => ({
  container: {
    width: '100%',
    height: '100%',
    display: 'grid',
    position: 'relative',
  },
  blocker: {
    width: '100%',
    height: '100%',
  },
  hasSpinner: {
    cursor: 'wait',
    animation: 'blurry 0.5s forwards',
    '& > *': {
      pointerEvents: 'none',
    },
  },
  spinner: {
    cursor: 'wait',
    position: 'absolute',
    justifySelf: 'center',
    alignSelf: 'center',
  },
}));

const Spinner: React.FC<SpinnerProps> = props => {
  const classes = useStyles(props);

  const { children, show } = props;

  return (
    <div className={classes.container}>
      <div className={clsx(classes.blocker, show && classes.hasSpinner)}>
        {children}
      </div>
      {show && (
        <div className={classes.spinner}>
          <CircularProgress color="secondary" />
        </div>
      )}
    </div>
  );
};

Spinner.defaultProps = {
  show: false,
};

export default Spinner;
