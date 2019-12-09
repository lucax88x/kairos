export const getTimeAbsenceEntriesQuery = `query ($start: DateTimeOffset!, $end:DateTimeOffset!) {
  timeAbsenceEntries(start: $start, end: $end) {
    id
    description
    start
    end
    type
  }
}`;
