const core = require('@actions/core');
const github = require('@actions/github');

async function run() {
    try {
        const token = core.getInput('repo-token');
        const config = JSON.parse(core.getInput('labels'));

        const octokit = github.getOctokit(token);
        const context = github.context;

        if (context.payload.pull_request == null) {
            core.setFailed('This action can only be run on pull requests.');
            return;
        }

        const { owner, repo } = context.repo;
        const pull_number = context.payload.pull_request.number;
        const title = context.payload.pull_request.title;
        const body = context.payload.pull_request.body;

        let labelsToAdd = [];

        // Check the title and body for each regex pattern in the configured lists
        for (const [label, patterns] of Object.entries(config)) {
            for (const pattern of patterns) {
                const regex = new RegExp(pattern, 'i'); // 'i' for case-insensitive matching
                if (regex.test(title) || (body && regex.test(body))) {
                    labelsToAdd.push(label);
                    break; // Stop checking patterns for this label if one is found
                }
            }
        }

        if (labelsToAdd.length > 0) {
            await octokit.rest.issues.addLabels({
                owner,
                repo,
                issue_number: pull_number,
                labels: labelsToAdd
            });

            core.info(`Labels "${labelsToAdd.join(', ')}" added to pull request #${pull_number}`);
        } else {
            core.info('No matching words found in title or body. No labels added.');
        }
    } catch (error) {
        core.setFailed(`Action failed with error: ${error.message}`);
    }
}

run();