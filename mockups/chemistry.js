'use strict';

let _ = require('lodash')
let Promise = require('bluebird')

let hasDepartment = require('../app/helpers/hasDepartment')
let partialNameOrTitle = require('../app/helpers/partialTitle').partialNameOrTitle
let coursesAtLevel = require('../app/helpers/courseLevels').coursesAtLevel
let coursesAtOrAboveLevel = require('../app/helpers/courseLevels').coursesAtOrAboveLevel
let checkCoursesForDeptNum = require('../app/helpers/getCourses').checkCoursesForDeptNum

let utilities = require('./commonMajorUtilities')

const chemDeptRequiredCourses = [
	{deptnum: 'CHEM 121'}, {deptnum: 'CHEM 123'}, {deptnum: 'CHEM 126'},

	{deptnum: 'ASIAN 397'}, {deptnum: 'ASIAN 399'},
]

var isRequiredAsianStudiesCourse = _.curry(utilities.isRequiredCourse(chemDeptRequiredCourses))

function introductorySequence(courses) {
	// Complete one of the introductory sequences (Chemistry
	// 121/123/126, Chemistry 125/126, or CH/BI 125/126/227).

	let sequences = [
		['CHEM 121', 'CHEM 123', 'CHEM 126'],
		['CHEM 125', 'CHEM 126'],
		['CH/BI 125', 'CH/BI 126', 'CH/BI 227'],
	]

	return Promise.all([
	]).then(function(details) {
		return {
			title: 'Introductory Sequence',
			type: 'object/number',
			description: 'Complete one of the introductory sequences: Chemistry 121/123/126, Chemistry 125/126, or CH/BI 125/126/227',
			result: (matching >= needs) && electivesAreGood,
			details: {
				has: matching,
				needs: needs,
				matches: asianStudiesElectives
			}
		}
	})
}

function required(courses) {
	// Additional required courses include 247, 248, 255, 371

	return Promise.all([
	]).then(function(details) {
		return {
			title: 'Required',
			type: 'object/number',
			description: 'Additional required courses include 247, 248, 255, 371',
			result: (matching >= needs) && electivesAreGood,
			details: {
				has: matching,
				needs: needs,
				matches: asianStudiesElectives
			}
		}
	})
}

function laboratory(courses) {
	// laboratory courses 253, 254, 256, 357

	return Promise.all([
	]).then(function(details) {
		return {
			title: 'Laboratory',
			type: 'object/number',
			description: 'laboratory courses 253, 254, 256, 357',
			result: (matching >= needs) && electivesAreGood,
			details: {
				has: matching,
				needs: needs,
				matches: asianStudiesElectives
			}
		}
	})
}

function electives(courses) {
	// and at least one additional course from 252, 260, 298, 379, 380, 382, 384, 386, 388, 391 or 398.

	return Promise.all([
	]).then(function(details) {
		return {
			title: 'Electives',
			type: 'object/number',
			description: 'at least one additional course from 252, 260, 298, 379, 380, 382, 384, 386, 388, 391 or 398',
			result: (matching >= needs) && electivesAreGood,
			details: {
				has: matching,
				needs: needs,
				matches: chemistryElectives
			}
		}
	})
}

function beyondChemistry(courses) {
	// In addition, students majoring in chemistry must take physics through
	// 125 or 232; mathematics through 126 or 128; and attend a total of 12
	// Chemistry Department seminars during their junior and senior years.

	let physics = []
	let mathematics = []

	return Promise.all([
		physics,
		mathematics
	]).then(function(details) {
		return {
			title: 'Beyond Chemistry',
			type: 'array',
			description: 'In addition, students majoring in chemistry must take physics through 125 or 232; mathematics through 126 or 128; and attend a total of 12 Chemistry Department seminars during their junior and senior years.',
			result: (matching >= needs) && electivesAreGood,
			details: {
				has: matching,
				needs: needs,
				matches: asianStudiesElectives
			}
		}
	})
}

function checkChemistryMajor(student) {
	var chemistryMajorRequirements = Promise.all([
		introductorySequence(student.courses),
		required(student.courses),
		laboratory(student.courses),
		electives(student.courses),
		beyondChemistry(student.courses),
	]).then(function(results) {
		// console.log('checkChemistryMajor results', results)
		return results
	})

	return Promise.props({
		result: chemistryMajorRequirements.then(function(results) {
			return _.all(results, 'result')
		}),
		details: chemistryMajorRequirements
	})
}

module.exports = checkChemistryMajor
