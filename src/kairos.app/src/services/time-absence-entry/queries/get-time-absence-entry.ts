export const getTimeAbsenceEntryQuery = `query ($id: ID!) {
  timeAbsenceEntry(id: $id) {
    id
    description
    start
    end
    type
    job {
      id
      name
    }
  }
}`;
