export const updateTimeHolidayEntryMutation = `
    mutation ($timeHolidayEntry: TimeHolidayEntryInput!) {
        updateTimeHolidayEntry(timeHolidayEntry: $timeHolidayEntry) {
            id
        }
    }  
`;
