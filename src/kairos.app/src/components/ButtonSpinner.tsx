import { Button, CircularProgress, makeStyles, PropTypes } from '@material-ui/core';
import clsx from 'clsx';
import React from 'react';
import './Spinner.scss';

export interface ButtonSpinnerProps {
  isBusy: boolean;
  disabled: boolean;
  color?: PropTypes.Color;
  className?: string;
  onClick: () => void;
}

const useStyles = makeStyles(theme => ({
  hasPadding: {
    padding: theme.spacing(3),
  },
  root: {
    display: 'grid',
    alignItems: 'center',
    justifyItems: 'center',
  },
  wrapper: {
    display: 'grid',
    position: 'relative',
  },
  buttonProgress: {
    position: 'absolute',
    justifySelf: 'center',
    alignSelf: 'center',
  },
}));

const ButtonSpinner: React.FC<ButtonSpinnerProps> = props => {
  const classes = useStyles(props);

  const { children, disabled, isBusy, onClick, color, className } = props;

  return (
    <div className={clsx(classes.root, props.className)}>
      <div className={classes.wrapper}>
        <Button
          variant="contained"
          color={!!color ? color : 'primary'}
          className={className}
          disabled={isBusy || disabled}
          onClick={onClick}
        >
          {children}
        </Button>
        {isBusy && (
          <CircularProgress
            size={24}
            className={classes.buttonProgress}
            color="secondary"
          />
        )}
      </div>
    </div>
  );
};

ButtonSpinner.defaultProps = {
  isBusy: false,
  disabled: false,
};

export default ButtonSpinner;
