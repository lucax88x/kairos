import { makeStyles, Typography } from '@material-ui/core';
import { eachDayOfInterval, endOfMonth, getDate, startOfMonth } from 'date-fns';
import { map } from 'ramda';
import React, { memo, useCallback, useMemo } from 'react';

import { getDifferencesByRange } from '../code/calculator';
import Spinner from '../components/Spinner';
import { TimeEntryModel } from '../models/time-entry.model';

const useStyles = makeStyles(theme => ({
  grid: {
    display: 'grid',
    gridTemplateRows: '1fr 1fr',
    // gridGap: theme.spacing(2),
    justifyItems: 'center',
    // alignItems: 'center',
  },
  headerCell: {
    borderBottom: `1px solid ${theme.palette.primary.main}`,
    // padding: theme.spacing(1)
  },
}));

export interface TimeEntriesByRangeInputs {
  timeEntries: TimeEntryModel[];
  isGetTimeEntriesBusy: boolean;
}

export interface TimeEntriesByRangeDispatches {
  onUpdate: (item: TimeEntryModel) => void;
}

type TimeEntriesByRangeProps = TimeEntriesByRangeInputs & TimeEntriesByRangeDispatches;

export const TimeEntriesByRangeComponent: React.FC<TimeEntriesByRangeProps> = memo(props => {
  const classes = useStyles(props);

  const { timeEntries, isGetTimeEntriesBusy } = props;

  const monthDaysToHeaderCells = useCallback(
    (date: Date) => {
      const start = startOfMonth(date);
      const end = endOfMonth(date);

      const days = eachDayOfInterval({ start, end });

      return map<Date, JSX.Element>(day => (
        <div key={day.getDate()} className={classes.headerCell}>
          {getDate(day)}
        </div>
      ))(days);
    },
    [classes],
  );

  const monthDaysToBodyCells = useCallback(
    (date: Date) => {
      const start = startOfMonth(date);
      const end = endOfMonth(date);

      const differencesByRange = getDifferencesByRange(timeEntries, { start, end });

      const days = eachDayOfInterval({ start, end });

      return map<Date, JSX.Element>(day => (
        <div key={day.getDate()} className={classes.headerCell}>
          {!!differencesByRange[day.getDate()] && differencesByRange[day.getDate()]}
        </div>
      ))(days);
    },
    [timeEntries, classes],
  );

  const headerCells = useMemo(() => monthDaysToHeaderCells(new Date()), [monthDaysToHeaderCells]);
  const bodyCells = useMemo(() => monthDaysToBodyCells(new Date()), [monthDaysToBodyCells]);

  return (
    <Spinner show={isGetTimeEntriesBusy}>
      <Typography component="h2" variant="h6" color="primary" gutterBottom>
        Time Entries
      </Typography>
      <div
        className={classes.grid}
        style={{ gridTemplateColumns: `repeat(${headerCells.length}, auto)` }}
      >
        {headerCells}
        {bodyCells}
      </div>
    </Spinner>
  );
});
