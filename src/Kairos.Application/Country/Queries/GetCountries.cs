using System.Collections.Immutable;
using Kairos.Application.Country.Dtos;
using Kairos.Common;

namespace Kairos.Application.Country.Queries
{
    public class GetCountries : Query<ImmutableList<CountryModel>>
    {
    }
}