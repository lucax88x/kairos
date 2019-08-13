import produce from 'immer';
import { find } from 'ramda';
import { useReducer } from 'react';
import { action, ActionType } from 'typesafe-actions';

import { JobModel } from '../models/job.model';
import { ProjectModel } from '../models/project.model';

export interface State {
  jobs: JobModel[];
}
const initialState: State = { jobs: [] };

export const InitializeJobsAction = (jobs: JobModel[]) => action('INITIALIZE_JOBS', { jobs });
export const AddJobAction = () => action('ADD_JOB');
export const DeleteJobAction = (job: JobModel) => action('DELETE_JOB', { job });
export const UpdateJobNameAction = (job: JobModel, name: string) =>
  action('UPDATE_JOB_NAME', { job, name });
export const UpdateJobStartDateAction = (job: JobModel, start: Date) =>
  action('UPDATE_JOB_START_DATE', { job, start });
export const UpdateJobEndDateAction = (job: JobModel, end: Date) =>
  action('UPDATE_JOB_END_DATE', { job, end });
export const UpdateJobHolidaysPerYearAction = (job: JobModel, days: number) =>
  action('UPDATE_JOB_HOLIDAYS_PER_YEAR', { job, days });
export const UpdateJobDayAction = (job: JobModel, day: string, hours: number) =>
  action('UPDATE_JOB_DAY', { job, day, hours });

export const InitializeProjectsAction = (job: JobModel, projects: ProjectModel[]) =>
  action('INITIALIZE_PROJECTS', { job, projects });
export const AddProjectAction = (job: JobModel) => action('ADD_PROJECT', { job });
export const DeleteProjectAction = (job: JobModel, project: ProjectModel) =>
  action('DELETE_PROJECT', { job, project });
export const UpdateProjectNameAction = (job: JobModel, project: ProjectModel, name: string) =>
  action('UPDATE_PROJECT_NAME', { job, project, name });
export const UpdateProjectStartDateAction = (job: JobModel, project: ProjectModel, start: Date) =>
  action('UPDATE_PROJECT_START_DATE', { job, project, start });
export const UpdateProjectEndDateAction = (job: JobModel, project: ProjectModel, end: Date) =>
  action('UPDATE_PROJECT_END_DATE', { job, project, end });

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
        draft.jobs.splice(draft.jobs.indexOf(action.payload.job), 1);
        break;
      }
      case 'UPDATE_JOB_NAME': {
        draft.jobs[draft.jobs.indexOf(action.payload.job)] = action.payload.job.withName(
          action.payload.name,
        );
        break;
      }
      case 'UPDATE_JOB_START_DATE': {
        draft.jobs[draft.jobs.indexOf(action.payload.job)] = action.payload.job.withStartDate(
          action.payload.start,
        );
        break;
      }
      case 'UPDATE_JOB_END_DATE': {
        draft.jobs[draft.jobs.indexOf(action.payload.job)] = action.payload.job.withEndDate(
          action.payload.end,
        );
        break;
      }
      case 'UPDATE_JOB_HOLIDAYS_PER_YEAR': {
        draft.jobs[draft.jobs.indexOf(action.payload.job)] = action.payload.job.withHolidaysPerYear(
          action.payload.days,
        );
        break;
      }
      case 'UPDATE_JOB_DAY': {
        let toUpdateJob = JobModel.empty;
        switch (action.payload.day) {
          case 'monday':
            toUpdateJob = action.payload.job.withMonday(action.payload.hours);
            break;
          case 'tuesday':
            toUpdateJob = action.payload.job.withTuesday(action.payload.hours);
            break;
          case 'wednesday':
            toUpdateJob = action.payload.job.withWednesday(action.payload.hours);
            break;
          case 'thursday':
            toUpdateJob = action.payload.job.withThursday(action.payload.hours);
            break;
          case 'friday':
            toUpdateJob = action.payload.job.withFriday(action.payload.hours);
            break;
          case 'saturday':
            toUpdateJob = action.payload.job.withSaturday(action.payload.hours);
            break;
          case 'sunday':
            toUpdateJob = action.payload.job.withSunday(action.payload.hours);
            break;
        }
        if (!toUpdateJob.isEmpty()) {
          draft.jobs[draft.jobs.indexOf(action.payload.job)] = toUpdateJob;
        }
        break;
      }
      case 'INITIALIZE_PROJECTS': {
        const toUpdateJob = draft.jobs[draft.jobs.indexOf(action.payload.job)];
        toUpdateJob.projects = action.payload.projects;
        break;
      }
      case 'ADD_PROJECT': {
        // draft.jobs[draft.jobs.indexOf(action.payload.job)] = action.payload.job.withProjects(action.pay);
        break;
      }
      case 'DELETE_PROJECT': {
        // const toUpdateJob = draft.jobs[draft.jobs.indexOf(action.payload.job)];
        // toUpdateJob.projects.splice(toUpdateJob.projects.indexOf(action.payload.project), 1);
        break;
      }
      case 'UPDATE_PROJECT_NAME': {
        break;
      }
      case 'UPDATE_PROJECT_START_DATE': {
        break;
      }
      case 'UPDATE_PROJECT_END_DATE': {
        break;
      }
    }
  });

  // case 'ADD_PROJECT':
  //   return { ...state, projects: [...state.projects, new ProjectModel()] };
  // case 'DELETE_PROJECT':
  //   return { ...state, projects: without([action.payload.project], state.projects) };
  // case 'INITIALIZE_PROJECTS':
  //   return { ...state, projects: action.payload.projects };
  // case 'UPDATE_PROJECT_NAME':
  //   return {
  //     ...state,
  //     projects: state.projects.map(project => {
  //       if (project.id === action.payload.project.id) {
  //         return project.withName(action.payload.name);
  //       } else {
  //         return project;
  //       }
  //     }),
  //   };
  // case 'UPDATE_PROJECT_START_DATE':
  //   return {
  //     ...state,
  //     projects: state.projects.map(project => {
  //       if (project.id === action.payload.project.id) {
  //         return project.withStartDate(action.payload.start);
  //       } else {
  //         return project;
  //       }
  //     }),
  //   };
  // case 'UPDATE_PROJECT_END_DATE':
  //   return {
  //     ...state,
  //     projects: state.projects.map(project => {
  //       if (project.id === action.payload.project.id) {
  //         return project.withEndDate(action.payload.end);
  //       } else {
  //         return project;
  //       }
  //     }),
  //   };

  // default:
  //   return initialState;
  // }
}

export const useProfileReducer = () => useReducer(reducer, initialState);
