export const createTimeHolidayEntryMutation = `
    mutation ($timeHolidayEntry: TimeHolidayEntryInput!) {
        createTimeHolidayEntry(timeHolidayEntry: $timeHolidayEntry) {
            id
        }
    }  
`;
