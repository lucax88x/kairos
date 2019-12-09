export const getTimeHolidayEntriesQuery = `query ($start: DateTimeOffset!, $end:DateTimeOffset!) {
  timeHolidayEntries(start: $start, end: $end) {
    id
    description
    when
  }
}`;
