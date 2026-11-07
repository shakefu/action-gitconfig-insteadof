import * as core from '@actions/core'
import * as exec from '@actions/exec'

// This removes the entire section of the git config with our URL rewrites
async function run() {
    const section = core.getState('git_config_section')
    if (!section.match(/^url\./)) {
        core.setFailed("No git_config_section state found")
        return
    }
    core.info("Removing URL rewrites")
    await exec.exec('git', ['config', '--global', '--remove-section', section], {silent: !core.isDebug()})
}

run().catch(error => core.setFailed(error.message))
