import React, { Component } from 'react'
import RaisedButton from 'material-ui/RaisedButton'
import TextField from 'material-ui/TextField'
import { observable, computed, action, toJS } from 'mobx'
import { observer } from 'mobx-react'

import FleetStore from '../../datastores/fleet_store'
import OptionsStore from '../../datastores/options_store'
import NewFleetRowButton from './new_fleet_row_button'
import FleetTable from './fleet_table'

type State = {}
type Props = {
	fleetStore: FleetStore,
	optionsStore: OptionsStore
}

@observer
export default class FleetTab extends Component {
	props: Props

	render() {
		return (
			<div>
				<FleetTable
					fleetStore={ this.props.fleetStore }
					optionsStore={ this.props.optionsStore }
				/>
				<NewFleetRowButton
					fleetStore={ this.props.fleetStore }
					optionsStore={ this.props.optionsStore }
				/>
			</div>
		)
	}
}
