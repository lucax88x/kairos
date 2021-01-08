import { Trans } from '@lingui/macro';
import { Typography } from '@material-ui/core';
import React from 'react';
import { Link } from 'react-router-dom';
import { RouteMatcher } from '../routes';

export const YouNeedAtLeastOneJob: React.FC = () => {
  return (
    <Typography color="inherit">
      <Trans id="You need at least one job, connect to <0>Profile</0>" components={[<Link to={RouteMatcher.Profile} key="profile"></Link>]} />
    </Typography>
  );
};
