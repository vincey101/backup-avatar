'use client';

import React, { useRef, useCallback, useState, useEffect } from 'react';
import Webcam from 'react-webcam';
import { Box, Paper, Typography, Button, IconButton, Alert, Tooltip } from '@mui/material';
import { ArrowBack } from '@mui/icons-material';
import { useRouter } from 'next/navigation';

const AvatarWebcam = () => {
    const router = useRouter();
    const webcamRef = useRef<Webcam>(null);
    const [recording, setRecording] = useState(false);
    const [recordedChunks, setRecordedChunks] = useState<Blob[]>([]);
    const mediaRecorderRef = useRef<MediaRecorder | null>(null);
    const [timeLeft, setTimeLeft] = useState<number>(300); // 5 minutes in seconds
    const [showAlert, setShowAlert] = useState(false);
    const [showPreview, setShowPreview] = useState(false);
    const [recordedVideo, setRecordedVideo] = useState<Blob | null>(null);
    const [processingVideo, setProcessingVideo] = useState(false);

    const handleBack = () => {
        router.push('/projects/create-avatar/select-avatar-template');
    };

    useEffect(() => {
        let timer: NodeJS.Timeout;
        if (recording && timeLeft > 0) {
            timer = setInterval(() => {
                setTimeLeft((prev) => {
                    if (prev <= 1) {
                        if (mediaRecorderRef.current?.state === 'recording') {
                            mediaRecorderRef.current.stop();
                            setRecording(false);
                        }
                        return 0;
                    }
                    return prev - 1;
                });
            }, 1000);
        }
        return () => clearInterval(timer);
    }, [recording, timeLeft]);

    const formatTime = (seconds: number): string => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    const handleStartRecording = useCallback(() => {
        setTimeLeft(300);
        setRecording(true);
        setRecordedChunks([]);
        setRecordedVideo(null);
        setShowPreview(false);
        
        const stream = webcamRef.current?.video?.srcObject as MediaStream;
        if (stream) {
            mediaRecorderRef.current = new MediaRecorder(stream);
            mediaRecorderRef.current.ondataavailable = (event) => {
                if (event.data.size > 0) {
                    setRecordedChunks((prev) => [...prev, event.data]);
                }
            };
            mediaRecorderRef.current.start(1000);
        }
    }, [webcamRef]);

    const handleStopRecording = useCallback(() => {
        const recordingTime = 300 - timeLeft;
        if (recordingTime < 120) {
            setShowAlert(true);
            setTimeout(() => setShowAlert(false), 3000);
            return;
        }

        if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
            setProcessingVideo(true);
            mediaRecorderRef.current.stop();
            setRecording(false);

            const videoBlob = new Blob(recordedChunks, { type: 'video/webm' });
            setRecordedVideo(videoBlob);
            setProcessingVideo(false);
        }
    }, [mediaRecorderRef, timeLeft, recordedChunks]);

    const handleRestartRecording = useCallback(() => {
        if (mediaRecorderRef.current) {
            mediaRecorderRef.current.stop();
            setRecordedChunks([]); // Clear any recorded chunks
            setTimeLeft(300); // Reset timer to 5 minutes

            // Start new recording after a brief delay
            setTimeout(() => {
                const stream = webcamRef.current?.video?.srcObject as MediaStream;
                if (stream) {
                    mediaRecorderRef.current = new MediaRecorder(stream);
                    mediaRecorderRef.current.ondataavailable = (event) => {
                        if (event.data.size > 0) {
                            setRecordedChunks((prev) => [...prev, event.data]);
                        }
                    };
                    mediaRecorderRef.current.start();
                }
            }, 100);
        }
    }, [webcamRef, setRecordedChunks]);

    const handleContinue = () => {
        router.push('/projects/create-avatar/avatar-processing');
    };

    const getTimerColor = (timeLeft: number): string => {
        const recordingTime = 300 - timeLeft; // Time elapsed
        if (recordingTime < 120) { // Less than 2 minutes
            return '#dc2626'; // Red color
        }
        return '#1C2536'; // Default color
    };

    const togglePreview = () => {
        setShowPreview(!showPreview);
    };

    return (
        <Box sx={{ 
            p: 3, 
            pt: 6,
            maxWidth: 700, 
            mx: 'auto',
            minHeight: '100vh',
            bgcolor: 'white'
        }}>
            <Paper 
                elevation={0} 
                sx={{ 
                    p: 2.5,
                    borderRadius: 2,
                    bgcolor: 'white',
                    mt: 4,
                    border: '1px solid #E5E7EB',
                    boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
                }}
            >
                <Box sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    mb: 2
                }}>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <IconButton
                            onClick={handleBack}
                            sx={{
                                mr: 2,
                                color: '#1D2136',
                                '&:hover': {
                                    backgroundColor: 'rgba(29, 33, 54, 0.04)'
                                }
                            }}
                        >
                            <ArrowBack />
                        </IconButton>
                        <Typography
                            variant="h5"
                            sx={{
                                color: '#1C2536',
                                fontWeight: 500
                            }}
                        >
                            Record Avatar Video
                        </Typography>
                    </Box>
                    {recording && (
                        <Typography
                            variant="h5"
                            sx={{
                                color: getTimerColor(timeLeft),
                                fontWeight: 600,
                                animation: timeLeft <= 60 ? 'pulse 1s infinite' : 'none',
                                '@keyframes pulse': {
                                    '0%': { opacity: 1 },
                                    '50%': { opacity: 0.5 },
                                    '100%': { opacity: 1 },
                                }
                            }}
                        >
                            {formatTime(timeLeft)}
                        </Typography>
                    )}
                </Box>

                {showAlert && (
                    <Alert
                        severity="warning"
                        sx={{ mb: 2 }}
                    >
                        Recording must be at least 2 minutes long
                    </Alert>
                )}

                <Box sx={{
                    position: 'relative',
                    width: '100%',
                    height: '320px',
                    mb: 1.5,
                    borderRadius: 2,
                    overflow: 'hidden',
                    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'
                }}>
                    {!showPreview ? (
                        <Webcam
                            ref={webcamRef}
                            audio={true}
                            width="100%"
                            height="100%"
                            style={{ objectFit: 'cover' }}
                        />
                    ) : (
                        <Box sx={{ position: 'relative', height: '100%' }}>
                            <video
                                src={recordedVideo ? URL.createObjectURL(recordedVideo) : ''}
                                controls
                                autoPlay
                                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                            />
                            <IconButton
                                onClick={togglePreview}
                                sx={{
                                    position: 'absolute',
                                    top: 8,
                                    right: 8,
                                    bgcolor: 'rgba(0,0,0,0.5)',
                                    color: 'white',
                                    '&:hover': {
                                        bgcolor: 'rgba(0,0,0,0.7)'
                                    }
                                }}
                            >
                                <ArrowBack />
                            </IconButton>
                        </Box>
                    )}
                </Box>

                {processingVideo && (
                    <Alert severity="info" sx={{ mb: 2 }}>
                        Processing video...
                    </Alert>
                )}

                <Box sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: 1.5
                }}>
                    <Typography
                        component="span"
                        variant="body2"
                        sx={{
                            color: '#6366F1',
                            cursor: 'pointer',
                            textAlign: 'center',
                            '&:hover': {
                                textDecoration: 'underline'
                            }
                        }}
                        onClick={(e: React.MouseEvent<HTMLSpanElement>) => {
                            e.stopPropagation();
                            router.push('/projects/create-avatar/avatar-instructions');
                        }}
                    >
                        View detailed instructions here
                    </Typography>

                    <Box sx={{
                        display: 'flex',
                        justifyContent: 'center',
                        gap: 2,
                        width: '100%'
                    }}>
                        {!recording ? (
                            <>
                                <Button
                                    variant="contained"
                                    onClick={handleStartRecording}
                                    disabled={showPreview}
                                    sx={{
                                        bgcolor: '#1D2136',
                                        '&:hover': {
                                            bgcolor: '#282d4a',
                                        },
                                        px: 3,
                                        py: 1,
                                        textTransform: 'none'
                                    }}
                                >
                                    Start Recording
                                </Button>
                                {recordedVideo && !showPreview && (
                                    <Button
                                        variant="contained"
                                        onClick={togglePreview}
                                        sx={{
                                            bgcolor: '#059669',
                                            '&:hover': {
                                                bgcolor: '#047857',
                                            },
                                            px: 3,
                                            py: 1,
                                            textTransform: 'none'
                                        }}
                                    >
                                        Preview Recording
                                    </Button>
                                )}
                                {recordedVideo && showPreview && (
                                    <Button
                                        variant="contained"
                                        onClick={handleContinue}
                                        sx={{
                                            bgcolor: '#1D2136',
                                            '&:hover': {
                                                bgcolor: '#282d4a',
                                            },
                                            px: 3,
                                            py: 1,
                                            textTransform: 'none'
                                        }}
                                    >
                                        Next
                                    </Button>
                                )}
                            </>
                        ) : (
                            <Box sx={{ display: 'flex', gap: 2 }}>
                                <Button
                                    variant="contained"
                                    onClick={handleRestartRecording}
                                    sx={{
                                        bgcolor: '#1D2136',
                                        '&:hover': {
                                            bgcolor: '#282d4a',
                                        },
                                        px: 3,
                                        py: 1,
                                        textTransform: 'none'
                                    }}
                                >
                                    Restart Recording
                                </Button>
                                <Tooltip
                                    title={300 - timeLeft < 120 ? "Recording must be at least 2 minutes long" : ""}
                                    placement="top"
                                    arrow
                                >
                                    <span>
                                        <Button
                                            variant="contained"
                                            onClick={handleStopRecording}
                                            disabled={300 - timeLeft < 120}
                                            sx={{
                                                bgcolor: '#dc2626',
                                                '&:hover': {
                                                    bgcolor: '#b91c1c',
                                                },
                                                '&.Mui-disabled': {
                                                    bgcolor: '#f87171',
                                                    color: 'white',
                                                    cursor: 'not-allowed'
                                                },
                                                px: 3,
                                                py: 1,
                                                textTransform: 'none'
                                            }}
                                        >
                                            Stop Recording {300 - timeLeft < 120 && `(${Math.ceil(120 - (300 - timeLeft))}s remaining)`}
                                        </Button>
                                    </span>
                                </Tooltip>
                            </Box>
                        )}
                    </Box>
                </Box>
            </Paper>
        </Box>
    );
};

export default AvatarWebcam; 