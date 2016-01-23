import React, {PropTypes} from 'react'

import Button from '../../../components/button'
import Icon from '../../../components/icon'
import Toolbar from '../../../components/toolbar'
import Modal from '../../../components/modal'
import List from '../../../components/list'

import encodeStudent from '../../../helpers/encode-student'

export default function ShareSheet(props) {
	const { student } = props
	// const boundCloseModal = () => closeModal(context.location, context.router)
	const boundCloseModal = () => {}

	const encoded = encodeStudent(student)

	return <Modal
		modalClassName='course course--modal'
		onClose={boundCloseModal}
	>
		<Toolbar className='window-tools'>
			<Button className='close-modal' onClick={boundCloseModal}>
				<Icon name='close' />
			</Button>
		</Toolbar>

		<div>
			Share "{student.name}" via:
			<List type='bullet'>
				<li>Google Drive</li>
				<li>Email File</li>
				<li>Download File</li>
			</List>
		</div>

		<div>
			<Button disabled={!encoded}>
				<a
					download={`${student.name}.gb-student.json`}
					href={`data:text/json;charset=utf-8,${encoded}`}>
					Download {student.name}
				</a>
			</Button>
		</div>
	</Modal>
}

ShareSheet.propTypes = {
	student: PropTypes.object.isRequired,
}