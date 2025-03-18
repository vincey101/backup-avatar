import { toast } from 'sonner';

const TIMEOUT_DURATION = 8 * 60 * 1000; // 8 minutes in milliseconds
let timeoutId: NodeJS.Timeout | null = null;
let lastActivityTime: number = Date.now();

export const initializeSessionTimeout = () => {
  resetTimeout();
  // Add event listeners for user activity
  ['mousedown', 'keydown', 'mousemove', 'touchstart', 'scroll'].forEach(event => {
    window.addEventListener(event, updateLastActivity);
  });
};

export const updateLastActivity = () => {
  lastActivityTime = Date.now();
  resetTimeout();
};

const resetTimeout = () => {
  if (timeoutId) {
    clearTimeout(timeoutId);
  }
  timeoutId = setTimeout(handleSessionTimeout, TIMEOUT_DURATION);
};

const handleSessionTimeout = () => {
  const timeSinceLastActivity = Date.now() - lastActivityTime;
  
  if (timeSinceLastActivity >= TIMEOUT_DURATION) {
    // Clear all session data
    document.cookie = 'authToken=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT';
    localStorage.clear();
    
    // Show timeout message
    toast.error('Session expired due to inactivity. Please log in again.');
    
    // Close window if it's a preview or embedded window
    if (window.location.pathname.startsWith('/app/') || window.opener) {
      window.close();
    } else {
      // Redirect to login page for main window
      window.location.href = '/login';
    }
  }
};

export const clearSessionTimeout = () => {
  if (timeoutId) {
    clearTimeout(timeoutId);
  }
  ['mousedown', 'keydown', 'mousemove', 'touchstart', 'scroll'].forEach(event => {
    window.removeEventListener(event, updateLastActivity);
  });
}; 