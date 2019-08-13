import { eachDayOfInterval, endOfDay, getDate } from 'date-fns';
import { ascend, sortWith } from 'ramda';
import { TimeEntryListModel } from '../models/time-entry-list.model';
import { TimeEntryTypes } from '../models/time-entry.model';
import { filterByInterval, humanDifference } from './functions';

export function getEnterExitPairs(timeEntries: TimeEntryListModel[], interval: Interval) {
  const filteredByInterval = filterByInterval(interval)(timeEntries);
  const orderedByDate = sortWith([ascend(te => te.when)], filteredByInterval);
  const differencesByDate: { [date: number]: number } = {};
  const pairs: { enter: Date; exit: Date }[] = [];

  for (let i = 0; i < orderedByDate.length; i++) {
    const enter = orderedByDate[i];

    if (enter.type === TimeEntryTypes.IN) {
      const [exit, toSkip] = getNearestExit(i, orderedByDate);
      i += toSkip;

      if (!exit.isEmpty()) {
        pairs.push({ enter: enter.when, exit: exit.when });
      } else {
        pairs.push({ enter: enter.when, exit: endOfDay(enter.when) });
      }
    }
  }
  return pairs;
}

export function getDifferencesByRange(timeEntries: TimeEntryListModel[], interval: Interval) {
  const pairs = getEnterExitPairs(timeEntries, interval);

  const differencesByDate: { [date: number]: number } = {};

  for (const { enter, exit } of pairs) {
    const date = getDate(enter);

    const diff = Math.abs(enter.getTime() - exit.getTime());

    differencesByDate[date] = !!differencesByDate[date] ? differencesByDate[date] + diff : diff;
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
  timeEntries: TimeEntryListModel[],
): [TimeEntryListModel, number] {
  let toSkip = 0;
  for (let i = startingIndex + 1; i < timeEntries.length; i++) {
    const nextTimeEntry = timeEntries[i];

    if (nextTimeEntry.type === TimeEntryTypes.OUT) {
      return [nextTimeEntry, toSkip];
    }
    toSkip++;
  }
  return [TimeEntryListModel.empty, toSkip];
}
