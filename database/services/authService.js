import { userModel } from '../models/index.js';
import { compareSync, hashSync } from 'bcrypt';
import { randomUUID } from 'crypto';

// In-memory session store (would use Redis or similar in production)
const sessions = new Map();

export const authService = {
  // Register a new user
  register: async (userData, profileData) => {
    // Check if user already exists
    const existingUser = userModel.getByEmail(userData.email);
    if (existingUser) {
      throw new Error('User with this email already exists');
    }
    
    // Hash password
    const hashedPassword = hashSync(userData.password, 10);
    
    // Create user with profile
    const user = userModel.createWithProfile(
      { ...userData, password_hash: hashedPassword },
      profileData
    );
    
    return {
      id: user.id,
      email: user.email,
      name: user.full_name,
      role: user.role
    };
  },
  
  // Login user
  login: async (email, password) => {
    // Find user
    const user = userModel.getByEmail(email);
    if (!user) {
      throw new Error('Invalid email or password');
    }
    
    // Check password
    const isPasswordValid = compareSync(password, user.password_hash);
    if (!isPasswordValid) {
      throw new Error('Invalid email or password');
    }
    
    // Get user profile
    const userWithProfile = userModel.getWithProfile(user.id);
    if (!userWithProfile.is_active) {
      throw new Error('Account is inactive');
    }
    
    // Update last login
    userModel.update(user.id, { last_login: new Date().toISOString() });
    
    // Create session
    const sessionId = randomUUID();
    const sessionData = {
      id: userWithProfile.id,
      email: userWithProfile.email,
      name: userWithProfile.full_name,
      role: userWithProfile.role,
      createdAt: new Date().toISOString()
    };
    
    sessions.set(sessionId, sessionData);
    
    return {
      sessionId,
      user: sessionData
    };
  },
  
  // Logout user
  logout: async (sessionId) => {
    sessions.delete(sessionId);
    return true;
  },
  
  // Get user from session
  getUserFromSession: async (sessionId) => {
    return sessions.get(sessionId) || null;
  },
  
  // Change password
  changePassword: async (userId, currentPassword, newPassword) => {
    const user = userModel.getById(userId);
    if (!user) {
      throw new Error('User not found');
    }
    
    // Check current password
    const isPasswordValid = compareSync(currentPassword, user.password_hash);
    if (!isPasswordValid) {
      throw new Error('Current password is incorrect');
    }
    
    // Hash new password
    const hashedPassword = hashSync(newPassword, 10);
    
    // Update password
    userModel.update(userId, { password_hash: hashedPassword });
    
    return true;
  }
};