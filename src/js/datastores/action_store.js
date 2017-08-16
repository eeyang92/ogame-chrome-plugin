import { observable, action, toJS } from 'mobx'

function setActionRows(actions) {
	return new Promise((resolve) => {
		chrome.storage.sync.set({
			actions: toJS(actions)
		}, () => {
			resolve()
		})
	})
}

export default class ActionStore {
	@observable actions = []
	@observable uniqueId = 0
	@observable activeTabId = -1

	@action addRow(row) {
		this.actions.push(row)

		return setActionRows(this.actions)
	}

	@action removeRow(rowNumber) {
		this.actions.splice(rowNumber, 1)

		return setActionRows(this.actions)
	}

	@action setRows(actions) {
		this.actions = actions

		return setActionRows(this.actions)
	}

	@action setRow(row, index) {
		this.actions[index] = row

		return setActionRows(this.actions)
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
		this.actions.push(row)

		chrome.storage.sync.set({
			actions: toJS(this.actions),
			uniqueId: toJS(++this.uniqueId)
		})
	}

	@action getFromStorage() {
		return new Promise((resolve) => {
			chrome.storage.sync.get(null, (items) => {
				console.log('items:', items)
				let uniqueId
				let activeTabId
				let actions

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

				if (!Array.isArray(items.actions)) {
					chrome.storage.sync.set({ actions: [] })

					actions = []
				} else {
					actions = items.actions
				}

				this.uniqueId = uniqueId
				this.actions = actions
				this.activeTabId = activeTabId

				console.log('load:', this.activeTabId)

				resolve({
					uniqueId,
					actions,
					activeTabId
				})
			})
		})
	}
}
