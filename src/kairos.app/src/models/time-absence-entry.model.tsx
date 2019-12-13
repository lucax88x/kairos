import React from 'react';
import { endOfDay, parseISO, startOfDay } from 'date-fns';
import { immerable } from 'immer';
import { UUID } from './uuid.model';
import { Trans, t } from '@lingui/macro';
import { i18n } from '../i18nLoader';

export enum TimeAbsenceEntryTypes {
  VACATION = 'VACATION',
  ILLNESS = 'ILLNESS',
  PERMIT = 'PERMIT',
  COMPENSATION = 'COMPENSATION',
}

export class TimeAbsenceEntryModel {
  [immerable] = true;

  constructor(
    public id = UUID.Generate(),
    public description = '',
    public start = startOfDay(new Date()),
    public end = endOfDay(new Date()),
    public type = TimeAbsenceEntryTypes.VACATION,
  ) {}

  static fromOutModel(outModel: TimeAbsenceEntryOutModel) {
    return new TimeAbsenceEntryModel(
      new UUID(outModel.id),
      outModel.description,
      parseISO(outModel.start),
      parseISO(outModel.end),
      TimeAbsenceEntryTypes[outModel.type],
    );
  }

  static empty: TimeAbsenceEntryModel = new TimeAbsenceEntryModel(
    new UUID(),
    '',
    new Date(0),
    new Date(0),
  );

  static isEmpty(model: TimeAbsenceEntryModel) {
    return (
      UUID.isEmpty(model.id) &&
      model.description === TimeAbsenceEntryModel.empty.description
    );
  }
}

export interface TimeAbsenceEntryOutModel {
  id: string;
  description: string;
  start: string;
  end: string;
  type: TimeAbsenceEntryTypes;
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
