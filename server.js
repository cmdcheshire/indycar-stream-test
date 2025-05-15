const sax = require('sax');
const fs = require('fs');

function processXMLStream(stream) {
    const parser = sax.createStream(true);
    let rootTagStack = [];
    let invalidDataBuffer = '';
    let inRecoveryMode = false;
    let recoveredChunks = [];

    parser.on('opentag', node => {
        if (inRecoveryMode) {
            console.log('Recovered Chunk:');
            console.log(invalidDataBuffer.trim());
            console.log('-------------------');
            invalidDataBuffer = '';
            inRecoveryMode = false;
        }

        if (rootTagStack.length === 0) {
            console.log('Root Tag:', node.name);
        }
        rootTagStack.push(node.name);
    });

    parser.on('text', text => {
        if (inRecoveryMode) {
            invalidDataBuffer += text;
        }
    });

    parser.on('closetag', tagName => {
        rootTagStack.pop();
    });

    parser.on('error', err => {
        console.warn('Invalid data detected. Recovering...');
        inRecoveryMode = true;
    });

    stream.pipe(parser);
}

// Example usage: Reads telemetry.xml
const xmlStream = fs.createReadStream('telemetry.xml', { encoding: 'utf-8' });
processXMLStream(xmlStream);
