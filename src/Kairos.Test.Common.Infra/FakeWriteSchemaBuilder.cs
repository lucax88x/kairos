using Kairos.Infra.Write;

namespace Kairos.Test.Common.Infra
{
    public class FakeWriteSchemaBuilder : IWriteSchemaBuilder
    {
        private readonly string _namespace;

        public FakeWriteSchemaBuilder(string ns)
        {
            _namespace = ns;
        }

        public string Build(string stream)
        {
            return $"{_namespace}_{stream}";
        }
    }
}