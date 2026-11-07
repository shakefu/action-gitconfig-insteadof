import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import process from 'node:process'
import { promisify } from 'node:util'
import { exec as cpExec } from 'node:child_process'
import * as exec from '@actions/exec'

const __dirname = import.meta.dirname
const execProcess = promisify(cpExec)

// Point git at a throwaway global config so tests never touch the host's
// ~/.gitconfig. Jest loads this module once per test file, so each suite gets
// its own file and suites running in parallel do not race.
const gitConfigDir = fs.mkdtempSync(path.join(os.tmpdir(), 'gitconfig-insteadof-'))
process.env['GIT_CONFIG_GLOBAL'] = path.join(gitConfigDir, 'gitconfig')
fs.writeFileSync(process.env['GIT_CONFIG_GLOBAL'], '')

// Run the `git config --list` command and return the output as a list of lines
export function gitConfigList() {
    let output = '';
    const options = {
        silent: true,
        env: { ...process.env },
        listeners: {
            stdout: data => { output += data; },
            stderr: data => { output += data; },
        }
    }
    return exec.exec('git', ['config', '--global', '--list'], options)
        .then(() => {
            output = output.split('\n')
            return output
        })
}


// run executes the post/remove task in a subshell. It writes to the
// GIT_CONFIG_GLOBAL file set above.
export function runRemove() {
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


// runIncex executes main a tion in a subshell. It writes to the GIT_CONFIG_GLOBAL file set
// above.
// XXX(shakefu): This is a bit of a hack, but only way to resolve the dependency
// circle
export function runIndex() {
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
