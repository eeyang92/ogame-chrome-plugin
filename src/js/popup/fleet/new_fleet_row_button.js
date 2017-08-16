import React, { Component } from 'react'
import RaisedButton from 'material-ui/RaisedButton'
import TextField from 'material-ui/TextField'
import Popover from 'material-ui/Popover'
import Menu from 'material-ui/Menu'
import MenuItem from 'material-ui/MenuItem'
import { observable, computed, action, toJS } from 'mobx'
import { observer } from 'mobx-react'

import FleetStore from '../../datastores/action_store'
// import SendFleet from './send_fleet'

type State = {}
type Props = {
	fleetStore: FleetStore
}

export default class NewRowMenu extends Component {
	props: Props

	createAttackRow() {
		this.props.fleetStore.addRowAndIncrementId({
			id: toJS(this.props.fleetStore.uniqueId),
			label: '',
			options: {
				smallCargo: '',
				largeCargo: '',
				lightFighter: '',
				heavyFighter: '',
				cruiser: '',
				battleship: '',
				colonyShip: '',
				recycler: '',
				espionageProbe: '',
				bomber: '',
				solarSatellite: '',
				destroyer: '',
				deathstar: '',
				battlecruiser: '',
				galaxy: '',
				system: '',
				position: '',
				speed: '10',
				type: '1',
				mission: 'attack',
				holdingtime: '0',
				expeditiontime: 1,
				metal: '',
				crystal: '',
				deuterium: '',
				destination: 'planet'
			}
		})
	}

	render() {
		return (
			<RaisedButton
				onTouchTap={ this.createAttackRow.bind(this) }
				label='New Fleet'
				fullWidth
				primary
			/>
		)
	}
}
