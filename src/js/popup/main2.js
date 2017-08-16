import React, { Component } from 'react'
import RaisedButton from 'material-ui/RaisedButton'
import TextField from 'material-ui/TextField'
import { Tabs, Tab } from 'material-ui/Tabs'
import { observable, computed, action, toJS } from 'mobx'
import { observer } from 'mobx-react'

import FleetTab from './fleet/fleet_tab'

type State = {}
type Props = {}

@observer
export default class Main extends Component {
	render() {
		return (
			<Tabs>
				<Tab label='Fleet'>
					<FleetTab />
				</Tab>
			</Tabs>
		)
	}
}
