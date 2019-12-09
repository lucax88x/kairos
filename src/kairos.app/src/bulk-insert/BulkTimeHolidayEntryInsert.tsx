import { t, Trans } from '@lingui/macro';
import {
  Fab,
  Grid,
  makeStyles,
  TextField,
  Typography,
} from '@material-ui/core';
import CheckIcon from '@material-ui/icons/Check';
import SaveIcon from '@material-ui/icons/Save';
import { isValid, parseISO } from 'date-fns';
import { map, split } from 'ramda';
import React, { ChangeEvent, useCallback, useState } from 'react';
import { Index } from 'react-virtualized';
import { dateTimeFormatter } from '../code/formatters';
import FabButtonSpinner from '../components/FabButtonSpinner';
import { VirtualizedTable } from '../components/VirtualizedTable';
import { i18n } from '../i18nLoader';
import { TimeHolidayEntryModel } from '../models/time-holiday-entry.model';
import { UUID } from '../models/uuid.model';

interface TimeHolidayEntryInvalidModel {
  id: UUID;
  when: Date | string;
  description: string;
}

const useStyles = makeStyles(theme => ({
  center: {
    display: 'grid',
    justifyContent: 'center',
  },
}));

export interface BulkTimeHolidayEntryInsertInputs {
  isOnline: boolean;
  isBusy: boolean;
}

export interface BulkTimeHolidayEntryInsertDispatches {
  onBulkInsert: (models: TimeHolidayEntryModel[]) => void;
}

type BulkTimeHolidayEntryInsertProps = BulkTimeHolidayEntryInsertInputs &
  BulkTimeHolidayEntryInsertDispatches;

export const BulkTimeHolidayEntryInsertComponent: React.FC<BulkTimeHolidayEntryInsertProps> = props => {
  const classes = useStyles(props);

  const { isOnline, isBusy, onBulkInsert } = props;

  const [csv, setCsv] = useState('');
  const [validModels, setValidModels] = useState<TimeHolidayEntryModel[]>([]);
  const [invalidModels, setInvalidModels] = useState<
    TimeHolidayEntryInvalidModel[]
  >([]);

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
        if (cells.length >= 2) {
          const when = parseISO(cells[0]);
          const description = cells[1];

          const isWhenValid = isValid(when);
          if (isWhenValid) {
            validModels.push(
              new TimeHolidayEntryModel(UUID.Generate(), description, when),
            );
          } else {
            invalidModels.push({
              id: UUID.Generate(),
              description,
              when: isWhenValid ? when : i18n._(t`Invalid Date`),
            });
          }
        } else {
          invalidModels.push({
            id: UUID.Generate(),
            description: '',
            when: i18n._(t`Invalid Date`),
          });
        }
      }
    }
    setValidModels(validModels);
    setInvalidModels(invalidModels);
  }, [setValidModels, setInvalidModels, csv]);

  const noRowsRenderer = useCallback(() => <p>Empty or Invalid CSV</p>, []);
  const validModelsRowGetter = useCallback(
    ({ index }: Index) => validModels[index],
    [validModels],
  );
  const invalidModelsRowGetter = useCallback(
    ({ index }: Index) => invalidModels[index],
    [invalidModels],
  );

  return (
    <Grid container spacing={2} direction="column" justify="center">
      <Grid item>
        <Typography component="h1" variant="h6" noWrap>
          <Trans>Holidays</Trans>
        </Typography>
      </Grid>
      <Grid item>
        <TextField
          placeholder="WHEN(dd/mm/yyyy hh:MM), DESCRIPTION"
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
            <VirtualizedTable
              title={i18n._(t`Valid Entries`)}
              height="250px"
              rowCount={validModels.length}
              rowIds={map(m => m.id.toString(), validModels)}
              noRowsRenderer={noRowsRenderer}
              rowGetter={validModelsRowGetter}
              columns={[
                {
                  width: 200,
                  label: i18n._(
                    t`Description`,
                  ),
                  dataKey: 'description',
                },
                {
                  width: 200,
                  label: i18n._(t`Invalid Entries`),
                  dataKey: 'when',
                  flexGrow: 1,
                  formatter: dateTimeFormatter,
                },
              ]}
            />
          </Grid>
        </>
      )}
      {!!invalidModels.length && (
        <>
          <Grid item>
            <VirtualizedTable
              title={i18n._(t`Invalid Entries`)}
              height="250px"
              rowCount={invalidModels.length}
              rowIds={map(m => m.id.toString(), invalidModels)}
              noRowsRenderer={noRowsRenderer}
              rowGetter={invalidModelsRowGetter}
              columns={[
                {
                  width: 200,
                  label: i18n._(
                    t`Description`,
                  ),
                  dataKey: 'description',
                },
                {
                  width: 200,
                  label: i18n._(t`Invalid Entries`),
                  dataKey: 'when',
                  flexGrow: 1,
                  formatter: dateTimeFormatter,
                },
              ]}
            />
          </Grid>
        </>
      )}
      {!!validModels.length && (
        <Grid item className={classes.center}>
          <FabButtonSpinner
            onClick={handleBulkInsert}
            isBusy={isBusy}
            disabled={!isOnline || isBusy}
          >
            <SaveIcon />
          </FabButtonSpinner>
        </Grid>
      )}
    </Grid>
  );
};
