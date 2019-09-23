using System;
using System.Collections.Generic;
using System.Linq;
using GraphQL.Types;
using Kairos.Application.TimeAbsenceEntry.Commands;
using Kairos.Application.TimeAbsenceEntry.Dtos;
using Kairos.Application.TimeEntry.Commands;
using Kairos.Application.TimeEntry.Dtos;
using Kairos.Application.TimeHolidayEntry.Commands;
using Kairos.Application.TimeHolidayEntry.Dtos;
using Kairos.Application.UserProfile.Commands;
using Kairos.Application.UserProfile.Dtos;
using Kairos.Web.Api.GraphQL.TimeAbsenceEntry.Types;
using Kairos.Web.Api.GraphQL.TimeEntry.Types;
using Kairos.Web.Api.GraphQL.TimeHolidayEntry.Types;
using Kairos.Web.Api.GraphQL.Types;
using Kairos.Web.Api.GraphQL.Types.Outputs;
using Kairos.Web.Api.GraphQL.UserProfile.Types;
using MediatR;
using Nager.Date;

namespace Kairos.Web.Api.GraphQL
{
    public class KairosMutation : ObjectGraphType
    {
        private readonly IMediator _mediator;

        public KairosMutation(IMediator mediator)
        {
            _mediator = mediator;
            Name = nameof(KairosMutation);

            SetTimeEntry();
            SetTimeAbsenceEntry();
            SetTimeHolidayEntry();
            SetUserProfile();
        }

        private void SetTimeEntry()
        {
            FieldAsync<CreateOrUpdateOutputType>(
                "createTimeEntry",
                arguments: new QueryArguments(
                    new QueryArgument<NonNullGraphType<TimeEntryInputType>> {Name = "timeEntry"}
                ),
                resolve: async context =>
                {
                    var input = context.GetArgument<TimeEntryModel>("timeEntry");

                    var ids = await _mediator.Send(new CreateTimeEntries(input));

                    return new CreateOrUpdateOutput(ids.First());
                });

            FieldAsync<CreateOrUpdateOutputType>(
                "updateTimeEntry",
                arguments: new QueryArguments(
                    new QueryArgument<NonNullGraphType<TimeEntryInputType>> {Name = "timeEntry"}
                ),
                resolve: async context =>
                {
                    var input = context.GetArgument<TimeEntryModel>("timeEntry");

                    var id = await _mediator.Send(new UpdateTimeEntry(input));

                    return new CreateOrUpdateOutput(id);
                });

            FieldAsync<CreateOrUpdateOutputsType>(
                "createTimeEntries",
                arguments: new QueryArguments(
                    new QueryArgument<ListGraphType<NonNullGraphType<TimeEntryInputType>>> {Name = "timeEntries"}
                ),
                resolve: async context =>
                {
                    var inputs = context.GetArgument<IEnumerable<TimeEntryModel>>("timeEntries");

                    var ids = await _mediator.Send(new CreateTimeEntries(inputs.ToArray()));

                    return new CreateOrUpdateOutputs(ids);
                });

            FieldAsync<CreateOrUpdateOutputType>(
                "deleteTimeEntry",
                arguments: new QueryArguments(
                    new QueryArgument<IdGraphType> {Name = "id"}
                ),
                resolve: async context =>
                {
                    var input = context.GetArgument<Guid>("id");
                    var id = await _mediator.Send(new DeleteTimeEntry(input));
                    return new CreateOrUpdateOutput(id);
                });
        }

        private void SetTimeAbsenceEntry()
        {
            FieldAsync<CreateOrUpdateOutputType>(
                "createTimeAbsenceEntry",
                arguments: new QueryArguments(
                    new QueryArgument<NonNullGraphType<TimeAbsenceEntryInputType>> {Name = "timeAbsenceEntry"}
                ),
                resolve: async context =>
                {
                    var input = context.GetArgument<TimeAbsenceEntryModel>("timeAbsenceEntry");
                    var ids = await _mediator.Send(new CreateTimeAbsenceEntries(input));

                    return new CreateOrUpdateOutput(ids.First());
                });

            FieldAsync<CreateOrUpdateOutputType>(
                "updateTimeAbsenceEntry",
                arguments: new QueryArguments(
                    new QueryArgument<NonNullGraphType<TimeAbsenceEntryInputType>> {Name = "timeAbsenceEntry"}
                ),
                resolve: async context =>
                {
                    var input = context.GetArgument<TimeAbsenceEntryModel>("timeAbsenceEntry");

                    var id = await _mediator.Send(new UpdateTimeAbsenceEntry(input));

                    return new CreateOrUpdateOutput(id);
                });

            FieldAsync<CreateOrUpdateOutputsType>(
                "createTimeAbsenceEntries",
                arguments: new QueryArguments(
                    new QueryArgument<ListGraphType<NonNullGraphType<TimeAbsenceEntryInputType>>>
                        {Name = "timeAbsenceEntries"}
                ),
                resolve: async context =>
                {
                    var input = context.GetArgument<IEnumerable<TimeAbsenceEntryModel>>("timeAbsenceEntries");
                    var ids = await _mediator.Send(new CreateTimeAbsenceEntries(input.ToArray()));

                    return new CreateOrUpdateOutputs(ids);
                });

            FieldAsync<CreateOrUpdateOutputType>(
                "deleteTimeAbsenceEntry",
                arguments: new QueryArguments(
                    new QueryArgument<IdGraphType> {Name = "id"}
                ),
                resolve: async context =>
                {
                    var input = context.GetArgument<Guid>("id");
                    var id = await _mediator.Send(new DeleteTimeAbsenceEntry(input));
                    return new CreateOrUpdateOutput(id);
                });
        }

        private void SetTimeHolidayEntry()
        {
            FieldAsync<CreateOrUpdateOutputType>(
                "createTimeHolidayEntry",
                arguments: new QueryArguments(
                    new QueryArgument<NonNullGraphType<TimeHolidayEntryInputType>> {Name = "timeHolidayEntry"}
                ),
                resolve: async context =>
                {
                    var input = context.GetArgument<TimeHolidayEntryModel>("timeHolidayEntry");
                    var ids = await _mediator.Send(new CreateTimeHolidayEntries(input));
                    return new CreateOrUpdateOutput(ids.First());
                });

            FieldAsync<CreateOrUpdateOutputType>(
                "updateTimeHolidayEntry",
                arguments: new QueryArguments(
                    new QueryArgument<NonNullGraphType<TimeHolidayEntryInputType>> {Name = "timeHolidayEntry"}
                ),
                resolve: async context =>
                {
                    var input = context.GetArgument<TimeHolidayEntryModel>("timeHolidayEntry");

                    var id = await _mediator.Send(new UpdateTimeHolidayEntry(input));

                    return new CreateOrUpdateOutput(id);
                });
            
            FieldAsync<CreateOrUpdateOutputsType>(
                "createTimeHolidayEntries",
                arguments: new QueryArguments(
                    new QueryArgument<ListGraphType<NonNullGraphType<TimeHolidayEntryInputType>>>
                        {Name = "timeHolidayEntries"}
                ),
                resolve: async context =>
                {
                    var input = context.GetArgument<IEnumerable<TimeHolidayEntryModel>>("timeHolidayEntries");
                    var ids = await _mediator.Send(new CreateTimeHolidayEntries(input.ToArray()));
                    return new CreateOrUpdateOutputs(ids);
                });

            FieldAsync<CreateOrUpdateOutputType>(
                "deleteTimeHolidayEntry",
                arguments: new QueryArguments(
                    new QueryArgument<IdGraphType> {Name = "id"}
                ),
                resolve: async context =>
                {
                    var input = context.GetArgument<Guid>("id");
                    var id = await _mediator.Send(new DeleteTimeHolidayEntry(input));
                    return new CreateOrUpdateOutput(id);
                });

            FieldAsync<CreateOrUpdateOutputsType>(
                "updateTimeHolidayEntriesByCountry",
                arguments: new QueryArguments(
                    new QueryArgument<IntGraphType> {Name = "year"},
                    new QueryArgument<StringGraphType> {Name = "countryCode"}
                ),
                resolve: async context =>
                {
                    var year = context.GetArgument<int>("year");
                    var countryCode = context.GetArgument<CountryCode>("countryCode");
                    var ids = await _mediator.Send(new UpdateTimeHolidayEntriesByCountry(year, countryCode));
                    return new CreateOrUpdateOutputs(ids);
                });
        }

        private void SetUserProfile()
        {
            FieldAsync<CreateOrUpdateOutputType>(
                "createOrUpdateUserProfile",
                arguments: new QueryArguments(
                    new QueryArgument<NonNullGraphType<UserProfileInputType>> {Name = "userProfile"}
                ),
                resolve: async context =>
                {
                    var input = context.GetArgument<UserProfileModel>("userProfile");

                    await _mediator.Send(
                        new CreateOrUpdateUserProfile(input));

                    return new CreateOrUpdateOutput(Guid.Empty);
                });
        }
    }
}