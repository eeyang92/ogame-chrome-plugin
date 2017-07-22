// chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
// 	console.log(request)

// 	if (request.type === 'recallFleet') {
// 		fetch(request.url)
// 		.then((response) => {
// 			console.log(response)

// 			return response.json()
// 		})
// 		.then((json) => {
// 			console.log(json)

// 			return json
// 		})
// 		.catch((err) => {
// 			console.log('err:', err)
// 		})
// 	}

// 	sendResponse({
// 		message: 'Sup'
// 	})
// })
