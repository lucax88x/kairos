import { endOfYear, setYear, startOfYear, getUnixTime, fromUnixTime } from 'date-fns';
import { ProfileModel } from '../models/profile.model';
import { TimeEntryListModel } from '../models/time-entry-list.model';
import { getDifferencesByRangeByJobAndDate } from './calculator';
import { findJobsInRange } from './functions';
import { JobModel } from '../models/job.model';
import { keys } from 'ramda';

export function getAverageWorkingHoursByDay(
  selectedYear: number,
  profile: ProfileModel,
  entries: TimeEntryListModel[],
) {
  const selectedYearDate = setYear(new Date(), selectedYear);

  const selectedYearStart = startOfYear(selectedYearDate);
  const selectedYearEnd = endOfYear(selectedYearDate);

  const yearDifferencesByDateByJob = getDifferencesByRangeByJobAndDate(
    entries,
    {
      start: selectedYearStart,
      end: selectedYearEnd,
    },
  );

  const jobsInRange = findJobsInRange(
    selectedYearStart,
    selectedYearEnd,
  )(profile.jobs);

  for (const job of jobsInRange) {
    const averageWorkingHours = JobModel.getAverageWorkingHours(job);
    const yearDifferencesByDate = yearDifferencesByDateByJob[job.id.toString()];

    const dates = keys(yearDifferencesByDate);

    for(const date of dates){
      console.log(fromUnixTime(date));
      console.log(yearDifferencesByDate[date]);
    }
  }
}
