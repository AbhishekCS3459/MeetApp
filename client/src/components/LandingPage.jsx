import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, TextField, Typography, Box } from '@mui/material';
import { CentralizedCard } from './CentralizedCard';

export function LandingPage() {
  const [meetingId, setMeetingId] = useState('');
  const navigate = useNavigate();

  const handleJoinMeeting = () => {
    if (meetingId.trim()) {
      navigate(`/meeting/${meetingId}`);
    }
  };

  const handleCreateMeeting = () => {
    const newMeetingId = Math.random().toString(36).substring(7);
    navigate(`/meeting/${newMeetingId}`);
  };

  return (
    <CentralizedCard>
      <Typography variant="h4" align="center" gutterBottom>
        Welcome to Video Meeting App
      </Typography>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 4 }}>
        <TextField
          label="Enter Meeting ID"
          variant="outlined"
          value={meetingId}
          onChange={(e) => setMeetingId(e.target.value)}
          fullWidth
        />
        <Button
          variant="contained"
          onClick={handleJoinMeeting}
          fullWidth
          sx={{ bgcolor: 'black', color: 'white', '&:hover': { bgcolor: 'grey.800' } }}
        >
          Join Meeting
        </Button>
        <Typography align="center">or</Typography>
        <Button
          variant="outlined"
          onClick={handleCreateMeeting}
          fullWidth
          sx={{ borderColor: 'black', color: 'black', '&:hover': { borderColor: 'grey.800', color: 'grey.800' } }}
        >
          Create New Meeting
        </Button>
      </Box>
    </CentralizedCard>
  );
}