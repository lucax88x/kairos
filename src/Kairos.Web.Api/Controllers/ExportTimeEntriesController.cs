using System;
using System.Text;
using System.Threading;
using System.Threading.Tasks;
using Kairos.Application.TimeEntry.Queries;
using MediatR;
using Microsoft.AspNetCore.Mvc;

namespace Kairos.Web.Api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ExportTimeEntriesController : ControllerBase
    {
        private readonly IMediator _mediator;

        public ExportTimeEntriesController(IMediator mediator)
        {
            _mediator = mediator;
        }

        [HttpGet("{from}/{to}")]
        public async Task<FileResult> GetFile(DateTimeOffset from, DateTimeOffset to, CancellationToken cancellationToken)
        {
            var reportModel = await _mediator.Send(new GetTimeEntriesReport(from, to), cancellationToken);

            return File(reportModel.File, reportModel.ContentType, reportModel.FileName);
        }
    }
}