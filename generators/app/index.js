'use strict';
const Generator = require('yeoman-generator');
const chalk = require('chalk');
const yosay = require('yosay');

module.exports = class extends Generator {
    initializing() {
        this.composeWith(require.resolve('../boilerplate'));
    }

    prompting() {
        // Have Yeoman greet the user.
        this.log(yosay(
            'Welcome to the best ' + chalk.red('generator-hapi-middleman') + ' generator!'
        ));

        const prompts = [{
            type: 'checkbox',
            name: 'plugins',
            message: 'Which integrations would you like to enable',
            choices: ["PayPal-Intacct"],
        },
        {
            type: 'checkbox',
            name: 'paypalIntacct',
            message: 'What PayPal-Intacct functionality would you like to enable',
            choices: ["Invoicing"],
            when: (answers) => {
                return answers.plugins.indexOf("PayPal-Intacct") !== -1;
            }
        },
        {
            type: 'confirm',
            name: 'dotenv',
            message: 'Create .env file?',
            default: false,
        }];

        return this.prompt(prompts).then(props => {
            this.props = props;
        });
    }

    writing() {
        this.fs.copyTpl(
            this.templatePath("base/"),
            this.destinationPath(),
            this.props,
            null,
            { globOptions: { dot: true } }
        );

        if (this.props.plugins.indexOf("PayPal-Intacct") !== -1 && this.props.paypalIntacct.indexOf("Invoicing") !== -1) {
            this.fs.copy(
                this.templatePath("plugins/paypal-intacct-invoicing.ts"),
                this.destinationPath("src/plugins/paypal-intacct-invoicing.ts")
            );
        }

        if (this.props.dotenv) {
            this.fs.copyTpl(
                this.templatePath(".env"),
                this.destinationPath(".env"),
                this.props,
                null,
                { globOptions: { dot: true } }
            );
        }
    }

    install() {
        this.installDependencies({
            bower: false,
            npm: false,
            yarn: true
        });
        if (this.props.plugins.indexOf("PayPal-Intacct") !== -1) {
            this.yarnInstall(["hapi-middleman-paypal-intacct"], { 'save': true });
        }
    }
};
