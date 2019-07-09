namespace Kairos.Test.Common.Infra.FluentAssertion
{
    public class FluentRedisAssertion
    {
        public FluentRedisAssertion(FluentRedisExistsAssertion fluentRedisExistsAssertion)
        {
            Exists = fluentRedisExistsAssertion;
        }

        public FluentRedisAssertion Redis { get; set; }
        public FluentRedisExistsAssertion Exists { get; }
    }
}