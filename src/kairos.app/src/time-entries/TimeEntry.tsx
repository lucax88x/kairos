import { IconButton, TableCell, TableRow } from '@material-ui/core';
import CreateIcon from '@material-ui/icons/Create';
import DeleteIcon from '@material-ui/icons/Delete';
import { format } from 'date-fns';
import React, { memo, useCallback } from 'react';

import { formatAsDateTime } from '../code/constants';
import { TimeEntryModel } from '../models/time-entry.model';

export interface TimeEntryProps {
  timeEntry: TimeEntryModel;
  onUpdate: (timeEntry: TimeEntryModel) => void;
  onDelete: (timeEntry: TimeEntryModel) => void;
}

export const TimeEntry: React.FC<TimeEntryProps> = memo(props => {
  const { timeEntry, onUpdate, onDelete } = props;

  const handleUpdate = useCallback(() => onUpdate(timeEntry), [timeEntry, onUpdate]);
  const handleDelete = useCallback(() => onDelete(timeEntry), [timeEntry, onDelete]);

  return (
    <TableRow>
      <TableCell>{format(timeEntry.when, formatAsDateTime)}</TableCell>
      <TableCell>{timeEntry.type}</TableCell>
      <TableCell>
        <IconButton color="inherit" aria-label="Update entry" onClick={handleUpdate}>
          <CreateIcon />
        </IconButton>
      </TableCell>
      <TableCell>
        <IconButton color="inherit" aria-label="Delete entry" onClick={handleDelete}>
          <DeleteIcon />
        </IconButton>
      </TableCell>
    </TableRow>
  );
});
