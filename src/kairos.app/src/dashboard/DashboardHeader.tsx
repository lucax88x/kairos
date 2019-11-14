import { Button, makeStyles, Typography } from '@material-ui/core';
import RefreshIcon from '@material-ui/icons/Refresh';
import React, { memo } from 'react';
import { ReactComponent as LogoIcon } from '../assets/images/logo.svg';
import { formatDate } from '../code/formatters';
import { Language } from '../models/language-model';

const useStyles = makeStyles(theme => ({
  container: {
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

    const { isOnline, refreshDate, selectedLanguage, refresh } = props;

    return (
      <div className={classes.container}>
        <div>
          <LogoIcon className={classes.logo} />
          <Typography component="h1" variant="h6" color="inherit">
            kairos
          </Typography>
        </div>
        <div>
          <Button disabled={!isOnline} onClick={refresh}>
            <RefreshIcon></RefreshIcon>
          </Button>
          <span>
            Last refreshed: {formatDate(refreshDate, selectedLanguage)}
          </span>
        </div>
      </div>
    );
  },
);
