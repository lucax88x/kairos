import React from 'react';

import { TimeEntryModel } from './models/time-entry.model';
import { TimeEntryForm } from './shared/TimeEntryForm';

export interface CreateTimeEntryInputs {
  isBusy: boolean;
}

export interface CreateTimeEntryDispatches {
  create: (model: TimeEntryModel) => void;
}

type CreateTimeEntryProps = CreateTimeEntryInputs & CreateTimeEntryDispatches;

export const CreateTimeEntryComponent: React.FC<CreateTimeEntryProps> = props => {
  const { create, isBusy } = props;

  return <TimeEntryForm isBusy={isBusy} model={new TimeEntryModel()} save={create} />;
};
