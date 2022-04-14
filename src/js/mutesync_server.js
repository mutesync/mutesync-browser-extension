import { io } from "./socket_io.js";

let currentMeetingClient = null;

export function initMutesyncServerConnection(meetingClientsMap) {
  let socket = io("http://localhost:8249", {
    query: {
      host: window.location.host,
      version: "5.0.1",
    },
    reconnection: true,
    reconnectionDelayMax: 5000,
    reconnectionAttempts: Infinity,
    transports: ["websocket"],
  });
  socket.on("connect", () => {
    console.log("Connected to mutesync server");
  });

  socket.on("getMuteStatus", (data) => {
    currentMeetingClient = meetingClientsMap[window.location.host];

    if (currentMeetingClient)
      socket.emit("muteStatus", {
        data: currentMeetingClient.getStatus(),
        id: data.id || null,
      });
  });

  socket.on("toggleMuteStatus", (data) => {
    //TODO: instead of length check, check if the video element is there
    currentMeetingClient = meetingClientsMap[window.location.host];
    if (currentMeetingClient) {
      if (Object.keys(data).length === 0) {
        currentMeetingClient.toggleMute();
      } else {
        currentMeetingClient.toggleVideo();
      }
      socket.emit("muteStatusToggled", { data: "done", id: data.id || null });
    }
  });

  socket.on("disconnect", () => {
    console.log("Disconnected from mutesync server");
  });
  socket.io.on("reconnect_error", () => {});
  socket.io.on("reconnect_attempt", () => {});
  socket.io.on("connect_error", () => {});
  socket.io.on("error", (error) => {
    if (error.message === "websocket error") {
      return;
    }
    console.error("Socket error: ", error);
  });

  return socket;
}
