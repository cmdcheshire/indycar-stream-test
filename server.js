const sax = require('sax');
const fs = require('fs');

function processXMLStream(stream) {
    const parser = sax.createStream(true);
    let rootTagStack = [];
    let invalidDataBuffer = '';
    let inRecoveryMode = false;
    let recoveredChunks = [];
    let validChunks = [];

    parser.on('opentag', node => {
        if (inRecoveryMode) {
            recoveredChunks.push(invalidDataBuffer.trim());
            invalidDataBuffer = '';
            inRecoveryMode = false;
        }

        if (rootTagStack.length === 0) {
            validChunks.push(`<${node.name}>`);
        }
        rootTagStack.push(node.name);
    });

    parser.on('text', text => {
        if (inRecoveryMode) {
            invalidDataBuffer += text;
        } else if (rootTagStack.length > 0) {
            validChunks[validChunks.length - 1] += text;
        }
    });

    parser.on('closetag', tagName => {
        validChunks[validChunks.length - 1] += `</${tagName}>`;
        rootTagStack.pop();
    });

    parser.on('error', err => {
        console.warn('Invalid data detected. Recovering...');
        inRecoveryMode = true;
    });

    stream.pipe(parser);

    // Print one chunk per second
    setInterval(() => {
        if (recoveredChunks.length > 0) {
            console.log('Recovered Chunk:');
            console.log(recoveredChunks.shift()); // Print and remove first chunk
            console.log('-------------------');
        } else if (validChunks.length > 0) {
            console.log('Valid Chunk:');
            console.log(validChunks.shift()); // Print and remove first chunk
            console.log('-------------------');
        }
    }, 1000);
}

// Example usage: Reads telemetry.xml
const xmlStream = fs.createReadStream('telemetry.xml', { encoding: 'utf-8' });
processXMLStream(xmlStream);
