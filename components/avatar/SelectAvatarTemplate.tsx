'use client';

import React from 'react';
import {
    Box,
    Typography,
    Card,
    CardContent,
    CardActionArea,
    Grid,
    Paper,
    IconButton
} from '@mui/material';
import {
    FileCopy as TemplateIcon,
    CloudUpload as UploadIcon,
    Videocam as WebcamIcon,
    ArrowBack as ArrowBackIcon
} from '@mui/icons-material';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

const SelectAvatarTemplate = () => {
    const router = useRouter();

    const handleBack = () => {
        router.push('/projects/create-avatar');
    };

    const options = [
        {
            title: 'Select Template',
            icon: <TemplateIcon sx={{ fontSize: 48, color: '#fff' }} />,
            description: 'Choose from our pre-made AI Human templates',
            path: '/projects/create-avatar/avatar-template-library'
        },
        /*
        {
            title: 'Upload Footage',
            icon: <UploadIcon sx={{ fontSize: 32, color: '#fff' }}/>,
            description: 'Upload your own video footage',
            path: '/projects/create-avatar/avatar-upload',
            instructionLink: true
        },
        {
            title: 'Record via Webcam',
            icon: <WebcamIcon sx={{ fontSize: 32, color: '#fff' }}/>,
            description: 'Record yourself using your webcam',
            path: '/projects/create-avatar/avatar-webcam',
            instructionLink: true
        }
        */
    ];

    return (
        <Box sx={{
            p: 3,
            pt: 4,
            height: '100vh',
            bgcolor: 'white',
            position: 'relative',
            overflow: 'hidden',
        }}>
            <Box sx={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                width: '100%',
                maxWidth: '900px',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
            }}>
                <Image
                    src="/template-illustrator.svg"
                    alt="Background Illustration"
                    width={900}
                    height={500}
                    style={{
                        objectFit: 'contain',
                        width: '100%',
                        opacity: 0.7,
                    }}
                />
                
                <Card
                    sx={{
                        position: 'absolute',
                        left: '25%',
                        width: '400px',
                        transition: 'transform 0.2s',
                        background: `
                            linear-gradient(
                                90deg,
                                rgba(255, 255, 255, 0.2) 0%,
                                rgba(255, 255, 255, 0.6) 20%,
                                rgba(255, 255, 255, 0.6) 80%,
                                rgba(255, 255, 255, 0.2) 100%
                            )
                        `,
                        backdropFilter: 'blur(8px)',
                        '&:hover': {
                            transform: 'translateY(-4px)',
                            boxShadow: '0 4px 20px 0 rgba(0,0,0,0.08)'
                        }
                    }}
                >
                    <CardActionArea
                        onClick={() => router.push(options[0].path)}
                        sx={{
                            p: 3,
                            '&:hover': {
                                backgroundColor: 'rgba(255, 255, 255, 0.1)'
                            }
                        }}
                    >
                        <CardContent sx={{
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            textAlign: 'center',
                            background: `
                                linear-gradient(
                                    180deg,
                                    rgba(255, 255, 255, 0) 0%,
                                    rgba(255, 255, 255, 0.5) 30%,
                                    rgba(255, 255, 255, 0.5) 70%,
                                    rgba(255, 255, 255, 0) 100%
                                )
                            `,
                            borderRadius: 2
                        }}>
                            <Box
                                sx={{
                                    mb: 2,
                                    p: 2.5,
                                    borderRadius: '50%',
                                    backgroundColor: '#1D2136',
                                    width: 80,
                                    height: 80,
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center'
                                }}
                            >
                                {options[0].icon}
                            </Box>
                            <Typography variant="h5" component="div" sx={{ mb: 2 }}>
                                {options[0].title}
                            </Typography>
                            <Typography variant="body1" color="text.secondary">
                                {options[0].description}
                            </Typography>
                        </CardContent>
                    </CardActionArea>
                </Card>
            </Box>

            <IconButton
                onClick={handleBack}
                sx={{
                    position: 'absolute',
                    left: '40px',
                    top: '32px',
                    zIndex: 2,
                    background: 'linear-gradient(135deg, #6366F1 0%, #111827 100%)',
                    color: 'white',
                    width: '45px',
                    height: '45px',
                    '&:hover': {
                        background: 'linear-gradient(135deg, #5457DC 0%, #1f2937 100%)',
                        boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                    },
                    boxShadow: '0 2px 8px rgba(0,0,0,0.12)',
                }}
            >
                <ArrowBackIcon />
            </IconButton>
        </Box>
    );
};

export default SelectAvatarTemplate; 