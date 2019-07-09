using System;
using System.Collections.Generic;
using System.Linq;
using Autofac;
using Microsoft.Extensions.Configuration;

namespace Kairos.Config.Ioc
{
    public class Module : Autofac.Module
    {
        private readonly IConfiguration _configuration;
        private readonly ModuleOptions _options;

        public Module(IConfiguration configuration, ModuleOptions options = new ModuleOptions())
        {
            _configuration = configuration;
            _options = options;
        }

        protected override void Load(ContainerBuilder builder)
        {
            if (_options.HasWriteRepository)
            {
                builder.RegisterInstance(
                        new WriteRepositoryConfig
                        {
                            Connection = GetValueOrThrow("WriteRepository:Connection")
                        })
                    .SingleInstance();
            }

            if (_options.HasReadRepository)
            {
                builder.RegisterInstance(new ReadRepositoryConfig
                    {
                        Endpoints = GetValuesOrThrow("ReadRepository:Endpoints").ToList()
                    })
                    .SingleInstance();
            }
        }

        private string GetValueOrThrow(string key)
        {
            var value = _configuration.GetSection(key).Value;

            if (string.IsNullOrWhiteSpace(value))
                throw new Exception($"Config missing for {key}");

            return value;
        }

        private IEnumerable<string> GetValuesOrThrow(string key)
        {
            var section = _configuration.GetSection(key);

            foreach (var endpoint in section.GetChildren())
            {
                if (string.IsNullOrWhiteSpace(endpoint.Value))
                    throw new Exception($"Config missing for {key}");

                yield return endpoint.Value;
            }
        }
    }
}