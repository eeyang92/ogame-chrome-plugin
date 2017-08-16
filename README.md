# OGame Chrome Plugin

- Currently supports recall URLs
- Fleet Dispatch

## Installation

1. Download and extract zip file
2. Go to Extensions in Chrome (chrome://extensions/)
	- Check the "Developer Mode" checkbox
	- Click "Load Unpacked extension"
	- Find the extracted directory and select the "dist" folder
3. You should see the Popup icon ("O") appear on the top-right of your browser

## How to Use

### Recall

1. Login OGame (or refresh the page if you are already logged in and running the extension for the first time)
2. Open the Popup and click "Set OGame Tab" to let the extension know this is the tab that contains OGame
	- Warning: You will need to leave Chrome and this tab open in order for the extension to work
	- You don't need to keep the tab focused, you can browse in other tabs
3. If you wish to recall a fleet, go to your "Fleet Movement" screen and right click the "Recall" button, and then "Copy Link Address". This will give you the request URL that you can paste into the URL field on the Popup
4. Select a time
	- (from now) Hour:Minute:Second
	- (at time) Hour:Minute:Second (Note: 24 hour format)
5. Click Set
	- The request will only fire is Set is active. You can unset at anytime.
6. The Set Button will turn green if the request successfully fires

### Fleet Dispatch

1. Make sure OGame Tab is set
2. Select the desired planet
3. Enter Fleet information
	- Make sure fleet information is valid (i.e. you have the correct number of ships), there is no built in validation (yet)
4. Press "Send Fleet"
5. Make sure only one fleet is sent at a time
