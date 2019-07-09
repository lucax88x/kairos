namespace Kairos.Infra.Write
{
    public class EventMetadata
    {
        public EventMetadata(string typeName, long version)
        {
            TypeName = typeName;
            Version = version;
        }

        public string TypeName { get; private set; }
        public long Version { get; private set; }
    }
}