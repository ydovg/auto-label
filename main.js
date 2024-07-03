const core = require('@actions/core');
const github = require('@actions/github')

async function main() {

    try {
        const labelsStr = core.getInput('labels')
        const labels = JSON.parse(labelsStr)

        const {payload: {pull_request: pr}} = github.context
        const title = pr.title
        const message = pr.message
        const body = pr.body
        const existLabels = pr.labels.map(x => x.name)

        core.info(`PR has name ${title} message=${message} existsLabels=${existLabels} body=${body}`)

    } catch (error) {
        core.setFailed(error.message)
    }
}

main()

