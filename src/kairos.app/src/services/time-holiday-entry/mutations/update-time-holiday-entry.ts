export const updateTimeHolidayEntryMutation = `
    mutation ($timeHolidayEntry: TimeHolidayEntryModel!) {
        updateTimeHolidayEntry(timeHolidayEntry: $timeHolidayEntry) {
            id
        }
    }  
`;
