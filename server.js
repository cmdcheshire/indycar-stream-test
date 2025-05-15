const sax = require('sax');
const fs = require('fs');

function processXMLStream(stream) {
    const parser = sax.createStream(true);
    let rootTagStack = [];

    parser.on('opentag', node => {
        if (rootTagStack.length === 0) {
            console.log('Root Tag:', node.name);
        }
        rootTagStack.push(node.name);
    });

    parser.on('closetag', tagName => {
        rootTagStack.pop();
    });

    parser.on('error', err => {
        console.warn('Skipping unexpected text error:', err.message);
    });

    stream.pipe(parser);
}

// Example usage: Reads telemetry.xml instead of example.xml
const xmlStream = fs.createReadStream('telemetry.xml', { encoding: 'utf-8' });
processXMLStream(xmlStream);
