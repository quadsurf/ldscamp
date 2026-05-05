import { create } from 'zustand';
import { subscribeWithSelector } from 'zustand/middleware';

interface GameState {
  score: number;
  increment: () => void;
}

/**
 * Senior AI Engineer Pattern: Conditional High-Performance Subscriptions
 * ONLY USE FOR: WebSockets, Canvas/WebGL, Audio routing, or external Analytics.
 */
export const useGameStore = create<GameState>()(
  subscribeWithSelector((set) => ({
    score: 0,
    increment: () => set((state) => ({ score: state.score + 10 })),
  }))
);

/**
 * Example Side-Effect OUTSIDE of React.
 * This file can be imported anywhere (e.g., a websocket manager file)
 * to listen to state changes without causing any component to re-render.
 */
useGameStore.subscribe(
  // Selector: What are we watching?
  (state) => state.score,
  // Listener: What do we do when it changes?
  (newScore, previousScore) => {
    if (newScore > 100 && previousScore <= 100) {
      // e.g., Fire a websocket event or trigger a Canvas animation
      console.log('High score achieved! Firing confetti rendering engine...');
    }
  }
);