import { parseISO } from 'date-fns';
import { immerable } from 'immer';
import { UUID } from './uuid.model';

export class ProjectModel {
  [immerable] = true;

  constructor(
    public id = UUID.Generate(),
    public name = '',
    public start = new Date(),
    public end: Date | null = null,
    public allocation: number = 20,
  ) {}

  static fromOutModel(outModel: ProjectOutModel) {
    return new ProjectModel(
      new UUID(outModel.id),
      outModel.name,
      parseISO(outModel.start),
      !!outModel.end ? parseISO(outModel.end) : null,
      outModel.allocation,
    );
  }

  static empty: ProjectModel = new ProjectModel(new UUID(), '', new Date(0), new Date(0), 0);

  isEmpty() {
    return this.id.equals(ProjectModel.empty.id) && this.name === ProjectModel.empty.name;
  }
}

export interface ProjectOutModel {
  id: string;
  name: string;
  start: string;
  end: string;
  allocation: number;
}
