

export class Clients {
    
    //block from creating a new instance of this class
    constructor() {
      if (new.target === Clients) {
        throw new TypeError("Cannot create an instance of an abstract class")
      }

      this.targetUrls = [];
    }
  

    //METHODS WHICH NEEDS TO BE OVERRIDDEN:

    /**
     * Return meeting audio button status 
     * @returns {string} - chromeMute:muted, chromeMute:unmuted, chromeMute:disabled
     */
    getStatus() {
      throw new TypeError("Must override abstract method 'getStatus'")
    }

    /**
     * Toggle meeting audio button state
     */
    toggleMute() {
      throw new TypeError("Must override abstract method 'toggleMute'")
    }



    //METHODS WHICH MAY BE OVERRIDDEN:
    
    /**
     * Toggle meeting video button state 
     */
    toggleVideo() {}
}