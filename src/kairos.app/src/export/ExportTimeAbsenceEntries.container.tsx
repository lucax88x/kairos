import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import { Actions } from '../actions';
import { selectIsOnline, selectSelectedLanguage } from '../shared/selectors';
import { State } from '../state';
import { exportTimeAbsenceEntriesAsync } from './export-time-absence-entries';
import {
  ExportTimeAbsenceEntriesComponent,
  ExportTimeAbsenceEntriesDispatches,
  ExportTimeAbsenceEntriesInputs,
} from './ExportTimeAbsenceEntries';
import { selectIsExportTimeAbsenceEntriesBusy } from './selectors';

const mapStateToProps = (state: State): ExportTimeAbsenceEntriesInputs => ({
  isOnline: selectIsOnline(state),
  selectedLanguage: selectSelectedLanguage(state),
  isBusy: selectIsExportTimeAbsenceEntriesBusy(state),
});

const mapDispatchToProps = (
  dispatch: Dispatch<Actions>,
): ExportTimeAbsenceEntriesDispatches => ({
  onExport: (start, end) =>
    dispatch(exportTimeAbsenceEntriesAsync.request({ start, end })),
});

export const ExportTimeAbsenceEntries = connect(
  mapStateToProps,
  mapDispatchToProps,
)(ExportTimeAbsenceEntriesComponent);
