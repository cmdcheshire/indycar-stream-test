const fs = require('fs');

function processTextFile(filePath) {
    let chunks = [];
    let currentChunk = [];

    const stream = fs.createReadStream(filePath, { encoding: 'utf-8' });

    stream.on('data', data => {
        const lines = data.split(/\r?\n/); // Handle different newline formats
        for (const line of lines) {
            if (line.trim() === '') {
                if (currentChunk.length > 0) {
                    chunks.push(currentChunk.join('\n'));
                    currentChunk = [];
                }
            } else {
                currentChunk.push(line);
            }
        }
    });

    stream.on('end', () => {
        if (currentChunk.length > 0) {
            chunks.push(currentChunk.join('\n')); // Add last chunk if any data remains
        }

        // Print one chunk every second
        let index = 0;
        const interval = setInterval(() => {
            if (index < chunks.length) {
                console.log(`Chunk ${index + 1}: ${chunks[index].split('\n')[0]}`);
                index++;
            } else {
                clearInterval(interval); // Stop when all chunks are printed
            }
        }, 1000);
    });

    stream.on('error', err => {
        console.error('Error reading file:', err.message);
    });
}

// Example usage
processTextFile('telemetry.xml');
