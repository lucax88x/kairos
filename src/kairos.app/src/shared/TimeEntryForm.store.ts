import { isWithinInterval } from 'date-fns';
import produce from 'immer';
import { filter, find, head } from 'ramda';
import { useReducer } from 'react';
import { action, ActionType } from 'typesafe-actions';

import { JobModel } from '../models/job.model';
import { ProfileModel } from '../models/profile.model';
import { ProjectModel } from '../models/project.model';
import { TimeEntryTypes, TimeEntryModel } from '../models/time-entry.model';
import { UUID } from '../models/uuid.model';

export interface State {
  id: UUID;
  type: TimeEntryTypes;
  when: Date;

  jobs: JobModel[];
  selectedJobId: string;

  projects: ProjectModel[];
  selectedProjectId: string;
}

const initialState: State = {
  id: UUID.Generate(),
  type: TimeEntryTypes.IN,
  when: new Date(),
  jobs: [],
  selectedJobId: UUID.Empty,
  projects: [],
  selectedProjectId: UUID.Empty,
};

export const SetModel = (model: TimeEntryModel) => action('SET_MODEL', { model });
export const RefreshSelectsTimeEntryAction = (profile: ProfileModel) =>
  action('REFRESH_SELECTS', { profile });
export const SetTimeEntryTypeAction = (type: TimeEntryTypes) => action('SET_TYPE', { type });
export const SetTimeEntryWhenAction = (when: Date) => action('SET_WHEN', { when });
export const SetTimeEntrySelectedJobAction = (jobId: string) =>
  action('SET_SELECTED_JOB', { jobId });
export const SetTimeEntrySelectedProjectAction = (projectId: string) =>
  action('SET_SELECTED_PROJECT', { projectId });

function reducer(
  state: State,
  action: ActionType<
    | typeof SetModel
    | typeof RefreshSelectsTimeEntryAction
    | typeof SetTimeEntryTypeAction
    | typeof SetTimeEntryWhenAction
    | typeof SetTimeEntrySelectedJobAction
    | typeof SetTimeEntrySelectedProjectAction
  >,
): State {
  return produce(state, draft => {
    switch (action.type) {
      case 'SET_MODEL': {
        draft.id = action.payload.model.id;
        draft.selectedJobId = action.payload.model.job.toString();
        draft.selectedProjectId = action.payload.model.project.toString();
        draft.when = action.payload.model.when;
        draft.type = action.payload.model.type;
        break;
      }
      case 'REFRESH_SELECTS': {
        draft.jobs = [];
        draft.projects = [];
        draft.selectedProjectId = UUID.Empty;
        draft.selectedProjectId = UUID.Empty;

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

          const projects = filter(
            project =>
              isWithinInterval(date, {
                start: project.start,
                end: !!project.end ? project.end : new Date(8640000000000000),
              }),
            selectedJob.projects,
          );
          draft.projects = projects;

          let selectedProject = find(p => p.id.toString() === state.selectedProjectId, projects);

          if (!selectedProject) {
            selectedProject = head(projects);
          }

          if (!!selectedProject) {
            draft.selectedProjectId = selectedProject.id.toString();
          }
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
      case 'SET_SELECTED_PROJECT': {
        draft.selectedProjectId = action.payload.projectId;
        break;
      }
    }
  });
}

export const useTimeEntryFormReducer = () => useReducer(reducer, initialState);
