import DateFnsUtils from '@date-io/date-fns';
import { Trans } from '@lingui/macro';
import { makeStyles, Typography } from '@material-ui/core';
import InsertDriveFileIcon from '@material-ui/icons/InsertDriveFile';
import {
  KeyboardDateTimePicker,
  MaterialUiPickersDate,
  MuiPickersUtilsProvider,
} from '@material-ui/pickers';
import { endOfMonth, startOfMonth } from 'date-fns';
import React, { useCallback, useState } from 'react';
import { getDatepickerLocale } from '../code/get-datepicker-locale';
import ButtonSpinner from '../components/ButtonSpinner';
import { Language } from '../models/language-model';
import { formatAsDateTime } from '../code/constants';

const useStyles = makeStyles(theme => ({
  rows: {
    display: 'grid',
    justifyContent: 'center',
    alignItems: 'center',
    gridGap: theme.spacing(3),
  },
  columns: {
    display: 'grid',
    justifyContent: 'center',
    alignItems: 'center',
    gridAutoFlow: 'column',
    gridGap: theme.spacing(3),
  },
}));

export interface ExportTimeAbsenceEntriesInputs {
  selectedLanguage: Language;
  isBusy: boolean;
}

export interface ExportTimeAbsenceEntriesDispatches {
  onExport: (start: Date, end: Date) => void;
}

type ExportTimeAbsenceEntriesProps = ExportTimeAbsenceEntriesInputs & ExportTimeAbsenceEntriesDispatches;

export const ExportTimeAbsenceEntriesComponent: React.FC<ExportTimeAbsenceEntriesProps> = props => {
  const classes = useStyles(props);

  const { selectedLanguage, isBusy, onExport } = props;

  const [start, setStart] = useState<Date | null>(startOfMonth(new Date()));
  const [end, setEnd] = useState<Date | null>(endOfMonth(new Date()));

  const handleStartChange = useCallback((date: MaterialUiPickersDate) => setStart(date), [
    setStart,
  ]);
  const handleEndChange = useCallback((date: MaterialUiPickersDate) => setEnd(date), [setEnd]);

  const handleExport = useCallback(() => onExport(start as Date, end as Date), [
    onExport,
    start,
    end,
  ]);

  return (
    <div className={classes.rows}>
      <Typography component="h1" variant="h6" noWrap>
        <Trans>ExportTimeAbsenceEntries.Title</Trans>
      </Typography>
      <MuiPickersUtilsProvider utils={DateFnsUtils} locale={getDatepickerLocale(selectedLanguage)}>
        <div className={classes.columns}>
          <KeyboardDateTimePicker
            autoOk
            ampm={false}
            value={start}
            maxDate={end}
            onChange={handleStartChange}
            label={<Trans>Labels.Start</Trans>}
            invalidDateMessage={<Trans>Validation.InvalidDate</Trans>}
            format={formatAsDateTime}
            fullWidth
          />
          <KeyboardDateTimePicker
            autoOk
            ampm={false}
            value={end}
            minDate={start}
            onChange={handleEndChange}
            label={<Trans>Labels.End</Trans>}
            invalidDateMessage={<Trans>Validation.InvalidDate</Trans>}
            format={formatAsDateTime}
            fullWidth
          />
        </div>
      </MuiPickersUtilsProvider>
      <ButtonSpinner onClick={handleExport} isBusy={isBusy} disabled={isBusy || !start || !end}>
        <InsertDriveFileIcon />
        <Trans>ExportTimeAbsenceEntries.Export</Trans>
      </ButtonSpinner>
    </div>
  );
};
