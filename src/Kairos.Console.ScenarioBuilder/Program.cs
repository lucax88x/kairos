using System;
using System.Threading.Tasks;
using Autofac;
using Autofac.Extensions.DependencyInjection;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Hosting;
using Serilog;

namespace Kairos.Console.ScenarioBuilder
{
    class Program
    {
        private static IConfigurationRoot _configuration;

        private static async Task<int> Main()
        {
            Log.Logger = new LoggerConfiguration()
                .Enrich.FromLogContext()
                .WriteTo.File("logs/scenario-builder.log", rollingInterval: RollingInterval.Day)
                .WriteTo.Console()
                .CreateLogger();

            try
            {
                var hostBuilder = new HostBuilder()
                    .UseServiceProviderFactory(new AutofacServiceProviderFactory())
                    .ConfigureAppConfiguration((_, config) =>
                    {
                        _configuration = config
                            .AddEnvironmentVariables("Kairos_")
                            .Build();
                    })
                    .ConfigureContainer((ContainerBuilder builder) =>
                        builder.RegisterModule(new Ioc.Module(_configuration))
                    )
                    .ConfigureServices((_, services) => { services.AddAutofac(); });

                await hostBuilder.RunConsoleAsync().ConfigureAwait(false);

                return 0;
            }
            catch (Exception ex)
            {
                Log.Fatal(ex, "Scenario Builder terminated unexpectedly");
                return 1;
            }
            finally
            {
                Log.CloseAndFlush();
            }
        }
    }
}