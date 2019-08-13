export const deleteTimeHolidayEntryMutation = `
    mutation ($id: ID!) {
        deleteTimeHolidayEntry(id: $id) {
            id
        }
    }  
`;
