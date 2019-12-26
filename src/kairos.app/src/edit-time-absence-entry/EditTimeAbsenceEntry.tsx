import React from 'react';
import Spinner from '../components/Spinner';
import { Language } from '../models/language-model';
import { ProfileModel } from '../models/profile.model';
import { TimeAbsenceEntryModel } from '../models/time-absence-entry.model';
import { TimeAbsenceEntryForm } from '../shared/TimeAbsenceEntryForm';

export interface EditTimeAbsenceEntryInputs {
  isOnline: boolean;
  selectedLanguage: Language;
  timeAbsenceEntry: TimeAbsenceEntryModel;
  isGetBusy: boolean;
  isUpdateBusy: boolean;
  profile: ProfileModel;
}

export interface EditTimeAbsenceEntryDispatches {
  onUpdate: (model: TimeAbsenceEntryModel) => void;
}

type EditTimeAbsenceEntryProps = EditTimeAbsenceEntryInputs &
  EditTimeAbsenceEntryDispatches;

export const EditTimeAbsenceEntryComponent: React.FC<EditTimeAbsenceEntryProps> = props => {
  const {
    isOnline,
    selectedLanguage,
    timeAbsenceEntry,
    isGetBusy,
    isUpdateBusy,
    profile,
    onUpdate,
  } = props;

  return (
    <Spinner show={isGetBusy}>
      <TimeAbsenceEntryForm
        isOnline={isOnline}
        selectedLanguage={selectedLanguage}
        isBusy={isUpdateBusy}
        model={timeAbsenceEntry}
        profile={profile}
        onSave={onUpdate}
      />
    </Spinner>
  );
};
