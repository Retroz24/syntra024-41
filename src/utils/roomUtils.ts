
import { toast } from "sonner";

export type RoomType = 'public' | 'private';

export interface RoomMember {
  id: number | string;
  name: string;
  status: 'online' | 'offline' | 'idle' | 'busy';
  isAdmin: boolean;
  avatar?: string | null;
}

export interface RoomData {
  id: string | number;
  name: string;
  description: string;
  category: string;
  language?: string;
  maxMembers: number;
  currentMembers?: number;
  members: RoomMember[];
  type: RoomType;
  inviteCode?: string;
  createdAt: string;
  createdBy?: string;
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
  type: RoomType = 'public',
  userId: number | string,
  userName: string,
  userAvatar?: string | null
): Promise<RoomData | null> => {
  try {
    const roomId = Math.random().toString(36).substring(2, 9);
    const inviteCode = Math.random().toString(36).substring(7).toUpperCase();
    
    const room: RoomData = {
      id: roomId,
      name,
      description,
      category,
      language,
      maxMembers,
      members: [{
        id: userId,
        name: userName,
        status: 'online',
        isAdmin: true,
        avatar: userAvatar || null
      }],
      type,
      inviteCode,
      createdAt: new Date().toISOString(),
      createdBy: userName,
    };
    
    // Store in localStorage
    const existingRooms = JSON.parse(localStorage.getItem('created-rooms') || '[]');
    localStorage.setItem('created-rooms', JSON.stringify([...existingRooms, room]));
    
    // Trigger storage event for real-time updates
    window.dispatchEvent(new Event('storage'));
    
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
export const generateInviteLink = (roomId: string | number): string => {
  const baseUrl = window.location.origin;
  return `${baseUrl}/room/${roomId}?invite=true`;
};

/**
 * Joins a room by ID
 */
export const joinRoom = async (
  roomId: string | number, 
  userId: number | string, 
  userName: string,
  userAvatar?: string | null
): Promise<boolean> => {
  try {
    // Get existing rooms
    const createdRooms = JSON.parse(localStorage.getItem('created-rooms') || '[]');
    const joinedRooms = JSON.parse(localStorage.getItem('joined-rooms') || '[]');
    
    // Find the room to join
    const roomIndex = createdRooms.findIndex((room: RoomData) => room.id === roomId);
    
    if (roomIndex === -1) {
      toast.error('Room not found');
      return false;
    }
    
    const room = createdRooms[roomIndex];
    
    // Check if user is already a member
    if (room.members.some(member => member.id === userId)) {
      toast.info('You are already a member of this room');
      return true;
    }
    
    // Check if room is at max capacity
    if (room.members.length >= room.maxMembers) {
      toast.error('This room is full');
      return false;
    }
    
    // Add user to the room
    const newMember: RoomMember = {
      id: userId,
      name: userName,
      status: 'online',
      isAdmin: false,
      avatar: userAvatar || null
    };
    
    room.members.push(newMember);
    
    // Update the room in localStorage
    localStorage.setItem('created-rooms', JSON.stringify(createdRooms));
    
    // Add to joined rooms
    joinedRooms.push(room);
    localStorage.setItem('joined-rooms', JSON.stringify(joinedRooms));
    
    // Trigger storage event for real-time updates
    window.dispatchEvent(new Event('storage'));
    
    toast.success('Joined room successfully!');
    return true;
  } catch (error) {
    console.error('Error joining room:', error);
    toast.error('Failed to join room');
    return false;
  }
};

/**
 * Leave a room
 */
export const leaveRoom = async (roomId: string | number, userId: number | string): Promise<boolean> => {
  try {
    // Get existing rooms
    const createdRooms = JSON.parse(localStorage.getItem('created-rooms') || '[]');
    const joinedRooms = JSON.parse(localStorage.getItem('joined-rooms') || '[]');
    
    // Find the room
    const roomIndex = createdRooms.findIndex((room: RoomData) => room.id === roomId);
    
    if (roomIndex === -1) {
      toast.error('Room not found');
      return false;
    }
    
    const room = createdRooms[roomIndex];
    
    // Remove user from members
    const memberIndex = room.members.findIndex(member => member.id === userId);
    
    if (memberIndex === -1) {
      toast.error('You are not a member of this room');
      return false;
    }
    
    // If user is the only admin, check if there are other members
    const isAdmin = room.members[memberIndex].isAdmin;
    
    if (isAdmin && room.members.filter(member => member.isAdmin).length === 1 && room.members.length > 1) {
      // Make another member an admin
      const nextAdminIndex = room.members.findIndex(member => member.id !== userId);
      if (nextAdminIndex !== -1) {
        room.members[nextAdminIndex].isAdmin = true;
      }
    }
    
    // Remove the member
    room.members.splice(memberIndex, 1);
    
    // If room is empty, remove it entirely
    if (room.members.length === 0) {
      createdRooms.splice(roomIndex, 1);
      const joinedRoomIndex = joinedRooms.findIndex((r: RoomData) => r.id === roomId);
      if (joinedRoomIndex !== -1) {
        joinedRooms.splice(joinedRoomIndex, 1);
      }
    } else {
      // Update the room
      createdRooms[roomIndex] = room;
    }
    
    localStorage.setItem('created-rooms', JSON.stringify(createdRooms));
    localStorage.setItem('joined-rooms', JSON.stringify(joinedRooms));
    
    // Trigger storage event for real-time updates
    window.dispatchEvent(new Event('storage'));
    
    toast.success('Left room successfully');
    return true;
  } catch (error) {
    console.error('Error leaving room:', error);
    toast.error('Failed to leave room');
    return false;
  }
};
