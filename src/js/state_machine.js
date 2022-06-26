import { actions, createMachine, interpret, send } from "xstate";
import { GoogleMeet } from "./meeting_clients/google_meet.js";
import { Discord } from "./meeting_clients/discord.js";
import { MicrosoftTeams } from "./meeting_clients/microsoft_teams.js";
import { Slack } from "./meeting_clients/slack.js";
import { WhereBy } from "./meeting_clients/where_by.js";

const googleMeetClient = new GoogleMeet();
const discordClient = new Discord();
const microsoftTeamsClient = new MicrosoftTeams();
const slackClient = new Slack();
const whereByClient = new WhereBy();

// Create a map of all the meeting clients ( host -> clientObj )
const meetingClientsMap = {
  ...Object.assign(
    ...googleMeetClient.targetUrls.map((url) => ({ [url]: googleMeetClient }))
  ),
  ...Object.assign(
    ...discordClient.targetUrls.map((url) => ({ [url]: discordClient }))
  ),
  ...Object.assign(
    ...microsoftTeamsClient.targetUrls.map((url) => ({
      [url]: microsoftTeamsClient,
    }))
  ),
  ...Object.assign(
    ...slackClient.targetUrls.map((url) => ({ [url]: slackClient }))
  ),
  ...Object.assign(
    ...whereByClient.targetUrls.map((url) => ({ [url]: whereByClient }))
  ),
};

const currentMeetingClient = meetingClientsMap[window.location.host];

const createService = (appId) => {
  const agent = { client: currentMeetingClient };

  const machine =
    /** @xstate-layout N4IgpgJg5mDOIC5QFsCuAXOBPAdgYwDowA3MHdWAgBwHsAbOgSxygEFUJGaAhDdGnAGIAYgHkAqgDkAIgH1W46QElRs7uIAqG0ZMShasRui449IAB6IAtAHYADAQDMAJjvOAnI4AcP914AsNgBsADQgWNb+7jZOAIyB-v52QdFeQc6OAL6ZYWiYsLiEJGQU1PRMLOycPHwCguaw6ACGmARNAGaYAE4AFLF2AwCUgnnY+ESk5JS0DMxsHFy86PymSCAGRiZmlgi2Di5unj5efoGh4ZH+AKwEV87ONlexPvdpGdm5GGNFk6XMALJgMDGFiCf4AUXBGiUkgA4rJoRCJBozBtjAJttZXDEbLF7nc7LEUvZYlcwhFdrEXEECF5kv57s5Yu4rjZnB8QKMCuNilMCACgSCoIIFMpVABlDSsDTicWyADCAAlWHDwdJUTRDOjVqAdvcCMlYlT3O5-N5rn5ydZ4klafTGczWeyOTgaBA4GYuYUJiVpuU5lVFrUdetNZsMWsdlZHOkCKagmyvEynlcgucKVY7jd+gmY84nW8OV6eb9KALgXMNVqtpHrdm3C87MEvDZTXZHFbKY5-F47UEGfdHWyi19uT9fVXwyGo94afHE8nSWnO1ZSVS+7Oe453OksjlOaPCpPtZjdv5+nH-AnnEm16n03W0hv3G4bL5rtlskA */
    createMachine(
      {
        context: {
          client: currentMeetingClient,
          isAudioEnabled: false,
          isMuted: false,
          muteTarget: null,
        },
        id: "mutesync",
        type: "parallel",
        states: {
          events: {
            initial: "scanningAudioButton",
            states: {
              scanningAudioButton: {
                entry: "scanAudioButton",
                after: {
                  1000: {
                    target: "scanningAudioButton",
                  },
                },
                on: {
                  FOUND_AUDIO_BUTTON: {
                    target: "inMeeting",
                  },
                },
              },
              inMeeting: {
                entry: ["emitMeetingStartedEvent", "emitStatusUpdateEvent"],
                exit: "emitMeetingEndedEvent",
                on: {
                  MEETING_TIMEOUT: {
                    target: "scanningAudioButton",
                  },
                  AUDIO_STATUS_CHANGED: {
                    actions: "emitStatusUpdateEvent",
                  },
                },
                initial: "pollingAudioButton",
                states: {
                  pollingAudioButton: {
                    entry: "pollAudioButton",
                    after: {
                      1000: {
                        target: "pollingAudioButton",
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
      {
        actions: {
          emitMeetingStartedEvent(context, evt) {
            console.warn({
              type: "meeting-start",
              data: { client: appId },
            });
          },
          emitMeetingEndedEvent(context, evt) {
            console.warn({
              type: "meeting-end",
              data: { client: appId },
            });
          },
          emitStatusUpdateEvent(context, evt) {
            console.warn({
              type: "status-update",
              data: {
                client: appId,
                isAudioEnabled: context.isAudioEnabled,
                isMuted: context.isMuted,
              },
            });
          },
          scanAudioButton(context, evt) {
            let { muteStatus } = currentMeetingClient.getStatus();
            if ("muted" == muteStatus || "unmuted" == muteStatus) {
              agent.emitEvent("FOUND_AUDIO_BUTTON");
            }
          },
          pollAudioButton(context, evt) {
            let { muteStatus } = currentMeetingClient.getStatus();
            // console.warn("audio status->>>>>>>>>>>>>>", muteStatus);
          },
        },
        guards: {},
      }
    );

  const service = interpret(machine);

  let isFirstTransition = true;
  /*service.onTransition((state) => {
    if (isFirstTransition || state.changed) {
      console.log(appId, "state", state.value, state.context);
      isFirstTransition = false;
    }
  });
  service.onEvent((evt) => {
    console.log(appId, "event", evt);
  });*/

  agent.emitEvent = (evt) => {
    service.send(evt);
  };
  service.start();
  return service;
};

const service = createService("google_meet");
