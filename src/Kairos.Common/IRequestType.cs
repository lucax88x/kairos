using MediatR;

namespace Kairos.Common
{
    public enum EventTypes
    {
        Query = -1,
        Command = 0,
        Event = 1
    }

    public interface INotificationType : INotification
    {
        EventTypes EventType { get; }
    }

    public interface IRequestType : IRequest
    {
        EventTypes EventType { get; }
    }

    public interface IRequestType<out T> : IRequest<T>
    {
        EventTypes EventType { get; }
    }
}