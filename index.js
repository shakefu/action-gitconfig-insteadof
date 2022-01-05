const core = require('@actions/core')
const exec = require('@actions/exec')
const github = require('@actions/github')
const rules = require('./rules')

// action main method
async function run() {
    // Grab our inputs
    const server = getServer()
    const token = core.getInput('token', {required: true})
    const prefix = core.getInput('prefix').replace(/^\/+/, '')
    const conf = rules.make(token, server, prefix)
    // Save the auth rule so we can remove it later
    core.debug("Saving 'git_config_section' state")
    core.saveState('git_config_section', conf.section)
    core.info(`Rewriting '${conf.https_url}' and '${conf.ssh_url}' to use token authentication`)
    // Use git itself to update the configuration
    const silent = core.isDebug() ? {} : {silent: true}
    await exec.exec('git', ['config', '--global', '--replace-all', conf.auth_rule, conf.https_url], silent)
    await exec.exec('git', ['config', '--global', '--add', conf.auth_rule, conf.ssh_url], silent)
}

// getServer returns the server domain from the input secrets or github context
function getServer(){
    const server = core.getInput('server')
    const serverUrl = (github.context && github.context.serverUrl &&
        github.context.serverUrl.replace(/^\/\/|^.*?:(\/\/)?/, ''))
    return (server || serverUrl).replace(/\/$/, '')
}

run().catch(error => core.setFailed(error.message))
