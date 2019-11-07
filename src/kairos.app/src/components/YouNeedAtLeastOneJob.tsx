import { Trans } from '@lingui/macro';
import { Typography } from '@material-ui/core';
import React from 'react';
import { Link } from 'react-router-dom';
import { Routes } from '../routes';

export const YouNeedAtLeastOneJob: React.FC = () => {
  return (
    <Typography color="inherit">
      <Trans id="YouNeedAtLeastOneJob.Message" components={[<Link to={Routes.Profile}></Link>]} />
    </Typography>
  );
};
