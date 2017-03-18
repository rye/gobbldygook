// @flow

import { css } from 'styled-components'

export const contentBlockSpacing = css`
    padding-top: ${props => props.theme.pageEdgePadding};
    padding-bottom: 15vh;
    overflow-y: scroll;
`

export const materialShadow = `
    border: 1px solid;
    border-color: #e5e6e9 #dfe0e4 #d0d1d5;
`

export const card = css`
    ${materialShadow}
    background-color: white;
    border-radius: ${props => props.theme.baseBorderRadius};
`

export const cardContent = `
    padding: 1em;
`

export const cardActions = css`
    border-top: ${props => props.theme.materialDivider};
    padding: 1em;
`

export const headingNeutral = `
    font-size: inherit;
    font-weight: inherit;
    margin-top: 0;
    margin-bottom: 0;
`

export const linkUndecorated = `
    text-decoration: none;
    color: inherit;
`

export const listInline = `
    display: inline-block;
    list-style: none;
    margin-top: 0;
    margin-bottom: 0;
    padding-left: 0;

    & > li {
        display: inline-block;
    }
`

export const listUnstyled = `
    margin: 0;
    padding: 0;
    list-style: none;
`

export const noSelect = `
    user-select: none;
    cursor: default;
`
