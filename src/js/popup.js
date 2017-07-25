// @flow
import React from 'react'
import { render } from 'react-dom'
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider'
import getMuiTheme from 'material-ui/styles/getMuiTheme'
import injectTapEventPlugin from 'react-tap-event-plugin'
import { blue500, blue300, blue100, red500, red300, red100 } from 'material-ui/styles/colors'
import { useStrict } from 'mobx'

// import '../css/popup.css'
import Main from './popup/main'

useStrict()
injectTapEventPlugin()

const muiTheme = getMuiTheme({
	palette: {
		primary1Color: blue500,
		primary2Color: blue300,
		primary3Color: blue100,
		accent1Color: red500,
		// accent2Color: red300,
		// accent3Color: red100
	}
})

render(
	<MuiThemeProvider muiTheme={ muiTheme }>
		<Main />
	</MuiThemeProvider>,
	window.document.getElementById('app-container')
)
