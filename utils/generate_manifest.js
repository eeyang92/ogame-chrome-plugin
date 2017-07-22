const manifest = require('../src/manifest.json')
const fs = require('fs')
const path = require('path')

// generates the manifest file using the package.json informations
manifest.description = process.env.npm_package_description
manifest.version = process.env.npm_package_version

if (!fs.existsSync(path.join(__dirname, '../dist'))) {
	fs.mkdirSync(path.join(__dirname, '../dist'))
}

if (!fs.existsSync(path.join(__dirname, '../zip'))) {
	fs.mkdirSync(path.join(__dirname, '../zip'))
}

fs.writeFileSync(
	path.join(__dirname, '../dist/manifest.json'),
	JSON.stringify(manifest)
)
