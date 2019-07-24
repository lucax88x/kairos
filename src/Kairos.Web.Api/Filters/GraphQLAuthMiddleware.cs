using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;

namespace Kairos.Web.Api.Filters
{
    public class GraphQlAuthMiddleware
    {
        private readonly RequestDelegate _next;

        public GraphQlAuthMiddleware(RequestDelegate next)
        {
            _next = next;
        }

        public async Task Invoke(HttpContext context)
        {
            if (context.Request.Path == "/graphql" && !context.User.Identity.IsAuthenticated)
            {
                context.Response.StatusCode = StatusCodes.Status401Unauthorized;
                await context.Response.WriteAsync("Unauthorized");
                return;
            }

            await _next.Invoke(context);
        }
    }
}