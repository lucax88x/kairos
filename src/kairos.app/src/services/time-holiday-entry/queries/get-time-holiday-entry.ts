export const getTimeHolidayEntryQuery = `query ($id: ID!) {
  timeHolidayEntry(id: $id) {
    id
    description
    when
  }
}`;
