import { t, Trans } from '@lingui/macro';
import { parseISO } from 'date-fns';
import { immerable } from 'immer';
import React from 'react';
import { i18n } from '../i18nLoader';
import { JobOutModel } from './job.model';
import { UUID } from './uuid.model';
import { FontAwesomeIcon, FontAwesomeIconProps } from '@fortawesome/react-fontawesome';

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
  ) {}

  static fromOutModel(outModel: TimeEntryOutModel) {
    return new TimeEntryModel(
      new UUID(outModel.id),
      parseISO(outModel.when),
      TimeEntryTypes[outModel.type],
      new UUID(outModel.job.id),
    );
  }

  static empty: TimeEntryModel = new TimeEntryModel(new UUID(), new Date(0));

  isEmpty() {
    return (
      this.id.equals(TimeEntryModel.empty.id) &&
      this.when === TimeEntryModel.empty.when &&
      this.job.isEmpty
    );
  }
}

export interface TimeEntryOutModel {
  id: string;
  when: string;
  type: TimeEntryTypes;
  job: Partial<JobOutModel>;
}

export function getTextFromEntryType(type: TimeEntryTypes) {
  switch (type) {
    case TimeEntryTypes.IN:
      return i18n._(t`In`);
    case TimeEntryTypes.OUT:
      return i18n._(t`Out`);
    default:
      return i18n._(t`Invalid Type`);
  }
}

export function getTransFromEntryType(type: TimeEntryTypes) {
  switch (type) {
    case TimeEntryTypes.IN:
      return <Trans>In</Trans>;
    case TimeEntryTypes.OUT:
      return <Trans>Out</Trans>;
    default:
      return <Trans>Invalid Type</Trans>;
  }
}

export function getIconFromEntryType(type: TimeEntryTypes, iconProps?: Partial<FontAwesomeIconProps>) {
  switch (type) {
    case TimeEntryTypes.IN:
      return <FontAwesomeIcon icon={['fad', 'portal-enter']} {...iconProps} />;
    case TimeEntryTypes.OUT:
      return <FontAwesomeIcon icon={['fad', 'portal-exit']} {...iconProps} />;
    default:
      return <Trans>Invalid Type</Trans>;
  }
}
