import { parseISO, startOfDay } from 'date-fns';
import { immerable } from 'immer';
import { map } from 'ramda';
import { ProjectModel, ProjectOutModel } from './project.model';
import { UUID } from './uuid.model';

export class JobModel {
  [immerable] = true;

  constructor(
    public id = UUID.Generate(),
    public name = '',
    public start = startOfDay(new Date()),
    public end: Date | null = null,
    public holidaysPerYear: number = 20,
    public monday: number = 8.5,
    public tuesday: number = 8.5,
    public wednesday: number = 8.5,
    public thursday: number = 8.5,
    public friday: number = 8.5,
    public saturday: number = 8.5,
    public sunday: number = 8.5,
    public projects: ProjectModel[] = [
      new ProjectModel(UUID.Generate(), 'default', startOfDay(new Date()), null, 100),
    ],
  ) {}

  static fromOutModel(outModel: JobOutModel) {
    return new JobModel(
      new UUID(outModel.id),
      outModel.name,
      parseISO(outModel.start),
      !!outModel.end ? parseISO(outModel.end) : null,
      outModel.holidaysPerYear,
      outModel.monday,
      outModel.tuesday,
      outModel.wednesday,
      outModel.thursday,
      outModel.friday,
      outModel.saturday,
      outModel.sunday,
      map(ProjectModel.fromOutModel, outModel.projects),
    );
  }

  static empty: JobModel = new JobModel(new UUID(), '', new Date(0), null, 0, 0, 0, 0, 0, 0, 0, 0);

  isEmpty() {
    return this.id.equals(JobModel.empty.id) && this.name === JobModel.empty.name;
  }
}

export interface JobOutModel {
  id: string;
  name: string;
  start: string;
  end: string;
  holidaysPerYear: number;
  monday: number;
  tuesday: number;
  wednesday: number;
  thursday: number;
  friday: number;
  saturday: number;
  sunday: number;
  projects: ProjectOutModel[];
}
