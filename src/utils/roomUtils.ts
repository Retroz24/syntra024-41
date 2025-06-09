
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export type RoomType = 'public' | 'private';

export interface RoomMember {
  id: string;
  name: string;
  status: 'online' | 'offline' | 'idle' | 'busy';
  isAdmin: boolean;
  avatar?: string | null;
}

export interface RoomData {
  id: string;
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
  isAdmin?: boolean;
}

/**
 * Creates a new study room using Supabase with creator as admin
 */
export const createRoom = async (
  name: string,
  description: string,
  category: string,
  language: string = '',
  maxMembers: number = 10,
  type: RoomType = 'public',
  userId: string,
  userName: string,
  userAvatar?: string | null
): Promise<RoomData | null> => {
  try {
    console.log('Creating room:', { name, description, category, userId });
    
    // Generate invite code
    const { data: inviteCodeData, error: codeError } = await supabase
      .rpc('generate_invite_code');
    
    if (codeError) {
      console.error('Error generating invite code:', codeError);
      throw codeError;
    }

    const slug = name.trim().toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
    
    // Create room in Supabase
    const { data: roomData, error: roomError } = await supabase
      .from('rooms')
      .insert({
        name,
        slug,
        icon_name: category.toLowerCase(),
        description,
        status: 'active',
        max_members: maxMembers,
        invite_code: inviteCodeData
      })
      .select()
      .single();

    if (roomError) {
      console.error('Error creating room:', roomError);
      throw roomError;
    }

    console.log('Room created successfully:', roomData);

    // Add creator as first member with admin privileges
    const { error: membershipError } = await supabase
      .from('memberships')
      .insert({
        user_id: userId,
        room_id: roomData.id
      });

    if (membershipError) {
      console.error('Error adding creator to room:', membershipError);
      throw membershipError;
    }

    console.log('Creator added to room membership');

    const room: RoomData = {
      id: roomData.id,
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
      inviteCode: inviteCodeData,
      createdAt: roomData.created_at,
      createdBy: userName,
      isAdmin: true
    };
    
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
export const generateInviteLink = (roomId: string, inviteCode?: string): string => {
  const baseUrl = window.location.origin;
  return inviteCode 
    ? `${baseUrl}/invite?room_id=${roomId}&code=${inviteCode}`
    : `${baseUrl}/invite?room_id=${roomId}`;
};

/**
 * Checks if user is already a member of a room
 */
export const isUserMemberOfRoom = async (
  roomId: string,
  userId: string
): Promise<boolean> => {
  try {
    console.log('Checking if user is member:', { roomId, userId });
    
    const { data, error } = await supabase
      .from('memberships')
      .select('id')
      .eq('user_id', userId)
      .eq('room_id', roomId)
      .single();

    if (error && error.code !== 'PGRST116') {
      console.error('Error checking membership:', error);
      throw error;
    }
    
    const isMember = !!data;
    console.log('User membership status:', isMember);
    return isMember;
  } catch (error) {
    console.error('Error checking membership:', error);
    return false;
  }
};

/**
 * Joins a room by ID using Supabase
 */
export const joinRoom = async (
  roomId: string, 
  userId: string, 
  userName: string,
  userAvatar?: string | null
): Promise<boolean> => {
  try {
    console.log('Attempting to join room:', { roomId, userId, userName });
    
    // Check if user is already a member
    const isMember = await isUserMemberOfRoom(roomId, userId);
    if (isMember) {
      console.log('User is already a member of this room');
      toast.info('You are already a member of this room');
      return true;
    }

    // Check if room exists and get details
    const { data: roomData, error: roomError } = await supabase
      .from('rooms')
      .select('*')
      .eq('id', roomId)
      .single();

    if (roomError || !roomData) {
      console.error('Room not found:', roomError);
      toast.error('Room not found');
      return false;
    }

    console.log('Room found:', roomData);

    // Check if room is at max capacity
    const { count, error: countError } = await supabase
      .from('memberships')
      .select('*', { count: 'exact', head: true })
      .eq('room_id', roomId);

    if (countError) {
      console.error('Error counting members:', countError);
      throw countError;
    }

    console.log('Current member count:', count);

    if (count && count >= roomData.max_members) {
      toast.error('This room is full');
      return false;
    }

    // Add user to the room
    const { error: joinError } = await supabase
      .from('memberships')
      .insert({
        user_id: userId,
        room_id: roomId
      });

    if (joinError) {
      console.error('Error joining room:', joinError);
      throw joinError;
    }

    console.log('Successfully joined room');
    toast.success('Joined room successfully!');
    return true;
  } catch (error) {
    console.error('Error joining room:', error);
    toast.error('Failed to join room');
    return false;
  }
};

/**
 * Leave a room using Supabase
 */
export const leaveRoom = async (roomId: string, userId: string): Promise<boolean> => {
  try {
    // Remove user from memberships
    const { error } = await supabase
      .from('memberships')
      .delete()
      .eq('user_id', userId)
      .eq('room_id', roomId);

    if (error) throw error;

    toast.success('Left room successfully');
    return true;
  } catch (error) {
    console.error('Error leaving room:', error);
    toast.error('Failed to leave room');
    return false;
  }
};

export const getRoomDetails = async (roomId: string): Promise<RoomData | null> => {
  try {
    const { data: roomData, error: roomError } = await supabase
      .from('rooms')
      .select('*')
      .eq('id', roomId)
      .single();

    if (roomError) throw roomError;

    // Get member count
    const { count, error: countError } = await supabase
      .from('memberships')
      .select('*', { count: 'exact', head: true })
      .eq('room_id', roomId);

    if (countError) throw countError;

    return {
      id: roomData.id,
      name: roomData.name,
      description: roomData.description,
      category: roomData.icon_name,
      maxMembers: roomData.max_members,
      currentMembers: count || 0,
      members: [],
      type: 'public',
      inviteCode: roomData.invite_code,
      createdAt: roomData.created_at
    };
  } catch (error) {
    console.error('Error getting room details:', error);
    return null;
  }
};
