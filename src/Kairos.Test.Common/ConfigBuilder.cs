using System.Collections.Generic;
using Microsoft.Extensions.Configuration;

namespace Kairos.Test.Common
{
    public class ConfigBuilder
    {
        private readonly ConfigurationBuilder _configurationBuilder;

        public ConfigBuilder()
        {
            _configurationBuilder = new ConfigurationBuilder();

            var defaultConfig = new Dictionary<string, string>
            {
                {"WriteRepository:Connection", "todo"},
                {"ReadRepository:Endpoints:0", "localhost"}
            };

            Add(defaultConfig);
        }

        public ConfigBuilder Add(Dictionary<string, string> settings)
        {
            _configurationBuilder.AddInMemoryCollection(settings);
            return this;
        }

        public IConfiguration Build()
        {
            return _configurationBuilder.Build();
        }
    }
}