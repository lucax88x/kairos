export const getTimeEntriesQuery = `query ($start: DateTimeOffset!, $end:DateTimeOffset!) {
  timeEntries(start: $start, end: $end) {
    id
    when
    type
    job {
      id
      name
    }
  }
}`;
