import React from 'react';
import { t, Trans } from '@lingui/macro';
import { parseISO } from 'date-fns';
import { immerable } from 'immer';
import { i18n } from '../i18nLoader';
import { JobOutModel } from './job.model';
import { ProjectOutModel } from './project.model';
import { UUID } from './uuid.model';

export enum TimeEntryTypes {
  IN = 'IN',
  OUT = 'OUT',
}

export class TimeEntryModel {
  [immerable] = true;

  constructor(
    public id = UUID.Generate(),
    public when = new Date(),
    public type = TimeEntryTypes.IN,
    public job = new UUID(UUID.Empty),
    public project = new UUID(UUID.Empty),
  ) {}

  static fromOutModel(outModel: TimeEntryOutModel) {
    return new TimeEntryModel(
      new UUID(outModel.id),
      parseISO(outModel.when),
      TimeEntryTypes[outModel.type],
      new UUID(outModel.job.id),
      new UUID(outModel.project.id),
    );
  }

  static empty: TimeEntryModel = new TimeEntryModel(new UUID(), new Date(0));

  isEmpty() {
    return (
      this.id.equals(TimeEntryModel.empty.id) &&
      this.when === TimeEntryModel.empty.when &&
      this.job.isEmpty &&
      this.project.isEmpty
    );
  }
}

export interface TimeEntryOutModel {
  id: string;
  when: string;
  type: TimeEntryTypes;
  job: Partial<JobOutModel>;
  project: Partial<ProjectOutModel>;
}

export function getTextFromEntryType(type: TimeEntryTypes) {
  switch (type) {
    case TimeEntryTypes.IN:
      return i18n._(t`Values.TimeEntryTypes.In`);
    default:
    case TimeEntryTypes.OUT:
      return i18n._(t`Values.TimeEntryTypes.Out`);
  }
}

export function getTransFromEntryType(type: TimeEntryTypes) {
  switch (type) {
    case TimeEntryTypes.IN:
      return <Trans>Values.TimeEntryTypes.In</Trans>;
    default:
    case TimeEntryTypes.OUT:
      return <Trans>Values.TimeEntryTypes.Out</Trans>;
  }
}
