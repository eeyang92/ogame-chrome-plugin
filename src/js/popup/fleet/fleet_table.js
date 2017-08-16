import React, { Component } from 'react'
import RaisedButton from 'material-ui/RaisedButton'
import TextField from 'material-ui/TextField'
import {
	Table,
	TableBody,
	TableHeader,
	TableHeaderColumn,
	TableRow,
	TableRowColumn,
} from 'material-ui/Table'
import { observable, computed, action, toJS } from 'mobx'
import { observer } from 'mobx-react'

// import RecallTableRow from './recall_table_row'
import FleetStore from '../../datastores/action_store'
import OptionsStore from '../../datastores/options_store'
import FleetTableRow from './fleet_table_row'

type State = {}
type Props = {
	fleetStore: FleetStore,
	optionsStore: OptionsStore
}

@observer
export default class FleetTable extends Component {
	props: Props

	renderRows() {
		const rows = []

		if (this.props.fleetStore.rows.length > 0) {
			this.props.fleetStore.rows.forEach((row, index) => {
				rows.push(
					<FleetTableRow
						fleetStore={ this.props.fleetStore }
						optionsStore={ this.props.optionsStore }
						index={ index }
						key={ row.id }
					/>
				)
			})
		}

		return rows
	}

	render() {
		return (
			<Table>
				<TableHeader
					adjustForCheckbox={ false }
					displaySelectAll={ false }
					style={{ cursor: 'default' }}
				>
					<TableRow>
						<TableHeaderColumn>Label</TableHeaderColumn>
						<TableHeaderColumn>Coordinates</TableHeaderColumn>
						<TableHeaderColumn>Type</TableHeaderColumn>
						<TableHeaderColumn>Edit</TableHeaderColumn>
						<TableHeaderColumn>Send</TableHeaderColumn>
						<TableHeaderColumn>Remove</TableHeaderColumn>
					</TableRow>
				</TableHeader>
				<TableBody>
					{ this.renderRows() }
				</TableBody>
			</Table>
		)
	}
}
