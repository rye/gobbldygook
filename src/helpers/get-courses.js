import db from './db'
import map from 'lodash/map'
import find from 'lodash/find'

const courseCache = new Map()
/**
 * Gets a course from the database.
 *
 * @param {Number} clbid - a class/lab ID
 * @param {Number} term - a course term
 * @param {Array} fabricationsList - an array of fabrications
 * @returns {Promise} - TreoDatabasePromise
 * @fulfill {Object} - the course object, potentially with an embedded error message.
 */
export async function getCourse({clbid, term}, fabricationsList) {
	let fabricationP = find(fabricationsList, {clbid})
	if (fabricationP) {
		return fabricationP
	}

	if (courseCache.has(clbid)) {
		return await courseCache.get(clbid)
	}

	let promise = db.store('courses')
		.index('clbid')
		.get(clbid)
		.then(course => course || {clbid, term, error: `Could not find ${clbid}`})
		.catch(error => ({clbid, term, error: error.message}))

	courseCache.set(clbid, promise)

	let course = await courseCache.get(clbid)

	courseCache.delete(clbid)

	return course
}
// export default function getCourse({clbid, term}) {
// 	return db.store('courses')
// 		.index('clbid')
// 		.get(clbid)
// 		.then(course => course || {clbid, term, error: `Could not find ${clbid}`})
// 		.catch(error => ({clbid, term, error: error.message}))
// }


/**
 * Takes a list of clbids, and returns a list of the course objects for those
 * clbids.
 *
 * @param {Number[]} clbids - a list of class/lab IDs
 * @param {Course[]} fabrications - a list of fabrications
 * @returns {Promise} - a promise for the course data
 * @fulfill {Object[]} - the courses.
 */
export default function getCourses(clbids, fabrications) {
	return Promise.all(map(clbids, c => getCourse(c, fabrications)))
}
