import IconButton from '@material-ui/core/IconButton';
import { lighten, makeStyles } from '@material-ui/core/styles';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import DeleteIcon from '@material-ui/icons/Delete';
import clsx from 'clsx';
import React from 'react';
import { i18n } from '../i18nLoader';

const useToolbarStyles = makeStyles(theme => ({
  root: {
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(1),
  },
  highlight:
    theme.palette.type === 'light'
      ? {
          color: theme.palette.secondary.main,
          backgroundColor: lighten(theme.palette.secondary.light, 0.85),
        }
      : {
          color: theme.palette.text.primary,
          backgroundColor: theme.palette.secondary.dark,
        },
  spacer: {
    flex: '1 1 100%',
  },
  actions: {
    color: theme.palette.text.secondary,
  },
  title: {
    flex: '0 0 auto',
  },
}));

export interface TableToolbarProps {
  title: string;
  numSelected: number;
  onDelete: () => void;
}

export const TableToolbar: React.FC<TableToolbarProps> = props => {
  const classes = useToolbarStyles(props);
  const { title, numSelected, onDelete } = props;

  return (
    <Toolbar
      className={clsx(classes.root, {
        [classes.highlight]: numSelected > 0,
      })}
    >
      <div className={classes.title}>
        {numSelected > 0 ? (
          <Typography color="inherit" variant="subtitle1">
            {i18n._('{selected} selected', { selected: numSelected })}
          </Typography>
        ) : (
          <Typography variant="h6" id="tableTitle">
            {title}
          </Typography>
        )}
      </div>
      <div className={classes.spacer} />
      <div className={classes.actions}>
        {numSelected > 0 && (
          <IconButton aria-label="delete" onClick={onDelete}>
            <DeleteIcon />
          </IconButton>
        )}
      </div>
    </Toolbar>
  );
};
