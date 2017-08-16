import React, { Component } from 'react'
import RaisedButton from 'material-ui/RaisedButton'
import TextField from 'material-ui/TextField'
import { observable, computed, action, toJS } from 'mobx'
import { observer } from 'mobx-react'

import FleetStore from '../../datastores/fleet_store'
import NewFleetRowButton from './new_fleet_row_button'
import FleetTable from './fleet_table'
import SendFleet from '../send_fleet'

type State = {}
type Props = {}

@observer
export default class Main extends Component {
	constructor(props) {
		super(props)

		this.fleetStore = new FleetStore()
	}

	componentDidMount() {
		this.fleetStore.getFromStorage()

		chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
			// console.log('req:', request)

			if (request.type === 'refreshPopup') {
				this.fleetStore.getFromStorage()
			}
		})
	}

	createNewTableRow() {
		this.fleetStore.addRowAndIncrementId({
			url: '',
			time: '',
			id: toJS(this.fleetStore.uniqueId),
			timeStrat: 'from now',
			set: false,
			done: false
		})
	}

	setActiveTab() {
		chrome.tabs.query({ currentWindow: true, active: true }, (tabs) => {
			const activeTab = tabs[0]

			this.fleetStore.setActiveTabId(activeTab.id)
			.then(() => {
				chrome.runtime.sendMessage({ type: 'resetTimer' }, (response) => {
					console.log('response:', response)
				})

				return
			})
		})
	}

	clearTable() {
		chrome.storage.sync.clear(() => {
			if (chrome.lastError) {
				console.log(chrome.lastError)
			} else {
				console.log('cleared')

				this.fleetStore.getFromStorage()
			}
		})
	}

	render() {
		return (
			<div>
				<FleetTable fleetStore={ this.fleetStore } />
				<NewFleetRowButton fleetStore={ this.fleetStore } />
				<RaisedButton
					primary
					label={ `Set OGame Tab [Current: ${ this.fleetStore.activeTabId }]` }
					style={{ marginTop: '5px' }}
					onTouchTap={ this.setActiveTab.bind(this) }
					fullWidth
				/>
				<RaisedButton
					secondary
					label='Clear'
					style={{ marginTop: '5px' }}
					onTouchTap={ this.clearTable.bind(this) }
					fullWidth
				/>
			</div>
		)
	}
}
