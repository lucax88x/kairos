using System;

namespace Kairos.Common.Exceptions.Domain
{
    public class DomainException : Exception
    {
        protected DomainException(string message) : base(message)
        {
        }
    }
}