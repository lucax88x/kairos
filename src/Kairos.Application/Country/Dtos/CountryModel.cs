using Nager.Date;

namespace Kairos.Application.Country.Dtos
{
    public class CountryModel
    {
        public string CountryCode { get; }
        public string Country { get; }
        
        public CountryModel(CountryCode countryCode, string country)
        {
            CountryCode = countryCode.ToString();
            Country = country;
        }
    }
}