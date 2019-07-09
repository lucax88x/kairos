namespace Kairos.Test.Common.Infra
{
    public class SandboxOptions
    {
        public SandboxOptions(bool setupRedis = false)
        {
            SetupRedis = setupRedis;
        }

        public bool SetupRedis { get; }
    }
}