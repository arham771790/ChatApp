import { create } from "zustand"; // Importing Zustand to create a store
import instance from "../Lib/axios"; // Importing the Axios instance for API requests
import toast from "react-hot-toast"; // Importing toast for showing notifications

// Creating the auth store

export const useAuthStore = create((set) => ({
    // State variables
    authUser: null, // To store the authenticated user's details
    isCheckingAuth: true, // Initially true to show a loading spinner while checking authentication
    isSigningUp: false, // Initially false to indicate no signup process is happening
    isLoggingIn: false, // Initially false to indicate no login process is happening
    isUpdatingProfile: false, // Initially false to indicate no profile update process is happening

    // Action to check if the user is authenticated
    checkAuth: async () => {
        try {
            const res = await instance.get("/auth/check"); // API call to check authentication
            set({ authUser: res.data.user }); // Assuming the response contains a `user` object
        } catch (error) {
            console.error("Error in checkAuth:", error.message, error.response); // Log the error for debugging
            set({ authUser: null }); // If there’s an error, clear the authenticated user
        } finally {
            set({ isCheckingAuth: false }); // Set `isCheckingAuth` to false after the process
        }
    },

    // Action to handle user signup
    signup: async (data) => {
        set({ isSigningUp: true }); // Set `isSigningUp` to true to indicate the signup process is ongoing
        try {
            const res = await instance.post("auth/signup", data); // API call to signup
            set({ authUser: res.data }); // Set the authenticated user data after successful signup
            } catch (error) {
                console.log(error.message);
            toast.error(error.response?.data?.message || "Signup failed"); // Show error message from response
        } finally {
            set({ isSigningUp: false }); // Reset `isSigningUp` to false after the process
        }
    },
    login: async (credentials) => {
        
        try {
          const res = await instance.post('/auth/login', credentials); // API request for login
    
          // Set the authenticated user data
          set({ authUser: res.data });
    
          // Show success message
          toast.success("Logged in successfully");
        return true;
        } catch (error) {
          console.error("Error in login:", error.response);
          toast.error("Failed to login");
        }finally{
            set({ isLoggingIn: false }); // Reset `isLoggingIn` to false after the process
        }
      },
    
    // Action to handle user logout
    logout: async () => {
        try {
            await instance.post('/auth/logout'); // API call to logout
            set({ authUser: null }); // Clear the authenticated user data
            toast.success("Logged out successfully"); // Show success message
            
        } catch (error) {
            console.error("Error in logout:", error.message, error.response); // Log the error for debugging
            toast.error("Some error occurred while logging out"); // Show error message
        }
    },
    // Action to handle user profile update
    updateProfile: async (data) => {
        set({ isUpdatingProfile: true });
        try {
          const res = await instance.put("/auth/updateProfile", data);
          set({ authUser: res.data });
          toast.success("Profile updated successfully");
        } catch (error) {
          console.log("error in update profile:", error);
          toast.error(error.response.data.message);
        } finally {
          set({ isUpdatingProfile: false });
        }
      },
}));
