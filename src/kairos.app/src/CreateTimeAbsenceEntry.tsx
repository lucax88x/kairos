import React from 'react';

import { TimeAbsenceEntryModel } from './models/time-absence-entry.model';
import { TimeAbsenceEntryForm } from './shared/TimeAbsenceEntryForm';

export interface CreateTimeAbsenceEntryInputs {
  isBusy: boolean;
}

export interface CreateTimeAbsenceEntryDispatches {
  create: (model: TimeAbsenceEntryModel) => void;
}

type CreateTimeAbsenceEntryProps = CreateTimeAbsenceEntryInputs & CreateTimeAbsenceEntryDispatches;

export const CreateTimeAbsenceEntryComponent: React.FC<CreateTimeAbsenceEntryProps> = props => {
  const { create, isBusy } = props;

  return <TimeAbsenceEntryForm isBusy={isBusy} model={new TimeAbsenceEntryModel()} save={create} />;
};
