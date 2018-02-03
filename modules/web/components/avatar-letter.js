// @flow
import React from 'react'
import isString from 'lodash/isString'
import styled, {css} from 'styled-components'

const Wrapper = styled.div`
    font-family: Fira Sans, Helvetica Neue, Helvetica, Arial, sans-serif !important;
    font-weight: 200;
    font-style: normal;

    text-align: center;
    text-transform: uppercase;

    display: inline-block;

    margin: 0;
    padding: 0;

    ${({size = 48}) => css`
        width: ${size}px;
        height: ${size}px;
        line-height: ${size}px;
        font-size: ${size / 3 * 2}px;

        border-radius: ${size}px;
    `}
`

type Props = {
    className?: string,
    value: string,
}

export const AvatarLetter = ({className, value = '', }: Props) => (
    <Wrapper className={className}>
        {isString(value) ? value[0] : ''}
    </Wrapper>
)
