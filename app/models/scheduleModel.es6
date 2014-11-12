'use strict';

import * as _ from 'lodash'
import emitter from '../helpers/emitter'

import uuid from '../helpers/uuid'
import randomChar from '../helpers/randomChar'
import {checkScheduleTimeConflicts} from '../helpers/time'
import {getCourse} from '../helpers/courses'

let Schedule = (scheduleData) => {
	let schedule = {
		id: uuid(), active: false,
		year: 0, semester: 0, index: 1,
		title: 'Schedule ' + randomChar().toUpperCase(),
		clbids: [],
	}

	Object.defineProperty(schedule, 'courses', { get() {
		return _.map(this.clbids, (id) => getCourse(id))
	}})

	Object.defineProperty(schedule, 'move', { value(year, semester) {
		if (year)      this.year = year
		if (semester)  this.semester = semester
		emitter.emit('change')
	}})
	Object.defineProperty(schedule, 'reorder', { value(newIndex) {
		this.index = newIndex
		emitter.emit('change')
	}})
	Object.defineProperty(schedule, 'rename', { value(newTitle) {
		this.title = newTitle
		emitter.emit('change')
	}})

	Object.defineProperty(schedule, 'reorderCourse', { value(clbid, newIndex) {
		let oldIndex = _.findIndex(this.clbids, (id) => id === clbid)
		this.clbids.splice(oldIndex, 1)
		this.clbids.splice(newIndex, 0, clbid)
		emitter.emit('change')
	}})
	Object.defineProperty(schedule, 'addCourse', { value(clbid, index) {
		index = index || this.clbids.length - 1
		this.clbids.splice(index, 0, clbid)
		emitter.emit('change')
	}})
	Object.defineProperty(schedule, 'removeCourse', { value(clbid) {
		console.log('removing course', clbid)
		let index = _.findIndex(this.clbids, (id) => id === clbid)
		this.clbids.splice(index, 1)
		emitter.emit('change')
	}})

	Object.defineProperty(schedule, 'validate', { value() {
		// Checks to see if the schedule is valid

		// Step one: do any times conflict?
		var courses = this.courses
		var conflicts = checkScheduleTimeConflicts(courses)

		var hasConflict = _(conflicts)
			.flatten()      // flatten the nested arrays
			.any()          // and see if any of the resulting values are true

		if (hasConflict.length) {
			console.log('schedule conflicts', conflicts, hasConflict)
		}

		return {
			hasConflict: hasConflict,
			conflicts: conflicts
		}
	}})

	Object.defineProperty(schedule, 'isValid', { get() {
		return !this.validate().hasConflict
	}})
	Object.defineProperty(schedule, 'conflicts', { get() {
		return this.validate().conflicts
	}})

	Object.defineProperty(schedule, 'status', { get() {
		return this.validate()
	}})

	schedule.id = scheduleData.id || schedule.id
	schedule.active = scheduleData.active || schedule.active
	schedule.year = scheduleData.year || schedule.year
	schedule.semester = scheduleData.semester || schedule.semester
	schedule.index = scheduleData.index || schedule.index
	schedule.title = scheduleData.title || schedule.title
	schedule.clbids = scheduleData.clbids || schedule.clbids

	return schedule
}

export default Schedule
