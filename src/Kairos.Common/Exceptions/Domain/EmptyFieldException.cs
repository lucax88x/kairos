namespace Kairos.Common.Exceptions.Domain
{
    public class EmptyFieldException : DomainException
    {
        public EmptyFieldException(string fieldName) : base($"Field {fieldName} is missing")
        {
        }
    }
}