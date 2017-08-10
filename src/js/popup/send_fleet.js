import React, { Component } from 'react'
import RaisedButton from 'material-ui/RaisedButton'
import TextField from 'material-ui/TextField'
import {
	Table,
	TableBody,
	TableHeader,
	TableHeaderColumn,
	TableRow,
	TableRowColumn,
} from 'material-ui/Table'
import DropDownMenu from 'material-ui/DropDownMenu'
import MenuItem from 'material-ui/MenuItem'
import { observable, computed, action, toJS } from 'mobx'
import { observer } from 'mobx-react'

import RecallTableStore from '../datastores/recall_table_store'
import RecallTable from './recall_table'

type State = {}
type Props = {
	recallTableStore: RecallTableStore
}

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

@observer
export default class Main extends Component {
	props: Props

	constructor(props: Props) {
		super(props)

		this.state = {
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
			sendDisabled: false,
			holdingtime: '0',
			expeditiontime: 1,
			metal: '',
			crystal: '',
			deuterium: '',
			failureMessage: '',
			destination: 'planet'
		}
	}

	getShipsFromState() {
		const ships = {}

		for (const ship in shipMap) {
			if (this.state[ship].length > 0) {
				ships[`am${ shipMap[ship] }`] = this.state[ship]
			}
		}

		return ships
	}

	sendFleet1() {
		this.setState({
			sendDisabled: true,
			failureMessage: ''
		})

		const body = {
			galaxy: this.state.galaxy,
			system: this.state.system,
			position: this.state.position,
			type: destinationTypeMap[this.state.destination],
			mission: missionMap[this.state.mission],
			speed: this.state.speed,
			...this.getShipsFromState()
		}

		console.log('body 1:', body)

		const activeTabId = this.props.recallTableStore.activeTabId

		chrome.tabs.sendMessage(activeTabId, {
			type: 'getUrl',
			url: 'https://s147-en.ogame.gameforge.com/game/index.php?page=fleet1',
			headers: {
				Referer: 'https://s147-en.ogame.gameforge.com/game/index.php?page=fleet1'
			},
			body
		}, (response) => {
			if (response.status === true) {
				this.sendFleet2()
			} else {
				this.setState({
					failureMessage: response.errorMessage
				})
			}
		})
	}

	sendFleet2() {
		this.setState({
			sendDisabled: true
		})

		const body = {
			galaxy: this.state.galaxy,
			system: this.state.system,
			position: this.state.position,
			type: destinationTypeMap[this.state.destination],
			mission: missionMap[this.state.mission],
			speed: this.state.speed,
			...this.getShipsFromState()
		}

		console.log('body 2:', body)

		const activeTabId = this.props.recallTableStore.activeTabId

		chrome.tabs.sendMessage(activeTabId, {
			type: 'postUrl',
			url: 'https://s147-en.ogame.gameforge.com/game/index.php?page=fleet2',
			headers: {
				Referer: 'https://s147-en.ogame.gameforge.com/game/index.php?page=fleet1'
			},
			body
		}, (response) => {
			if (response.status === true) {
				this.sendFleetCheck()
			} else {
				this.setState({
					failureMessage: response.errorMessage
				})
			}
		})
	}

	sendFleetCheck() {
		const body = {
			galaxy: this.state.galaxy,
			system: this.state.system,
			planet: this.state.position,
			type: destinationTypeMap[this.state.destination]
		}

		const activeTabId = this.props.recallTableStore.activeTabId

		chrome.tabs.sendMessage(activeTabId, {
			type: 'postUrl',
			url: 'https://s147-en.ogame.gameforge.com/game/index.php?page=fleetcheck&ajax=1&espionage=0',
			headers: {
				Referer: 'https://s147-en.ogame.gameforge.com/game/index.php?page=fleet2'
			},
			body
		}, (response) => {
			if (response.status === true) {
				this.sendFleet3()
			} else {
				this.setState({
					failureMessage: response.errorMessage
				})
			}
		})
	}

	sendFleet3() {
		const body = {
			type: destinationTypeMap[this.state.destination],
			mission: missionMap[this.state.mission],
			union: 0,
			galaxy: this.state.galaxy,
			system: this.state.system,
			position: this.state.position,
			acsValues: '-',
			speed: this.state.speed,
			...this.getShipsFromState()
		}

		console.log('body 3:', body)

		const activeTabId = this.props.recallTableStore.activeTabId

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

				this.sendFleetExec(token)
			} else {
				this.setState({
					failureMessage: response.errorMessage
				})
			}
		})
	}

	sendFleetExec(token) {
		const body = {
			holdingtime: this.state.holdingtime,
			expeditiontime: this.state.expeditiontime,
			token,
			galaxy: this.state.galaxy,
			system: this.state.system,
			position: this.state.position,
			type: destinationTypeMap[this.state.destination],
			mission: missionMap[this.state.mission],
			union2: 0,
			holdingOrExpTime: 0,
			speed: this.state.speed,
			acsValues: '-',
			prioMetal: 1,
			prioCrystal: 2,
			prioDeuterium: 3,
			metal: formatValue(this.state.metal),
			crystal: formatValue(this.state.crystal),
			deuterium: formatValue(this.state.deuterium),
			...this.getShipsFromState()
		}

		console.log('body exec:', body)

		const activeTabId = this.props.recallTableStore.activeTabId

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

	onTextChange(field: string, event: Object, newValue: string) {
		this.setState({
			[field]: newValue
		})
	}

	onMenuChange(field: string, event, index, newValue) {
		this.setState({
			[field]: newValue
		})
	}

	render() {
		return (
			<div style={{ marginBottom: '5px' }}>
				<Table selectable={ false }>
					<TableHeader
						adjustForCheckbox={ false }
						displaySelectAll={ false }
						style={{ cursor: 'default' }}
					>
						<TableRow>
							<TableHeaderColumn>Combat Fleet</TableHeaderColumn>
							<TableHeaderColumn>Civil Fleet</TableHeaderColumn>
							<TableHeaderColumn>Target</TableHeaderColumn>
							<TableHeaderColumn>Options</TableHeaderColumn>
						</TableRow>
					</TableHeader>
					<TableBody displayRowCheckbox={ false }>
						<TableRow displayBorder={ false }>
							<TableRowColumn>
								<TextField
									floatingLabelText='Light Fighter'
									value={ this.state.lightFighter }
									onChange={ this.onTextChange.bind(this, 'lightFighter') }
								/>
							</TableRowColumn>
							<TableRowColumn>
								<TextField
									floatingLabelText='Small Cargo'
									value={ this.state.smallCargo }
									onChange={ this.onTextChange.bind(this, 'smallCargo') }
								/>
							</TableRowColumn>
							<TableRowColumn>
								<TextField
									floatingLabelText='Galaxy'
									value={ this.state.galaxy }
									onChange={ this.onTextChange.bind(this, 'galaxy') }
								/>
							</TableRowColumn>
							<TableRowColumn>
								<DropDownMenu
									autoWidth={ false }
									style={{ width: '100%' }}
									value={ this.state.mission }
									maxHeight={ 300 }
									onChange={ this.onMenuChange.bind(this, 'mission') }
									labelStyle={{ paddingLeft: '0px' }}
									underlineStyle={{ margin: 0, right: '32px' }}
								>
									<MenuItem value={ 'attack' } primaryText='Attack' />
									<MenuItem value={ 'acsAttack' } primaryText='ACS Attack' />
									<MenuItem value={ 'transport' } primaryText='Transport' />
									<MenuItem value={ 'deploy' } primaryText='Deploy' />
									<MenuItem value={ 'acsDefend' } primaryText='ACS Defend' />
									<MenuItem value={ 'espionage' } primaryText='Espionage' />
									<MenuItem value={ 'colonize' } primaryText='Colonize' />
									<MenuItem value={ 'recycle' } primaryText='Recycle' />
									<MenuItem value={ 'moonDestruction' } primaryText='Moon Destruction' />
									<MenuItem value={ 'expedition' } primaryText='Expedition' />
								</DropDownMenu>
							</TableRowColumn>
						</TableRow>
						<TableRow displayBorder={ false }>
							<TableRowColumn>
								<TextField
									floatingLabelText='Heavy Fighter'
									value={ this.state.heavyFighter }
									onChange={ this.onTextChange.bind(this, 'heavyFighter') }
								/>
							</TableRowColumn>
							<TableRowColumn>
								<TextField
									floatingLabelText='Large Cargo'
									value={ this.state.largeCargo }
									onChange={ this.onTextChange.bind(this, 'largeCargo') }
								/>
							</TableRowColumn>
							<TableRowColumn>
								<TextField
									floatingLabelText='System'
									value={ this.state.system }
									onChange={ this.onTextChange.bind(this, 'system') }
								/>
							</TableRowColumn>
							<TableRowColumn>
								<DropDownMenu
									autoWidth={ false }
									style={{ width: '100%' }}
									value={ this.state.speed }
									maxHeight={ 300 }
									onChange={ this.onMenuChange.bind(this, 'speed') }
									labelStyle={{ paddingLeft: '0px' }}
									underlineStyle={{ margin: 0, right: '32px' }}
								>
									<MenuItem value={ '1' } primaryText='10%' />
									<MenuItem value={ '2' } primaryText='20%' />
									<MenuItem value={ '3' } primaryText='30%' />
									<MenuItem value={ '4' } primaryText='40%' />
									<MenuItem value={ '5' } primaryText='50%' />
									<MenuItem value={ '6' } primaryText='60%' />
									<MenuItem value={ '7' } primaryText='70%' />
									<MenuItem value={ '8' } primaryText='80%' />
									<MenuItem value={ '9' } primaryText='90%' />
									<MenuItem value={ '10' } primaryText='100%' />
								</DropDownMenu>
							</TableRowColumn>
						</TableRow>
						<TableRow displayBorder={ false }>
							<TableRowColumn>
								<TextField
									floatingLabelText='Cruiser'
									value={ this.state.cruiser }
									onChange={ this.onTextChange.bind(this, 'cruiser') }
								/>
							</TableRowColumn>
							<TableRowColumn>
								<TextField
									floatingLabelText='Colony Ship'
									value={ this.state.colonyShip }
									onChange={ this.onTextChange.bind(this, 'colonyShip') }
								/>
							</TableRowColumn>
							<TableRowColumn>
								<TextField
									floatingLabelText='Position'
									value={ this.state.position }
									onChange={ this.onTextChange.bind(this, 'position') }
								/>
							</TableRowColumn>
							<TableRowColumn>
								<TextField
									floatingLabelText='Hold Time (0, 1, 2, 4, 16, 32)'
									value={ this.state.holdingtime }
									onChange={ this.onTextChange.bind(this, 'holdingtime') }
								/>
								{/* Hold Time
								<DropDownMenu
									autoWidth={ false }
									style={{ width: '100%' }}
									maxHeight={ 300 }
									value={ this.state.holdingtime }
									onChange={ this.onMenuChange.bind(this, 'holdingtime') }
									labelStyle={{ paddingLeft: '0px' }}
									underlineStyle={{ margin: 0, right: '32px' }}
								>
									<MenuItem value={ '0' } primaryText='0' />
									<MenuItem value={ '1' } primaryText='1' />
									<MenuItem value={ '2' } primaryText='2' />
									<MenuItem value={ '4' } primaryText='4' />
									<MenuItem value={ '8' } primaryText='8' />
									<MenuItem value={ '16' } primaryText='16' />
									<MenuItem value={ '32' } primaryText='32' />
								</DropDownMenu> */}
							</TableRowColumn>
						</TableRow>
						<TableRow displayBorder={ false }>
							<TableRowColumn>
								<TextField
									floatingLabelText='Battleship'
									value={ this.state.battleship }
									onChange={ this.onTextChange.bind(this, 'battleship') }
								/>
							</TableRowColumn>
							<TableRowColumn>
								<TextField
									floatingLabelText='Recycler'
									value={ this.state.recycler }
									onChange={ this.onTextChange.bind(this, 'recycler') }
								/>
							</TableRowColumn>
							<TableRowColumn>
								<DropDownMenu
									autoWidth={ false }
									style={{ width: '100%' }}
									value={ this.state.destination }
									maxHeight={ 300 }
									onChange={ this.onMenuChange.bind(this, 'destination') }
									labelStyle={{ paddingLeft: '0px' }}
									underlineStyle={{ margin: 0, right: '32px' }}
								>
									<MenuItem value={ 'planet' } primaryText='Planet' />
									<MenuItem value={ 'debris' } primaryText='Debris' />
									<MenuItem value={ 'moon' } primaryText='Moon' />
								</DropDownMenu>
							</TableRowColumn>
							<TableRowColumn>
								<TextField
									floatingLabelText='Expedition Time (1-Max Astro)'
									value={ this.state.expeditiontime }
									onChange={ this.onTextChange.bind(this, 'expeditiontime') }
								/>
							</TableRowColumn>
						</TableRow>
						<TableRow displayBorder={ false }>
							<TableRowColumn>
								<TextField
									floatingLabelText='Battlecruiser'
									value={ this.state.battlecruiser }
									onChange={ this.onTextChange.bind(this, 'battlecruiser') }
								/>
							</TableRowColumn>
							<TableRowColumn>
								<TextField
									floatingLabelText='Espionage Probe'
									value={ this.state.espionageProbe }
									onChange={ this.onTextChange.bind(this, 'espionageProbe') }
								/>
							</TableRowColumn>
							<TableRowColumn />
							<TableRowColumn>
								<TextField
									floatingLabelText='Metal'
									value={ this.state.metal }
									onChange={ this.onTextChange.bind(this, 'metal') }
								/>
							</TableRowColumn>
						</TableRow>
						<TableRow displayBorder={ false }>
							<TableRowColumn>
								<TextField
									floatingLabelText='Bomber'
									value={ this.state.bomber }
									onChange={ this.onTextChange.bind(this, 'bomber') }
								/>
							</TableRowColumn>
							<TableRowColumn />
							<TableRowColumn />
							<TableRowColumn>
								<TextField
									floatingLabelText='Crystal'
									value={ this.state.crystal }
									onChange={ this.onTextChange.bind(this, 'crystal') }
								/>
							</TableRowColumn>
						</TableRow>
						<TableRow displayBorder={ false }>
							<TableRowColumn>
								<TextField
									floatingLabelText='Destroyer'
									value={ this.state.destroyer }
									onChange={ this.onTextChange.bind(this, 'destroyer') }
								/>
							</TableRowColumn>
							<TableRowColumn />
							<TableRowColumn />
							<TableRowColumn>
								<TextField
									floatingLabelText='Deuterium'
									value={ this.state.deuterium }
									onChange={ this.onTextChange.bind(this, 'deuterium') }
								/>
							</TableRowColumn>
						</TableRow>
						<TableRow displayBorder={ false }>
							<TableRowColumn>
								<TextField
									floatingLabelText='Deathstar'
									value={ this.state.deathstar }
									onChange={ this.onTextChange.bind(this, 'deathstar') }
								/>
							</TableRowColumn>
						</TableRow>
					</TableBody>
				</Table>
				<RaisedButton
					secondary
					label='Send Fleet'
					style={{ marginTop: '5px' }}
					onTouchTap={ this.sendFleet1.bind(this) }
					fullWidth
					disabled={ this.state.sendDisabled }
				/>
				{ this.state.failureMessage }
			</div>
		)
	}
}
