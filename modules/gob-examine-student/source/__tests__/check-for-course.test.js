import checkForCourse from '../check-for-course'

describe('checkForCourse', () => {
	it('returns true if the course is found', () => {
		const courses = [
			{department: ['ASIAN'], number: 100},
			{department: ['CSCI'], number: 121},
			{department: ['CHEM', 'BIO'], number: 111},
			{department: ['CHEM', 'BIO'], number: 112},
			{department: ['ART', 'ASIAN'], number: 121},
		]

		const query = courses[0]

		expect(checkForCourse(query, courses)).toBe(true)
	})

	it('returns false if the course is not found', () => {
		const courses = [
			{department: ['ASIAN'], number: 100},
			{department: ['CSCI'], number: 121},
			{department: ['CHEM', 'BIO'], number: 111},
			{department: ['CHEM', 'BIO'], number: 112},
			{department: ['ART', 'ASIAN'], number: 121},
		]

		const query = {department: ['MUSIC'], number: 101}

		expect(checkForCourse(query, courses)).toBe(false)
	})
})

// checks for a course in an array of courses
