import React from 'react';

import { TimeEntryModel } from './models/time-entry.model';
import { TimeEntryForm } from './shared/TimeEntryForm';
import { ProfileModel } from './models/profile.model';
import { Language } from './models/language-model';

export interface CreateTimeEntryInputs {
  isOnline: boolean;
  selectedLanguage: Language;
  profile: ProfileModel;
  isCreateAsInBusy: boolean;
  isCreateAsOutBusy: boolean;
}

export interface CreateTimeEntryDispatches {
  onCreate: (model: TimeEntryModel) => void;
}

type CreateTimeEntryProps = CreateTimeEntryInputs & CreateTimeEntryDispatches;

export const CreateTimeEntryComponent: React.FC<CreateTimeEntryProps> = props => {
  const { isOnline, selectedLanguage, profile, isCreateAsInBusy, isCreateAsOutBusy, onCreate } = props;

  return (
    <TimeEntryForm
      isOnline={isOnline}
      selectedLanguage={selectedLanguage}
      profile={profile}
      isCreateAsInBusy={isCreateAsInBusy}
      isCreateAsOutBusy={isCreateAsOutBusy}
      isUpdateBusy={false}
      model={TimeEntryModel.empty}
      onSave={onCreate}
    />
  );
};
