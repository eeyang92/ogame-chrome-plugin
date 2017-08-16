import { observable, action, toJS } from 'mobx'

const storageKey = 'fleet'

function setRows(row) {
	return new Promise((resolve) => {
		chrome.storage.sync.set({
			[storageKey]: toJS(row)
		}, () => {
			resolve()
		})
	})
}

export default class FleetStore {
	@observable rows = []
	@observable uniqueId = 0
	@observable activeTabId = -1

	@action addRow(row) {
		this.rows.push(row)

		return setRows(this.rows)
	}

	@action removeRow(rowNumber) {
		this.rows.splice(rowNumber, 1)

		return setRows(this.rows)
	}

	@action setRows(row) {
		this.rows = row

		return setRows(this.row)
	}

	@action setRow(row, index) {
		this.rows[index] = row

		return setRows(this.rows)
	}

	@action setUniqueId(uniqueId) {
		chrome.storage.sync.set({ uniqueId })

		this.uniqueId = uniqueId
	}

	@action setActiveTabId(tabId) {
		this.activeTabId = tabId

		return new Promise((resolve) => {
			chrome.storage.sync.set({ activeTabId: tabId }, () => {
				resolve()
			})
		})
	}

	@action addRowAndIncrementId(row) {
		this.rows.push(row)

		chrome.storage.sync.set({
			[storageKey]: toJS(this.rows),
			uniqueId: toJS(++this.uniqueId)
		})
	}

	@action getFromStorage() {
		return new Promise((resolve) => {
			chrome.storage.sync.get(null, (items) => {
				console.log('items:', items)
				let uniqueId
				let activeTabId
				let rows

				if (typeof items.uniqueId === 'undefined') {
					chrome.storage.sync.set({ uniqueId: 0 })

					uniqueId = 0
				} else {
					uniqueId = items.uniqueId
				}

				if (typeof items.activeTabId === 'undefined') {
					chrome.storage.sync.set({ activeTabId: -1 })

					activeTabId = -1
				} else {
					activeTabId = items.activeTabId
				}

				if (!Array.isArray(items[storageKey])) {
					chrome.storage.sync.set({ [storageKey]: [] })

					rows = []
				} else {
					rows = items[storageKey]
				}

				this.uniqueId = uniqueId
				this.rows = rows
				this.activeTabId = activeTabId

				console.log('load:', this.activeTabId)

				resolve({
					uniqueId,
					rows,
					activeTabId
				})
			})
		})
	}
}
