import { Table, TableBody, TableCell, TableHead, TableRow, Typography } from '@material-ui/core';
import { map } from 'ramda';
import React, { memo } from 'react';

import Spinner from '../components/Spinner';
import { TimeEntryModel } from '../models/time-entry.model';
import { TimeEntry } from './TimeEntry';

const modelToCells = map<TimeEntryModel, JSX.Element>(model => (
  <TimeEntry key={model.id.value} timeEntry={model} />
));

export interface TimeEntriesInputs {
  timeEntries: TimeEntryModel[];
  isBusy: boolean;
}

export const TimeEntriesComponent: React.FC<TimeEntriesInputs> = memo(props => {
  const { timeEntries, isBusy } = props;

  return (
    <Spinner show={isBusy}>
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
    </Spinner>
  );
});
