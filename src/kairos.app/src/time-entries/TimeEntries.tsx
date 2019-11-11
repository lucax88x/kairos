import { t, Trans } from '@lingui/macro';
import { Button, IconButton, makeStyles } from '@material-ui/core';
import CreateIcon from '@material-ui/icons/Create';
import DeleteIcon from '@material-ui/icons/Delete';
import { map } from 'ramda';
import React, { useCallback } from 'react';
import { Index } from 'react-virtualized';
import { dateTimeFormatter, entryTypeFormatter } from '../code/formatters';
import Spinner from '../components/Spinner';
import { VirtualizedTable } from '../components/VirtualizedTable';
import { i18n } from '../i18nLoader';
import {
  TimeEntryListJobModel,
  TimeEntryListModel,
} from '../models/time-entry-list.model';
import { UUID } from '../models/uuid.model';

const useStyles = makeStyles(theme => ({
  container: {
    width: '100%',
    marginBottom: theme.spacing(1),
  },
}));

export interface TimeEntriesInputs {
  timeEntries: TimeEntryListModel[];
  isGetTimeEntriesBusy: boolean;
  isDeleteTimeEntriesBusy: boolean;
}

export interface TimeEntriesDispatches {
  onCreate: () => void;
  onUpdate: (item: TimeEntryListModel) => void;
  onDelete: (ids: UUID[]) => void;
}

type TimeEntriesProps = TimeEntriesInputs & TimeEntriesDispatches;

export const TimeEntriesComponent: React.FC<TimeEntriesProps> = props => {
  const {
    timeEntries,
    isGetTimeEntriesBusy,
    isDeleteTimeEntriesBusy,
    onCreate,
    onUpdate,
    onDelete,
  } = props;

  const classes = useStyles(props);

  const handleUpdate = useCallback((model: TimeEntryListModel) => onUpdate(model), [onUpdate]);
  const handleDelete = useCallback((model: TimeEntryListModel) => onDelete([model.id]), [onDelete]);

  const noRowsRenderer = useCallback(
    () => <p>{isGetTimeEntriesBusy ? '' : <Trans>TimeEntries.NoItems</Trans>}</p>,
    [isGetTimeEntriesBusy],
  );
  const rowGetter = useCallback(({ index }: Index) => timeEntries[index], [timeEntries]);
  const jobFormatter = useCallback((job: TimeEntryListJobModel) => job.name, []);
  const updateCellRenderer = useCallback(
    model => (
      <IconButton color="inherit" aria-label="Update entry" onClick={() => handleUpdate(model)}>
        <CreateIcon />
      </IconButton>
    ),
    [handleUpdate],
  );
  const deleteCellRenderer = useCallback(
    model => (
      <IconButton color="inherit" aria-label="Delete entry" onClick={() => handleDelete(model)}>
        <DeleteIcon />
      </IconButton>
    ),
    [handleDelete],
  );

  const handleDeleteSelected = useCallback(ids => onDelete(ids), [onDelete]);

  return (
    <Spinner show={isGetTimeEntriesBusy || isDeleteTimeEntriesBusy}>
      <div className={classes.container}>
        <VirtualizedTable
          title={i18n._(t`TimeEntries.Title`)}
          rowCount={timeEntries.length}
          rowIds={map(m => m.id.toString(), timeEntries)}
          noRowsRenderer={noRowsRenderer}
          rowGetter={rowGetter}
          columns={[
            {
              width: 100,
              label: i18n._(t`TimeEntries.TypeTableHeader`),
              dataKey: 'type',
              formatter: entryTypeFormatter,
            },
            {
              width: 200,
              label: i18n._(t`TimeEntries.WhenTableHeader`),
              dataKey: 'when',
              flexGrow: 1,
              formatter: dateTimeFormatter,
            },
            {
              width: 200,
              label: i18n._(t`TimeEntries.JobTableHeader`),
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
          onDelete={handleDeleteSelected}
        />
      </div>
      <Button variant="contained" color="primary" onClick={onCreate}>
        <Trans>Buttons.Create</Trans>
      </Button>
    </Spinner>
  );
};
