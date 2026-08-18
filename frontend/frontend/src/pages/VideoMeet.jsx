import React, { useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";

const connections = {};

const peerConfigurations = {
  iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
};

const VideoMeetComponent = () => {
  const socketRef = useRef();
  const socketIdRef = useRef();

  const localVideoRef = useRef();

  const [remoteVideos, setVideos] = useState([]);
  const remoteVideosRef = useRef([]);

  const [video, setVideo] = useState([]);
  const [audio, setAudio] = useState();
  const [screen, setScreen] = useState();

  const [userName, setUserName] = useState("");
  const [askForUserName, setAskForUserName] = useState(true);

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
  };

  const getUserMedia = () => {
    if ((video && videoAvailable) || (audio && audioAvailable)) {
      navigator.mediaDevices
        .getUserMedia({ video: video, audio: audio })
        .then(getUserMediaSuccess)
        .catch((e) => console.log(e));
    } else {
      //    hold on
    }
  };

  const gotMessageFromServer = () => {};
  const addMessage = () => {};

  const connectToSocketServer = () => {
    socketRef.current = io.connect("http://localhost:9000");

    socketRef.current.on("signal", gotMessageFromServer);
    socketRef.current.on("connect", () => {
      socketRef.current.emit("join-call", window.location.href); //for now see this
      socketIdRef = socketRef.current.id;

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

          connections[socketListId].onaddstream = (e) => {};

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
          }
        }
      });
    });
  };

  const black = ({ width = 640, height = 480 }) => {
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
        <div>
          <h1>Meeting UI</h1>
          <h1>Username : {userName} </h1>
          <video ref={localVideoRef} autoPlay muted></video>
        </div>
      )}
    </div>
  );
};

export default VideoMeetComponent;
