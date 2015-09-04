import React, {Component, PropTypes} from 'react'
import {RouteHandler} from 'react-router'
import Immutable from 'immutable'
import DocumentTitle from 'react-document-title'

import Sidebar from './sidebar'
import Loading from '../components/loading'

import './student.scss'

export default class Student extends Component {
	static propTypes = {
		allAreas: PropTypes.instanceOf(Immutable.List).isRequired,
		routerState: PropTypes.object.isRequired,
		students: PropTypes.instanceOf(Immutable.Map).isRequired,
	}

	constructor(props) {
		super(props)
		this.state = {
			allAreas: Immutable.List(),
			baseSearchQuery: {},
			courses: Immutable.List(),
			coursesLoaded: false,
			message: `Loading Student ${props.routerState.params.id}`,
			messageClass: '',
			isSearching: false,
			student: null,
		}
	}

	componentWillMount() {
		this.componentWillReceiveProps(this.props)
	}

	componentWillReceiveProps(nextProps) {
		// console.log(nextProps)
		const queryId = this.props.routerState.params.id
		const student = nextProps.students.get(queryId)

		if (student) {
			// console.info('student\'s student: ', student.toJS())
			window.stu = student
			this.setState({student})
			student.courses.then(courses => this.setState({
				courses: Immutable.List(courses),
				coursesLoaded: true,
			}))

			const customAreas = student.studies
				.filter(study => study.isCustom)
				.map(study => study.data)
				.toArray()

			Promise.all(customAreas).then(customAreas => {
				this.setState({
					allAreas: nextProps.allAreas.concat(customAreas),
				})
			})
		}
		else {
			this.setState({
				message: `Could not find student "${queryId}"`,
				messageClass: 'error',
			})
		}
	}

	toggleSearchSidebar = () => {
		this.setState({
			isSearching: !this.state.isSearching,
			baseSearchQuery: {},
		})
	}

	showSearchSidebar = ({schedule}) => {
		this.setState({
			isSearching: true,
			baseSearchQuery: {
				semester: [schedule.semester],
				year: [schedule.year],
			},
		})
	}

	render() {
		// console.info('Student#render')

		if (!this.state.student) {
			return <Loading className={this.state.messageClass}>{this.state.message}</Loading>
		}

		return (
			<DocumentTitle title={`${this.state.student.name} | Gobbldygook`}>
				<div className='student'>
					<Sidebar
						allAreas={this.state.allAreas}
						baseSearchQuery={this.state.baseSearchQuery}
						courses={this.state.courses}
						coursesLoaded={this.state.coursesLoaded}
						isSearching={this.state.isSearching}
						toggleSearchSidebar={this.toggleSearchSidebar}
						student={this.state.student}
					/>
					<RouteHandler
						className='content'
						allAreas={this.state.allAreas}
						student={this.state.student}
						courses={this.state.courses}
						coursesLoaded={this.state.coursesLoaded}
						showSearchSidebar={this.showSearchSidebar}
					/>
				</div>
			</DocumentTitle>
		)
	}
}
