using System;
using GraphQL.Types;
using Kairos.Application;
using Kairos.Application.Country.Queries;
using Kairos.Application.TimeAbsenceEntry.Queries;
using Kairos.Application.TimeEntry.Queries;
using Kairos.Application.TimeHolidayEntry.Queries;
using Kairos.Application.UserProfile.Queries;
using Kairos.Web.Api.GraphQL.Country.Types;
using Kairos.Web.Api.GraphQL.TimeAbsenceEntry.Types;
using Kairos.Web.Api.GraphQL.TimeEntry.Types;
using Kairos.Web.Api.GraphQL.TimeHolidayEntry.Types;
using Kairos.Web.Api.GraphQL.UserProfile.Types;
using MediatR;

namespace Kairos.Web.Api.GraphQL
{
    public class KairosQuery : ObjectGraphType
    {
        private readonly IMediator _mediator;
        private readonly IAuthProvider _authProvider;

        public KairosQuery(IMediator mediator, IAuthProvider authProvider)
        {
            _mediator = mediator;
            _authProvider = authProvider;
            Name = nameof(KairosQuery);

            SetCountry();
            SetTimeEntry();
            SetTimeAbsenceEntry();
            SetTimeHolidayEntry();
            SetUserProfile();
        }

        private void SetCountry()
        {
            FieldAsync<ListGraphType<CountryType>>(
                "countries",
                "The available countries",
                resolve: async context => await _mediator.Send(new GetCountries()));
        }

        private void SetTimeEntry()
        {
            FieldAsync<TimeEntryType>(
                "timeEntry",
                "The time entry",
                new QueryArguments(
                    new QueryArgument<IdGraphType>
                        {Name = "id", Description = "id of the time entry"}
                ),
                async context => await _mediator.Send(new GetTimeEntryById(context.GetArgument<Guid>("id"))));

            FieldAsync<ListGraphType<TimeEntryType>>(
                "timeEntries",
                "The time entries of user",
                arguments: new QueryArguments(
                    new QueryArgument<IntGraphType> {Name = "year"}
                ),
                resolve: async context =>
                {
                    var year = context.GetArgument<int>("year");

                    return await _mediator.Send(new GetTimeEntries(_authProvider.GetUser(), year));
                });
        }

        private void SetTimeAbsenceEntry()
        {
            FieldAsync<TimeAbsenceEntryType>(
                "timeAbsenceEntry",
                "The time absence entry",
                new QueryArguments(
                    new QueryArgument<IdGraphType>
                        {Name = "id", Description = "id of the time absence entry"}
                ),
                async context => await _mediator.Send(new GetTimeAbsenceEntryById(context.GetArgument<Guid>("id"))));

            FieldAsync<ListGraphType<TimeAbsenceEntryType>>(
                "timeAbsenceEntries",
                "The time absence entries of user",
                arguments: new QueryArguments(
                    new QueryArgument<IntGraphType> {Name = "year"}
                ),
                resolve: async context =>
                {
                    var year = context.GetArgument<int>("year");

                    return await _mediator.Send(new GetTimeAbsenceEntries(_authProvider.GetUser(), year));
                });
        }

        private void SetTimeHolidayEntry()
        {
            FieldAsync<TimeHolidayEntryType>(
                "timeHolidayEntry",
                "The time holiday entry",
                new QueryArguments(
                    new QueryArgument<IdGraphType>
                        {Name = "id", Description = "id of the time holiday entry"}
                ),
                async context => await _mediator.Send(new GetTimeHolidayEntryById(context.GetArgument<Guid>("id"))));

            FieldAsync<ListGraphType<TimeHolidayEntryType>>(
                "timeHolidayEntries",
                "The time holiday entries of user",
                arguments: new QueryArguments(
                    new QueryArgument<IntGraphType> {Name = "year"}
                ),
                resolve: async context =>
                {
                    var year = context.GetArgument<int>("year");

                    return await _mediator.Send(new GetTimeHolidayEntries(_authProvider.GetUser(), year));
                });
        }

        private void SetUserProfile()
        {
            FieldAsync<UserProfileType>(
                "userProfile",
                "The profile of user",
                resolve: async context => await _mediator.Send(new GetUserProfileByUser()));
        }
    }
}