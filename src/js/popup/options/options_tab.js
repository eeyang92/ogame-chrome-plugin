import React, { Component } from 'react'
import RaisedButton from 'material-ui/RaisedButton'
import TextField from 'material-ui/TextField'
import { observable, computed, action, toJS } from 'mobx'
import { observer } from 'mobx-react'

import OptionsStore from '../../datastores/options_store'

type State = {}
type Props = {
	optionsStore: OptionsStore
}

@observer
export default class OptionsTab extends Component {
	props: Props

	setActiveTab() {
		chrome.tabs.query({ currentWindow: true, active: true }, (tabs) => {
			const activeTab = tabs[0]

			this.props.optionsStore.setActiveTabId(activeTab.id)
		})
	}

	clearTable() {
		chrome.storage.sync.clear(() => {
			if (chrome.lastError) {
				console.log(chrome.lastError)
			} else {
				console.log('cleared')

				chrome.runtime.sendMessage({ type: 'refreshPopup' })
			}
		})
	}

	render() {
		return (
			<div>
				<RaisedButton
					primary
					label={ `Set OGame Tab [Current: ${ this.props.optionsStore.activeTabId }]` }
					style={{ marginTop: '5px' }}
					onTouchTap={ this.setActiveTab.bind(this) }
					fullWidth
				/>
				<RaisedButton
					secondary
					label='Clear All Data'
					style={{ marginTop: '5px' }}
					onTouchTap={ this.clearTable.bind(this) }
					fullWidth
				/>
			</div>
		)
	}
}
