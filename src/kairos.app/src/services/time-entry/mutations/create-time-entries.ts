export const createTimeEntriesMutation = `
    mutation ($timeEntries: [TimeEntryModel!]!) {
        createTimeEntries(timeEntries: $timeEntries) {
            ids
        }
    }  
`;
