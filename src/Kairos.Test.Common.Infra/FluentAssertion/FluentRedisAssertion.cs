namespace Kairos.Test.Common.Infra.FluentAssertion
{
    public class FluentRedisAssertion
    {
        public FluentRedisAssertion(FluentRedisExistsAssertion fluentRedisExistsAssertion, FluentRedisNotExistsAssertion notExists)
        {
            Exists = fluentRedisExistsAssertion;
            NotExists = notExists;
        }
        public FluentRedisExistsAssertion Exists { get; } 
        public FluentRedisNotExistsAssertion NotExists { get; }
    }
}