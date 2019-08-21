import { Button, IconButton, makeStyles, Typography } from '@material-ui/core';
import CreateIcon from '@material-ui/icons/Create';
import DeleteIcon from '@material-ui/icons/Delete';
import { format } from 'date-fns';
import React, { useCallback } from 'react';
import { Index } from 'react-virtualized';

import { formatAsDateTime } from '../code/constants';
import Spinner from '../components/Spinner';
import { VirtualizedTable } from '../components/VirtualizedTable';
import { TimeHolidayEntryModel } from '../models/time-holiday-entry.model';

const useStyles = makeStyles(theme => ({
  container: {
    height: '70vh',
    width: '100%',
    marginBottom: theme.spacing(1),
  },
}));

export interface TimeHolidayEntriesInputs {
  timeHolidayEntries: TimeHolidayEntryModel[];
  isGetTimeHolidayEntriesBusy: boolean;
  isDeleteTimeHolidayEntryBusy: boolean;
}

export interface TimeHolidayEntriesDispatches {
  onCreate: () => void;
  onUpdate: (item: TimeHolidayEntryModel) => void;
  onDelete: (item: TimeHolidayEntryModel) => void;
}

type TimeHolidayEntriesProps = TimeHolidayEntriesInputs & TimeHolidayEntriesDispatches;

export const TimeHolidayEntriesComponent: React.FC<TimeHolidayEntriesProps> = props => {
  const {
    timeHolidayEntries,
    isGetTimeHolidayEntriesBusy,
    isDeleteTimeHolidayEntryBusy,
    onCreate,
    onUpdate,
    onDelete,
  } = props;

  const classes = useStyles(props);

  const handleUpdate = useCallback((model: TimeHolidayEntryModel) => onUpdate(model), [onUpdate]);
  const handleDelete = useCallback((model: TimeHolidayEntryModel) => onDelete(model), [onDelete]);

  const noRowsRenderer = useCallback(
    () => <p>{isGetTimeHolidayEntriesBusy ? '' : 'No holidays'}</p>,
    [isGetTimeHolidayEntriesBusy],
  );
  const rowGetter = useCallback(({ index }: Index) => timeHolidayEntries[index], [
    timeHolidayEntries,
  ]);
  const dateFormatter = useCallback((data: Date) => format(data, formatAsDateTime), []);
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
    <Spinner show={isGetTimeHolidayEntriesBusy || isDeleteTimeHolidayEntryBusy}>
      <Typography component="h2" variant="h6" gutterBottom>
        Holidays
      </Typography>
      <div className={classes.container}>
        <VirtualizedTable
          rowCount={timeHolidayEntries.length}
          noRowsRenderer={noRowsRenderer}
          rowGetter={rowGetter}
          columns={[
            {
              width: 200,
              label: 'Start',
              dataKey: 'start',
              flexGrow: 1,
              formatter: dateFormatter,
            },
            {
              width: 200,
              label: 'End',
              dataKey: 'end',
              flexGrow: 1,
              formatter: dateFormatter,
            },
            {
              width: 200,
              label: 'Description',
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
        />
      </div>
      <Button variant="contained" color="primary" onClick={onCreate}>
        Create
      </Button>
    </Spinner>
  );
};
