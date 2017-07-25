// @flow
import { observable, computed, action, toJS } from 'mobx'

import RecallTableStore from './datastores/recall_table_store'

function parseTimeString(timeString: string) {
	const splitTimeString = timeString.split(':')

	const today = new Date()

	const year = today.getFullYear()
	const month = today.getMonth()
	const day = today.getDate()

	let hour = 0
	let minute = 0
	let second = 0

	if (splitTimeString.length > 0) {
		hour = splitTimeString[0]
	}

	if (splitTimeString.length > 1) {
		minute = splitTimeString[1]
	}

	if (splitTimeString.length > 2) {
		second = splitTimeString[2]
	}

	return { year, month, day, hour, minute, second }
}

function parseAtTime(timeString: string) {
	const { year, month, day, hour, minute, second } = parseTimeString(timeString)
	const setTime = new Date(year, month, day, hour, minute, second)
	const today = new Date()

	if (today > setTime) {
		setTime.setDate(setTime.getDate() + 1)
	}

	return setTime
}

function parseFromTimeMilliseconds(timeString: string) {
	const { hour, minute, second } = parseTimeString(timeString)

	const intHour = parseInt(hour)
	const intMinute = parseInt(minute)
	const intSecond = parseInt(second)

	// console.log(intHour)
	// console.log(intMinute)
	// console.log(intSecond)

	const total = ((intHour * 3600) + (intMinute * 60) + (intSecond)) * 1000

	return total
}

class TimeKeeper {
	constructor() {
		this.timeouts = []

		this.recallTableStore = new RecallTableStore()

		this.recallTableStore.getFromStorage()
		.then(() => {
			this.syncAndSet()
			this.initializeConnection()

			return
		})
		.catch((err) => {
			console.log(err)
		})
	}

	initializeConnection() {
		chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
			if (request.type === 'resetTimer') {
				this.recallTableStore.getFromStorage()
				.then(() => {
					this.syncAndSet()

					sendResponse({
						status: 'OK'
					})

					return
				})

				return true
			}
		})
	}

	clearTimeouts() {
		this.timeouts.forEach((timeout) => {
			clearTimeout(timeout)
		})
	}

	setDone(index) {
		// console.log('set done:', index)
		const currentRow = this.recallTableStore.rows[index]

		currentRow.done = true

		this.recallTableStore.setRow(currentRow, index)
		.then(() => {
			chrome.runtime.sendMessage({ type: 'refreshPopup' })
		})
	}

	syncAndSet() {
		const rows = this.recallTableStore.rows

		rows.forEach((row, index) => {
			console.log('row:', row)

			if (row.set === true) {
				if (row.timeStrat === 'at time') {
					const time = parseAtTime(row.time)

					const now = Date.now()
					const later = Date.parse(time.toISOString())
					const diff = later - now

					const timeout = setTimeout(() => {
						const activeTabId = this.recallTableStore.activeTabId

						console.log(`send recall to content script! ${ activeTabId }` )

						chrome.tabs.sendMessage(activeTabId, {
							type: 'recallFleet',
							url: row.url
						}, (response) => {
							// console.log(response)

							if (response.status === true) {
								this.setDone(index)
							}
						})
					}, diff)

					this.timeouts.push(timeout)
				} else if (row.timeStrat === 'from now') {
					const time = parseFromTimeMilliseconds(row.time)

					const timeout = setTimeout(() => {
						const activeTabId = this.recallTableStore.activeTabId

						console.log(`send recall to content script! ${ activeTabId }` )

						chrome.tabs.sendMessage(activeTabId, {
							type: 'recallFleet',
							url: row.url
						}, (response) => {
							// console.log(response)

							if (response.status === true) {
								this.setDone(index)
							}
						})
					}, time)

					this.timeouts.push(timeout)
				}
			}
		})
	}
}

const timeKeeper = new TimeKeeper()
