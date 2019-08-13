export const updateTimeAbsenceEntryMutation = `
    mutation ($timeAbsenceEntry: TimeAbsenceEntryModel!) {
        updateTimeAbsenceEntry(timeAbsenceEntry: $timeAbsenceEntry) {
            id
        }
    }  
`;
