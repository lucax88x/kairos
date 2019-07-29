export const deleteTimeHolidayEntryMutation = `
    mutation ($id: ID!) {
        deleteHolidayTimeEntry(id: $id) {
            id
        }
    }  
`;
