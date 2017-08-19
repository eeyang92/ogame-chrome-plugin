import React, { Component } from 'react'
import RaisedButton from 'material-ui/RaisedButton'
import IconButton from 'material-ui/IconButton'
import Cancel from 'material-ui/svg-icons/navigation/cancel'
import TextField from 'material-ui/TextField'
import Dialog from 'material-ui/Dialog'
import muiThemeable from 'material-ui/styles/muiThemeable'
import { green500 } from 'material-ui/styles/colors'
import { observer } from 'mobx-react'
import {
	Table,
	TableBody,
	TableHeader,
	TableHeaderColumn,
	TableRow,
	TableRowColumn,
} from 'material-ui/Table'

import FleetStore from '../../datastores/fleet_store'
import OptionsStore from '../../datastores/options_store'
import EditFleet from './edit_fleet'

const shipMap = {
	smallCargo: 202,
	largeCargo: 203,
	lightFighter: 204,
	heavyFighter: 205,
	cruiser: 206,
	battleship: 207,
	colonyShip: 208,
	recycler: 209,
	espionageProbe: 210,
	bomber: 211,
	solarSatellite: 212,
	destroyer: 213,
	deathstar: 214,
	battlecruiser: 215
}

const missionMap = {
	attack: 1,
	acsAttack: 2,
	transport: 3,
	deploy: 4,
	acsDefend: 5,
	espionage: 6,
	colonize: 7,
	recycle: 8,
	moonDestruction: 9,
	expedition: 15
}

const destinationTypeMap = {
	planet: 1,
	debris: 2,
	moon: 3
}

function formatValue(value) {
	return (value.length > 0) ? value : 0
}

function getShipsFromState(state: Object) {
	const ships = {}

	for (const ship in shipMap) {
		if (state[ship].length > 0) {
			ships[`am${ shipMap[ship] }`] = state[ship]
		}
	}

	return ships
}

type State = {
	open: boolean,
	send: boolean
}

type Props = {
	fleetStore: FleetStore,
	optionsStore: OptionsStore,
	index: number
}

@observer
export default muiThemeable()(class FleetTableRow extends Component {
	state: State
	props: Props

	constructor(props: Props) {
		super(props)

		this.state = {
			open: false,
			sendDisabled: false
		}
	}

	onTextChange(field: string, event: Object, newValue: string) {
		const currentRow = this.props.fleetStore.rows[this.props.index]

		currentRow[field] = newValue

		this.props.fleetStore.setRow(currentRow, this.props.index)
	}

	onRemoveRow(rowNumber, event) {
		event.preventDefault()

		this.props.fleetStore.removeRow(rowNumber)
	}

	handleOpen() {
		this.setState({
			open: true
		})
	}

	handleClose() {
		this.setState({
			open: false
		})
	}

	sendFleet() {
		const row = this.props.fleetStore.rows[this.props.index]

		this.sendFleet1(Object.assign({}, row.options))
	}

	sendFleet1(stateSnapshot: Object) {
		this.setState({
			sendDisabled: true,
			failureMessage: ''
		})

		const body = {
			galaxy: stateSnapshot.galaxy,
			system: stateSnapshot.system,
			position: stateSnapshot.position,
			type: destinationTypeMap[stateSnapshot.destination],
			mission: missionMap[stateSnapshot.mission],
			speed: stateSnapshot.speed,
			...getShipsFromState(stateSnapshot)
		}

		console.log('body 1:', body)

		console.log('o store:', this.props.optionsStore)

		const activeTabId = this.props.optionsStore.activeTabId

		chrome.tabs.sendMessage(activeTabId, {
			type: 'getUrl',
			url: 'https://s147-en.ogame.gameforge.com/game/index.php?page=fleet1',
			headers: {
				Referer: 'https://s147-en.ogame.gameforge.com/game/index.php?page=fleet1'
			},
			body
		}, (response) => {
			if (response.status === true) {
				this.sendFleet2(stateSnapshot)
			} else {
				this.setState({
					failureMessage: response.errorMessage
				})
			}
		})
	}

	sendFleet2(stateSnapshot: Object) {
		const body = {
			galaxy: stateSnapshot.galaxy,
			system: stateSnapshot.system,
			position: stateSnapshot.position,
			type: destinationTypeMap[stateSnapshot.destination],
			mission: missionMap[stateSnapshot.mission],
			speed: stateSnapshot.speed,
			...getShipsFromState(stateSnapshot)
		}

		console.log('body 2:', body)

		const activeTabId = this.props.optionsStore.activeTabId

		chrome.tabs.sendMessage(activeTabId, {
			type: 'postUrl',
			url: 'https://s147-en.ogame.gameforge.com/game/index.php?page=fleet2',
			headers: {
				Referer: 'https://s147-en.ogame.gameforge.com/game/index.php?page=fleet1'
			},
			body
		}, (response) => {
			if (response.status === true) {
				this.sendFleetCheck(stateSnapshot)
			} else {
				this.setState({
					failureMessage: response.errorMessage
				})
			}
		})
	}

	sendFleetCheck(stateSnapshot: Object) {
		const body = {
			galaxy: stateSnapshot.galaxy,
			system: stateSnapshot.system,
			planet: stateSnapshot.position,
			type: destinationTypeMap[stateSnapshot.destination]
		}

		const activeTabId = this.props.optionsStore.activeTabId

		chrome.tabs.sendMessage(activeTabId, {
			type: 'postUrl',
			url: 'https://s147-en.ogame.gameforge.com/game/index.php?page=fleetcheck&ajax=1&espionage=0',
			headers: {
				Referer: 'https://s147-en.ogame.gameforge.com/game/index.php?page=fleet2'
			},
			body
		}, (response) => {
			if (response.status === true) {
				this.sendFleet3(stateSnapshot)
			} else {
				this.setState({
					failureMessage: response.errorMessage
				})
			}
		})
	}

	sendFleet3(stateSnapshot: Object) {
		const body = {
			type: destinationTypeMap[stateSnapshot.destination],
			mission: missionMap[stateSnapshot.mission],
			union: 0,
			galaxy: stateSnapshot.galaxy,
			system: stateSnapshot.system,
			position: stateSnapshot.position,
			acsValues: '-',
			speed: stateSnapshot.speed,
			...getShipsFromState(stateSnapshot)
		}

		console.log('body 3:', body)

		const activeTabId = this.props.optionsStore.activeTabId

		chrome.tabs.sendMessage(activeTabId, {
			type: 'postUrl',
			url: 'https://s147-en.ogame.gameforge.com/game/index.php?page=fleet3',
			headers: {
				Referer: 'https://s147-en.ogame.gameforge.com/game/index.php?page=fleet2'
			},
			body
		}, (response) => {
			if (response.status === true) {
				const regExp = /<input type='hidden' name='token' value='(\w*)' \/>/
				const results = regExp.exec(response.text)
				const token = results[1]

				this.sendFleetExec(stateSnapshot, token)
			} else {
				this.setState({
					failureMessage: response.errorMessage
				})
			}
		})
	}

	sendFleetExec(stateSnapshot: Object, token) {
		const body = {
			holdingtime: stateSnapshot.holdingtime,
			expeditiontime: stateSnapshot.expeditiontime,
			token,
			galaxy: stateSnapshot.galaxy,
			system: stateSnapshot.system,
			position: stateSnapshot.position,
			type: destinationTypeMap[stateSnapshot.destination],
			mission: missionMap[stateSnapshot.mission],
			union2: 0,
			holdingOrExpTime: 0,
			speed: stateSnapshot.speed,
			acsValues: '-',
			prioMetal: 1,
			prioCrystal: 2,
			prioDeuterium: 3,
			metal: formatValue(stateSnapshot.metal),
			crystal: formatValue(stateSnapshot.crystal),
			deuterium: formatValue(stateSnapshot.deuterium),
			...getShipsFromState(stateSnapshot)
		}

		console.log('body exec:', body)

		const activeTabId = this.props.optionsStore.activeTabId

		console.log(`send fleet to content script! ${ activeTabId }`)

		chrome.tabs.sendMessage(activeTabId, {
			type: 'postUrl',
			url: 'https://s147-en.ogame.gameforge.com/game/index.php?page=movement',
			body
		}, (response) => {
			this.setState({
				sendDisabled: false
			})

			if (response.status === true) {
				console.log(response.text)
			} else {
				this.setState({
					failureMessage: response.errorMessage
				})
			}
		})
	}

	render() {
		const row = this.props.fleetStore.rows[this.props.index]

		return (
			<TableRow>
				<TableRowColumn>
					<TextField
						hintText='Label'
						value={ row.label }
						onChange={ this.onTextChange.bind(this, 'label') }
					/>
				</TableRowColumn>
				<TableRowColumn>
					{ `${ row.options.galaxy }:${ row.options.system }:${ row.options.position }` }
				</TableRowColumn>
				<TableRowColumn>
					{ `${ row.options.mission }` }
				</TableRowColumn>
				<TableRowColumn>
					<RaisedButton label='Edit' primary onTouchTap={ this.handleOpen.bind(this) } />
					<Dialog
						title={ `${ row.label }` }
						modal={ false }
						open={ this.state.open }
						onRequestClose={ this.handleClose.bind(this) }
						autoScrollBodyContent
						contentStyle={{
							width: '98%',
							maxWidth: 'none'
						}}
					>
						<EditFleet
							index={ this.props.index }
							fleetStore={ this.props.fleetStore }
							onClose={ this.handleClose.bind(this) }
						/>
					</Dialog>
				</TableRowColumn>
				<TableRowColumn>
					<RaisedButton
						label='Send'
						secondary
						onTouchTap={ this.sendFleet.bind(this) }
						disabled={ this.state.sendDisabled }
					/>
				</TableRowColumn>
				<TableRowColumn>
					<IconButton onTouchTap={ this.onRemoveRow.bind(this, this.props.index) }>
						<Cancel color={ this.props.muiTheme.palette.accent1Color }/>
					</IconButton>
				</TableRowColumn>
			</TableRow>
		)
	}
})
