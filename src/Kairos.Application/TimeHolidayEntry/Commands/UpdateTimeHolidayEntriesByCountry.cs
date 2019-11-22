using System;
using System.Collections.Immutable;
using Kairos.Common;
using Nager.Date;

namespace Kairos.Application.TimeHolidayEntry.Commands
{
    public class UpdateTimeHolidayEntriesByCountry : Command<ImmutableList<Guid>>
    {
        public UpdateTimeHolidayEntriesByCountry(int year, CountryCode countryCode)
        {
            Year = year;
            CountryCode = countryCode;
        }

        public int Year { get; }
        public CountryCode CountryCode { get; }
    }
}