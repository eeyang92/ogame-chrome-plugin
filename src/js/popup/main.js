import React, { Component } from 'react'
import RaisedButton from 'material-ui/RaisedButton'
import TextField from 'material-ui/TextField'
import { observable, computed, action, toJS } from 'mobx'
import { observer } from 'mobx-react'

import RecallTableStore from '../datastores/recall_table_store'
import RecallTable from './recall_table'
import SendFleet from './send_fleet'

type State = {}
type Props = {}

@observer
export default class Main extends Component {
	constructor(props) {
		super(props)

		this.recallTableStore = new RecallTableStore()
	}

	componentDidMount() {
		this.recallTableStore.getFromStorage()

		chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
			// console.log('req:', request)

			if (request.type === 'refreshPopup') {
				this.recallTableStore.getFromStorage()
			}
		})
	}

	createNewTableRow() {
		this.recallTableStore.addRowAndIncrementId({
			url: '',
			time: '',
			id: toJS(this.recallTableStore.uniqueId),
			timeStrat: 'from now',
			set: false,
			done: false
		})
	}

	setActiveTab() {
		chrome.tabs.query({ currentWindow: true, active: true }, (tabs) => {
			const activeTab = tabs[0]

			this.recallTableStore.setActiveTabId(activeTab.id)
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

				this.recallTableStore.getFromStorage()
			}
		})
	}

	render() {
		return (
			<div>
				<RecallTable datastore={ this.recallTableStore } />
				<RaisedButton
					primary
					label='New'
					style={{ marginTop: '10px' }}
					onTouchTap={ this.createNewTableRow.bind(this) }
					fullWidth
				/>
				<RaisedButton
					primary
					label={ `Set OGame Tab [Current: ${ this.recallTableStore.activeTabId }]` }
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
				<SendFleet recallTableStore={ this.recallTableStore }/>
			</div>
		)
	}
}

// Transport
// holdingtime:1
// expeditiontime:1
// token:e494051edbaa65b6dbd282534782e70e
// galaxy:1
// system:85
// position:7
// type:1
// mission:3
// union2:0
// holdingOrExpTime:0
// speed:10
// acsValues:-
// prioMetal:1
// prioCrystal:2
// prioDeuterium:3
// am203:1
// metal:0
// crystal:0
// deuterium:0

// Attack
// holdingtime:1
// expeditiontime:1
// token:11e4cdc00e6ac5d371de61662e9f35c7
// galaxy:1
// system:92
// position:8
// type:1
// mission:1
// union2:0
// holdingOrExpTime:0
// speed:10
// acsValues:-
// prioMetal:1
// prioCrystal:2
// prioDeuterium:3
// am202:5
// metal:0
// crystal:0
// deuterium:0
