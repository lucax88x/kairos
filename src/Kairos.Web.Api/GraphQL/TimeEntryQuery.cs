using System;
using GraphQL.Types;
using Kairos.Application.TimeEntry.Queries;
using Kairos.Web.Api.GraphQL.Types;
using MediatR;

namespace Kairos.Web.Api.GraphQL
{
    public class TimeEntryQuery : ObjectGraphType
    {
        public TimeEntryQuery(IMediator mediator)
        {
            Name = nameof(TimeEntryQuery);

            FieldAsync<TimeEntryType>(
                "TimeEntry",
                "The time entry",
                new QueryArguments(
                    new QueryArgument<IdGraphType>
                        {Name = "id", Description = "id of the time entry"}
                ),
                async context => await mediator.Send(new GetTimeEntryById(context.GetArgument<Guid>("id"))));

            FieldAsync<ListGraphType<TimeEntryType>>(
                "TimeEntries",
                "The time entries of user",
                resolve: async context => await mediator.Send(new GetTimeEntries()));
        }
    }
}