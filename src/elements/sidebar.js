import React, {Component, PropTypes} from 'react'
import {Link} from 'react-router'
import Immutable from 'immutable'

import UndoButton from './undoButton'
import RedoButton from './redoButton'

import SearchButton from './searchButton'
import GraduationStatus from './graduationStatus'

import studentActions from '../flux/studentActions'

export default class Sidebar extends Component {
	static propTypes = {
		student: PropTypes.instanceOf(Immutable.Record).isRequired,
	}

	constructor() {
		super()
		this.state = {
			isSearching: false,
		}
	}

	toggleSearch = () => {
		this.setState({isSearching: !this.state.isSearching})
	}

	render() {
		// console.log('Sidebar#render')

		return (<aside className='sidebar'>
			<menu className='student-buttons'>
				<Link to='/' className='back sidebar-btn'>Students</Link>
				<button className='search sidebar-btn' onClick={this.toggleSearch}>Search</button>
				<Link className='sidebar-btn' to='download' params={{id: this.props.student.id}}>Download</Link>
				<button className='sidebar-btn'
					onClick={() => studentActions.resetStudentToDemo(this.props.student.id)}>
					Revert to Demo
				</button>
				<UndoButton className='sidebar-btn' />
				<RedoButton className='sidebar-btn' />
			</menu>

			<GraduationStatus
				isHidden={this.state.isSearching}
				student={this.props.student} />

			<SearchButton
				isHidden={!this.state.isSearching}
				toggle={this.toggleSearch} />
		</aside>)
	}
}
