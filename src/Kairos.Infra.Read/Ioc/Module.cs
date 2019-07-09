using Autofac;

namespace Kairos.Infra.Read.Ioc
{
    public class Module : Autofac.Module
    {
        protected override void Load(ContainerBuilder builder)
        {
            builder.RegisterModule(new Common.Ioc.Module());

            builder.RegisterType<ReadConnectionFactory>()
                .As<IReadConnectionFactory>()
                .SingleInstance();

            builder.RegisterType<ReadRepositoryFactory>()
                .AsSelf()
                .SingleInstance();
        }
    }
}