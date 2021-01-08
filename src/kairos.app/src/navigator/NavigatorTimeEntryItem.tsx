import {
  Avatar,
  IconButton,
  ListItem,
  ListItemAvatar,
  ListItemSecondaryAction,
  ListItemText,
  makeStyles,
} from '@material-ui/core';
import DeleteIcon from '@material-ui/icons/Delete';
import EditIcon from '@material-ui/icons/Edit';
import { format } from 'date-fns';
import React, { useCallback } from 'react';
import { formatAsDateTime } from '../code/constants';
import { Themes } from '../code/variables';
import { TimeEntryListModel } from '../models/time-entry-list.model';
import {
  getIconFromEntryType,
  getTextFromEntryType,
} from '../models/time-entry.model';

const useStyles = makeStyles(() => ({
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
        <Avatar>{getIconFromEntryType(entry.type)}</Avatar>
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
