export const createTimeEntryMutation = `
    mutation ($timeEntry: TimeEntryInput!) {
        timeEntry(timeEntry: $timeEntry) {
            id
        }
    }  
`;
