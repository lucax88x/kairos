import { endOfDay, startOfDay } from 'date-fns';
import produce from 'immer';
import { useReducer } from 'react';
import { action, ActionType } from 'typesafe-actions';
import { TimeAbsenceEntryModel, TimeAbsenceEntryTypes } from '../models/time-absence-entry.model';
import { UUID } from '../models/uuid.model';

export interface State {
  id: UUID;
  type: TimeAbsenceEntryTypes;
  description: string;
  start: Date;
  end: Date;
}

const initialState: State = {
  id: UUID.Generate(),
  type: TimeAbsenceEntryTypes.VACATION,
  description: '',
  start: startOfDay(new Date()),
  end: endOfDay(new Date()),
};

export const SetModel = (model: TimeAbsenceEntryModel) => action('SET_MODEL', { model });
export const SetTimeAbsenceEntryTypeAction = (type: TimeAbsenceEntryTypes) =>
  action('SET_TYPE', { type });
export const SetTimeAbsenceEntryDescriptionAction = (description: string) =>
  action('SET_DESCRIPTION', { description });
export const SetTimeAbsenceEntryStartAction = (start: Date) => action('SET_START', { start });
export const SetTimeAbsenceEntryEndAction = (end: Date) => action('SET_END', { end });

function reducer(
  state: State,
  action: ActionType<
    | typeof SetModel
    | typeof SetTimeAbsenceEntryTypeAction
    | typeof SetTimeAbsenceEntryDescriptionAction
    | typeof SetTimeAbsenceEntryStartAction
    | typeof SetTimeAbsenceEntryEndAction
  >,
): State {
  return produce(state, draft => {
    switch (action.type) {
      case 'SET_MODEL': {
        draft.id = action.payload.model.id;
        draft.description = action.payload.model.description;
        draft.start = action.payload.model.start;
        draft.end = action.payload.model.end;
        draft.type = action.payload.model.type;
        break;
      }
      case 'SET_TYPE': {
        draft.type = action.payload.type;
        break;
      }
      case 'SET_DESCRIPTION': {
        draft.description = action.payload.description;
        break;
      }
      case 'SET_START': {
        draft.start = action.payload.start;
        break;
      }
      case 'SET_END': {
        draft.end = action.payload.end;
        break;
      }
    }
  });
}

export const useTimeAbsenceEntryFormReducer = () => useReducer(reducer, initialState);
