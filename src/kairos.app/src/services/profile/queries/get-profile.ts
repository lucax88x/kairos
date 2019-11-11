export const getProfileQuery = `query {
  userProfile {
    id
    jobs {
      id
      name
      start
      end
      holidaysPerYear
      monday
      tuesday
      wednesday
      thursday
      friday
      saturday
      sunday
    }
  }
}`;
