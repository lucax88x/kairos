export const createTimeAbsenceEntryMutation = `
    mutation ($timeAbsenceEntry: TimeAbsenceEntryInput!) {
        createTimeAbsenceEntry(timeAbsenceEntry: $timeAbsenceEntry) {
            id
        }
    }  
`;
