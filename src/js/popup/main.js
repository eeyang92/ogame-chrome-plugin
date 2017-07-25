import React, { Component } from 'react'
import RaisedButton from 'material-ui/RaisedButton'
import TextField from 'material-ui/TextField'
import { observable, computed, action, toJS } from 'mobx'
import { observer } from 'mobx-react'

import RecallTableStore from '../datastores/recall_table_store'
import RecallTable from './recall_table'

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
			console.log('req:', request)

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
			<div style={{ height: '400px', width: '750px' }}>
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
					label={ `Set Active Tab [Current: ${ this.recallTableStore.activeTabId }]` }
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
