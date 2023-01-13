const core = require('@actions/core');
// const github = require('@actions/github')
const exec = require('@actions/exec');

function run() {
    // 1) Get inputs(bucket, bucket-region, dist-folder) from action.yml via 'core' module.
    const bucket = core.getInput('bucket', { required: true });
    const bucketRegion = core.getInput('bucket-region', { required: true });
    const distFolder = core.getInput('dist-folder', { required: true });

    // github.getOctokit().  
    // // this can be used for communicating with github's apis. 
    // // (eg. send request to the github rest api)
    // github.context. 
    // // this provides some values from github context object.

    // 2) Upload files
    const s3Uri = `s3://${bucket}`;
    exec.exec(`aws s3 sync ${distFolder} ${s3Uri} --region ${bucketRegion}`);
    // 'aws' command exists inside our runner.
    // this syncs the local distFolder with the remote s3 bucket.

    // We should set the permission on AWS to upload files. AWS -> Security Credentials -> Access Keys
    // Since the "aws" command looks for an environment variable eg. AWS_ACCESS_KEY_ID. This environment ID must be set in the workflow (deploy.yml). Github -> Settings -> Secrets

    const websiteUrl = `http://${bucket}.s3-website-${bucketRegion}.amazonaws.com`; // return value
    core.setOutput('website-url', websiteUrl) // its like "website-url=${{websiteUrl}}" >> GITHUB_OUTPUT

    core.notice('Hello from my custom JavaScript Action!');
}

run();