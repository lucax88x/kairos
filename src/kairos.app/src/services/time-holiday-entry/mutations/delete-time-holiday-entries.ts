export const deleteTimeHolidayEntriesMutation = `
    mutation ($ids: [ID!]!) {
        deleteTimeHolidayEntries(ids: $ids) {
            ids
        }
    }  
`;
