using FluentAssertions;
using Kairos.Test.Common.Infra.Mediator;

namespace Kairos.Test.Common.Infra.FluentAssertion
{
    public class FluentMediatorAssertion
    {
        private readonly MediatorSniffer _mediatorSniffer;

        public FluentMediatorAssertion(MediatorSniffer mediatorSniffer)
        {
            _mediatorSniffer = mediatorSniffer;
        }

        public void Be(string expected)
        {
            var mediator = _mediatorSniffer.ToString();
            mediator.Should().Be(expected);
        }
    }
}