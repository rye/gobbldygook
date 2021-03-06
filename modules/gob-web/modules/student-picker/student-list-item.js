// @flow

import React from 'react'
import {Link} from '@reach/router'
import groupBy from 'lodash/groupBy'
import map from 'lodash/map'
import {sortStudiesByType} from '@gob/object-student'
import styled from 'styled-components'
import {FlatButton} from '../../components/button'
import {Icon} from '../../components/icon'
import {iosTrashOutline, iosArrowForward} from '../../icons/ionicons'
import * as theme from '../../theme'
import {type IndividualStudentState} from '../../redux/students/reducers'

const Container = styled.div`
	display: flex;
	flex-flow: row nowrap;
	align-items: stretch;

	& + & {
		border-top: 1px solid rgba(160, 160, 160, 0.2);
	}
`

const DeleteButton = styled(FlatButton)`
	flex-direction: column;
	padding: 0.5em 1em;
	font-size: 0.9em;
	border: 0;
	border-radius: 0;

	& .icon {
		font-size: 2em;
		margin-bottom: 0.125em;
	}

	&:hover {
		color: white;
		border-color: var(--red-900);
		background-color: var(--red-500);
	}
`

const GoIcon = styled(Icon)`
	margin-left: 1em;
	margin-right: 0.5em;
	flex-shrink: 0;
`

const StudentName = styled.div`
	line-height: 1.5;
	white-space: nowrap;
	overflow: hidden;
	text-overflow: ellipsis;
`

const StudentAreas = styled.div`
	font-size: 0.8em;
`

const AreaGrouping = styled.span`
	& + &::before {
		content: ' | ';
	}
`

const AreaName = styled.span`
	& + &::before {
		content: ' • ';
	}
`

const StudentInfo = styled.span`
	flex: 1;
	margin-left: 0.5em;
	max-width: 90%;
`

const ListItemLink = styled(Link)`
	${theme.linkUndecorated};
	background-color: white;
	&.is-selected {
		background-color: var(--blue-50);
	}

	flex: 1;
	display: flex;
	align-items: center;
	width: 100%;

	padding: 0.75em 0.5em;
	position: relative;

	transition: 0.15s;

	cursor: pointer;

	&:hover,
	&:focus {
		outline: none;
		background-color: var(--blue-50);
		border-color: var(--blue);
	}
`

type Props = {
	destroyStudent: string => any,
	isEditing: boolean,
	student: IndividualStudentState,
	as?: string,
}

export default function StudentListItem(props: Props) {
	const {student, isEditing, destroyStudent, as} = props

	const sortedStudies = sortStudiesByType([...student.present.studies])
	const groupedStudies = groupBy(sortedStudies, s => s.type)

	const areas = map(groupedStudies, (group, type) => (
		<AreaGrouping key={type}>
			{group.map(s => (
				<AreaName key={s.name}>{s.name}</AreaName>
			))}
		</AreaGrouping>
	))

	return (
		<Container as={as}>
			{isEditing && (
				<DeleteButton
					onClick={() => destroyStudent(student.present.id)}
				>
					<Icon large>{iosTrashOutline}</Icon>
					Delete
				</DeleteButton>
			)}

			<ListItemLink to={`/student/${student.present.id}/`}>
				<StudentInfo>
					<StudentName>
						{student.present.name}
						{process.env.NODE_ENV !== 'production'
							? ` (${student.present.id})`
							: ''}
					</StudentName>
					<StudentAreas>{areas}</StudentAreas>
				</StudentInfo>

				<GoIcon>{iosArrowForward}</GoIcon>
			</ListItemLink>
		</Container>
	)
}
