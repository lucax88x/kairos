import { makeStyles, Typography } from '@material-ui/core';
import RefreshIcon from '@material-ui/icons/Refresh';
import React, { memo } from 'react';
import { ReactComponent as LogoIcon } from '../assets/images/logo.svg';
import { formatDate } from '../code/formatters';
import ButtonSpinner from '../components/ButtonSpinner';
import { Language } from '../models/language-model';
import { isEqual } from 'date-fns';

const useStyles = makeStyles(theme => ({
  container: {
    display: 'grid',
    gridAutoFlow: 'column',
    alignItems: 'center',
    justifyContent: 'end',
  },
  logoContainer: {
    display: 'grid',
    gridAutoFlow: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logo: {
    width: 100,
  },
}));

export interface DashboardHeaderInputs {
  isBusy: boolean;
  isOnline: boolean;
  refreshDate: Date;
  selectedLanguage: Language;
}

export interface DashboardHeaderDispatches {
  refresh: () => void;
}

type DashboardHeaderProps = DashboardHeaderInputs & DashboardHeaderDispatches;

export const DashboardHeaderComponent: React.FC<DashboardHeaderProps> = memo(
  props => {
    const classes = useStyles(props);

    const { isBusy, isOnline, refreshDate, selectedLanguage, refresh } = props;

    return (
      <div className={classes.container}>
        {/* <div className={classes.logoContainer}>
          <LogoIcon className={classes.logo} />
          <Typography component="h1" variant="h6" color="inherit">
            kairos
          </Typography>
        </div>
        <div> */}
          <ButtonSpinner disabled={!isOnline} onClick={refresh} isBusy={isBusy}>
            {!isEqual(new Date(0), refreshDate) &&
              formatDate(refreshDate, selectedLanguage)}
            <RefreshIcon></RefreshIcon>
          </ButtonSpinner>
        {/* </div> */}
      </div>
    );
  },
);
