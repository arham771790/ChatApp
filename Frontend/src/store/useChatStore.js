import { create } from "zustand";
import toast from "react-hot-toast";
import instance from "../Lib/axios";

// Zustand store for managing chat-related state and operations
export const useChatStore = create((set) => ({
  // State variables
  messages: [], // Array to store the messages for the selected user
  users: [], // Array to store all available users
  selectedUser: null, // Object representing the currently selected user
  isUsersLoading: false, // Boolean to indicate whether users are being loaded
  isMessagesLoading: false, // Boolean to indicate whether messages are being loaded

  /**
   * Fetches the list of users from the server.
   * Sets `isUsersLoading` to true while the request is in progress.
   * On success, updates the `users` state with the response data.
   * On failure, logs the error and displays a toast notification.
   */
  getUsers: async () => {
    set({ isUsersLoading: true }); // Set loading state to true
    try {
      const res = await instance.get("/message/users"); // Fetch users from API
      set({ users: res.data.users, isUsersLoading: false }); // Update state with users and set loading to false
    } catch (error) {
      console.log("Error in getUsers", error); // Log error for debugging
      toast.error("Failed to load users"); // Display error notification
      set({ isUsersLoading: false }); // Reset loading state
    }
  },

  /**
   * Fetches messages for a specific user by their user ID.
   * Sets `isMessagesLoading` to true while the request is in progress.
   * On success, updates the `messages` state and sets the selected user.
   * On failure, logs the error and displays a toast notification.
   * 
   * @param {string} userId - The ID of the user whose messages should be fetched.
   */
  getMessages: async (userId) => {
    set({ isMessagesLoading: true }); // Set loading state to true
    try {
      const res = await instance.get(`/messages/${userId}`); // Fetch messages for the user
      set({
        messages: res.data.messages, // Update state with messages
        isMessagesLoading: false, // Reset loading state
        selectedUser: userId, // Set the selected user
      });
    } catch (error) {
      console.log("Error in getMessages", error); // Log error for debugging
      toast.error("Failed to load messages"); // Display error notification
      set({ isMessagesLoading: false }); // Reset loading state
    }
  },

  /**
   * Sets the selected user in the chat interface.
   * This function is used when a user is selected from the contact list.
   * 
   * @param {object} selectedUser - The user object to set as the selected user.
   */
  setSelectedUser: async (selectedUser) => set({ selectedUser }), // Update the selected user state
}));
