import { Trans } from '@lingui/macro';
import {
  ExpansionPanel,
  ExpansionPanelDetails,
  ExpansionPanelSummary,
  makeStyles,
  Typography,
} from '@material-ui/core';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import { map } from 'ramda';
import React from 'react';
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

const useStyles = makeStyles(theme => ({
  root: {
    display: 'grid',
    gridGap: theme.spacing(1),
  },
  paper: {
    padding: theme.spacing(2),
    display: 'grid',
    overflow: 'auto',
    gridAutoFlow: 'row',
  },
  full: {
    width: '100%',
    height: '100%',
  },
}));

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface ChartInputs {}

export const ChartComponent: React.FC<ChartInputs> = props => {
  const classes = useStyles(props);
  const data = [
    {
      name: 'Page A',
      uv: 4000,
      pv: 2400,
    },
    {
      name: 'Page B',
      uv: 3000,
      pv: 1398,
    },
    {
      name: 'Page C',
      uv: 2000,
      pv: 9800,
    },
    {
      name: 'Page D',
      uv: 2780,
      pv: 3908,
    },
    {
      name: 'Page E',
      uv: 1890,
      pv: 4800,
    },
    {
      name: 'Page F',
      uv: 2390,
      pv: 3800,
    },
    {
      name: 'Page G',
      uv: 3490,
      pv: 4300,
    },
  ];

  const pairs = [
    {
      title: <Trans>Average working hours by day</Trans>,
      component: (
        <ResponsiveContainer width="100%" height={400}>
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="pv" fill="#8884d8" />
            <Bar dataKey="uv" fill="#82ca9d" />
          </BarChart>
        </ResponsiveContainer>
      ),
    },
    {
      title: <Trans>Average overtime hours by day</Trans>,
      component: <p>todo</p>,
    },
    {
      title: <Trans>Average illness hours by month</Trans>,
      component: <p>todo</p>,
    },
    {
      title: <Trans>Average vacation hours by month</Trans>,
      component: <p>todo</p>,
    },
    {
      title: <Trans>Average compensation hours by month</Trans>,
      component: <p>todo</p>,
    },
    {
      title: <Trans>Average permit hours by month</Trans>,
      component: <p>todo</p>,
    },
  ];

  return (
    <div className={classes.root}>
      {map(
        ({ title, component }) => (
          <ExpansionPanel TransitionProps={{ unmountOnExit: true }}>
            <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
              <Typography>{title}</Typography>
            </ExpansionPanelSummary>
            <ExpansionPanelDetails>{component}</ExpansionPanelDetails>
          </ExpansionPanel>
        ),
        pairs,
      )}
    </div>
  );
};
