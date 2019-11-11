export const getTimeEntryQuery = `query ($id: ID!) {
  timeEntry(id: $id) {
    id
    when
    type
    job {
      id
      name
    }
  }
}`;
