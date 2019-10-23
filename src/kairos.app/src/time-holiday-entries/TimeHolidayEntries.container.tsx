import { push } from 'connected-react-router';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import { Actions } from '../actions';
import { openTimeHolidayEntryModalAction } from '../layout/actions';
import { TimeHolidayEntryModel } from '../models/time-holiday-entry.model';
import { UUID } from '../models/uuid.model';
import { updateTimeHolidayEntriesByCountryAsync } from '../shared/actions';
import { tryDeleteTimeHolidayEntriesAction } from '../shared/delete-time-holiday-entries';
import {
  selectCountries,
  selectIsDeleteTimeHolidayEntriesBusy,
  selectIsGetCountriesBusy,
  selectIsGetTimeHolidayEntriesBusy,
  selectIsUpdateTimeHolidayEntriesByCountry,
  selectTimeHolidayEntries,
} from '../shared/selectors';
import { State } from '../state';
import {
  TimeHolidayEntriesComponent,
  TimeHolidayEntriesDispatches,
  TimeHolidayEntriesInputs,
} from './TimeHolidayEntries';

const mapStateToProps = (state: State): TimeHolidayEntriesInputs => ({
  timeHolidayEntries: selectTimeHolidayEntries(state),
  countries: selectCountries(state),
  isGetTimeHolidayEntriesBusy: selectIsGetTimeHolidayEntriesBusy(state),
  isUpdateTimeHolidayEntriesByCountryBusy: selectIsUpdateTimeHolidayEntriesByCountry(state),
  isDeleteTimeHolidayEntriesBusy: selectIsDeleteTimeHolidayEntriesBusy(state),
  isGetCountriesBusy: selectIsGetCountriesBusy(state),
});

const mapDispatchToProps = (dispatch: Dispatch<Actions>): TimeHolidayEntriesDispatches => ({
  onCreate: () => dispatch(openTimeHolidayEntryModalAction()),
  onUpdate: (model: TimeHolidayEntryModel) => dispatch(push(`/holiday/${model.id}`)),
  onDelete: (ids: UUID[]) => dispatch(tryDeleteTimeHolidayEntriesAction(ids)),
  onUpdateHolidays: (countryCode: string) =>
    dispatch(updateTimeHolidayEntriesByCountryAsync.request({ countryCode })),
});

export const TimeHolidayEntries = connect(
  mapStateToProps,
  mapDispatchToProps,
)(TimeHolidayEntriesComponent);
