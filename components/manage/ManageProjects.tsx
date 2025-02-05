'use client';

import { useEffect, useState, useRef } from 'react';
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Button,
  Tooltip,
  Spinner,
  Chip,
  Modal,
  ModalContent,
  ModalBody,
  useDisclosure,
  Card,
  CardBody,
  Tabs,
  Tab,
} from "@nextui-org/react";
import { Eye, Link } from 'lucide-react';
import CodeIcon from '@mui/icons-material/Code';
import { toast } from 'sonner';
import type { StartAvatarResponse } from "@heygen/streaming-avatar";
import StreamingAvatar, {
  AvatarQuality,
  StreamingEvents,
  TaskMode,
  TaskType,
  VoiceEmotion,
} from "@heygen/streaming-avatar";
import InteractiveAvatarTextInput from '@/components/InteractiveAvatarTextInput';
import { SendHorizontal, Mic } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface Project {
  id: number;
  project_name: string;
  niche: string;
  template: string;
  knowledge_base: string;
  language: string;
  voice: string;
  emotion: string;
  quality: string;
  user_id: number;
  video_encoding: string;
}

export default function ManageProjects() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // New states for streaming (from InteractiveAvatar)
  const [stream, setStream] = useState<MediaStream>();
  const [isLoadingStream, setIsLoadingStream] = useState(false);
  const mediaStream = useRef<HTMLVideoElement>(null);
  const avatar = useRef<StreamingAvatar | null>(null);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const { isOpen, onOpen, onClose } = useDisclosure();

  // New states for chat mode
  const [chatMode, setChatMode] = useState("text_mode");
  const [text, setText] = useState("");
  const [isLoadingRepeat, setIsLoadingRepeat] = useState(false);
  const [isUserTalking, setIsUserTalking] = useState(false);

  // Add state for copy feedback
  const [copiedProjectId, setCopiedProjectId] = useState<number | null>(null);

  const router = useRouter();

  useEffect(() => {
    fetchProjects();
  }, []);

  useEffect(() => {
    if (stream && mediaStream.current) {
      mediaStream.current.srcObject = stream;
    }
  }, [stream]);

  const fetchProjects = async () => {
    try {
      // Get the token from localStorage
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
      setProjects(data.data || []); // Access the data array from the response
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to load projects';
      setError(errorMessage);
      toast.error(errorMessage);
      console.error('Error fetching projects:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePreview = (project: Project) => {
    // Only pass the project name in URL
    window.open(`/projects/manage/preview?name=${encodeURIComponent(project.project_name)}`, '_blank');
  };

  const handleEndSession = () => {
    if (avatar.current) {
      // Clear the stream
      if (mediaStream.current && mediaStream.current.srcObject) {
        const tracks = (mediaStream.current.srcObject as MediaStream).getTracks();
        tracks.forEach(track => track.stop());
        mediaStream.current.srcObject = null;
      }

      // Clear the avatar instance
      avatar.current = null;
      setStream(undefined);
    }
    onClose();
  };

  const handleCopyEmbed = (project: Project) => {
    const embedCode = `<!-- Human AI Studio Embed Code -->
<div id="human-ai-container"></div>
<script>
(async function() {
  try {
    // Initialize container
    const container = document.getElementById('human-ai-container');
    container.style.width = '100%';
    container.style.height = '600px';
    container.style.position = 'relative';

    // Load HeyGen SDK - Using the correct official SDK URL
    const script = document.createElement('script');
    script.src = 'https://sdk.heygen.com/StreamingAvatar.umd.js';
    document.head.appendChild(script);

    await new Promise(resolve => script.onload = resolve);

    // Get access token from your server
    const tokenResponse = await fetch('YOUR_SERVER_ENDPOINT/get-access-token');
    const accessToken = await tokenResponse.text();

    // Initialize avatar with project settings
    const avatar = new StreamingAvatar({
      token: accessToken,
    });

    // Start avatar session
    await avatar.createStartAvatar({
      avatarName: '${project.template}',
      knowledgeBase: '${project.knowledge_base}',
      voice: {
        voiceId: '${project.voice}',
        emotion: '${project.emotion}'
      },
      language: '${project.language}',
      quality: '${project.quality}',
      disableIdleTimeout: true
    });

    // Add chat interface
    const chatInterface = document.createElement('div');
    chatInterface.style.position = 'absolute';
    chatInterface.style.bottom = '20px';
    chatInterface.style.left = '50%';
    chatInterface.style.transform = 'translateX(-50%)';
    chatInterface.style.width = '80%';
    chatInterface.style.maxWidth = '600px';
    chatInterface.innerHTML = \`
      <div style="background: rgba(0,0,0,0.4); backdrop-filter: blur(8px); padding: 15px; border-radius: 12px;">
        <input 
          type="text" 
          placeholder="Type something to chat with the AI..."
          style="width: 100%; padding: 10px; border-radius: 8px; border: none; background: white;"
        >
      </div>
    \`;

    container.appendChild(chatInterface);

    // Handle chat input
    const input = chatInterface.querySelector('input');
    input.addEventListener('keypress', async (e) => {
      if (e.key === 'Enter' && input.value.trim()) {
        await avatar.speak({
          text: input.value,
          isFinal: true
        });
        input.value = '';
      }
    });

  } catch (error) {
    console.error('Error initializing Human AI:', error);
  }
})();
</script>`;

    navigator.clipboard.writeText(embedCode);
    toast.success('Script copied to clipboard');

    setCopiedProjectId(project.id);
    setTimeout(() => {
      setCopiedProjectId(null);
    }, 2000);
  };

  const handleCopyLink = (projectUrl: string) => {
    navigator.clipboard.writeText(projectUrl);
    toast.success('Project URL copied to clipboard');
  };

  const handleSpeak = async () => {
    if (!avatar.current || !text.trim()) return;

    setIsLoadingRepeat(true);
    try {
      await avatar.current.speak({
        text: text,
        isFinal: true
      });
    } catch (error) {
      console.error("Error making avatar speak:", error);
      toast.error("Failed to make avatar speak");
    } finally {
      setIsLoadingRepeat(false);
      setText("");
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <div className="mb-6">
        {/* <h2 className="text-xl font-semibold text-gray-800">Your Projects</h2> */}
        <p className="text-sm text-gray-500 mt-1">Manage and access all your AI Human projects</p>
      </div>

      <Table
        aria-label="Projects table"
        classNames={{
          wrapper: "shadow-none",
          table: "min-h-[400px]",
          thead: "bg-gray-50/50",
          th: "text-gray-600 font-semibold",
          tr: "border-b hover:bg-gray-50/50 transition-colors",
          td: "py-4",
        }}
      >
        <TableHeader>
          <TableColumn className="w-[80px]">S/N</TableColumn>
          <TableColumn>PROJECT NAME</TableColumn>
          <TableColumn>NICHE</TableColumn>
          <TableColumn>PREVIEW</TableColumn>
          {/* <TableColumn>EMBED</TableColumn> */}
        </TableHeader>
        <TableBody emptyContent={
          <div className="text-center py-8 text-gray-500">
            No projects found. Create a new project to get started.
          </div>
        }>
          {projects.map((project, index) => (
            <TableRow
              key={project.id}
              className="border-b border-gray-200 last:border-b-0"
            >
              <TableCell className="border-r border-gray-100">
                <Chip
                  size="sm"
                  variant="flat"
                  classNames={{
                    base: "bg-gray-100 text-gray-600",
                    content: "text-xs font-medium"
                  }}
                >
                  {index + 1}
                </Chip>
              </TableCell>
              <TableCell>
                <span className="text-sm font-medium text-indigo-600">
                  {project.project_name}
                </span>
              </TableCell>
              <TableCell>
                <Chip
                  size="sm"
                  variant="flat"
                  classNames={{
                    base: "bg-purple-50 border border-purple-200",
                    content: "text-xs font-medium text-purple-600"
                  }}
                >
                  {project.niche}
                </Chip>
              </TableCell>
              <TableCell>
                <Button
                  size="sm"
                  variant="flat"
                  className="text-xs bg-emerald-50 text-emerald-600 hover:bg-emerald-100"
                  startContent={<Eye className="w-3 h-3" />}
                  onClick={() => handlePreview(project)}
                >
                  Preview
                </Button>
              </TableCell>
              {/* <TableCell>
                <Tooltip content="Copy Script Code">
                  <Button
                    size="sm"
                    variant="flat"
                    className="text-xs bg-blue-50 text-blue-600 hover:bg-blue-100"
                    onClick={() => handleCopyEmbed(project)}
                    startContent={<CodeIcon className="w-4 h-4" />}
                  >
                    {copiedProjectId === project.id ? "Copied!" : "Get Script"}
                  </Button>
                </Tooltip>
              </TableCell> */}
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {isLoading && (
        <div className="flex justify-center items-center h-64">
          <Spinner size="lg" />
        </div>
      )}

      {error && (
        <div className="flex flex-col items-center justify-center h-64 gap-4">
          <p className="text-red-500">{error}</p>
          <Button
            color="primary"
            onClick={() => {
              setError(null);
              setIsLoading(true);
              fetchProjects();
            }}
          >
            Try Again
          </Button>
        </div>
      )}

      {/* Add Modal for Preview */}
      <Modal
        isOpen={isOpen}
        onClose={handleEndSession}
        size="full"
        classNames={{
          body: "p-0",
        }}
      >
        <ModalContent>
          <ModalBody>
            <Card className={`bg-white border border-gray-200 ${stream ? 'w-[98%] max-w-[2000px] min-w-[1400px] mx-auto fixed top-4 left-1/2 -translate-x-1/2 z-50' : ''
              }`}>
              <CardBody className={`flex flex-col items-center bg-white ${stream ? 'h-[calc(100vh-300px)] min-h-[450px]' : 'h-[350px] justify-center'
                }`}>
                {isLoadingStream ? (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Spinner size="lg" />
                  </div>
                ) : stream ? (
                  <div className="h-full w-full justify-center items-center flex rounded-lg overflow-hidden">
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
                          <SendHorizontal
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
                        isDisabled={!stream}
                        className="bg-gradient-to-tr from-indigo-500 to-indigo-300 text-white"
                        size="lg"
                      >
                        {isUserTalking ? "Listening..." : "Click to Start Voice Chat"}
                      </Button>
                    </div>
                  )}
                </CardBody>
              </Card>
            </div>
          </ModalBody>
        </ModalContent>
      </Modal>
    </div>
  );
} 