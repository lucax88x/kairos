export const deleteTimeAbsenceEntryMutation = `
    mutation ($id: ID!) {
        deleteAbsenceTimeEntry(id: $id) {
            id
        }
    }  
`;
