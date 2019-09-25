using System.Collections.Generic;

namespace Kairos.Config
{
    public class ReadRepositoryConfig
    {
        public ReadRepositoryConfig(int database, List<string> endpoints)
        {
            Database = database;
            Endpoints = endpoints;
        }

        public int Database { get; }
        public List<string> Endpoints { get; }
    }
}