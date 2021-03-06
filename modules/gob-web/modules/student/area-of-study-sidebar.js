// @flow

import React from 'react'
import {List, Map} from 'immutable'
import {AreaOfStudyGroup} from './area-of-study-group'
import {FlatButton} from '../../components/button'
import {
	sortStudiesByType,
	areaTypeConstants,
	Student,
} from '@gob/object-student'

import './area-of-study-sidebar.scss'

type Props = {
	student: Student,
}

type State = {
	showAreaPickerFor: Map<string, boolean>,
}

export class AreaOfStudySidebar extends React.PureComponent<Props, State> {
	state = {
		showAreaPickerFor: Map(),
	}

	showAreaPicker = (type: string) => {
		this.setState(state => ({
			showAreaPickerFor: state.showAreaPickerFor.set(type, true),
		}))
	}

	hideAreaPicker = (type: string) => {
		this.setState(state => ({
			showAreaPickerFor: state.showAreaPickerFor.set(type, false),
		}))
	}

	render() {
		let props = this.props
		let {student} = props
		let {showAreaPickerFor} = this.state

		let sortedStudies = List(sortStudiesByType([...student.studies]))

		// group the studies by their type
		let groupedStudies = sortedStudies.groupBy(study =>
			study.type.toLowerCase(),
		)

		let allAreaTypes = Map(areaTypeConstants).toList()
		let usedAreaTypes = new Set(student.studies.map(s => s.type))

		let unusedTypes = allAreaTypes.filter(
			type =>
				!usedAreaTypes.has(type) && !showAreaPickerFor.get(type, false),
		)

		let unusedTypesToShow = showAreaPickerFor.filter(
			(toShow, type) => toShow && !usedAreaTypes.has(type),
		)

		/////

		let activeAreas = groupedStudies.map((areas, areaType) => (
			<AreaOfStudyGroup
				key={areaType}
				areas={areas}
				onEndAddArea={this.hideAreaPicker}
				onInitiateAddArea={this.showAreaPicker}
				showAreaPicker={showAreaPickerFor.get(areaType, false)}
				student={student}
				type={areaType}
			/>
		))

		let openedAreas = unusedTypesToShow.map((shouldShow, type) => (
			<AreaOfStudyGroup
				key={type}
				onEndAddArea={this.hideAreaPicker}
				onInitiateAddArea={this.showAreaPicker}
				showAreaPicker={shouldShow || false}
				student={student}
				type={type}
			/>
		))

		return (
			<>
				{[...activeAreas.values()]}
				{[...openedAreas.values()]}
				{unusedTypes.size && (
					<section className="unused-areas">
						<span className="unused-areas--title">Add: </span>
						<span className="unused-areas--container">
							{unusedTypes
								.map(type => (
									<FlatButton
										key={type}
										className="unused-areas--button"
										onClick={() =>
											this.showAreaPicker(type)
										}
									>
										{type}
									</FlatButton>
								))
								.toArray()}
						</span>
					</section>
				)}
			</>
		)
	}
}
