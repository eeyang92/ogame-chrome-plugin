import React, { Component } from 'react'
import RaisedButton from 'material-ui/RaisedButton'
import TextField from 'material-ui/TextField'
import { observable, computed, action, toJS } from 'mobx'
import { observer } from 'mobx-react'

import RecallTable from './recall_table'

export class RecallTableStore {
	@observable rows = []
	@observable uniqueId = 0

	@action getRows() {
		return new Promise((resolve) => {
			chrome.runtime.sendMessage({
				type: 'getRows'
			}, (data) => {
				console.log('rows:', data.rows)

				this.rows = data.rows

				resolve(data.rows)
			})
		})
	}

	@action setRows(rows) {
		return new Promise((resolve) => {
			chrome.runtime.sendMessage({
				type: 'setRows',
				rows
			}, (rows_) => {
				console.log('rows:', rows_)

				this.rows = rows_

				resolve(rows_)
			})
		})
	}

	@action getUniqueId() {
		return new Promise((resolve) => {
			chrome.runtime.sendMessage({
				type: 'getUniqueId'
			}, (data) => {
				console.log('id:', data.id)

				this.uniqueId = data.id

				resolve(data.id)
			})
		})
	}

	@action setUniqueId(uniqueId) {
		return new Promise((resolve) => {
			chrome.runtime.sendMessage({
				type: 'setUniqueId',
				uniqueId
			}, (id) => {
				console.log('id:', id)

				this.uniqueId = id

				resolve(id)
			})
		})
	}

	@action sync() {
		console.log('syncing...')
		return Promise.all([this.getRows(), this.getUniqueId()])
	}
}

function setStorageRows(rows) {
	console.log('set:', rows)
	chrome.storage.sync.set({
		recallTableRows: toJS(rows)
	})
}

class BGRecallTableStore {
	@observable rows = []
	@observable uniqueId = 0

	@action addRow(row) {
		this.rows.push(row)

		setStorageRows(this.rows)
	}

	@action removeRow(rowNumber) {
		this.rows.splice(rowNumber, 1)

		setStorageRows(this.rows)
	}

	@action setRows(rows) {
		this.rows = rows

		setStorageRows(this.rows)
	}

	@action setUniqueId(uniqueId) {
		chrome.storage.sync.set({ uniqueId })

		this.uniqueId = uniqueId
	}

	@action getFromStorage() {
		return new Promise((resolve) => {
			chrome.storage.sync.get(null, (items) => {
				console.log('items:', items)
				let uniqueId
				let rows

				if (typeof items.uniqueId === 'undefined') {
					console.log('init id')
					chrome.storage.sync.set({ uniqueId: 0 })

					uniqueId = 0
				} else {
					uniqueId = items.uniqueId
				}

				if (!Array.isArray(items.recallTableRows)) {
					console.log('init row')
					chrome.storage.sync.set({ recallTableRows: [] })

					rows = []
				} else {
					rows = items.recallTableRows
				}

				this.uniqueId = uniqueId
				this.rows = rows

				console.log('mount rows:', rows)

				resolve({
					uniqueId,
					rows
				})
			})
		})
	}
}

type State = {}
type Props = {}

export default class Main extends Component {
	constructor(props) {
		super(props)

		this.recallTableStore = new BGRecallTableStore()
	}

	componentDidMount() {
		// this.recallTableStore.getRows()
		// this.recallTableStore.getUniqueId()
		this.recallTableStore.getFromStorage()
	}

	createNewTableRow() {
		// this.recallTableStore.rows.push({
		// 	url: '',
		// 	date: Date.now()
		// })

		// this.recallTableStore.setRows(toJS(this.recallTableStore.rows))

		this.recallTableStore.addRow({
			url: '',
			date: Date.now()
		})
	}

	clearTable() {
		chrome.storage.sync.clear(() => {
			if (chrome.lastError) {
				console.log(chrome.lastError)
			} else {
				console.log('cleared')

				this.recallTableStore.getFromStorage()
			}
		})

		// this.recallTableStore.setRows([])
	}

	render() {
		return (
			<div style={{ height: '500px', width: '700px' }}>
				<RecallTable datastore={ this.recallTableStore } />
				<RaisedButton
					label='New'
					style={{ marginTop: '10px' }}
					onTouchTap={ this.createNewTableRow.bind(this) }
					fullWidth
				/>
				<RaisedButton
					label='Clear'
					style={{ marginTop: '10px' }}
					onTouchTap={ this.clearTable.bind(this) }
					fullWidth
				/>
			</div>
		)
	}
}
