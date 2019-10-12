import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import { Actions } from '../actions';
import { State } from '../state';
import { exportTimeAbsenceEntriesAsync } from './export-time-absence-entries';
import { ExportTimeAbsenceEntriesComponent, ExportTimeAbsenceEntriesDispatches, ExportTimeAbsenceEntriesInputs } from './ExportTimeAbsenceEntries';
import { selectIsExportTimeAbsenceEntriesBusy } from './selectors';

const mapStateToProps = (state: State): ExportTimeAbsenceEntriesInputs => ({
  isBusy: selectIsExportTimeAbsenceEntriesBusy(state),
});

const mapDispatchToProps = (dispatch: Dispatch<Actions>): ExportTimeAbsenceEntriesDispatches => ({
  onExport: models => dispatch(exportTimeAbsenceEntriesAsync.request({ models })),
});

export const ExportTimeAbsenceEntries = connect(
  mapStateToProps,
  mapDispatchToProps,
)(ExportTimeAbsenceEntriesComponent);
