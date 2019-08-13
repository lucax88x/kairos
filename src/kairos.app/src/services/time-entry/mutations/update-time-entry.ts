export const updateTimeEntryMutation = `
    mutation ($timeEntry: TimeEntryModel!) {
        updateTimeEntry(timeEntry: $timeEntry) {
            id
        }
    }  
`;
