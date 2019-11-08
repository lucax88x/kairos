import { isWithinInterval } from 'date-fns';
import produce from 'immer';
import { filter, find, head } from 'ramda';
import { useReducer } from 'react';
import { action, ActionType } from 'typesafe-actions';
import { JobModel } from '../models/job.model';
import { ProfileModel } from '../models/profile.model';
import { TimeEntryModel, TimeEntryTypes } from '../models/time-entry.model';
import { UUID } from '../models/uuid.model';


export interface State {
  id: UUID;
  type: TimeEntryTypes;
  when: Date;

  jobs: JobModel[];
  selectedJobId: string;
}

const initialState: State = {
  id: UUID.Generate(),
  type: TimeEntryTypes.IN,
  when: new Date(),
  jobs: [],
  selectedJobId: UUID.Empty,
};

export const SetModel = (model: TimeEntryModel) => action('SET_MODEL', { model });
export const ResetModel = () => action('RESET_MODEL');
export const RefreshSelectsTimeEntryAction = (profile: ProfileModel) =>
  action('REFRESH_SELECTS', { profile });
export const SetTimeEntryTypeAction = (type: TimeEntryTypes) => action('SET_TYPE', { type });
export const SetTimeEntryWhenAction = (when: Date) => action('SET_WHEN', { when });
export const SetTimeEntrySelectedJobAction = (jobId: string) =>
  action('SET_SELECTED_JOB', { jobId });

function reducer(
  state: State,
  action: ActionType<
    | typeof SetModel
    | typeof ResetModel
    | typeof RefreshSelectsTimeEntryAction
    | typeof SetTimeEntryTypeAction
    | typeof SetTimeEntryWhenAction
    | typeof SetTimeEntrySelectedJobAction
  >,
): State {
  return produce(state, draft => {
    switch (action.type) {
      case 'SET_MODEL': {
        draft.id = action.payload.model.id;
        draft.selectedJobId = action.payload.model.job.toString();
        draft.when = action.payload.model.when;
        draft.type = action.payload.model.type;
        break;
      }
      case 'RESET_MODEL': {
        draft.id = UUID.Generate();
        draft.when = new Date();
        draft.type = TimeEntryTypes.IN;
        break;
      }
      case 'REFRESH_SELECTS': {
        draft.jobs = [];

        const maxDate = new Date(8640000000000000);
        const date = !!state.when ? state.when : new Date();
        const jobs = filter(
          job =>
            isWithinInterval(date, {
              start: job.start,
              end: !!job.end ? job.end : maxDate,
            }),
          action.payload.profile.jobs,
        );

        draft.jobs = jobs;

        let selectedJob = find(j => j.id.toString() === state.selectedJobId, jobs);
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
      case 'SET_WHEN': {
        draft.when = action.payload.when;
        break;
      }
      case 'SET_SELECTED_JOB': {
        draft.selectedJobId = action.payload.jobId;
        break;
      }
    }
  });
}

export const useTimeEntryFormReducer = () => useReducer(reducer, initialState);
