import React, {Component, PropTypes} from 'react'
import cx from 'classnames'

import './icon.scss'

export default class Icon extends Component {
	static propTypes = {
		className: PropTypes.string,
		name: PropTypes.string.isRequired,
		style: PropTypes.object,
		type: PropTypes.oneOf(['block', 'inline']).isRequired,
	}

	static defaultProps = {
		type: 'inline',
	}

	render() {
		return (
			<svg
				className={cx('icon', `icon--${this.props.type}`, this.props.className)}
				style={this.props.style}
			>
				<use xlinkHref={`./ionicons.svg#${this.props.name}`} />
			</svg>
		)
	}
}
