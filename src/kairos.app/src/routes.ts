import { getDate, getMonth } from 'date-fns';

export class RouteMatcher {
  static Login = '/login';
  static Private = '/private';
  static PrivateWithYear = '/private/:year';

  static Profile = buildRouteMatcher(RouteMatcher.Private, '/profile');
  static Dashboard = buildRouteMatcher(
    RouteMatcher.PrivateWithYear,
    '/dashboard',
  );
  static NavigatorCustom = buildRouteMatcher(
    RouteMatcher.PrivateWithYear,
    '/navigator/custom',
  );
  static Navigator = buildRouteMatcher(
    RouteMatcher.PrivateWithYear,
    '/navigator/:month/:day',
  );
  static TimeEntries = buildRouteMatcher(
    RouteMatcher.PrivateWithYear,
    '/time-entries',
  );
  static TimeAbsenceEntries = buildRouteMatcher(
    RouteMatcher.PrivateWithYear,
    '/time-absence-entries',
  );
  static TimeHolidayEntries = buildRouteMatcher(
    RouteMatcher.PrivateWithYear,
    '/time-holiday-entries',
  );
  static EditTimeEntry = buildRouteMatcher(RouteMatcher.Private, '/entry/:id');
  static EditTimeAbsenceEntry = buildRouteMatcher(
    RouteMatcher.Private,
    '/absence/:id',
  );
  static EditTimeHolidayEntry = buildRouteMatcher(
    RouteMatcher.Private,
    '/holiday/:id',
  );
  static BulkInsert = buildRouteMatcher(RouteMatcher.Private, '/bulk-insert');
  static Export = buildRouteMatcher(RouteMatcher.Private, '/export');
}

function buildRouteMatcher(prefix: string, route: string) {
  return `${prefix}${route}`;
}

export function buildPrivateRouteWithYear(route: string, year: number) {
  return route.replace(':year', year.toString());
}

export function buildNavigatorRoute(
  year: number,
  month?: number,
  day?: number,
) {
  if (!month) {
    month = getMonth(new Date()) + 1;
  }
  if (!day) {
    day = getDate(new Date());
  }
  return buildPrivateRouteWithYear(RouteMatcher.Navigator, year)
    .replace(':month', month.toString())
    .replace(':day', day.toString());
}
