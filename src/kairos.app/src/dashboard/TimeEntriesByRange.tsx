import { Button, makeStyles } from '@material-ui/core';
import KeyboardArrowLeftIcon from '@material-ui/icons/KeyboardArrowLeft';
import KeyboardArrowRightIcon from '@material-ui/icons/KeyboardArrowRight';
import clsx from 'clsx';
import { eachDayOfInterval, endOfMonth, format, getDate, getMonth, getUnixTime, isEqual, setMonth, setYear, startOfDay, startOfMonth } from 'date-fns';
import { map } from 'ramda';
import React, { memo, useCallback, useMemo, useState } from 'react';
import { getDifferencesByRangeByJobAndDate, getHumanDifferencesByRange } from '../code/calculator';
import { dateFormatterLocales } from '../code/formatters';
import { humanDifference } from '../code/humanDifference';
import Spinner from '../components/Spinner';
import { JobModel } from '../models/job.model';
import { Language } from '../models/language-model';
import { ProfileModel } from '../models/profile.model';
import { TimeEntryListModel } from '../models/time-entry-list.model';

const useStyles = makeStyles(theme => ({
  container: {
    width: '100%',
    display: 'grid',
    gridGap: theme.spacing(1),
  },
  header: {
    display: 'grid',
    gridAutoFlow: 'column',
  },
  actionButtons: {
    display: 'grid',
    justifySelf: 'right',
    justifyItems: 'center',
    alignItems: 'center',
    gridAutoFlow: 'column',
    gridGap: theme.spacing(1),
  },
  grid: {
    display: 'grid',
    justifyItems: 'center',
    borderLeft: `1px solid ${theme.palette.primary.main}`,

    overflow: 'auto',
  },
  headerCell: {
    textAlign: 'center',
    borderRight: `1px solid ${theme.palette.primary.main}`,
    width: '100%',
    padding: theme.spacing(1),
  },
  isCurrentDay: {
    textDecoration: 'underline',
  },
  line: {
    gridColumn: '1 / -1',
    height: 1,
    width: '100%',
    background: theme.palette.primary.main,
  },
}));

export interface TimeEntriesByRangeInputs {
  profile: ProfileModel;
  selectedLanguage: Language;
  selectedYear: number;
  timeEntries: TimeEntryListModel[];
  isGetTimeEntriesBusy: boolean;
}

export interface TimeEntriesByRangeDispatches {
  onUpdate: (item: TimeEntryListModel) => void;
}

type TimeEntriesByRangeProps = TimeEntriesByRangeInputs &
  TimeEntriesByRangeDispatches;

export const TimeEntriesByRangeComponent: React.FC<TimeEntriesByRangeProps> = memo(
  props => {
    const classes = useStyles(props);

    const {
      selectedLanguage,
      selectedYear,
      timeEntries,
      profile,
      isGetTimeEntriesBusy,
    } = props;

    const selectedYearDate = setYear(new Date(), selectedYear);
    const [currentMonth, setCurrentMonth] = useState(
      getMonth(selectedYearDate),
    );

    const handlePreviousMonth = useCallback(
      () => setCurrentMonth(currentMonth - 1),
      [currentMonth, setCurrentMonth],
    );
    const handleNextMonth = useCallback(
      () => setCurrentMonth(currentMonth + 1),
      [currentMonth, setCurrentMonth],
    );

    const currentMonthDaysToHeaderCells = useCallback(
      (date: Date) => {
        const today = startOfDay(new Date());
        const start = startOfMonth(date);
        const end = endOfMonth(date);

        const days = eachDayOfInterval({ start, end });

        const dateCells = map<Date, JSX.Element>(day => (
          <div
            key={day.getDate()}
            className={clsx(
              classes.headerCell,
              isEqual(day, today) && classes.isCurrentDay,
            )}
          >
            {getDate(day)}
          </div>
        ))(days);

        return [
          <div key="job" className={classes.headerCell}></div>,
          ...dateCells,
          <div key="total" className={classes.headerCell}></div>,
        ];
      },
      [classes],
    );

    const currentMonthDaysToBodyCells = useCallback(
      (date: Date) => {
        const start = startOfMonth(date);
        const end = endOfMonth(date);

        const differencesByRangeByJobAndDate = getDifferencesByRangeByJobAndDate(
          timeEntries,
          {
            start,
            end,
          },
        );

        const humanDifferencesByRangeByJob = getHumanDifferencesByRange(
          timeEntries,
          { start, end },
        );
        const days = eachDayOfInterval({ start, end });

        return map<JobModel, JSX.Element | null>(job => {
          const differencesByRangeAndDate =
            differencesByRangeByJobAndDate[job.id.toString()];
          const humanDifferencesByRange =
            humanDifferencesByRangeByJob[job.id.toString()];

          if (!humanDifferencesByRange || !differencesByRangeAndDate) {
            return null;
          }

          let total = 0;
          for (const unix in differencesByRangeAndDate) {
            total += differencesByRangeAndDate[unix];
          }

          const humanTotal = humanDifference(new Date(0), new Date(total));

          const dayCells = map<Date, JSX.Element>(day => {
            const unixTime = getUnixTime(day);
            return (
              <div key={unixTime} className={classes.headerCell}>
                {!!humanDifferencesByRange[unixTime] &&
                  humanDifferencesByRange[unixTime]}
              </div>
            );
          })(days);

          return (
            <React.Fragment key={job.id.toString()}>
              <div className={classes.line} />
              <div className={classes.headerCell}>{job.name}</div>
              {dayCells}
              <div className={classes.headerCell}>{humanTotal}</div>
            </React.Fragment>
          );
        }, profile.jobs);
      },
      [timeEntries, profile, classes],
    );

    const headerCells = useMemo(
      () =>
        currentMonthDaysToHeaderCells(setMonth(selectedYearDate, currentMonth)),
      [currentMonthDaysToHeaderCells, selectedYearDate, currentMonth],
    );
    const bodyCells = useMemo(
      () =>
        currentMonthDaysToBodyCells(setMonth(selectedYearDate, currentMonth)),
      [currentMonthDaysToBodyCells, selectedYearDate, currentMonth],
    );

    return (
      <Spinner show={isGetTimeEntriesBusy}>
        <div className={classes.container}>
          <div className={classes.header}>
            <div className={classes.actionButtons}>
              <span>
                {format(setMonth(selectedYearDate, currentMonth), 'MMMM yyyy', {
                  locale: dateFormatterLocales[selectedLanguage],
                })}
              </span>
              <Button
                onClick={handlePreviousMonth}
                disabled={currentMonth <= 0}
              >
                <KeyboardArrowLeftIcon></KeyboardArrowLeftIcon>
              </Button>
              <Button onClick={handleNextMonth} disabled={currentMonth >= 11}>
                <KeyboardArrowRightIcon></KeyboardArrowRightIcon>
              </Button>
            </div>
          </div>
          <div
            className={classes.grid}
            style={{
              gridTemplateColumns: `repeat(${headerCells.length}, 1fr)`,
            }}
          >
            {headerCells}
            {bodyCells}
          </div>
        </div>
      </Spinner>
    );
  },
);
