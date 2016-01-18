import forEach from 'lodash/collection/forEach'
import range from 'lodash/utility/range'

import Student, {addScheduleToStudent} from '../../../models/student'
import Schedule from '../../../models/schedule'

import {
	INIT_STUDENT,
} from '../constants'

export default function initStudent() {
	let student = new Student()

	forEach(range(student.matriculation, student.graduation), year => {
		student = addScheduleToStudent(student, Schedule({year, index: 1, active: true, semester: 1}))
		student = addScheduleToStudent(student, Schedule({year, index: 1, active: true, semester: 2}))
		student = addScheduleToStudent(student, Schedule({year, index: 1, active: true, semester: 3}))
	})

	return { type: INIT_STUDENT, payload: student }
}
