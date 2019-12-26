export const getEntriesQuery = `query ($start: DateTimeOffset!, $end:DateTimeOffset!) {
  timeEntries(start: $start, end: $end) {
    id,
    type,
    when,
    job {
      id
      name
    }
  }
  timeAbsenceEntries(start: $start, end: $end) {
    id,
    type,
    start,
    end,
    description,
    job {
      id
      name
    }
  }
  timeHolidayEntries(start: $start, end: $end) {
    id,
    when,
    description
  }
}`;
