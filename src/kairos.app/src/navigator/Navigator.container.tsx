import { push } from 'connected-react-router';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import { Actions } from '../actions';
import { RouteMatcher } from '../routes';
import {
  tryDeleteTimeAbsenceEntriesAction,
  tryDeleteTimeEntriesAction,
  tryDeleteTimeHolidayEntriesAction,
} from '../shared/actions';
import { selectSelectedLanguage } from '../shared/selectors';
import { State } from '../state';
import {
  NavigatorComponent,
  NavigatorDispatches,
  NavigatorInputs,
} from './Navigator';
import {
  selectEndDate,
  selectIsGetEntriesBusy,
  selectSortedEntries,
  selectStartDate,
} from './selectors';
import { setNavigatorFilters } from './set-navigator-filters';

const mapStateToProps = (state: State): NavigatorInputs => ({
  selectedLanguage: selectSelectedLanguage(state),
  startDate: selectStartDate(state),
  endDate: selectEndDate(state),
  isBusy: selectIsGetEntriesBusy(state),
  entries: selectSortedEntries(state),
});

const mapDispatchToProps = (
  dispatch: Dispatch<Actions>,
): NavigatorDispatches => ({
  onChange: ({ start, end }: { start: Date; end: Date }) =>
    dispatch(setNavigatorFilters(start, end)),
  onEditTimeEntry: entry =>
    dispatch(
      push(RouteMatcher.EditTimeEntry.replace(':id', entry.id.toString())),
    ),
  onEditTimeAbsence: absence =>
    dispatch(
      push(
        RouteMatcher.EditTimeAbsenceEntry.replace(':id', absence.id.toString()),
      ),
    ),
  onEditTimeHoliday: holiday =>
    dispatch(
      push(
        RouteMatcher.EditTimeHolidayEntry.replace(':id', holiday.id.toString()),
      ),
    ),
  onDeleteTimeEntry: entry => dispatch(tryDeleteTimeEntriesAction([entry.id])),
  onDeleteTimeAbsence: entry =>
    dispatch(tryDeleteTimeAbsenceEntriesAction([entry.id])),
  onDeleteTimeHoliday: entry =>
    dispatch(tryDeleteTimeHolidayEntriesAction([entry.id])),
});

export const Navigator = connect(
  mapStateToProps,
  mapDispatchToProps,
)(NavigatorComponent);
