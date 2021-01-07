import MenuItem, { MenuItemProps } from '@material-ui/core/MenuItem';
import Paper from '@material-ui/core/Paper';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import TextField, { TextFieldProps } from '@material-ui/core/TextField';
import Downshift from 'downshift';
import React from 'react';
import Spinner from './Spinner';

export type AutocompleteProps = TextFieldProps & {
  isBusy: boolean;
  data: AutocompleteSuggestion[];
  label: string;
  placeholder: string;
  onSelectSuggestion: (suggestion: AutocompleteSuggestion) => void;
};

export interface AutocompleteSuggestion {
  value: string;
  label: string;
}

type RenderInputProps = TextFieldProps & {
  classes: ReturnType<typeof useStyles>;
  ref?: React.Ref<HTMLDivElement>;
};

function renderInput(inputProps: RenderInputProps) {
  const { InputProps, classes, ref, ...other } = inputProps;

  return (
    <TextField
      InputProps={{
        inputRef: ref,
        classes: {
          root: classes.inputRoot,
          input: classes.inputInput,
        },
        ...InputProps,
      }}
      {...other}
    />
  );
}

interface RenderSuggestionProps {
  highlightedIndex: number | null;
  index: number;
  itemProps: MenuItemProps<'div', { button?: never }>;
  selectedItem: AutocompleteSuggestion;
  suggestion: AutocompleteSuggestion;
}

function renderSuggestion(suggestionProps: RenderSuggestionProps) {
  const { suggestion, index, itemProps, highlightedIndex, selectedItem } = suggestionProps;
  const isHighlighted = highlightedIndex === index;
  const isSelected = ((selectedItem && selectedItem.label) || '').indexOf(suggestion.label) > -1;

  return (
    <MenuItem
      {...itemProps}
      key={suggestion.label}
      selected={isHighlighted}
      component="div"
      style={{
        fontWeight: isSelected ? 500 : 400,
      }}
    >
      {suggestion.label}
    </MenuItem>
  );
}

function getSuggestions(
  suggestions: AutocompleteSuggestion[],
  value: string,
  { showEmpty = false } = {},
) {
  const inputValue = value.trim().toLowerCase();
  const inputLength = inputValue.length;
  let count = 0;

  return inputLength === 0 && !showEmpty
    ? []
    : suggestions.filter(suggestion => {
        const keep =
          count < 5 && suggestion.label.slice(0, inputLength).toLowerCase() === inputValue;

        if (keep) {
          count += 1;
        }

        return keep;
      });
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      flexGrow: 1,
    },
    container: {
      flexGrow: 1,
      position: 'relative',
    },
    paper: {
      position: 'absolute',
      zIndex: 1,
      marginTop: theme.spacing(1),
      left: 0,
      right: 0,
    },
    chip: {
      margin: theme.spacing(0.5, 0.25),
    },
    inputRoot: {
      flexWrap: 'wrap',
    },
    inputInput: {
      width: 'auto',
      flexGrow: 1,
    },
    divider: {
      height: theme.spacing(2),
    },
  }),
);

export const Autocomplete: React.FC<AutocompleteProps> = props => {
  const classes = useStyles(props);

  const { isBusy, data, placeholder, label, onSelectSuggestion } = props;

  return (
    <div className={classes.root}>
      <Spinner show={isBusy}>
        <Downshift
          onSelect={onSelectSuggestion}
          itemToString={(suggestion: AutocompleteSuggestion) =>
            !!suggestion ? suggestion.label : ''
          }
        >
          {({
            getInputProps,
            getItemProps,
            getLabelProps,
            getMenuProps,
            highlightedIndex,
            inputValue,
            isOpen,
            selectedItem,
          }) => {
            const { onBlur, onFocus, ...inputProps } = getInputProps({
              placeholder,
            });

            return (
              <div className={classes.container}>
                {renderInput({
                  fullWidth: true,
                  classes,
                  label,
                  // eslint-disable-next-line @typescript-eslint/no-explicit-any
                  InputLabelProps: getLabelProps({ shrink: true } as any),
                  InputProps: { onBlur, onFocus },
                  inputProps,
                })}
                <div {...getMenuProps()}>
                  {isOpen && (
                    <Paper className={classes.paper} square>
                      {getSuggestions(data, inputValue!).map((suggestion, index) =>
                        renderSuggestion({
                          suggestion,
                          index,
                          itemProps: getItemProps({ item: suggestion }),
                          highlightedIndex,
                          selectedItem,
                        }),
                      )}
                    </Paper>
                  )}
                </div>
              </div>
            );
          }}
        </Downshift>
      </Spinner>
    </div>
  );
};
