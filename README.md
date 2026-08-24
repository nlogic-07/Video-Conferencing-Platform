# Video Conferencing Platform

A full-stack video conferencing web application with secure authentication and real-time communication. Users can sign up/log in (or join instantly as a guest), land in a dashboard to create or join a room, preview their camera/mic in a lobby, and then connect for a live video call with in-call chat — all powered by WebRTC and Socket.IO.

## Pages & Flow

1. **Landing Page** – Marketing entry point ("Connect with your loved Ones") with options to **Join as Guest**, **Register**, or **Login**, plus a "Get Started" CTA.
2. **Auth Page** – Combined Sign In / Sign Up form (username + password) with JWT-based authentication.
3. **Home Page (Dashboard)** – Logged-in landing spot with a room code input to join/create a meeting, plus **History** and **Logout** in the nav bar.
4. **Lobby Page** – Pre-call screen ("Enter into Lobby") where the user sets a display name and previews their camera before connecting.
5. **Meeting Room** – Live video call screen with:
   - Local + remote video feeds
   - Call controls (camera toggle, mic toggle, screen share, end call)
   - **Screen sharing** — swap your camera feed for your screen mid-call
   - Real-time **in-call chat** panel alongside the video

## Key Features

- **Flexible entry**: Join as a registered user, sign up, or jump in instantly as a guest
- **JWT Authentication**: Secure Signup/Login flow
- **Dashboard**: Create or join rooms via a room code/link
- **Lobby / Pre-call Preview**: Check camera and set your name before entering a call
- **Real-time Video Conferencing**: Peer-to-peer video/audio via WebRTC
- **In-call Chat**: Text messaging alongside the video call via Socket.IO
- **Call Controls**: Mute/unmute mic, enable/disable camera, end call
- **Screen Sharing**: Share your screen with other participants mid-call
- **Meeting History**: View past meetings from the dashboard
- **Room-based Communication**: Each meeting is scoped to a unique room/URL (e.g. `/meeting_with_jassi`)

## Tech Stack

- **Frontend**: React
- **Backend**: Node.js, Express
- **Real-time Signaling**: Socket.IO
- **Peer Connection**: WebRTC
- **Auth**: JWT

## Project Status

This project is under active development as a learning exercise in WebRTC signaling (ICE candidate exchange, SDP offer/answer flow) and real-time communication with Socket.IO.
