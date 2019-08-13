using Kairos.Application;

namespace Kairos.Test.Common.Infra
{
    public class FakeAuthProvider: IAuthProvider
    {
        public string GetUser()
        {
            return "kairos-user";
        }
    }
}