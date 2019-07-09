namespace Kairos.Test.Common.Infra.FluentAssertion
{
    public class FluentSandboxAssertion
    {
        public FluentMediatorAssertion Mediator { get; set; }
        public FluentRedisAssertion Redis { get; set; }
    }
}