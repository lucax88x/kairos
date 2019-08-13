namespace Kairos.Test.Common.Infra.Builders
{
    public class ModelBuilder
    {
        public ModelBuilder(UserJobModelBuilder userJob)
        {
            UserJob = userJob;
        }

        public UserJobModelBuilder UserJob { get; }
    }
}