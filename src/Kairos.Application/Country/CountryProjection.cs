using System.Collections.Immutable;
using System.Threading;
using System.Threading.Tasks;
using Kairos.Application.Country.Dtos;
using Kairos.Application.Country.Queries;
using MediatR;

namespace Kairos.Application.Country
{
    public class CountryProjection :
        IRequestHandler<GetCountries, ImmutableList<CountryModel>>
    {
        private readonly ICountryProvider _countryProvider;

        public CountryProjection(ICountryProvider countryProvider)
        {
            _countryProvider = countryProvider;
        }

        public async Task<ImmutableList<CountryModel>> Handle(GetCountries request,
            CancellationToken cancellationToken)
        {
            var countries = await _countryProvider.GetCountries();

            return countries.ToImmutableList();
        }
    }
}