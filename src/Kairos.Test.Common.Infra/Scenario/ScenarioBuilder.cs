namespace Kairos.Test.Common.Infra.Scenario
{
    public class ScenarioBuilder
    {
        public ScenarioBuilder(TimeEntryScenarioBuilder timeEntry, UserProfileScenarioBuilder userProfile)
        {
            TimeEntry = timeEntry;
            UserProfile = userProfile;
        }

        public TimeEntryScenarioBuilder TimeEntry { get; }
        public UserProfileScenarioBuilder UserProfile { get; }
    }
}