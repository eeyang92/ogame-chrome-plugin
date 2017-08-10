import $ from 'jquery'
import React from 'react'
import { render } from 'react-dom'
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider'
import getMuiTheme from 'material-ui/styles/getMuiTheme'
import injectTapEventPlugin from 'react-tap-event-plugin'
import { blue500, blue300, blue100, red500, red300, red100 } from 'material-ui/styles/colors'

import injectButtons from './content/inject_buttons'

injectTapEventPlugin()

const muiTheme = getMuiTheme({
	palette: {
		primary1Color: blue500,
		primary2Color: blue300,
		primary3Color: blue100,
		accent1Color: red500
	}
})

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
	console.log('req:', request)

	if (request.type === 'recallFleet') {
		const headers = new Headers({
			Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
			'Accept-Encoding': 'gzip, deflate, sdch, br',
			'Accept-Language': 'en-US,en;q=0.8',
			Connection: 'keep-alive',
			'Upgrade-Insecure-Requests': '1',
			'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_3) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.36'
		})

		fetch(request.url, {
			credentials: 'include',
			headers
		})
		.then((response) => {
			if (response.status === 200) {
				console.log('Worked!')

				return true
			}

			console.log('Failed!')
			console.log(response.statusText)

			return false
		})
		.then((status) => {
			sendResponse({
				status,
				message: request.url
			})

			return
		})
		.catch((err) => {
			console.log('err:', err)
		})

		return true
	}

	if (request.type === 'getUrl') {
		const extraHeaders = (request.headers) ? request.headers : {}
		const headers = new Headers({
			Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
			'Accept-Encoding': 'gzip, deflate, sdch, br',
			'Accept-Language': 'en-US,en;q=0.8',
			Connection: 'keep-alive',
			'Upgrade-Insecure-Requests': '1',
			'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_3) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.36',
			...extraHeaders
		})

		fetch(request.url, {
			credentials: 'include',
			headers
		})
		.then((response) => {
			if (response.status === 200) {
				console.log('Worked!')

				return response.text()
			}

			console.log('Failed!')
			console.log(response.statusText)

			throw Error(response.statusText)
		})
		.then((text) => {
			sendResponse({
				status: true,
				text
			})
		})
		.catch((err) => {
			console.log('err:', err)

			sendResponse({
				status: false,
				errorMessage: err
			})
		})

		return true
	}

	if (request.type === 'postUrl') {
		const extraHeaders = (request.headers) ? request.headers : {}
		const headers = new Headers({
			Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
			'Accept-Encoding': 'gzip, deflate, sdch, br',
			'Accept-Language': 'en-US,en;q=0.8',
			'Content-Type': 'application/x-www-form-urlencoded',
			'Cache-Control': 'max-age=0',
			Connection: 'keep-alive',
			'Upgrade-Insecure-Requests': '1',
			'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_3) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.36',
			...extraHeaders
		})

		const formBodyArr = []

		for (const key in request.body) {
			const encodedKey = encodeURIComponent(key)
			const encodedValue = encodeURIComponent(request.body[key])

			formBodyArr.push(`${ encodedKey }=${ encodedValue }`)
		}

		const formBody = formBodyArr.join('&')

		fetch(request.url, {
			credentials: 'include',
			headers,
			method: 'POST',
			body: formBody,
			referrer: 'https://s147-en.ogame.gameforge.com/game/index.php?page=fleet2'
		})
		.then((response) => {
			console.log('status:', response.status)
			if (response.status === 200) {
				console.log('Worked!')

				return response.text()
			}

			console.log('Failed!')
			console.log(response.statusText)

			throw Error(response.statusText)
		})
		.then((text) => {
			console.log('here')
			sendResponse({
				status: true,
				text
			})
		})
		.catch((err) => {
			console.log('err:', err)

			sendResponse({
				status: false,
				errorMessage: err
			})
		})

		return true
	}
})

// const body = $('body')

// body.append('<div id="app-container"</div>')

// render(

// 		<InjectButtons />
// 	</MuiThemeProvider>,
// 	window.document.getElementById('app-container')
// )

injectButtons()
