import DateFnsUtils from '@date-io/date-fns';
import { Trans } from '@lingui/macro';
import { makeStyles } from '@material-ui/core';
import {
  KeyboardDateTimePicker,
  MaterialUiPickersDate,
  MuiPickersUtilsProvider,
} from '@material-ui/pickers';
import { endOfDay, startOfDay } from 'date-fns';
import React, { useCallback, useState } from 'react';
import { formatAsDateTime } from '../code/constants';
import { getDatepickerLocale } from '../code/get-datepicker-locale';
import { Language } from '../models/language-model';

const useStyles = makeStyles(theme => ({
  root: {
    display: 'grid',
    gridGap: theme.spacing(1),
  },
  columns: {
    display: 'grid',
    justifyContent: 'center',
    alignItems: 'center',
    gridAutoFlow: 'column',
    gridGap: theme.spacing(3),
  },
}));

export interface NavigatorInputs {
  selectedLanguage: Language;
}

export interface NavigatorDispatches {}

type NavigatorProps = NavigatorInputs & NavigatorDispatches;

export const NavigatorComponent: React.FC<NavigatorProps> = props => {
  const classes = useStyles(props);

  const { selectedLanguage } = props;

  const [start, setStart] = useState<Date | null>(startOfDay(new Date()));
  const [end, setEnd] = useState<Date | null>(endOfDay(new Date()));

  const handleStartChange = useCallback(
    (date: MaterialUiPickersDate) => setStart(date),
    [setStart],
  );
  const handleEndChange = useCallback(
    (date: MaterialUiPickersDate) => setEnd(date),
    [setEnd],
  );

  return (
    <div className={classes.root}>
      <MuiPickersUtilsProvider
        utils={DateFnsUtils}
        locale={getDatepickerLocale(selectedLanguage)}
      >
        <div className={classes.columns}>
          <KeyboardDateTimePicker
            autoOk
            ampm={false}
            value={start}
            maxDate={end}
            onChange={handleStartChange}
            label={<Trans>Start</Trans>}
            invalidDateMessage={<Trans>Invalid Date</Trans>}
            format={formatAsDateTime}
            fullWidth
          />
          <KeyboardDateTimePicker
            autoOk
            ampm={false}
            value={end}
            minDate={start}
            onChange={handleEndChange}
            label={<Trans>End</Trans>}
            invalidDateMessage={<Trans>Invalid Date</Trans>}
            format={formatAsDateTime}
            fullWidth
          />
        </div>
      </MuiPickersUtilsProvider>
    </div>
  );
};
