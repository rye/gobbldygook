// @flow

import uuid from 'uuid/v4'
import {randomChar} from '@gob/lib'

import {List, Map, Record} from 'immutable'
import type {WarningType} from './find-course-warnings'
import type {
	CourseLookupFunc,
	OnlyCourseLookupFunc,
	FabricationType,
	CourseType,
	CourseError,
} from './types'
import {validateSchedule} from './validate-schedule'

type InputSchedule = {
	id?: string,
	active?: boolean,
	index?: number,
	title?: string,
	clbids?: Array<string>,
	year?: number,
	semester?: number,
	metadata?: Object,
}

type ScheduleType = {
	id: string,
	active: boolean,
	index: number,
	title: string,
	clbids: List<string>,
	year: number,
	semester: number,
	metadata: Map<string, mixed>,
}

const defaultValues: ScheduleType = {
	id: 'unknown',
	active: false,
	index: 0,
	title: 'no title',
	clbids: List(),
	year: 0,
	semester: 0,
	metadata: Map(),
}

const ScheduleRecord = Record(defaultValues)

export class Schedule extends ScheduleRecord<ScheduleType> {
	get id(): string {
		return this.get('id')
	}

	get active(): boolean {
		return this.get('active')
	}

	get index(): number {
		return this.get('index')
	}

	get title(): string {
		return this.get('title')
	}

	get year(): number {
		return this.get('year')
	}

	get semester(): number {
		return this.get('semester')
	}

	get clbids(): List<string> {
		return this.get('clbids')
	}

	getTerm(): number {
		return parseInt(`${this.year}${this.semester}`, 10)
	}

	/////
	/// Helpers
	/////

	get recommendedCredits(): number {
		let semester = this.get('semester')
		if (semester === 1 || semester === 3) {
			return 4
		}
		return 1
	}

	async getCourses(
		getCourse: CourseLookupFunc,
		fabrications?: {[key: string]: FabricationType},
		options?: {includeErrors?: boolean} = {},
	): Promise<List<CourseType | FabricationType | CourseError>> {
		let term = this.getTerm()
		let promises = this.clbids.map(clbid =>
			getCourse({clbid, term}, fabrications, options),
		)
		return Promise.all(promises).then(List)
	}

	async getOnlyCourses(
		getCourse: OnlyCourseLookupFunc,
	): Promise<List<CourseType>> {
		let term = this.getTerm()
		let promises = this.clbids.map(clbid => getCourse({clbid, term}))
		let results = await Promise.all(promises)
		// remove null results
		return List(results).filter(Boolean)
	}

	isSpecificTerm(year: number, semester: number) {
		return this.year === year && this.semester === semester
	}

	async validate(getCourse: OnlyCourseLookupFunc) {
		return validateSchedule(this, getCourse)
	}
}

export function createSchedule(sched: InputSchedule = {}) {
	let {
		id = uuid(),
		active = false,
		index = 0,
		title = `Schedule ${randomChar().toUpperCase()}`,
		clbids = [],
		year = 0,
		semester = 0,
		metadata = {},
	} = sched

	if (clbids.some(id => typeof id === 'number')) {
		clbids = clbids.map(
			id => (typeof id !== 'string' ? String(id).padStart(10, '0') : id),
		)
	}

	clbids = List(clbids)
	metadata = Map(metadata)

	let data = {id, active, index, title, clbids, metadata, year, semester}

	return new Schedule(data)
}
