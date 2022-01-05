const path = require('path')
const process = require('process')
const exec = require('@actions/exec')
const execProcess = require('util').promisify(require('child_process').exec);

// Run the `git config --list` command and return the output as a list of lines
function gitConfigList() {
    let output = '';
    const options = {
        silent: true,
        listeners: {
            stdout: data => { output += data; },
            stderr: data => { output += data; },
        }
    }
    return exec.exec('git', ['config', '--global', '--list'], options)
        .then(proc => {
            output = output.split('\n')
            return output
        })
}
exports.gitConfigList = gitConfigList


// run executes the post/remove task in a subshell. This does modify the underlying
// host's git config but there's no other way to test it.
function runRemove() {
    const index = path.join(__dirname, 'remove.js')
    return execProcess(`node ${index}`, {env: process.env})
        // XXX(shakefu): This is useful for debuggin
        /*
        .catch(err => {
            console.error(err)
            throw err
        })
        */
}
exports.runRemove = runRemove


// runIncex executes main a tion in a subshell. This does modify the underlying
// git config.
// XXX(shakefu): This is a bit of a hack, but only way to resolve the dependency
// circle
function runIndex() {
    const index = path.join(__dirname, 'index.js')
    return execProcess(`node ${index}`, {env: process.env})
        // XXX(shakefu): This is useful for debuggin
        /*
        .catch(err => {
            console.error(err)
            throw err
        })
        */
}
exports.runIndex = runIndex
