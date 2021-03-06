// @flow
import isEqualWith from 'lodash/isEqualWith'
import type {Course} from './types'

const baseKeys = new Set([
	'department',
	'international',
	'level',
	'number',
	'section',
	'semester',
	'type',
	'year',
])

/**
 * Used as a customizer for `isEqualWith`; checks if the left-side is a wildcard,
 * and returns as appropriate. `isEqualWith` falls back to the default comparison
 * if the customizer returns `undefined`, so we take advantage of that here.
 *
 * @private
 * @param {any} lhs - left-hand side of the comparison. rhs doesn't matter.
 * @returns {boolean} - if lhs was a wildcard
 */
function wildcard(lhs) {
	if (lhs === '*') {
		return true
	}
}

/**
 * Compares two courses.
 * @private
 * @param {Course} query - the course to compare
 * @param {Course} other - the course to compare against
 * @returns {boolean} - if the course matched
 */
export default function compareCourseToCourse(
	query: Course,
	other: Course,
): boolean {
	// If the query is more specific than the one being compared to, and
	// things don't match, return false.
	// But, if the query is *less* specific than the other course, only check
	// the props that are in the query.

	// The master list of the keys we care about is in `baseKeys`, so we grab
	// the keys that overlap between `baseKeys` and the list of keys in the
	// query object.

	// this should accomplish the same effect as
	// `intersection(keys(query), baseKeys)`,
	// but it benchmarks quite a bit faster.
	const keysToCheck = Object.keys(query).filter(key => baseKeys.has(key))

	// We only check the specified keys.
	// If any of them are not equal, we return false.
	return keysToCheck.every(key =>
		isEqualWith(query[key], other[key], wildcard),
	)
}
