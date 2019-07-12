import { Table, TableBody, TableCell, TableHead, TableRow, Typography } from '@material-ui/core';
import { map } from 'ramda';
import React from 'react';
import { formatAsDate } from '../code/constants';

import { TimeEntryModel } from '../models/time-entry.model';
import { format } from 'date-fns';

const modelToCells = map<TimeEntryModel, JSX.Element>(model => (
  <TableRow key={model.id.value}>
    <TableCell>{format(model.when, formatAsDate)}</TableCell>
    <TableCell>{model.type}</TableCell>
  </TableRow>
));

export interface TimeEntriesInputs {
  timeEntries: TimeEntryModel[];
}

export const TimeEntriesComponent: React.FC<TimeEntriesInputs> = ({ timeEntries }) => {
  return (
    <React.Fragment>
      <Typography component="h2" variant="h6" color="primary" gutterBottom>
        Time Entries
      </Typography>
      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell>When</TableCell>
            <TableCell>Type</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>{modelToCells(timeEntries)}</TableBody>
      </Table>
    </React.Fragment>
  );
};
