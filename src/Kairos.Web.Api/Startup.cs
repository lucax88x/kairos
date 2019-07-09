using Autofac;
using Kairos.Web.Api.Filters;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Serilog;
using Serilog.Events;
using Module = Kairos.Application.Ioc.Module;

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
            services.AddMvc(options =>
                    options.Filters.AddService(typeof(ApiExceptionFilter)))
                .SetCompatibilityVersion(CompatibilityVersion.Version_2_2);

            services.AddScoped<ApiExceptionFilter>();
        }

        public void Configure(IApplicationBuilder app, IHostingEnvironment env)
        {
            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
            }

            ConfigureLogger();

            app.UseMvc();
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