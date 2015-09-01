import React, {Component, PropTypes, findDOMNode} from 'react'
import cx from 'classnames'

import groupBy from 'lodash/collection/groupBy'
import includes from 'lodash/collection/includes'
import uniq from 'lodash/array/uniq'
import flatten from 'lodash/array/flatten'
import map from 'lodash/collection/map'
import pairs from 'lodash/object/pairs'
import sortBy from 'lodash/collection/sortBy'
import sortByAll from 'lodash/collection/sortByAll'
import present from 'present'
import toPrettyTerm from '../helpers/to-pretty-term'
import {oxford} from 'humanize-plus'
import buildDept from '../helpers/build-dept'
import semesterName from '../helpers/semester-name'
import expandYear from '../helpers/expand-year'
import queryCourseDatabase from '../lib/query-course-database'
import padLeft from 'lodash/string/padLeft'
import size from 'lodash/collection/size'

import Button from '../components/button'
import Course from '../components/course'
import Icon from '../components/icon'
import Loading from '../components/loading'

import Student from '../models/student'
import stickyfill from '../lib/init-stickyfill'

import './course-searcher.scss'

const SORT_BY = {
	'Year': 'Year',
	'Title': 'Title',
	'Department': 'Department',
	'Day of Week': 'Day of Week',
	'Time of Day': 'Time of Day',
}

const GROUP_BY = {
	'Day of Week': 'Day of Week',
	'Department': 'Department',
	'GenEd': 'GenEd',
	'Semester': 'Semester',
	'Term': 'Term',
	'Time of Day': 'Time of Day',
	'Year': 'Year',
	'None': 'None',
}

const REVERSE_ORDER = ['Year', 'Term', 'Semester']

function split24HourTime(time) {
	time = padLeft(String(time), 4, '0')
	return {
		hour: parseInt(time.slice(0, 2)),
		minute: parseInt(time.slice(2, 4)),
	}
}

function to12Hour(time) {
	const {hour, minute} = split24HourTime(time)
	const paddedMinute = padLeft(minute, 2, '0')

	const fullHour = ((hour + 11) % 12 + 1)
	const meridian = hour < 12 ? 'am' : 'pm'

	return `${fullHour}:${paddedMinute}${meridian}`
}

const DAY_OF_WEEK = course => course.offerings
	? map(course.offerings, offer => offer.day).join('/')
	: 'No Days Listed'

const TIME_OF_DAY = course => course.offerings
	? oxford(sortBy(uniq(flatten(map(course.offerings, offer => map(offer.times, time => `${to12Hour(time.start)}-${to12Hour(time.end)}`))))))
	: 'No Times Listed'

const DEPARTMENT =  course => course.depts ? buildDept(course) : 'No Department'

const GEREQ = course => course.gereqs ? oxford(course.gereqs) : 'No GEs'

const GROUP_BY_TO_KEY = {
	'Day of Week': DAY_OF_WEEK,
	'Department': DEPARTMENT,
	'GenEd': GEREQ,
	'Semester': 'semester',
	'Term': 'term',
	'Time of Day': TIME_OF_DAY,
	'Year': 'year',
	'None': false,
}

const GROUP_BY_TO_TITLE = {
	'Day of Week': days => days,
	'Department': depts => depts,
	'GenEd': gereqs => gereqs,
	'Semester': sem => semesterName(sem),
	'Term': term => toPrettyTerm(term),
	'Time of Day': times => times,
	'Year': year => expandYear(year),
	'None': () => '',
}

const SORT_BY_TO_KEY = {
	'Year': 'year',
	'Title': 'title',
	'Department': course => course.depts ? buildDept(course) : 'No Department',
	'Day of Week': DAY_OF_WEEK,
	'Time of Day': TIME_OF_DAY,
}

export default class CourseSearcher extends Component {
	static propTypes = {
		baseSearchQuery: PropTypes.object,
		isHidden: PropTypes.bool,
		student: PropTypes.instanceOf(Student).isRequired,
		toggle: PropTypes.func.isRequired,
	}

	constructor() {
		super()
		this.state = {
			isQuerying: false,
			hasQueried: false,
			results: [],
			queryString: '',
			lastQuery: '',
			queryInProgress: false,
			sortBy: SORT_BY['Year'],
			groupBy: GROUP_BY['Term'],
		}
	}

	componentDidMount() {
		stickyfill.add(findDOMNode(this))
		findDOMNode(this.refs.searchbox).focus()
	}

	componentWillUnmount() {
		stickyfill.remove(findDOMNode(this))
	}

	onSubmit = () => {
		if (this.state.queryString !== this.state.lastQuery || size(this.props.baseSearchQuery)) {
			if (process.env.NODE_ENV === 'production') {
				window.ga('send', 'event', 'search_query', 'submit', this.state.queryString, 1)
			}
			this.query(this.state.queryString)
		}
	}

	onChange = evt => {
		this.setState({queryString: evt.target.value})
	}

	onKeyDown = evt => {
		if (evt.keyCode === 13) {
			this.onSubmit()
		}
	}

	query = searchQuery => {
		if ((searchQuery.length === 0 && !size(this.props.baseSearchQuery)) || this.state.queryInProgress) {
			return
		}

		this.setState({results: [], hasQueried: false})
		const startQueryTime = present()

		queryCourseDatabase(searchQuery, this.props.baseSearchQuery)
			.then(results => {
				console.info(`query took ${(present() - startQueryTime)}ms.`)
				console.log('results', results)

				// Run an intial sort on the results.
				const sortedByIdentifier = sortByAll(results, ['year', 'deptnum', 'semester', 'section'])

				this.setState({
					results: sortedByIdentifier,
					hasQueried: true,
					queryInProgress: false,
				})
			})
			.catch(err => console.error(err))

		this.setState({queryInProgress: true, lastQuery: searchQuery})
	}

	render() {
		// console.log('SearchButton#render')
		const showNoResults = this.state.results.length === 0 && this.state.hasQueried
		const showIndicator = this.state.queryInProgress

		let contents = <li className='no-results course-group'>No Results Found</li>

		if (showIndicator) {
			contents = <li className='loading course-group'><Loading>Searching…</Loading></li>
		}

		else if (!showNoResults) {
			const sorted = sortBy(this.state.results, SORT_BY_TO_KEY[this.state.sortBy])

			// Group them by term, then turn the object into an array of pairs.
			const groupedAndPaired = pairs(groupBy(sorted, GROUP_BY_TO_KEY[this.state.groupBy]))

			// Sort the result arrays by the first element, the term, because
			// object keys don't have an implicit sort.
			const searchResults = sortBy(groupedAndPaired, group => group[0])

			if (includes(REVERSE_ORDER, this.state.groupBy)) {
				// Also reverse it, so the most recent is at the top.
				searchResults.reverse()
			}

			contents = map(searchResults, ([groupTitle, courses]) =>
				<li key={groupTitle} className='course-group'>
					{GROUP_BY_TO_TITLE[this.state.groupBy](groupTitle) && <p className='course-group-title'>{GROUP_BY_TO_TITLE[this.state.groupBy](groupTitle)}</p>}
					<ul className='course-list'>
						{map(courses, (course, index) =>
							<li key={index}><Course info={course} student={this.props.student} /></li>)}
					</ul>
				</li>
			)
		}

		let placeholderExtension = ''
		if (size(this.props.baseSearchQuery)) {
			placeholderExtension = ` in ${semesterName(this.props.baseSearchQuery.semester)} ${expandYear(this.props.baseSearchQuery.year, true, '–')}`
		}

		return (
			<div className={cx('search-sidebar', this.props.isHidden && 'is-hidden')}>
				<header className='sidebar-heading'>
					<div className='row'>
						<input type='search' className='search-box'
							placeholder={'Search Courses' + placeholderExtension}
							defaultValue={this.state.query}
							onChange={this.onChange}
							onKeyDown={this.onKeyDown}
							autoFocus={true}
							ref='searchbox'
						/>
						<Button
							className='close-sidebar'
							title='Close Sidebar'
							type='flat'
							onClick={this.props.toggle}>
							<Icon name='ionicon-close' />
						</Button>
					</div>
					{this.state.hasQueried &&
					<div className='row search-filters'>
						<span className='filter'>
							<label htmlFor='sort'>Sort by:</label><br/>
							<select id='sort' value={this.state.sortBy} onChange={ev => this.setState({sortBy: ev.target.value})}>
								{map(SORT_BY, opt => <option key={opt} value={opt}>{opt}</option>)}
							</select>
						</span>
						<span className='filter'>
							<label htmlFor='group'>Group by:</label><br/>
							<select id='group' value={this.state.groupBy} onChange={ev => this.setState({groupBy: ev.target.value})}>
								{map(GROUP_BY, opt => <option key={opt} value={opt}>{opt}</option>)}
							</select>
						</span>
					</div>}
				</header>

				<ul className='term-list'>
					{contents}
				</ul>
			</div>
		)
	}
}
