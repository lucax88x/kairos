export const updateTimeAbsenceEntryMutation = `
    mutation ($timeAbsenceEntry: TimeAbsenceEntryInput!) {
        updateTimeAbsenceEntry(timeAbsenceEntry: $timeAbsenceEntry) {
            id
        }
    }  
`;
