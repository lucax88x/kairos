import DateFnsUtils from '@date-io/date-fns';
import { t, Trans } from '@lingui/macro';
import {
  ExpansionPanel,
  ExpansionPanelDetails,
  ExpansionPanelSummary,
  IconButton,
  makeStyles,
  TextField,
  Typography,
} from '@material-ui/core';
import Slider from '@material-ui/core/Slider';
import DeleteIcon from '@material-ui/icons/Delete';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import { DatePicker, MaterialUiPickersDate, MuiPickersUtilsProvider } from '@material-ui/pickers';
import { endOfDay, format } from 'date-fns';
import React, { ChangeEvent, useCallback } from 'react';
import { formatAsDate } from '../code/constants';
import { getDatepickerLocale } from '../code/get-datepicker-locale';
import { isNumber } from '../code/is';
import { Themes } from '../code/variables';
import { i18n } from '../i18nLoader';
import { JobModel } from '../models/job.model';
import { Language } from '../models/language-model';
import { ProjectModel } from '../models/project.model';
import { UUID } from '../models/uuid.model';

const useStyles = makeStyles(theme => ({
  rows: {
    width: '100%',
    display: 'grid',
    gridGap: theme.spacing(1),
    alignItems: 'center',
  },
  columns: {
    width: '100%',
    display: 'grid',
    gridAutoFlow: 'column',
    gridGap: theme.spacing(1),
    alignItems: 'center',
  },
  between: {
    justifyContent: 'space-between',
  },
  selfCenter: {
    justifySelf: 'center',
  },
  noGap: {
    gridGap: 0,
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
  slider: {
    width: '100%',
  },
  secondaryPaper: {
    backgroundColor: Themes.Second.backgroundColor,
    color: Themes.Second.color,
  },
}));

export interface ProfileJobProjectFormInputs {
  selectedLanguage: Language;
  job: JobModel;
  project: ProjectModel;
}

export interface ProfileJobProjectFormDispatches {
  onDelete: (jobId: UUID, project: UUID) => void;
  onNameChange: (jobId: UUID, project: UUID, name: string) => void;
  onAllocationChange: (jobId: UUID, project: UUID, allocation: number) => void;
  onStartDateChange: (jobId: UUID, project: UUID, date: Date) => void;
  onEndDateChange: (jobId: UUID, project: UUID, date: Date) => void;
}

type ProfileJobProjectFormProps = ProfileJobProjectFormInputs & ProfileJobProjectFormDispatches;

export const ProfileJobProjectForm: React.FC<ProfileJobProjectFormProps> = props => {
  const classes = useStyles(props);

  const {
    selectedLanguage,
    job,
    project,
    onDelete,
    onNameChange,
    onAllocationChange,
    onStartDateChange,
    onEndDateChange,
  } = props;

  const handleDelete = useCallback(() => onDelete(job.id, project.id), [onDelete, job, project]);

  const handleNameChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>) =>
      onNameChange(job.id, project.id, event.currentTarget.value),
    [onNameChange, job, project],
  );

  const handleAllocationChange = useCallback(
    (_, val: number | number[]) => {
      if (isNumber(val)) {
        onAllocationChange(job.id, project.id, val);
      }
    },
    [onAllocationChange, job, project],
  );

  const handleStartDateChange = useCallback(
    (date: MaterialUiPickersDate) => {
      if (!!date) {
        onStartDateChange(job.id, project.id, date);
      }
    },
    [onStartDateChange, job, project],
  );

  const handleEndDateChange = useCallback(
    (date: MaterialUiPickersDate) => {
      if (!!date) {
        onEndDateChange(job.id, project.id, endOfDay(date));
      }
    },
    [onEndDateChange, job, project],
  );

  return (
    <ExpansionPanel className={classes.secondaryPaper}>
      <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
        <div className={classes.columns}>
          <Typography className={classes.heading}>
            {!!project.name ? project.name : i18n._(t`Profile.UnknownProject`)}
          </Typography>
          <Typography className={classes.secondaryHeading}>
            {`${format(project.start, formatAsDate)} - ${
              !!project.end
                ? format(project.end, formatAsDate)
                : i18n._(t`Profile.CurrentDateLabel`)
            } - ${project.allocation}%`}
          </Typography>
          <IconButton
            color="inherit"
            aria-label="Delete entry"
            onClick={handleDelete}
            disabled={job.projects.length === 1}
          >
            <DeleteIcon />
          </IconButton>
        </div>
      </ExpansionPanelSummary>
      <ExpansionPanelDetails>
        <div className={classes.rows}>
          <div className={classes.columns}>
            <TextField
              fullWidth
              margin="dense"
              label={<Trans>Labels.Name</Trans>}
              type="text"
              value={project.name}
              onChange={handleNameChange}
            />
            <div>
              <Typography gutterBottom>
                <Trans>Labels.Allocation</Trans>
              </Typography>
              <Slider
                className={classes.slider}
                defaultValue={100}
                valueLabelDisplay="auto"
                step={10}
                marks
                min={10}
                max={100}
                value={project.allocation}
                onChange={handleAllocationChange}
              />
            </div>
          </div>
          <div className={classes.columns}>
            <MuiPickersUtilsProvider
              utils={DateFnsUtils}
              locale={getDatepickerLocale(selectedLanguage)}
            >
              <DatePicker
                autoOk
                fullWidth
                value={project.start}
                // maxDate={end}
                onChange={handleStartDateChange}
                label={<Trans>Labels.Start</Trans>}
              />
              <DatePicker
                autoOk
                fullWidth
                value={project.end}
                // minDate={start}
                onChange={handleEndDateChange}
                label={<Trans>Labels.End</Trans>}
              />
            </MuiPickersUtilsProvider>
          </div>
        </div>
      </ExpansionPanelDetails>
    </ExpansionPanel>
  );
};
