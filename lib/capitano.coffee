_ = require('lodash')
Command = require('./command')
Option = require('./option')
Signature = require('./signature')

exports.parse = require('./parse').parse
exports.state = require('./state')
exports.defaults = require('./settings')

exports.command = (options) ->
	options.options = _.map options.options, (option) ->

		# Necessary to prevent modifying the signature
		# of the original object, and causing issues
		# if the same object is used in another command
		result = _.clone(option)

		result.signature = new Signature(option.signature)
		return new Option(result)

	options.signature = new Signature(options.signature)
	command = new Command(options)
	exports.state.commands.push(command)

exports.globalOption = (options) ->
	options.signature = new Signature(options.signature)
	option = new Option(options)
	exports.state.globalOptions.push(option)

exports.execute = (args) ->
	command = exports.state.getMatchCommand(args.command)

	if not command?
		return exports.defaults.actions.commandNotFound(args.command)

	try
		command.execute(args)
	catch error
		return exports.defaults.actions.onError(error)

# Handy shortcut
exports.run = _.compose(exports.execute, exports.parse)
