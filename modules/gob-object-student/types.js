// @flow

import type {Course as CourseType, Result} from '@gob/types'

export type {CourseType}

import {List} from 'immutable'

export type AreaQuery = {
	type: string,
	name: string,
	revision: string,
}

export type OverrideType = mixed

export type FulfillmentType = {||}

export type CourseLookupFunc = (
	{clbid: string, term?: ?number},
	?(Array<FabricationType> | List<FabricationType>),
) => Promise<CourseType | FabricationType | CourseError>

export type OnlyCourseLookupFunc = ({
	clbid: string,
	term: number,
}) => Promise<?CourseType>
