import {getElement, muteStatus} from '../utils.js';
import {Clients} from './clients.js';


export class Slack extends Clients {
    constructor() {
        super();
        this.targetUrls = ["app.slack.com"];
    }

    getStatus() {
        let muteButton = getElement('[aria-label="Microphone"]');
        let videoButton = getElement('[aria-label="Camera"]') || "disabled";
        let status = ''

        if(muteButton){
            status += `chromeMute:${muteStatus(muteButton, "aria-checked", true)},`
        }else{
            status += "chromeMute:disabled,"
        }

        if(videoButton){
            videoButton = videoButton.getAttribute("aria-checked") == "true" ? "chromeVideo:started" : "chromeVideo:stopped";
        }else{
            status += "chromeVideo:disabled"
        }

        return status;
    }

    toggleMute() {
        let muteButton = getElement('[aria-label="Microphone"]');
        if(muteButton){
            muteButton.click()
        }else{
            console.error("Could not find slack's mute button")
        }
    }

    toggleVideo() {
        let videoButton = getElement('[aria-label="Camera"]');
        if(videoButton){
            videoButton.click()
        }else{
            console.error("Could not find slack's video button")
        }
    }
}