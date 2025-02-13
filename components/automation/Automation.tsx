'use client';

import { useState, useEffect } from 'react';
import {
  Box,
  TextField,
  MenuItem,
  FormControl,
  Button as MuiButton,
  Typography,
} from '@mui/material';
import dynamic from 'next/dynamic';
import 'react-quill/dist/quill.snow.css';
import { toast } from 'sonner';

// Dynamic import of ReactQuill to avoid SSR issues
const ReactQuill = dynamic(() => import('react-quill'), {
  ssr: false,
  loading: () => <p>Loading editor...</p>,
});

interface Project {
  id: number;
  project_name: string;
  // ... other fields if needed
}

interface Subscriber {
  id: number;
  email: string;
  // add other fields if needed
}

export default function Automation() {
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [selectedTemplate, setSelectedTemplate] = useState('');
  const [selectedMailList, setSelectedMailList] = useState('');
  const [projects, setProjects] = useState<Project[]>([]);
  const [subscribers, setSubscribers] = useState<Subscriber[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingSubscribers, setIsLoadingSubscribers] = useState(true);

  // Add useEffect to fetch projects when component mounts
  useEffect(() => {
    fetchProjects();
  }, []);

  // Add useEffect to fetch subscribers
  useEffect(() => {
    fetchSubscribers();
  }, []);

  const fetchProjects = async () => {
    try {
      const userDataStr = localStorage.getItem('userData');
      if (!userDataStr) {
        throw new Error('User data not found');
      }

      const userData = JSON.parse(userDataStr);
      const token = userData.token;

      if (!token) {
        throw new Error('Token not found');
      }

      const response = await fetch('https://api.humanaiapp.com/api/get-ai-project', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setProjects(data.data || []);
    } catch (error) {
      console.error('Error fetching projects:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchSubscribers = async () => {
    try {
      const userDataStr = localStorage.getItem('userData');
      if (!userDataStr) {
        throw new Error('User data not found');
      }

      const userData = JSON.parse(userDataStr);
      const token = userData.token;

      if (!token) {
        throw new Error('Token not found');
      }

      const response = await fetch('https://api.humanaiapp.com/api/automation', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setSubscribers(data.data || []);
    } catch (error) {
      console.error('Error fetching subscribers:', error);
    } finally {
      setIsLoadingSubscribers(false);
    }
  };

  const handleSendMessage = async () => {
    if (!subject.trim() || !message.trim() || !selectedMailList) {
      toast.error('Please fill in all fields');
      return;
    }

    try {
      const userDataStr = localStorage.getItem('userData');
      if (!userDataStr) {
        throw new Error('User data not found');
      }

      const userData = JSON.parse(userDataStr);
      const token = userData.token;

      if (!token) {
        throw new Error('Token not found');
      }

      const response = await fetch('https://api.humanaiapp.com/api/send-auto-email', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          subject: subject,
          message: message,
          emails: [selectedMailList]
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to send message');
      }

      // Clear form after successful send
      setSubject('');
      setMessage('');
      setSelectedMailList('');
      
      toast.success('Message sent successfully!');
    } catch (error) {
      console.error('Error sending message:', error);
      toast.error('Failed to send message. Please try again.');
    }
  };

  // Quill modules configuration
  const modules = {
    toolbar: [
      [{ 'font': [] }, { 'size': [] }],
      ['bold', 'italic', 'underline', 'strike'],
      [{ 'color': [] }, { 'background': [] }],
      [{ 'script': 'sub' }, { 'script': 'super' }],
      [{ 'header': '1' }, { 'header': '2' }, 'blockquote', 'code-block'],
      [{ 'list': 'ordered' }, { 'list': 'bullet' },{ 'indent': '-1' }, { 'indent': '+1' }],
      [{ 'direction': 'rtl' }, { 'align': [] }],
      ['image','video', 'clean'],
      // ['video']
    ],
  };

  // Quill formats configuration
  const formats = [
    'font', 'size',
    'bold', 'italic', 'underline', 'strike',
    'color', 'background',
    'script',
    'header', 'blockquote', 'code-block',
    'list', 'bullet', 'indent',
    'direction', 'align',
     'image', 'video'
  ];

  return (
    <div className="max-w-5xl mx-auto pt-2 px-6">
      {/* Header */}
      <Typography 
        variant="h5" 
        component="h1" 
        sx={{ 
          mb: 2, 
          fontWeight: 600,
          color: '#111827',
          fontSize: '1.5rem'
        }}
      >
        Automation
      </Typography>

      <div className="bg-white rounded-xl shadow-sm p-6">
          {/* Subject Line */}
          <FormControl fullWidth sx={{ mb: 3 }}>
            <TextField
              label="Subject"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="Enter email subject"
              size="small"
              sx={{
                '& .MuiOutlinedInput-root': {
                  bgcolor: 'white',
                  '&:hover fieldset': {
                    borderColor: '#6366F1',
                  },
                },
              }}
            />
          </FormControl>

        {/* React Quill Editor */}
        <div className="mb-8">
          <ReactQuill
            theme="snow"
            value={message}
            onChange={setMessage}
            modules={modules}
            formats={formats}
            placeholder="Write your message here..."
            style={{ height: '300px', marginBottom: '50px' }}
          />
        </div>

          {/* Template Selection */}
        <FormControl fullWidth sx={{ mb: 2, mt: 4 }}>
            <TextField
              select
              label="Select Application"
              value={selectedTemplate}
              onChange={(e) => setSelectedTemplate(e.target.value)}
              size="small"
              sx={{
                '& .MuiOutlinedInput-root': {
                  bgcolor: 'white',
                  '&:hover fieldset': {
                    borderColor: '#6366F1',
                  },
                },
              }}
            >
            {isLoading ? (
              <MenuItem disabled>Loading projects...</MenuItem>
            ) : projects.length === 0 ? (
              <MenuItem disabled>No Projects yet</MenuItem>
            ) : (
              projects.map((project) => (
                <MenuItem key={project.id} value={project.project_name}>
                  {project.project_name}
                </MenuItem>
              ))
            )}
            </TextField>
          </FormControl>

          {/* Mail List Selection */}
          <FormControl fullWidth sx={{ mb: 3 }}>
            <TextField
              select
              label="My List (Select your mail)"
              value={selectedMailList}
              onChange={(e) => setSelectedMailList(e.target.value)}
              size="small"
              sx={{
                '& .MuiOutlinedInput-root': {
                  bgcolor: 'white',
                  '&:hover fieldset': {
                    borderColor: '#6366F1',
                  },
                },
              }}
            >
            {isLoadingSubscribers ? (
              <MenuItem disabled>Loading subscribers...</MenuItem>
            ) : subscribers.length === 0 ? (
              <MenuItem disabled>No subscribers yet</MenuItem>
            ) : (
              subscribers.map((subscriber) => (
                <MenuItem key={subscriber.id} value={subscriber.email}>
                  {subscriber.email}
              </MenuItem>
              ))
            )}
            </TextField>
          </FormControl>

          {/* Send Button */}
          <div className="flex justify-end mt-4">
            <MuiButton
              variant="contained"
              onClick={handleSendMessage}
              sx={{
                background: 'linear-gradient(135deg, #6366F1 0%, #111827 100%)',
                textTransform: 'none',
                py: 1,
                px: 4,
                fontSize: '0.875rem',
                borderRadius: 2,
                boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                '&:hover': {
                  background: 'linear-gradient(135deg, #5457DC 0%, #1f2937 100%)',
                  boxShadow: '0 6px 16px rgba(0,0,0,0.2)',
                },
              }}
            >
              Send Message
            </MuiButton>
          </div>
              </div>
    </div>
  );
}