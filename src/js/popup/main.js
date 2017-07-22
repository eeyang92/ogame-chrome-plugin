// @flow
import React, { Component } from 'react'
import RaisedButton from 'material-ui/RaisedButton'
import TextField from 'material-ui/TextField'

type State = {
	url: string
}

type Props = {}

export default class Main extends Component {
	state: State
	props: Props

	constructor(props: Props) {
		super(props)

		this.state = {
			url: ''
		}
	}

	onSubmit(event: Object) {
		event.preventDefault()

		// chrome.runtime.sendMessage({
		// 	type: 'recallFleet',
		// 	url: this.state.url
		// }, (response) => {
		// 	console.log(response)
		// })

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
		})
	}

	render() {
		return (
			<div style={{ height: '500px', width: '500px' }}>
				<form onSubmit={ this.onSubmit.bind(this) }>
					<TextField
						hintText='URL'
						value={ this.state.url }
						onChange={ this.onTextChange.bind(this, 'url') }
					/>
					<RaisedButton
						type='submit'
						label='Set Recall'
						primary
					/>
				</form>
			</div>
		)
	}
}
