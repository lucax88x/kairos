import { getDate, isWithinInterval } from 'date-fns';
import { converge, divide, filter, groupBy, length, sum } from 'ramda';
import { TimeEntryListModel } from '../models/time-entry-list.model';

export const filterByInterval = (interval: Interval) =>
  filter((te: TimeEntryListModel) => isWithinInterval(te.when, interval));

export const groupByDate = groupBy((te: TimeEntryListModel) =>
  getDate(te.when).toString(),
);

export const average = converge(divide, [sum, length]);
