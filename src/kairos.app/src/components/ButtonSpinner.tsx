import './Spinner.scss';

import { CircularProgress, Fab, makeStyles } from '@material-ui/core';
import { green } from '@material-ui/core/colors';
import React from 'react';

export interface ButtonSpinnerProps {
  isBusy: boolean;
  disabled: boolean;
  onClick: () => void;
}

const useStyles = makeStyles(theme => ({
  hasPadding: {
    padding: theme.spacing(3),
  },
  wrapper: {
    position: 'relative',
  },
  fabProgress: {
    color: green[500],
    position: 'absolute',
    top: -6,
    left: -6,
    zIndex: 1,
  },
}));

const ButtonSpinner: React.FC<ButtonSpinnerProps> = props => {
  const classes = useStyles(props);

  const { children, disabled, isBusy, onClick } = props;

  return (
    <div className={classes.wrapper}>
      <Fab color="primary" onClick={onClick} disabled={disabled}>
        {children}
      </Fab>
      {isBusy && <CircularProgress size={68} className={classes.fabProgress} />}
    </div>
  );
};

ButtonSpinner.defaultProps = {
  isBusy: false,
  disabled: false,
};

export default ButtonSpinner;
