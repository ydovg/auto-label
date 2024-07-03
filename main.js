const core = require('@actions/core');

async function main() {

    try {
        const labelsStr = core.getInput('labels')
        const labels = JSON.parse(labelsStr)

        const {payload: {pull_request: pr}} = github.context
        const title = pr.title
        const message = pr.message
        const existLabels = pr.labels.map(x => x.name)

        core.info(`PR has name ${title} message ${message} existsLabels ${existLabels}`)

    } catch (error) {
        core.setFailed(error.message)
    }
}

main()

