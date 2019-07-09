using System;
using Autofac;
using FluentAssertions;

namespace Kairos.Test.Common
{
    public class ScopeResolver : IDisposable
    {
        private IContainer _container;

        public ScopeResolver BuildContainer(params Module[] modules)
        {
            if (_container != null)
                throw new ArgumentException("Container is already defined, call BuildContainer or WithContainer once!");

            var builder = new ContainerBuilder();

            foreach (var module in modules)
                builder.RegisterModule(module);

            _container = builder.Build();

            return this;
        }

        public ScopeResolver WithContainer(IContainer container)
        {
            if (_container != null)
                throw new ArgumentException("Container is already defined, call BuildContainer or WithContainer once!");

            _container = container;

            return this;
        }

        public void Is<T1, T2>()
        {
            _container.Resolve<T1>().Should().BeOfType<T2>();
        }

        public void Is<T1>()
        {
            Is<T1, T1>();
        }

        public void IsSingleInstance<T1, T2>()
        {
            _container.Resolve<T1>().Should().BeOfType<T2>();

            using (var scope1 = _container.BeginLifetimeScope())
            using (var scope2 = _container.BeginLifetimeScope())
            {
                var instance1 = scope1.Resolve<T1>();
                var instance2 = scope2.Resolve<T1>();

                instance1.Should().BeSameAs(instance2, "it should be single instance");
            }
        }

        public void IsSingleInstance<T1>()
        {
            IsSingleInstance<T1, T1>();
        }

        public T1 Resolve<T1>()
        {
            return _container.Resolve<T1>();
        }

        public void IsInstancePerLifetimeScope<T1, T2>()
        {
            _container.Resolve<T1>().Should().BeOfType<T2>();

            using (var scope1 = _container.BeginLifetimeScope())
            using (var scope2 = _container.BeginLifetimeScope())
            {
                var instance1 = scope1.Resolve<T1>();
                var instance2 = scope2.Resolve<T1>();

                instance1.Should().NotBeSameAs(instance2);
            }
        }

        public void IsInstancePerLifetimeScope<T1>()
        {
            IsInstancePerLifetimeScope<T1, T1>();
        }

        public void Dispose()
        {
            _container?.Dispose();
        }
    }
}