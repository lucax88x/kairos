import { Trans } from '@lingui/macro';
import {
  ExpansionPanel,
  ExpansionPanelDetails,
  ExpansionPanelSummary,
  GridList,
  GridListTile,
  GridListTileBar,
  makeStyles,
  Typography,
} from '@material-ui/core';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import { values } from 'ramda';
import React, { memo, useCallback, useMemo } from 'react';
import {
  getIllnessStatistics,
  getAbsenceStatistics,
  getWorkingHoursStatistics,
  TimeStatisticTile,
} from '../code/calculator';
import { mapIndexed } from '../code/ramda.curried';
import { Themes } from '../code/variables';
import Spinner from '../components/Spinner';
import { i18n } from '../i18nLoader';
import { Language } from '../models/language-model';
import { ProfileModel } from '../models/profile.model';
import { TimeAbsenceEntryModel } from '../models/time-absence-entry.model';
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
  gridList: {
    width: '100%',
    height: '100%',
  },
  gridTile: {
    width: '100%',
    height: '100%',
  },
  gridTileContent: {
    width: '100%',
    height: '100%',
    display: 'grid',
    paddingTop: '2em',
    justifyContent: 'center',
    fontSize: '1.5rem',
  },
}));

export interface TimeStatisticsInputs {
  selectedLanguage: Language;
  profile: ProfileModel;
  timeEntries: TimeEntryListModel[];
  absences: TimeAbsenceEntryModel[];
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
      selectedLanguage,
      profile,
      timeEntries,
      absences,
      holidays,
    } = props;

    const workingHourTiles: TimeStatisticTile[] = useMemo(
      () =>
        values(
          getWorkingHoursStatistics(
            selectedLanguage,
            profile,
            timeEntries,
            absences,
            holidays,
          ),
        ),
      [selectedLanguage, profile, timeEntries, absences, holidays],
    );

    const vacationTiles: TimeStatisticTile[] = useMemo(
      () => values(getAbsenceStatistics(selectedLanguage, profile, absences)),
      [selectedLanguage, profile, absences],
    );

    const illnessTiles: TimeStatisticTile[] = useMemo(
      () => values(getIllnessStatistics(selectedLanguage, absences)),
      [selectedLanguage, absences],
    );

    const generateTiles = useCallback(
      mapIndexed<TimeStatisticTile, JSX.Element>()((tile, index) => (
        <GridListTile
          key={tile.title}
          className={classes.gridTile}
          style={{ ...Themes.getRelativeToIndex(index) }}
        >
          <div className={classes.gridTileContent}>{tile.text}</div>
          <GridListTileBar
            title={i18n._(tile.title, tile.titleValues)}
            subtitle={tile.subtitle}
          />
        </GridListTile>
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
                <Trans>Working Hours</Trans>
              </Typography>
            </ExpansionPanelSummary>
            <ExpansionPanelDetails>
              <GridList cellHeight={180} className={classes.gridList}>
                {generateTiles(workingHourTiles)}
              </GridList>
            </ExpansionPanelDetails>
          </ExpansionPanel>
          {!!vacationTiles.length && (
            <ExpansionPanel>
              <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
                <Typography className={classes.heading}>
                  <Trans>Vacations</Trans>
                </Typography>
                <Typography className={classes.secondaryHeading}>
                  <Trans>Vacations</Trans>
                </Typography>
              </ExpansionPanelSummary>
              <ExpansionPanelDetails>
                <GridList cellHeight={180} className={classes.gridList}>
                  {generateTiles(vacationTiles)}
                </GridList>
              </ExpansionPanelDetails>
            </ExpansionPanel>
          )}
          {!!illnessTiles.length && (
            <ExpansionPanel>
              <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
                <Typography className={classes.heading}>
                  <Trans>Illness</Trans>
                </Typography>
                <Typography className={classes.secondaryHeading}>
                  <Trans>When you are sick</Trans>
                </Typography>
              </ExpansionPanelSummary>
              <ExpansionPanelDetails>
                <GridList cellHeight={180} className={classes.gridList}>
                  {generateTiles(illnessTiles)}
                </GridList>
              </ExpansionPanelDetails>
            </ExpansionPanel>
          )}
        </div>
      </Spinner>
    );
  },
);
