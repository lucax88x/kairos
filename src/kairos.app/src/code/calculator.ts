import { eachDayOfInterval, getDate } from 'date-fns';
import { ascend, sortWith } from 'ramda';

import { TimeEntryModel, TimeEntryTypes } from '../models/time-entry.model';
import { filterByInterval, humanDifference } from './functions';

export function getDifferencesByRange(timeEntries: TimeEntryModel[], interval: Interval) {
  const filteredByInterval = filterByInterval(interval)(timeEntries);
  const orderedByDate = sortWith([ascend(te => te.when)], filteredByInterval);
  const differencesByDate: { [date: number]: number } = {};

  for (let i = 0; i < orderedByDate.length; i++) {
    const enter = orderedByDate[i];

    if (enter.type === TimeEntryTypes.IN) {
      const [exit, toSkip] = getNearestExit(i, orderedByDate);
      i += toSkip;

      const date = getDate(enter.when);
      if (!exit.isEmpty()) {
        const diff = Math.abs(enter.when.getTime() - exit.when.getTime());

        differencesByDate[date] = !!differencesByDate[date] ? differencesByDate[date] + diff : diff;
      } else {
        differencesByDate[date] = 86399999; // 23:59:59
      }
    }
  }

  const days = eachDayOfInterval(interval);

  const result: { [date: number]: string } = {};
  for (let i = 0; i < days.length; i++) {
    const date = getDate(days[i]);

    if (!!differencesByDate[date]) {
      result[date] = humanDifference(new Date(0), new Date(differencesByDate[date]));
    } else {
      result[date] = humanDifference(new Date(0), new Date(0));
    }
  }
  return result;
}

function getNearestExit(
  startingIndex: number,
  timeEntries: TimeEntryModel[],
): [TimeEntryModel, number] {
  let toSkip = 0;
  for (let i = startingIndex + 1; i < timeEntries.length; i++) {
    const nextTimeEntry = timeEntries[i];

    if (nextTimeEntry.type === TimeEntryTypes.OUT) {
      return [nextTimeEntry, toSkip];
    }
    toSkip++;
  }
  return [TimeEntryModel.empty, toSkip];
}
