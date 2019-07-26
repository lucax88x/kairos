import { Table, TableBody, TableCell, TableHead, TableRow, Typography } from '@material-ui/core';
import { map } from 'ramda';
import React, { memo, useCallback } from 'react';

import Spinner from '../components/Spinner';
import { TimeAbsenceEntryModel } from '../models/time-absence-entry.model';
import { TimeAbsenceEntry } from './TimeAbsenceEntry';

const modelToCells = (
  onUpdate: (item: TimeAbsenceEntryModel) => void,
  onDelete: (item: TimeAbsenceEntryModel) => void,
) =>
  map<TimeAbsenceEntryModel, JSX.Element>(model => (
    <TimeAbsenceEntry
      key={model.id.value}
      timeAbsenceEntry={model}
      onUpdate={onUpdate}
      onDelete={onDelete}
    />
  ));

export interface TimeAbsenceEntriesInputs {
  timeAbsenceEntries: TimeAbsenceEntryModel[];
  isGetTimeAbsenceEntriesBusy: boolean;
  isDeleteTimeAbsenceEntryBusy: boolean;
}

export interface TimeAbsenceEntriesDispatches {
  onUpdate: (item: TimeAbsenceEntryModel) => void;
  onDelete: (item: TimeAbsenceEntryModel) => void;
}

type TimeAbsenceEntriesProps = TimeAbsenceEntriesInputs & TimeAbsenceEntriesDispatches;

export const TimeAbsenceEntriesComponent: React.FC<TimeAbsenceEntriesProps> = memo(props => {
  const {
    timeAbsenceEntries,
    isGetTimeAbsenceEntriesBusy,
    isDeleteTimeAbsenceEntryBusy,
    onUpdate,
    onDelete,
  } = props;

  const handleUpdate = useCallback((model: TimeAbsenceEntryModel) => onUpdate(model), [onUpdate]);
  const handleDelete = useCallback((model: TimeAbsenceEntryModel) => onDelete(model), [onDelete]);

  return (
    <Spinner show={isGetTimeAbsenceEntriesBusy || isDeleteTimeAbsenceEntryBusy}>
      <Typography component="h2" variant="h6" color="primary" gutterBottom>
        Absences
      </Typography>
      <Table>
        <colgroup>
          <col width="25%" />
          <col width="30%" />
          <col width="30%" />
          <col width="10%" />
          <col width="10%" />
        </colgroup>
        <TableHead>
          <TableRow>
            <TableCell>When</TableCell>
            <TableCell>Time</TableCell>
            <TableCell>Type</TableCell>
            <TableCell />
            <TableCell />
          </TableRow>
        </TableHead>
        <TableBody>
          {!!timeAbsenceEntries && !!timeAbsenceEntries.length ? (
            modelToCells(handleUpdate, handleDelete)(timeAbsenceEntries)
          ) : (
            <TableRow>
              <TableCell colSpan={5}>No absences</TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </Spinner>
  );
});
