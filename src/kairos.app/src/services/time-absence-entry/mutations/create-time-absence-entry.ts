export const createTimeAbsenceEntryMutation = `
    mutation ($timeAbsenceEntry: TimeAbsenceEntryModel!) {
        createTimeAbsenceEntry(timeAbsenceEntry: $timeAbsenceEntry) {
            id
        }
    }  
`;
