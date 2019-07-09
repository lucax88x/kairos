using System;
using System.Diagnostics;
using System.Linq;
using Castle.DynamicProxy;
using Serilog;

namespace Kairos.Common.Interceptors
{
    public class MediatorInterceptor : IInterceptor
    {
        private readonly ILogger _logger;

        public MediatorInterceptor(ILogger logger)
        {
            _logger = logger ?? throw new ArgumentNullException(nameof(logger));
        }

        public void Intercept(IInvocation invocation)
        {
            if (invocation == null) throw new ArgumentException(nameof(invocation));

            var argument = invocation.Arguments.Select(a => (a ?? "").ToString()).ToArray().FirstOrDefault();

            string resp = null;
            if (argument != null)
            {
                resp = argument.Split('.').Last();
            }

            var sw = new Stopwatch();
            sw.Start();
            if (!string.IsNullOrEmpty(resp))
            {
                _logger.Information($"Handling: {resp}");
            }

            invocation.Proceed();

            sw.Stop();
            if (!string.IsNullOrEmpty(resp))
            {
                _logger.Information($"Handled: {resp} in {sw.Elapsed}");
            }
        }
    }
}