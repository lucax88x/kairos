export const getTimeAbsenceEntryQuery = `query ($id: ID!) {
  timeAbsenceEntry(id: $id) {
    id,
    when,
    type
  }
}`;
