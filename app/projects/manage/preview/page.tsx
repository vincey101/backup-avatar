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
import { Mic, MessageSquareText, LogOut } from 'lucide-react';
import InteractiveAvatarTextInput from '@/components/InteractiveAvatarTextInput';

export default function Preview() {
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

    useEffect(() => {
        const fetchProjectData = async () => {
            // Get project name from URL parameters
            const params = new URLSearchParams(window.location.search);
            const projectName = params.get('name');

            if (!projectName) {
                toast.error('No project name found');
                return;
            }

            try {
                // Get the token from localStorage if available, otherwise proceed without it
                const userDataStr = localStorage.getItem('userData');
                const token = userDataStr ? JSON.parse(userDataStr).token : null;

                // Fetch project data from API
                const response = await fetch(`https://api.humanaiapp.com/api/get-ai-project?name=${encodeURIComponent(projectName)}`, {
                    headers: {
                        'Content-Type': 'application/json',
                        ...(token && { 'Authorization': `Bearer ${token}` })
                    },
                });

                if (!response.ok) {
                    throw new Error('Failed to fetch project data');
                }

                const data = await response.json();
                const projectData = data.data.find((p: any) => p.project_name === projectName);

                if (!projectData) {
                    throw new Error('Project not found');
                }

                setProject(projectData);
                initializePreview(projectData);
            } catch (error) {
                console.error('Error fetching project:', error);
                toast.error('Failed to load project');
            }
        };

        fetchProjectData();
    }, []);

    useEffect(() => {
        if (stream && mediaStream.current) {
            mediaStream.current.srcObject = stream;
        }
    }, [stream]);

    const initializePreview = async (projectData: any) => {
        try {
            const response = await fetch("/api/get-access-token", {
                method: "POST",
            });
            const token = await response.text();

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

            await avatar.current.startVoiceChat({
                useSilencePrompt: false
            });

        } catch (error) {
            console.error("Error setting up preview:", error);
            toast.error("Failed to load preview");
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

    return (
        <div className="min-h-screen bg-gray-100 p-4">
            <Card className={`bg-white border border-gray-200 ${stream ? 'w-[98%] max-w-[2000px] min-w-[1400px] mx-auto fixed top-4 left-1/2 -translate-x-1/2 z-50' : ''
                }`}>
                <CardBody className={`flex flex-col items-center bg-white ${stream ? 'h-[calc(100vh-300px)] min-h-[450px]' : 'h-[350px] justify-center'
                    }`}>
                    {isLoadingStream ? (
                        <div className="absolute inset-0 flex items-center justify-center">
                            <Spinner size="lg" />
                        </div>
                    ) : stream ? (
                        <div className="h-full w-full justify-center items-center flex rounded-lg overflow-hidden relative">
                            <video
                                ref={mediaStream}
                                autoPlay
                                playsInline
                                style={{
                                    width: "100%",
                                    height: "100%",
                                    objectFit: "cover",
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
            <div className="fixed bottom-8 left-1/2 -translate-x-1/2 w-full max-w-[1400px] px-4">
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
        </div>
    );
} 