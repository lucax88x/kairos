export const updateProfileMutation = `
    mutation ($userProfile: UserProfileModel!) {
        createOrUpdateUserProfile(userProfile: $userProfile) {
            id
        }
    }  
`;
