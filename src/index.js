#!/usr/bin/env node

const path = require('path');

const downson = require('downson');
const { readFile, writeFile } = require('fs');

const PRETTY_INDENTATION = 4;
const DEFAULT_ENCODING = 'utf8';

const exitCodes = {
    success: 0,
    interpretationErrors: 1,
    fatalError: 2
};

if (require.main == module) {
    const argv = require('./argv')();
    
    downsonCli(argv);
} else {
    module.exports = downsonCli;
}

function downsonCli(argv) {
    const inputPromise = argv.input ? readFromFile(argv.input) : readFromStdin();

    const downsonOptions = {
        silent: argv.silent
    };

    process.exitCode = 0;

    const types = (function () {
        if (!argv.type) {
            return [];
        } else if (!Array.isArray(argv.type)) {
            return [argv.type]
        } else {
            return argv.type;
        }
    })();

    types
        .map(t => path.resolve(process.cwd(), t))
        .map(require)
        .forEach(func => func(downson.registerType.bind(downson)));

    inputPromise
        .then(data => downson(data, downsonOptions))
        .then(formatFailures)
        .then(result => {
            if (result.hasInterpretationErrors && !argv.silent) {
                process.exitCode = exitCodes.interpretationErrors;
            }

            return result;
        })
        .then(formatData.bind(null, argv.pretty))
        .then(writeData.bind(null, argv.output))
        .catch(err => {
            e.message += '\nPlease report this to https://github.com/battila7/downson-js-cli.';

            console.error(err);

            process.exitCode = exitCodes.fatalError;
        });
}

function readFromFile(path) {
    return new Promise((resolve, reject) => {
        readFile(path, { encoding: DEFAULT_ENCODING }, (err, data) => {
            if (err) {
                reject(err);
            }

            resolve(data);
        });
    });
}

function readFromStdin() {
    let buffer = '';

    return new Promise((resolve, reject) => {
        const stdin = process.stdin;

        stdin.setEncoding(DEFAULT_ENCODING);

        stdin.on('data', data => buffer += data);

        stdin.on('error', reject);

        stdin.on('end', () => resolve(buffer));

        try {
            stdin.resume()
        } catch (e) {
            reject(e);
        }
    });
}

function formatFailures(result) {
    const toText = arr => ({
        count: arr.length, 
        text: arr.map(f => '  * ' + f.reason + '\n').join('')
    });

    let failureText = '';

    const ambiguousSyntax = toText(result.failures.filter(f => f.type == 'ambiguous syntax'))
    
    const interpretationErrors = toText(result.failures.filter(f => f.type == 'interpretation error'));
    
    if (ambiguousSyntax.count != 0) {
        failureText += 'Ambiguous Syntax (' + ambiguousSyntax.count + ')\n\n' + ambiguousSyntax.text;
    }

    if (interpretationErrors.count != 0) {
        failureText += 'Interpretation Error (' + interpretationErrors.count + ')\n\n' + interpretationErrors.text;
    }

    return Object.assign({}, result, { failures: failureText });
}

function formatData(isPretty, result) {
    const indentation = isPretty ? PRETTY_INDENTATION : 0;

    const formattedData = JSON.stringify(result.data, null, indentation);

    return Object.assign({}, result, { data: formattedData });
}

function writeData(path, { data, failures }) {
    if (path) {
        return new Promise((resolve, reject) => {
            if (failures != '') {
                console.error(failures);
            }

            writeFile(path, data, { encoding: DEFAULT_ENCODING }, err => {
                if (err) {
                    reject(err);
                } else {
                    resolve();
                }
            });
        })
        
    } else {
        return new Promise(resolve => {
            if (failures != '') {
                console.error(failures);
            }

            console.log(data);

            resolve();
        });
    }
}
