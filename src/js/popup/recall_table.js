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

import RecallTableRow from './recall_table_row'
import { RecallTableStore } from './main'

type State = {}
type Props = {
	datastore: RecallTableStore
}

@observer
export default class RecallTable extends Component {
	props: Props

	renderRows() {
		const rows = []

		if (this.props.datastore.rows.length > 0) {
			this.props.datastore.rows.forEach((row, index) => {
				rows.push(
					<RecallTableRow
						datastore={ this.props.datastore }
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
						<TableHeaderColumn>URL</TableHeaderColumn>
						<TableHeaderColumn>Time (H:M:S)</TableHeaderColumn>
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
