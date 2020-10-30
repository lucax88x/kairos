import { connect } from 'react-redux';
import { State } from '../state';
import { ChartComponent, ChartInputs } from './Chart';

const mapStateToProps = (state: State): ChartInputs => ({});

export const Chart = connect(mapStateToProps)(ChartComponent);
