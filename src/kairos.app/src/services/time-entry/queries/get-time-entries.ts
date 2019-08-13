export const getTimeEntriesQuery = `{
  timeEntries {
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
