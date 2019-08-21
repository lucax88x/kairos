import { findIndex, addIndex, map } from 'ramda';
import { UUID } from '../models/uuid.model';

export const indexById = <T extends { id: UUID }>(id: UUID) => findIndex<T>(j => j.id === id);

// how do I avoid to have a function and just assign it?
export const mapIndexed = <T, E>() => addIndex<T, E>(map);
