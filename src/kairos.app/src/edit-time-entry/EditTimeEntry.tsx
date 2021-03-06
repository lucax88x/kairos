import React from 'react';
import Spinner from '../components/Spinner';
import { Language } from '../models/language-model';
import { ProfileModel } from '../models/profile.model';
import { TimeEntryModel } from '../models/time-entry.model';
import { TimeEntryForm } from '../shared/TimeEntryForm';

export interface EditTimeEntryInputs {
  isOnline: boolean;
  selectedLanguage: Language;
  profile: ProfileModel;
  timeEntry: TimeEntryModel;
  isGetBusy: boolean;
  isUpdateBusy: boolean;
}

export interface EditTimeEntryDispatches {
  onUpdate: (model: TimeEntryModel) => void;
}

type EditTimeEntryProps = EditTimeEntryInputs & EditTimeEntryDispatches;

export const EditTimeEntryComponent: React.FC<EditTimeEntryProps> = props => {
  const {
    isOnline,
    selectedLanguage,
    profile,
    timeEntry,
    isGetBusy,
    isUpdateBusy,
    onUpdate,
  } = props;

  return (
    <Spinner show={isGetBusy}>
      <TimeEntryForm
        isOnline={isOnline}
        selectedLanguage={selectedLanguage}
        profile={profile}
        isCreateAsInBusy={false}
        isCreateAsOutBusy={false}
        isUpdateBusy={isUpdateBusy}
        model={timeEntry}
        onSave={onUpdate}
      />
    </Spinner>
  );
};
