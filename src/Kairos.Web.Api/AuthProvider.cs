using System.Security.Claims;
using Kairos.Application;
using Kairos.Common.Exceptions.Technical;
using Microsoft.AspNetCore.Http;

namespace Kairos.Web.Api
{
    public class AuthProvider: IAuthProvider
    {
        private readonly IHttpContextAccessor _httpContextAccessor;

        public AuthProvider(IHttpContextAccessor httpContextAccessor)
        {
            _httpContextAccessor = httpContextAccessor;
        }
        
        public string GetUser()
        {
            if (!(_httpContextAccessor.HttpContext?.User.Identity is ClaimsIdentity identity))
                throw new NotAuthorizedException();

            var userId = identity.FindFirst(ClaimTypes.NameIdentifier);

            if (userId == null) throw new NotAuthorizedException();

            return userId.Value;
        }
    }
}