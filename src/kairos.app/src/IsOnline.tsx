import SignalWifi4BarIcon from '@material-ui/icons/SignalWifi4Bar';
import SignalWifiOff from '@material-ui/icons/SignalWifiOff';
import React from 'react';
import { colors } from '@material-ui/core';

export interface IsOnlineInputs {
  isOnline: boolean;
}

type IsOnlineProps = IsOnlineInputs;

export const IsOnlineComponent: React.FC<IsOnlineProps> = props => {
  const { isOnline } = props;

  return isOnline ? (
    <SignalWifi4BarIcon htmlColor={colors.green[400]} />
  ) : (
    <SignalWifiOff htmlColor={colors.red[400]} />
  );
};
