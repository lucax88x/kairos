using System;
using Autofac;
using Autofac.Extras.DynamicProxy;
using Kairos.Application;
using Kairos.Config.Ioc;
using Kairos.Infra.Read;
using Kairos.Infra.Write;
using Kairos.Test.Common.Infra.Builders;
using Kairos.Test.Common.Infra.FluentAssertion;
using Kairos.Test.Common.Infra.Mediator;
using Kairos.Test.Common.Infra.Scenario;
using MediatR;
using Module = Autofac.Module;

namespace Kairos.Test.Common.Infra
{
    public class Sandbox : IDisposable
    {
        private readonly IContainer _container;
        private MediatorSniffer? _mediatorSniffer;
        private readonly SandboxOptions _sandboxOptions;

        public FluentSandboxAssertion? Should { get; private set; }
        public IMediator? Mediator { get; private set; }
        public ScenarioBuilder? Scenario { get; private set; }
        public ModelBuilder? Model { get; private set; }
        public IReadConnectionFactory? ReadConnectionFactory { get; private set; }

        public Sandbox(SandboxOptions sandboxOptions, params Module[] modules)
        {
            _sandboxOptions = sandboxOptions;

            var builder = new ContainerBuilder();

            foreach (var module in modules)
                builder.RegisterModule(module);

            RegisterMediatorSniffers(builder);
            RegisterFluentAssertions(builder);
            RegisterScenarioBuilder(builder);
            RegisterModelBuilder(builder);
            RegisterAuthProvider(builder);
            RegisterEventStore(builder);

            _container = builder.Build();

            ResolveMediator();
            ResolveFluentAssertions();
            ResolveScenarioBuilder();
            ResolveModelBuilder();
            ResolveReadConnectionFactory();

            SetupRedis();
        }

        public T Resolve<T>()
        {
            return _container.Resolve<T>();
        }

        public void ClearMediator()
        {
            _mediatorSniffer?.Clear();
        }

        public void Dispose()
        {
            _mediatorSniffer?.Dispose();
            _container?.Dispose();
        }

        private static void RegisterMediatorSniffers(ContainerBuilder builder)
        {
            builder.RegisterType<MediatorSnifferInterceptor>();
            builder.RegisterType<MediatorSniffer>().AsSelf().SingleInstance();

            builder.Register<ServiceFactory>(ctx =>
            {
                var c = ctx.Resolve<IComponentContext>();
                return t => c.Resolve(t);
            });

            builder
                .RegisterType<MediatR.Mediator>()
                .As<IMediator>()
                .InstancePerLifetimeScope()
                .EnableInterfaceInterceptors()
                .InterceptedBy(typeof(MediatorSnifferInterceptor));
        }

        private void RegisterFluentAssertions(ContainerBuilder builder)
        {
            // needed for Assertions
            builder.RegisterModule(new Config.Ioc.Module(
                new ConfigBuilder().Build(),
                new ModuleOptions
                {
                    HasReadRepository = true, HasWriteRepository = true
                }));

            builder.RegisterModule(new Kairos.Infra.Read.Ioc.Module());
            builder.RegisterModule(new Kairos.Infra.Write.Ioc.Module());

            builder.RegisterType<FluentSandboxAssertion>().AsSelf().SingleInstance()
                .PropertiesAutowired(PropertyWiringOptions.AllowCircularDependencies);

            builder.RegisterType<FluentMediatorAssertion>().AsSelf().SingleInstance()
                .PropertiesAutowired(PropertyWiringOptions.AllowCircularDependencies);

            builder.RegisterType<FluentRedisAssertion>().AsSelf().SingleInstance()
                .PropertiesAutowired(PropertyWiringOptions.AllowCircularDependencies);

            builder.RegisterType<FluentRedisExistsAssertion>().AsSelf().SingleInstance()
                .PropertiesAutowired(PropertyWiringOptions.AllowCircularDependencies);

            builder.RegisterType<FluentRedisNotExistsAssertion>().AsSelf().SingleInstance()
                .PropertiesAutowired(PropertyWiringOptions.AllowCircularDependencies);
        }

        private void RegisterScenarioBuilder(ContainerBuilder builder)
        {
            builder.RegisterType<ScenarioBuilder>().AsSelf().SingleInstance()
                .PropertiesAutowired(PropertyWiringOptions.AllowCircularDependencies);
            
            builder.RegisterType<TimeEntryScenarioBuilder>().AsSelf().SingleInstance()
                .PropertiesAutowired(PropertyWiringOptions.AllowCircularDependencies);
            
            builder.RegisterType<UserProfileScenarioBuilder>().AsSelf().SingleInstance()
                .PropertiesAutowired(PropertyWiringOptions.AllowCircularDependencies);
        }
        
        private void RegisterModelBuilder(ContainerBuilder builder)
        {
            builder.RegisterType<ModelBuilder>().AsSelf().SingleInstance()
                .PropertiesAutowired(PropertyWiringOptions.AllowCircularDependencies);
            
            builder.RegisterType<UserJobModelBuilder>().AsSelf().SingleInstance()
                .PropertiesAutowired(PropertyWiringOptions.AllowCircularDependencies);
        }
        
        private void RegisterAuthProvider(ContainerBuilder builder)
        {
            builder.RegisterType<FakeAuthProvider>().As<IAuthProvider>().SingleInstance();
        }

        private void RegisterEventStore(ContainerBuilder builder)
        {
            builder
                .RegisterInstance(new FakeWriteSchemaBuilder(DateTime.UtcNow.Ticks.ToString()))
                .As<IWriteSchemaBuilder>().SingleInstance();
        }

        private void ResolveMediator()
        {
            Mediator = _container.Resolve<IMediator>();
            _mediatorSniffer = _container.Resolve<MediatorSniffer>();
        }

        private void ResolveFluentAssertions()
        {
            Should = _container.Resolve<FluentSandboxAssertion>();
        }

        private void ResolveScenarioBuilder()
        {
            Scenario = _container.Resolve<ScenarioBuilder>();
        }
        
        private void ResolveModelBuilder()
        {
            Model = _container.Resolve<ModelBuilder>();
        }
        
        private void ResolveReadConnectionFactory()
        {
            ReadConnectionFactory = _container.Resolve<IReadConnectionFactory>();
        }

        private void SetupRedis()
        {
            if (_sandboxOptions.SetupRedis)
            {
                ReadConnectionFactory?.FlushDatabase(5);
            }
        }
    }
}