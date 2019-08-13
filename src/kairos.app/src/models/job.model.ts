import { parseISO } from 'date-fns';

import { ProjectModel, ProjectOutModel } from './project.model';
import { UUID } from './uuid.model';
import { map } from 'ramda';

export class JobModel {
  constructor(
    public id = UUID.Generate(),
    public name = '',
    public start = new Date(),
    public end: Date | null = null,
    public holidaysPerYear: number = 20,
    public monday: number = 8.3,
    public tuesday: number = 8.3,
    public wednesday: number = 8.3,
    public thursday: number = 8.3,
    public friday: number = 8.3,
    public saturday: number = 8.3,
    public sunday: number = 8.3,
    public projects: ProjectModel[] = [
      new ProjectModel(UUID.Generate(), 'default', new Date(), new Date()),
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

  withName(name: string) {
    return new JobModel(
      this.id,
      name,
      this.start,
      this.end,
      this.holidaysPerYear,
      this.monday,
      this.tuesday,
      this.wednesday,
      this.thursday,
      this.friday,
      this.saturday,
      this.sunday,
    );
  }

  withStartDate(date: Date) {
    return new JobModel(
      this.id,
      this.name,
      date,
      this.end,
      this.holidaysPerYear,
      this.monday,
      this.tuesday,
      this.wednesday,
      this.thursday,
      this.friday,
      this.saturday,
      this.sunday,
    );
  }

  withEndDate(date: Date) {
    return new JobModel(
      this.id,
      this.name,
      this.start,
      date,
      this.holidaysPerYear,
      this.monday,
      this.tuesday,
      this.wednesday,
      this.thursday,
      this.friday,
      this.saturday,
      this.sunday,
    );
  }

  withHolidaysPerYear(days: number) {
    return new JobModel(
      this.id,
      this.name,
      this.start,
      this.end,
      days,
      this.monday,
      this.tuesday,
      this.wednesday,
      this.thursday,
      this.friday,
      this.saturday,
      this.sunday,
    );
  }

  withMonday(hours: number) {
    return new JobModel(
      this.id,
      this.name,
      this.start,
      this.end,
      this.holidaysPerYear,
      hours,
      this.tuesday,
      this.wednesday,
      this.thursday,
      this.friday,
      this.saturday,
      this.sunday,
    );
  }

  withTuesday(hours: number) {
    return new JobModel(
      this.id,
      this.name,
      this.start,
      this.end,
      this.holidaysPerYear,
      this.monday,
      hours,
      this.wednesday,
      this.thursday,
      this.friday,
      this.saturday,
      this.sunday,
    );
  }

  withWednesday(hours: number) {
    return new JobModel(
      this.id,
      this.name,
      this.start,
      this.end,
      this.holidaysPerYear,
      this.monday,
      this.tuesday,
      hours,
      this.thursday,
      this.friday,
      this.saturday,
      this.sunday,
    );
  }

  withThursday(hours: number) {
    return new JobModel(
      this.id,
      this.name,
      this.start,
      this.end,
      this.holidaysPerYear,
      this.monday,
      this.tuesday,
      this.wednesday,
      hours,
      this.friday,
      this.saturday,
      this.sunday,
    );
  }

  withFriday(hours: number) {
    return new JobModel(
      this.id,
      this.name,
      this.start,
      this.end,
      this.holidaysPerYear,
      this.monday,
      this.tuesday,
      this.wednesday,
      this.thursday,
      hours,
      this.saturday,
      this.sunday,
    );
  }

  withSaturday(hours: number) {
    return new JobModel(
      this.id,
      this.name,
      this.start,
      this.end,
      this.holidaysPerYear,
      this.monday,
      this.tuesday,
      this.wednesday,
      this.thursday,
      this.friday,
      hours,
      this.sunday,
    );
  }

  withSunday(hours: number) {
    return new JobModel(
      this.id,
      this.name,
      this.start,
      this.end,
      this.holidaysPerYear,
      this.monday,
      this.tuesday,
      this.wednesday,
      this.thursday,
      this.friday,
      this.saturday,
      hours,
    );
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
