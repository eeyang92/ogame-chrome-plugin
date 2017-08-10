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

export default function injectButtons() {
	const divs = $('.fleetDetails.detailsOpened > .reversal')

	// console.log(divs)

	for (let i = 0; i < divs.length; i++) {
		const div = divs[i]

		const id = $(div).attr('ref')

		$(div).css('width', '100px')
		$(div).append(`<div id="test-${ id }" style="display: inline-block; vertical-align: top;"></div>`)

		console.log(div)

		render(
			<MuiThemeProvider muiTheme={ muiTheme }>
				<RaisedButton
					primary
					label={ `${ id }` }
					style={{ height: '15px', minWidth: '35px', backgroundColor: undefined }}
					labelStyle={{ fontSize: '7px', paddingLeft: '3px', paddingRight: '3px' }}
				/>
			</MuiThemeProvider>,
		window.document.getElementById(`test-${ id }`))
	}
}
