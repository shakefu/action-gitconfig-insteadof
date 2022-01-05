const rules = require('./rules')
const process = require('process')
const { gitConfigList, runIndex, runRemove } = require('./testutil')

// These need to be sync'd in index.test.js
const TOKEN = "example-token"
const SERVER = "example.com"

describe("cleanup", () => {
    beforeAll(() => {
        // Make sure we create our entries since we can't guarantee test suite
        // execution order
        process.env['INPUT_TOKEN'] = TOKEN
        process.env['INPUT_SERVER'] = SERVER
        return runIndex()
    })
    it("actually has the rules in place", () => {
        return gitConfigList().then(output => {
            const rule = rules.make(TOKEN, SERVER).auth_rule
            let lines = output.filter(line => line.match(new RegExp(`${rule}=.*`)))
            expect(lines.length).toEqual(2)
            lines = output.filter(line => line.match(new RegExp(`${rule}=git@${SERVER}:`)))
            expect(lines.length).toEqual(1)
            lines = output.filter(line => line.match(new RegExp(`${rule}=https://${SERVER}/`)))
            expect(lines.length).toEqual(1)
        })
    })

    it("runs without error", () => {
        const conf = rules.make(TOKEN, SERVER)
        process.env['STATE_git_config_section'] = conf.section
        return runRemove()
    })

    it("removed the rules we inserted", () => {
       return gitConfigList().then(output => {
            const rule = rules.make(TOKEN, SERVER).auth_rule
            let lines = output.filter(line => line.match(new RegExp(`${rule}=.*`)))
            expect(lines.length).toEqual(0)
            lines = output.filter(line => line.match(new RegExp(`${rule}=git@${SERVER}:`)))
            expect(lines.length).toEqual(0)
            lines = output.filter(line => line.match(new RegExp(`${rule}=https://${SERVER}/`)))
            expect(lines.length).toEqual(0)
       })
    })
})
