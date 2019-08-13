using Kairos.Application;

namespace Kairos.Console.ScenarioBuilder
{
    public class LocalAuthProvider : IAuthProvider
    {
        public string GetUser()
        {
            // lucax88x@gmail.com auth0 userid
            return "google-oauth2|103909866863116961044";
        }
    }
}