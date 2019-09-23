export const getTimeAbsenceEntriesQuery = `query ($year: Int!) {
  timeAbsenceEntries(year: $year) {
    id
    description
    start
    end
    type
  }
}`;
