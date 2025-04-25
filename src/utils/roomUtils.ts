
import { toast } from "sonner";

export type RoomType = 'public' | 'private';

export interface RoomData {
  id: string;
  name: string;
  description: string;
  category: string;
  language?: string;
  maxMembers: number;
  currentMembers: number;
  type: RoomType;
  createdAt: Date;
  createdBy: string;
}

/**
 * Creates a new study room
 */
export const createRoom = async (
  name: string,
  description: string,
  category: string,
  language: string = '',
  maxMembers: number = 10,
  type: RoomType = 'public'
): Promise<RoomData | null> => {
  try {
    // In a real app, this would make an API call
    // Simulating a network request
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const room: RoomData = {
      id: Math.random().toString(36).substring(2, 9),
      name,
      description,
      category,
      language,
      maxMembers,
      currentMembers: 1, // Creator is the first member
      type,
      createdAt: new Date(),
      createdBy: 'Current User', // In a real app, this would be the user's ID or username
    };
    
    // In a real app, we would store this in a database
    // For now, we'll just return the created room
    
    toast.success('Room created successfully!');
    return room;
  } catch (error) {
    console.error('Error creating room:', error);
    toast.error('Failed to create room');
    return null;
  }
};

/**
 * Generates invite link for a room
 */
export const generateInviteLink = (roomId: string, expiresIn?: number): string => {
  // In a real app, this would generate a unique, time-limited token
  const baseUrl = window.location.origin;
  return `${baseUrl}/room/${roomId}?invite=true`;
};

/**
 * Joins a room by ID
 */
export const joinRoom = async (roomId: string): Promise<boolean> => {
  try {
    // In a real app, this would make an API call
    // Simulating a network request
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // In a real app, we would add the user to the room in the database
    toast.success('Joined room successfully!');
    return true;
  } catch (error) {
    console.error('Error joining room:', error);
    toast.error('Failed to join room');
    return false;
  }
};
