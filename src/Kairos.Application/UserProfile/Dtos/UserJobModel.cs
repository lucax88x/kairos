using System;
using System.Collections.Generic;
using System.Linq;
using Kairos.Domain.Events.UserProfile.EventDtos;

namespace Kairos.Application.UserProfile.Dtos
{
    public class UserJobModel
    {
        public UserJobModel()
        {
        }

        public UserJobModel(Guid id, string name, DateTimeOffset start, DateTimeOffset? end, decimal holidaysPerYear,
            decimal monday, decimal tuesday, decimal wednesday, decimal thursday, decimal friday, decimal saturday,
            decimal sunday,
            IEnumerable<UserProjectModel> projects)
        {
            Id = id;
            Name = name;
            Start = start;
            End = end;
            HolidaysPerYear = holidaysPerYear;
            Monday = monday;
            Tuesday = tuesday;
            Wednesday = wednesday;
            Thursday = thursday;
            Friday = friday;
            Saturday = saturday;
            Sunday = sunday;
            Projects = projects;
        }

        public Guid Id { get; set; }
        public string? Name { get; set; }
        public DateTimeOffset Start { get; set; }
        public DateTimeOffset? End { get; set; }
        public decimal HolidaysPerYear { get; set; }
        public decimal Monday { get; set; }
        public decimal Tuesday { get; set; }
        public decimal Wednesday { get; set; }
        public decimal Thursday { get; set; }
        public decimal Friday { get; set; }
        public decimal Saturday { get; set; }
        public decimal Sunday { get; set; }
        public IEnumerable<UserProjectModel>? Projects { get; set; }

        public static UserJobEventDto To(UserJobModel model)
        {
            return new UserJobEventDto(model.Id, model.Name, model.Start, model.End,
                model.HolidaysPerYear,
                model.Monday, model.Tuesday, model.Wednesday, model.Thursday, model.Friday, model.Saturday,
                model.Sunday,
                model.Projects.Select(UserProjectModel.To));
        }
    }
}