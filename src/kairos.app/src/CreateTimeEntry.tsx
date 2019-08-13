import React from 'react';

import { TimeEntryModel } from './models/time-entry.model';
import { TimeEntryForm } from './shared/TimeEntryForm';
import { ProfileModel } from './models/profile.model';

export interface CreateTimeEntryInputs {
  profile: ProfileModel;
  isBusy: boolean;
}

export interface CreateTimeEntryDispatches {
  onCreate: (model: TimeEntryModel) => void;
}

type CreateTimeEntryProps = CreateTimeEntryInputs & CreateTimeEntryDispatches;

export const CreateTimeEntryComponent: React.FC<CreateTimeEntryProps> = props => {
  const { profile, onCreate, isBusy } = props;

  return (
    <TimeEntryForm profile={profile} isBusy={isBusy} model={TimeEntryModel.empty} onSave={onCreate} />
  );
};
