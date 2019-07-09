using Autofac;

namespace Kairos.Infra.Write.Ioc
{
    public class Module : Autofac.Module
    {
        protected override void Load(ContainerBuilder builder)
        {
            builder.RegisterModule(new Common.Ioc.Module());
                            
            builder.RegisterType<WriteConnectionFactory>()
                .As<IWriteConnectionFactory>()
                .SingleInstance();
            
            builder.RegisterType<WriteRepository>()
                .As<IWriteRepository>()
                .SingleInstance();
        }
    }
}