export const getTimeHolidayEntriesQuery = `query ($year: Int!) {
  timeHolidayEntries(year: $year) {
    id
    description
    when
  }
}`;
