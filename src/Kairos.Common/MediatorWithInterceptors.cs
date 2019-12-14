using System;
using System.Diagnostics;
using System.Threading;
using System.Threading.Tasks;
using Autofac;
using MediatR;
using Serilog;

namespace Kairos.Common
{
    public class MediatorWithInterceptors : IMediator
    {
        private readonly IMediator _mediator;
        private readonly ILogger _logger;

        public MediatorWithInterceptors(IComponentContext componentContext, ILogger logger)
        {
            _logger = logger;
            _mediator = new Mediator(componentContext.Resolve);
        }

        public async Task<TResponse> Send<TResponse>(IRequest<TResponse> request,
            CancellationToken cancellationToken = new CancellationToken())
        {
            return await Intercept( request.GetType().Name, () => _mediator.Send(request, cancellationToken));
        }

        public async Task Publish(object notification, CancellationToken cancellationToken = new CancellationToken())
        {
            await Intercept( notification.GetType().Name, () => _mediator.Publish(notification, cancellationToken));
        }

        public async Task Publish<TNotification>(TNotification notification,
            CancellationToken cancellationToken = new CancellationToken()) where TNotification : INotification
        {
            await Intercept( notification.GetType().Name, () => _mediator.Publish(notification, cancellationToken));
        }

        private async Task<T> Intercept<T>(string typeName, Func<Task<T>> action)
        {
            var sw = new Stopwatch();
            sw.Start();

            _logger.Information($"Handling: {typeName}");

            try
            {
                var result = await action();

                sw.Stop();
                _logger.Information($"Handled: {typeName} in {sw.Elapsed}");

                return result;
            }
            catch (Exception ex)
            {
                sw.Stop();

                _logger.Error(ex, nameof(typeName));
                _logger.Information($"Errored: {typeName} in {sw.Elapsed}");

                throw ex;
            }
        }

        private async Task Intercept(string typeName, Func<Task> action)
        {
            var sw = new Stopwatch();
            sw.Start();

            _logger.Information($"Handling: {typeName}");

            try
            {
                await action();

                sw.Stop();
                _logger.Information($"Handled: {typeName} in {sw.Elapsed}");
            }
            catch (Exception ex)
            {
                sw.Stop();

                _logger.Error(ex, nameof(typeName));
                _logger.Information($"Errored: {typeName} in {sw.Elapsed}");

                throw ex;
            }
        }
    }
}