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
import ActionTableStore from '../datastores/action_store'
import AttackTableRow from './attack_table_row'

type State = {}
type Props = {
	actionStore: ActionTableStore
}

@observer
export default class ActionTable extends Component {
	props: Props

	renderRows() {
		const rows = []

		console.log('here:', this.props.actionStore.actions)

		if (this.props.actionStore.actions.length > 0) {
			// this.props.actionStore.rows.forEach((row, index) => {
			// 	rows.push(
			// 		<RecallTableRow
			// 			actionStore={ this.props.actionStore }
			// 			index={ index }
			// 			key={ row.id }
			// 		/>
			// 	)
			// })
			this.props.actionStore.actions.forEach((row, index) => {
				if (row.type === 'attack') {
					rows.push(
						<AttackTableRow
							actionStore={ this.props.actionStore }
							index={ index }
							key={ row.id }
						/>
					)
				}
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
						<TableHeaderColumn>URL</TableHeaderColumn>
						<TableHeaderColumn>Time (H:M:S) 24H</TableHeaderColumn>
						<TableHeaderColumn>Time Option</TableHeaderColumn>
						<TableHeaderColumn>Set</TableHeaderColumn>
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
