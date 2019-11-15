import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import { Actions } from './actions';
import { CreateTimeAbsenceEntryComponent, CreateTimeAbsenceEntryDispatches, CreateTimeAbsenceEntryInputs } from './CreateTimeAbsenceEntry';
import { TimeAbsenceEntryModel } from './models/time-absence-entry.model';
import { createTimeAbsenceEntryAsync } from './shared/create-time-absence-entry';
import { selectIsCreateTimeAbsenceEntryBusy, selectIsOnline, selectSelectedLanguage } from './shared/selectors';
import { State } from './state';

const mapStateToProps = (state: State): CreateTimeAbsenceEntryInputs => ({
  isOnline: selectIsOnline(state),
  selectedLanguage: selectSelectedLanguage(state),
  isBusy: selectIsCreateTimeAbsenceEntryBusy(state),
});

const mapDispatchToProps = (
  dispatch: Dispatch<Actions>,
): CreateTimeAbsenceEntryDispatches => ({
  onCreate: (model: TimeAbsenceEntryModel) =>
    dispatch(createTimeAbsenceEntryAsync.request(model)),
});

export const CreateTimeAbsenceEntry = connect(
  mapStateToProps,
  mapDispatchToProps,
)(CreateTimeAbsenceEntryComponent);
