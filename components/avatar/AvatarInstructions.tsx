'use client';

import React, { useState } from 'react';
import {
    Box,
    Typography,
    Paper,
    IconButton,
    ToggleButtonGroup,
    ToggleButton,
    Grid,
    List,
    ListItem,
    ListItemIcon,
    ListItemText
} from '@mui/material';
import {
    ArrowBack,
    CheckCircle as CheckIcon,
    Cancel as CancelIcon,
    FiberManualRecord as BulletIcon
} from '@mui/icons-material';
import { useRouter } from 'next/navigation';

const AvatarInstructions = () => {
    const router = useRouter();
    const [instructionType, setInstructionType] = useState('video');

    const recommendedItems = [
        'Submit 2-5 mins of footage (required)',
        'Use a high resolution camera',
        'Record in a well-lit, quiet environment',
        'Look directly into the camera',
        'Pause between each sentence with your mouth closed',
        'Use generic gestures and keep hands below your chest'
    ];

    const avoidItems = [
        'Stitched or cut footage',
        'Talking without pauses',
        'Changing positions while recording',
        'Loud background noise',
        'Shadows on or overexposure of your face',
        'Diverting your gaze or looking around',
        'Hand gestures above the chest',
        'Use of pointing gestures'
    ];

    return (
        <Box sx={{ 
            p: 3, 
            pt: 8,
            maxWidth: 900, 
            mx: 'auto',
            minHeight: '100vh',
            bgcolor: 'white'
        }}>
            <Box sx={{ mt: 4 }}>
                <Paper elevation={0} sx={{ p: 2 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                        <IconButton
                            onClick={() => router.back()}
                            sx={{ 
                                mr: 1, 
                                color: '#1D2136',
                                '&:hover': {
                                    backgroundColor: 'rgba(29, 33, 54, 0.04)'
                                }
                            }}
                        >
                            <ArrowBack />
                        </IconButton>
                        <Box sx={{
                            display: 'flex',
                            justifyContent: 'center',
                            flex: 1,
                            backgroundColor: '#F8F9FA',
                            borderRadius: '20px',
                            p: 0.5,
                            width: 'fit-content',
                            margin: '0 auto'
                        }}>
                            <ToggleButtonGroup
                                value={instructionType}
                                exclusive
                                onChange={(e, newValue) => newValue && setInstructionType(newValue)}
                                sx={{
                                    '& .MuiToggleButton-root': {
                                        border: 'none',
                                        borderRadius: '20px',
                                        px: 2,
                                        '&.Mui-selected': {
                                            backgroundColor: '#fff',
                                            color: '#000',
                                            boxShadow: '0px 2px 4px rgba(0,0,0,0.1)',
                                        },
                                    },
                                }}
                            >
                                <ToggleButton value="video">
                                    Video Instructions
                                </ToggleButton>
                                <ToggleButton value="text" sx={{ color: '#9C27B0' }}>
                                    Text Instructions
                                </ToggleButton>
                            </ToggleButtonGroup>
                        </Box>
                    </Box>

                    {instructionType === 'text' && (
                        <Box sx={{ mt: 3 }}>
                            <Grid container spacing={4}>
                                {/* Recommended Section */}
                                <Grid item xs={12} md={6}>
                                    <Typography sx={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        color: '#4CAF50',
                                        mb: 1
                                    }}>
                                        <CheckIcon sx={{ mr: 1 }} /> Recommended
                                    </Typography>
                                    <List dense sx={{
                                        py: 0,
                                        '& .MuiListItem-root': {
                                            py: 0.75  // Slightly increase spacing between items
                                        }
                                    }}>
                                        {recommendedItems.map((item, index) => (
                                            <ListItem key={index}>
                                                <ListItemIcon sx={{ minWidth: 24 }}>
                                                    <BulletIcon sx={{ fontSize: 8, color: '#4CAF50' }} />
                                                </ListItemIcon>
                                                <ListItemText
                                                    primary={item}
                                                    sx={{
                                                        m: 0,
                                                        '& .MuiTypography-root': {
                                                            fontSize: '0.9rem',
                                                        }
                                                    }}
                                                />
                                            </ListItem>
                                        ))}
                                    </List>
                                </Grid>

                                {/* Things to Avoid Section */}
                                <Grid item xs={12} md={6}>
                                    <Typography sx={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        color: '#F44336',
                                        mb: 1
                                    }}>
                                        <CancelIcon sx={{ mr: 1 }} /> Things to avoid
                                    </Typography>
                                    <List dense sx={{
                                        py: 0,
                                        '& .MuiListItem-root': {
                                            py: 0.45  // Reduced from 0.65 to 0.45
                                        }
                                    }}>
                                        {avoidItems.map((item, index) => (
                                            <ListItem key={index}>
                                                <ListItemIcon sx={{ minWidth: 24 }}>
                                                    <BulletIcon sx={{ fontSize: 8, color: '#F44336' }} />
                                                </ListItemIcon>
                                                <ListItemText
                                                    primary={item}
                                                    sx={{
                                                        m: 0,
                                                        '& .MuiTypography-root': {
                                                            fontSize: '0.9rem',
                                                            lineHeight: '1.2',  // Added to make text more compact
                                                        }
                                                    }}
                                                />
                                            </ListItem>
                                        ))}
                                    </List>
                                </Grid>
                            </Grid>

                            <Box sx={{
                                mt: 3,
                                p: 2,
                                backgroundColor: '#FFF9C4',
                                borderRadius: 1
                            }}>
                                <Typography variant="body2">
                                    💡 Tips: To make your avatar lively and expressive, exaggerate your emotions when speaking.
                                    Feel free to talk about any topic in the language of your choice. Be yourself, look into the camera,
                                    and we will take care of the rest 😊
                                </Typography>
                            </Box>
                        </Box>
                    )}

                    {instructionType === 'video' && (
                        <Box sx={{ 
                            width: '100%', 
                            mx: 'auto',
                            maxHeight: '400px',
                            '& video': {
                                height: '400px',
                                objectFit: 'cover'
                            }
                        }}>
                            <video
                                controls
                                width="100%"
                                style={{ 
                                    borderRadius: '4px',
                                }}
                            >
                                <source src="/videos/instruction.mp4" type="video/mp4" />
                                Your browser does not support the video tag.
                            </video>
                        </Box>
                    )}
                </Paper>
            </Box>
        </Box>
    );
};

export default AvatarInstructions; 