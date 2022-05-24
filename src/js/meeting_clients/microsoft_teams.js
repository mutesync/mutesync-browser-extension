import { getElement } from "../utils.js";
import { Clients } from "./clients.js";

export class MicrosoftTeams extends Clients {
  constructor() {
    super();
    this.targetUrls = [
      "teams.microsoft.com",
      "teams.live.com",
      "dod.teams.microsoft.us",
    ];
  }

  getStatus() {
    let status = "";
    if (getElement('[aria-label="Unmute"]')) {
      status += "chromeMute:muted,";
    } else if (getElement('[aria-label="Mute"]')) {
      status += "chromeMute:unmuted,";
    } else {
      status += "chromeMute:disabled,";
    }

    if (getElement('[aria-label="Turn camera on"]')) {
      status += "chromeVideo:stopped,";
    } else if (getElement('[aria-label="Turn camera off"]')) {
      status += "chromeVideo:started,";
    } else {
      status += "chromeVideo:disabled,";
    }

    return status;
  }

  toggleMute() {
    let muteButton =
      getElement('[aria-label="Unmute"]') || getElement('[aria-label="Mute"]');

    if (muteButton) {
      muteButton.click();
    } else {
      console.error("Could not find google meet's mute button");
    }
  }

  toggleVideo() {
    let videoButton =
      getElement('[aria-label="Turn camera on"]') ||
      getElement('[aria-label="Turn camera off"]');

    if (videoButton) {
      videoButton.click();
    } else {
      console.error("Could not find google meet's video button");
    }
    return;
  }
}
