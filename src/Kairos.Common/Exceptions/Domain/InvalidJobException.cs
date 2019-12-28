namespace Kairos.Common.Exceptions.Domain
{
    public class InvalidJobException : DomainException
    {
        public InvalidJobException() : base("Invalid Job")
        {
        }
    }
}