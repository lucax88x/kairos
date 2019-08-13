import { Button, IconButton, makeStyles, Typography } from '@material-ui/core';
import CreateIcon from '@material-ui/icons/Create';
import DeleteIcon from '@material-ui/icons/Delete';
import { format } from 'date-fns';
import React, { useCallback } from 'react';
import { Index } from 'react-virtualized';
import { formatAsDateTime } from '../code/constants';
import Spinner from '../components/Spinner';
import { VirtualizedTable } from '../components/VirtualizedTable';
import { TimeEntryListJobModel, TimeEntryListModel, TimeEntryListProjectModel } from '../models/time-entry-list.model';

const useStyles = makeStyles(theme => ({
  container: {
    height: '70vh',
    width: '100%',
    marginBottom: theme.spacing(1),
  },
}));

export interface TimeEntriesInputs {
  timeEntries: TimeEntryListModel[];
  isGetTimeEntriesBusy: boolean;
  isDeleteTimeEntryBusy: boolean;
}

export interface TimeEntriesDispatches {
  onCreate: () => void;
  onUpdate: (item: TimeEntryListModel) => void;
  onDelete: (item: TimeEntryListModel) => void;
}

type TimeEntriesProps = TimeEntriesInputs & TimeEntriesDispatches;

export const TimeEntriesComponent: React.FC<TimeEntriesProps> = props => {
  const {
    timeEntries,
    isGetTimeEntriesBusy,
    isDeleteTimeEntryBusy,
    onCreate,
    onUpdate,
    onDelete,
  } = props;

  const classes = useStyles(props);

  const handleUpdate = useCallback((model: TimeEntryListModel) => onUpdate(model), [onUpdate]);
  const handleDelete = useCallback((model: TimeEntryListModel) => onDelete(model), [onDelete]);

  const noRowsRenderer = useCallback(() => <p>No time entries</p>, []);
  const rowGetter = useCallback(({ index }: Index) => timeEntries[index], [timeEntries]);
  const dateFormatter = useCallback((data: Date) => format(data, formatAsDateTime), []);
  const jobFormatter = useCallback((job: TimeEntryListJobModel) => job.name, []);
  const projectFormatter = useCallback((project: TimeEntryListProjectModel) => project.name, []);
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

  return (
    <Spinner show={isGetTimeEntriesBusy || isDeleteTimeEntryBusy}>
      <Typography component="h2" variant="h6" color="primary" gutterBottom>
        Time Entries
      </Typography>
      <div className={classes.container}>
        <VirtualizedTable
          rowCount={timeEntries.length}
          noRowsRenderer={noRowsRenderer}
          rowGetter={rowGetter}
          columns={[
            {
              width: 100,
              label: 'Type',
              dataKey: 'type',
            },
            {
              width: 200,
              label: 'When',
              dataKey: 'when',
              flexGrow: 1,
              formatter: dateFormatter,
            },
            {
              width: 200,
              label: 'Job',
              dataKey: 'job',
              formatter: jobFormatter,
            },
            {
              width: 200,
              label: 'Project',
              dataKey: 'project',
              formatter: projectFormatter,
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
        />
      </div>
      <Button variant="contained" color="primary" onClick={onCreate}>
        Create
      </Button>
    </Spinner>
  );
};
