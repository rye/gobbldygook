'use strict';

import * as _ from 'lodash'

import hasDepartment from '../app/helpers/hasDepartment.es6'
import {partialNameOrTitle} from '../app/helpers/partialTitle.es6'
import {checkCoursesFor} from '../app/helpers/courses.es6'

function foundationCourses(courses) {
	/* Foundation courses:
		- one of Computer Science 121 or 125;
		- Computer Science 241, 251, and 252;
		- one of Computer Science 231 or Math 232 or Math 252.
	*/

	var requirements = [
		{title: 'STAT 110', result: checkCoursesFor(courses, {dept:'STAT 110'})},
		{title: 'STAT 212', result: checkCoursesFor(courses, {dept:'STAT 212'})},
		{title: 'STAT 214', result: checkCoursesFor(courses, {dept:'STAT 214'})},
		{title: 'STAT 263', result: checkCoursesFor(courses, {dept:'STAT 263'})},
	]

	return {
		title: 'Foundation',
		description: 'These are recommended courses for the concentration.',
		result: true,
		type: 'array/some',
		details: {
			from: requirements,
			has: _.chain(requirements).pluck('result').compact().size().value(),
			needs: 'any number',
		},
	}
}

function coreCourses(courses) {
	/* The Two (2) Core Courses:
		- Statistics 272: Statistical Modeling
		- Statistics 316: Advanced Statistical Modeling
	*/

	var statisticalModeling = checkCoursesFor(courses, {dept:'STAT 272'})
	var advancedModeling = checkCoursesFor(courses, {dept:'STAT 316'})

	let requirements = [
		{
			title: 'Statistical Modeling',
			result: statisticalModeling,
		},
		{
			title: 'Advanced Modeling',
			result: advancedModeling,
		},
	]

	return {
		title: 'Core',
		type: 'array/boolean',
		description: 'Statistics 272: Statistical Modeling, and Statistics 316: Advanced Statistical Modeling',
		result: _.all(requirements, 'result'),
		details: requirements,
	}
}

function electiveCourses(courses) {
	// Electives: Two approved electives.

	var validElectives = [
		{title: 'CSCI 125', result: checkCoursesFor(courses, {dept:'CSCI 125'})},
		{title: 'ECON 385', result: checkCoursesFor(courses, {dept:'ECON 385'})},
		{title: 'MATH 262', result: checkCoursesFor(courses, {dept:'MATH 262'})},
		{title: 'PSYCH 230', result: checkCoursesFor(courses, {dept:'PSYCH 230'})},
		{title: 'SOAN 371', result: checkCoursesFor(courses, {dept:'SOAN 371'})},
		{title: 'STAT 270', result: checkCoursesFor(courses, {dept:'STAT 270'})},
		{title: 'STAT 282', result: checkCoursesFor(courses, {dept:'STAT 282'})},
		{title: 'STAT 322', result: checkCoursesFor(courses, {dept:'STAT 322'})},
	]

	var numberTaken = _.chain(validElectives)
		.pluck('result').compact().size().value()
	var numberNeeded = 2

	return {
		title: 'Electives',
		type: 'array/some',
		description: 'Two electives.',
		result: numberTaken >= numberNeeded,
		details: {
			needs: numberNeeded,
			has: numberTaken,
			from: validElectives,
		}
	}
}

function checkStatisticsConcentration(student) {
	var statisticsConcentrationRequirements = [
		foundationCourses(student.courses),
		coreCourses(student.courses),
		electiveCourses(student.courses),
	]

	return {
		result: _.all(statisticsConcentrationRequirements, 'result'),
		details: statisticsConcentrationRequirements,
	}
}

export default checkStatisticsConcentration
