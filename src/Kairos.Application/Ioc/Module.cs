using System.Reflection;
using Autofac;
using AutofacSerilogIntegration;
using FluentValidation;
using Kairos.Application.Behaviors;
using Kairos.Application.Country;
using Kairos.Common;
using MediatR;
using MediatR.Pipeline;

namespace Kairos.Application.Ioc
{
    public class Module : Autofac.Module
    {
        protected override void Load(ContainerBuilder builder)
        {
            builder.RegisterLogger();

            builder.RegisterModule(new Infra.Read.Ioc.Module());
            builder.RegisterModule(new Infra.Write.Ioc.Module());
            builder.RegisterType<CountryProvider>().As<ICountryProvider>().SingleInstance();

            RegisterMediatr(builder);
        }

        private void RegisterMediatr(ContainerBuilder builder)
        {
            builder.RegisterAssemblyTypes(typeof(IMediator).GetTypeInfo().Assembly).AsImplementedInterfaces();

            var assembly = typeof(Module).GetTypeInfo().Assembly;

            builder.RegisterAssemblyTypes(assembly)
                .Where(t => t.Name.EndsWith("Service") || t.Name.EndsWith("Projection"))
                .AsImplementedInterfaces();

            builder.RegisterGeneric(typeof(RequestPostProcessorBehavior<,>)).As(typeof(IPipelineBehavior<,>));
            builder.RegisterGeneric(typeof(RequestPreProcessorBehavior<,>)).As(typeof(IPipelineBehavior<,>));
            builder.RegisterGeneric(typeof(ValidationBehavior<,>)).As(typeof(IPipelineBehavior<,>));

            builder.RegisterAssemblyTypes(assembly).AsClosedTypesOf(typeof(IValidator<>));

            builder.Register<ServiceFactory>(ctx =>
            {
                var c = ctx.Resolve<IComponentContext>();
                return t => c.Resolve(t);
            });

            builder
                .RegisterType<MediatorWithInterceptors>()
                .As<IMediator>()
                .InstancePerLifetimeScope();
        }
    }
}