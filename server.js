const net = require('net');
const fs = require('fs');
const path = require('path');

const port = 1337;
const host = '127.0.0.1';

const clients = []; // Array to store connected client sockets
const xmlFilePath = path.join(__dirname, 'telemetry.xml'); // Path to your XML file

let telemetryStream = '';

// Read the XML file
try {
  telemetryStream = fs.readFileSync(xmlFilePath, 'utf8');
  console.log("Telemetry file found.. reading")
} catch (err) {
  console.error('Error reading XML file:', err);
  //  Handle the error appropriately, e.g., exit the program or use a default XML string
  process.exit(1);
}

const server = net.createServer((socket) => {
  console.log('Client connected:', socket.remoteAddress + ':' + socket.remotePort);
  clients.push(socket);

  socket.on('end', () => {
    console.log('Client disconnected:', socket.remoteAddress + ':' + socket.remotePort);
    clients.splice(clients.indexOf(socket), 1);
  });

  socket.on('error', (err) => {
    console.error('Socket error:', err);
    clients.splice(clients.indexOf(socket), 1);
  });
});

function playBackTelemetryStream() {
    const elements = telemetryStream.trim().split(/<([A-Za-z0-9_]+)[^>]*>|<\/([A-Za-z0-9_]+)>/g).filter(Boolean);
    let chunks = [];
    let currentChunk = '';
    let depth = 0;

    for (const element of elements) {
        if (element.startsWith('<') && !element.startsWith('</')) {
            currentChunk += element;
            depth++;
        } else if (element.startsWith('</')) {
            currentChunk += element;
            depth--;
            if (depth === 0) {
                chunks.push(currentChunk);
                currentChunk = '';
            }
        } else {
          currentChunk += element;
        }
    }

  if (chunks.length > 0) {
    let index = 0;
    const intervalId = setInterval(() => {
      if (index < chunks.length) {
        const chunk = chunks[index] + '\n';
        broadcast(chunk);
        index++;
      } else {
        clearInterval(intervalId);
        console.log('Telemetry stream playback complete.');
      }
    }, 2500);
  } else {
    console.log('No chunks found in the XML stream.');
  }
}

function broadcast(data) {
  clients.forEach((client) => {
    client.write(data);
  });
}

server.listen(port, host, () => {
  console.log('TCP server listening on', host + ':' + port);
  playBackTelemetryStream();
});
