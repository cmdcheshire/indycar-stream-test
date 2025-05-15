Deploying Your Node.js App to an EC2 Instance

Here's a step-by-step guide to deploying your Node.js application to an EC2 instance:

1.  Set up an EC2 Instance

    Launch an EC2 Instance:

        Go to the AWS Management Console and navigate to the EC2 service.

        Click "Launch Instance."

        Choose an Amazon Machine Image (AMI). Ubuntu Server is a good choice.

        Select an instance type. t2.micro is a good starting point and may be free tier eligible.

        Configure instance details, such as the number of instances.

        Add storage if needed.

        Configure Security Group: This is crucial!

            Create a new security group or modify an existing one.

            Allow SSH traffic (Port 22) from your IP address to connect to the instance.

            Allow TCP traffic on the port your Node.js application will use (e.g., Port 1337). You can restrict this to specific IP addresses or allow it from anywhere (0.0.0.0/0) for testing, but it's generally recommended to restrict it for security reasons in a production environment.

            Create a new key pair or select an existing one. Download the private key file (.pem file) and store it securely. You'll need this to connect to your instance.

            Launch the instance.

    Connect to Your Instance:

        Once the instance is running, select it in the EC2 console and click "Connect."

        Follow the instructions to connect using an SSH client. This will typically involve using the ssh command in your terminal, along with the private key file you downloaded. For example:


        ssh -i /path/to/your/privateKey.pem ubuntu@{your\_ec2\_public\_dns\_or\_ip}


        If your private key is in your Downloads folder, the default path would be:


        ssh -i ~/Downloads/yourPrivateKey.pem ubuntu@{your\_ec2\_public\_dns\_or\_ip}


2.  Install Node.js and Dependencies

    Update the Instance:


    sudo apt update


    Install Node.js and npm:


    curl -sL https://deb.nodesource.com/setup_18.x | sudo -E bash - # Use the appropriate Node.js version

    sudo apt-get install -y nodejs


    Install pm2 (Process Manager): This is highly recommended to keep your Node.js application running reliably.


    sudo npm install -g pm2


3.  Transfer Your Application Files

    You have several options for transferring your application files to the EC2 instance:

        Git: Clone your Git repository onto the EC2 instance.


        sudo apt-get install -y git

        git clone https://your-repo-url.git /var/www/your-app # Or your desired directory


        SCP (Secure Copy): Use scp to copy files from your local machine to the EC2 instance.


        scp -i /path/to/your/privateKey.pem /path/to/your/local/file.js ubuntu@{your\_ec2\_public\_dns\_or\_ip}:/var/www/your-app/ #Adapt the paths


        If your private key is in your Downloads folder, and you are using the default path, the  scp command would look like this:


        scp -i ~/Downloads/yourPrivateKey.pem /path/to/your/local/file.js ubuntu@{your\_ec2\_public\_dns\_or\_ip}:/var/www/your-app/


        FileZilla or other FTP clients: You can use a graphical FTP client that supports SFTP (SSH File Transfer Protocol) to transfer files.

4.  Configure and Run Your Application

    Navigate to your application directory:


    cd /var/www/your-app #Or wherever you placed your application files


    Install dependencies (if applicable): If you have a package.json file, run:


    npm install


    Copy the XML stream: Replace  the  server.js file with the  following code. This will hardcode the XML stream directly into the server code.

    const net = require('net');

    const port = 1337;
    const host = '127.0.0.1';

    const clients = []; // Array to store connected client sockets

    const telemetryStream = `
    <Telemetry_Leaderboard Cars="27">
    <Position Car="77" Distance_Behind="" Laps_Behind="" Rank="1" Time_Behind="" brake="45" currentLap="" rpm="10799" speed="96.796" throttle="0" steering="-10" Battery_Pct_Remaining="9" Regin_Active="True" Deploy_Active="False" Deploy_Eligible="True" Lap_Remaining="36"/>
    <Position Car="83" Distance_Behind="" Laps_Behind="" Rank="2" Time_Behind="" brake="0" currentLap="" rpm="11755" speed="133.164" throttle="100" steering="0" Battery_Pct_Remaining="53" Regin_Active="False" Deploy_Active="False" Deploy_Eligible="True" Lap_Remaining="59"/>
    <Position Car="27" Distance_Behind="" Laps_Behind="" Rank="3" Time_Behind="" brake="9" currentLap="" rpm="7707" speed="70.957" throttle="19" steering="-33" Battery_Pct_Remaining="96" Regin_Active="False" Deploy_Active="False" Deploy_Eligible="True" Lap_Remaining="72"/>
    <Position Car="10" Distance_Behind="" Laps_Behind="" Rank="4" Time_Behind="" brake="0" currentLap="" rpm="10080" speed="87.226" throttle="100" steering="5" Battery_Pct_Remaining="98" Regin_Active="False" Deploy_Active="False" Deploy_Eligible="True" Lap_Remaining="73"/>
    <Position Car="60" Distance_Behind="" Laps_Behind="" Rank="5" Time_Behind="" brake="29" currentLap="" rpm="7683" speed="54.96" throttle="6" steering="-27" Battery_Pct_Remaining="41" Regin_Active="True" Deploy_Active="False" Deploy_Eligible="True" Lap_Remaining="77"/>
    <Position Car="7" Distance_Behind="" Laps_Behind="" Rank="6" Time_Behind="" brake="0" currentLap="" rpm="5722" speed="41.152" throttle="0" steering="-74" Battery_Pct_Remaining="50" Regin_Active="True" Deploy_Active="False" Deploy_Eligible="True" Lap_Remaining="75"/>
    <Position Car="3" Distance_Behind="" Laps_Behind="" Rank="7" Time_Behind="" brake="69" currentLap="" rpm="10230" speed="105.82" throttle="0" steering="0" Battery_Pct_Remaining="19" Regin_Active="True" Deploy_Active="False" Deploy_Eligible="True" Lap_Remaining="75"/>
    <Position Car="2" Distance_Behind="" Laps_Behind="" Rank="8" Time_Behind="" brake="0" currentLap="" rpm="9583" speed="147.587" throttle="0" steering="1" Battery_Pct_Remaining="13" Regin_Active="True" Deploy_Active="False" Deploy_Eligible="True" Lap_Remaining="75"/>
    <Position Car="26" Distance_Behind="" Laps_Behind="" Rank="9" Time_Behind="" brake="0" currentLap="" rpm="11600" speed="177.597" throttle="100" steering="0" Battery_Pct_Remaining="0" Regin_Active="False" Deploy_Active="False" Deploy_Eligible="True" Lap_Remaining="72"/>
    <Position Car="8" Distance_Behind="" Laps_Behind="" Rank="10" Time_Behind="" brake="0" currentLap="" rpm="11248" speed="171.923" throttle="5" steering="0" Battery_Pct_Remaining="4" Regin_Active="True" Deploy_Active="False" Deploy_Eligible="True" Lap_Remaining="72"/>
    <Position Car="9" Distance_Behind="" Laps_Behind="" Rank="11" Time_Behind="" brake="0" currentLap="" rpm="11494" speed="174.453" throttle="100" steering="0" Battery_Pct_Remaining="4" Regin_Active="False" Deploy_Active="False" Deploy_Eligible="True" Lap_Remaining="72"/>
    <Position Car="12" Distance_Behind="" Laps_Behind="" Rank="12" Time_Behind="" brake="0" currentLap="" rpm="11293" speed="172.812" throttle="100" steering="0" Battery_Pct_Remaining="0" Regin_Active="False" Deploy_Active="False" Deploy_Eligible="True" Lap_Remaining="73"/>
    <Position Car="14" Distance_Behind="" Laps_Behind="" Rank="13" Time_Behind="" brake="0" currentLap="" rpm="10650" speed="162.011" throttle="100" steering="-6" Battery_Pct_Remaining="9" Regin_Active="False" Deploy_Active="False" Deploy_Eligible="True" Lap_Remaining="75"/>
    <Position Car="28" Distance_Behind="" Laps_Behind="" Rank="14" Time_Behind="" brake="0" currentLap="" rpm="11778" speed="162.011" throttle="100" steering="-7" Battery_Pct_Remaining="98" Regin_Active="False" Deploy_Active="False" Deploy_Eligible="True" Lap_Remaining="100"/>
    <Position Car="5" Distance_Behind="" Laps_Behind="" Rank="15" Time_Behind="" brake="0" currentLap="" rpm="10881" speed="164.814" throttle="100" steering="-2" Battery_Pct_Remaining="0" Regin_Active="False" Deploy_Active="False" Deploy_Eligible="True" Lap_Remaining="76"/>
    <Position Car="20" Distance_Behind="" Laps_Behind="" Rank="16" Time_Behind="" brake="0" currentLap="" rpm="11223" speed="129.404" throttle="100" steering="-1" Battery_Pct_Remaining="14" Regin_Active="False" Deploy_Active="True" Deploy_Eligible="True" Lap_Remaining="82"/>
    <Position Car="15" Distance_Behind="" Laps_Behind="" Rank="17" Time_Behind="" brake="0" currentLap="" rpm="10550" speed="108.076" throttle="100" steering="1" Battery_Pct_Remaining="67" Regin_Active="False" Deploy_Active="True" Deploy_Eligible="True" Lap_Remaining="91"/>
    <Position Car="4" Distance_Behind="" Laps_Behind="" Rank="18" Time_Behind="" brake="0" currentLap="" rpm="11401" speed="99.873" throttle="100" steering="0" Battery_Pct_Remaining="83" Regin_Active="False" Deploy_Active="True" Deploy_Eligible="True" Lap_Remaining="96"/>
    <Position Car="66" Distance_Behind="" Laps_Behind="" Rank="19" Time_Behind="" brake="0" currentLap="" rpm="9220" speed="83.33" throttle="100" steering="-1" Battery_Pct_Remaining="96" Regin_Active="False" Deploy_Active="False" Deploy_Eligible="True" Lap_Remaining="100"/>
    <Position Car="45" Distance_Behind="" Laps_Behind="" Rank="20" Time_Behind="" brake="21" currentLap="" rpm="6179" speed="43.339" throttle="2" steering="-98" Battery_Pct_Remaining="78" Regin_Active="True" Deploy_Active="False" Deploy_Eligible="True" Lap_Remaining="37"/>
    <Position Car="18" Distance_Behind="" Laps_Behind="" Rank="21" Time_Behind="" brake="0" currentLap="" rpm="8227" speed="70.82" throttle="60" steering="98" Battery_Pct_Remaining="45" Regin_Active="True" Deploy_Active="False" Deploy_Eligible="True" Lap_Remaining="34"/>
    <Position Car="6" Distance_Behind="" Laps_Behind="" Rank="22" Time_Behind="" brake="0" currentLap="" rpm="11911" speed="162.558" throttle="100" steering="-1" Battery_Pct_Remaining="25" Regin_Active="False" Deploy_Active="False" Deploy_Eligible="True" Lap_Remaining="35"/>
    <Position Car="21" Distance_Behind="" Laps_Behind="" Rank="23" Time_Behind="" brake="0" currentLap="" rpm="10357" speed="140.615" throttle="100" steering="0" Battery_Pct_Remaining="9" Regin_Active="False" Deploy_Active="False" Deploy_Eligible="True" Lap_Remaining="44"/>
    <Position Car="90" Distance_Behind="" Laps_Behind="" Rank="24" Time_Behind="" brake="0" currentLap="" rpm="10552" speed="125.097" throttle="100" steering="0" Battery_Pct_Remaining="45" Regin_Active="False" Deploy_Active="True" Deploy_Eligible="True" Lap_Remaining="48"/>
    <Position Car="30" Distance_Behind="" Laps_Behind="" Rank="25" Time_Behind="" brake="1" currentLap="" rpm="7193" speed="62.001" throttle="64" steering="-48" Battery_Pct_Remaining="99" Regin_Active="True" Deploy_Active="False" Deploy_Eligible="True" Lap_Remaining="73"/>
    <Position Car="76" Distance_Behind="" Laps_Behind="" Rank="26" Time_Behind="" brake="0" currentLap="" rpm="8285" speed="68.769" throttle="76" steering="33" Battery_Pct_Remaining="100" Regin_Active="True" Deploy_Active="False" Deploy_Eligible="True" Lap_Remaining="61"/>
    <Position Car="51" Distance_Behind="" Laps_Behind="" Rank="27" Time_Behind="" brake="27" currentLap="" rpm="9442" speed="65.283" throttle="19" steering="14" Battery_Pct_Remaining="56" Regin_Active="True" Deploy_Active="False" Deploy_Eligible="True" Lap_Remaining="78"/>
    </Telemetry_Leaderboard>

    <Completed_Lap Car="12" Fastest_Lap="34" Flag="green" Lap_Number="43" Lap_Time="69.6583" Laps_Behind_Leader="0" Laps_Led="0" Position="12" Time="00:51:22.3572" Time_Behind_Leader="33.5065"/>

    <Unofficial_Leaderboard Cars="27">
    <Position Car="77" Laps_Behind="0" Official="true" Rank="1" Time_Behind="0.0000"/>
    <Position Car="83" Laps_Behind="0" Official="true" Rank="2" Time_Behind="9.7817"/>
    <Position Car="27" Laps_Behind="0" Official="true" Rank="3" Time_Behind="15.6247"/>
    <Position Car="10" Laps_Behind="0" Official="true" Rank="4" Time_Behind="17.3205"/>
    <Position Car="60" Laps_Behind="0" Official="true" Rank="5" Time_Behind="21.0237"/>
    <Position Car="7" Laps_Behind="0" Official="true" Rank="6" Time_Behind="23.4422"/>
    <Position Car="3" Laps_Behind="0" Official="true" Rank="7" Time_Behind="28.8729"/>
    <Position Car="2" Laps_Behind="0" Official="true" Rank="8" Time_Behind="29.9286"/>
    <Position Car="26" Laps_Behind="0" Official="true" Rank="9" Time_Behind="31.3399"/>
    <Position Car="8" Laps_Behind="0" Official="true" Rank="10" Time_Behind="32.1561"/>
    <Position Car="9" Laps_Behind="0" Official="true" Rank="11" Time_Behind="32.9057"/>
    <Position Car="12" Laps_Behind="0" Official="true" Rank="12" Time_Behind="33.5065"/>
    <Position Car="14" Laps_Behind="0" Official="true" Rank="13" Time_Behind="35.8486"/>
    <Position Car="28" Laps_Behind="0" Official="true" Rank="14" Time_Behind="37.2781"/>
    <Position Car="5" Laps_Behind="0" Official="true" Rank="15" Time_Behind="37.6333"/>
    <Position Car="20" Laps_Behind="0" Official="true" Rank="16" Time_Behind="40.5952"/>
    <Position Car="15" Laps_Behind="0" Official="true" Rank="17" Time_Behind="41.7588"/>
    <Position Car="4" Laps_Behind="0" Official="true" Rank="18" Time_Behind="42.9044"/>
    <Position Car="66" Laps_Behind="0" Official="true" Rank="19" Time_Behind="44.7662"/>
    <Position Car="45" Laps_Behind="0" Official="true" Rank="20" Time_Behind="46.9910"/>
    <Position Car="18" Laps_Behind="0" Official="true" Rank="21" Time_Behind="54.7211"/>
    <Position Car="6" Laps_Behind="0" Official="true" Rank="22" Time_Behind="59.2868"/>
    <Position Car="21" Laps_Behind="0" Official="true" Rank="23" Time_Behind="61.3309"/>
    <Position Car="90" Laps_Behind="0" Official="true" Rank="24" Time_Behind="62.8533"/>
    <Position Car="30" Laps_Behind="0" Official="true" Rank="25" Time_Behind="66.0914"/>
    <Position Car="76" Laps_Behind="1" Official="true" Rank="26" Time_Behind="-"/>
    <Position Car="51" Laps_Behind="1" Official="true" Rank="27" Time_Behind="-"/>
    </Unofficial_Leaderboard>

    <Flag Elapsed_Time="509:16:12" Laps_Completed="0" Status="unknown"/>
    </Race_Summary>
    `;

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
            const chunk = chunks[index] + '\\n';
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


