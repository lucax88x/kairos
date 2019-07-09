namespace Kairos.Common
{
    public abstract class Event : INotificationType
    {
        public EventTypes EventType => EventTypes.Event;
    }
}