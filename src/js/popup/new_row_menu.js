import React, { Component } from 'react'
import RaisedButton from 'material-ui/RaisedButton'
import TextField from 'material-ui/TextField'
import Popover from 'material-ui/Popover'
import Menu from 'material-ui/Menu'
import MenuItem from 'material-ui/MenuItem'
import { observable, computed, action, toJS } from 'mobx'
import { observer } from 'mobx-react'

import ActionStore from '../datastores/action_store'
import SendFleet from './send_fleet'

type State = {}
type Props = {
	actionStore: ActionStore
}

export default class NewRowMenu extends Component {
	constructor(props: Props) {
		super(props)

		this.state = {
			open: false,
		}
	}

	handleTouchTap(event) {
		event.preventDefault()

		this.setState({
			open: true,
			anchorEl: event.currentTarget,
		})
	}

	handleRequestClose() {
		this.setState({
			open: false,
		})
	}

	createAttackRow() {
		this.props.actionStore.addRowAndIncrementId({
			type: 'attack',
			id: toJS(this.props.actionStore.uniqueId),
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
			<div>
				<RaisedButton
					onTouchTap={ this.handleTouchTap.bind(this) }
					label='New'
					fullWidth
					primary
				/>
				<Popover
					open={ this.state.open }
					anchorEl={ this.state.anchorEl }
					anchorOrigin={{ horizontal: 'left', vertical: 'bottom' }}
					targetOrigin={{ horizontal: 'left', vertical: 'top' }}
					onRequestClose={ this.handleRequestClose.bind(this) }
				>
				<Menu>
					<MenuItem primaryText='Attack' onTouchTap={ this.createAttackRow.bind(this) } />
				</Menu>
				</Popover>
			</div>
		)
	}
}
