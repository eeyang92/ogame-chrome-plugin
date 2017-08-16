import { observable, action, toJS } from 'mobx'

export default class BaseStore {
	@observable rows = []
	@observable uniqueId = 0

	storageKey = 'base'

	persistRows(row) {
		return new Promise((resolve) => {
			chrome.storage.sync.set({
				[this.storageKey]: toJS(row)
			}, () => {
				resolve()
			})
		})
	}

	@action addRow(row) {
		this.rows.push(row)

		return this.persistRows(this.rows)
	}

	@action removeRow(rowNumber) {
		this.rows.splice(rowNumber, 1)

		return this.persistRows(this.rows)
	}

	@action setRows(row) {
		this.rows = row

		return this.persistRows(this.row)
	}

	@action setRow(row, index) {
		this.rows[index] = row

		return this.persistRows(this.rows)
	}

	// @action setUniqueId(uniqueId) {
	// 	chrome.storage.sync.set({ uniqueId })

	// 	this.uniqueId = uniqueId
	// }

	// @action setActiveTabId(tabId) {
	// 	this.activeTabId = tabId

	// 	return new Promise((resolve) => {
	// 		chrome.storage.sync.set({ activeTabId: tabId }, () => {
	// 			resolve()
	// 		})
	// 	})
	// }

	// @action addRowAndIncrementId(row) {
	// 	this.rows.push(row)

	// 	chrome.storage.sync.set({
	// 		[this.storageKey]: toJS(this.rows),
	// 		uniqueId: toJS(++this.uniqueId)
	// 	})
	// }

	@action getFromStorage() {
		return new Promise((resolve) => {
			chrome.storage.sync.get(this.storageKey, (items) => {
				console.log('items:', items)
				// let uniqueId
				// let activeTabId
				let rows

				// if (typeof items.uniqueId === 'undefined') {
				// 	chrome.storage.sync.set({ uniqueId: 0 })

				// 	uniqueId = 0
				// } else {
				// 	uniqueId = items.uniqueId
				// }

				// if (typeof items.activeTabId === 'undefined') {
				// 	chrome.storage.sync.set({ activeTabId: -1 })

				// 	activeTabId = -1
				// } else {
				// 	activeTabId = items.activeTabId
				// }

				if (!Array.isArray(items[this.storageKey])) {
					chrome.storage.sync.set({ [this.storageKey]: [] })

					rows = []
				} else {
					rows = items[this.storageKey]
				}

				// this.uniqueId = uniqueId
				this.rows = rows
				// this.activeTabId = activeTabId

				// console.log('load:', this.activeTabId)

				resolve({
					// uniqueId,
					rows,
					// activeTabId
				})
			})
		})
	}
}
