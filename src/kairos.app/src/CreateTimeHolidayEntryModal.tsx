import DateFnsUtils from '@date-io/date-fns';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Grid, TextField } from '@material-ui/core';
import { DateTimePicker, MaterialUiPickersDate, MuiPickersUtilsProvider } from '@material-ui/pickers';
import { endOfDay, startOfDay } from 'date-fns';
import React, { ChangeEvent, useCallback, useState } from 'react';
import ButtonSpinner from './components/ButtonSpinner';
import { TimeHolidayEntryModel } from './models/time-holiday-entry.model';
import { UUID } from './models/uuid.model';


export interface CreateTimeHolidayEntryModalInputs {
  isBusy: boolean;
  isOpen: boolean;
}

export interface CreateTimeHolidayEntryModalDispatches {
  onCreate: (model: TimeHolidayEntryModel) => void;
  onClose: () => void;
}

type CreateTimeHolidayEntryModalProps = CreateTimeHolidayEntryModalInputs &
  CreateTimeHolidayEntryModalDispatches;

export const CreateTimeHolidayEntryModalComponent: React.FC<
  CreateTimeHolidayEntryModalProps
> = props => {
  const { isBusy, isOpen, onCreate, onClose } = props;

  const [description, setDescription] = useState<string>('Holiday');
  const [start, setStart] = useState<Date | null>(startOfDay(new Date()));
  const [end, setEnd] = useState<Date | null>(endOfDay(new Date()));

  const handleDescriptionChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => setDescription(event.currentTarget.value),
    [setDescription],
  );
  const handleStartChange = useCallback((date: MaterialUiPickersDate) => setStart(date), [
    setStart,
  ]);
  const handleEndChange = useCallback((date: MaterialUiPickersDate) => setEnd(date), [setEnd]);
  const handleCreate = useCallback(() => {
    if (!!start && !!end) {
      onCreate(new TimeHolidayEntryModel(UUID.Generate(), description, start, end));
    }
  }, [onCreate, description, start, end]);

  return (
    <Dialog open={isOpen} onClose={onClose} aria-labelledby="form-dialog-title">
      <DialogTitle id="form-dialog-title">Create Holiday</DialogTitle>
      <DialogContent>
        <Grid container>
          <Grid item xs={12}>
            <TextField
              autoFocus
              margin="dense"
              id="description"
              label="Description"
              type="text"
              value={description}
              onChange={handleDescriptionChange}
              fullWidth
            />
          </Grid>
          <MuiPickersUtilsProvider utils={DateFnsUtils}>
            <Grid item xs={6}>
              <DateTimePicker
                autoOk
                ampm={false}
                value={start}
                maxDate={end}
                onChange={handleStartChange}
                label="Start"
              />
            </Grid>
            <Grid item xs={6}>
              <DateTimePicker
                autoOk
                ampm={false}
                value={end}
                minDate={start}
                onChange={handleEndChange}
                label="End"
              />
            </Grid>
          </MuiPickersUtilsProvider>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="secondary" disabled={isBusy}>
          Cancel
        </Button>
        <ButtonSpinner
          onClick={handleCreate}
          isBusy={isBusy}
          disabled={!start || !end || start > end || isBusy}
        >
          Create
        </ButtonSpinner>
      </DialogActions>
    </Dialog>
  );
};
