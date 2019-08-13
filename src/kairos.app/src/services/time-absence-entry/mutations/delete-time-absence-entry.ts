export const deleteTimeAbsenceEntryMutation = `
    mutation ($id: ID!) {
        deleteTimeAbsenceEntry(id: $id) {
            id
        }
    }  
`;
