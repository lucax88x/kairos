using System;
using System.Collections.Generic;
using System.Linq;
using GraphQL.Types;
using Kairos.Application.TimeAbsenceEntry.Commands;
using Kairos.Application.TimeEntry.Commands;
using Kairos.Application.TimeEntry.Dtos;
using Kairos.Web.Api.GraphQL.TimeAbsenceEntry.Types;
using Kairos.Web.Api.GraphQL.TimeAbsenceEntry.Types.Inputs;
using Kairos.Web.Api.GraphQL.TimeEntry.Types;
using Kairos.Web.Api.GraphQL.TimeEntry.Types.Inputs;
using Kairos.Web.Api.GraphQL.Types;
using Kairos.Web.Api.GraphQL.Types.Outputs;
using MediatR;

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
                    var input = context.GetArgument<TimeEntryInput>("timeEntry");

                    var ids = await _mediator.Send(
                        new CreateTimeEntries(new TimeEntryModel(input.When, input.Type, input.Id)));

                    return new CreateOrUpdateOutput(ids.First());
                });

            FieldAsync<CreateOrUpdateOutputsType>(
                "createTimeEntries",
                arguments: new QueryArguments(
                    new QueryArgument<ListGraphType<NonNullGraphType<TimeEntryInputType>>> {Name = "timeEntries"}
                ),
                resolve: async context =>
                {
                    var inputs = context.GetArgument<IEnumerable<TimeEntryInput>>("timeEntries");
                    
                    var ids = await _mediator.Send(new CreateTimeEntries(
                        inputs.Select(input =>
                            new TimeEntryModel(input.When, input.Type, input.Id)).ToArray()));
                    
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
                    var input = context.GetArgument<TimeAbsenceEntryInput>("timeAbsenceEntry");
                    var id = await _mediator.Send(
                        new CreateTimeAbsenceEntry(input.When, input.Minutes, input.Type, input.Id));
                    return new CreateOrUpdateOutput(id);
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
    }
}