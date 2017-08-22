import $ from 'jquery'
import React from 'react'
import { render } from 'react-dom'
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider'
import getMuiTheme from 'material-ui/styles/getMuiTheme'
import { blue500, blue300, blue100, red500, red300, red100 } from 'material-ui/styles/colors'
import RaisedButton from 'material-ui/RaisedButton'
import TextField from 'material-ui/TextField'

const muiTheme = getMuiTheme({
	palette: {
		primary1Color: blue500,
		primary2Color: blue300,
		primary3Color: blue100,
		accent1Color: red500
	}
})

// export default function defenseSummary() {
// 	const divs = $('.fleetDetails.detailsOpened > .reversal')

// 	// console.log(divs)

// 	for (let i = 0; i < divs.length; i++) {
// 		const div = divs[i]

// 		const id = $(div).attr('ref')

// 		$(div).css('width', '100px')
// 		$(div).append(`<div id="test-${ id }" style="display: inline-block; vertical-align: top;"></div>`)

// 		console.log(div)

// 		render(
// 			<MuiThemeProvider muiTheme={ muiTheme }>
// 				<RaisedButton
// 					primary
// 					label={ `${ id }` }
// 					style={{ height: '15px', minWidth: '35px', backgroundColor: undefined }}
// 					labelStyle={{ fontSize: '7px', paddingLeft: '3px', paddingRight: '3px' }}
// 				/>
// 			</MuiThemeProvider>,
// 		window.document.getElementById(`test-${ id }`))
// 	}
// }

function numberWithCommas(x) {
	return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
}

const defenseArray = [
	{ name: 'rocketLauncher', metalCost: 2000, crystalCost: 0 },
	{ name: 'lightLaser', metalCost: 1500, crystalCost: 500 },
	{ name: 'heavyLaser', metalCost: 6000, crystalCost: 2000 },
	{ name: 'gaussCannon', metalCost: 20000, crystalCost: 15000 },
	{ name: 'ionCannon', metalCost: 2000, crystalCost: 6000 },
	{ name: 'plasmaTurret', metalCost: 50000, crystalCost: 50000 },
	{ name: 'smallShieldDome', metalCost: 10000, crystalCost: 10000 },
	{ name: 'largeShieldDome', metalCost: 50000, crystalCost: 50000 },
	{ name: 'antiBallisticMissile', metalCost: 8000, crystalCost: 2000 },
	{ name: 'interplanetaryMissile', metalCost: 12500, crystalCost: 2500 }
]

export default function defenseSummary() {
	const defenseBox = $('#buttonz > .content')
	const defenses = defenseBox.find('.detail_button > .ecke > .level')

	let total = 0

	for (let i = 0; i < defenses.length; i++) {
		const defense = defenses[i]
		let number
		if ($(defense).attr('id') === 'bestand') {
			number = parseInt(String($(defense).text()).trim().replace(/\./g, ''), 10)
		} else {
			number = parseInt(String($(defense).contents().filter(function() {
				return this.nodeType === 3;
			})[1].nodeValue).trim().replace(/\./g, ''), 10)
		}

		const defenseObj = defenseArray[i]
		const cost = (defenseObj.metalCost + defenseObj.crystalCost) * number

		total += cost

		// console.log(`${ defenseObj.name } cost:`, cost)
	}

	// console.log('total:', total)

	const innerDefenseBox = defenseBox.find('#defensebuilding')
	$(innerDefenseBox).append('<div id="defense_summary"></div>')

	render(
		<MuiThemeProvider muiTheme={ muiTheme }>
			<RaisedButton
				primary
				label={ numberWithCommas(total) }
				style={{ marginLeft: '55px', marginTop: '25px' }}
				// style={{ height: '15px', minWidth: '35px', backgroundColor: undefined }}
				// labelStyle={{ fontSize: '7px', paddingLeft: '3px', paddingRight: '3px' }}
			/>
		</MuiThemeProvider>,
	window.document.getElementById('defense_summary'))
	// }
}
