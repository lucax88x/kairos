import { Table, TableBody, TableCell, TableHead, TableRow, Typography } from '@material-ui/core';
import { map } from 'ramda';
import React, { memo, useCallback } from 'react';

import Spinner from '../components/Spinner';
import { TimeEntryModel } from '../models/time-entry.model';
import { TimeEntry } from './TimeEntry';

const modelToCells = (
  onUpdate: (item: TimeEntryModel) => void,
  onDelete: (item: TimeEntryModel) => void,
) =>
  map<TimeEntryModel, JSX.Element>(model => (
    <TimeEntry key={model.id.value} timeEntry={model} onUpdate={onUpdate} onDelete={onDelete} />
  ));

export interface TimeEntriesInputs {
  timeEntries: TimeEntryModel[];
  isGetTimeEntriesBusy: boolean;
  isDeleteTimeEntryBusy: boolean;
}

export interface TimeEntriesDispatches {
  onUpdate: (item: TimeEntryModel) => void;
  onDelete: (item: TimeEntryModel) => void;
}

type TimeEntriesProps = TimeEntriesInputs & TimeEntriesDispatches;

export const TimeEntriesComponent: React.FC<TimeEntriesProps> = memo(props => {
  const { timeEntries, isGetTimeEntriesBusy, isDeleteTimeEntryBusy, onUpdate, onDelete } = props;

  const handleUpdate = useCallback((model: TimeEntryModel) => onUpdate(model), [onUpdate]);
  const handleDelete = useCallback((model: TimeEntryModel) => onDelete(model), [onDelete]);

  return (
    <Spinner show={isGetTimeEntriesBusy || isDeleteTimeEntryBusy}>
      <Typography component="h2" variant="h6" color="primary" gutterBottom>
        Time Entries
      </Typography>
      <Table>
        <colgroup>
          <col width="45%" />
          <col width="35%" />
          <col width="10%" />
          <col width="10%" />
        </colgroup>
        <TableHead>
          <TableRow>
            <TableCell>When</TableCell>
            <TableCell>Type</TableCell>
            <TableCell />
            <TableCell />
          </TableRow>
        </TableHead>
        <TableBody>
          {!!timeEntries && !!timeEntries.length ? (
            modelToCells(handleUpdate, handleDelete)(timeEntries)
          ) : (
            <TableRow>
              <TableCell colSpan={4}>No time entries</TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </Spinner>
  );
});
