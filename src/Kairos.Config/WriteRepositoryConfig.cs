namespace Kairos.Config
{
    public class WriteRepositoryConfig
    {
        public string ConnectionString { get; }

        public WriteRepositoryConfig(string connectionString)
        {
            ConnectionString = connectionString;
        }
    }
}
