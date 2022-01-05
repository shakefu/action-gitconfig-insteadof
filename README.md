# action-gitconfig-insteadof

This GitHub Action provides a way to configure credentials for any utility that
uses the git command, or any utility that uses the git command as a subprocess,
or any utility that uses the git configuration file in its authentication and
cloning.

- [Usage](#usage)
  - [Basic](#basic)
  - [Inputs](#inputs)
- [Development](#development)
  - [Contributing](#contributing)
  - [Testing](#testing)
  - [Packaging](#packaging)
  - [Releasing](#releasing)

## Usage

This section describes how to use this GitHub Action.

### Basic

```yaml
name: ci
on:
  push:
  pull_request:

jobs:
  checkout:
    runs-on: ubuntu-latest
    steps:
      - name: Authorize
        uses: shakefu/action-gitconfig-insteadof@v1
        with:
          token: ${{ secrets.PERSONAL_ACCESS_TOKEN }}
      - name: Checkout
        uses: actions/checkout@v2
```

### Inputs

The following inputs are available:

- `token` (required) - The GitHub access token to use for authentication.
- `prefix` (optional) - The prefix to use for the URL path rewrite. This will
  often be an organization name if you wish to limit which repositories are
  accessible.
- `server` (optional) - The GitHub server to use. This is useful if you are
  running this action against a GitHub Enterprise instance.

## Development

This section describes how to develop the project.

### Contributing

*TODO: Write this section.*

### Testing

Use `npm test` to run tests locally.
### Packaging

*TODO: Rewrite this section.*

GitHub Actions will run the entry point from the action.yml. Packaging assembles
the code into one file that can be checked in to Git, enabling fast and reliable
execution and preventing the need to check in node_modules.

Actions are run from GitHub repos.  Packaging the action will create a packaged
action in the dist folder.

Run prepare

```bash
npm run prepare
```

Since the packaged index.js is run from the dist folder.

```bash
git add dist
```

### Releasing

*TODO: Rewrite this section.*

Users shouldn't consume the action from master since that would be latest code
and actions can break compatibility between major versions.

Checkin to the v1 release branch

```bash
git checkout -b v1
git commit -a -m "v1 release"
```

```bash
git push origin v1
```

Note: We recommend using the `--license` option for ncc, which will create a
license file for all of the production node modules used in your project.

Your action is now published! :rocket:

See the [versioning documentation](https://github.com/actions/toolkit/blob/master/docs/action-versioning.md)
