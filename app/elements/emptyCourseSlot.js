import React from 'react'
import FakeCourse from './fakeCourse'

let EmptyCourseSlot = React.createClass({
	render() {
		return React.createElement(FakeCourse, {title: 'Empty Slot', className: 'empty'})
	}
})

export default EmptyCourseSlot
