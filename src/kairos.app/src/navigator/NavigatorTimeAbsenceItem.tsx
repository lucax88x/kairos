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
import WeekendIcon from '@material-ui/icons/Weekend';
import { format } from 'date-fns';
import React, { useCallback } from 'react';
import { formatAsDateTime } from '../code/constants';
import { Themes } from '../code/variables';
import { TimeAbsenceEntryListModel } from '../models/time-absence-entry-list.model';
import { getTextFromAbsenceType } from '../models/time-absence-entry.model';
import { join, filter } from 'ramda';

const useStyles = makeStyles(() => ({
  container: {
    borderRadius: '5px',
    backgroundColor: Themes.Second.backgroundColor,
  },
}));

export interface NavigatorTimeAbsenceItemProps {
  absence: TimeAbsenceEntryListModel;
  onEdit: (absence: TimeAbsenceEntryListModel) => void;
  onDelete: (absence: TimeAbsenceEntryListModel) => void;
}

export const NavigatorTimeAbsenceItem: React.FC<NavigatorTimeAbsenceItemProps> = props => {
  const classes = useStyles(props);
  const { absence, onEdit, onDelete } = props;

  const handleEdit = useCallback(() => onEdit(absence), [absence, onEdit]);
  const handleDelete = useCallback(() => onDelete(absence), [
    absence,
    onDelete,
  ]);

  return (
    <ListItem className={classes.container} onDoubleClick={handleEdit}>
      <ListItemAvatar>
        <Avatar>
          <WeekendIcon />
        </Avatar>
      </ListItemAvatar>
      <ListItemText
        primary={join(
          ', ',
          filter(t => !!t, [
            getTextFromAbsenceType(absence.type),
            absence.description,
            absence.job.name,
          ]),
        )}
        secondary={`${format(absence.start, formatAsDateTime)} - ${format(
          absence.end,
          formatAsDateTime,
        )}`}
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
