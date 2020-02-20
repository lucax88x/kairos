import { Trans } from '@lingui/macro';
import {
  ExpansionPanel,
  ExpansionPanelDetails,
  ExpansionPanelSummary,
  makeStyles,
  Table,
  TableBody,
  TableCell,
  TableRow,
  Typography,
} from '@material-ui/core';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import { flatten, values } from 'ramda';
import React, { memo, useCallback, useMemo } from 'react';
import {
  getAbsenceStatistics,
  getWorkingHoursStatistics,
  TimeStatisticCell,
} from '../code/calculator';
import { mapIndexed } from '../code/ramda.curried';
import { Themes } from '../code/variables';
import Spinner from '../components/Spinner';
import { i18n } from '../i18nLoader';
import { Language } from '../models/language-model';
import { ProfileModel } from '../models/profile.model';
import { TimeAbsenceEntryListModel } from '../models/time-absence-entry-list.model';
import { TimeEntryListModel } from '../models/time-entry-list.model';
import { TimeHolidayEntryModel } from '../models/time-holiday-entry.model';

const useStyles = makeStyles(theme => ({
  root: {
    width: '100%',
  },
  heading: {
    fontSize: theme.typography.pxToRem(15),
    flexBasis: '33.33%',
    flexShrink: 0,
  },
  secondaryHeading: {
    fontSize: theme.typography.pxToRem(15),
    color: theme.palette.text.secondary,
  },
  table: {
    width: '100%',
    height: '100%',
  },
  row: {
    width: '100%',
    height: '100%',
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

    const generateCells = useCallback(
      mapIndexed<TimeStatisticCell, JSX.Element>()((cell, index) => (
        <TableRow
          key={cell.title}
          className={classes.row}
          style={{ ...Themes.getRelativeToIndex(index) }}
        >
          <TableCell>{i18n._(cell.title, cell.titleValues)}</TableCell>
          <TableCell>{cell.text}</TableCell>
          <TableCell>{cell.subtitle}</TableCell>
        </TableRow>
      )),
      [],
    );

    return (
      <Spinner show={isGetTimeEntriesBusy}>
        <div className={classes.root}>
          <ExpansionPanel>
            <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
              <Typography className={classes.heading}>
                <Trans>Working Hours</Trans>
              </Typography>
              <Typography className={classes.secondaryHeading}>
                <Trans>Summary of your working hours</Trans>
              </Typography>
            </ExpansionPanelSummary>
            <ExpansionPanelDetails>
              <Table className={classes.table}>
                <TableBody>{generateCells(workingHourCells)}</TableBody>
              </Table>
            </ExpansionPanelDetails>
          </ExpansionPanel>
          {!!absenceCells.length && (
            <ExpansionPanel>
              <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
                <Typography className={classes.heading}>
                  <Trans>Absences</Trans>
                </Typography>
                <Typography className={classes.secondaryHeading}>
                  <Trans>Summary of your absences</Trans>
                </Typography>
              </ExpansionPanelSummary>
              <ExpansionPanelDetails>
                <Table className={classes.table}>
                  <TableBody>{generateCells(absenceCells)}</TableBody>
                </Table>
              </ExpansionPanelDetails>
            </ExpansionPanel>
          )}
        </div>
      </Spinner>
    );
  },
);
