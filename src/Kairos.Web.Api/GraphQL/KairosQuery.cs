using System;
using GraphQL.Types;
using Kairos.Application;
using Kairos.Application.TimeAbsenceEntry.Queries;
using Kairos.Application.TimeEntry.Queries;
using Kairos.Web.Api.GraphQL.TimeAbsenceEntry.Types;
using Kairos.Web.Api.GraphQL.TimeEntry.Types;
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

            SetTimeEntry();
            SetTimeAbsenceEntry();
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
                resolve: async context => await _mediator.Send(new GetTimeAbsenceEntries(_authProvider.GetUser())));
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
                resolve: async context => await _mediator.Send(new GetTimeEntries(_authProvider.GetUser())));
        }
    }
}