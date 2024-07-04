const core = require('@actions/core');
const github = require('@actions/github')

async function main() {

    try {
        const token = core.getInput('repo-token');
        const octokit = github.getOctokit(token);
        const context = github.context;

        const labelsStr = core.getInput('labels')
        const labels = JSON.parse(labelsStr)

        core.info(`labels: ${labels}`)

        const {payload: {pull_request: pr}} = github.context
        const title = pr.title
        const body = pr.body
        const existLabels = pr.labels.map(x => x.name)

        core.info(`PR has name ${title} existsLabels=${existLabels} body=${body}`)

        const { owner, repo } = context.repo;
        const pull_number = context.payload.pull_request.number;

        const label = "perf-improvement"

        await octokit.rest.issues.addLabels({
            owner,
            repo,
            issue_number: pull_number,
            labels: [label]
        });

    } catch (error) {
        core.setFailed(error.message)
    }
}

main()

