using System;
using Kairos.Common;

namespace Kairos.Infra.Write.Tests.Models
{
    internal class TestDomainObject : AggregateRoot
    {
        public int Counter { get; private set; }

        protected override void Apply(Event @event)
        {
            switch (@event)
            {
                case TestDomainObjectCreated created:
                {
                    Id = created.Id;
                    break;
                }
                case TestDomainObjectIncreased _:
                {
                    Counter++;
                    break;
                }
            }
        }

        public static TestDomainObject Create()
        {
            var instance = new TestDomainObject();

            instance.ApplyChange(new TestDomainObjectCreated(Guid.NewGuid()));

            return instance;
        }

        public void Increase()
        {
            ApplyChange(new TestDomainObjectIncreased());
        }
    }
}