import produce from 'immer';
import { useReducer } from 'react';
import { action, ActionType } from 'typesafe-actions';
import { indexById } from '../code/ramda.curried';
import { JobModel } from '../models/job.model';
import { ProjectModel } from '../models/project.model';
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
export const UpdateJobEndDateAction = (jobId: UUID, end: Date) =>
  action('UPDATE_JOB_END_DATE', { jobId, end });
export const UpdateJobHolidaysPerYearAction = (jobId: UUID, days: number) =>
  action('UPDATE_JOB_HOLIDAYS_PER_YEAR', { jobId, days });
export const UpdateJobDayAction = (jobId: UUID, day: string, hours: number) =>
  action('UPDATE_JOB_DAY', { jobId, day, hours });

export const InitializeProjectsAction = (jobId: UUID, projects: ProjectModel[]) =>
  action('INITIALIZE_PROJECTS', { jobId, projects });
export const AddProjectAction = (jobId: UUID) => action('ADD_PROJECT', { jobId });
export const DeleteProjectAction = (jobId: UUID, projectId: UUID) =>
  action('DELETE_PROJECT', { jobId, projectId });
export const UpdateProjectNameAction = (jobId: UUID, projectId: UUID, name: string) =>
  action('UPDATE_PROJECT_NAME', { jobId, projectId, name });
export const UpdateProjectStartDateAction = (jobId: UUID, projectId: UUID, start: Date) =>
  action('UPDATE_PROJECT_START_DATE', { jobId, projectId, start });
export const UpdateProjectEndDateAction = (jobId: UUID, projectId: UUID, end: Date) =>
  action('UPDATE_PROJECT_END_DATE', { jobId, projectId, end });
export const UpdateProjectAllocationAction = (jobId: UUID, projectId: UUID, allocation: number) =>
  action('UPDATE_PROJECT_ALLOCATION', { jobId, projectId, allocation });

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
    | typeof InitializeProjectsAction
    | typeof AddProjectAction
    | typeof DeleteProjectAction
    | typeof UpdateProjectNameAction
    | typeof UpdateProjectStartDateAction
    | typeof UpdateProjectEndDateAction
    | typeof UpdateProjectAllocationAction
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
      case 'INITIALIZE_PROJECTS': {
        const jobIndex = indexById(action.payload.jobId)(state.jobs);

        draft.jobs[jobIndex].projects = action.payload.projects;
        break;
      }
      case 'ADD_PROJECT': {
        const jobIndex = indexById(action.payload.jobId)(state.jobs);

        draft.jobs[jobIndex].projects.push(new ProjectModel());

        console.log('with remaining allocation!');
        break;
      }
      case 'DELETE_PROJECT': {
        const jobIndex = indexById(action.payload.jobId)(state.jobs);
        const stateJob = state.jobs[jobIndex];
        const draftJob = draft.jobs[jobIndex];
        const projectIndex = indexById(action.payload.projectId)(stateJob.projects);
        draftJob.projects.splice(projectIndex, 1);
        break;
      }
      case 'UPDATE_PROJECT_NAME': {
        const jobIndex = indexById(action.payload.jobId)(state.jobs);
        const stateJob = state.jobs[jobIndex];
        const draftJob = draft.jobs[jobIndex];
        const projectIndex = indexById(action.payload.projectId)(stateJob.projects);
        draftJob.projects[projectIndex].name = action.payload.name;
        break;
      }
      case 'UPDATE_PROJECT_START_DATE': {
        const jobIndex = indexById(action.payload.jobId)(state.jobs);
        const stateJob = state.jobs[jobIndex];
        const draftJob = draft.jobs[jobIndex];
        const projectIndex = indexById(action.payload.projectId)(stateJob.projects);
        draftJob.projects[projectIndex].start = action.payload.start;
        break;
      }
      case 'UPDATE_PROJECT_END_DATE': {
        const jobIndex = indexById(action.payload.jobId)(state.jobs);
        const stateJob = state.jobs[jobIndex];
        const draftJob = draft.jobs[jobIndex];
        const projectIndex = indexById(action.payload.projectId)(stateJob.projects);
        draftJob.projects[projectIndex].end = action.payload.end;
        break;
      }
      case 'UPDATE_PROJECT_ALLOCATION': {
        const jobIndex = indexById(action.payload.jobId)(state.jobs);
        const stateJob = state.jobs[jobIndex];
        const draftJob = draft.jobs[jobIndex];
        const projectIndex = indexById(action.payload.projectId)(stateJob.projects);
        draftJob.projects[projectIndex].allocation = action.payload.allocation;

        console.log('update other allocations!');
        break;
      }
    }
  });
}

export const useProfileReducer = () => useReducer(reducer, initialState);
