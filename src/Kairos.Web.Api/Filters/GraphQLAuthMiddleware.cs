using System.Threading.Tasks;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Hosting;

namespace Kairos.Web.Api.Filters
{
    public class GraphQlAuthMiddleware
    {
        private readonly RequestDelegate _next;
        private readonly IWebHostEnvironment _environment;

        public GraphQlAuthMiddleware(RequestDelegate next, IWebHostEnvironment environment)
        {
            _next = next;
            _environment = environment;
        }

        public async Task Invoke(HttpContext context)
        {
            if (context.Request.Path == "/graphql" && !context.User.Identity.IsAuthenticated)
            {
                if (_environment.IsDevelopment())
                {
                    var header = context.Request.GetTypedHeaders();
                    var uriReferer = header.Referer;

                    if (uriReferer.LocalPath == "/ui/playground")
                    {
                        await _next.Invoke(context);
                        return;
                    }
                }

                context.Response.StatusCode = StatusCodes.Status401Unauthorized;
                await context.Response.WriteAsync("Unauthorized");
                return;
            }

            await _next.Invoke(context);
        }
    }
}