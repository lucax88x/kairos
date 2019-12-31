import {
  createStyles,
  Theme,
  WithStyles,
  withStyles,
} from '@material-ui/core/styles';
import React from 'react';
import {
  AutoSizer,
  List,
  ListRowRenderer,
  ListRowProps,
  Index,
} from 'react-virtualized';

const styles = (theme: Theme) =>
  createStyles({
    flexContainer: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      boxSizing: 'border-box',
    },
    tableRow: {
      cursor: 'pointer',
    },
    tableRowHover: {
      '&:hover': {
        backgroundColor: theme.palette.grey[200],
      },
    },
    tableCell: {
      flex: 1,
    },
    noClick: {
      cursor: 'initial',
    },
  });

interface VirtualizedListProps<T> extends WithStyles<typeof styles> {
  rowCount: number;
  rowGetter: (index: Index) => T;
  noRowsRenderer: () => JSX.Element;

  height: number;
  rowHeight: number;
}

class VirtualizedListImpl<T> extends React.PureComponent<
  VirtualizedListProps<T>
> {
  _rowRenderer = (rowProps: ListRowProps) => {
    const { rowGetter } = this.props;

    const row = rowGetter(rowProps);
    console.log(row);

    return <div>todo</div>;
  };

  render() {
    // const { height, rowCount } = this.state;
    const { height, rowCount, rowHeight, noRowsRenderer } = this.props;

    return (
      <AutoSizer disableHeight>
        {({ width }) => (
          <List
            ref="List"
            height={height}
            overscanRowCount={10}
            noRowsRenderer={noRowsRenderer}
            rowCount={rowCount}
            rowHeight={rowHeight}
            rowRenderer={this._rowRenderer}
            width={width}
          />
        )}
      </AutoSizer>
    );
  }
}

export const VirtualizedList = withStyles(styles)(VirtualizedListImpl);
