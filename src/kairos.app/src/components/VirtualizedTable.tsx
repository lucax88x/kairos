import { Checkbox } from '@material-ui/core';
import { createStyles, Theme, WithStyles, withStyles } from '@material-ui/core/styles';
import TableCell from '@material-ui/core/TableCell';
import clsx from 'clsx';
import { contains, without } from 'ramda';
import React, { ChangeEvent } from 'react';
import {
  AutoSizer,
  Column,
  Table,
  TableCellRenderer,
  TableHeaderProps,
  TableHeaderRenderer,
} from 'react-virtualized';
import { TableToolbar } from './TableToolbar';

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

interface ColumnData {
  label: string;
  width: number;
  flexGrow?: number;
  dataKey: string;
  formatter?: FormatterFunction;
  cellRenderer?: CellRendererFunction;
  numeric?: boolean;
}

interface Row {
  index: number;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type CellRendererFunction = (row: any) => JSX.Element;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type FormatterFunction = (data: any) => string;

interface MuiVirtualizedTableProps<T> extends WithStyles<typeof styles> {
  title: string;
  height?: string;
  columns: ColumnData[];
  headerHeight?: number;
  onRowClick?: () => void;
  rowCount: number;
  rowIds: string[];
  rowGetter: (row: Row) => T;
  noRowsRenderer: () => JSX.Element;
  rowHeight?: number;
  onSelect?: (selecteIds: string[]) => void;
  onCreate?: () => void;
  onDelete?: (selecteIds: string[]) => void;
}

interface MuiVirtualizedTableState {
  selectedIds: string[];
}

class MuiVirtualizedTable<T> extends React.PureComponent<
  MuiVirtualizedTableProps<T>,
  MuiVirtualizedTableState
  > {
  constructor(props: MuiVirtualizedTableProps<T>) {
    super(props);
    this.state = { selectedIds: [] };
  }
  static defaultProps = {
    headerHeight: 48,
    rowHeight: 48,
  };

  static getDerivedStateFromProps(
    props: { rowIds: string[] },
    state: MuiVirtualizedTableState,
  ): MuiVirtualizedTableState | null {
    const { rowIds } = props;

    if (rowIds.length === 0 && !!state.selectedIds.length) {
      return { selectedIds: [] };
    }
    return null;
  }

  getRowClassName = ({ index }: Row) => {
    const { classes, onRowClick } = this.props;

    return clsx(classes.tableRow, classes.flexContainer, {
      [classes.tableRowHover]: index !== -1 && onRowClick != null,
    });
  };

  handleSelectAll = () => {
    let selectedIds: string[] = [];
    if (this.state.selectedIds.length !== this.props.rowIds.length) {
      selectedIds = this.props.rowIds;
    }
    this.setState({ selectedIds });

    if (!!this.props.onSelect) {
      this.props.onSelect(selectedIds);
    }
  };

  handleSelectedRow = (event: ChangeEvent<HTMLInputElement>) => {
    const id = event.target.value;
    let selectedIds = this.state.selectedIds;
    if (contains(id, selectedIds)) {
      selectedIds = without([id], selectedIds);
    } else {
      selectedIds = [...selectedIds, event.target.value];
    }
    this.setState({ selectedIds });

    if (!!this.props.onSelect) {
      this.props.onSelect(selectedIds);
    }
  };

  cellRenderer = (
    cellRenderer?: CellRendererFunction,
    formatter?: FormatterFunction,
  ): TableCellRenderer => ({ cellData, rowData, columnIndex }) => {
    const { columns, classes, rowHeight, onRowClick } = this.props;

    const formattedData = !!formatter ? formatter(cellData) : cellData;
    const result = !!cellRenderer ? cellRenderer(rowData) : formattedData;

    return (
      <TableCell
        component="div"
        className={clsx(classes.tableCell, classes.flexContainer, {
          [classes.noClick]: onRowClick == null,
        })}
        variant="body"
        style={{ height: rowHeight }}
        align={
          (columnIndex != null && columns[columnIndex] && columns[columnIndex].numeric) || false
            ? 'right'
            : 'left'
        }
      >
        {result}
      </TableCell>
    );
  };

  selectCellRenderer: TableCellRenderer = ({ rowData, columnIndex }) => {
    const { columns, classes, rowHeight, onRowClick } = this.props;
    const { selectedIds } = this.state;

    return (
      <TableCell
        component="div"
        className={clsx(classes.tableCell, classes.flexContainer, {
          [classes.noClick]: onRowClick == null,
        })}
        variant="body"
        style={{ height: rowHeight }}
        align={
          (columnIndex != null && columns[columnIndex] && columns[columnIndex].numeric) || false
            ? 'right'
            : 'left'
        }
      >
        <Checkbox
          checked={contains(rowData.id.toString(), selectedIds)}
          onChange={this.handleSelectedRow}
          value={rowData.id}
        />
      </TableCell>
    );
  };

  headerRenderer = ({ label, columnIndex }: TableHeaderProps & { columnIndex: number }) => {
    const { headerHeight, columns, classes } = this.props;

    return (
      <TableCell
        component="div"
        className={clsx(classes.tableCell, classes.flexContainer, classes.noClick)}
        variant="head"
        style={{ height: headerHeight }}
        align={columns[columnIndex].numeric || false ? 'right' : 'left'}
      >
        <span>{label}</span>
      </TableCell>
    );
  };

  selectHeaderRenderer: TableHeaderRenderer = () => {
    const { headerHeight, classes, rowCount } = this.props;
    const { selectedIds } = this.state;

    return (
      <TableCell
        component="div"
        className={clsx(classes.tableCell, classes.flexContainer, classes.noClick)}
        variant="head"
        style={{ height: headerHeight }}
      >
        <Checkbox
          indeterminate={
            rowCount > 0 && selectedIds.length !== 0 && selectedIds.length !== rowCount
          }
          checked={rowCount > 0 && selectedIds.length === rowCount}
          onChange={this.handleSelectAll}
        />
      </TableCell>
    );
  };

  handleCreate = () => {
    const { onCreate } = this.props;

    if (!!onCreate) {
      onCreate();
    }
  };

  handleDelete = () => {
    const { onDelete } = this.props;

    if (!!onDelete) {
      onDelete(this.state.selectedIds);
    }
  };

  render() {
    const {
      classes,
      title,
      height,
      columns,
      rowHeight,
      headerHeight,
      onCreate,
      onDelete,
      ...tableProps
    } = this.props;
    return (
      <>
        <TableToolbar
          title={title}
          numSelected={this.state.selectedIds.length}
          hasCreate={!!onCreate}
          hasDelete={!!onDelete}
          onCreate={this.handleCreate}
          onDelete={this.handleDelete}
        />
        <div style={{ height: !!height ? height : '70vh' }}>
          <AutoSizer>
            {({ height, width }) => (
              <Table
                height={height}
                width={width}
                rowHeight={!!rowHeight ? rowHeight : 0}
                headerHeight={!!headerHeight ? headerHeight : 0}
                {...tableProps}
                rowClassName={this.getRowClassName}
              >
                {!!onDelete && (
                  <Column
                    key="all"
                    dataKey="all"
                    width={100}
                    className={classes.flexContainer}
                    headerRenderer={this.selectHeaderRenderer}
                    cellRenderer={this.selectCellRenderer}
                  />
                )}
                {columns.map(({ dataKey, formatter, cellRenderer, ...other }, index) => {
                  return (
                    <Column
                      key={dataKey}
                      headerRenderer={headerProps =>
                        this.headerRenderer({
                          ...headerProps,
                          columnIndex: index,
                        })
                      }
                      className={classes.flexContainer}
                      cellRenderer={this.cellRenderer(cellRenderer, formatter)}
                      dataKey={dataKey}
                      {...other}
                    />
                  );
                })}
              </Table>
            )}
          </AutoSizer>
        </div>
      </>
    );
  }
}

export const VirtualizedTable = withStyles(styles)(MuiVirtualizedTable);
