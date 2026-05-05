import { create } from 'zustand';
import { useSubscription, gql } from 'urql';

/**
 * SENIOR AI ENGINEER PATTERN: The WebSocket UI Trigger
 * * Rule 5 Enforcement: We NEVER save Supabase WebSocket payloads to Zustand.
 * Graphcache handles the domain data silently. Zustand is ONLY used here 
 * to trigger a physical UI layout change (like opening a toast notification).
 */

// 1. The Zustand Store (UI Layout/Toasts ONLY)
interface UIState {
  isToastOpen: boolean;
  toastMessage: string;
  showToast: (message: string) => void;
  closeToast: () => void;
}

export const useUIStore = create<UIState>((set) => ({
  isToastOpen: false,
  toastMessage: '',
  showToast: (message) => set({ isToastOpen: true, toastMessage: message }),
  closeToast: () => set({ isToastOpen: false, toastMessage: '' }),
}));

// 2. The Urql Subscription
const ProjectUpdatesSub = gql`
  subscription OnProjectUpdated {
    projects {
      id
      name
      updated_at
    }
  }
`;

// 3. The Component (The Danger Zone Navigator)
export function ProjectNotificationListener() {
  
  // We listen to the WebSocket stream, but we let Graphcache 
  // handle the actual data caching under the hood via the return statement.
  useSubscription({ query: ProjectUpdatesSub }, (messages = [], response) => {
    
    // We DO NOT save 'response.projects' into Zustand.
    // We ONLY trigger a UI layout change to notify the user.
    const updatedProjectName = response?.projects?.[0]?.name;
    
    if (updatedProjectName) {
      useUIStore.getState().showToast(`Project ${updatedProjectName} was just updated!`);
    }
    
    // Return the response so Urql Graphcache can normalize and store it natively
    return [response, ...messages];
  });

  return null; // This component strictly handles the subscription logic
}