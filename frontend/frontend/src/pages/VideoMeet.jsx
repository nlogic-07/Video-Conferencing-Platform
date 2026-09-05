import React, { useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";

import { IconButton, Badge, TextField, Button } from "@mui/material";
import VideocamIcon from "@mui/icons-material/Videocam";
import VideocamOffIcon from "@mui/icons-material/VideocamOff";
import styles from "../styles/videoComponent.module.css";
import CallEndIcon from "@mui/icons-material/CallEnd";
import MicIcon from "@mui/icons-material/Mic";
import MicOffIcon from "@mui/icons-material/MicOff";
import ScreenShareIcon from "@mui/icons-material/ScreenShare";
import StopScreenShareIcon from "@mui/icons-material/StopScreenShare";
import ChatIcon from "@mui/icons-material/Chat";

const connections = {};

const peerConfigurations = {
  iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
};

const VideoMeetComponent = () => {
  var socketRef = useRef();
  let socketIdRef = useRef();

  const localVideoRef = useRef();

  const [remoteVideos, setRemoteVideos] = useState([]);
  const remoteVideosRef = useRef([]);

  const [video, setVideo] = useState([]);
  const [audio, setAudio] = useState();
  const [screen, setScreen] = useState();

  const [userName, setUserName] = useState("");
  const [askForUserName, setAskForUserName] = useState(true);

  let [showModal, setModal] = useState(false);
  let [messages, setMessages] = useState([]);
  let [message, setMessage] = useState("");
  let [newMessages, setNewMessages] = useState();

  const [videoAvailable, setVideoAvailable] = useState(false);
  const [audioAvailable, setAudioAvailable] = useState(false);
  const [screenAvailable, setScreenAvailable] = useState();

  //1
  useEffect(() => {
    getPermissions();
  }, []);

  useEffect(() => {
    if (video !== undefined && audio !== undefined) {
      getUserMedia();
    }
  }, [video, audio]);

  useEffect(() => {
    if (screen !== undefined) {
      getDisplayMedia();
    }
  }, [screen]);

  const getDisplayMedia = () => {
    if (screen) {
      if (navigator.mediaDevices.getDisplayMedia) {
        navigator.mediaDevices
          .getDisplayMedia({ video: true, audio: true })
          .then(getDisplayMediaSuccess)
          .catch((e) => console.log(e));
      }
    }
  };

  const getDisplayMediaSuccess = (stream) => {
    try {
      window.localStream.getTracks().forEach((track) => track.stop());
    } catch (e) {
      console.log(e);
    }
    window.localStream = stream;
    localVideoRef.current.srcObject = stream;

    for (let id in connections) {
      if (id === socketIdRef.current) continue;

      connections[id].addStream(window.localStream);

      connections[id].createOffer().then((description) => {
        connections[id]
          .setLocalDescription(description)
          .then(() => {
            socketRef.current.emit(
              "signal",
              id,
              JSON.stringify({ sdp: connections[id].localDescription }),
            );
          })
          .catch((e) => console.log(e));
      });
    }

    stream.getTracks().forEach(
      (track) =>
        (track.onended = () => {
          setScreen(false);

          try {
            let tracks = localVideoRef.current.srcObject.getTracks();
            tracks.forEach((track) => track.stop());
          } catch (e) {
            console.log(e);
          }

          let blackSilence = (...args) =>
            new MediaStream([black(...args), silence()]);
          window.localStream = blackSilence();
          localVideoRef.current.srcObject = window.localStream;

          getUserMedia();
        }),
    );
  };
  //2
  const getPermissions = async () => {
    try {
      const videoPermission = await navigator.mediaDevices.getUserMedia({
        video: true,
      });
      if (videoPermission) {
        setVideoAvailable(true);
        console.log("Video Permisson granted!!");
      } else {
        setVideoAvailable(false);
        console.log("Video Permission not granted!!");
      }

      const audioPermission = await navigator.mediaDevices.getUserMedia({
        audio: true,
      });
      if (audioPermission) {
        setAudioAvailable(true);
        console.log("Audio Permisson granted!!");
      } else {
        setAudioAvailable(false);
        console.log("Audio Permisson not granted!!");
      }

      if (navigator.mediaDevices.getDisplayMedia) {
        setScreenAvailable(true);
      } else {
        setScreenAvailable(false);
      }

      if (videoPermission || audioPermission) {
        const userMediaStream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: true,
        });

        if (userMediaStream) {
          window.localStream = userMediaStream;
          if (localVideoRef.current) {
            localVideoRef.current.srcObject = userMediaStream;
          }
        }
      }
    } catch (e) {
      console.log(e);
    }
  };

  const getUserMediaSuccess = (stream) => {
    try {
      window.localStream.getTracks().forEach((track) => track.stop());
    } catch (e) {
      console.log(e);
    }
    window.localStream = stream;
    localVideoRef.current.srcObject = stream;

    //renegotiation if mediaStream changes
    for (let id in connections) {
      if (id === socketIdRef.current) continue;
      connections[id].addStream(window.localStream);

      connections[id].createOffer().then((description) => {
        console.log(description);
        connections[id]
          .setLocalDescription(description)
          .then(() => {
            socketRef.current.emit(
              "signal",
              id,
              JSON.stringify({ sdp: connections[id].localDescription }),
            );
          })
          .catch((e) => console.log(e));
      });
    }

    //handling when streams gets ended unexpectedly
    stream.getTracks().forEach(
      (track) =>
        (track.onended = () => {
          setVideo(false);
          setAudio(false);

          try {
            let tracks = localVideoRef.current.srcObject.getTracks();
            tracks.forEach((track) => track.stop());
          } catch (e) {
            console.log(e);
          }

          let blackSilence = (...args) =>
            new MediaStream([black(...args), silence()]);

          window.localStream = blackSilence();
          localVideoRef.current.srcObject = window.localStream;

          for (let id in connections) {
            connections[id].addStream(window.localStream);

            connections[id].createOffer().then((description) => {
              connections[id]
                .setLocalDescription(description)
                .then(() => {
                  socketRef.current.emit(
                    "signal",
                    id,
                    JSON.stringify({ sdp: connections[id].localDescription }),
                  );
                })
                .catch((e) => console.log(e));
            });
          }
        }),
    );
  };

  const getUserMedia = () => {
    if ((video && videoAvailable) || (audio && audioAvailable)) {
      navigator.mediaDevices
        .getUserMedia({ video: video, audio: audio })
        .then(getUserMediaSuccess)
        .catch((e) => console.log(e));
    } else {
      //    hold on

      try {
        let tracks = localVideoRef.current.srcObject.getTracks();
        tracks.forEach((track) => track.stop());
      } catch (e) {}
    }
  };

  const gotMessageFromServer = (fromId, message) => {
    let signal = JSON.parse(message);
    if (socketIdRef.current !== fromId) {
      if (signal.sdp) {
        connections[fromId]
          .setRemoteDescription(new RTCSessionDescription(signal.sdp))
          .then(() => {
            if (signal.sdp.type === "offer") {
              connections[fromId]
                .createAnswer()
                .then((description) => {
                  connections[fromId]
                    .setLocalDescription(description)
                    .then(() => {
                      socketRef.current.emit(
                        "signal",
                        fromId,
                        JSON.stringify({
                          sdp: connections[fromId].localDescription,
                        }),
                      );
                    })
                    .catch((e) => console.log(e));
                })
                .catch((e) => console.log(e));
            }
          });
      }
      if (signal.ice) {
        connections[fromId]
          .addIceCandidate(new RTCIceCandidate(signal.ice))
          .catch((e) => console.log(e));
      }
    }
  };

  const connectToSocketServer = () => {
    socketRef.current = io.connect("http://localhost:9000", { secure: false });

    socketRef.current.on("signal", gotMessageFromServer);
    socketRef.current.on("connect", () => {
      socketRef.current.emit("join-call", window.location.href); //for now see this
      socketIdRef.current = socketRef.current.id;

      socketRef.current.on("chat-message", addMessage);
      socketRef.current.on("user-left", (id) => {});

      socketRef.current.on("user-joined", (id, clients) => {
        clients.forEach((socketListId) => {
          connections[socketListId] = new RTCPeerConnection(peerConfigurations);

          //registering event listeners on each peerConnection
          connections[socketListId].onicecandidate = (e) => {
            if (e.candidate != null) {
              socketRef.current.emit(
                "signal",
                socketListId,
                JSON.stringify({ ice: e.candidate }),
              );
            }
          };

          connections[socketListId].onaddstream = (e) => {
            console.log("STREAM RECEIVED FROM", socketListId, e.stream);
            let videoExists = remoteVideosRef.current.find(
              (remoteVideo) => remoteVideo.socketId === socketListId,
            );
            if (videoExists) {
              setRemoteVideos((remoteVideos) => {
                const updateRemoteVideos = remoteVideos.map((remoteVideo) =>
                  remoteVideo.socketId === socketListId
                    ? { ...remoteVideo, stream: e.stream }
                    : remoteVideo,
                );
                remoteVideosRef.current = updateRemoteVideos;
                return updateRemoteVideos;
              });
            } else {
              let newRemoteVideo = {
                socketId: socketListId,
                stream: e.stream,
                autoplay: true,
                playsinline: true,
              };
              setRemoteVideos((remoteVideos) => {
                const updatedRemoteVideos = [...remoteVideos, newRemoteVideo];
                remoteVideosRef.current = updatedRemoteVideos;
                return updatedRemoteVideos;
              });
            }
          };

          //Adding localVideoStream to peerConnection
          if (window.localStream !== undefined && window.localStream !== null) {
            connections[socketListId].addStream(window.localStream);
          } else {
            let blackSilence = (...args) =>
              new MediaStream([black(...args), silence()]);
            window.localStream = blackSilence();
            connections[socketListId].addStream(window.localStream);
          }
        });

        if (id === socketIdRef.current) {
          for (let id2 in connections) {
            if (id2 === socketIdRef.current) continue;

            try {
              connections[id2].addStream(window.localStream);
            } catch (e) {}

            connections[id2].createOffer().then((description) => {
              connections[id2].setLocalDescription(description).then(() => {
                socketRef.current.emit(
                  "signal",
                  id2,
                  JSON.stringify({ sdp: connections[id2].localDescription }),
                );
              });
            });
          }
        }
      });
    });
  };

  const black = ({ width = 640, height = 480 } = {}) => {
    let canvas = Object.assign(document.createElement("canvas"), {
      width,
      height,
    });
    canvas.getContext("2d").fillRect(0, 0, width, height);

    let stream = canvas.captureStream();
    return Object.assign(stream.getVideoTracks()[0], { enabled: false });
  };

  const silence = () => {
    let ctx = new AudioContext();
    let oscillator = ctx.createOscillator();
    let dst = oscillator.connect(ctx.createMediaStreamDestination());
    oscillator.start();
    ctx.resume();
    return Object.assign(dst.stream.getAudioTracks()[0], { enabled: false });
  };

  const getMedia = () => {
    setVideo(videoAvailable);
    setAudio(audioAvailable);
    //this will run first as its sync
    connectToSocketServer();
  };

  const connect = () => {
    setAskForUserName(false);
    getMedia();
  };

  const handleVideo = () => {
    setVideo(!video);
  };
  const handleAudio = () => {
    setAudio(!audio);
  };
  const handleScreen = () => {
    setScreen(!screen);
  };

  const handleEndCall = () => {
    try {
      let tracks = localVideoref.current.srcObject.getTracks();
      tracks.forEach((track) => track.stop());
    } catch (e) {}
    window.location.href = "/home";
  };

  const openChat = () => {
    setModal(true);
    setNewMessages(0);
  };

  const closeChat = () => {
    setModal(false);
  };

  const handleMessage = () => {};

  const addMessage = (data, sender, socketIdSender) => {
    setMessages((prevMessages) => [
      ...prevMessages,
      {
        sender: sender,
        data: data,
      },
    ]);

    if (socketIdSender !== socketIdRef.current) {
      setNewMessages((prevNewMessages) => prevNewMessages + 1);
    }
  };

  const sendMessage = () => {
    socketRef.current.emit("chat-message", message, userName);
    setMessage("");
  };

  return (
    <div>
      {askForUserName === true ? (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
          <div className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-md">
            <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">
              Enter Lobby
            </h2>

            <input
              type="text"
              placeholder="Enter username"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent mb-4"
            />

            <button
              onClick={connect}
              className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition duration-200"
            >
              Connect
            </button>
            <br></br>
            <br></br>
            <video ref={localVideoRef} autoPlay muted></video>
          </div>
        </div>
      ) : (
        <div className={styles.meetVideoContainer}>
          {showModal ? (
            <div className={styles.chatRoom}>
              <div className={styles.chatContainer}>
                <div className={styles.chatHeader}>
                  <h2>Chat</h2>
                  <span>{messages.length} messages</span>
                </div>

                <div className={styles.chattingDisplay}>
                  {messages.length !== 0 ? (
                    messages.map((item, index) => (
                      <div
                        key={index}
                        className={`${styles.messageBubble} ${
                          item.sender === userName
                            ? styles.myMessage
                            : styles.otherMessage
                        }`}
                      >
                        <span className={styles.sender}>{item.sender}</span>
                        <p>{item.data}</p>
                      </div>
                    ))
                  ) : (
                    <div className={styles.emptyChat}>No messages yet 👋</div>
                  )}
                </div>

                <div className={styles.chattingArea}>
                  <TextField
                    fullWidth
                    size="small"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Type a message..."
                    variant="outlined"
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        borderRadius: "14px",
                        backgroundColor: "rgba(255,255,255,0.06)",
                        color: "#fff",

                        "& fieldset": {
                          borderColor: "rgba(255,255,255,0.1)",
                        },

                        "&:hover fieldset": {
                          borderColor: "#3b82f6",
                        },

                        "&.Mui-focused fieldset": {
                          borderColor: "#3b82f6",
                        },
                      },

                      "& input": {
                        color: "#fff",
                        padding: "12px 14px",
                      },

                      "& input::placeholder": {
                        color: "#94a3b8",
                        opacity: 1,
                      },
                    }}
                  />
                  <Button variant="contained" onClick={sendMessage}>
                    Send
                  </Button>
                </div>
              </div>
            </div>
          ) : (
            <></>
          )}
          <div className={styles.buttonContainers}>
            <IconButton onClick={handleVideo} style={{ color: "white" }}>
              {video === true ? <VideocamIcon /> : <VideocamOffIcon />}
            </IconButton>

            <IconButton onClick={handleAudio} style={{ color: "white" }}>
              {audio === true ? <MicIcon /> : <MicOffIcon />}
            </IconButton>

            {screenAvailable === true ? (
              <IconButton onClick={handleScreen} style={{ color: "white" }}>
                {screen === true ? (
                  <ScreenShareIcon />
                ) : (
                  <StopScreenShareIcon />
                )}
              </IconButton>
            ) : (
              <></>
            )}

            <Badge badgeContent={newMessages} max={999} color="orange">
              <IconButton
                onClick={() => setModal(!showModal)}
                style={{ color: "white" }}
              >
                <ChatIcon />{" "}
              </IconButton>
            </Badge>
            <IconButton
              onClick={handleEndCall}
              sx={{
                backgroundColor: "#ef4444",
                color: "white",
                "&:hover": {
                  backgroundColor: "#dc2626",
                },
              }}
            >
              <CallEndIcon />
            </IconButton>
          </div>

          <video
            className={styles.meetUserVideo}
            ref={localVideoRef}
            autoPlay
            muted
          ></video>

          <div className={styles.conferenceView}>
            {remoteVideos.map((remoteVideo) => (
              <div key={remoteVideo.socketId} className={styles.videoCard}>
                <video
                  data-socket={remoteVideo.socketId}
                  ref={(ref) => {
                    if (ref && remoteVideo.stream) {
                      ref.srcObject = remoteVideo.stream;
                    }
                  }}
                  autoPlay
                ></video>

                <div className={styles.userTag}>
                  {remoteVideo.socketId.slice(0, 5)}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default VideoMeetComponent;
