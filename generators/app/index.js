'use strict';
var _ = require('lodash');
var yeoman = require('yeoman-generator');
var chalk = require('chalk');
var yosay = require('yosay');

module.exports = yeoman.Base.extend({
  prompting: function () {
    // Have Yeoman greet the user.
    this.log(yosay(
      'Welcome to the hunky-dory ' + chalk.red('Qatomic') + ' generator!'
    ));

    var prompts = [{
      type: 'input',
      name: 'name',
      message: 'The component name',
      default: this.appname // Default to current folder name
    }, {
      type: 'confirm',
      name: 'compose',
      message: 'Would you like to add a composer to it?',
      default: true
    }, {
      type: 'confirm',
      name: 'style',
      message: 'Would you like to add styling to it?',
      default: true
    }];

    return this.prompt(prompts).then(function (props) {
      props.camelName = _.upperFirst(_.camelCase(props.name));
      props.startName = _.upperFirst(_.startCase(props.name));

      this.props = props;
    }.bind(this));
  },

  paths: function () {
    if (this.props.name !== this.appname) {
      this.destinationRoot(this.props.name);
    }
  },

  writing: function () {
    if (this.props.compose) {
      this.fs.copyTpl(
        this.templatePath('composer.ejs'),
        this.destinationPath('composer.js'),
        this.props
      );

      this.fs.copyTpl(
        this.templatePath('composer.stub.ejs'),
        this.destinationPath('composer.stub.js'),
        this.props
      );

      this.fs.copyTpl(
        this.templatePath('container.ejs'),
        this.destinationPath('container.js'),
        this.props
      );
    }

    if (this.props.style) {
      this.fs.copyTpl(
        this.templatePath('elements.ejs'),
        this.destinationPath('elements.js'),
        this.props
      );
    }

    this.fs.copyTpl(
      this.templatePath('.stories.ejs'),
      this.destinationPath('.stories.js'),
      this.props
    );

    this.fs.copyTpl(
      this.templatePath('cases.spec.ejs'),
      this.destinationPath('cases.spec.js'),
      this.props
    );

    this.fs.copyTpl(
      this.templatePath('component.ejs'),
      this.destinationPath('component.js'),
      this.props
    );

    this.fs.copyTpl(
      this.templatePath('index.ejs'),
      this.destinationPath('index.js'),
      this.props
    );
  }
});
