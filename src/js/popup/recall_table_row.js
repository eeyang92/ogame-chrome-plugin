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

import RecallTableStore from '../datastores/recall_table_store'

type State = {
	url: string,
	time: string
}

type Props = {
	id: string,
	datastore: RecallTableStore,
	index: number
}

// function zeroToMax(max) {
// 	const list = []

// 	for (let i = 0; i < max; i++) {
// 		list.push(
// 			<MenuItem key={ i } value={ i } primaryText={ `${ i }` } />
// 		)
// 	}

// 	return list
// }

@observer
export default muiThemeable()(class RecallTableRow extends Component {
	state: State
	props: Props

	// onSubmit(event: Object) {
	// 	event.preventDefault()

	// 	chrome.tabs.query({ currentWindow: true, active: true }, (tabs) => {
	// 		const activeTab = tabs[0]

	// 		chrome.tabs.sendMessage(activeTab.id, {
	// 			type: 'recallFleet',
	// 			url: this.state.url
	// 		}, (response) => {
	// 			console.log(response)
	// 		})
	// 	})
	// }

	onSet(event: Object) {
		event.preventDefault()

		const currentRow = this.props.datastore.rows[this.props.index]

		currentRow.set = !currentRow.set
		currentRow.done = false

		console.log(currentRow.set)

		this.props.datastore.setRow(currentRow, this.props.index)
		.then(() => {
			chrome.runtime.sendMessage({ type: 'resetTimer' }, (response) => {
				console.log('response:', response)
			})
		})
	}

	onTextChange(field: string, event: Object, newValue: string) {
		const currentRow = this.props.datastore.rows[this.props.index]

		currentRow[field] = newValue

		this.props.datastore.setRow(currentRow, this.props.index)
	}

	onRemoveRow(rowNumber, event) {
		event.preventDefault()

		this.props.datastore.removeRow(rowNumber)
	}

	onMenuChange(event, index, value) {
		const currentRow = this.props.datastore.rows[this.props.index]

		currentRow.timeStrat = value

		this.props.datastore.setRow(currentRow, this.props.index)
	}

	render() {
		const set = this.props.datastore.rows[this.props.index].set
		const done = this.props.datastore.rows[this.props.index].done

		let setStyle = {}

		if (done) {
			setStyle = {
				buttonStyle: {
					backgroundColor: green500
				},
				labelColor: 'white'
			}
		}

		return (
			<TableRow>
				<TableRowColumn>
					<TextField
						hintText='URL'
						value={ this.props.datastore.rows[this.props.index].url }
						onChange={ this.onTextChange.bind(this, 'url') }
						disabled={ set }
					/>
				</TableRowColumn>
				<TableRowColumn>
					<TextField
						hintText='6, 6:04, 6:04:30'
						value={ this.props.datastore.rows[this.props.index].time }
						onChange={ this.onTextChange.bind(this, 'time') }
						disabled={ set }
					/>
				</TableRowColumn>
				<TableRowColumn>
					<DropDownMenu
						value={ this.props.datastore.rows[this.props.index].timeStrat }
						onChange={ this.onMenuChange.bind(this) }
						maxHeight={ 300 }
						labelStyle={{ paddingLeft: '0px' }}
						underlineStyle={{ margin: 0, right: '32px' }}
						disabled={ set }
					>
						<MenuItem value={ 'from now' } primaryText='from now' />
						<MenuItem value={ 'at time' } primaryText='at time' />
					</DropDownMenu>
				</TableRowColumn>
				<TableRowColumn>
					<RaisedButton
						primary={ !set }
						secondary={ set }
						label={ (!set) ? 'Set' : 'Unset' }
						onTouchTap={ this.onSet.bind(this) }
						{ ...setStyle }
					/>
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
