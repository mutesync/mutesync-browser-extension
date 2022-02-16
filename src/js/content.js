import {initMutesyncServerConnection} from "./mutesync_server";
import {GoogleMeet} from "./meeting_clients/google_meet.js";
import {Discord} from "./meeting_clients/discord.js";
import {MicrosoftTeams} from "./meeting_clients/microsoft_teams.js";
import {Slack} from "./meeting_clients/slack.js";
import {WhereBy} from "./meeting_clients/where_by.js";

const googleMeetClient = new GoogleMeet();
const discordClient = new Discord();
const microsoftTeamsClient = new MicrosoftTeams();
const slackClient = new Slack();
const whereByClient = new WhereBy();

//Create a map of all the meeting clients ( host -> clientObj )
const meetingClientsMap = {
    ...Object.assign(...googleMeetClient.targetUrls.map(url => ({ [url]: googleMeetClient }))),
    ...Object.assign(...discordClient.targetUrls.map(url => ({ [url]: discordClient }))),
    ...Object.assign(...microsoftTeamsClient.targetUrls.map(url => ({ [url]: microsoftTeamsClient }))),
    ...Object.assign(...slackClient.targetUrls.map(url => ({ [url]: slackClient }))),
    ...Object.assign(...whereByClient.targetUrls.map(url => ({ [url]: whereByClient })))
}

initMutesyncServerConnection(meetingClientsMap);
