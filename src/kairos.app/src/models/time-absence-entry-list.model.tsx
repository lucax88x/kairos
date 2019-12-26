import { t, Trans } from '@lingui/macro';
import { parseISO } from 'date-fns';
import { immerable } from 'immer';
import React from 'react';
import { i18n } from '../i18nLoader';
import { JobListModel, JobListOutModel } from './job.model';
import { TimeAbsenceEntryTypes } from './time-absence-entry.model';
import { UUID } from './uuid.model';

export class TimeAbsenceEntryListModel {
  [immerable] = true;

  constructor(
    public id: UUID,
    public description: string,
    public start: Date,
    public end: Date,
    public type: TimeAbsenceEntryTypes,
    public job: JobListModel,
  ) {}

  static fromOutModel(outModel: TimeAbsenceEntryListOutModel) {
    return new TimeAbsenceEntryListModel(
      new UUID(outModel.id),
      outModel.description,
      parseISO(outModel.start),
      parseISO(outModel.end),
      TimeAbsenceEntryTypes[outModel.type],
      JobListModel.fromOutModel(outModel.job),
    );
  }

  static empty: TimeAbsenceEntryListModel = new TimeAbsenceEntryListModel(
    new UUID(),
    '',
    new Date(0),
    new Date(0),
    TimeAbsenceEntryTypes.COMPENSATION,
    JobListModel.empty,
  );

  static isEmpty(model: TimeAbsenceEntryListModel) {
    return (
      UUID.isEmpty(model.id) &&
      model.description === TimeAbsenceEntryListModel.empty.description &&
      JobListModel.isEmpty(model.job)
    );
  }
}

export interface TimeAbsenceEntryListOutModel {
  id: string;
  description: string;
  start: string;
  end: string;
  type: TimeAbsenceEntryTypes;
  job: JobListOutModel;
}

export function getTextFromAbsenceType(type: TimeAbsenceEntryTypes) {
  switch (type) {
    case TimeAbsenceEntryTypes.COMPENSATION:
      return i18n._(t`Compensation`);
    case TimeAbsenceEntryTypes.PERMIT:
      return i18n._(t`Permit`);
    case TimeAbsenceEntryTypes.VACATION:
      return i18n._(t`Vacation`);
    case TimeAbsenceEntryTypes.ILLNESS:
      return i18n._(t`Illness`);
    default:
      return i18n._(t`Invalid Type`);
  }
}

export function getTransFromAbsenceType(type: TimeAbsenceEntryTypes) {
  switch (type) {
    case TimeAbsenceEntryTypes.COMPENSATION:
      return <Trans>Compensation</Trans>;
    case TimeAbsenceEntryTypes.PERMIT:
      return <Trans>Permit</Trans>;
    case TimeAbsenceEntryTypes.VACATION:
      return <Trans>Vacation</Trans>;
    case TimeAbsenceEntryTypes.ILLNESS:
      return <Trans>Illness</Trans>;
    default:
      return <Trans>Invalid Type</Trans>;
  }
}
