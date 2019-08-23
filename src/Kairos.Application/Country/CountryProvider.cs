using System.Collections.Generic;
using System.Threading.Tasks;
using Kairos.Application.Country.Dtos;
using Nager.Date;

namespace Kairos.Application.Country
{
    public interface ICountryProvider
    {
        Task<IEnumerable<CountryModel>> GetCountries();
    }

    public class CountryProvider : ICountryProvider
    {
        public async Task<IEnumerable<CountryModel>> GetCountries()
        {
            await Task.CompletedTask;

            return GetAllCountries();
        }

        private IEnumerable<CountryModel> GetAllCountries()
        {
            yield return new CountryModel(CountryCode.AD, "Andorra");
        }
    }
}