import React, { Component } from 'react'
import RaisedButton from 'material-ui/RaisedButton'
import IconButton from 'material-ui/IconButton'
import Cancel from 'material-ui/svg-icons/navigation/cancel'
import TextField from 'material-ui/TextField'
import DropDownMenu from 'material-ui/DropDownMenu'
import MenuItem from 'material-ui/MenuItem'
import muiThemeable from 'material-ui/styles/muiThemeable'
import { green500 } from 'material-ui/styles/colors'
import { observer } from 'mobx-react'
import {
	Table,
	TableBody,
	TableHeader,
	TableHeaderColumn,
	TableRow,
	TableRowColumn,
} from 'material-ui/Table'

import ActionStore from '../datastores/action_store'

type State = {
	url: string,
	time: string
}

type Props = {
	id: string,
	actionStore: ActionStore,
	index: number
}

@observer
export default muiThemeable()(class AttackTableRow extends Component {
	state: State
	props: Props

	onSet(event: Object) {
		event.preventDefault()

		const currentRow = this.props.actionStore.rows[this.props.index]

		currentRow.set = !currentRow.set
		currentRow.done = false

		this.props.actionStore.setRow(currentRow, this.props.index)
		.then(() => {
			chrome.runtime.sendMessage({ type: 'resetTimer' }, (response) => {
				console.log('response:', response)
			})
		})
	}

	onTextChange(field: string, event: Object, newValue: string) {
		const currentRow = this.props.actionStore.rows[this.props.index]

		currentRow[field] = newValue

		this.props.actionStore.setRow(currentRow, this.props.index)
	}

	onRemoveRow(rowNumber, event) {
		event.preventDefault()

		this.props.actionStore.removeRow(rowNumber)
	}

	onMenuChange(event, index, value) {
		const currentRow = this.props.actionStore.rows[this.props.index]

		currentRow.timeStrat = value

		this.props.actionStore.setRow(currentRow, this.props.index)
	}

	render() {
		const action = this.props.actionStore.actions[this.props.index]
		console.log(action)

		return (
			<TableRow>
				<TableRowColumn>
					<TextField
						hintText='Label'
						value={ action.label }
						onChange={ this.onTextChange.bind(this, 'url') }
					/>
				</TableRowColumn>
				<TableRowColumn>
					{ `${ action.options.galaxy}:${ action.options.system}:${ action.options.position}` }
				</TableRowColumn>
				<TableRowColumn>
					<IconButton onTouchTap={ this.onRemoveRow.bind(this, this.props.index) }>
						<Cancel color={ this.props.muiTheme.palette.accent1Color }/>
					</IconButton>
				</TableRowColumn>
			</TableRow>
		)
	}
})
