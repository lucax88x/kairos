import React from 'react';
import { TimeEntryListModel } from '../models/time-entry-list.model';
import {
  getIconFromEntryType,
  getTransFromEntryType,
} from '../models/time-entry.model';

export const entryTypeRenderer = (model: TimeEntryListModel) => {
  return (
    <p>
      {getIconFromEntryType(model.type)} {getTransFromEntryType(model.type)}
    </p>
  );
};
