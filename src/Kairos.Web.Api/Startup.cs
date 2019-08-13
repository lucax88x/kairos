using System;
using System.Globalization;
using System.Text;
using Autofac;
using GraphQL;
using GraphQL.Server;
using GraphQL.Server.Ui.Playground;
using GraphQL.Types;
using Kairos.Web.Api.Filters;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Serilog;
using Serilog.Events;

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
            builder.RegisterModule(new Ioc.Module(Configuration));
        }

        public void ConfigureServices(IServiceCollection services)
        {
//            var domain = Configuration["Auth:Domain"];
//            var audience = Configuration["Auth:Audience"];
            var domain = "https://kairos.eu.auth0.com/";
            var audience = "http://localhost:3000";

            services.AddMvc(options =>
                    options.Filters.AddService(typeof(ApiExceptionFilter)))
                .SetCompatibilityVersion(CompatibilityVersion.Version_2_2);

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
        }

        public void Configure(IApplicationBuilder app, IHostingEnvironment env)
        {
            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
            }

            ConfigureLogger();

            app.UseAuthentication();
            app.UseMiddleware<GraphQlAuthMiddleware>();

            app.UseMvc();

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