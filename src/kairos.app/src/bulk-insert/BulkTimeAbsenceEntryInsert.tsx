import { t, Trans } from '@lingui/macro';
import { Fab, Grid, makeStyles, TextField, Typography } from '@material-ui/core';
import CheckIcon from '@material-ui/icons/Check';
import SaveIcon from '@material-ui/icons/Save';
import { format, isValid, parseISO } from 'date-fns';
import { split } from 'ramda';
import indexOf from 'ramda/es/indexOf';
import React, { ChangeEvent, useCallback, useState } from 'react';
import { Index } from 'react-virtualized';
import { formatAsDateTime } from '../code/constants';
import { isString } from '../code/is';
import FabButtonSpinner from '../components/FabButtonSpinner';
import { VirtualizedTable } from '../components/VirtualizedTable';
import { i18n } from '../i18nLoader';
import { TimeAbsenceEntryModel, TimeAbsenceEntryTypes } from '../models/time-absence-entry.model';
import { UUID } from '../models/uuid.model';

interface TimeAbsenceEntryInvalidModel {
  start: Date | string;
  end: Date | string;
  description: string;
  type: TimeAbsenceEntryTypes | string;
}

const useStyles = makeStyles(theme => ({
  scroll: {
    overflow: 'auto',
    height: '250px',
  },
  center: {
    display: 'flex',
    justifyContent: 'center',
  },
}));

export interface BulkTimeAbsenceEntryInsertInputs {
  isBusy: boolean;
}

export interface BulkTimeAbsenceEntryInsertDispatches {
  onBulkInsert: (models: TimeAbsenceEntryModel[]) => void;
}

type BulkTimeAbsenceEntryInsertProps = BulkTimeAbsenceEntryInsertInputs &
  BulkTimeAbsenceEntryInsertDispatches;

export const BulkTimeAbsenceEntryInsertComponent: React.FC<
  BulkTimeAbsenceEntryInsertProps
> = props => {
  const classes = useStyles(props);

  const { isBusy, onBulkInsert } = props;

  const [csv, setCsv] = useState('');
  const [validModels, setValidModels] = useState<TimeAbsenceEntryModel[]>([]);
  const [invalidModels, setInvalidModels] = useState<TimeAbsenceEntryInvalidModel[]>([]);

  const handleBulkInsert = useCallback(() => onBulkInsert(validModels), [
    onBulkInsert,
    validModels,
  ]);

  const handleCsvChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => setCsv(event.currentTarget.value),
    [setCsv],
  );

  const handleParse = useCallback(() => {
    const validModels: TimeAbsenceEntryModel[] = [];
    const invalidModels: TimeAbsenceEntryInvalidModel[] = [];
    if (!!csv) {
      const lines = split('\n', csv);
      const splitByComma = split(',');
      for (let i = 0; i < lines.length; i++) {
        const cells = splitByComma(lines[i]);
        if (cells.length >= 4) {
          const start = parseISO(cells[0]);
          const end = parseISO(cells[1]);
          const description = cells[2];
          const type = cells[3];

          const isStartValid = isValid(start);
          const isEndValid = isValid(end);
          const isTypeValid =
            indexOf(type, [TimeAbsenceEntryTypes.VACATION, TimeAbsenceEntryTypes.ILLNESS]) !== -1;
          if (isStartValid && isEndValid && isTypeValid) {
            validModels.push(
              new TimeAbsenceEntryModel(
                UUID.Generate(),
                description,
                start,
                end,
                type as TimeAbsenceEntryTypes,
              ),
            );
          } else {
            invalidModels.push({
              description,
              start: isStartValid ? start : i18n._(t`Validation.InvalidDate`),
              end: isEndValid ? end : i18n._(t`Validation.InvalidDate`),
              type: isTypeValid
                ? (type as TimeAbsenceEntryTypes)
                : i18n._(t`Validation.InvalidType`),
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
          <Trans>BulkTimeAbsenceEntryInsert.Title</Trans>
        </Typography>
      </Grid>
      <Grid item>
        <TextField
          placeholder="START(dd/mm/yyyy hh:MM),END(dd/mm/yyyy hh:MM),DESCRIPTION,TYPE(VACATION/ILLNESS)"
          multiline
          variant="filled"
          rows={4}
          rowsMax={12}
          fullWidth
          value={csv}
          onChange={handleCsvChange}
        />
      </Grid>
      <Grid item className={classes.center}>
        <Fab color="primary" onClick={handleParse} disabled={!csv}>
          <CheckIcon />
        </Fab>
      </Grid>
      {!!validModels.length && (
        <>
          <Grid item>
            <Typography component="h1" variant="h6" noWrap>
              <Trans>BulkTimeAbsenceEntryInsert.ValidEntries</Trans>
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
                  label: i18n._(t`BulkTimeAbsenceEntryInsert.TypeTableHeader`),
                  dataKey: 'type',
                },
                {
                  width: 200,
                  label: i18n._(t`BulkTimeAbsenceEntryInsert.DescriptionTableHeader`),
                  dataKey: 'description',
                },
                {
                  width: 200,
                  label: i18n._(t`BulkTimeAbsenceEntryInsert.StartTableHeader`),
                  dataKey: 'start',
                  flexGrow: 1,
                  formatter: dateFormatter,
                },
                {
                  width: 200,
                  label: i18n._(t`BulkTimeAbsenceEntryInsert.EndTableHeader`),
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
              <Trans>BulkTimeAbsenceEntryInsert.InvalidEntries</Trans>
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
                  label: i18n._(t`BulkTimeAbsenceEntryInsert.TypeTableHeader`),
                  dataKey: 'type',
                },
                {
                  width: 200,
                  label: i18n._(t`BulkTimeAbsenceEntryInsert.DescriptionTableHeader`),
                  dataKey: 'description',
                },
                {
                  width: 200,
                  label: i18n._(t`BulkTimeAbsenceEntryInsert.StartTableHeader`),
                  dataKey: 'start',
                  flexGrow: 1,
                  formatter: dateFormatter,
                },
                {
                  width: 200,
                  label: i18n._(t`BulkTimeAbsenceEntryInsert.EndTableHeader`),
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
        <Grid item className={classes.center}>
          <FabButtonSpinner onClick={handleBulkInsert} isBusy={isBusy} disabled={isBusy}>
            <SaveIcon />
          </FabButtonSpinner>
        </Grid>
      )}
    </Grid>
  );
};
