import React from 'react';
import { Language } from './models/language-model';
import { TimeAbsenceEntryModel } from './models/time-absence-entry.model';
import { TimeAbsenceEntryForm } from './shared/TimeAbsenceEntryForm';
import { ProfileModel } from './models/profile.model';

export interface CreateTimeAbsenceEntryInputs {
  isOnline: boolean;
  profile: ProfileModel;
  selectedLanguage: Language;
  isBusy: boolean;
}

export interface CreateTimeAbsenceEntryDispatches {
  onCreate: (model: TimeAbsenceEntryModel) => void;
}

type CreateTimeAbsenceEntryProps = CreateTimeAbsenceEntryInputs &
  CreateTimeAbsenceEntryDispatches;

export const CreateTimeAbsenceEntryComponent: React.FC<CreateTimeAbsenceEntryProps> = props => {
  const { isOnline, selectedLanguage, isBusy, profile, onCreate } = props;

  return (
    <TimeAbsenceEntryForm
      isOnline={isOnline}
      selectedLanguage={selectedLanguage}
      isBusy={isBusy}
      profile={profile}
      model={TimeAbsenceEntryModel.empty}
      onSave={onCreate}
    />
  );
};
