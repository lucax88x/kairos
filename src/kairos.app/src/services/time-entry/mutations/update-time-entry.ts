export const updateTimeEntryMutation = `
    mutation ($timeEntry: TimeEntryInput!) {
        updateTimeEntry(timeEntry: $timeEntry) {
            id
        }
    }  
`;
