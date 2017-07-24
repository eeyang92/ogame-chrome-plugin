import { observable, computed, action, toJS } from 'mobx'

class BGRecallTableStore {
	@observable rows = []
	@observable uniqueId = 0

	@action setRows(rows) {
		console.log('new rows:', rows)
		chrome.storage.sync.set({
			recallTable: {
				rows
			}
		})

		this.rows = rows
	}

	@action setUniqueId(uniqueId) {
		chrome.storage.sync.set({ uniqueId })

		this.uniqueId = uniqueId
	}

	@action getFromStorage() {
		return new Promise((resolve) => {
			chrome.storage.sync.get(null, (items) => {
				let uniqueId
				let rows

				if (!items.uniqueId) {
					chrome.storage.sync.set({ uniqueId: 0 })

					uniqueId = 0
				} else {
					uniqueId = items.uniqueId
				}

				if (!items.recallTable) {
					chrome.storage.sync.set({ recallTable: {
						rows: []
					} })

					rows = []
				} else {
					rows = items.recallTable.rows
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

const bgRecallTableStore = new BGRecallTableStore()

bgRecallTableStore.getFromStorage()
.then(() => {
	chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
		if (request.type === 'getRows') {
			sendResponse({
				rows: bgRecallTableStore.rows
			})
		}

		if (request.type === 'setRows') {
			bgRecallTableStore.setRows(request.rows)

			sendResponse({
				rows: bgRecallTableStore.rows
			})
		}

		if (request.type === 'getUniqueId') {
			sendResponse({
				id: bgRecallTableStore.uniqueId
			})
		}

		if (request.type === 'setUniqueId') {
			bgRecallTableStore.setUniqueId(request.uniqueId)

			sendResponse({
				id: bgRecallTableStore.uniqueId
			})
		}
	})

	return
})
