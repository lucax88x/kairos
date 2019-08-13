export const createTimeEntryMutation = `
    mutation ($timeEntry: TimeEntryModel!) {
        createTimeEntry(timeEntry: $timeEntry) {
            id
        }
    }  
`;
