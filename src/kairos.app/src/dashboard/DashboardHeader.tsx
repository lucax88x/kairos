import { makeStyles } from '@material-ui/core';
import RefreshIcon from '@material-ui/icons/Refresh';
import { isEqual } from 'date-fns';
import React, { memo } from 'react';
import { formatDate } from '../code/formatters';
import ButtonSpinner from '../components/ButtonSpinner';
import { Language } from '../models/language-model';

const useStyles = makeStyles(() => ({
  container: {
    display: 'grid',
    gridAutoFlow: 'column',
    alignItems: 'center',
    justifyContent: 'end',
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
        <ButtonSpinner disabled={!isOnline} onClick={refresh} isBusy={isBusy}>
          {!isEqual(new Date(0), refreshDate) &&
            formatDate(refreshDate, selectedLanguage)}
          <RefreshIcon></RefreshIcon>
        </ButtonSpinner>
      </div>
    );
  },
);
