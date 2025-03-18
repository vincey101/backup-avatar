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
  Input,
  Textarea,
} from "@nextui-org/react";
import { Eye, Link, FileUp, File, Link as LinkIcon, FileText } from 'lucide-react';
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
import { TrashIcon } from '@heroicons/react/24/outline';

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

// Add this helper function at the top level, similar to AvatarTemplateLibrary.tsx
const getUserAccessLevel = () => {
  try {
    const userData = localStorage.getItem('userData');
    if (!userData) return null;
    
    const { user } = JSON.parse(userData);
    return {
      oto_1: user.oto_1
    };
  } catch (error) {
    console.error('Error parsing user data:', error);
    return null;
  }
};

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

  // New state for tracking which project is being deleted
  const [projectToDelete, setProjectToDelete] = useState<Project | null>(null);
  const {
    isOpen: isDeleteModalOpen,
    onOpen: onDeleteModalOpen,
    onClose: onDeleteModalClose
  } = useDisclosure();

  const router = useRouter();

  const [userAccess, setUserAccess] = useState<{ oto_1: number } | null>(null);

  // Add new state variables
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [selectedKnowledgeType, setSelectedKnowledgeType] = useState<'url' | 'text' | 'pdf' | 'doc' | null>(null);
  const [knowledgeBase, setKnowledgeBase] = useState('');
  const [isProcessingFile, setIsProcessingFile] = useState(false);
  const [processingStatus, setProcessingStatus] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUpdating, setIsUpdating] = useState(false);

  // Add useEffect to get user access level when component mounts
  useEffect(() => {
    const access = getUserAccessLevel();
    setUserAccess(access);
  }, []);

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
        console.error('Error fetching projects:', error);
    } finally {
        setIsLoading(false);
    }
  };

  const handlePreview = (project: Project) => {
    // The URL format is already correct in your code
    window.open(`/app/${encodeURIComponent(project.project_name)}`, '_blank');
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
    // Create the iframe HTML with dynamic project name and timeout script
    const iframeCode = `
<!-- AI Human Embed Code -->
<div id="ai-human-container">
    <iframe 
        src="https://humanaiapp.com/app/${encodeURIComponent(project.project_name)}?hideNotifications=true&disablePreview=true" 
        width="500" 
        height="400" 
        style="transform: scale(0.8); transform-origin: 0 0; border: 1px solid #ddd;"
        allow="microphone; camera; display-capture; fullscreen; notifications"
        sandbox="allow-same-origin allow-scripts allow-popups allow-forms allow-downloads allow-modals"
        referrerpolicy="no-referrer"
    ></iframe>
</div>
<script>
    // Auto-close iframe after 8 minutes
    setTimeout(() => {
        const container = document.getElementById('ai-human-container');
        if (container) {
            container.innerHTML = '<div style="padding: 20px; text-align: center; background: #f5f5f5; border: 1px solid #ddd;">Session expired. Please refresh to start a new session.</div>';
        }
    }, 8 * 60 * 1000);
</script>`;

    // Copy to clipboard
    navigator.clipboard.writeText(iframeCode).then(() => {
        setCopiedProjectId(project.id);
        setTimeout(() => setCopiedProjectId(null), 2000); // Reset after 2 seconds
        toast.success('Embed code copied to clipboard!');
    }).catch(() => {
        toast.error('Failed to copy embed code');
    });
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

  const handleDeleteClick = (project: Project) => {
    setProjectToDelete(project);
    onDeleteModalOpen();
  };

  const handleConfirmDelete = async () => {
    if (!projectToDelete) return;

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

      const response = await fetch(`https://api.humanaiapp.com/api/delete-avater/${projectToDelete.id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }

      setProjects(prevProjects => prevProjects.filter(project => project.id !== projectToDelete.id));
      toast.success('Project deleted successfully');
      onDeleteModalClose();
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to delete project';
      toast.error(errorMessage);
      console.error('Error deleting project:', error);
    }
  };

  // Update handleUpdateClick to properly set initial content
  const handleUpdateClick = (project: Project) => {
    setSelectedProject(project);
    // Set initial knowledge base from API without processing
    setKnowledgeBase(project.knowledge_base || '');
    setSelectedKnowledgeType(null);
    setProcessingStatus('Ready'); // Changed from 'Processed' to 'Ready' to differentiate
    setShowUpdateModal(true);
  };

  // Update handleFileUpload to append new content to existing
  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    console.log('File selected:', file.name, 'Type:', file.type);
    // Check file extension
    const fileExtension = file.name.split('.').pop()?.toLowerCase();
    if (
        (selectedKnowledgeType === 'pdf' && fileExtension !== 'pdf') ||
        (selectedKnowledgeType === 'doc' && !['doc', 'docx'].includes(fileExtension || ''))
    ) {
        toast.error(`Please upload a valid ${selectedKnowledgeType?.toUpperCase()} file`);
        return;
    }

    setIsProcessingFile(true);
    setProcessingStatus('Processing new file...');

    try {
        let extractedText = '';

        if (selectedKnowledgeType === 'pdf') {
            extractedText = await extractPdfContent(file);
        } else if (selectedKnowledgeType === 'doc') {
            console.log('Processing DOCX file...');
            extractedText = await extractDocxContent(file);
            console.log('Extracted DOCX content:', extractedText ? 'Content received' : 'No content');
        }

        if (extractedText) {
            // Combine existing knowledge base with new content
            setKnowledgeBase(prevContent => {
                const existingContent = prevContent.trim();
                const newContent = extractedText.trim();
                
                // If there's existing content, add two newlines before new content
                return existingContent 
                    ? `${existingContent}\n\n${newContent}`
                    : newContent;
            });
            
            setProcessingStatus('Processed');
        } else {
            throw new Error('No content extracted from file');
        }
    } catch (error) {
        console.error('File processing error:', error);
        setProcessingStatus('Failed to process new file');
        toast.error('Failed to process new file');
    } finally {
        setIsProcessingFile(false);
    }
  };

  // Update click handlers to ensure fields are cleared
  const handleUrlClick = () => {
    setSelectedKnowledgeType('url');
    setKnowledgeBase('');
    setProcessingStatus('');
  };

  const handleTextClick = () => {
    setSelectedKnowledgeType('text');
    setKnowledgeBase('');
    setProcessingStatus('');
  };

  const handlePdfClick = () => {
    setSelectedKnowledgeType('pdf');
    setKnowledgeBase('');
    setProcessingStatus('');
    if (fileInputRef.current) {
        fileInputRef.current.accept = '.pdf, application/pdf';
        fileInputRef.current.click();
    }
  };

  const handleDocClick = () => {
    setSelectedKnowledgeType('doc');
    setKnowledgeBase('');
    setProcessingStatus('');
    if (fileInputRef.current) {
        fileInputRef.current.accept = '.docx, .doc, application/vnd.openxmlformats-officedocument.wordprocessingml.document, application/msword';
        fileInputRef.current.click();
    }
  };

  const extractPdfContent = async (file: File): Promise<string> => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('type', 'pdf');

    try {
        const userDataStr = localStorage.getItem('userData');
        if (!userDataStr) {
            throw new Error('User data not found');
        }

        const userData = JSON.parse(userDataStr);
        const token = userData.token;

        const response = await fetch('/api/process-document', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
            },
            body: formData,
        });

        if (!response.ok) {
            throw new Error('Failed to process PDF');
        }

        const data = await response.json();
        return data.content;
    } catch (error) {
        console.error('Error processing PDF:', error);
        throw error;
    }
  };

  const extractDocxContent = async (file: File): Promise<string> => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('type', 'docx');

    try {
        const userDataStr = localStorage.getItem('userData');
        if (!userDataStr) {
            throw new Error('User data not found');
        }

        const userData = JSON.parse(userDataStr);
        const token = userData.token;

        console.log('Processing DOCX with token:', token);

        const response = await fetch('/api/process-document', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
            },
            body: formData,
        });

        if (!response.ok) {
            throw new Error('Failed to process DOCX');
        }

        const data = await response.json();
        // Handle the specific DOCX response format
        if (data.content && typeof data.content === 'string') {
            return data.content;
        } else if (data.content && data.content.data) {
            return data.content.data;
        } else {
            throw new Error('Invalid response format from DOCX processing');
        }
    } catch (error) {
        console.error('Error processing DOCX:', error);
        throw error;
    }
  };

  // Add the handleUpdate function back
  const handleUpdate = async () => {
    if (!selectedProject || !knowledgeBase) return;
    
    setIsUpdating(true);
    try {
        const userDataStr = localStorage.getItem('userData');
        if (!userDataStr) throw new Error('User data not found');

        const userData = JSON.parse(userDataStr);
        const token = userData.token;

        // Send update request with all required fields
        const response = await fetch(`https://api.humanaiapp.com/api/update-avater/${selectedProject.id}`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                // Keep all original fields from the selected project
                project_name: selectedProject.project_name,
                niche: selectedProject.niche,
                template: selectedProject.template,
                language: selectedProject.language,
                voice: selectedProject.voice,
                emotion: selectedProject.emotion,
                quality: selectedProject.quality || "high",
                video_encoding: selectedProject.video_encoding || "h264",
                // Add the new knowledge base content
                knowledge_base: knowledgeBase
            })
        });

        const data = await response.json();

        if (data.status === "success") {
            toast.success('Knowledge base updated successfully');
            setShowUpdateModal(false);
            fetchProjects(); // Refresh the list to get the updated knowledge_base
        } else {
            toast.error(data.message || 'Failed to update knowledge base');
        }
    } catch (error) {
        toast.error('An error occurred while updating knowledge base');
    } finally {
        setIsUpdating(false);
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
          <TableColumn>ACTIONS</TableColumn>
          <TableColumn>EMBED</TableColumn>
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
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="flat"
                    className="text-xs bg-emerald-50 text-emerald-600 hover:bg-emerald-100"
                    startContent={<Eye className="w-3 h-3" />}
                    onClick={() => handlePreview(project)}
                  >
                    Preview
                  </Button>
                  <Button
                    size="sm"
                    variant="flat"
                    className="text-xs bg-blue-50 text-blue-600 hover:bg-blue-100"
                    onClick={() => handleUpdateClick(project)}
                  >
                    Update
                  </Button>
                  {userAccess?.oto_1 === 1 && (
                    <Button
                      size="sm"
                      variant="flat"
                      className="text-xs bg-red-50 text-red-600 hover:bg-red-100"
                      startContent={<TrashIcon className="w-4 h-4 text-red-600" />}
                      onClick={() => handleDeleteClick(project)}
                    >
                      Delete
                    </Button>
                  )}
                </div>
              </TableCell>
              <TableCell>
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
              </TableCell>
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

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={isDeleteModalOpen}
        onClose={onDeleteModalClose}
        size="sm"
      >
        <ModalContent>
          <ModalBody className="py-6">
            <div className="text-center">
              <TrashIcon className="h-12 w-12 text-red-500 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Delete Project
              </h3>
              <p className="text-sm text-gray-500 mb-6">
                Are you sure you want to delete "{projectToDelete?.project_name}"? This action cannot be undone.
              </p>
              <div className="flex gap-3 justify-center">
                <Button
                  size="sm"
                  variant="flat"
                  color="default"
                  onClick={onDeleteModalClose}
                >
                  Cancel
                </Button>
                <Button
                  size="sm"
                  color="danger"
                  onClick={handleConfirmDelete}
                >
                  Delete Project
                </Button>
              </div>
            </div>
          </ModalBody>
        </ModalContent>
      </Modal>

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

      {/* Update Modal */}
      <Modal 
        isOpen={showUpdateModal} 
        onOpenChange={setShowUpdateModal}
        size="2xl"
      >
        <ModalContent>
          {(onClose) => (
            <div className="p-6">
              <h3 className="text-lg font-semibold mb-4">Update Knowledge Base</h3>
              
              <div className="flex gap-3 mb-4">
                <Tooltip content="Enter URL">
                  <Button
                    className={`flex items-center justify-center p-3 h-12 transition-all duration-300 ${
                      selectedKnowledgeType === 'url'
                      ? 'bg-gradient-to-tr from-purple-600 to-pink-500 text-white shadow-lg scale-105'
                      : 'bg-gradient-to-tr from-white to-purple-50 hover:from-purple-50 hover:to-purple-100 border border-purple-100 shadow-sm hover:shadow-md hover:scale-105'
                    }`}
                    onClick={handleUrlClick}
                  >
                    <LinkIcon size={18} className={selectedKnowledgeType === 'url' ? 'text-white' : 'text-purple-500'} />
                  </Button>
                </Tooltip>

                <Tooltip content="Text Content">
                  <Button
                    className={`flex items-center justify-center p-3 h-12 transition-all duration-300 ${
                      selectedKnowledgeType === 'text'
                      ? 'bg-gradient-to-tr from-purple-600 to-pink-500 text-white shadow-lg scale-105'
                      : 'bg-gradient-to-tr from-white to-rose-50 hover:from-rose-50 hover:to-rose-100 border border-purple-100 shadow-sm hover:shadow-md hover:scale-105'
                    }`}
                    onClick={handleTextClick}
                  >
                    <FileText size={18} className={selectedKnowledgeType === 'text' ? 'text-white' : 'text-pink-500'} />
                  </Button>
                </Tooltip>

                <Tooltip content="Upload PDF">
                  <Button
                    className={`flex items-center justify-center p-3 h-12 transition-all duration-300 ${
                      selectedKnowledgeType === 'pdf'
                      ? 'bg-gradient-to-tr from-purple-600 to-pink-500 text-white shadow-lg scale-105'
                      : 'bg-gradient-to-tr from-white to-fuchsia-50 hover:from-fuchsia-50 hover:to-fuchsia-100 border border-purple-100 shadow-sm hover:shadow-md hover:scale-105'
                    }`}
                    onClick={handlePdfClick}
                  >
                    <FileUp
                      size={18}
                      className={selectedKnowledgeType === 'pdf' ? 'text-white' : 'text-fuchsia-500'}
                    />
                  </Button>
                </Tooltip>

                <Tooltip content="Upload Word Document">
                  <Button
                    className={`flex items-center justify-center p-3 h-12 transition-all duration-300 ${
                      selectedKnowledgeType === 'doc'
                      ? 'bg-gradient-to-tr from-purple-600 to-pink-500 text-white shadow-lg scale-105'
                      : 'bg-gradient-to-tr from-white to-violet-50 hover:from-violet-50 hover:to-violet-100 border border-purple-100 shadow-sm hover:shadow-md hover:scale-105'
                    }`}
                    onClick={handleDocClick}
                  >
                    <File
                      size={18}
                      className={selectedKnowledgeType === 'doc' ? 'text-white' : 'text-violet-500'}
                    />
                  </Button>
                </Tooltip>
              </div>

              {/* Add input fields based on selected type */}
              {selectedKnowledgeType === 'url' && (
                  <div className="mt-4">
                      <Input
                          placeholder="Enter URL"
                          value={knowledgeBase}
                          onChange={(e) => setKnowledgeBase(e.target.value)}
                          startContent={<LinkIcon size={18} />}
                          classNames={{
                              input: "text-sm",
                              base: "border-1 border-gray-200"
                          }}
                      />
                  </div>
              )}

              {selectedKnowledgeType === 'text' && (
                  <div className="mt-4">
                      <Textarea
                          placeholder="Enter or paste your text content"
                          value={knowledgeBase}
                          onValueChange={setKnowledgeBase}
                          minRows={3}
                          maxRows={4}
                          classNames={{
                              input: "text-sm py-1",
                              base: "border-1 border-gray-200"
                          }}
                      />
                  </div>
              )}

              {/* File upload status and preview */}
              {(selectedKnowledgeType === 'pdf' || selectedKnowledgeType === 'doc') && (
                  <div className="flex flex-col gap-2 mt-4">
                      <div className="flex items-center gap-2 text-sm">
                          <div className="flex items-center gap-2 px-2 py-1 bg-gray-50 rounded-lg">
                              {selectedKnowledgeType === 'pdf' ? (
                                  <FileUp size={14} className="text-fuchsia-500" />
                              ) : (
                                  <File size={14} className="text-violet-500" />
                              )}
                              <span className="text-gray-600 text-xs">
                                  {isProcessingFile 
                                      ? 'Processing new file...' 
                                      : processingStatus === 'Ready' 
                                          ? 'Existing content loaded' 
                                          : processingStatus === 'Processed'
                                              ? 'Content ready for editing'
                                              : 'Select a file to process'
                                  }
                              </span>
                              {isProcessingFile && <Spinner size="sm" color="secondary" />}
                          </div>
                      </div>

                      {/* Show editable content area only after processing or when there's existing content */}
                      {(processingStatus === 'Processed' || processingStatus === 'Ready') && knowledgeBase && (
                          <div className="mt-2">
                              <div className="flex justify-between items-center mb-2">
                                  <span className="text-sm text-gray-600">Edit Content</span>
                                  <span className="text-xs text-gray-400">{knowledgeBase.length} characters</span>
                              </div>
                              <Textarea
                                  value={knowledgeBase}
                                  onValueChange={setKnowledgeBase}
                                  minRows={3}
                                  maxRows={8}
                                  placeholder="Edit your content here..."
                                  classNames={{
                                      input: "text-sm py-1",
                                      base: "border-1 border-gray-200"
                                  }}
                              />
                          </div>
                      )}
                  </div>
              )}

              <div className="flex justify-end gap-2 mt-6">
                <Button
                  variant="light"
                  onPress={onClose}
                >
                  Cancel
                </Button>
                <Button
                  className="bg-gradient-to-tr from-indigo-500 to-indigo-300 text-white shadow-md hover:shadow-lg transform transition-all duration-200 hover:scale-[1.02]"
                  onClick={handleUpdate}
                  isLoading={isUpdating}
                  isDisabled={!knowledgeBase.trim()}
                >
                  Update
                </Button>
              </div>
            </div>
          )}
        </ModalContent>
      </Modal>

      <input
        type="file"
        ref={fileInputRef}
        className="hidden"
        onChange={handleFileUpload}
        accept={selectedKnowledgeType === 'pdf' 
            ? '.pdf, application/pdf' 
            : '.docx, .doc, application/vnd.openxmlformats-officedocument.wordprocessingml.document, application/msword'
        }
      />
    </div>
  );
} 