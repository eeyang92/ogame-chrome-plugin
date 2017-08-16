import { observable, action, toJS } from 'mobx'

// Schema
// options: {
//   activeTabId: number
// }

export default class OptionsStore {
	@observable uniqueId = 0
	@observable activeTabId = -1

	storageKey = 'options'

	@action getUniqueIdAndIncrement() {
		const id = this.uniqueId++

		const options = {
			uniqueId: this.uniqueId,
			activeTabId: this.activeTabId
		}

		chrome.storage.sync.set({ options })

		return id
	}

	@action setUniqueId(uniqueId) {
		const options = {
			uniqueId,
			activeTabId: this.activeTabId
		}

		this.uniqueId = uniqueId

		chrome.storage.sync.set({ options })
	}

	@action setActiveTabId(activeTabId) {
		const options = {
			uniqueId: this.uniqueId,
			activeTabId
		}

		this.activeTabId = activeTabId

		return new Promise((resolve) => {
			chrome.storage.sync.set({ options }, () => {
				resolve()
			})
		})
	}

	@action getFromStorage() {
		return new Promise((resolve) => {
			chrome.storage.sync.get(this.storageKey, (items) => {
				const options = items.options

				console.log('options:', options)

				let uniqueId
				let activeTabId
				let shouldSet = false
				const toSet = {}

				if (typeof options === 'undefined') {
					toSet.uniqueId = 0
					uniqueId = 0

					toSet.activeTabId = -1
					activeTabId = -1

					shouldSet = true
				} else {
					toSet.uniqueId = options.uniqueId
					toSet.activeTabId = options.activeTabId

					if (typeof options.uniqueId === 'undefined') {
						shouldSet = true
						toSet.uniqueId = 0
						// chrome.storage.sync.set({ uniqueId: 0 })

						uniqueId = 0
					} else {
						uniqueId = options.uniqueId
					}

					if (typeof options.activeTabId === 'undefined') {
						shouldSet = true
						toSet.activeTabId = -1

						// chrome.storage.sync.set({ activeTabId: -1 })

						activeTabId = -1
					} else {
						activeTabId = options.activeTabId
					}
				}

				if (shouldSet) {
					chrome.storage.sync.set({ options: toSet })
				}

				this.uniqueId = uniqueId
				this.activeTabId = activeTabId

				console.log('loadasdasda')
				console.log(this.uniqueId)
				console.log(activeTabId)

				resolve({
					uniqueId,
					activeTabId
				})
			})
		})
	}
}
