import {getElement, muteStatus, videoStatus} from '../utils.js';
import {Clients} from './clients.js';

const button_text_map = {
    "mute":{
        "english": "[data-is-muted] div",
        "english.1": "[data-is-muted] button"
    },
    "unmute": {},
    "videoActivate":{
        "english": `[aria-label="Turn on camera (ctrl + e)"]`,
        "japanese": `[aria-label="カメラをオンにする（⌘+E キー）"]`,
        "german": `[aria-label="Kamera deaktivieren (⌘ + e)"]`,
        "chinese": `[aria-label="开启摄像头 (⌘ + e)"]`,
        "chinese.traditional": `[aria-label="開啟相機 (⌘ + e)"]`,
        "french": `[aria-label="Activer la caméra (⌘+e)"]`,
        "polish": `[aria-label="Włącz kamerę (⌘ + E)"]`,
    },
    "videoDeactivate":{
        "english": `[aria-label="Turn off camera (ctrl + e)"]`,
        "japanese": `[aria-label="カメラをオフにする（⌘+E キー）"]`,
        "german": `[aria-label="Kamera aktivieren (⌘ + e)"]`,
        "chinese": `[aria-label="关闭摄像头 (⌘ + e)"]`,
        "chinese.traditional": `[aria-label="關閉相機 (⌘ + e)"]`,
        "french": `[aria-label="Désactiver la caméra (⌘+e)"]`,
        "polish": `[aria-label="Wyłącz kamerę (⌘ + E)"]`,
    }
}


export class GoogleMeet extends Clients {
    constructor() {
        super();
        this.targetUrls = ["meet.google.com"];
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
            if (muteStatus(button, "data-is-muted") != 'disabled'){
                status += `chromeMute:${muteStatus(button, "data-is-muted")},`;
                return;
            }
        });
        
        const videoButtonSelectors = this.videoActivateSelectors.concat(this.videoDeactivateSelectors);
        videoButtonSelectors.forEach(selector => {
            let button = getElement(selector);
            if (videoStatus(button, "data-is-muted") != 'disabled'){
                status +=`chromeVideo:${videoStatus(button, "data-is-muted")},`;
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
            if (muteStatus(button, "data-is-muted") != 'disabled'){
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
            if (videoStatus(button, "data-is-muted") != 'disabled'){
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