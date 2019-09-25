import { t, Trans } from '@lingui/macro';
import { Button, Grid, IconButton, makeStyles, Typography } from '@material-ui/core';
import CreateIcon from '@material-ui/icons/Create';
import DeleteIcon from '@material-ui/icons/Delete';
import { format } from 'date-fns';
import { map } from 'ramda';
import React, { useCallback, useMemo, useState } from 'react';
import { Index } from 'react-virtualized';
import { formatAsDate } from '../code/constants';
import { Autocomplete, AutocompleteSuggestion } from '../components/Autocomplete';
import Spinner from '../components/Spinner';
import { VirtualizedTable } from '../components/VirtualizedTable';
import { i18n } from '../i18nLoader';
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
  onUpdateHolidays: (countryCode: string) => void;
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
    onUpdateHolidays,
  } = props;

  const classes = useStyles(props);

  const [country, setCountry] = useState('');

  const handleUpdate = useCallback((model: TimeHolidayEntryModel) => onUpdate(model), [onUpdate]);
  const handleDelete = useCallback((model: TimeHolidayEntryModel) => onDelete(model), [onDelete]);
  const handleCountryChange = useCallback(
    (suggestion: AutocompleteSuggestion) => setCountry(suggestion.value),
    [setCountry],
  );
  const handleUpdateHolidays = useCallback(() => onUpdateHolidays(country), [
    country,
    onUpdateHolidays,
  ]);

  const noRowsRenderer = useCallback(
    () => <p>{isGetTimeHolidayEntriesBusy ? '' : <Trans>TimeHolidayEntries.NoItems</Trans>}</p>,
    [isGetTimeHolidayEntriesBusy],
  );
  const rowGetter = useCallback(({ index }: Index) => timeHolidayEntries[index], [
    timeHolidayEntries,
  ]);
  const dateFormatter = useCallback((data: Date) => !!data && format(data, formatAsDate), []);
  const updateCellRenderer = useCallback(
    model => (
      <IconButton
        color="inherit"
        aria-label={i18n._(t`TimeHolidayEntries.UpdateHolidayButton`)}
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
        aria-label={i18n._(t`TimeHolidayEntries.DeleteHolidayButton`)}
        onClick={() => handleDelete(model)}
      >
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
              width: 100,
              label: i18n._(t`TimeHolidayEntries.WhenTableHeader`),
              dataKey: 'when',
              flexGrow: 1,
              formatter: dateFormatter,
            },
            {
              width: 100,
              flexGrow: 2,
              label: i18n._(t`TimeHolidayEntries.DescriptionTableHeader`),
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
        <Trans>Buttons.Create</Trans>
      </Button>
      <hr></hr>
      <Grid container alignItems={'center'} justify={'space-between'}>
        <Grid item>
          <Autocomplete
            isBusy={isGetCountriesBusy}
            data={countriesSuggestion}
            placeholder={i18n._(t`TimeHolidayEntries.SearchForCountry`)}
            value={country}
            onSelectSuggestion={handleCountryChange}
          />
        </Grid>
        <Grid item>
          <Button
            variant="contained"
            color="primary"
            onClick={handleUpdateHolidays}
            disabled={!country}
          >
            <Trans>TimeHolidayEntries.UpdateHolidaysFromCountryButton</Trans>
          </Button>
        </Grid>
      </Grid>
    </Spinner>
  );
};
