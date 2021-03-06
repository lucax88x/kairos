import { CircularProgress, Fab, makeStyles, PropTypes } from '@material-ui/core';
import React, { ReactElement } from 'react';
import './Spinner.scss';
import { PropsWithChildren } from 'react';

export interface ButtonSpinnerProps {
  isBusy: boolean;
  disabled: boolean;
  color?: PropTypes.Color;
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
  fabProgress: {
    position: 'absolute',
    justifySelf: 'center',
    alignSelf: 'center',
    zIndex: 1,
  },
}));

const FabButtonSpinner = (props: PropsWithChildren<ButtonSpinnerProps>) => {
  const classes = useStyles(props);

  const { children, disabled, isBusy, onClick, color } = props;

  return (
    <div className={classes.root}>
      <div className={classes.wrapper}>
        <Fab
          color={!!color ? color : 'primary'}
          onClick={onClick}
          disabled={isBusy || disabled}
        >
          {children as ReactElement}
        </Fab>
        {isBusy && (
          <CircularProgress
            size={68}
            className={classes.fabProgress}
            color="secondary"
          />
        )}
      </div>
    </div>
  );
};

FabButtonSpinner.defaultProps = {
  isBusy: false,
  disabled: false,
};

export default FabButtonSpinner;
