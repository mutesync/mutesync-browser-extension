import {getElement, muteStatus} from '../utils.js';
import {Clients} from './clients.js';

const button_text_map = {
    "mute":{
        "english": "[aria-label=\"Mute\"]",
        "japanese": "[aria-label='ミュート']"
    },
    "unmute": {},
    "videoActivate":{},
    "videoDeactivate":{}
}


export class Discord extends Clients {
    constructor() {
        super();
        this.targetUrls = ["discord.com"];
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
            if (muteStatus(button, "aria-checked") != 'disabled'){
                status += `chromeMute:${muteStatus(button, "aria-checked")},`;
                return;
            }
        });

        return status;
    }

    toggleMute() {
        let toggleAction = ''
        const audioButtonSelectors = this.muteSelectors.concat(this.unmuteSelectors);
        audioButtonSelectors.forEach(selector => {
            let button = getElement(selector);
            if (muteStatus(button, "aria-checked") != 'disabled'){
                button.click();
                toggleAction = "done";
                return;
            }
        });

        if (toggleAction != "done") {
            return "chromeMute:disabled";
        }
    }
}