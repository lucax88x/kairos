import { Trans } from '@lingui/macro';
import { makeStyles, Typography } from '@material-ui/core';
import { eachDayOfInterval, endOfMonth, getDate, startOfMonth } from 'date-fns';
import { map } from 'ramda';
import React, { memo, useCallback, useMemo } from 'react';

import { getDifferencesByRange } from '../code/calculator';
import Spinner from '../components/Spinner';
import { TimeEntryListModel } from '../models/time-entry-list.model';


const useStyles = makeStyles(theme => ({
  grid: {
    display: 'grid',
    justifyItems: 'center',
    borderLeft: `1px solid ${theme.palette.primary.main}`,
  },
  headerCell: {
    textAlign: 'center',
    borderRight: `1px solid ${theme.palette.primary.main}`,
    width: '100%',
    padding: theme.spacing(1),
  },
  line: {
    gridColumn: '1 / -1',
    height: 1,
    width: '100%',
    background: theme.palette.primary.main,
  },
}));

export interface TimeEntriesByRangeInputs {
  timeEntries: TimeEntryListModel[];
  isGetTimeEntriesBusy: boolean;
}

export interface TimeEntriesByRangeDispatches {
  onUpdate: (item: TimeEntryListModel) => void;
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
      // const differencesByRange = getDifferencesByRangeByIdAndDate(timeEntries, { start, end });

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
      <Typography component="h2" variant="h6" gutterBottom>
        <Trans>TimeEntriesByRange.Title</Trans>
      </Typography>
      <div
        className={classes.grid}
        style={{ gridTemplateColumns: `repeat(${headerCells.length}, 1fr)` }}
      >
        {headerCells}
        <div className={classes.line} />
        {bodyCells}
      </div>
    </Spinner>
  );
});
