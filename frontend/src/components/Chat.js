import { useState, useEffect, useRef } from 'react';
import { FiSend, FiPaperclip, FiMessageSquare, FiX } from 'react-icons/fi';
import { sendMessage, getChatHistory, uploadPdf } from '../services/api';

// Embedded TypingIndicator component
const TypingIndicator = () => (
  <div className="typing-indicator">
    <div className="typing-dot"></div>
    <div className="typing-dot"></div>
    <div className="typing-dot"></div>
  </div>
);

// Embedded FilePreview component
const FilePreview = ({ file, onRemove }) => (
  <div className="file-preview">
    <span className="file-name">{file.name}</span>
    <button className="remove-file" onClick={onRemove}>
      <FiX size={14} />
    </button>
  </div>
);

// Message component (updated version)
const Message = ({ sender, text, files, timestamp, isError }) => {
  const formattedTime = new Date(timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  
  return (
    <div className={`message ${sender} ${isError ? 'error' : ''}`}>
      <div className="message-content">
        {text}
        {files && files.length > 0 && (
          <div className="message-files">
            {files.map((file, i) => (
              <div key={i} className="message-file">
                <FiPaperclip size={12} />
                <span>{file.name}</span>
              </div>
            ))}
          </div>
        )}
        <span className="message-time">{formattedTime}</span>
      </div>
    </div>
  );
};

const Chat = () => {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  const [files, setFiles] = useState([]);
  const [error, setError] = useState(null);
  const messagesEndRef = useRef(null);
  const fileInputRef = useRef(null);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        setIsTyping(true);
        const response = await getChatHistory();
        setMessages(response.data || []);
      } catch (error) {
        setError('Failed to load chat history');
        console.error('Error fetching history:', error);
      } finally {
        setIsTyping(false);
      }
    };
    fetchHistory();
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!message.trim() && files.length === 0) return;

    const userMessage = { 
      sender: 'user', 
      text: message,
      files: [...files],
      timestamp: new Date().toISOString()
    };
    setMessages(prev => [...prev, userMessage]);
    setMessage('');
    setFiles([]);
    setIsTyping(true);

    try {
      let fileContents = '';
      if (files.length > 0) {
        const uploadPromises = files.map(file => uploadPdf(file));
        const results = await Promise.all(uploadPromises);
        fileContents = results.map(r => r.text).join('\n\n');
      }

      const response = await sendMessage(message, fileContents);
      const aiMessage = { 
        sender: 'ai', 
        text: response.data.response,
        timestamp: new Date().toISOString()
      };
      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      console.error('Error sending message:', error);
      const errorMessage = { 
        sender: 'ai', 
        text: "I'm having trouble processing your request. Please try again.",
        isError: true,
        timestamp: new Date().toISOString()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleFileChange = (e) => {
    const newFiles = Array.from(e.target.files);
    if (newFiles.length + files.length > 3) {
      setError('Maximum 3 files allowed');
      return;
    }
    setFiles(prev => [...prev, ...newFiles]);
    setError(null);
    // Reset file input to allow selecting same file again
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const removeFile = (index) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
  };

  return (
    <div className="chat-app">
      <div className="chat-header">
        <h2>AI Assistant</h2>
        <div className="chat-info">
          <span className="connection-status connected"></span>
          <span>Online</span>
        </div>
      </div>

      <div className="chat-container">
        <div className="messages-container">
          {messages.length === 0 ? (
            <div className="empty-state">
              <FiMessageSquare size={48} />
              <h3>Start a conversation</h3>
              <p>Ask a question or upload a document to get started</p>
            </div>
          ) : (
            messages.map((msg, index) => (
              <Message 
                key={index} 
                sender={msg.sender} 
                text={msg.text} 
                files={msg.files}
                timestamp={msg.timestamp}
                isError={msg.isError}
              />
            ))
          )}
          {isTyping && <TypingIndicator />}
          <div ref={messagesEndRef} />
        </div>

        <div className="input-area">
          {error && <div className="error-message">{error}</div>}
          
          {files.length > 0 && (
            <div className="file-previews">
              {files.map((file, index) => (
                <FilePreview 
                  key={index}
                  file={file}
                  onRemove={() => removeFile(index)}
                />
              ))}
            </div>
          )}

          <form onSubmit={handleSubmit} className="message-form">
            <div className="file-input-container">
              <label className="file-input-label">
                <FiPaperclip />
                <input 
                  ref={fileInputRef}
                  type="file" 
                  onChange={handleFileChange}
                  multiple
                  accept=".pdf,.txt,.doc,.docx"
                  className="hidden-file-input"
                />
              </label>
            </div>
            
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Type your message..."
              className="message-input"
              aria-label="Type your message"
            />
            
            <button 
              type="submit" 
              className="send-button"
              disabled={(!message.trim() && files.length === 0) || isTyping}
            >
              <FiSend />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Chat;