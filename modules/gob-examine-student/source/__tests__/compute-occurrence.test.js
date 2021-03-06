import {computeOccurrence} from '../compute-chunk'

describe('computeOccurrence', () => {
	it('computes the number of times a course has been taken vs. a minimum count', () => {
		const expr = {
			$type: 'occurrence',
			$count: {$operator: '$gte', $num: 2},
			$course: {$type: 'course', department: ['THEAT'], number: 222},
		}

		const courses = [
			{department: ['THEAT'], number: 222},
			{department: ['THEAT'], number: 222},
		]

		const {computedResult, matches, counted} = computeOccurrence({
			expr,
			courses,
		})

		expect(computedResult).toBe(true)
		expect(matches).toEqual([
			{department: ['THEAT'], number: 222},
			{department: ['THEAT'], number: 222},
		])
		expect(counted).toBe(2)
	})

	it('ignores anything besides department and number via simplifyCourse', () => {
		const expr = {
			$type: 'occurrence',
			$count: {$operator: '$gte', $num: 2},
			$course: {$type: 'course', department: ['THEAT'], number: 222},
		}

		const courses = [
			{department: ['THEAT'], number: 222, year: 2014, semester: 1},
			{department: ['THEAT'], number: 222, year: 2014, semester: 3},
		]

		const {computedResult, matches, counted} = computeOccurrence({
			expr,
			courses,
		})
		expect(computedResult).toBe(true)
		expect(matches).toEqual([
			{department: ['THEAT'], number: 222, year: 2014, semester: 1},
			{department: ['THEAT'], number: 222, year: 2014, semester: 3},
		])
		expect(counted).toBe(2)
	})
})
