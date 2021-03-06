import {
	checkForInvalidYear,
	checkForInvalidSemester,
} from '../find-course-warnings'

describe('checkForInvalidYear', () => {
	it('checks for an invalid year on a course', () => {
		expect(checkForInvalidYear({year: 1994, semester: 1}, 2012))
			.toMatchInlineSnapshot(`
Object {
  "msg": "Wrong Year (originally from 1994–95)",
  "type": "invalid-year",
  "warning": true,
}
`)
	})

	it('returns null if no semester is present', () => {
		expect(checkForInvalidYear({year: 1994}, 2012)).toBe(null)
	})

	it('returns null if the semester is "not from stolaf"', () => {
		expect(checkForInvalidYear({year: 1994, semester: 9}, 2012)).toBe(null)
	})
})

describe('checkForInvalidSemester', () => {
	it('checks for an invalid semester on a course', () => {
		expect(checkForInvalidSemester({semester: 2}, 5))
			.toMatchInlineSnapshot(`
Object {
  "msg": "Wrong Semester (originally from Interim)",
  "type": "invalid-semester",
  "warning": true,
}
`)
	})
})

xdescribe('checkForTimeConflicts', () => {})

xdescribe('findWarnings', () => {})
