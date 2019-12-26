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
import { JobListModel } from '../models/job.model';
import { TimeAbsenceEntryListModel } from '../models/time-absence-entry-list.model';
import { UUID } from '../models/uuid.model';

export interface TimeAbsenceEntriesInputs {
  timeAbsenceEntries: TimeAbsenceEntryListModel[];
  isGetTimeAbsenceEntriesBusy: boolean;
  isDeleteTimeAbsenceEntriesBusy: boolean;
}

export interface TimeAbsenceEntriesDispatches {
  onCreate: () => void;
  onUpdate: (item: TimeAbsenceEntryListModel) => void;
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
    (model: TimeAbsenceEntryListModel) => onUpdate(model),
    [onUpdate],
  );
  const handleDelete = useCallback(
    (model: TimeAbsenceEntryListModel) => onDelete([model.id]),
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
  const jobFormatter = useCallback(
    (job: JobListModel) => (!!job ? job.name : ''),
    [],
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
            width: 200,
            label: i18n._(t`Job`),
            dataKey: 'job',
            formatter: jobFormatter,
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
