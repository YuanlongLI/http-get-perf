const axios = require('axios');
const http = require('http');

let completedRequests = 0;

async function executeRequests(url) {
    while (true) {
        const response = await axios.get(url);
        completedRequests++;
    }
}

function printResults(requests, duration) {
    const requestsPerSecond = requests / duration;
    console.log(`Completed ${requests} requests in ${duration.toFixed(2)} seconds (${requestsPerSecond.toFixed(2)} req/s)`);
    console.log();
}

function sleep(duration) {
    return new Promise(resolve => setTimeout(resolve, duration * 1000));
}

async function collectResults(title, duration) {
    console.log(`=== ${title} ===`);

    const startNs = process.hrtime.bigint();
    completedRequests = 0;
    await sleep(duration);
    const endNs = process.hrtime.bigint();

    printResults(completedRequests, Number(endNs - startNs) / 1000000000);
}

async function main() {
    if (process.argv.length <= 2) {
        console.log('Usage: app <url> <parallel> <warmup> <duration>');
        return;
    }

    const url = process.argv[2];
    const parallel = process.argv.length >= 4 ? parseInt(process.argv[3]) : 64;
    const warmup = process.argv.length >= 5 ? parseInt(process.argv[4]) : 10;
    const duration = process.argv.length >= 6 ? parseInt(process.argv[5]) : 10;

    console.log('=== Parameters ===');
    console.log(`Url: ${url}`);
    console.log(`Parallel: ${parallel}`);
    console.log(`Warmup: ${warmup}`);
    console.log(`Duration: ${duration}`);
    console.log()

    axios.defaults.httpAgent = new http.Agent({ keepAlive: true });

     const promises = [];

    for (let i = 0; i < parallel; i++) {
        promises[i] = executeRequests(url);
    }

    await collectResults('Warmup', warmup);
    await collectResults('Test', duration);

    process.exit();
}

main().then().catch(console.error);
