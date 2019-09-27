import { t, Trans } from '@lingui/macro';
import { Button, IconButton, makeStyles, Typography } from '@material-ui/core';
import CreateIcon from '@material-ui/icons/Create';
import DeleteIcon from '@material-ui/icons/Delete';
import { format } from 'date-fns';
import React, { useCallback } from 'react';
import { Index } from 'react-virtualized';
import { formatAsDateTime } from '../code/constants';
import Spinner from '../components/Spinner';
import { VirtualizedTable } from '../components/VirtualizedTable';
import { i18n } from '../i18nLoader';
import { getTextFromType, TimeAbsenceEntryModel, TimeAbsenceEntryTypes } from '../models/time-absence-entry.model';

const useStyles = makeStyles(theme => ({
  container: {
    height: '70vh',
    width: '100%',
    marginBottom: theme.spacing(1),
  },
}));

export interface TimeAbsenceEntriesInputs {
  timeAbsenceEntries: TimeAbsenceEntryModel[];
  isGetTimeAbsenceEntriesBusy: boolean;
  isDeleteTimeAbsenceEntryBusy: boolean;
}

export interface TimeAbsenceEntriesDispatches {
  onCreate: () => void;
  onUpdate: (item: TimeAbsenceEntryModel) => void;
  onDelete: (item: TimeAbsenceEntryModel) => void;
}

type TimeAbsenceEntriesProps = TimeAbsenceEntriesInputs & TimeAbsenceEntriesDispatches;

export const TimeAbsenceEntriesComponent: React.FC<TimeAbsenceEntriesProps> = props => {
  const {
    timeAbsenceEntries,
    isGetTimeAbsenceEntriesBusy,
    isDeleteTimeAbsenceEntryBusy,
    onCreate,
    onUpdate,
    onDelete,
  } = props;

  const classes = useStyles(props);

  const handleUpdate = useCallback((model: TimeAbsenceEntryModel) => onUpdate(model), [onUpdate]);
  const handleDelete = useCallback((model: TimeAbsenceEntryModel) => onDelete(model), [onDelete]);

  const noRowsRenderer = useCallback(
    () => <p>{isGetTimeAbsenceEntriesBusy ? '' : <Trans>TimeAbsenceEntries.NoItems</Trans>}</p>,
    [isGetTimeAbsenceEntriesBusy],
  );
  const rowGetter = useCallback(({ index }: Index) => timeAbsenceEntries[index], [
    timeAbsenceEntries,
  ]);
  const typeFormatter = useCallback((type: TimeAbsenceEntryTypes) => getTextFromType(type), []);
  const dateFormatter = useCallback((data: Date) => format(data, formatAsDateTime), []);
  const updateCellRenderer = useCallback(
    model => (
      <IconButton
        color="inherit"
        aria-label={i18n._(t`TimeAbsenceEntries.UpdateTimeAbsenceEntryButton`)}
        onClick={() => handleUpdate(model)}
      >
        <CreateIcon />
      </IconButton>
    ),
    [handleUpdate],
  );
  const deleteCellRenderer = useCallback(
    model => (
      <IconButton
        color="inherit"
        aria-label={i18n._(t`TimeAbsenceEntries.DeleteTimeAbsenceEntryButton`)}
        onClick={() => handleDelete(model)}
      >
        <DeleteIcon />
      </IconButton>
    ),
    [handleDelete],
  );

  return (
    <Spinner show={isGetTimeAbsenceEntriesBusy || isDeleteTimeAbsenceEntryBusy}>
      <Typography component="h2" variant="h6" gutterBottom>
        <Trans>TimeAbsenceEntries.Title</Trans>
      </Typography>
      <div className={classes.container}>
        <VirtualizedTable
          rowCount={timeAbsenceEntries.length}
          noRowsRenderer={noRowsRenderer}
          rowGetter={rowGetter}
          columns={[
            {
              width: 100,
              label: i18n._(t`TimeAbsenceEntries.TypeTableHeader`),
              dataKey: 'type',
              formatter: typeFormatter,
            },
            {
              width: 200,
              label: i18n._(t`TimeAbsenceEntries.StartTableHeader`),
              dataKey: 'start',
              flexGrow: 1,
              formatter: dateFormatter,
            },
            {
              width: 200,
              label: i18n._(t`TimeAbsenceEntries.EndTableHeader`),
              dataKey: 'end',
              flexGrow: 1,
              formatter: dateFormatter,
            },
            {
              width: 200,
              label: i18n._(t`TimeAbsenceEntries.DescriptionTableHeader`),
              dataKey: 'description',
            },
            {
              width: 100,
              label: '',
              dataKey: '',
              cellRenderer: updateCellRenderer,
            },
            {
              width: 100,
              label: '',
              dataKey: '',
              cellRenderer: deleteCellRenderer,
            },
          ]}
        />
      </div>
      <Button variant="contained" color="primary" onClick={onCreate}>
        <Trans>Buttons.Create</Trans>
      </Button>
    </Spinner>
  );
};
