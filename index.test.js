const process = require('process')
const { gitConfigList, runIndex, runRemove } = require('./testutil')

// These need to be sync'd in cleanup.test.js
const TOKEN = "example-token"
const SERVER = "example.com"

describe('run', () => {
    it('errors with no token', () => {
        return runIndex()
            .then(proc => {
                expect(proc).toBe(null)
            })
            .catch(err => {
                expect(err.toString()).toMatch(/^Error: Command failed/)
                expect(err.stderr.toString()).toBe('')
                expect(err.stdout.toString()).toMatch(/^::error::Input required and not supplied: token/)
            })
    })

    it("works when we have a token", () => {
        process.env['INPUT_TOKEN'] = TOKEN
        process.env['INPUT_SERVER'] = SERVER
        return runIndex()
            .then(proc => {
                expect(proc.stderr.toString()).toBe('')
                expect(proc.stdout.toString()).toMatch(/::save-state name=git_config_section::/)
            })
    })

    it("only creates the save state rules we want", () => {
        // This test depends on the external git/git config not being insanely goofy, but it should work
        return gitConfigList().then(output => {
            let rule = `^url.https://${TOKEN}:x-oauth-basic@${SERVER}/.instead[oO]f`
            let lines = output.filter(line => line.match(new RegExp(`${rule}=.*`)))
            expect(lines.length).toEqual(2)
            lines = output.filter(line => line.match(new RegExp(`${rule}=git@${SERVER}:`)))
            expect(lines.length).toEqual(1)
            lines = output.filter(line => line.match(new RegExp(`${rule}=https://${SERVER}/`)))
            expect(lines.length).toEqual(1)
        })
    })
})
