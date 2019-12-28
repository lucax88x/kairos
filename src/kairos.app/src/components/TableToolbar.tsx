import { t } from '@lingui/macro';
import { Fab } from '@material-ui/core';
import { lighten, makeStyles } from '@material-ui/core/styles';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import AddIcon from '@material-ui/icons/Add';
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
    display: 'grid',
    gridAutoFlow: 'column',
    gridGap: theme.spacing(1),
    color: theme.palette.text.secondary,
  },
  title: {
    flex: '0 0 auto',
  },
}));

export interface TableToolbarProps {
  title: string;
  numSelected: number;
  hasCreate: boolean;
  hasDelete: boolean;
  onCreate: () => void;
  onDelete: () => void;
}

export const TableToolbar: React.FC<TableToolbarProps> = props => {
  const classes = useToolbarStyles(props);
  const {
    title,
    numSelected,
    hasCreate,
    hasDelete,
    onCreate,
    onDelete,
  } = props;

  return (
    <Toolbar
      className={clsx(classes.root, {
        [classes.highlight]: numSelected > 0,
      })}
    >
      <div className={classes.title}>
        {numSelected > 0 ? (
          <Typography color="inherit" variant="subtitle1">
            {i18n._(t`${numSelected} selected`)}
          </Typography>
        ) : (
          <Typography variant="h6" id="tableTitle">
            {title}
          </Typography>
        )}
      </div>
      <div className={classes.spacer} />
      <div className={classes.actions}>
        {hasCreate && (
          <Fab color="primary" aria-label="create" onClick={onCreate}>
            <AddIcon />
          </Fab>
        )}
        {hasDelete && numSelected > 0 && (
          <Fab aria-label="delete" onClick={onDelete}>
            <DeleteIcon />
          </Fab>
        )}
      </div>
    </Toolbar>
  );
};
