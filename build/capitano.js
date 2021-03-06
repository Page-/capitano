var Command, Option, Signature, _;

_ = require('lodash');

Command = require('./command');

Option = require('./option');

Signature = require('./signature');

exports.parse = require('./parse').parse;

exports.state = require('./state');

exports.defaults = require('./settings');

exports.command = function(options) {
  var command;
  options.options = _.map(options.options, function(option) {
    var result;
    result = _.clone(option);
    result.signature = new Signature(option.signature);
    return new Option(result);
  });
  options.signature = new Signature(options.signature);
  command = new Command(options);
  return exports.state.commands.push(command);
};

exports.globalOption = function(options) {
  var option;
  options.signature = new Signature(options.signature);
  option = new Option(options);
  return exports.state.globalOptions.push(option);
};

exports.execute = function(args) {
  var command, error;
  command = exports.state.getMatchCommand(args.command);
  if (command == null) {
    return exports.defaults.actions.commandNotFound(args.command);
  }
  try {
    return command.execute(args);
  } catch (_error) {
    error = _error;
    return exports.defaults.actions.onError(error);
  }
};

exports.run = _.compose(exports.execute, exports.parse);
