export const deleteTimeEntryMutation = `
    mutation ($id: ID!) {
        deleteTimeEntry(id: $id) {
            id
        }
    }  
`;
