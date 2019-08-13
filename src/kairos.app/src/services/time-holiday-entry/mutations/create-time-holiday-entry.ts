export const createTimeHolidayEntryMutation = `
    mutation ($timeHolidayEntry: TimeHolidayEntryModel!) {
        createTimeHolidayEntry(timeHolidayEntry: $timeHolidayEntry) {
            id
        }
    }  
`;
