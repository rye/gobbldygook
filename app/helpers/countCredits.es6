'use strict';

import * as _ from 'lodash'
import add from './add'

var countCredits = function(courses) {
	return _(courses).pluck('credits').reduce(add)
}

export default countCredits
