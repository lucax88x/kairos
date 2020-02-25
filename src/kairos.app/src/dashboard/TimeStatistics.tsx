import { Trans } from '@lingui/macro';
import { ExpansionPanel, ExpansionPanelDetails, ExpansionPanelSummary, makeStyles, Table, TableBody, TableCell, TableRow, Typography } from '@material-ui/core';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import SyncAltIcon from '@material-ui/icons/SyncAlt';
import { getDate, getMonth, getUnixTime } from 'date-fns';
import Decimal from 'decimal.js';
import { flatten, map, values } from 'ramda';
import React, { memo, useCallback, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { getAbsenceStatistics, getWorkingHoursStatistics, TimeStatisticCell } from '../code/calculator';
import { dateFormatter } from '../code/formatters';
import { humanDifferenceFromHours } from '../code/humanDifference';
import { mapIndexed } from '../code/ramda.curried';
import { Themes } from '../code/variables';
import Spinner from '../components/Spinner';
import { i18n } from '../i18nLoader';
import { JobModel } from '../models/job.model';
import { Language } from '../models/language-model';
import { ProfileModel } from '../models/profile.model';
import { TimeAbsenceEntryListModel } from '../models/time-absence-entry-list.model';
import { TimeEntryListModel } from '../models/time-entry-list.model';
import { TimeHolidayEntryModel } from '../models/time-holiday-entry.model';
import { buildNavigatorRoute } from '../routes';


const useStyles = makeStyles(theme => ({
  root: {
    width: '100%',
  },
  heading: {
    fontSize: theme.typography.pxToRem(15),
    flexBasis: '50.00%',
    flexShrink: 0,
  },
  secondaryHeading: {
    fontSize: theme.typography.pxToRem(15),
    color: theme.palette.text.secondary,
  },
  panelsContainer: {
    width: '100%',
    display: 'grid',
  },
  link: {
    color: 'inherit',
    textDecoration: 'none',
  },
}));

export interface TimeStatisticsInputs {
  selectedYear: number;
  selectedLanguage: Language;
  profile: ProfileModel;
  timeEntries: TimeEntryListModel[];
  absences: TimeAbsenceEntryListModel[];
  holidays: TimeHolidayEntryModel[];
  isGetTimeEntriesBusy: boolean;
}

export interface TimeStatisticsDispatches {
  onUpdate: (item: TimeEntryListModel) => void;
}

type TimeStatisticsProps = TimeStatisticsInputs & TimeStatisticsDispatches;

export const TimeStatisticsComponent: React.FC<TimeStatisticsProps> = memo(
  props => {
    const classes = useStyles(props);

    const {
      isGetTimeEntriesBusy,
      selectedYear,
      selectedLanguage,
      profile,
      timeEntries,
      absences,
      holidays,
    } = props;

    const workingHourCells: TimeStatisticCell[] = useMemo(
      () =>
        flatten(
          values(
            getWorkingHoursStatistics(
              selectedYear,
              selectedLanguage,
              profile,
              timeEntries,
              absences,
              holidays,
            ),
          ),
        ),
      [
        selectedYear,
        selectedLanguage,
        profile,
        timeEntries,
        absences,
        holidays,
      ],
    );

    const absenceCells: TimeStatisticCell[] = useMemo(
      () =>
        flatten(
          values(
            getAbsenceStatistics(
              selectedYear,
              selectedLanguage,
              profile,
              absences,
              holidays,
            ),
          ),
        ),
      [selectedYear, selectedLanguage, profile, absences, holidays],
    );

    const generatePanels = useCallback(
      mapIndexed<TimeStatisticCell, JSX.Element>()((cell, index) => (
        <ExpansionPanel
          key={cell.title}
          style={{ ...Themes.getRelativeToIndex(index) }}
          disabled={cell.details.length === 0}
          TransitionProps={{ unmountOnExit: true }}
        >
          <ExpansionPanelSummary
            expandIcon={cell.details.length > 0 && <ExpandMoreIcon />}
          >
            <Typography className={classes.heading}>
              {i18n._(cell.title, cell.titleValues)} ({cell.subtitle})
            </Typography>
            <Typography className={classes.secondaryHeading}>
              {cell.text}
            </Typography>
          </ExpansionPanelSummary>
          <ExpansionPanelDetails>
            <Table>
              <TableBody>
                {map(
                  detail => (
                    <TableRow key={getUnixTime(detail.range.start)}>
                      <TableCell>
                        {`${dateFormatter(
                          detail.range.start,
                        )} - ${dateFormatter(detail.range.end)}`}
                      </TableCell>
                      <TableCell>
                        {humanDifferenceFromHours(
                          detail.hours,
                          {
                            roundToNearest15: false,
                          },
                          new Decimal(
                            JobModel.getAverageWorkingHours(cell.job),
                          ),
                        )}
                      </TableCell>
                      <TableCell>
                        <Link
                          className={classes.link}
                          to={buildNavigatorRoute(
                            selectedYear,
                            getMonth(detail.range.start) + 1,
                            getDate(detail.range.start),
                          )}
                        >
                          <SyncAltIcon />
                        </Link>
                      </TableCell>
                    </TableRow>
                  ),
                  cell.details,
                )}
              </TableBody>
            </Table>
          </ExpansionPanelDetails>
        </ExpansionPanel>
      )),
      [],
    );

    return (
      <Spinner show={isGetTimeEntriesBusy}>
        <div className={classes.root}>
          <ExpansionPanel TransitionProps={{ unmountOnExit: true }}>
            <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
              <Typography className={classes.heading}>
                <Trans>Working Hours</Trans>
              </Typography>
              <Typography className={classes.secondaryHeading}>
                <Trans>Summary of your working hours</Trans>
              </Typography>
            </ExpansionPanelSummary>
            <ExpansionPanelDetails className={classes.panelsContainer}>
              {generatePanels(workingHourCells)}
            </ExpansionPanelDetails>
          </ExpansionPanel>
          {!!absenceCells.length && (
            <ExpansionPanel TransitionProps={{ unmountOnExit: true }}>
              <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
                <Typography className={classes.heading}>
                  <Trans>Absences</Trans>
                </Typography>
                <Typography className={classes.secondaryHeading}>
                  <Trans>Summary of your absences</Trans>
                </Typography>
              </ExpansionPanelSummary>
              <ExpansionPanelDetails className={classes.panelsContainer}>
                {generatePanels(absenceCells)}
              </ExpansionPanelDetails>
            </ExpansionPanel>
          )}
        </div>
      </Spinner>
    );
  },
);
