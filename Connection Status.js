/**
 * 
 * @package             Connection Status - Scriptable app script
 * @author				Gregorio Nuti
 * @installing			Paste this code into a new iOS Scriptable script and edit 'Editable global declarations' if needed
 * 
 */

// Editable global declarations
const api = 'nordvpn' // can be 'nordvpn' or 'ipinfo'
const colorMode = 'light' // can be 'light' or 'dark'

// Global declarations
const widget = new ListWidget()
const indexData = await fetchConnectionData(api)

// Summon the widget
await createWidget(colorMode)

// Debug
if (!config.runsInWidget) {
	await widget.presentSmall()
}

// Widget settings
widget.setPadding(10, 10, 10, 10)
widget.url = getURL(api)

// Script actions
Script.setWidget(widget)
Script.complete()

// Build the content of the widget
async function createWidget(colorMode) {
	
	// Row 0
	let row0 = widget.addStack()
	row0.layoutHorizontally()
	let label = row0.addText('Connection status')
	label.textColor = new Color(textColor(colorMode))
	label.font = Font.lightRoundedSystemFont(14)
	widget.addSpacer(20)
	
	// Row 1 - IP
	let row1 = widget.addStack()
	row1.layoutHorizontally()
	let ipLabel = row1.addText('IP: ')
	let ip = row1.addText(indexData.ip)
	ipLabel.textColor = new Color(textColor(colorMode))
	ip.textColor = new Color(textColor(colorMode))
	ipLabel.font = Font.lightRoundedSystemFont(14)
	ip.font = Font.mediumRoundedSystemFont(14)
	widget.addSpacer(10)
	
	// Row 2 - Country
	let row2 = widget.addStack()
	row2.layoutHorizontally()
	let countryLabel = row2.addText('Country: ')
	let country = row2.addText(indexData.country)
	countryLabel.textColor = new Color(textColor(colorMode))
	country.textColor = new Color(textColor(colorMode))
	countryLabel.font = Font.lightRoundedSystemFont(14)
	country.font = Font.mediumRoundedSystemFont(14)
	widget.addSpacer(10)
	
	// Row 3 - VPN
	let row3 = widget.addStack()
	row3.layoutHorizontally()
	let vpnLabel = row3.addText('VPN: ')
	if (indexData.status == true) {
		let vpn = row3.addText('yes')
		vpn.textColor = new Color(textColor(colorMode))
		vpn.font = Font.mediumRoundedSystemFont(14)
	} else {
		let vpn = row3.addText('no')
		vpn.textColor = new Color(textColor(colorMode))
		vpn.font = Font.mediumRoundedSystemFont(14)
	}
	vpnLabel.textColor = new Color(textColor(colorMode))
	vpnLabel.font = Font.lightRoundedSystemFont(14)
	
	// Widget background color
	if (indexData.status == true) {
		widget.backgroundColor = new Color(backgroundColorVPN(colorMode))
	} else {
		widget.backgroundColor = new Color(backgroundColor(colorMode))
	}

}

// Colors management
function textColor(colorMode) {
	if (colorMode == 'dark') {
		return 'f2f2f2';
	} else if (colorMode == 'light') {
		return '191919';
	}
}
function backgroundColor(colorMode) {
	if (colorMode == 'dark') {
		return '842029';
	} else if (colorMode == 'light') {
		return 'f1aeb5';
	}
}
function backgroundColorVPN(colorMode) {
	if (colorMode == 'dark') {
		return '0f5132';
	} else if (colorMode == 'light') {
		return 'a3cfbb';
	}
}

// APIs
function getURL(api) {
	if (api == 'nordvpn') {
		return 'https://nordvpn.com/wp-admin/admin-ajax.php?action=get_user_info_data'
	} else if (api == 'ipinfo') {
		return 'https://ipinfo.io/json'
	}
}

// Connection data
async function fetchConnectionData(api) {
	const url = getURL(api)
	const req = new Request(url)
	const apiResult = await req.loadJSON()
	let ip = apiResult.ip
	let country = apiResult.country
	let status = apiResult.status
	let data = new Object();
	data['ip'] = ip;
	data['country'] = country;
	if (status) {
		data['status'] = status;
	} else {
		data['status'] = false;
	}
	return data
}

// end of script