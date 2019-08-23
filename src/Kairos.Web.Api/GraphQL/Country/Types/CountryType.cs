using GraphQL.Types;
using Kairos.Application.Country.Dtos;
using Kairos.Infra.Read.TimeEntry;
using Kairos.Web.Api.GraphQL.UserProfile.Types;
using Nager.Date;

namespace Kairos.Web.Api.GraphQL.Country.Types
{
    public class CountryType : ObjectGraphType<CountryModel>
    {
        public CountryType()
        {
            Name = nameof(CountryModel);
            Description = "It's the country";

            Field(d => d.Country).Description("The name of the country");
            Field(d => d.CountryCode).Description("The country code");
        }
    }
}