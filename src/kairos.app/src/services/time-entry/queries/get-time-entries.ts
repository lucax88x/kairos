export const getTimeEntriesQuery = `query ($year: Int!) {
  timeEntries(year: $year) {
    id
    when
    type
    job {
      name
    }
    project {
      name
    }
  }
}`;
