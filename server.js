const fs = require('fs');

function processTextFile(filePath) {
    let chunks = [];
    let currentChunk = [];
    let emptyLineCount = 0;

    const stream = fs.createReadStream(filePath, { encoding: 'utf-8' });

    stream.on('data', data => {
        const lines = data.split(/\r?\n/); // Handle different newline formats
        for (const line of lines) {
            if (line.trim() === '') {
                emptyLineCount++;
                if (emptyLineCount >= 2) {
                    if (currentChunk.length > 0) {
                        chunks.push(currentChunk.join('\n'));
                        currentChunk = [];
                    }
                }
            } else {
                emptyLineCount = 0; // Reset when encountering non-empty lines
                currentChunk.push(line);
            }
        }
    });

    stream.on('end', () => {
        if (currentChunk.length > 0) {
            chunks.push(currentChunk.join('\n')); // Add last chunk if any data remains
        }

        // Print only the first line of each chunk
        chunks.forEach((chunk, index) => {
            const firstLine = chunk.split('\n')[0];
            console.log(`Chunk ${index + 1}: ${firstLine}`);
        });
    });

    stream.on('error', err => {
        console.error('Error reading file:', err.message);
    });
}

// Example usage
processTextFile('telemetry.xml');
