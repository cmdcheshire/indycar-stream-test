const sax = require('sax');
const fs = require('fs');

function processXMLStream(stream) {
    const parser = sax.createStream(true);
    let currentChunk = '';
    let rootTagStack = [];

    parser.on('opentag', node => {
        if (rootTagStack.length === 0) {
            // New root tag detected
            if (currentChunk.length > 0) {
                console.log('Chunk:', currentChunk);
                console.log('-------------------');
            }
            currentChunk = '';
        }
        rootTagStack.push(node.name);
        currentChunk += `<${node.name}`;
        for (const [key, value] of Object.entries(node.attributes)) {
            currentChunk += ` ${key}="${value}"`;
        }
        currentChunk += '>';
    });

    parser.on('text', text => {
        currentChunk += text;
    });

    parser.on('closetag', tagName => {
        currentChunk += `</${tagName}>`;
        rootTagStack.pop();
        if (rootTagStack.length === 0) {
            console.log('Chunk:', currentChunk);
            console.log('-------------------');
            currentChunk = '';
        }
    });

    stream.pipe(parser);
}

// Example usage
const xmlStream = fs.createReadStream('telemetry.xml', { encoding: 'utf-8' });
processXMLStream(xmlStream);
