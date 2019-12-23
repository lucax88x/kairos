import { parseISO, startOfDay } from 'date-fns';
import { immerable } from 'immer';
import { filter } from 'ramda';
import { average } from '../code/functions';
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
    public saturday: number = 0,
    public sunday: number = 0,
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
    );
  }

  static empty: JobModel = new JobModel(
    new UUID(),
    '',
    new Date(0),
    null,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
  );

  static isEmpty(model: JobModel) {
    return (
      UUID.equals(model.id, JobModel.empty.id) &&
      model.name === JobModel.empty.name
    );
  }
  static getAverageWorkingHours(model: JobModel) {
    return average(
      filter(wh => wh > 0, [
        model.monday,
        model.tuesday,
        model.wednesday,
        model.thursday,
        model.friday,
        model.saturday,
        model.sunday,
      ]),
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
}
