using Kairos.Common.Exceptions.Technical;
using Microsoft.AspNetCore.Http;
using Serilog;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;

namespace Kairos.Web.Api.Filters
{
    public class ApiExceptionFilter : ExceptionFilterAttribute
    {
        private readonly ILogger _logger;

        public ApiExceptionFilter(ILogger logger)
        {
            _logger = logger;
        }

        public override void OnException(ExceptionContext context)
        {
            _logger.Error(context.Exception, "ApiExceptionFilter");

            if (context.Exception is EntityNotFoundException)
            {
                context.Result = new NotFoundResult();
            }
            else if (context.Exception is NotAuthorizedException)
            {
                context.Result = new StatusCodeResult(StatusCodes.Status401Unauthorized);
            }
            else if (context.Exception is NotAuthorizedException)
            {
                context.Result = new StatusCodeResult(StatusCodes.Status403Forbidden);
            }
            else if (context.Exception is ConcurrencyException)
            {
                context.Result = new StatusCodeResult(StatusCodes.Status409Conflict);
            }

            if (context.Result == null) context.Result = new StatusCodeResult(StatusCodes.Status500InternalServerError);

            base.OnException(context);
        }
    }
}