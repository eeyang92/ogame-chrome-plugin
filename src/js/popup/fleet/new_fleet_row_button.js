import React, { Component } from 'react'
import RaisedButton from 'material-ui/RaisedButton'
import { observable, computed, action, toJS } from 'mobx'
import { observer } from 'mobx-react'

import FleetStore from '../../datastores/fleet_store'
import OptionsStore from '../../datastores/options_store'

type State = {}
type Props = {
	fleetStore: FleetStore,
	optionsStore: OptionsStore
}

@observer
export default class NewRowMenu extends Component {
	props: Props

	createAttackRow() {
		this.props.fleetStore.addRow({
			id: toJS(this.props.optionsStore.getUniqueIdAndIncrement()),
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
