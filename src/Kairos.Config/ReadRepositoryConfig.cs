using System.Collections.Generic;

namespace Kairos.Config
{
    public class ReadRepositoryConfig
    {
        public int Database { get; set; }
        public List<string> Endpoints { get; set; } = new List<string>();
    }
}