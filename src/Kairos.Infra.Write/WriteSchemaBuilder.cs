namespace Kairos.Infra.Write
{
    public interface IWriteSchemaBuilder
    {
        string Build(string stream);
    }

    public class WriteSchemaBuilder : IWriteSchemaBuilder
    {
        public string Build(string stream)
        {
            return $"master-{stream}";
        }
    }
}