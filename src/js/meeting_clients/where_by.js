import {getElement, muteStatus} from '../utils.js';
import {Clients} from './clients.js';


export class WhereBy extends Clients {
    constructor() {
        super();
        this.targetUrls = ["whereby.com"];
    }

    getStatus() {
        let muteButton = getElement('button.jstest-mute-button');
        let videoButton = getElement('button.jstest-toggle-video');
        let status = "";

        if(muteButton){
            status += `chromeMute:${muteStatus(muteButton, "aria-pressed", true)},`
        }else{
            status += "chromeMute:disabled,"
        }

        if(videoButton){
            videoButton = videoButton.getAttribute("aria-pressed") == "true" ? "chromeVideo:started" : "chromeVideo:stopped";
        }else{
            return "chromeVideo:disabled"
        }

        return status;
    }

    toggleMute() {
        let muteButton = getElement('button.jstest-mute-button');

        if(muteButton){
            muteButton.click()
        }else{
            console.error("Could not find whereBy's mute button")
        }
    }

    toggleVideo() {
        let videoButton = getElement('button.jstest-toggle-video');

        if(videoButton){
            videoButton.click()
        }else{
            console.error("Could not find whereBy's video button")
        }
    }
}