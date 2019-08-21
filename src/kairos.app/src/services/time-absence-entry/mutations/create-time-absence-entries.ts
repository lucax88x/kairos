export const createTimeAbsenceEntriesMutation = `
    mutation ($timeAbsenceEntries: [TimeAbsenceEntryModel!]!) {
        createTimeAbsenceEntries(timeAbsenceEntries: $timeAbsenceEntries) {
            ids
        }
    }  
`;
