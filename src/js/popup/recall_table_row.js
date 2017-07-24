import React, { Component } from 'react'
import RaisedButton from 'material-ui/RaisedButton'
import IconButton from 'material-ui/IconButton'
import Cancel from 'material-ui/svg-icons/navigation/cancel'
import TextField from 'material-ui/TextField'
import {
	Table,
	TableBody,
	TableHeader,
	TableHeaderColumn,
	TableRow,
	TableRowColumn,
} from 'material-ui/Table'

import { RecallTableStore } from './main'

type State = {
	url: string,
	time: string
}

type Props = {
	id: string,
	datastore: RecallTableStore
}

export default class RecallTableRow extends Component {
	state: State
	props: Props

	constructor(props: Props) {
		super(props)

		this.state = {
			url: '',
			time: ''
		}
	}

	onSubmit(event: Object) {
		event.preventDefault()

		chrome.tabs.query({ currentWindow: true, active: true }, (tabs) => {
			const activeTab = tabs[0]

			chrome.tabs.sendMessage(activeTab.id, {
				type: 'recallFleet',
				url: this.state.url
			}, (response) => {
				console.log(response)
			})
		})
	}

	onTextChange(field: string, event: Object, newValue: string) {
		this.setState({
			[field]: newValue
		}, () => {
			chrome.storage.sync.set({ [this.props.id]: newValue })
		})
	}

	render() {
		return (
			<TableRow>
				<TableRowColumn>
					<TextField
						hintText='URL'
						value={ this.state.url }
						onChange={ this.onTextChange.bind(this, 'url') }
					/>
				</TableRowColumn>
				<TableRowColumn>
					<TextField
						hintText='Time'
						value={ this.state.time }
						onChange={ this.onTextChange.bind(this, 'time') }
					/>
				</TableRowColumn>
				<TableRowColumn>
					<RaisedButton
						type='submit'
						label='Set Recall'
						primary
						onTouchTap={ this.onSubmit.bind(this) }
					/>
				</TableRowColumn>
				<TableRowColumn>
					<IconButton>
						<Cancel />
					</IconButton>
				</TableRowColumn>
			</TableRow>
		)
	}
}
