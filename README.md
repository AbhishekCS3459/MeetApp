
#  Video Meeting App

A video meeting application built with React, Socket.IO, WebRTC, and Material UI, allowing users to create and join video meetings in real-time, similar to Google Meet.

## Features

- **Create/Join Meetings:** Users can create a unique meeting or join an existing one using a meeting ID.
- **Video Streaming:** WebRTC enables real-time video communication between participants.
- **Responsive Design:** Material UI ensures a clean, responsive user interface.
- **Peer-to-Peer Connection:** Uses WebRTC for direct communication between clients.
- **Socket.IO Integration:** Manages signaling and room connections for peer-to-peer video.

## Tech Stack

- **Frontend:** React, React Router, Material UI
- **Backend:** Node.js, Express, Socket.IO
- **WebRTC:** Real-time peer-to-peer video communication
- **Build Tool:** Vite

## Setup

1. **Clone the repository:**

   ```bash
   git clone https://github.com/yourusername/vite-video-meeting-app.git
   ```

2. **Install dependencies:**

   ```bash
   cd vite-video-meeting-app
   npm install
   ```

3. **Run the development server:**

   ```bash
   npm run dev
   ```

4. **Run the backend server:**

   ```bash
   cd server
   npm install
   node server.js
   ```

5. **Visit the app:**

   - Frontend: `http://localhost:5173`
   - Backend: `http://localhost:3001`

## Usage

- Navigate to the home page.
- Create a new meeting or enter an existing meeting ID.
- Allow camera and microphone access for the video call.
- Share the meeting URL with others to join the meeting.

## System Design

This application consists of two primary components:

1. **Frontend (Client-Side):**
   - Built using **React** for rendering and routing with **React Router**.
   - **WebRTC** is used for establishing a peer-to-peer connection between users for video/audio communication.
   - **Socket.IO** is used to handle signaling (exchange of WebRTC session descriptions and ICE candidates).

2. **Backend (Server-Side):**
   - The backend server is built using **Node.js** and **Socket.IO** to manage user connections, rooms, and signaling.
   - Rooms are dynamically created when users initiate or join a meeting.
   - **Express** handles the server-side API logic, while **Socket.IO** manages the real-time connection.

### System Design Diagram

```plaintext
+--------------------------------------+
|           Client (React)             |
+--------------------------------------+
| WebRTC        | Socket.IO (Client)   |
+--------------------------------------+
        |                   |
        |                   |
+--------------------------------------+
|           Server (Node.js)           |
+--------------------------------------+
| Express         | Socket.IO (Server) |
+--------------------------------------+
        |                   |
        |                   |
+--------------------------------------+
|      WebRTC (Peer-to-Peer)           |
+--------------------------------------+
```

### Key Components

1. **WebRTC (Peer-to-Peer):**
   - Handles media streaming between clients.
   - STUN/TURN servers are used for NAT traversal, with Google's `stun:stun.l.google.com:19302` configured.

2. **Socket.IO:**
   - Acts as a signaling server to exchange WebRTC offers, answers, and ICE candidates between peers.

3. **Room Management:**
   - Users can create or join rooms by specifying a room ID, and the server manages connected users for each room.

## Contributing

Feel free to open issues or submit pull requests for improvements or bug fixes.
