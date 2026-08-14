import React, { useEffect, useRef, useState } from "react";

const VideoMeetComponent = () => {
  const socketRef = useRef();
  const socketId = useRef();
  const localVideoRef = useRef();
  const videoRef = useRef([]);

  const [video, setVideo] = useState([]);
  const [audio, setAudio] = useState();

  const [userName, setUserName] = useState("");
  const [askForUserName, setAskForUserName] = useState(true);
  const [videoAvailable, setVideoAvailable] = useState(false);
  const [audioAvailable, setAudioAvailable] = useState(false);
  const [screenAvailable, setScreenAvailable] = useState();

  //1
  useEffect(() => {
    getPermissions();
  }, []);

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

  const connectToSocketServer = () => {
    socketRef.current = io.connect("http://localhost:9000");
  };
  const getMedia = () => {
    setVideo(videoAvailable);
    setAudio(audioAvailable);
    connectToSocketServer();
  };
  // const getMedia = () => {};
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
        </div>
      )}
    </div>
  );
};

export default VideoMeetComponent;
