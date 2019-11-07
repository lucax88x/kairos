import { t, Trans } from '@lingui/macro';
import { Button, Divider, Grid, IconButton, makeStyles } from '@material-ui/core';
import CreateIcon from '@material-ui/icons/Create';
import DeleteIcon from '@material-ui/icons/Delete';
import { map } from 'ramda';
import React, { useCallback, useMemo, useState } from 'react';
import { Index } from 'react-virtualized';
import { dateFormatter } from '../code/formatters';
import { Autocomplete, AutocompleteSuggestion } from '../components/Autocomplete';
import Spinner from '../components/Spinner';
import { VirtualizedTable } from '../components/VirtualizedTable';
import { i18n } from '../i18nLoader';
import { CountryModel } from '../models/country.model';
import { TimeHolidayEntryModel } from '../models/time-holiday-entry.model';
import { UUID } from '../models/uuid.model';

const useStyles = makeStyles(theme => ({
  container: {
    width: '100%',
    display: 'grid',
    gridGap: theme.spacing(1),
  },
  justifySelfStart: {
    justifySelf: 'self-start',
  },
}));

export interface TimeHolidayEntriesInputs {
  timeHolidayEntries: TimeHolidayEntryModel[];
  countries: CountryModel[];
  isGetTimeHolidayEntriesBusy: boolean;
  isDeleteTimeHolidayEntriesBusy: boolean;
  isUpdateTimeHolidayEntriesByCountryBusy: boolean;
  isGetCountriesBusy: boolean;
}

export interface TimeHolidayEntriesDispatches {
  onCreate: () => void;
  onUpdate: (item: TimeHolidayEntryModel) => void;
  onDelete: (ids: UUID[]) => void;
  onUpdateHolidays: (countryCode: string) => void;
}

type TimeHolidayEntriesProps = TimeHolidayEntriesInputs & TimeHolidayEntriesDispatches;

export const TimeHolidayEntriesComponent: React.FC<TimeHolidayEntriesProps> = props => {
  const {
    timeHolidayEntries,
    countries,
    isGetTimeHolidayEntriesBusy,
    isDeleteTimeHolidayEntriesBusy,
    isUpdateTimeHolidayEntriesByCountryBusy,
    isGetCountriesBusy,
    onCreate,
    onUpdate,
    onDelete,
    onUpdateHolidays,
  } = props;

  const classes = useStyles(props);

  const [country, setCountry] = useState('');

  const handleUpdate = useCallback((model: TimeHolidayEntryModel) => onUpdate(model), [onUpdate]);
  const handleDelete = useCallback((model: TimeHolidayEntryModel) => onDelete([model.id]), [
    onDelete,
  ]);
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

  const handleDeleteSelected = useCallback(ids => onDelete(ids), [onDelete]);

  return (
    <Spinner
      show={
        isGetTimeHolidayEntriesBusy ||
        isDeleteTimeHolidayEntriesBusy ||
        isUpdateTimeHolidayEntriesByCountryBusy
      }
    >
      <div className={classes.container}>
        <VirtualizedTable
          title={i18n._(t`TimeHolidayEntries.Title`)}
          height="50vh"
          rowCount={timeHolidayEntries.length}
          rowIds={map(m => m.id.toString(), timeHolidayEntries)}
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
          onDelete={handleDeleteSelected}
        />
        <Button
          variant="contained"
          color="primary"
          onClick={onCreate}
          className={classes.justifySelfStart}
        >
          <Trans>Buttons.Create</Trans>
        </Button>
        <Divider />
        <Grid container alignItems={'center'} justify={'space-between'}>
          <Grid item>
            <Autocomplete
              isBusy={isGetCountriesBusy}
              data={countriesSuggestion}
              label={i18n._(t`TimeHolidayEntries.CountryLabel`)}
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
      </div>
    </Spinner>
  );
};
