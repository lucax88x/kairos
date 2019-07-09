namespace Kairos.Common
{
    public abstract class Command<T> : IRequestType<T>
    {
        public EventTypes EventType => EventTypes.Command;
    }
}