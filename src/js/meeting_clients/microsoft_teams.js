import { getElement } from "../utils.js";
import { Clients } from "./clients.js";

const button_text_map = {
    "mute": {
        "english": `[aria-label="Mute"]`,
        "japanese": `[aria-label="ミュート"]`
    },
    "unmute": {
        "english": `[aria-label="Unmute"]`,
        "japanese": `[aria-label="ミュート解除"]`
    },
    "videoActivate": {
        "english": `[aria-label="Turn camera on"]`,
        "japanese": `[aria-label="カメラをオンにする"]`
    },
    "videoDeactivate": {
        "english": `[aria-label="Turn camera off"]`,
        "japanese": `[aria-label="カメラをオフにする"]`
    }
}

export class MicrosoftTeams extends Clients {
    constructor() {
        super();
        this.targetUrls = [
        "teams.microsoft.com",
        "teams.live.com",
        "dod.teams.microsoft.us",
        ];
        this.muteSelectors = Object.values(button_text_map.mute);
        this.unmuteSelectors = Object.values(button_text_map.unmute);
        this.videoActivateSelectors = Object.values(button_text_map.videoActivate);
        this.videoDeactivateSelectors = Object.values(button_text_map.videoDeactivate);
    }

    getStatus() {
        let status = '';

        //mute status
        this.muteSelectors.forEach(selector => {
        let button = getElement(selector);
        if (button){
            status += `chromeMute:unmuted,`;
            return;
        }
        });

        //unmute status
        this.unmuteSelectors.forEach(selector => {
            let button = getElement(selector);
            if (button){
            status += `chromeMute:muted,`;
            return;
            }
        });

        //video active status
        this.videoActivateSelectors.forEach(selector => {
            let button = getElement(selector);
            if (button){
            status += `chromeMute:stopped,`;
            return;
            }
        });

        //video deactive status
        this.videoDeactivateSelectors.forEach(selector => {
            let button = getElement(selector);
            if (button){
            status += `chromeMute:started,`;
            return;
            }
        });

        console.log(status)
        return status;
    }

    toggleMute() {
        let toggleAction = ''
        const audioButtonSelectors = this.muteSelectors.concat(this.unmuteSelectors);
        audioButtonSelectors.forEach(selector => {
            let button = getElement(selector);
            if (button){
                button.click();
                toggleAction = "done";
                return;
            }
        });

        if (toggleAction != "done") {
            return "chromeMute:disabled";
        }
    }

    toggleVideo() {
        let toggleAction = ''
        const videoButtonSelectors = this.videoActivateSelectors.concat(this.videoDeactivateSelectors);
        videoButtonSelectors.forEach(selector => {
            let button = getElement(selector);
            if (button){
                button.click();
                toggleAction = "done";
                return;
            }
        });

        if (toggleAction != "done") {
            return "chromeVideo:disabled";
        }
    }
}
