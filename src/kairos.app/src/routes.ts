export class Routes {
  static Login = '/login';
  static Private = '/private';
  static Profile = '/private/profile';
  static Dashboard = '/private/dashboard';
  static Navigator = '/private/navigator/:date';
  static TimeEntries = '/private/time-entries';
  static TimeAbsenceEntries = '/private/time-absence-entries';
  static TimeHolidayEntries = '/private/time-holiday-entries';
  static EditTimeEntry = '/private/entry/:id';
  static EditTimeAbsenceEntry = '/private/absence/:id';
  static EditTimeHolidayEntry = '/private/holiday/:id';
  static BulkInsert = '/private/bulk-insert';
  static Export = '/private/export';
}
