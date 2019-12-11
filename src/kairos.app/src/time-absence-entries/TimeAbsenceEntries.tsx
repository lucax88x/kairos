import { t, Trans } from '@lingui/macro';
import { IconButton } from '@material-ui/core';
import CreateIcon from '@material-ui/icons/Create';
import DeleteIcon from '@material-ui/icons/Delete';
import { map } from 'ramda';
import React, { useCallback } from 'react';
import { Index } from 'react-virtualized';
import { absenceTypeFormatter, dateTimeFormatter } from '../code/formatters';
import Spinner from '../components/Spinner';
import { VirtualizedTable } from '../components/VirtualizedTable';
import { i18n } from '../i18nLoader';
import { TimeAbsenceEntryModel } from '../models/time-absence-entry.model';
import { UUID } from '../models/uuid.model';

export interface TimeAbsenceEntriesInputs {
  timeAbsenceEntries: TimeAbsenceEntryModel[];
  isGetTimeAbsenceEntriesBusy: boolean;
  isDeleteTimeAbsenceEntriesBusy: boolean;
}

export interface TimeAbsenceEntriesDispatches {
  onCreate: () => void;
  onUpdate: (item: TimeAbsenceEntryModel) => void;
  onDelete: (ids: UUID[]) => void;
}

type TimeAbsenceEntriesProps = TimeAbsenceEntriesInputs &
  TimeAbsenceEntriesDispatches;

export const TimeAbsenceEntriesComponent: React.FC<TimeAbsenceEntriesProps> = props => {
  const {
    timeAbsenceEntries,
    isGetTimeAbsenceEntriesBusy,
    isDeleteTimeAbsenceEntriesBusy,
    onCreate,
    onUpdate,
    onDelete,
  } = props;

  const handleUpdate = useCallback(
    (model: TimeAbsenceEntryModel) => onUpdate(model),
    [onUpdate],
  );
  const handleDelete = useCallback(
    (model: TimeAbsenceEntryModel) => onDelete([model.id]),
    [onDelete],
  );

  const noRowsRenderer = useCallback(
    () => <p>{isGetTimeAbsenceEntriesBusy ? '' : <Trans>No items</Trans>}</p>,
    [isGetTimeAbsenceEntriesBusy],
  );
  const rowGetter = useCallback(
    ({ index }: Index) => timeAbsenceEntries[index],
    [timeAbsenceEntries],
  );
  const updateCellRenderer = useCallback(
    model => (
      <IconButton
        color="inherit"
        aria-label={i18n._(t`Update Absence`)}
        onClick={() => handleUpdate(model)}
      >
        <CreateIcon />
      </IconButton>
    ),
    [handleUpdate],
  );
  const deleteCellRenderer = useCallback(
    model => (
      <IconButton
        color="inherit"
        aria-label={i18n._(t`Delete Absence`)}
        onClick={() => handleDelete(model)}
      >
        <DeleteIcon />
      </IconButton>
    ),
    [handleDelete],
  );

  const handleDeleteSelected = useCallback(ids => onDelete(ids), [onDelete]);

  return (
    <Spinner
      show={isGetTimeAbsenceEntriesBusy || isDeleteTimeAbsenceEntriesBusy}
    >
      <VirtualizedTable
        title={i18n._(t`Absences`)}
        rowCount={timeAbsenceEntries.length}
        rowIds={map(m => m.id.toString(), timeAbsenceEntries)}
        noRowsRenderer={noRowsRenderer}
        rowGetter={rowGetter}
        columns={[
          {
            width: 100,
            label: i18n._(t`Type`),
            dataKey: 'type',
            formatter: absenceTypeFormatter,
          },
          {
            width: 200,
            label: i18n._(t`Start`),
            dataKey: 'start',
            flexGrow: 1,
            formatter: dateTimeFormatter,
          },
          {
            width: 200,
            label: i18n._(t`End`),
            dataKey: 'end',
            flexGrow: 1,
            formatter: dateTimeFormatter,
          },
          {
            width: 200,
            label: i18n._(t`Description`),
            dataKey: 'description',
          },
          {
            width: 100,
            label: '',
            dataKey: '',
            cellRenderer: updateCellRenderer,
          },
          {
            width: 100,
            label: '',
            dataKey: '',
            cellRenderer: deleteCellRenderer,
          },
        ]}
        onCreate={onCreate}
        onDelete={handleDeleteSelected}
      />
    </Spinner>
  );
};
