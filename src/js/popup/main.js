import React, { Component } from 'react'
import RaisedButton from 'material-ui/RaisedButton'
import TextField from 'material-ui/TextField'
import { observable, computed, action, toJS } from 'mobx'
import { observer } from 'mobx-react'

import RecallTable from './recall_table'

function setStorageRows(rows) {
	chrome.storage.sync.set({
		recallTableRows: toJS(rows)
	})
}

export class RecallTableStore {
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

	@action setRow(row, index) {
		this.rows[index] = row

		setStorageRows(this.rows)
	}

	@action setUniqueId(uniqueId) {
		chrome.storage.sync.set({ uniqueId })

		this.uniqueId = uniqueId
	}

	@action addRowAndIncrementId(row) {
		this.rows.push(row)

		chrome.storage.sync.set({
			recallTableRows: toJS(this.rows),
			uniqueId: toJS(++this.uniqueId)
		})
	}

	@action getFromStorage() {
		return new Promise((resolve) => {
			chrome.storage.sync.get(null, (items) => {
				console.log(items)
				let uniqueId
				let rows

				if (typeof items.uniqueId === 'undefined') {
					chrome.storage.sync.set({ uniqueId: 0 })

					uniqueId = 0
				} else {
					uniqueId = items.uniqueId
				}

				if (!Array.isArray(items.recallTableRows)) {
					chrome.storage.sync.set({ recallTableRows: [] })

					rows = []
				} else {
					rows = items.recallTableRows
				}

				this.uniqueId = uniqueId
				this.rows = rows

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

		this.recallTableStore = new RecallTableStore()
	}

	componentDidMount() {
		this.recallTableStore.getFromStorage()
	}

	createNewTableRow() {
		this.recallTableStore.addRowAndIncrementId({
			url: '',
			time: '',
			id: toJS(this.recallTableStore.uniqueId),
			timeStrat: 'from now',
			set: false
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
	}

	render() {
		return (
			<div style={{ height: '400px', width: '750px' }}>
				<RecallTable datastore={ this.recallTableStore } />
				<RaisedButton
					primary
					label='New'
					style={{ marginTop: '10px' }}
					onTouchTap={ this.createNewTableRow.bind(this) }
					fullWidth
				/>
				<RaisedButton
					secondary
					label='Clear'
					style={{ marginTop: '5px' }}
					onTouchTap={ this.clearTable.bind(this) }
					fullWidth
				/>
			</div>
		)
	}
}
