import React, { PropTypes, cloneElement } from 'react'
import {Provider} from 'react-redux'
import Notifications from './notifications'

const Root = props => (
	<Provider store={props.store}>
		<div id="app-wrapper">
			{cloneElement(props.children)}
			<Notifications />
		</div>
	</Provider>
)

Root.propTypes = {
	children: PropTypes.node,
	store: PropTypes.object.isRequired,
}

export default Root
