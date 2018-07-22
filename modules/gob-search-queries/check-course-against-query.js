// @flow

import toPairs from 'lodash/toPairs'

const isTrue = x => x === true

const SUBSTRING_KEYS = new Set([
	'title',
	'name',
	'description',
	'notes',
	'instructors',
	'times',
	'locations',
])

type Query = {[key: string]: mixed}
type Course = {[key: string]: mixed}

function checkQueryBit(course: Course, [key: string, values: Array<mixed>]) {
	if (!course.hasOwnProperty(key)) {
		return false
	}

	let substringMatch = SUBSTRING_KEYS.has(key)

	// values is either:
	// - a 1-long array
	// - an $AND, $OR, $NOT, $NOR, or $XOR query
	// - one of the above, but substringMatch

	let hasBool = typeof values[0] === 'string' && values[0].startsWith('$')
	let OR = values[0] === '$OR'
	let NOR = values[0] === '$NOR'
	let AND = values[0] === '$AND'
	let NOT = values[0] === '$NOT'
	let XOR = values[0] === '$XOR'

	if (hasBool) {
		// remove the first value from the array by returning all but the first element
		values = values.slice(1)
	}

	let courseValue = course[key]

	let internalMatches = values.map(val => {
		// dept, gereqs, etc.
		if (Array.isArray(courseValue)) {
			if (substringMatch) {
				val = val.toLowerCase()
				return courseValue.some(
					item =>
						typeof item === 'string' &&
						item.toLowerCase().includes(val),
				)
			} else {
				return courseValue.includes(val)
			}
		}

		if (substringMatch && typeof courseValue === 'string') {
			val = val.toLowerCase()
			return courseValue.toLowerCase().includes(val)
		} else {
			return courseValue === val
		}
	})

	if (!hasBool) {
		return internalMatches.every(isTrue)
	}

	let result = false

	if (OR) result = internalMatches.some(isTrue)
	if (NOR) result = !internalMatches.some(isTrue)
	if (AND) result = internalMatches.every(isTrue)
	if (NOT) result = !internalMatches.every(isTrue)
	if (XOR) result = internalMatches.filter(isTrue).length === 1

	return result
}

// Checks if a course passes a query check.
// query: Object | the query object that comes out of buildQueryFromString
// course: Course | the course to check
// returns: Boolean | did all query bits pass the check?
export function checkCourseAgainstQuery(query: Query, course: Course): boolean {
	return toPairs(query).every(pair => checkQueryBit(course, pair))
}
