'use client';

import { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import {
    Card,
    CardBody,
    Button,
    Spinner,
    Tabs,
    Tab,
    Tooltip,
    Modal,
    ModalContent,
    Input,
} from "@nextui-org/react";
import { toast } from 'sonner';
import type { StartAvatarResponse } from "@heygen/streaming-avatar";
import StreamingAvatar, {
    AvatarQuality,
    StreamingEvents,
    TaskMode,
    TaskType,
    VoiceEmotion,
} from "@heygen/streaming-avatar";
import { Mic, MessageSquareText, LogOut, X } from 'lucide-react';
import InteractiveAvatarTextInput from '@/components/InteractiveAvatarTextInput';

interface PageProps {
  params: {
    projectName: string;
  }
}

export default function Preview({ params }: PageProps) {
    const router = useRouter();
    const [stream, setStream] = useState<MediaStream>();
    const [isLoadingStream, setIsLoadingStream] = useState(true);
    const mediaStream = useRef<HTMLVideoElement>(null);
    const avatar = useRef<StreamingAvatar | null>(null);
    const [project, setProject] = useState<any>(null);
    const [chatMode, setChatMode] = useState("text_mode");
    const [text, setText] = useState("");
    const [isLoadingRepeat, setIsLoadingRepeat] = useState(false);
    const [isUserTalking, setIsUserTalking] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);
    const [isListening, setIsListening] = useState(false);
    const mediaRecorder = useRef<MediaRecorder | null>(null);
    const audioChunks = useRef<Blob[]>([]);
    const [isAvatarResponding, setIsAvatarResponding] = useState(false);
    const [showEndSessionModal, setShowEndSessionModal] = useState(false);
    const [timeLeft, setTimeLeft] = useState<number>(0);
    const timerRef = useRef<NodeJS.Timeout | null>(null);
    const [showSubscribeModal, setShowSubscribeModal] = useState(true);
    const [subscriberName, setSubscriberName] = useState('');
    const [subscriberEmail, setSubscriberEmail] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        const fetchProjectData = async () => {
            const projectName = params.projectName;

            if (!projectName) {
                toast.error('No project name found');
                return;
            }

            try {
                const response = await fetch(`https://api.humanaiapp.com/api/get_avatar_name/${encodeURIComponent(projectName)}`);

                if (!response.ok) {
                    throw new Error('Failed to fetch project data');
                }

                // Clone the response before reading it
                const responseData = await response.clone().json();
                const { data: projectData } = responseData;

                if (!projectData) {
                    throw new Error('Project not found');
                }

                // Store the user_id from the response in localStorage
                if (projectData.user_id) {
                    try {
                        localStorage.setItem('preview_user_id', projectData.user_id.toString());
                    } catch (error) {
                        console.error('Error storing user ID:', error);
                    }
                }

                setProject(projectData);
                initializePreview(projectData);
            } catch (error) {
                console.error('Error fetching project:', error);
                toast.error('Failed to load project');
            }
        };

        fetchProjectData();
    }, [params.projectName]);

    useEffect(() => {
        if (stream && mediaStream.current) {
            mediaStream.current.srcObject = stream;
        }
    }, [stream]);

    const getSessionDuration = () => {
        try {
            const userDataStr = localStorage.getItem('userData');
            if (!userDataStr) return 2 * 60; // Default to 2 minutes

            const userData = JSON.parse(userDataStr);
            if (userData.user?.oto_1 === 1) return 5 * 60; // 5 minutes for OTO-1 users
            if (userData.user?.fe === 1) return 2 * 60; // 2 minutes for FE users
            return 2 * 60; // Default to 2 minutes
        } catch (error) {
            return 2 * 60; // Default to 2 minutes if any error
        }
    };

    const formatTime = (seconds: number): string => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    const initializePreview = async (projectData: any) => {
        try {
            const getAccessToken = async (retries = 3) => {
                for (let i = 0; i < retries; i++) {
                    try {
                        const response = await fetch("/api/get-access-token", {
                            method: "POST",
                            signal: AbortSignal.timeout(30000), // 30 second timeout
                        });
                        
                        if (!response.ok) {
                            throw new Error("Failed to get access token");
                        }
                        
                        // Clone the response before reading it
                        const token = await response.clone().text();
                        return token;
                    } catch (error) {
                        if (i === retries - 1) throw error;
                        await new Promise(resolve => setTimeout(resolve, 1000 * (i + 1))); // Exponential backoff
                    }
                }
            };

            const token = await getAccessToken();

            if (!token) {
                throw new Error("Failed to get access token");
            }

            avatar.current = new StreamingAvatar({
                token,
            });

            avatar.current.on(StreamingEvents.STREAM_READY, (event) => {
                console.log("Stream ready:", event.detail);
                setStream(event.detail);
                setIsLoadingStream(false);
            });

            avatar.current.on(StreamingEvents.AVATAR_STOP_TALKING, () => {
                setIsProcessing(false);
                setIsAvatarResponding(false);
            });

            avatar.current.on(StreamingEvents.AVATAR_START_TALKING, () => {
                setIsProcessing(true);
                setIsAvatarResponding(true);
            });

            const res = await avatar.current.createStartAvatar({
                quality: projectData.quality as AvatarQuality,
                avatarName: projectData.template,
                knowledgeBase: projectData.knowledge_base,
                voice: {
                    voiceId: projectData.voice,
                    emotion: projectData.emotion as VoiceEmotion,
                },
                language: projectData.language,
                disableIdleTimeout: true,
            });

            // Start the timer after successful session start
            const duration = getSessionDuration();
            setTimeLeft(duration);

            timerRef.current = setInterval(() => {
                setTimeLeft((prev) => {
                    if (prev <= 1) {
                        if (timerRef.current) clearInterval(timerRef.current);
                        // Force close the window after timeout
                        window.close();
                        return 0;
                    }
                    return prev - 1;
                });
            }, 1000);

            // Force close after exactly 8 minutes
            const closeTimeout = setTimeout(() => {
                window.close();
            }, 8 * 60 * 1000);

            await avatar.current.startVoiceChat({
                useSilencePrompt: false
            });

        } catch (error) {
            console.error("Error setting up preview:", error);
            setIsLoadingStream(false);
        }
    };

    const handleSpeak = async () => {
        if (!avatar.current || !text.trim()) return;

        setIsLoadingRepeat(true);
        try {
            await avatar.current.speak({
                text: text
            });
        } catch (error) {
            console.error("Error making avatar speak:", error);
            toast.error("Failed to make avatar speak");
        } finally {
            setIsLoadingRepeat(false);
            setText("");
        }
    };

    const startVoiceChat = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            setIsUserTalking(true);

            mediaRecorder.current = new MediaRecorder(stream);
            audioChunks.current = [];

            mediaRecorder.current.ondataavailable = (event) => {
                if (event.data.size > 0) {
                    audioChunks.current.push(event.data);
                }
            };

            mediaRecorder.current.onstop = async () => {
                const audioBlob = new Blob(audioChunks.current, { type: 'audio/wav' });
                if (avatar.current) {
                    try {
                        await avatar.current.sendVoiceMessage(audioBlob);
                    } catch (error) {
                        console.error('Error sending voice message:', error);
                        toast.error('Failed to send voice message');
                    }
                }
                audioChunks.current = [];
            };

            mediaRecorder.current.start();
        } catch (error) {
            console.error('Error starting voice chat:', error);
            toast.error('Failed to start voice chat');
        }
    };

    const stopVoiceChat = () => {
        if (mediaRecorder.current && mediaRecorder.current.state === 'recording') {
            mediaRecorder.current.stop();
            mediaRecorder.current.stream.getTracks().forEach(track => track.stop());
        }
        setIsUserTalking(false);
    };

    const handleVoiceChatClick = () => {
        if (isUserTalking) {
            stopVoiceChat();
        } else {
            startVoiceChat();
        }
    };

    const handleInterrupt = async () => {
        if (avatar.current) {
            try {
                await avatar.current.interrupt();
                toast.success('Task interrupted');
            } catch (error) {
                console.error('Error interrupting task:', error);
                toast.error('Failed to interrupt task');
            }
        }
    };

    const endSession = () => {
        setShowEndSessionModal(true);
    };

    const handleConfirmEndSession = () => {
        if (mediaStream.current && mediaStream.current.srcObject) {
            const tracks = (mediaStream.current.srcObject as MediaStream).getTracks();
            tracks.forEach(track => track.stop());
            mediaStream.current.srcObject = null;
        }
        avatar.current = null;
        setStream(undefined);
        setShowEndSessionModal(false);
        window.close();
    };

    const handleSubscribe = async () => {
        if (!subscriberName.trim() || !subscriberEmail.trim()) {
            toast.error('Please fill in all fields');
            return;
        }

        setIsSubmitting(true);
        try {
            let userId;
            
            // First try to get user ID from userData in localStorage
            const userDataStr = localStorage.getItem('userData');
            if (userDataStr) {
                const userData = JSON.parse(userDataStr);
                userId = userData.user.id;
            } else {
                // If userData doesn't exist, try to get from preview_user_id
                const previewUserId = localStorage.getItem('preview_user_id');
                if (!previewUserId) {
                    throw new Error('User ID not found');
                }
                userId = previewUserId;
            }

            const response = await fetch('https://api.humanaiapp.com/api/add-sub-user', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    user_id: userId,
                    name: subscriberName,
                    email: subscriberEmail
                })
            });

            if (!response.ok) {
                throw new Error('Failed to subscribe');
            }

            toast.success('Subscribed successfully!');
            setShowSubscribeModal(false);
        } catch (error) {
            console.error('Subscription error:', error);
            toast.error('Failed to subscribe. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    useEffect(() => {
        const duration = getSessionDuration();
        setTimeLeft(duration);

        timerRef.current = setInterval(() => {
            setTimeLeft((prev) => {
                if (prev <= 1) {
                    if (timerRef.current) clearInterval(timerRef.current);
                    // Force close the window after timeout
                    window.close();
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        // Force close after exactly 8 minutes
        const closeTimeout = setTimeout(() => {
            window.close();
        }, 8 * 60 * 1000);

        return () => {
            if (timerRef.current) clearInterval(timerRef.current);
            clearTimeout(closeTimeout);
        };
    }, []);

    return (
        <div className="min-h-screen bg-gray-100 p-4">
            <Card className={`bg-white border border-gray-200 ${
                stream ? 'w-[90%] max-w-[1200px] mx-auto mt-8' : ''
            }`}>
                <CardBody className={`flex flex-col items-center bg-white ${
                    stream ? 'h-[70vh] min-h-[400px]' : 'h-[350px] justify-center'
                }`}>
                    {isLoadingStream ? (
                        <div className="absolute inset-0 flex items-center justify-center">
                            <Spinner size="lg" />
                        </div>
                    ) : stream ? (
                        <div className="h-full w-full justify-center items-center flex rounded-lg overflow-hidden relative">
                            <div className="absolute top-3 right-3 bg-black/50 px-3 py-1 rounded-full">
                                <span className="text-white font-mono">
                                    {formatTime(timeLeft)}
                                </span>
                            </div>
                            <video
                                ref={mediaStream}
                                autoPlay
                                playsInline
                                style={{
                                    width: "100%",
                                    height: "100%",
                                    objectFit: "contain",
                                }}
                            >
                                <track kind="captions" />
                            </video>
                            <div className="flex flex-col gap-1 absolute bottom-3 right-3">
                                <Button
                                    className="bg-indigo-500 hover:bg-indigo-600 text-white rounded-lg text-xs px-3"
                                    size="sm"
                                    onClick={handleInterrupt}
                                >
                                    Interrupt task
                                </Button>
                                <Button
                                    className="bg-indigo-500 hover:bg-indigo-600 text-white rounded-lg text-xs px-3"
                                    size="sm"
                                    onClick={endSession}
                                >
                                    End session
                                </Button>
                            </div>
                        </div>
                    ) : null}
                </CardBody>
            </Card>

            {/* Chat and Voice Controls */}
            <div className="fixed bottom-8 left-1/2 -translate-x-1/2 w-[90%] max-w-[1200px] px-4">
                <Card className="bg-black/40 backdrop-blur-md border-t border-white/20">
                    <CardBody className="p-4">
                        <Tabs
                            aria-label="Chat Options"
                            selectedKey={chatMode}
                            onSelectionChange={(key) => setChatMode(key.toString())}
                            className="flex justify-center"
                            classNames={{
                                tabList: "bg-transparent",
                                cursor: "bg-indigo-500",
                                tab: "text-white",
                                tabContent: "group-data-[selected=true]:text-white"
                            }}
                        >
                            <Tab
                                key="text_mode"
                                title={
                                    <Tooltip content="Text Mode">
                                        <MessageSquareText
                                            size={24}
                                            className={`${chatMode === "text_mode" ? "text-white" : "text-indigo-500"} transition-colors`}
                                        />
                                    </Tooltip>
                                }
                            />
                            <Tab
                                key="voice_mode"
                                title={
                                    <Tooltip content="Voice Mode">
                                        <Mic
                                            size={24}
                                            className={`${chatMode === "voice_mode" ? "text-white" : "text-indigo-500"} transition-colors`}
                                        />
                                    </Tooltip>
                                }
                            />
                        </Tabs>

                        {chatMode === "text_mode" ? (
                            <div className="w-full flex relative mt-4">
                                <InteractiveAvatarTextInput
                                    disabled={!stream}
                                    input={text}
                                    label=""
                                    loading={isLoadingRepeat}
                                    placeholder="Type something for the AI Human to respond"
                                    setInput={setText}
                                    onSubmit={handleSpeak}
                                />
                            </div>
                        ) : (
                            <div className="w-full text-center mt-4 pb-2">
                                <Button
                                    isDisabled={!stream || isAvatarResponding}
                                    className="bg-gradient-to-tr from-indigo-500 to-indigo-300 text-white"
                                    size="lg"
                                    onClick={handleVoiceChatClick}
                                >
                                    {isAvatarResponding
                                        ? "Human AI is responding..."
                                        : isUserTalking
                                            ? "Listening..."
                                            : "Voice chat"
                                    }
                                </Button>
                            </div>
                        )}
                    </CardBody>
                </Card>
            </div>

            {/* End Session Modal */}
            <Modal
                isOpen={showEndSessionModal}
                onClose={() => setShowEndSessionModal(false)}
                size="sm"
            >
                <ModalContent>
                    <div className="p-6">
                        <div className="flex flex-col items-center gap-4">
                            <div className="p-3 bg-gray-100 rounded-full">
                                <LogOut className="w-6 h-6 text-gray-600" />
                            </div>
                            <h3 className="text-lg font-semibold text-gray-900">
                                End Session
                            </h3>
                            <p className="text-sm text-gray-500 text-center">
                                Are you sure you want to end this session? This will close this window.
                            </p>
                            <div className="flex gap-3 w-full mt-2">
                                <Button
                                    className="flex-1 bg-gray-100 text-gray-700 hover:bg-gray-200"
                                    onClick={() => setShowEndSessionModal(false)}
                                >
                                    Cancel
                                </Button>
                                <Button
                                    className="flex-1 bg-indigo-500 text-white hover:bg-indigo-600"
                                    onClick={handleConfirmEndSession}
                                >
                                    End Session
                                </Button>
                            </div>
                        </div>
                    </div>
                </ModalContent>
            </Modal>

            {/* Subscription Modal */}
            <Modal
                isOpen={showSubscribeModal}
                onClose={() => setShowSubscribeModal(false)}
                size="md"
                isDismissable={true}
            >
                <ModalContent>
                    <div className="p-6">
                        <div className="mb-4">
                            <h3 className="text-lg font-semibold text-gray-900">
                                Subscribe for Updates
                            </h3>
                            <p className="text-sm text-gray-500 mt-1">
                                Get automatic updates and our latest newsletter
                            </p>
                        </div>
                        
                        <fieldset className="flex flex-col gap-4">
                            <legend className="sr-only">Subscription Form</legend>
                            <Input
                                label="Name"
                                placeholder="Enter your name"
                                value={subscriberName}
                                onChange={(e) => setSubscriberName(e.target.value)}
                                variant="bordered"
                                classNames={{
                                    input: "text-sm",
                                    label: "text-sm"
                                }}
                            />
                            
                            <Input
                                label="Email"
                                placeholder="Enter your email"
                                value={subscriberEmail}
                                onChange={(e) => setSubscriberEmail(e.target.value)}
                                type="email"
                                variant="bordered"
                                classNames={{
                                    input: "text-sm",
                                    label: "text-sm"
                                }}
                            />

                            <div className="flex gap-3 mt-2">
                                <Button
                                    className="flex-1 border-2 border-gray-200 bg-transparent text-gray-700 hover:bg-gray-50"
                                    onClick={() => setShowSubscribeModal(false)}
                                >
                                    Skip
                                </Button>
                                <Button
                                    className="flex-1 text-white"
                                    onClick={handleSubscribe}
                                    isLoading={isSubmitting}
                                    style={{
                                        background: 'linear-gradient(135deg, #6366F1 0%, #111827 100%)',
                                    }}
                                    sx={{
                                        '&:hover': {
                                            opacity: 0.9,
                                        },
                                    }}
                                >
                                    Subscribe
                                </Button>
                            </div>
                        </fieldset>
                    </div>
                </ModalContent>
            </Modal>
        </div>
    );
} 