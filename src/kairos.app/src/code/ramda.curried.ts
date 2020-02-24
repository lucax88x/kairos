import { findIndex, addIndex, map, reduce } from 'ramda';
import { UUID } from '../models/uuid.model';
import Decimal from 'decimal.js';

export const indexById = <T extends { id: UUID }>(id: UUID) =>
  findIndex<T>(j => j.id === id);

// how do I avoid to have a function and just assign it?
export const mapIndexed = <T, E>() => addIndex<T, E>(map);
export const sumDecimal = reduce<Decimal, Decimal>(
  (acc, decimal) => acc.plus(decimal),
  new Decimal(0),
);
