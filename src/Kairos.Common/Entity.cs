using System;
using System.Collections.Generic;
using System.Collections.Immutable;

namespace Kairos.Common
{
    public abstract class Entity
    {
        public Guid Id { get; protected set; } = Guid.NewGuid();
    }
}