import './Spinner.scss';

import { Button, CircularProgress, makeStyles } from '@material-ui/core';
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
  root: {
    display: 'flex',
    alignItems: 'center',
  },
  wrapper: {
    position: 'relative',
  },
  buttonProgress: {
    color: green[500],
    position: 'absolute',
    top: '50%',
    left: '50%',
    marginTop: -12,
    marginLeft: -12,
  },
}));

const ButtonSpinner: React.FC<ButtonSpinnerProps> = props => {
  const classes = useStyles(props);

  const { children, disabled, isBusy, onClick } = props;

  return (
    <div className={classes.root}>
      <div className={classes.wrapper}>
        <Button variant="contained" color="primary" disabled={isBusy || disabled} onClick={onClick}>
          {children}
        </Button>
        {isBusy && <CircularProgress size={24} className={classes.buttonProgress} />}
      </div>
    </div>
  );
};

ButtonSpinner.defaultProps = {
  isBusy: false,
  disabled: false,
};

export default ButtonSpinner;
