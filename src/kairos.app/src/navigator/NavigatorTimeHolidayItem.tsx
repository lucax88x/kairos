import {
  Avatar,
  IconButton,
  ListItem,
  ListItemAvatar,
  ListItemSecondaryAction,
  ListItemText,
  makeStyles,
} from '@material-ui/core';
import BeachAccessIcon from '@material-ui/icons/BeachAccess';
import DeleteIcon from '@material-ui/icons/Delete';
import EditIcon from '@material-ui/icons/Edit';
import { format } from 'date-fns';
import React, { useCallback } from 'react';
import { formatAsDate } from '../code/constants';
import { Themes } from '../code/variables';
import { TimeHolidayEntryModel } from '../models/time-holiday-entry.model';

const useStyles = makeStyles(() => ({
  container: {
    borderRadius: '5px',
    backgroundColor: Themes.Third.backgroundColor,
  },
}));

export interface NavigatorTimeHolidayItemProps {
  holiday: TimeHolidayEntryModel;
  onEdit: (holiday: TimeHolidayEntryModel) => void;
  onDelete: (holiday: TimeHolidayEntryModel) => void;
}

export const NavigatorTimeHolidayItem: React.FC<NavigatorTimeHolidayItemProps> = props => {
  const classes = useStyles(props);
  const { holiday, onEdit, onDelete } = props;

  const handleEdit = useCallback(() => onEdit(holiday), [holiday, onEdit]);
  const handleDelete = useCallback(() => onDelete(holiday), [
    holiday,
    onDelete,
  ]);

  return (
    <ListItem className={classes.container} onDoubleClick={handleEdit}>
      <ListItemAvatar>
        <Avatar>
          <BeachAccessIcon />
        </Avatar>
      </ListItemAvatar>
      <ListItemText
        primary={holiday.description}
        secondary={format(holiday.when, formatAsDate)}
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
