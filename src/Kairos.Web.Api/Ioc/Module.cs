﻿using System;
using Autofac;
using GraphQL;
using GraphQL.Http;
using GraphQL.Types;
using Kairos.Application;
using Kairos.Config.Ioc;
using Kairos.Web.Api.GraphQL;
using Kairos.Web.Api.GraphQL.Types;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Configuration;

namespace Kairos.Web.Api.Ioc
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
            
            builder.RegisterType<HttpContextAccessor>()
                .As<IHttpContextAccessor>()
                .SingleInstance();
            
            builder.RegisterType<AuthProvider>().As<IAuthProvider>().InstancePerLifetimeScope();

            RegisterGraphQL(builder);
        }

        private void RegisterGraphQL(ContainerBuilder builder)
        {
            builder.RegisterInstance(new DocumentExecuter()).As<IDocumentExecuter>();
            builder.RegisterInstance(new DocumentWriter()).As<IDocumentWriter>();

            builder.RegisterType<TimeEntryType>()
                .AsSelf();
            builder.RegisterType<TimeEntryTypeEnum>()
                .AsSelf();
            builder.RegisterType<TimeEntryInputType>()
                .AsSelf();
            builder.RegisterType<CreateOrUpdateType>()
                .AsSelf();

            builder.RegisterType<TimeEntryQuery>()
                .AsSelf();
            builder.RegisterType<TimeEntryMutation>()
                .AsSelf();
            builder.RegisterType<TimeEntrySchema>()
                .As<ISchema>();

            builder.Register<Func<Type, GraphType>>(c =>
            {
                var context = c.Resolve<IComponentContext>();
                return t =>
                {
                    var res = context.Resolve(t);
                    return (GraphType) res;
                };
            });

            builder.Register<IDependencyResolver>(c =>
            {
                var context = c.Resolve<IComponentContext>();
                return new FuncDependencyResolver(type => context.Resolve(type));
            });
        }
    }
}