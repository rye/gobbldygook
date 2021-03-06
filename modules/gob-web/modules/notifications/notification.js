// @flow
import React from 'react'
import round from 'lodash/round'
import {FlatButton} from '../../components/button'
import BasicProgressBar from '../../components/progress-bar'
import styled from 'styled-components'
import {type Notification as NotificationType} from './types'

type Props = {
	onClose: () => any,
	notification: NotificationType,
}

let ProgressContainer = styled.div`
	display: flex;
	flex-flow: row nowrap;
	align-items: center;
`

let ProgressBar = styled(BasicProgressBar)`
	flex: 1;
	height: 10px;
	overflow: hidden;
	border: solid 1px var(--gray-300);
	background-color: transparent;
	color: var(--gray-300);
`

let Percentage = styled.output`
	color: var(--gray-300);
	margin-left: 0.5em;
	font-variant-numeric: lining-nums tabular-nums;
`

let Message = styled.h1`
	font-weight: 500;
	font-size: 1em;
	margin: 0;
`

let Content = styled.div`
	flex: 1;
`

let CloseButton = styled(FlatButton)`
	margin-left: 0.9em;
	padding: 2px 6px 1px;

	&:hover {
		background-color: var(--white);
		color: var(--black);
	}
`

const Capsule = styled.li`
	position: relative;

	display: flex;
	flex-flow: row nowrap;
	align-items: center;

	background: var(--black);
	color: var(--gray-300);

	font-size: 0.9em;

	min-height: 46px;
	min-width: 288px;
	max-width: 350px;

	padding: 0.9em;

	box-shadow: 0 2px 6px var(--gray-700);
	border-radius: 2px;

	& + & {
		margin-top: 1em;
	}
`

const ErrorCapsule = styled(Capsule)`
	background: var(--red);
	color: var(--white);

	${CloseButton}:hover {
		border-color: var(--red-900);
		color: var(--red-900);
	}
`

export default function Notification(props: Props) {
	const {notification, onClose} = props
	const {type, value, hideButton, max, message} = notification

	const progressBar = type === 'progress' && (
		<ProgressContainer>
			<ProgressBar value={value} max={max} />
			<Percentage>{round((value / max) * 100, 0)}%</Percentage>
		</ProgressContainer>
	)

	let CapsuleEl = type === 'error' ? ErrorCapsule : Capsule

	return (
		<CapsuleEl onClick={onClose}>
			<Content>
				<Message>{message}</Message>
				{progressBar}
			</Content>
			{!hideButton && (
				<CloseButton type="flat" title="Close">
					×
				</CloseButton>
			)}
		</CapsuleEl>
	)
}
