const net = require('net');

const port = 1337;
const host = '127.0.0.1';

const clients = []; // Array to store connected client sockets

const xmlStream = `
<Unofficial_Leaderboard Cars="27">
<Position Car="77" Laps_Behind="0" Official="true" Rank="1" Time_Behind="0.0000"/>
<Position Car="83" Laps_Behind="0" Official="true" Rank="2" Time_Behind="9.7474"/>
<Position Car="27" Laps_Behind="0" Official="true" Rank="3" Time_Behind="15.3526"/>
<Position Car="10" Laps_Behind="0" Official="true" Rank="4" Time_Behind="17.1304"/>
<Position Car="60" Laps_Behind="0" Official="true" Rank="5" Time_Behind="21.1735"/>
<Position Car="7" Laps_Behind="0" Official="true" Rank="6" Time_Behind="23.4744"/>
<Position Car="3" Laps_Behind="0" Official="true" Rank="7" Time_Behind="29.1210"/>
<Position Car="2" Laps_Behind="0" Official="true" Rank="8" Time_Behind="30.2215"/>
<Position Car="26" Laps_Behind="0" Official="true" Rank="9" Time_Behind="31.4069"/>
<Position Car="8" Laps_Behind="0" Official="true" Rank="10" Time_Behind="32.2802"/>
<Position Car="9" Laps_Behind="0" Official="true" Rank="11" Time_Behind="32.9515"/>
<Position Car="12" Laps_Behind="0" Official="true" Rank="12" Time_Behind="33.5440"/>
<Position Car="14" Laps_Behind="0" Official="true" Rank="13" Time_Behind="35.9015"/>
<Position Car="28" Laps_Behind="0" Official="true" Rank="14" Time_Behind="37.0803"/>
<Position Car="5" Laps_Behind="0" Official="true" Rank="15" Time_Behind="37.1824"/>
<Position Car="20" Laps_Behind="0" Official="true" Rank="16" Time_Behind="40.6637"/>
<Position Car="15" Laps_Behind="0" Official="true" Rank="17" Time_Behind="41.8275"/>
<Position Car="4" Laps_Behind="0" Official="true" Rank="18" Time_Behind="42.9164"/>
<Position Car="66" Laps_Behind="0" Official="true" Rank="19" Time_Behind="44.6776"/>
<Position Car="45" Laps_Behind="0" Official="true" Rank="20" Time_Behind="47.0935"/>
<Position Car="18" Laps_Behind="0" Official="true" Rank="21" Time_Behind="54.7211"/>
<Position Car="6" Laps_Behind="0" Official="true" Rank="22" Time_Behind="59.3667"/>
<Position Car="21" Laps_Behind="0" Official="true" Rank="23" Time_Behind="61.4974"/>
<Position Car="90" Laps_Behind="0" Official="true" Rank="24" Time_Behind="62.9395"/>
<Position Car="30" Laps_Behind="0" Official="true" Rank="25" Time_Behind="66.2696"/>
<Position Car="76" Laps_Behind="1" Official="true" Rank="26" Time_Behind="-"/>
<Position Car="51" Laps_Behind="1" Official="true" Rank="27" Time_Behind="-"/>
</Unofficial_Leaderboard>

<Telemetry_Leaderboard Cars="27">
<Position Car="77" Distance_Behind="" Laps_Behind="" Rank="1" Time_Behind="" brake="0" currentLap="" rpm="11299" speed="130.498" throttle="100" steering="0" Battery_Pct_Remaining="22" Regin_Active="False" Deploy_Active="False" Deploy_Eligible="True" Lap_Remaining="32"/>
<Position Car="83" Distance_Behind="" Laps_Behind="" Rank="2" Time_Behind="" brake="0" currentLap="" rpm="9845" speed="86.611" throttle="100" steering="26" Battery_Pct_Remaining="99" Regin_Active="False" Deploy_Active="False" Deploy_Eligible="True" Lap_Remaining="59"/>
<Position Car="27" Distance_Behind="" Laps_Behind="" Rank="3" Time_Behind="" brake="0" currentLap="" rpm="11331" speed="134.873" throttle="100" steering="0" Battery_Pct_Remaining="61" Regin_Active="False" Deploy_Active="False" Deploy_Eligible="True" Lap_Remaining="61"/>
<Position Car="10" Distance_Behind="" Laps_Behind="" Rank="4" Time_Behind="" brake="0" currentLap="" rpm="10554" speed="116.005" throttle="100" steering="0" Battery_Pct_Remaining="70" Regin_Active="False" Deploy_Active="True" Deploy_Eligible="True" Lap_Remaining="66"/>
<Position Car="60" Distance_Behind="" Laps_Behind="" Rank="5" Time_Behind="" brake="0" currentLap="" rpm="7496" speed="66.035" throttle="6" steering="-51" Battery_Pct_Remaining="92" Regin_Active="True" Deploy_Active="False" Deploy_Eligible="True" Lap_Remaining="77"/>
<Position Car="7" Distance_Behind="" Laps_Behind="" Rank="6" Time_Behind="" brake="0" currentLap="" rpm="9606" speed="82.099" throttle="100" steering="1" Battery_Pct_Remaining="72" Regin_Active="False" Deploy_Active="False" Deploy_Eligible="True" Lap_Remaining="75"/>
<Position Car="3" Distance_Behind="" Laps_Behind="" Rank="7" Time_Behind="" brake="0" currentLap="" rpm="5908" speed="41.972" throttle="64" steering="-70" Battery_Pct_Remaining="64" Regin_Active="True" Deploy_Active="False" Deploy_Eligible="True" Lap_Remaining="75"/>
<Position Car="2" Distance_Behind="" Laps_Behind="" Rank="8" Time_Behind="" brake="22" currentLap="" rpm="7719" speed="53.593" throttle="0" steering="-20" Battery_Pct_Remaining="45" Regin_Active="True" Deploy_Active="False" Deploy_Eligible="True" Lap_Remaining="75"/>
<Position Car="26" Distance_Behind="" Laps_Behind="" Rank="9" Time_Behind="" brake="8" currentLap="" rpm="10559" speed="101.308" throttle="18" steering="-14" Battery_Pct_Remaining="36" Regin_Active="False" Deploy_Active="False" Deploy_Eligible="True" Lap_Remaining="72"/>
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

<Flag Elapsed_Time="00:51:36" Laps_Completed="43" Status="green"/>

<Race_Summary>
<Session_Id>R1</Session_Id>
<Flag>green</Flag>
<Start_Time/>
<Elapsed_Time>00:51:36</Elapsed_Time>
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

function extractRootTags(xmlString) {
  const rootTags = [];
  let currentIndex = 0;

  while (currentIndex < xmlString.length) {
    const startTagStartIndex = xmlString.indexOf('<', currentIndex);
    if (startTagStartIndex === -1) break;

    const startTagEndIndex = xmlString.indexOf('>', startTagStartIndex);
    if (startTagEndIndex === -1) break;

    const startTagName = xmlString.substring(startTagStartIndex + 1, startTagEndIndex).split(' ')[0];

    let endTag = `</${startTagName}>`;
    let endTagIndex = xmlString.indexOf(endTag, startTagEndIndex);

    if (endTagIndex === -1) {
      // Handle self-closing tags
      if (xmlString.substring(startTagEndIndex - 1, startTagEndIndex) === '/') {
        rootTags.push(xmlString.substring(startTagStartIndex, startTagEndIndex + 1));
        currentIndex = startTagEndIndex + 1;
        continue;
      }
        break; // Error: No matching closing tag found
    }
    
    let tagStack = [tagName];
    let searchIndex = startTagEndIndex + 1;
    
    while(tagStack.length > 0){
        const nextStartTag = xmlString.indexOf('<', searchIndex);
        const nextEndTag = xmlString.indexOf('</', searchIndex);
        
        if(nextStartTag === -1 && nextEndTag === -1){
            break;
        }
        
        if(nextStartTag !== -1 && nextStartTag < nextEndTag){
            const nextTagName = xmlString.substring(nextStartTag+1, xmlString.indexOf('>',nextStartTag)).split(' ')[0];
            tagStack.push(nextTagName);
            searchIndex = xmlString.indexOf('>',nextStartTag) + 1;
            
        } else if (nextEndTag !== -1){
            const closingTagName = xmlString.substring(nextEndTag+2, xmlString.indexOf('>',nextEndTag)).split(' ')[0];
            const topOfStack = tagStack[tagStack.length-1];
            if(topOfStack === closingTagName){
                tagStack.pop();
                searchIndex = xmlString.indexOf('>',nextEndTag) + 1;
            }
            else{
                searchIndex = xmlString.indexOf('>',nextEndTag) + 1;
            }
        }
    }
    
    endTagIndex = searchIndex - endTag.length;
    rootTags.push(xmlString.substring(startTagStartIndex, endTagIndex + endTag.length));
    currentIndex = endTagIndex + endTag.length;
  }
  return rootTags;
}

const extractedTags = extractRootTags(xmlStream);
console.log(extractedTags);
