'use strict'

const nomnom = require('nomnom')
const yaml = require('js-yaml')
const stringify = require('json-stable-stringify')
const fs = require('graceful-fs')
const sha1 = require('sha1')
const path = require('path')
const findAreas = require('./lib/find-areas')

process.on('unhandledRejection', function(reason, p) {
	console.error('Unhandled rejection in', p)
	console.error('Reason:', reason)
})

module.exports.processAreasDir = processAreasDir
function processAreasDir(dir) {
	const output = {
		files: [],
		type: 'areas',
	}

	for (let filename of findAreas(dir)) {
		const file = fs.readFileSync(filename, {encoding: 'utf-8'})
		const hash = sha1(file)
		const data = yaml.safeLoad(file)

		output.files.push({
			hash: hash,
			path: filename.replace('build/', '').replace('areas/', ''),
			type: data.type.toLowerCase(),
			revision: data.revision,
		})
	}

	return stringify(output, {space: '\t'}) + '\n'
}

module.exports.cli = cli
function cli() {
	const args = nomnom
		.script('area-package-maker')
		.option('dir', {position: 0, required: true, help: 'The directory to process'})
		.option('save', {flag: true, help: 'Save the info file to `dir/info.json`'})
		.parse()

	const inDir = args.dir

	const data = processAreasDir(inDir)
	if (args.save) {
		fs.writeFileSync(path.join(inDir, 'info.json'), data, {encoding: 'utf-8'})
	}
	else {
		console.log(data)
	}
}
