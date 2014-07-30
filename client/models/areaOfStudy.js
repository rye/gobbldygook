var _ = require('lodash');
var React = require('react');

var RequirementSet = require('./requirementSet');

var getRandomInt = require('../helpers/getRandomInt')

var areas = {
	major: {
		'Computer Science': require('../../mockups/demo_csci_major'),
		'Asian Studies': require('../../mockups/demo_asian_major')
	},
	degree: {
		'Bachelor of Arts': require('../../mockups/demo_ba'),
		'Bachelor of Music': require('../../mockups/demo_bm')
	},
	concentration: {
		'Computer Science': require('../../mockups/demo_csci_major'),
		'Asian Studies': require('../../mockups/demo_asian_major')
	}
}

var AreaOfStudy = React.createClass({
	load: function() {
		var type = this.props.type
		var title = this.props.title

		var area = areas[type][title]

		if (typeof area === 'function') {
			area(this.props).bind(this)
				.then(function(results) {
					console.log('calculated ' + this.props.abbr + ' graduation possibility', results)
					this.setState({
						result: results
					})
				})
		} else {
			this.setState({
				result: {
					result: false,
					details: [{
						title: this.props.type + ' not found!',
						description: 'This ' + this.props.type + 'could not be found.',
						result: false
					}]
				}
			})
		}
	},
	getInitialState: function() {
		return {
			result: {}
		}
	},
	componentWillReceiveProps: function() {
		this.load()
	},
	componentDidMount: function() {
		this.load()
	},
	render: function() {
		// console.log('area-of-study render')

		// var requirementSets = _.map(areaDetails.sets, function(reqset) {
		// 	return RequirementSet({
		// 		key: reqset.description,
		// 		name: reqset.description,
		// 		needs: reqset.needs,
		// 		count: reqset.count,
		// 		requirements: reqset.reqs,
		// 		courses: this.props.courses
		// 	});
		// }, this);

		return React.DOM.article({id: this.props.id, className: 'area-of-study'},
			React.DOM.details(null,
				React.DOM.summary(null,
					React.DOM.h1(null, this.props.title),
					React.DOM.progress({value: this.state.result.result, max: 1})
				),
				// requirementSets
				this.state.result
			)
		);
	}
});

module.exports = AreaOfStudy
