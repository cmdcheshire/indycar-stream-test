const fs = require('fs');
const net = require('net');

const PORT = 5000;
const FILE_PATH = 'telemetry.xml';
const CHUNK_INTERVAL = 250; // Send data every 250ms

let chunks = [];
let currentChunkIndex = 0;
let clients = [];

// Load file and split into chunks
function loadChunks() {
    chunks = [];
    const data = fs.readFileSync(FILE_PATH, 'utf-8');
    const lines = data.split(/\r?\n/);
    let currentChunk = [];

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

    if (currentChunk.length > 0) {
        chunks.push(currentChunk.join('\n'));
    }

    console.log(`Loaded ${chunks.length} chunks.`);
}

// Create TCP server
const server = net.createServer(socket => {
    console.log('Client connected');
    clients.push(socket);

    socket.on('end', () => {
        console.log('Client disconnected');
        clients = clients.filter(client => client !== socket);
    });

    socket.on('error', err => {
        console.error('Socket error:', err.message);
    });
});

// Send chunks to clients every 250ms
setInterval(() => {
    if (chunks.length === 0) {
        return; // No data loaded yet
    }

    if (clients.length > 0) {
        const chunk = chunks[currentChunkIndex];
        clients.forEach(client => {
            client.write(chunk + '\n\n'); // Send chunk with separation
        });

        currentChunkIndex = (currentChunkIndex + 1) % chunks.length; // Restart at the end
    }
}, CHUNK_INTERVAL);

// Start the server
server.listen(PORT, () => {
    console.log(`TCP server listening on port ${PORT}`);
    loadChunks(); // Load file initially
});

// Reload file periodically in case it gets updated
setInterval(() => {
    loadChunks();
}, 60000); // Reload every 60 seconds
