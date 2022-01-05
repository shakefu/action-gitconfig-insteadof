// make creates our URL fragments and rules for rewriting URLs for auth
function make(token, server="github.com", prefix="") {
    prefix = prefix.replace(/^\/+/, '')
    return {
        https_url: `https://${server}/${prefix}`,
        ssh_url: `git@${server}:${prefix}`,
        auth_url: `https://${token}:x-oauth-basic@${server}/${prefix}`,
        section: `url.https://${token}:x-oauth-basic@${server}/${prefix}`,
        auth_rule: `url.https://${token}:x-oauth-basic@${server}/${prefix}.insteadof`,
    }
}
exports.make = make
