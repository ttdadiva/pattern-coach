import { create } from 'zustand';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const API_URL = process.env.EXPO_PUBLIC_BACKEND_URL || 'https://code-coach-ai.preview.emergentagent.com';

interface World {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
  unlocked: boolean;
  unlock_requirement?: number;
  missions: Mission[];
}

interface Mission {
  id: string;
  name: string;
  description: string;
  pattern_type: string;
  stars_reward: number;
  completed?: boolean;
}

interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  unlocked: boolean;
}

interface GameState {
  worlds: World[];
  currentWorld: World | null;
  currentMission: Mission | null;
  badges: Badge[];
  loading: boolean;
  error: string | null;
  
  // Actions
  fetchWorlds: (token: string) => Promise<void>;
  fetchMissions: (token: string, worldId: string) => Promise<void>;
  fetchBadges: (token: string) => Promise<void>;
  completeMission: (token: string, missionId: string, worldId: string, score: number, patterns: string[]) => Promise<any>;
  setCurrentWorld: (world: World | null) => void;
  setCurrentMission: (mission: Mission | null) => void;
}

export const useGameStore = create<GameState>((set, get) => ({
  worlds: [],
  currentWorld: null,
  currentMission: null,
  badges: [],
  loading: false,
  error: null,

  fetchWorlds: async (token: string) => {
    set({ loading: true, error: null });
    try {
      const response = await axios.get(`${API_URL}/api/adventure/worlds`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      set({ worlds: response.data.worlds, loading: false });
    } catch (error: any) {
      set({ error: error.message, loading: false });
    }
  },

  fetchMissions: async (token: string, worldId: string) => {
    set({ loading: true, error: null });
    try {
      const response = await axios.get(`${API_URL}/api/adventure/missions/${worldId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      set({ 
        currentWorld: response.data.world,
        loading: false 
      });
      return response.data;
    } catch (error: any) {
      set({ error: error.message, loading: false });
    }
  },

  fetchBadges: async (token: string) => {
    try {
      const response = await axios.get(`${API_URL}/api/adventure/badges`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      set({ badges: response.data.badges });
    } catch (error: any) {
      console.error('Error fetching badges:', error);
    }
  },

  completeMission: async (token: string, missionId: string, worldId: string, score: number, patterns: string[]) => {
    try {
      const response = await axios.post(
        `${API_URL}/api/adventure/complete-mission`,
        {
          mission_id: missionId,
          world_id: worldId,
          score,
          patterns_found: patterns
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      return response.data;
    } catch (error: any) {
      console.error('Error completing mission:', error);
      throw error;
    }
  },

  setCurrentWorld: (world) => set({ currentWorld: world }),
  setCurrentMission: (mission) => set({ currentMission: mission }),
}));
