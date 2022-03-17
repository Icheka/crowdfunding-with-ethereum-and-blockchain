const path = require('path');
const solc = require('solc');
const fs = require('fs-extra');

// delete /ethereum/build folder
const buildPath = path.resolve(__dirname, 'build');
fs.removeSync(buildPath);

const campaignPath = path.resolve(__dirname, 'contracts', 'Campaign.sol');
const source = fs.readFileSync(campaignPath, 'utf8');
const output = solc.compile(source, 1).contracts;

// create /ethereum/build folder
fs.ensureDirSync(buildPath);
Object.entries(output).forEach(([i, o]) => {
    fs.outputJSONSync(
        path.resolve(buildPath, `${i.replace(':', '')}.json`),
        o
    );
});

