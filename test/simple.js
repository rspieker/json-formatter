'use strict';

var Code = require('code'),
	Lab = require('lab'),
	JSONFormatter = require('../json-formatter'),
	lab = exports.lab = Lab.script();

lab.experiment('Simple parsing', function() {

	var tests = {
		//  BASIC TYPES
		'Basic Type': {
			//  input : output
			'hello': 'hello',
			'Infinity': 'Infinity',
			'Math.PI': 'Math.PI',
			'3.1415': 3.1415,
			'1234': 1234,
			'-123': -123,
			'-1.2': -1.2,
			'1.23': 1.23
		},

		//  OBJECTS
		'Object': {
			//  input : output
			'hello:world'  : {hello: 'world'},
			'{hello:world}': {hello: 'world'},
			'null'         : null,

			'this:false,is:true,null:null,sub:{whaz:up},ok:end': {'this':false,is:true,'null':null,sub:{whaz:'up'},ok:'end'}
		},

		//  ARRAYS
		'Array': {
			//  input : output
			'1,2,"a"'  : [1,2,'a'],
			'[1,2,"a"]': [1,2,'a']
		},

		//  RELAX ABOUT EXCESSIVE TOKENS
		'Excess Whitespace': {
			//  input : output
			'hello   ' : 'hello',
			'   hello' : 'hello',
			'  3.1415' : 3.1415,
			'1234    ' : 1234,
			'    -123' : -123,
			'  -1.2  ' : -1.2,
			'  1.23  ' : 1.23
		},

		'Dangling Comma': {
			'  hello  ,'   : ['hello'],
			'  hello ,,'   : ['hello'],
			'  hello, ,'   : ['hello'],
			'hello:world,' : {hello: 'world'}
		},

		'Quoted Input': {
			'"hello\\""': 'hello"',
			'hello"': 'hello',
			'"hello': 'hello',
			'"hello\\"world"': 'hello"world',
			'"hello\\\'world"': 'hello\'world'
		}

	};

	Object.keys(tests)
		.forEach(function(group) {
			lab.experiment(group, function() {
				Object.keys(tests[group])
					.forEach(function(input) {
						lab.test(input, function(done) {
							// console.log('>' + input + '<>' + JSONFormatter().prepare(input) + '<');
							Code.expect(JSONFormatter().parse(input)).to.deep.equal(tests[group][input]);

							done();
						});
					});
				;
			});
		});
	;

});
