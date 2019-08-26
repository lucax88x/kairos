import { Button, IconButton, makeStyles, Typography } from '@material-ui/core';
import CreateIcon from '@material-ui/icons/Create';
import DeleteIcon from '@material-ui/icons/Delete';
import { format } from 'date-fns';
import { map } from 'ramda';
import React, { useCallback, useMemo, useState } from 'react';
import { Index } from 'react-virtualized';
import { formatAsDateTime } from '../code/constants';
import { Autocomplete } from '../components/Autocomplete';
import Spinner from '../components/Spinner';
import { VirtualizedTable } from '../components/VirtualizedTable';
import { CountryModel } from '../models/country.model';
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
  countries: CountryModel[];
  isGetTimeHolidayEntriesBusy: boolean;
  isDeleteTimeHolidayEntryBusy: boolean;
  isGetCountriesBusy: boolean;
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
    countries,
    isGetTimeHolidayEntriesBusy,
    isDeleteTimeHolidayEntryBusy,
    isGetCountriesBusy,
    onCreate,
    onUpdate,
    onDelete,
  } = props;

  const classes = useStyles(props);

  const [country, setCountry] = useState('');

  const handleUpdate = useCallback((model: TimeHolidayEntryModel) => onUpdate(model), [onUpdate]);
  const handleDelete = useCallback((model: TimeHolidayEntryModel) => onDelete(model), [onDelete]);
  const handleCountryChange = useCallback(() => setCountry(''), [setCountry]);
  const handleOverrideHolidays = useCallback(() => console.log('override'), []);

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

  const countriesSuggestion = useMemo(
    () => map(c => ({ value: c.countryCode, label: c.country }), countries),
    [countries],
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
              label: 'When',
              dataKey: 'When',
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
      <Autocomplete
        isBusy={isGetCountriesBusy}
        data={countriesSuggestion}
        value={country}
        onChange={handleCountryChange}
      />

      <Button variant="contained" color="primary" onClick={handleOverrideHolidays}>
        Override Holidays from country preset
      </Button>
    </Spinner>
  );
};
