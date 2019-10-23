using System.IO;

namespace Kairos.Application.TimeEntry.Dtos
{
    public class ReportModel
    {
        public ReportModel(MemoryStream file, string fileName, string contentType)
        {
            File = file;
            FileName = fileName;
            ContentType = contentType;
        }

        public MemoryStream File { get; }
        public string FileName { get; }
        public string ContentType { get; }
    }
}