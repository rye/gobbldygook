import React, {Component, PropTypes} from 'react'
import cx from 'classnames'

export default class List extends Component {
    static propTypes = {
        canSelect: PropTypes.bool,
        children: PropTypes.any.isRequired,
        className: PropTypes.string,
        onChange: PropTypes.func,
        seperator: PropTypes.string,
        type: PropTypes.oneOf(['inline', 'number', 'bullet', 'plain']).isRequired,
    }

    static defaultProps = {
        type: 'inline',
    }

    render() {
        const Wrapper = this.props.type === 'number' ? React.DOM.ol : React.DOM.ul

        return (
            <Wrapper className={cx('list', `list--${this.props.type}`, this.props.className)}>
                {React.Children.map(this.props.children, contents =>
                    <li className='list-item'>{contents}</li>)}
            </Wrapper>
        )
    }
}
