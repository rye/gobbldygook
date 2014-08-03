'use strict';

var _ = require('lodash')
var React = require('react')
var mori = require('mori')
var humanize = require('humanize-plus')

var AreaOfStudy = require('./areaOfStudy')
var StudentSummary = require('./studentSummary')

var getCourses = require('../helpers/getCourses').getCourses

var GraduationStatus = React.createClass({
	findActiveCourses: function() {
		var clbids = _.chain(mori.clj_to_js(mori.get(this.props.student, 'schedules')))
			.filter('active')
			.pluck('clbids')
			.flatten()
			.uniq()
			.value()

		console.log('GraduationStatus\'s schedules', mori.clj_to_js(mori.get(this.props.student, 'schedules')))
		console.log('GraduationStatus\'s clbids', clbids)

		getCourses(clbids).bind(this).then(function(courses) {
			console.log('retrieved ' + courses.length + ' courses for graduation-status')
			this.setState({
				courses: courses
			})
		})
	},
	getInitialState: function() {
		return {
			courses: []
		}
	},
	componentWillReceiveProps: function() {
		this.findActiveCourses()
	},
	componentDidMount: function() {
		this.findActiveCourses()
	},
	render: function() {
		var student = _.merge(mori.clj_to_js(this.props.student), {courses: this.state.courses})
		console.info('graduation-status render', student)

		// Get areas of study
		var areasOfStudy = _.groupBy(student.studies, 'type')
		var areasOfStudyElements = _.mapValues(areasOfStudy, function(areas) {
			return _.map(areas, function(area) {
				var areaObject = _.merge(student, area)
				areaObject.key = area.id
				return AreaOfStudy(areaObject)
			}, this)
		}, this)

		var sections = _.map(_.keys(areasOfStudy), function(areaType) {
			var pluralType = humanize.pluralize(2, areaType)
			return React.DOM.section({id: pluralType, key: areaType},
				React.DOM.header({className: 'area-type-heading'},
					React.DOM.h1(null, humanize.capitalize(pluralType)),
					React.DOM.button({
						className: 'add-area-of-study',
						title: 'Add ' + humanize.capitalize(areaType)
					})
				),
				areasOfStudyElements[areaType]
			)
		})

		return React.DOM.section({className: 'graduation-status'},
			StudentSummary(student),
			sections
		)
	}
});

module.exports = GraduationStatus
