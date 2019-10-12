export const deleteTimeAbsenceEntriesMutation = `
    mutation ($ids: [ID!]!) {
        deleteTimeAbsenceEntries(ids: $ids) {
            ids
        }
    }  
`;
