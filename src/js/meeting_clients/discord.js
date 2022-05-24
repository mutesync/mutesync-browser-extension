import {getElement, muteStatus} from '../utils.js';
import {Clients} from './clients.js';


export class Discord extends Clients {
    constructor() {
        super();
        this.targetUrls = ["discord.com"];
    }

    getStatus() {
        return `chromeMute:${muteStatus(
            getElement("[aria-label=\"Mute\"]"), 
            "aria-checked"
        )},`;
    }

    toggleMute() {
        let muteButton = getElement("[aria-label=\"Mute\"]");

        if(muteButton){
            muteButton.click();
        }else{
            console.error("Could not find discord's mute button");
        }
    }
}