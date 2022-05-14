import {getElement, muteStatus, videoStatus} from '../utils.js';
import {Clients} from './clients.js';

const button_text_map = {
    "mute":{
        "english": `[aria-label="Microphone"]`,
        "japanese": `[aria-label="マイク"]`
    },
    "unmute": {},
    "videoActivate":{
        "english": `[aria-label="Camera"]`,
        "japanese": `[aria-label="カメラ"]`
    },
    "videoDeactivate":{}
}

export class Slack extends Clients {
    constructor() {
        super();
        this.targetUrls = ["app.slack.com"];
        this.muteSelectors = Object.values(button_text_map.mute);
        this.unmuteSelectors = Object.values(button_text_map.unmute);
        this.videoActivateSelectors = Object.values(button_text_map.videoActivate);
        this.videoDeactivateSelectors = Object.values(button_text_map.videoDeactivate);
    }

    getStatus() {
        let status = '';

        const audioButtonSelectors = this.muteSelectors.concat(this.unmuteSelectors);
        audioButtonSelectors.forEach(selector => {
            let button = getElement(selector);
            if (muteStatus(button, "aria-checked", true) != 'disabled'){
                status += `chromeMute:${muteStatus(button, "aria-checked", true)},`;
                return;
            }
        });
        
        const videoButtonSelectors = this.videoActivateSelectors.concat(this.videoDeactivateSelectors);
        videoButtonSelectors.forEach(selector => {
            let button = getElement(selector);
            if (videoStatus(button, "aria-checked", true) != 'disabled'){
                status +=`chromeVideo:${videoStatus(button, "aria-checked", true)},`;
                return;
            }
        });

        console.log("status: ", status)
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