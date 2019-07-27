export const createTimeEntriesMutation = `
    mutation ($timeEntries: [TimeEntryInput!]!) {
        createTimeEntries(timeEntries: $timeEntries) {
            ids
        }
    }  
`;
