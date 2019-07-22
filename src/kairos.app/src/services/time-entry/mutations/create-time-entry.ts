export const createTimeEntryMutation = `
    mutation ($timeEntry: TimeEntryInput!) {
        createTimeEntry(timeEntry: $timeEntry) {
            id
        }
    }  
`;
