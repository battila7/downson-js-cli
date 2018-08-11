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
  --version     Show version number                                             [boolean]
  -i, --input   The input file to read from. If omitted, then stdin is used.    [string]
  -o, --output  The output file to write to. If omitted, then stdout is used.   [string]
  -p, --pretty  Pretty-print the result.                                        [boolean]
  -s, --silent  Enable the silent option for downson.                           [boolean]
  --help        Show help                                                       [boolean]
~~~~

### Exit Codes and Ouput

If the process was successful and there are **no** interpretation errors (or a fatal error occurred, but the `--silent` options was passed), then 
  * the exit code is set to `0`,
  * the *data layer* of the downson document is written to either the `stdout` or the specified output file,
  * the list of the failures is written to `stderr`.

If the process was successful but the downslon library hit an interpretation error, then
  * the exit code is set to `1`,
  * the presumably corrupted *data layer* of the downson document is written to either the `stdout` or the specified output file,
  * the list of the failures is written to `stderr`.

If downson-cli encounters a fatal error, then
  * the exit code is set to `2`,
  * the error is written to `stderr`,
  * nothing is written to `stdout`.
