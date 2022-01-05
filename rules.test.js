const rules = require('./rules')

const TOKEN = "example-token"
const SERVER = "example.com"

describe('run', () => {
    it('works with just a token', () => {
        const conf = rules.make(TOKEN)
        expect(conf).toEqual({
            auth_rule: `url.https://${TOKEN}:x-oauth-basic@github.com/.insteadof`,
            auth_url: `https://${TOKEN}:x-oauth-basic@github.com/`,
            https_url: "https://github.com/",
            section: `url.https://${TOKEN}:x-oauth-basic@github.com/`,
            ssh_url: "git@github.com:",
        })
    })

    it('works with token and server', () => {
        const conf = rules.make(TOKEN, SERVER)
        expect(conf).toEqual({
            auth_rule: `url.https://${TOKEN}:x-oauth-basic@${SERVER}/.insteadof`,
            auth_url: `https://${TOKEN}:x-oauth-basic@${SERVER}/`,
            https_url: `https://${SERVER}/`,
            section: `url.https://${TOKEN}:x-oauth-basic@${SERVER}/`,
            ssh_url: `git@${SERVER}:`,
        })
    })

    it('works with token and server and a prefix', () => {
        const PREFIX = "org"
        const conf = rules.make(TOKEN, SERVER, PREFIX)
        expect(conf).toEqual({
            auth_rule: `url.https://${TOKEN}:x-oauth-basic@${SERVER}/${PREFIX}.insteadof`,
            auth_url: `https://${TOKEN}:x-oauth-basic@${SERVER}/${PREFIX}`,
            https_url: `https://${SERVER}/${PREFIX}`,
            section: `url.https://${TOKEN}:x-oauth-basic@${SERVER}/${PREFIX}`,
            ssh_url: `git@${SERVER}:${PREFIX}`,
        })
    })
})
