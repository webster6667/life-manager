export default function (
    /** @type {import('plop').NodePlopAPI} */
    plop
) {

    plop.setGenerator('ui-kit-instance-component', {
        description: 'Clear ui-kit instance component',
        prompts: [
            {
                type: 'input',
                name: 'name',
                message: 'Component name'
            },
            {
                type: 'rawlist',
                name: 'mode',
                message: 'Component mode',
                choices: [
                    'primary',
                    'secondary',
                ]
            },
            {
                type: 'input',
                name: 'instanceName',
                message: 'Component instanceName'
            },
        ],
        actions: [
            {
                type: 'addMany',
                destination: "../src/shared/ui/{{kebabCase name}}/{{mode}}/instances/{{instanceName}}",
                base: `templates/component-instance/`,
                templateFiles: 'templates/component-instance/*',
            },
        ]
    });


    plop.setGenerator('ui-kit-component', {
        description: 'Clear ui-kit component',
        prompts: [
            {
                type: 'input',
                name: 'name',
                message: 'Component name'
            },
            {
                type: 'rawlist',
                name: 'mode',
                message: 'Component mode',
                choices: [
                    'primary',
                    'secondary',
                ]
            },
        ],
        actions: [
            {
                type: 'addMany',
                destination: "../src/shared/ui/{{kebabCase name}}/{{mode}}",
                base: `templates/component/`,
                templateFiles: 'templates/component/*',
            },
        ]
    });

    plop.setGenerator('Hook', {
        description: 'Hook template',
        prompts: [
            {
                type: 'input',
                name: 'name',
                message: 'Hook name'
            },
            {
                type: 'input',
                name: 'path',
                message: 'Hook path',
                default: 'src/hook'
            },
        ],
        actions: [
            {
                type: 'addMany',
                destination: "../{{path}}/{{kebabCase name}}",
                base: `templates/hook/`,
                templateFiles: 'templates/hook/*',
            },
        ]
    });

    plop.setGenerator('Util', {
        description: 'Util template',
        prompts: [
            {
                type: 'input',
                name: 'name',
                message: 'Util name'
            },
            {
                type: 'input',
                name: 'path',
                message: 'Util path',
                default: 'src/util'
            }
        ],
        actions: [
            {
                type: 'addMany',
                destination: "../{{path}}/{{kebabCase name}}",
                base: `templates/util/`,
                templateFiles: 'templates/util/*',
            },
        ]
    });

};