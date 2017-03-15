'use strict';
var _ = require('lodash');
var yeoman = require('yeoman-generator');
var chalk = require('chalk');
var yosay = require('yosay');

/*
* Retrieves the component key from the given path.
* extracts everything after the last /components
*
* ex: blah/components/test/asdf => test/asdf
*     blah/components/components/asdfasdf/asdfasdf => asdfasdf/asdfasdf
*
* if the string does not match the regex, will return null
*
*/
const getComponentKey = path => {
  // regex explanation:
  //            components\/ : matching all with components/
  //            (?!components\/): does not allow matches already with components/ : ex: /components/components/asdf only matches /components/asdf
  //            .* : matches everything after that
  //            g : only matches once
  const regex = /components\/((?!components\/).*)/g;

  const componentKey = regex.exec(path);

  return componentKey && componentKey[1];
}

const currentFolder = process.cwd().split('/').pop();

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
      default: currentFolder, // Default to current folder name
    }, {
      type: 'confirm',
      name: 'compose',
      message: 'Would you like to add a composer to it?',
      default: true,
    }, {
      type: 'confirm',
      name: 'style',
      message: 'Would you like to add styling to it?',
      default: true,
    }, {
      when: response => response.style,
      type: 'confirm',
      name: 'elements',
      message: 'Would you like to separate styled components into an elements file?',
      default: true,
    }, {
      type: 'confirm',
      name: 'redux',
      message: 'Would you like to add Redux to it?',
      default: true,
    }];

    return this.prompt(prompts).then(function (props) {
      props.camelName = _.chain(props.name).camelCase().upperFirst().value();
      props.startName = _.chain(props.name).startCase().upperFirst().value();
      props.componentKey = (currentFolder === props.name) ? props.name : `${getComponentKey(this.destinationRoot())}/${props.name}` || props.name;

      this.props = props;
    }.bind(this));
  },

  paths: function () {
    if (this.props.name !== currentFolder) {
      this.destinationRoot(_.trim(this.props.name));
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

    if (this.props.style && this.props.elements) {
      this.fs.copyTpl(
        this.templatePath('elements.ejs'),
        this.destinationPath('elements.js'),
        this.props
      );
    }

    if(this.props.redux) {
      this.fs.copyTpl(
        this.templatePath('actionCreators.ejs'),
        this.destinationPath('actionCreators.js'),
        this.props
      );

      this.fs.copyTpl(
        this.templatePath('actions.ejs'),
        this.destinationPath('actions.js'),
        this.props
      );

      this.fs.copyTpl(
        this.templatePath('constants.ejs'),
        this.destinationPath('constants.js'),
        this.props
      );

      this.fs.copyTpl(
        this.templatePath('reducer.ejs'),
        this.destinationPath('reducer.js'),
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
