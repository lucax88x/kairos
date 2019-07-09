using System;
using Kairos.Common;

namespace Kairos.Infra.Write.Tests.Models
{
    public class TestDomainObjectCreated : Event
    {
        public TestDomainObjectCreated(Guid id)
        {
            Id = id;
        }

        public Guid Id { get; }
    }
}