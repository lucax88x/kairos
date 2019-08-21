export const createTimeHolidayEntriesMutation = `
    mutation ($timeHolidayEntries: [TimeHolidayEntryModel!]!) {
        createTimeHolidayEntries(timeHolidayEntries: $timeHolidayEntries) {
            ids
        }
    }  
`;
