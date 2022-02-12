import {getElement, muteStatus} from '../utils.js';
import {Clients} from './clients.js';

export class GoogleMeet extends Clients {
    constructor() {
        super();
        this.targetUrls = ["meet.google.com"];
    }

    getStatus() {
        let oldMuteButton = getElement("[data-is-muted] div");
        let newMuteButton = getElement("[data-is-muted] button");
        let videoButton = (
            getElement('[aria-label="Turn off camera (ctrl + e)"]') || 
            getElement('[aria-label="Turn on camera (ctrl + e)"]')
        );
        let status = ''

        if(muteStatus(oldMuteButton, "data-is-muted") != 'disabled'){
            status += `chromeMute:${muteStatus(oldMuteButton, "data-is-muted")},`
        }else{
            status += `chromeMute:${muteStatus(newMuteButton, "data-is-muted")},`
        }

        if(videoButton){
            videoButton = videoButton.getAttribute("data-is-muted") == "true" ? "stopped" : "started";
            status +=`chromeVideo:${videoButton},`;
        }else{
            status +=`chromeVideo:disabled,`;
        }

        return status
    }

    toggleMute() {
        let oldMuteButton = getElement("[data-is-muted] div");
        let newMuteButton = getElement("[data-is-muted] button");

        if(!oldMuteButton && !newMuteButton){
            return "chromeMute:disabled"
        }
        
        if(muteStatus(oldMuteButton, "data-is-muted") != 'disabled'){
            oldMuteButton.click();
        }else{
            newMuteButton.click();
        }
    }

    toggleVideo() {
        let videoButton = (
            getElement('[aria-label="Turn off camera (ctrl + e)"]') || 
            getElement('[aria-label="Turn on camera (ctrl + e)"]')
        );
    
        if(videoButton){
            videoButton.click();
            return "done";
        }else{
            console.error("Could not find google meet's video button");
            return "chromeVideo:disabled,"
        }
    }
}