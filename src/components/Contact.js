import React, { useState } from 'react';
import {
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  TextField,
  Typography,
  Box,
  IconButton,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

// Import your image for the left side of the contact form
import contactImage from './customStyle/about/VisualVibe.png'; // Update the path as needed

const Contact = ({ open, onClose }) => {
  const [submissionStatus, setSubmissionStatus] = useState('');

  const onSubmit = async (event) => {
    event.preventDefault();
    const formData = new FormData(event.target);

    formData.append("access_key", "f9dcc014-ed05-42ba-a06c-b7df8eb83c8e"); // Replace with your access key

    const object = Object.fromEntries(formData);
    const json = JSON.stringify(object);

    const res = await fetch("https://api.web3forms.com/submit", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: json,
    }).then((res) => res.json());

    if (res.success) {
      setSubmissionStatus("Success! Your message has been sent.");
      console.log("Success", res);
      // Delay closing to show success message
      setTimeout(() => {
        onClose(); // Close the dialog after successful submission
      }, 2000); // Adjust time as needed
    } else {
      setSubmissionStatus("Error! Something went wrong.");
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      sx={{
        '& .MuiDialog-paper': {
          border: '2px solid white',
          boxShadow: '0 0 20px rgba(255, 255, 255, 0.5)',
          borderRadius: '30px',
          transition: 'all 0.3s ease-in-out', // Smooth dialog transition
        },
      }}
    >
<DialogTitle className='bg-[#1A1B1D] text-white font-bold '>
  Contact Me
  <span style={{ fontWeight: 'normal', fontSize: '0.85rem', display: 'block', marginTop: '5px', color: 'gray' }}>
    For inquiries, custom projects, website development, or 3D modeling services, feel free to reach out.
Please avoid spamming or submitting the form multiple times. We aim to respond as soon as possible.
  </span>
  <IconButton
    aria-label="close"
    onClick={onClose}
    sx={{
      position: 'absolute',
      right: 8,
      top: 8,
      color: 'white',
      transition: 'color 0.3s ease-in-out',
      '&:hover': {
        color: 'gray',
      },
    }}
  >
    <CloseIcon />
  </IconButton>
</DialogTitle>

      
      <DialogContent sx={{ display: 'flex', alignItems: 'center', flexDirection: { xs: 'column', sm: 'row' }, bgcolor: '#1A1B1D' }}>
        {/* Image on the left */}
        <Box
          component="img"
          src={contactImage}
          alt="Contact"
          sx={{
            width: { xs: '100%', sm: '40%' },
            height: 'auto',
            borderRadius: '30px',
            objectFit: 'cover',
            marginBottom: { xs: 2, sm: 0 },
            transition: 'all 0.3s ease-in-out', // Smooth image transition
          }}
        />

        {/* Vertical Glowing Line */}
        <Box
          sx={{
            width: '2px',
            height: { xs: '10px', sm: '100%' },
            bgcolor: 'white',
            boxShadow: '0 0 10px white',
            marginX: 2,
            transition: 'height 0.3s ease-in-out', // Smooth line transition for height
          }}
        />

        {/* Form on the right */}
        <Box className="flex-grow p-4" sx={{ bgcolor: '#1A1B1D', borderRadius: '8px', color: 'white', width: { xs: '100%', sm: '60%' } }}>
          <form onSubmit={onSubmit}>
            <TextField
              fullWidth
              label="Name"
              name="name"
              variant="outlined"
              margin="normal"
              required
              InputLabelProps={{
                sx: {
                  color: 'white',
                  '&.Mui-focused': {
                    color: 'white',
                  },
                },
              }}
              InputProps={{
                sx: {
                  color: 'white',
                  transition: 'border-color 0.3s ease-in-out, box-shadow 0.3s ease-in-out', // Smooth border and box-shadow transitions
                  '& .MuiOutlinedInput-notchedOutline': {
                    borderColor: 'white',
                  },
                  '&:hover .MuiOutlinedInput-notchedOutline': {
                    borderColor: 'white',
                    boxShadow: '0 0 10px white',
                  },
                  '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                    borderColor: 'white',
                    boxShadow: '0 0 10px white',
                  },
                },
              }}
            />

            <TextField
              fullWidth
              label="Email"
              name="email"
              variant="outlined"
              margin="normal"
              type="email"
              required
              InputLabelProps={{
                sx: {
                  color: 'white',
                  '&.Mui-focused': {
                    color: 'white',
                  },
                },
              }}
              InputProps={{
                sx: {
                  color: 'white',
                  transition: 'border-color 0.3s ease-in-out, box-shadow 0.3s ease-in-out', // Smooth border and box-shadow transitions
                  '& .MuiOutlinedInput-notchedOutline': {
                    borderColor: 'white',
                  },
                  '&:hover .MuiOutlinedInput-notchedOutline': {
                    borderColor: 'white',
                    boxShadow: '0 0 10px white',
                  },
                  '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                    borderColor: 'white',
                    boxShadow: '0 0 10px white',
                  },
                },
              }}
            />

            <TextField
              fullWidth
              label="Message"
              name="message"
              variant="outlined"
              margin="normal"
              multiline
              rows={4}
              required
              InputLabelProps={{
                sx: {
                  color: 'white',
                  '&.Mui-focused': {
                    color: 'white',
                  },
                },
              }}
              InputProps={{
                sx: {
                  color: 'white',
                  transition: 'border-color 0.3s ease-in-out, box-shadow 0.3s ease-in-out', // Smooth border and box-shadow transitions
                  '& .MuiOutlinedInput-notchedOutline': {
                    borderColor: 'white',
                  },
                  '&:hover .MuiOutlinedInput-notchedOutline': {
                    borderColor: 'white',
                    boxShadow: '0 0 10px white',
                  },
                  '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                    borderColor: 'white',
                    boxShadow: '0 0 10px white',
                  },
                },
              }}
            />

            <Button
              variant="outlined"
              color="primary"
              className="mt-4"
              type="submit"
              sx={{
                backgroundColor: 'transparent',
                borderColor: 'white',
                color: 'white',
                transition: 'background-color 0.3s ease-in-out, box-shadow 0.3s ease-in-out', // Smooth button transition
                '&:hover': {
                  backgroundColor: 'rgba(255, 255, 255, 0.1)',
                  borderColor: 'white',
                  boxShadow: '0 0 10px white',
                },
                '&.Mui-focused': {
                  borderColor: 'white',
                  boxShadow: '0 0 10px white',
                },
              }}
            >
              Submit
            </Button>
          </form>
          {submissionStatus && (
            <Typography
              variant="body2"
              className="mt-2"
              sx={{
                color: submissionStatus.includes("Success") ? 'green' : 'red',
                transition: 'color 0.3s ease-in-out', // Smooth transition for status message
              }}
            >
              {submissionStatus}
            </Typography>
          )}
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default Contact;
