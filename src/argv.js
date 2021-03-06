function getArgv() {
    return require('yargs')
        .option('i', {
            alias: 'input',
            describe: 'The input file to read from. If omitted, then stdin is used.',
            type: 'string'
        })
        .option('o', {
            alias: 'output',
            describe: 'The output file to write to. If omitted, then stdout is used.',
            type: 'string'
        })
        .option('p', {
            alias: 'pretty',
            describe: 'Pretty-print the result.',
            type: 'boolean'
        })
        .option('s', {
            alias: 'silent',
            describe: 'Ignore interpretation errors and fatal errors.',
            type: 'boolean'
        })
        .options('t', {
            alias: 'type',
            describe: 'Path to a module that can register custom types. Can be specified multiple types.',
            type: 'string'
        })
        .help()
        .argv;
}

module.exports = getArgv;
