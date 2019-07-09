using System;
using Kairos.Common;

namespace Kairos.Infra.Write.Tests.Models
{
    internal class TestDomainObject : AggregateRoot
    {
        protected override void Apply(Event @event)
        {
        }

        public static TestDomainObject Create()
        {
            var instance = new TestDomainObject();

            instance.ApplyChange(new TestDomainObjectCreated(Guid.NewGuid()));

            return instance;
        }
    }
}