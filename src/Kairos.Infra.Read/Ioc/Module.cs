using Autofac;
using Kairos.Infra.Read.TimeAbsenceEntry;
using Kairos.Infra.Read.TimeEntry;

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
            
            builder.RegisterType<TimeEntryReadRepository>()
                .As<ITimeEntryReadRepository>()
                .SingleInstance();
            
            builder.RegisterType<TimeAbsenceEntryReadRepository>()
                .As<ITimeAbsenceEntryReadRepository>()
                .SingleInstance();
        }
    }
}