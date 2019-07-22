namespace Kairos.Test.Common.Infra.Scenario
{
    public class ScenarioBuilder
    {
        public ScenarioBuilder(TimeEntryScenarioBuilder timeEntry)
        {
            TimeEntry = timeEntry;
        }

        public TimeEntryScenarioBuilder TimeEntry { get; }
    }
}