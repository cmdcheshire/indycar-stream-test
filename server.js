const sax = require('sax');
const fs = require('fs');

function processXMLStream(stream) {
    const parser = sax.createStream(true);
    let rootTagStack = [];
    let invalidDataBuffer = '';
    let inRecoveryMode = false;
    let lastValidCloseTag = '';
    let awaitingValidChunk = false; 

    parser.on('opentag', node => {
        if (inRecoveryMode && awaitingValidChunk) {
            // We've now found a full valid chunk, print the recovered chunk first
            console.log('Recovered Chunk:');
            console.log(lastValidCloseTag + invalidDataBuffer.trim());
            console.log('-------------------');

            // Reset recovery tracking
            invalidDataBuffer = '';
            inRecoveryMode = false;
            awaitingValidChunk = false;
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
        lastValidCloseTag = `</${tagName}>`;

        if (inRecoveryMode) {
            awaitingValidChunk = true; // Wait for a fully valid chunk before exiting recovery mode
        }
    });

    parser.on('error', err => {
        console.warn('Invalid data detected. Entering recovery mode...');
        inRecoveryMode = true;
        invalidDataBuffer = lastValidCloseTag; // Start recovery from last valid closing tag
    });

    stream.pipe(parser);
}

// Example usage: Reads telemetry.xml
const xmlStream = fs.createReadStream('telemetry.xml', { encoding: 'utf-8' });
processXMLStream(xmlStream);
