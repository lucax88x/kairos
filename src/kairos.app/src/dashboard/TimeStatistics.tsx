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
import React, { memo, useCallback, useMemo } from 'react';
import { mapIndexed } from '../code/ramda.curried';
import { Themes } from '../code/variables';
import Spinner from '../components/Spinner';
import { TimeEntryListModel } from '../models/time-entry-list.model';

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
    display: 'flex',
    paddingTop: '2em',
    justifyContent: 'center',
    fontSize: '1.5rem',
  },
}));

export interface TimeStatisticsInputs {
  timeEntries: TimeEntryListModel[];
  isGetTimeEntriesBusy: boolean;
}

export interface TimeStatisticsDispatches {
  onUpdate: (item: TimeEntryListModel) => void;
}

type TimeStatisticsProps = TimeStatisticsInputs & TimeStatisticsDispatches;

interface TimeStatisticTile {
  title: string;
  subtitle?: string;
  text: string;
}

export const TimeStatisticsComponent: React.FC<TimeStatisticsProps> = memo(props => {
  const classes = useStyles(props);

  const { isGetTimeEntriesBusy } = props;

  const workingHourTiles: TimeStatisticTile[] = useMemo(
    () => [
      { title: 'remaining today', subtitle: 'Monday, 16', text: '8h' },
      { title: 'remaining this week', subtitle: '12 -> 19', text: '30' },
      { title: 'remaining this month', subtitle: 'August', text: '30' },
      { title: 'done this month', subtitle: 'August', text: '50' },
      { title: 'done previous month', subtitle: 'July', text: '30' },
      { title: 'done all previous months', text: '30' },
      { title: 'done this year', subtitle: '2019', text: '250' },
      { title: 'done previous year', subtitle: '2018', text: '30' },
      { title: 'done all previous years', text: '30' },
    ],
    [],
  );

  const vacationTiles: TimeStatisticTile[] = useMemo(
    () => [
      { title: 'remaining this year', subtitle: '2019', text: '0' },
      { title: 'done this year', subtitle: '2019', text: '30' },
      { title: 'remaining previous years', text: '30' },
    ],
    [],
  );

  const illnessTiles: TimeStatisticTile[] = useMemo(
    () => [{ title: 'done this year', subtitle: '2019', text: '5d' }],
    [],
  );

  const generateTiles = useCallback(
    mapIndexed<TimeStatisticTile, JSX.Element>()((tile, index) => (
      <GridListTile
        key={tile.title}
        className={classes.gridTile}
        style={{ ...Themes.getRelativeToIndex(index) }}
      >
        <div className={classes.gridTileContent}>{tile.text}</div>
        <GridListTileBar title={tile.title} subtitle={tile.subtitle} />
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
              <Trans>TimeStatistics.WorkingHours.Title</Trans>
            </Typography>
            <Typography className={classes.secondaryHeading}>
              <Trans>TimeStatistics.WorkingHours.SecondaryTitle</Trans>
            </Typography>
          </ExpansionPanelSummary>
          <ExpansionPanelDetails>
            <GridList cellHeight={180} className={classes.gridList}>
              {generateTiles(workingHourTiles)}
            </GridList>
          </ExpansionPanelDetails>
        </ExpansionPanel>
        <ExpansionPanel>
          <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
            <Typography className={classes.heading}>
              <Trans>TimeStatistics.Vacations.Title</Trans>
            </Typography>
            <Typography className={classes.secondaryHeading}>
              <Trans>TimeStatistics.Vacations.SubTitle</Trans>
            </Typography>
          </ExpansionPanelSummary>
          <ExpansionPanelDetails>
            <GridList cellHeight={180} className={classes.gridList}>
              {generateTiles(vacationTiles)}
            </GridList>
          </ExpansionPanelDetails>
        </ExpansionPanel>
        <ExpansionPanel>
          <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
            <Typography className={classes.heading}>
              <Trans>TimeStatistics.Illness.Title</Trans>
            </Typography>
            <Typography className={classes.secondaryHeading}>
              <Trans>TimeStatistics.Illness.SubTitle</Trans>
            </Typography>
          </ExpansionPanelSummary>
          <ExpansionPanelDetails>
            <GridList cellHeight={180} className={classes.gridList}>
              {generateTiles(illnessTiles)}
            </GridList>
          </ExpansionPanelDetails>
        </ExpansionPanel>
      </div>
    </Spinner>
  );
});
