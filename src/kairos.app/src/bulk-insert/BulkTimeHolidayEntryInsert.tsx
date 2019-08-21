import { Fab, Grid, makeStyles, TextField, Typography } from '@material-ui/core';
import CheckIcon from '@material-ui/icons/Check';
import SaveIcon from '@material-ui/icons/Save';
import { format, isValid, parseISO } from 'date-fns';
import { split } from 'ramda';
import React, { ChangeEvent, useCallback, useState } from 'react';
import { Index } from 'react-virtualized';
import { formatAsDateTime } from '../code/constants';
import { isString } from '../code/is';
import FabButtonSpinner from '../components/FabButtonSpinner';
import { VirtualizedTable } from '../components/VirtualizedTable';
import { TimeHolidayEntryModel } from '../models/time-holiday-entry.model';
import { UUID } from '../models/uuid.model';

interface TimeHolidayEntryInvalidModel {
  start: Date | string;
  end: Date | string;
  description: string;
}

const useStyles = makeStyles(theme => ({
  scroll: {
    overflow: 'auto',
    height: '250px',
  },
}));

export interface BulkTimeHolidayEntryInsertInputs {
  isBusy: boolean;
}

export interface BulkTimeHolidayEntryInsertDispatches {
  onBulkInsert: (models: TimeHolidayEntryModel[]) => void;
}

type BulkTimeHolidayEntryInsertProps = BulkTimeHolidayEntryInsertInputs &
  BulkTimeHolidayEntryInsertDispatches;

export const BulkTimeHolidayEntryInsertComponent: React.FC<
  BulkTimeHolidayEntryInsertProps
> = props => {
  const classes = useStyles(props);

  const { isBusy, onBulkInsert } = props;

  const [csv, setCsv] = useState('');
  const [validModels, setValidModels] = useState<TimeHolidayEntryModel[]>([]);
  const [invalidModels, setInvalidModels] = useState<TimeHolidayEntryInvalidModel[]>([]);

  const handleBulkInsert = useCallback(() => onBulkInsert(validModels), [
    onBulkInsert,
    validModels,
  ]);

  const handleCsvChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => setCsv(event.currentTarget.value),
    [setCsv],
  );

  const handleParse = useCallback(() => {
    const validModels: TimeHolidayEntryModel[] = [];
    const invalidModels: TimeHolidayEntryInvalidModel[] = [];
    if (!!csv) {
      const lines = split('\n', csv);
      const splitByComma = split(',');
      for (let i = 0; i < lines.length; i++) {
        const cells = splitByComma(lines[i]);
        if (cells.length >= 3) {
          const start = parseISO(cells[0]);
          const end = parseISO(cells[1]);
          const description = cells[2];

          const isStartValid = isValid(start);
          const isEndValid = isValid(end);
          if (isStartValid && isEndValid) {
            validModels.push(new TimeHolidayEntryModel(UUID.Generate(), description, start, end));
          } else {
            invalidModels.push({
              description,
              start: isStartValid ? start : 'Invalid Date',
              end: isEndValid ? end : 'Invalid Date',
            });
          }
        }
      }
    }
    setValidModels(validModels);
    setInvalidModels(invalidModels);
  }, [setValidModels, setInvalidModels, csv]);

  const noRowsRenderer = useCallback(() => <p>Empty or Invalid CSV</p>, []);
  const validModelsRowGetter = useCallback(({ index }: Index) => validModels[index], [validModels]);
  const invalidModelsRowGetter = useCallback(({ index }: Index) => invalidModels[index], [
    invalidModels,
  ]);
  const dateFormatter = useCallback((date: Date | string) => {
    if (!isString(date)) {
      return format(date, formatAsDateTime);
    }

    return date;
  }, []);

  return (
    <Grid container spacing={2} direction="column" justify="center">
      <Grid item>
        <Typography component="h1" variant="h6" noWrap>
          Bulk insert of Holidays (CSV)
        </Typography>
      </Grid>
      <Grid item>
        <TextField
          placeholder="START(dd/mm/yyyy hh:MM),END(dd/mm/yyyy hh:MM),DESCRIPTION"
          multiline
          variant="filled"
          rows={4}
          rowsMax={12}
          fullWidth
          value={csv}
          onChange={handleCsvChange}
        />
      </Grid>
      <Grid item>
        <Grid container justify="center">
          <Fab color="primary" onClick={handleParse} disabled={!csv}>
            <CheckIcon />
          </Fab>
        </Grid>
      </Grid>
      {!!validModels.length && (
        <>
          <Grid item>
            <Typography component="h1" variant="h6" noWrap>
              Valid Entries
            </Typography>
          </Grid>
          <Grid item className={classes.scroll}>
            <VirtualizedTable
              rowCount={validModels.length}
              noRowsRenderer={noRowsRenderer}
              rowGetter={validModelsRowGetter}
              columns={[
                {
                  width: 100,
                  label: 'Type',
                  dataKey: 'type',
                },
                {
                  width: 200,
                  label: 'Description',
                  dataKey: 'description',
                },
                {
                  width: 200,
                  label: 'Start',
                  dataKey: 'start',
                  flexGrow: 1,
                  formatter: dateFormatter,
                },
                {
                  width: 200,
                  label: 'End',
                  dataKey: 'end',
                  flexGrow: 1,
                  formatter: dateFormatter,
                },
              ]}
            />
          </Grid>
        </>
      )}
      {!!invalidModels.length && (
        <>
          <Grid item>
            <Typography component="h1" variant="h6" noWrap>
              Invalid Entries
            </Typography>
          </Grid>
          <Grid item className={classes.scroll}>
            <VirtualizedTable
              rowCount={invalidModels.length}
              noRowsRenderer={noRowsRenderer}
              rowGetter={invalidModelsRowGetter}
              columns={[
                {
                  width: 100,
                  label: 'Type',
                  dataKey: 'type',
                },
                {
                  width: 200,
                  label: 'Description',
                  dataKey: 'description',
                },
                {
                  width: 200,
                  label: 'Start',
                  dataKey: 'start',
                  flexGrow: 1,
                  formatter: dateFormatter,
                },
                {
                  width: 200,
                  label: 'End',
                  dataKey: 'end',
                  flexGrow: 1,
                  formatter: dateFormatter,
                },
              ]}
            />
          </Grid>
        </>
      )}
      {!!validModels.length && (
        <Grid item>
          <Grid container justify="center">
            <FabButtonSpinner onClick={handleBulkInsert} isBusy={isBusy} disabled={isBusy}>
              <SaveIcon />
            </FabButtonSpinner>
          </Grid>
        </Grid>
      )}
    </Grid>
  );
};
