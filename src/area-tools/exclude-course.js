import reject from 'lodash/collection/reject'
import compareCourseToCourse from './compare-course-to-course'

/**
 * Removes a course from a list of courses
 * @private
 * @param {Course} query - the course to remove
 * @param {Course[]} courses - the list to look through
 * @returns {Course[]} - the filtered list of courses
 */
export default function findCourse(query, courses) {
	return reject(courses, course => compareCourseToCourse(query, course))
}