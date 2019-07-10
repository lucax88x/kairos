import { query } from '../graphql.service';
import { getTimeEntriesQuery } from './queries/get-time-entries';

export async function getTimeEntries() {
  await query(getTimeEntriesQuery);
}
