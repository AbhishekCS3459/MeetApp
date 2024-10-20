import  { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import socketIO from 'socket.io-client';
import { Button, Grid, Typography } from "@mui/material";
import { CentralizedCard } from "./CentralizedCard";
import { Video } from "./Video";

let pc = new RTCPeerConnection({
  iceServers: [
    {
      urls: "stun:stun.l.google.com:19302",
    },
  ],
});

export function MeetingPage() {
  const [socket, setSocket] = useState(null);
  const [meetingJoined, setMeetingJoined] = useState(false);
  const [videoStream, setVideoStream] = useState();
  const [remoteVideoStream, setRemoteVideoStream] = useState();
  
  const params = useParams();
  const roomId = params.roomId;

  useEffect(() => {
    const s = socketIO.connect("https://meetappserver.onrender.com");
    s.on("connect", () => {
      setSocket(s);
      s.emit("join", {
        roomId,
      });

      window.navigator.mediaDevices
        .getUserMedia({
          video: true,
        })
        .then(async (stream) => {
          setVideoStream(stream);
        });

      s.on("localDescription", async ({ description }) => {
        console.log({ description });
        pc.setRemoteDescription(description);
        pc.ontrack = (e) => {
          setRemoteVideoStream(new MediaStream([e.track]));
        };

        s.on("iceCandidate", ({ candidate }) => {
          pc.addIceCandidate(candidate);
        });

        pc.onicecandidate = ({ candidate }) => {
          s.emit("iceCandidateReply", { candidate });
        };
        await pc.setLocalDescription(await pc.createAnswer());
        s.emit("remoteDescription", { description: pc.localDescription });
      });

      s.on("remoteDescription", async ({ description }) => {
        console.log({ description });
        pc.setRemoteDescription(description);
        pc.ontrack = (e) => {
          setRemoteVideoStream(new MediaStream([e.track]));
        };

        s.on("iceCandidate", ({ candidate }) => {
          pc.addIceCandidate(candidate);
        });

        pc.onicecandidate = ({ candidate }) => {
          s.emit("iceCandidateReply", { candidate });
        };
      });
    });
  }, [roomId]);

  const handleJoinMeeting = async () => {
    pc.onicecandidate = ({ candidate }) => {
      socket.emit("iceCandidate", { candidate });
    };
    pc.addTrack(videoStream.getVideoTracks()[0]);
    try {
      await pc.setLocalDescription(await pc.createOffer());
      console.log({ aa: pc.localDescription });
      socket.emit("localDescription", { description: pc.localDescription });
    } catch (err) {
      console.log({ msg: err?.message });
      console.error(err);
    }
    setMeetingJoined(true);
  };

  if (!videoStream) {
    return (
      <CentralizedCard>
        <Typography variant="h5" align="center">
          Loading...
        </Typography>
      </CentralizedCard>
    );
  }

  if (!meetingJoined) {
    return (
      <CentralizedCard>
        <Typography variant="h5" align="center" gutterBottom>
          Welcome to meeting {roomId}
        </Typography>
        <Button
          sx={{
            bgcolor: 'black',
            color: 'white',
            '&:hover': { bgcolor: 'grey.800' },
            mt: 2
          }}
          onClick={handleJoinMeeting}
          disabled={!socket}
          variant="contained"
          fullWidth
        >
          Join meeting
        </Button>
      </CentralizedCard>
    );
  }

  return (
    <Grid container spacing={2} alignItems="center" justifyContent="center" sx={{ minHeight: '100vh', p: 2 }}>
      <Grid item xs={12} md={6} lg={4}>
        <Video stream={videoStream} />
      </Grid>
      <Grid item xs={12} md={6} lg={4}>
        <Video stream={remoteVideoStream} />
      </Grid>
    </Grid>
  );
}