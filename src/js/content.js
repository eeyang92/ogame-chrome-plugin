chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
	console.log(request)

	if (request.type === 'recallFleet') {
		const headers = new Headers({
			Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
			'Accept-Encoding': 'gzip, deflate, sdch, br',
			'Accept-Language': 'en-US,en;q=0.8',
			Connection: 'keep-alive',
			'Upgrade-Insecure-Requests': '1',
			'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_3) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.36'
		})

		fetch(request.url, {
			credentials: 'include',
			headers
		})
		.then((response) => {
			if (response.status === 200) {
				console.log('Worked!')

				return true
			}

			console.log('Failed!')
			console.log(response.statusText)

			return false
		})
		.then((status) => {
			sendResponse({
				status,
				message: request.url
			})

			return
		})
		.catch((err) => {
			console.log('err:', err)
		})
	}
})
