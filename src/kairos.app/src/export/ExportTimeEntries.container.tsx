import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import { Actions } from '../actions';
import { selectSelectedLanguage } from '../shared/selectors';
import { State } from '../state';
import { exportTimeEntriesAsync } from './export-time-entries';
import {
  ExportTimeEntriesComponent,
  ExportTimeEntriesDispatches,
  ExportTimeEntriesInputs,
} from './ExportTimeEntries';
import { selectIsExportTimeEntriesBusy } from './selectors';

const mapStateToProps = (state: State): ExportTimeEntriesInputs => ({
  selectedLanguage: selectSelectedLanguage(state),
  isBusy: selectIsExportTimeEntriesBusy(state),
});

const mapDispatchToProps = (dispatch: Dispatch<Actions>): ExportTimeEntriesDispatches => ({
  onExport: (start, end) => dispatch(exportTimeEntriesAsync.request({ start, end })),
});

export const ExportTimeEntries = connect(
  mapStateToProps,
  mapDispatchToProps,
)(ExportTimeEntriesComponent);
