import { observable, action, toJS } from 'mobx'

function setStorageRows(rows) {
	return new Promise((resolve) => {
		chrome.storage.sync.set({
			recallTableRows: toJS(rows)
		}, () => {
			resolve()
		})
	})
}

export default class RecallTableStore {
	@observable rows = []
	@observable uniqueId = 0
	@observable activeTabId = -1

	@action addRow(row) {
		this.rows.push(row)

		return setStorageRows(this.rows)
	}

	@action removeRow(rowNumber) {
		this.rows.splice(rowNumber, 1)

		return setStorageRows(this.rows)
	}

	@action setRows(rows) {
		this.rows = rows

		return setStorageRows(this.rows)
	}

	@action setRow(row, index) {
		this.rows[index] = row

		return setStorageRows(this.rows)
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
			recallTableRows: toJS(this.rows),
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

				if (!Array.isArray(items.recallTableRows)) {
					chrome.storage.sync.set({ recallTableRows: [] })

					rows = []
				} else {
					rows = items.recallTableRows
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
