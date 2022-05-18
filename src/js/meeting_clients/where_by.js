import {getElement, muteStatus, videoStatus} from '../utils.js';
import {Clients} from './clients.js';

/**
 * As of 14-05-2022 WhereBy target button text doesn't require
 * multi language translation to support mutesync chrome extension
 * in multiple languages.
 */
const button_text_map = {
    "mute":{
        "english": "button.jstest-mute-button"
    },
    "unmute": {},
    "videoActivate":{
        "english": `button.jstest-toggle-video`
    },
    "videoDeactivate":{}
}


export class WhereBy extends Clients {
    constructor() {
        super();
        this.targetUrls = ["whereby.com"];
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
            if (muteStatus(button, "aria-pressed", true) != 'disabled'){
                status += `chromeMute:${muteStatus(button, "aria-pressed", true)},`;
                return;
            }
        });
        
        const videoButtonSelectors = this.videoActivateSelectors.concat(this.videoDeactivateSelectors);
        videoButtonSelectors.forEach(selector => {
            let button = getElement(selector);
            if (videoStatus(button, "aria-pressed", true) != 'disabled'){
                status +=`chromeVideo:${videoStatus(button, "aria-pressed", true)},`;
                return;
            }
        });

        console.log("mutesync:", status)
        return status
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