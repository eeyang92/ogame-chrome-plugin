// @flow
import React from 'react'
import { render } from 'react-dom'
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider'
import injectTapEventPlugin from 'react-tap-event-plugin'
import { useStrict } from 'mobx'

// import '../css/popup.css'
import Main from './popup/main'

useStrict()
injectTapEventPlugin()

render(
	<MuiThemeProvider>
		<Main />
	</MuiThemeProvider>,
	window.document.getElementById('app-container')
)
