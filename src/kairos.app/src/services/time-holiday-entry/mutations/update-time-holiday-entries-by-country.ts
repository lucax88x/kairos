export const updateTimeHolidayEntriesByCountryMutation = `
    mutation ($year: Int!, $countryCode: String!) {
        updateTimeHolidayEntriesByCountry(year: $year, countryCode: $countryCode) {
            ids
        }
    }  
`;
