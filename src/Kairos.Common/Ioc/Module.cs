using Autofac;

namespace Kairos.Common.Ioc
{
    public class Module: Autofac.Module
    {
        protected override void Load(ContainerBuilder builder)
        {
            builder.RegisterType<Serializer>()
                .As<ISerializer>()
                .SingleInstance();
        }
    }
}