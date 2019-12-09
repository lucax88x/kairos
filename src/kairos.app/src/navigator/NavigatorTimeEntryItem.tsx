import {
  Avatar,
  ListItem,
  ListItemAvatar,
  ListItemText,
  makeStyles,
  ListItemSecondaryAction,
  IconButton,
} from '@material-ui/core';
import TimerIcon from '@material-ui/icons/Timer';
import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';
import { format } from 'date-fns';
import React, { useCallback } from 'react';
import { formatAsDateTime } from '../code/constants';
import { getTextFromEntryType } from '../models/time-entry.model';
import { TimeEntryListModel } from '../models/time-entry-list.model';
import { Themes } from '../code/variables';

const useStyles = makeStyles(theme => ({
  container: {
    borderRadius: '5px',
    backgroundColor: Themes.First.backgroundColor,
  },
}));

export interface NavigatorTimeEntryItemProps {
  entry: TimeEntryListModel;
  onEdit: (entry: TimeEntryListModel) => void;
  onDelete: (entry: TimeEntryListModel) => void;
}

export const NavigatorTimeEntryItem: React.FC<NavigatorTimeEntryItemProps> = props => {
  const classes = useStyles(props);
  const { entry, onEdit, onDelete } = props;

  const handleEdit = useCallback(() => onEdit(entry), [entry, onEdit]);
  const handleDelete = useCallback(() => onDelete(entry), [entry, onDelete]);

  return (
    <ListItem className={classes.container} onDoubleClick={handleEdit}>
      <ListItemAvatar>
        <Avatar>
          <TimerIcon />
        </Avatar>
      </ListItemAvatar>
      <ListItemText
        primary={`${getTextFromEntryType(entry.type)} - ${entry.job.name}`}
        secondary={format(entry.when, formatAsDateTime)}
      />
      <ListItemSecondaryAction>
        <IconButton edge="end" aria-label="edit" onClick={handleEdit}>
          <EditIcon />
        </IconButton>
        <IconButton edge="end" aria-label="delete" onClick={handleDelete}>
          <DeleteIcon />
        </IconButton>
      </ListItemSecondaryAction>
    </ListItem>
  );
};
