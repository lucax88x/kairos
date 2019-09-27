import React from 'react';

import { TimeEntryModel } from './models/time-entry.model';
import { TimeEntryForm } from './shared/TimeEntryForm';
import { ProfileModel } from './models/profile.model';
import { Language } from './models/language-model';

export interface CreateTimeEntryInputs {
  selectedLanguage: Language;
  profile: ProfileModel;
  isBusy: boolean;
}

export interface CreateTimeEntryDispatches {
  onCreate: (model: TimeEntryModel) => void;
}

type CreateTimeEntryProps = CreateTimeEntryInputs & CreateTimeEntryDispatches;

export const CreateTimeEntryComponent: React.FC<CreateTimeEntryProps> = props => {
  const { selectedLanguage, profile, isBusy, onCreate } = props;

  return (
    <TimeEntryForm
      selectedLanguage={selectedLanguage}
      profile={profile}
      isBusy={isBusy}
      model={TimeEntryModel.empty}
      onSave={onCreate}
    />
  );
};
