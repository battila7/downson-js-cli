# Downson.js CLI

A command-line downson-to-JSON converter built around the [downson.js](https://github.com/battila7/downson-js/) library.

What's downson? It's the new configuration/data file format, y'all've been waiting for! :rocket: Check it out at here: [downson](https://github.com/battila7/downson/).

## Installation

~~~~bash
npm install -g downson-cli
~~~~

## Usage 

Using `downson-cli` is pretty straightforward:

~~~~
$ downson-cli -o hello.json
**.hello** [](right) [world!](string)
^D
$ cat hello.json
{"hello":"world!"}
~~~~

The list of supported command-line arguments is as follows:

~~~~
Options:
  --version     Show version number                                                               [boolean]
  -i, --input   The input file to read from. If omitted, then stdin is used.                      [string]
  -o, --output  The output file to write to. If omitted, then stdout is used.                     [string]
  -p, --pretty  Pretty-print the result.                                                          [boolean]
  -s, --silent  Ignore interpretation errors and fatal errors.                                    [boolean]
  -t, --type    Path to a module that can register custom types. Can be specified multiple types. [string]
  --help        Show help                                                                         [boolean]
~~~~

### Custom Types

Custom types can be registered using modules passed using the `-t` (`-type`) parameter. 

Registered modules should expose a single one-parameter function, which will be called with the `downson.registerType` function. A module can register an arbitrary number of custom types.

An example module is as follows:

~~~~JavaScript
module.exports = function (register) {
    register('number', (type, value, parameters) => {
        const radix = parameters.radix || 10;

        try {
            return {
                value: Number.parseInt(value, radix)
            };
        } catch {
            return {
                error: `Could not parse ${value} as a base-${radix} number!`
            };
        }
    });
};
~~~~

### Exit Codes and Ouput

If the process was successful or the `--silent` option was set, then 
  * the exit code is set to `0`,
  * the *data layer* of the downson document is written to either the `stdout` or the specified output file,
  * the list of the failures is written to `stderr`.

If the process was successful but the downson library hit an interpretation error (and the `--silent` option is unset), then
  * the exit code is set to `1`,
  * the presumably corrupted *data layer* of the downson document is written to either the `stdout` or the specified output file,
  * the list of the failures is written to `stderr`.

If downson-cli encounters a fatal error (and the `--silent` option is unset), then
  * the exit code is set to `2`,
  * the error is written to `stderr`,
  * nothing is written to `stdout`.
