using Autofac;
using GraphQL.Server;
using GraphQL.Server.Ui.Playground;
using GraphQL.Types;
using Kairos.Web.Api.Filters;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Server.Kestrel.Core;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Serilog;
using Serilog.Events;
using Module = Kairos.Web.Api.Ioc.Module;

namespace Kairos.Web.Api
{
    public class Startup
    {
        public IConfiguration Configuration { get; }

        public Startup(IConfiguration configuration)
        {
            Configuration = configuration;
        }

        public void ConfigureContainer(ContainerBuilder builder)
        {
            builder.RegisterModule(new Module(Configuration));
        }

        public void ConfigureServices(IServiceCollection services)
        {
            var domain = Configuration["Auth:Domain"];
            var audience = Configuration["Auth:Audience"];

            services.AddMvc(options =>
                {
                    options.Filters.Add(typeof(ApiExceptionFilter)); // By type

                    options.EnableEndpointRouting = false;
                })
                .AddNewtonsoftJson()
                .SetCompatibilityVersion(CompatibilityVersion.Version_3_0);

            services.AddScoped<ApiExceptionFilter>();

            services.AddGraphQL(_ =>
            {
                _.EnableMetrics = true;
                _.ExposeExceptions = true;
            });

            services.AddAuthentication(options =>
            {
                options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
                options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
            }).AddJwtBearer(options =>
            {
                options.Authority = domain;
                options.Audience = audience;
            });

            // kestrel
            services.Configure<KestrelServerOptions>(options => { options.AllowSynchronousIO = true; });

            services.AddControllers();
        }

        public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
        {
            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
            }

            ConfigureLogger();

            app.UseAuthentication();
            app.UseMiddleware<GraphQlAuthMiddleware>();

            app.UseRouting();

            app.UseMvc();

            app.UseEndpoints(endpoints => { endpoints.MapControllers(); });

            app.UseGraphQL<ISchema>();

            if (env.IsDevelopment())
            {
                app.UseGraphQLPlayground(new GraphQLPlaygroundOptions
                {
                    Path = "/ui/playground"
                });
            }
        }

        private void ConfigureLogger()
        {
            Log.Logger = new LoggerConfiguration()
                .MinimumLevel.Debug()
                .MinimumLevel.Override("Microsoft", LogEventLevel.Information)
                .Enrich.FromLogContext()
                .WriteTo.File("logs/api-{Hour}.log", rollingInterval: RollingInterval.Hour)
                .WriteTo.Console()
                .CreateLogger();
        }
    }
}