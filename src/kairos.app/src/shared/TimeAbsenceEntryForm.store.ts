import { endOfDay, isWithinInterval, startOfDay } from 'date-fns';
import produce from 'immer';
import { filter, find, head } from 'ramda';
import { useReducer } from 'react';
import { action, ActionType } from 'typesafe-actions';
import { JobModel } from '../models/job.model';
import { ProfileModel } from '../models/profile.model';
import {
  TimeAbsenceEntryModel,
  TimeAbsenceEntryTypes,
} from '../models/time-absence-entry.model';
import { UUID } from '../models/uuid.model';

export interface State {
  id: UUID;
  type: TimeAbsenceEntryTypes;
  description: string;
  start: Date;
  end: Date;

  jobs: JobModel[];
  selectedJobId: string;
}

const initialState: State = {
  id: UUID.Generate(),
  type: TimeAbsenceEntryTypes.VACATION,
  description: '',
  start: startOfDay(new Date()),
  end: endOfDay(new Date()),

  jobs: [],
  selectedJobId: UUID.Empty,
};

export const SetModel = (model: TimeAbsenceEntryModel) =>
  action('SET_MODEL', { model });
export const ResetModel = () => action('RESET_MODEL');
export const RefreshSelectsTimeAbsenceEntryAction = (profile: ProfileModel) =>
  action('REFRESH_SELECTS', { profile });
export const SetTimeAbsenceEntryTypeAction = (type: TimeAbsenceEntryTypes) =>
  action('SET_TYPE', { type });
export const SetTimeAbsenceEntryDescriptionAction = (description: string) =>
  action('SET_DESCRIPTION', { description });
export const SetTimeAbsenceEntryStartAction = (start: Date) =>
  action('SET_START', { start });
export const SetTimeAbsenceEntryEndAction = (end: Date) =>
  action('SET_END', { end });
export const SetTimeAbsenceEntrySelectedJobAction = (jobId: string) =>
  action('SET_SELECTED_JOB', { jobId });

function reducer(
  state: State,
  action: ActionType<
    | typeof SetModel
    | typeof ResetModel
    | typeof RefreshSelectsTimeAbsenceEntryAction
    | typeof SetTimeAbsenceEntryTypeAction
    | typeof SetTimeAbsenceEntryDescriptionAction
    | typeof SetTimeAbsenceEntryStartAction
    | typeof SetTimeAbsenceEntryEndAction
    | typeof SetTimeAbsenceEntrySelectedJobAction
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
        draft.selectedJobId = action.payload.model.job.toString();
        break;
      }
      case 'RESET_MODEL': {
        draft.id = UUID.Generate();
        draft.description = '';
        draft.type = TimeAbsenceEntryTypes.VACATION;
        draft.start = startOfDay(new Date());
        draft.end = endOfDay(new Date());
        break;
      }
      case 'REFRESH_SELECTS': {
        draft.jobs = [];

        const maxDate = new Date(8640000000000000);
        const date = !!state.start ? state.start : new Date();
        const jobs = filter(
          job =>
            isWithinInterval(date, {
              start: job.start,
              end: !!job.end ? job.end : maxDate,
            }),
          action.payload.profile.jobs,
        );

        draft.jobs = jobs;

        let selectedJob = find(
          j => j.id.toString() === state.selectedJobId,
          jobs,
        );
        if (!selectedJob) {
          selectedJob = head(jobs);
        }

        if (!!selectedJob) {
          draft.selectedJobId = selectedJob.id.toString();
        }

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
      case 'SET_SELECTED_JOB': {
        draft.selectedJobId = action.payload.jobId;
        break;
      }
    }
  });
}

export const useTimeAbsenceEntryFormReducer = () =>
  useReducer(reducer, initialState);
