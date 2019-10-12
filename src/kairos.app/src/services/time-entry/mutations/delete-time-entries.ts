export const deleteTimeEntriesMutation = `
    mutation ($ids: [ID!]!) {
        deleteTimeEntries(ids: $ids) {
            ids
        }
    }  
`;
