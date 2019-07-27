import { IconButton, TableCell, TableRow } from '@material-ui/core';
import CreateIcon from '@material-ui/icons/Create';
import DeleteIcon from '@material-ui/icons/Delete';
import { format } from 'date-fns';
import React, { memo, useCallback } from 'react';

import { formatAsDate } from '../code/constants';
import { TimeAbsenceEntryModel } from '../models/time-absence-entry.model';

export interface TimeAbsenceEntryProps {
  timeAbsenceEntry: TimeAbsenceEntryModel;
  onUpdate: (timeAbsenceEntry: TimeAbsenceEntryModel) => void;
  onDelete: (timeAbsenceEntry: TimeAbsenceEntryModel) => void;
}

export const TimeAbsenceEntry: React.FC<TimeAbsenceEntryProps> = memo(props => {
  const { timeAbsenceEntry, onUpdate, onDelete } = props;

  const handleUpdate = useCallback(() => onUpdate(timeAbsenceEntry), [timeAbsenceEntry, onUpdate]);
  const handleDelete = useCallback(() => onDelete(timeAbsenceEntry), [timeAbsenceEntry, onDelete]);

  return (
    <TableRow>
      <TableCell>{format(timeAbsenceEntry.when, formatAsDate)}</TableCell>
      <TableCell>{timeAbsenceEntry.minutes}</TableCell>
      <TableCell>{timeAbsenceEntry.type}</TableCell>
      <TableCell>
        <IconButton color="inherit" aria-label="Update absence" onClick={handleUpdate}>
          <CreateIcon />
        </IconButton>
      </TableCell>
      <TableCell>
        <IconButton color="inherit" aria-label="Delete absence" onClick={handleDelete}>
          <DeleteIcon />
        </IconButton>
      </TableCell>
    </TableRow>
  );
});
