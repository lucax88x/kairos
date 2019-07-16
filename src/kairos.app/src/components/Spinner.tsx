import './Spinner.scss';

import clsx from 'clsx';
import React from 'react';

import { SpinnerIcon } from './SpinnerIcon';
import { makeStyles } from '@material-ui/styles';

export interface SpinnerProps {
  show: boolean;
}

const useStyles = makeStyles(theme => ({
  container: {
    width: '100%',
    height: '100%',
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
    left: 'calc(50% - 60px)',
    top: 'calc(50% - 60px)',
  },
}));

const Spinner: React.FC<SpinnerProps> = props => {
  const classes = useStyles(props);

  const { children, show } = props;

  return (
    <div className={classes.container}>
      <div className={clsx(classes.blocker, show && classes.hasSpinner)}>{children}</div>
      {show && (
        <div className={classes.spinner}>
          <SpinnerIcon />
        </div>
      )}
    </div>
  );
};

Spinner.defaultProps = {
  show: false,
};

export default Spinner;
