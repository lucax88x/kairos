import { TableCell, TableRow } from '@material-ui/core';
import { format } from 'date-fns';
import React, { memo } from 'react';

import { formatAsDate } from '../code/constants';
import { TimeEntryModel } from '../models/time-entry.model';

export interface TimeEntryProps {
  timeEntry: TimeEntryModel;
}

export const TimeEntry: React.FC<TimeEntryProps> = memo(props => {
  const { timeEntry } = props;

  return (
    <TableRow>
      <TableCell>{format(timeEntry.when, formatAsDate)}</TableCell>
      <TableCell>{timeEntry.type}</TableCell>
    </TableRow>
  );
});
