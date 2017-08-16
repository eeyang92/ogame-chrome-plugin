import React, { Component } from 'react'
import RaisedButton from 'material-ui/RaisedButton'
import TextField from 'material-ui/TextField'
import { Tabs, Tab } from 'material-ui/Tabs'
import { observable, computed, action, toJS } from 'mobx'
import { observer } from 'mobx-react'

import FleetTab from './fleet/fleet_tab'
import OptionsTab from './options/options_tab'

import FleetStore from '../datastores/fleet_store'
import OptionsStore from '../datastores/options_store'

type State = {}
type Props = {}

@observer
export default class Main extends Component {
	constructor(props) {
		super(props)

		this.optionsStore = new OptionsStore()
		this.fleetStore = new FleetStore()

		this.fleetStore.getFromStorage()
		this.optionsStore.getFromStorage()

		chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
			console.log(request)

			if (request.type === 'refreshPopup') {
				this.optionsStore.getFromStorage()
				this.fleetStore.getFromStorage()
			}

			return true
		})
	}

	render() {
		return (
			<Tabs>
				<Tab label='Fleet'>
					<FleetTab
						optionsStore={ this.optionsStore }
						fleetStore={ this.fleetStore }
					/>
				</Tab>
				<Tab label='Options'>
					<OptionsTab optionsStore={ this.optionsStore } />
				</Tab>
			</Tabs>
		)
	}
}
