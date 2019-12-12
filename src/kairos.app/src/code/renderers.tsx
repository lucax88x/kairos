import React from 'react';
import { TimeEntryListModel } from '../models/time-entry-list.model';
import {
  getIconFromEntryType,
  getTransFromEntryType,
} from '../models/time-entry.model';
import { Box } from '@material-ui/core';

export const entryTypeRenderer = (model: TimeEntryListModel) => {
  return (
    <>
      <Box component="div" display={{ xs: 'block', sm: 'none' }}>
        {getIconFromEntryType(model.type)}
      </Box>
      <Box component="div" display={{ xs: 'none', sm: 'block' }}>
        {getIconFromEntryType(model.type)} {getTransFromEntryType(model.type)}
      </Box>
    </>
  );
};
