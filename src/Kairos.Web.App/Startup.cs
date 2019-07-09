using System.IO;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.DependencyInjection;
using Serilog;
using Serilog.Events;

namespace Kairos.Web.App
{
    public class Startup
    {
        public void ConfigureServices(IServiceCollection services)
        {
        }

        public void Configure(IApplicationBuilder app, IHostingEnvironment env)
        {
            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
            }

            ConfigureLogger();

            app.Use(async (context, next) =>
            {
                await next();

                if (context.Response.StatusCode == 404 && !Path.HasExtension(context.Request.Path.Value))
                {
                    context.Request.Path = "/index.html";
                    await next();
                }
            });

            app.UseFileServer(new FileServerOptions
            {
                StaticFileOptions =
                {
                    OnPrepareResponse = ctx =>
                    {
                        if (ctx.File.Name == "service-worker.js")
                        {
                            ctx.Context.Response.Headers.Append("Cache-Control", "no-cache, no-store, must-revalidate");
                        }
                        else
                        {
                            ctx.Context.Response.Headers.Append("Cache-Control", "public,max-age=86400");
                        }
                    }
                }
            });
        }

        private void ConfigureLogger()
        {
            Log.Logger = new LoggerConfiguration()
                .MinimumLevel.Debug()
                .MinimumLevel.Override("Microsoft", LogEventLevel.Information)
                .Enrich.FromLogContext()
                .WriteTo.File("logs/app-{Hour}.log", rollingInterval: RollingInterval.Hour)
                .WriteTo.Console()
                .CreateLogger();
        }
    }
}