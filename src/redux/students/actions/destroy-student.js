import {removeStudentFromCache} from '../../../helpers/save-student'

import {
	DESTROY_STUDENT,
} from '../constants'

export default async function destroyStudent(studentId) {
	removeStudentFromCache(studentId)
	localStorage.removeItem(studentId)

	return { type: DESTROY_STUDENT, payload: {studentId} }
}
