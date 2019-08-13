import {
  Fab,
  Grid,
  makeStyles,
  TableCell,
  TableRow,
  TextField,
  Typography,
} from '@material-ui/core';
import CheckIcon from '@material-ui/icons/Check';
import SaveIcon from '@material-ui/icons/Save';
import { format, isValid, parseISO } from 'date-fns';
import { map, split } from 'ramda';
import indexOf from 'ramda/es/indexOf';
import React, { ChangeEvent, useCallback, useState } from 'react';

import { formatAsDateTime } from '../code/constants';
import FabButtonSpinner from '../components/FabButtonSpinner';
import { VirtualizedTable } from '../components/VirtualizedTable';
import { TimeEntryModel, TimeEntryTypes } from '../models/time-entry.model';
import { UUID } from '../models/uuid.model';
import { Index } from 'react-virtualized';

const useStyles = makeStyles(theme => ({
  scroll: {
    overflow: 'auto',
    height: '250px',
  },
}));

const modelToCells = map<TimeEntryModel, JSX.Element>(timeEntry => (
  <TableRow key={timeEntry.id.toString()}>
    <TableCell>{timeEntry.type}</TableCell>
    <TableCell>{format(timeEntry.when, formatAsDateTime)}</TableCell>
  </TableRow>
));

export interface BulkTimeEntryInsertInputs {
  isBusy: boolean;
}

export interface BulkTimeEntryInsertDispatches {
  onBulkInsert: (models: TimeEntryModel[]) => void;
}

type BulkTimeEntryInsertProps = BulkTimeEntryInsertInputs & BulkTimeEntryInsertDispatches;

export const BulkTimeEntryInsertComponent: React.FC<BulkTimeEntryInsertProps> = props => {
  const classes = useStyles(props);

  const { isBusy, onBulkInsert } = props;

  const [csv, setCsv] = useState('');
  const [models, setModels] = useState<TimeEntryModel[]>([]);

  const handleBulkInsert = useCallback(() => onBulkInsert(models), [onBulkInsert, csv, models]);

  const handleCsvChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => setCsv(event.currentTarget.value),
    [setCsv],
  );

  const handleParse = useCallback(() => {
    const result: TimeEntryModel[] = [];
    if (!!csv) {
      const lines = split('\n', csv);
      const splitByComma = split(',');
      for (const line of lines) {
        const cells = splitByComma(line);
        if (cells.length >= 2) {
          const when = parseISO(cells[0]);
          const type = cells[1];

          if (isValid(when) && indexOf(type, [TimeEntryTypes.IN, TimeEntryTypes.OUT]) !== -1) {
            result.push(new TimeEntryModel(UUID.Generate(), when, type as TimeEntryTypes));
          }
        }
      }
    }
    setModels(result);
  }, [setModels, csv]);

  const noRowsRenderer = useCallback(() => <p>Empty or Invalid CSV</p>, []);
  const rowGetter = useCallback(({ index }: Index) => models[index], [models]);
  const dateFormatter = useCallback((data: Date) => format(data, formatAsDateTime), []);

  return (
    <Grid container spacing={2} direction="column" justify="center">
      <Grid item>
        <Typography component="h1" variant="h6" color="inherit" noWrap>
          Bulk insert of Time Entries (CSV)
        </Typography>
      </Grid>
      <Grid item>
        <TextField
          placeholder="DATE(dd/mm/yyyy hh:MM),TYPE(IN/OUT)"
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
      <Grid item className={classes.scroll}>
        <VirtualizedTable
          rowCount={models.length}
          noRowsRenderer={noRowsRenderer}
          rowGetter={rowGetter}
          columns={[
            {
              width: 100,
              label: 'Type',
              dataKey: 'type',
            },
            {
              width: 200,
              label: 'When',
              dataKey: 'when',
              flexGrow: 1,
              formatter: dateFormatter,
            },
          ]}
        />
      </Grid>
      <Grid item>
        <Grid container justify="center">
          <FabButtonSpinner
            onClick={handleBulkInsert}
            isBusy={isBusy}
            disabled={!models.length || isBusy}
          >
            <SaveIcon />
          </FabButtonSpinner>
        </Grid>
      </Grid>
    </Grid>
  );
};
