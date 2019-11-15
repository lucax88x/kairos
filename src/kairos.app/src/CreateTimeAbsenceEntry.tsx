import React from 'react';
import { Language } from './models/language-model';
import { TimeAbsenceEntryModel } from './models/time-absence-entry.model';
import { TimeAbsenceEntryForm } from './shared/TimeAbsenceEntryForm';

export interface CreateTimeAbsenceEntryInputs {
  isOnline: boolean;
  selectedLanguage: Language;
  isBusy: boolean;
}

export interface CreateTimeAbsenceEntryDispatches {
  onCreate: (model: TimeAbsenceEntryModel) => void;
}

type CreateTimeAbsenceEntryProps = CreateTimeAbsenceEntryInputs &
  CreateTimeAbsenceEntryDispatches;

export const CreateTimeAbsenceEntryComponent: React.FC<CreateTimeAbsenceEntryProps> = props => {
  const { isOnline, selectedLanguage, isBusy, onCreate } = props;

  return (
    <TimeAbsenceEntryForm
      isOnline={isOnline}
      selectedLanguage={selectedLanguage}
      isBusy={isBusy}
      model={TimeAbsenceEntryModel.empty}
      onSave={onCreate}
    />
  );
};
