

export function getElement(selector){
    return document.querySelector(selector);    
}

export function getAllElements(selector){
    return document.querySelectorAll(selector);    
}


export function muteStatus(muteButton, attribute, revertAttribute=false){
    
    if(muteButton){
        attribute = muteButton.getAttribute(attribute)
    }else{
        attribute = undefined
    }

    if(revertAttribute && attribute)
        attribute = attribute == "true" ? "false" : "true";

    switch(attribute){
        case 'true':
            return "muted";
        case 'false':
            return "unmuted";
        default:
            return "disabled";
    }
}

export function videoStatus(videoButton, attribute, revertAttribute=false){
    
    if(videoButton){
        attribute = videoButton.getAttribute(attribute)
    }else{
        attribute = undefined
    }

    if(revertAttribute && attribute)
        attribute = attribute == "true" ? "false" : "true";

    switch(attribute){
        case 'true':
            return "stopped";
        case 'false':
            return "started";
        default:
            return "disabled";
    }
}