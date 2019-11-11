import produce from 'immer';
import { useReducer } from 'react';
import { action, ActionType } from 'typesafe-actions';
import { indexById } from '../code/ramda.curried';
import { JobModel } from '../models/job.model';
import { UUID } from '../models/uuid.model';

export interface State {
  jobs: JobModel[];
}
const initialState: State = { jobs: [] };

export const InitializeJobsAction = (jobs: JobModel[]) => action('INITIALIZE_JOBS', { jobs });
export const AddJobAction = () => action('ADD_JOB');
export const DeleteJobAction = (jobId: UUID) => action('DELETE_JOB', { jobId });
export const UpdateJobNameAction = (jobId: UUID, name: string) =>
  action('UPDATE_JOB_NAME', { jobId, name });
export const UpdateJobStartDateAction = (jobId: UUID, start: Date) =>
  action('UPDATE_JOB_START_DATE', { jobId, start });
export const UpdateJobEndDateAction = (jobId: UUID, end: Date | null) =>
  action('UPDATE_JOB_END_DATE', { jobId, end });
export const UpdateJobHolidaysPerYearAction = (jobId: UUID, days: number) =>
  action('UPDATE_JOB_HOLIDAYS_PER_YEAR', { jobId, days });
export const UpdateJobDayAction = (jobId: UUID, day: string, hours: number) =>
  action('UPDATE_JOB_DAY', { jobId, day, hours });

function reducer(
  state: State,
  action: ActionType<
    | typeof InitializeJobsAction
    | typeof AddJobAction
    | typeof DeleteJobAction
    | typeof UpdateJobNameAction
    | typeof UpdateJobStartDateAction
    | typeof UpdateJobEndDateAction
    | typeof UpdateJobHolidaysPerYearAction
    | typeof UpdateJobDayAction
  >,
): State {
  return produce(state, draft => {
    switch (action.type) {
      case 'INITIALIZE_JOBS': {
        draft.jobs = action.payload.jobs;
        break;
      }
      case 'ADD_JOB': {
        draft.jobs.push(new JobModel());
        break;
      }
      case 'DELETE_JOB': {
        const jobIndex = indexById(action.payload.jobId)(state.jobs);

        draft.jobs.splice(jobIndex, 1);
        break;
      }
      case 'UPDATE_JOB_NAME': {
        const jobIndex = indexById(action.payload.jobId)(state.jobs);

        draft.jobs[jobIndex].name = action.payload.name;
        break;
      }
      case 'UPDATE_JOB_START_DATE': {
        const jobIndex = indexById(action.payload.jobId)(state.jobs);

        draft.jobs[jobIndex].start = action.payload.start;
        break;
      }
      case 'UPDATE_JOB_END_DATE': {
        const jobIndex = indexById(action.payload.jobId)(state.jobs);

        draft.jobs[jobIndex].end = action.payload.end;
        break;
      }
      case 'UPDATE_JOB_HOLIDAYS_PER_YEAR': {
        const jobIndex = indexById(action.payload.jobId)(state.jobs);

        draft.jobs[jobIndex].holidaysPerYear = action.payload.days;
        break;
      }
      case 'UPDATE_JOB_DAY': {
        const jobIndex = indexById(action.payload.jobId)(state.jobs);

        switch (action.payload.day) {
          case 'monday':
            draft.jobs[jobIndex].monday = action.payload.hours;
            break;
          case 'tuesday':
            draft.jobs[jobIndex].tuesday = action.payload.hours;
            break;
          case 'wednesday':
            draft.jobs[jobIndex].wednesday = action.payload.hours;
            break;
          case 'thursday':
            draft.jobs[jobIndex].thursday = action.payload.hours;
            break;
          case 'friday':
            draft.jobs[jobIndex].friday = action.payload.hours;
            break;
          case 'saturday':
            draft.jobs[jobIndex].saturday = action.payload.hours;
            break;
          case 'sunday':
            draft.jobs[jobIndex].sunday = action.payload.hours;
            break;
        }
        break;
      }
    }
  });
}

export const useProfileReducer = () => useReducer(reducer, initialState);
