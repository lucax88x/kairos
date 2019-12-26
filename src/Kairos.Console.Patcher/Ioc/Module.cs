using Autofac;
using Kairos.Application;
using Kairos.Config.Ioc;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Hosting;

namespace Kairos.Console.Patcher.Ioc
{
    public class Module : Autofac.Module
    {
        private readonly IConfiguration _configuration;

        public Module(IConfiguration configuration)
        {
            _configuration = configuration;
        }

        protected override void Load(ContainerBuilder builder)
        {
            builder.RegisterModule(new Config.Ioc.Module(_configuration,
                new ModuleOptions {HasReadRepository = true, HasWriteRepository = true}));

            builder.RegisterModule(new Application.Ioc.Module());

            builder.RegisterType<LocalAuthProvider>().As<IAuthProvider>().InstancePerLifetimeScope();

            builder.RegisterType<PatcherHostedService>()
                .As<IHostedService>()
                .SingleInstance();
        }
    }
}