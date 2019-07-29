export const getTimeHolidayEntryQuery = `query ($id: ID!) {
  timeHolidayEntry(id: $id) {
    id,
    when,
    type
  }
}`;
