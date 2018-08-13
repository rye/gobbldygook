// @flow
import React from 'react'

import uniqueId from 'lodash/uniqueId'

export function LabelledSelect(props: {
	onChange: (ev: SyntheticInputEvent<HTMLSelectElement>) => void,
	value: string,
	label: string,
	options: Array<string>,
	className: string,
}) {
	let {className, onChange, value, label, options} = props
	let id = `labelled-select-${uniqueId()}`

	return (
		<span className={className}>
			<label htmlFor={id}>{label}</label>

			<select id={id} value={value} onChange={onChange}>
				{options.map(opt => (
					<option key={opt} value={opt}>
						{opt}
					</option>
				))}
			</select>
		</span>
	)
}