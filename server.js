const net = require('net');

const port = 1337;
const host = '127.0.0.1';

const clients = []; // Array to store connected client sockets

const telemetryStream = `
<Telemetry_Leaderboard Cars="27">
  <Position Car="77" Distance_Behind="" Laps_Behind="" Rank="1" Time_Behind="" brake="4" currentLap="" rpm="7698" speed="66.718" throttle="0" steering="38" Battery_Pct_Remaining="28" Regin_Active="True" Deploy_Active="False" Deploy_Eligible="True" Lap_Remaining="44"/>
  <Position Car="83" Distance_Behind="" Laps_Behind="" Rank="2" Time_Behind="" brake="36" currentLap="" rpm="8375" speed="75.126" throttle="0" steering="-13" Battery_Pct_Remaining="100" Regin_Active="True" Deploy_Active="False" Deploy_Eligible="True" Lap_Remaining="72"/>
  <Position Car="27" Distance_Behind="" Laps_Behind="" Rank="3" Time_Behind="" brake="0" currentLap="" rpm="11185" speed="75.126" throttle="100" steering="13" Battery_Pct_Remaining="79" Regin_Active="True" Deploy_Active="False" Deploy_Eligible="True" Lap_Remaining="72"/>
  <Position Car="10" Distance_Behind="" Laps_Behind="" Rank="4" Time_Behind="" brake="26" currentLap="" rpm="7309" speed="49.15" throttle="5" steering="-21" Battery_Pct_Remaining="69" Regin_Active="True" Deploy_Active="False" Deploy_Eligible="True" Lap_Remaining="73"/>
  <Position Car="60" Distance_Behind="" Laps_Behind="" Rank="5" Time_Behind="" brake="0" currentLap="" rpm="9699" speed="82.167" throttle="100" steering="3" Battery_Pct_Remaining="34" Regin_Active="True" Deploy_Active="False" Deploy_Eligible="True" Lap_Remaining="77"/>
  <Position Car="7" Distance_Behind="" Laps_Behind="" Rank="6" Time_Behind="" brake="9" currentLap="" rpm="8580" speed="75.81" throttle="0" steering="22" Battery_Pct_Remaining="19" Regin_Active="True" Deploy_Active="False" Deploy_Eligible="True" Lap_Remaining="75"/>
  <Position Car="3" Distance_Behind="" Laps_Behind="" Rank="7" Time_Behind="" brake="0" currentLap="" rpm="11019" speed="167.617" throttle="100" steering="0" Battery_Pct_Remaining="0" Regin_Active="False" Deploy_Active="False" Deploy_Eligible="True" Lap_Remaining="75"/>
  <Position Car="2" Distance_Behind="" Laps_Behind="" Rank="8" Time_Behind="" brake="0" currentLap="" rpm="10582" speed="162.49" throttle="100" steering="-3" Battery_Pct_Remaining="0" Regin_Active="False" Deploy_Active="False" Deploy_Eligible="True" Lap_Remaining="75"/>
  <Position Car="26" Distance_Behind="" Laps_Behind="" Rank="9" Time_Behind="" brake="0" currentLap="" rpm="11757" speed="164.199" throttle="100" steering="-6" Battery_Pct_Remaining="0" Regin_Active="False" Deploy_Active="False" Deploy_Eligible="True" Lap_Remaining="72"/>
  <Position Car="8" Distance_Behind="" Laps_Behind="" Rank="10" Time_Behind="" brake="0" currentLap="" rpm="11267" speed="154.765" throttle="100" steering="-3" Battery_Pct_Remaining="4" Regin_Active="False" Deploy_Active="False" Deploy_Eligible="True" Lap_Remaining="72"/>
  <Position Car="9" Distance_Behind="" Laps_Behind="" Rank="11" Time_Behind="" brake="0" currentLap="" rpm="11104" speed="154.287" throttle="99" steering="-3" Battery_Pct_Remaining="4" Regin_Active="False" Deploy_Active="False" Deploy_Eligible="True" Lap_Remaining="72"/>
  <Position Car="12" Distance_Behind="" Laps_Behind="" Rank="12" Time_Behind="" brake="0" currentLap="" rpm="11305" speed="153.261" throttle="100" steering="-1" Battery_Pct_Remaining="0" Regin_Active="False" Deploy_Active="False" Deploy_Eligible="True" Lap_Remaining="73"/>
  <Position Car="14" Distance_Behind="" Laps_Behind="" Rank="13" Time_Behind="" brake="0" currentLap="" rpm="11272" speed="130.634" throttle="100" steering="0" Battery_Pct_Remaining="27" Regin_Active="False" Deploy_Active="True" Deploy_Eligible="True" Lap_Remaining="80"/>
  <Position Car="28" Distance_Behind="" Laps_Behind="" Rank="14" Time_Behind="" brake="0" currentLap="" rpm="10922" speed="98.916" throttle="99" steering="0" Battery_Pct_Remaining="98" Regin_Active="False" Deploy_Active="False" Deploy_Eligible="True" Lap_Remaining="100"/>
  <Position Car="5" Distance_Behind="" Laps_Behind="" Rank="15" Time_Behind="" brake="0" currentLap="" rpm="9900" speed="89.892" throttle="100" steering="2" Battery_Pct_Remaining="74" Regin_Active="False" Deploy_Active="True" Deploy_Eligible="True" Lap_Remaining="97"/>
  <Position Car="20" Distance_Behind="" Laps_Behind="" Rank="16" Time_Behind="" brake="0" currentLap="" rpm="5729" speed="39.443" throttle="100" steering="-48" Battery_Pct_Remaining="64" Regin_Active="False" Deploy_Active="False" Deploy_Eligible="True" Lap_Remaining="43"/>
  <Position Car="15" Distance_Behind="" Laps_Behind="" Rank="17" Time_Behind="" brake="5" currentLap="" rpm="4219" speed="29.462" throttle="12" steering="-98" Battery_Pct_Remaining="99" Regin_Active="False" Deploy_Active="False" Deploy_Eligible="True" Lap_Remaining="37"/>
  <Position Car="4" Distance_Behind="" Laps_Behind="" Rank="18" Time_Behind="" brake="14" currentLap="" rpm="5812" speed="41.425" throttle="0" steering="-44" Battery_Pct_Remaining="88" Regin_Active="True" Deploy_Active="False" Deploy_Eligible="True" Lap_Remaining="32"/>
  <Position Car="66" Distance_Behind="" Laps_Behind="" Rank="19" Time_Behind="" brake="0" currentLap="" rpm="8944" speed="78.271" throttle="62" steering="29" Battery_Pct_Remaining="81" Regin_Active="True" Deploy_Active="False" Deploy_Eligible="True" Lap_Remaining="32"/>
  <Position Car="45" Distance_Behind="" Laps_Behind="" Rank="20" Time_Behind="" brake="2" currentLap="" rpm="9564" speed="84.56" throttle="12" steering="30" Battery_Pct_Remaining="42" Regin_Active="True" Deploy_Active="False" Deploy_Eligible="True" Lap_Remaining="37"/>
  <Position Car="18" Distance_Behind="" Laps_Behind="" Rank="21" Time_Behind="" brake="0" currentLap="" rpm="11402" speed="154.423" throttle="100" steering="-98" Battery_Pct_Remaining="9" Regin_Active="False" Deploy_Active="False" Deploy_Eligible="True" Lap_Remaining="34"/>
  <Position Car="6" Distance_Behind="" Laps_Behind="" Rank="22" Time_Behind="" brake="0" currentLap="" rpm="11129" speed="102.06" throttle="100" steering="0" Battery_Pct_Remaining="77" Regin_Active="False" Deploy_Active="True" Deploy_Eligible="True" Lap_Remaining="50"/>
  <Position Car="21" Distance_Behind="" Laps_Behind="" Rank="23" Time_Behind="" brake="0" currentLap="" rpm="7541" speed="67.47" throttle="0" steering="-47" Battery_Pct_Remaining="68" Regin_Active="True" Deploy_Active="False" Deploy_Eligible="True" Lap_Remaining="63"/>
  <Position Car="90" Distance_Behind="" Laps_Behind="" Rank="24" Time_Behind="" brake="30" currentLap="" rpm="9931" speed="86.611" throttle="0" steering="-13" Battery_Pct_Remaining="100" Regin_Active="True" Deploy_Active="False" Deploy_Eligible="True" Lap_Remaining="64"/>
  <Position Car="30" Distance_Behind="" Laps_Behind="" Rank="25" Time_Behind="" brake="0" currentLap="" rpm="8944" speed="78.886" throttle="98" steering="28" Battery_Pct_Remaining="82" Regin_Active="False" Deploy_Active="False" Deploy_Eligible="True" Lap_Remaining="73"/>
  <Position Car="76" Distance_Behind="" Laps_Behind="" Rank="26" Time_Behind="" brake="43" currentLap="" rpm="9332" speed="126.464" throttle="0" steering="2" Battery_Pct_Remaining="69" Regin_Active="True" Deploy_Active="False" Deploy_Eligible="True" Lap_Remaining="61"/>
  <Position Car="51" Distance_Behind="" Laps_Behind="" Rank="27" Time_Behind="" brake="0" currentLap="" rpm="8100" speed="68.769" throttle="92" steering="25" Battery_Pct_Remaining="46" Regin_Active="True" Deploy_Active="False" Deploy_Eligible="True" Lap_Remaining="78"/>
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

<Flag Elapsed_Time="00:51:23" Laps_Completed="43" Status="green"/>

<Car_Status Car="28" Extended_Status="Active" GPS_Strength="100" Status="Active" Status_Code="1" Tire_Type="1" Push_To_Pass_Time_Left="54"/>

<Race_Summary>
<Session_Id>R1</Session_Id>
<Flag>green</Flag>
<Start_Time/>
<Elapsed_Time>00:51:23</Elapsed_Time>
<Average_Speed>99.9099230480318</Average_Speed>
<Cars_Running>27</Cars_Running>
<Cars_Started>27</Cars_Started>
<Cars_On_Lead_Lap>25</Cars_On_Lead_Lap>
<Leaders>5</Leaders>
<Lead_Changes>6</Lead_Changes>
<Laps_Scheduled>90</Laps_Scheduled>
<Laps_Completed>43</Laps_Completed>
<Cautions>0</Cautions>
<Caution_Laps>0</Caution_Laps>
<Laps_To_Go>47</Laps_To_Go>
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
        let xmlString = telemetryStream;
        let chunks = [];
        let tagStack = [];
        let currentChunk = '';
        let lastPos = 0;

        while (lastPos < xmlString.length) {
            const startTagOpen = xmlString.indexOf('<', lastPos);
            if (startTagOpen === -1) {
                break; // No more tags
            }

            const startTagClose = xmlString.indexOf('>', startTagOpen);
            if (startTagClose === -1) {
                break; // Invalid XML
            }

            const tagName = xmlString.substring(startTagOpen + 1, startTagClose).split(' ')[0]; // Extract tag name
            const isClosingTag = tagName.startsWith('/');
            const isSelfClosing = xmlString.substring(startTagClose - 1, startTagClose) === '/';

            if (!isClosingTag) {
                tagStack.push(tagName);
                currentChunk = xmlString.substring(lastPos, startTagClose + 1);
            } else {
                const matchingTag = tagStack.pop();
                 if (matchingTag === tagName.slice(1)) {
                    currentChunk += xmlString.substring(lastPos, startTagClose + 1);
                    chunks.push(currentChunk);
                    currentChunk = '';
                }
            }
            lastPos = startTagClose + 1;
             if (tagStack.length === 0 && currentChunk) {
                  chunks.push(currentChunk);
                  currentChunk = '';
             }
        }

        console.log("Extracted Chunks:", chunks);

      if (chunks.length > 0) {
        let index = 0;
        const intervalId = setInterval(() => {
          if (index < chunks.length) {
            const chunk = chunks[index] + '\\n';
            console.log('Sending chunk:', chunk);  // Log the chunk being sent
            broadcast(chunk);
            index++;
          } else {
            clearInterval(intervalId);
            console.log('Telemetry stream playback complete.');
          }
        }, 1000); // Send every 1 second
      } else {
        console.log('No chunks found in the XML stream.');
      }
    }

    function broadcast(data) {
      clients.forEach((client) => {
        client.write(data);
      });
    }

    server.on('connection', (socket) => {  // Log new connections
        console.log('New client connected:', socket.remoteAddress);
    });

    server.listen(port, host, () => {
      console.log('TCP server listening on', host + ':' + port);
      playBackTelemetryStream();
    });
    
