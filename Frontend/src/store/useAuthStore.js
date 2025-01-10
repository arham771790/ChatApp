import { create } from "zustand";
import instance from "../Lib/axios";

export const useAuthStore = create((set) => ({
    authUser: null,
    isCheckingAuth: true,// Default to true to show a loading spinner while checking auth
    isSigningUp:false,// Default to false 
    isLoggingIn:false,// Default to false
    isUpdatingProfile:false,// Default to false 
    checkAuth: async () => {
        try {
            const res = await instance.get("/auth/check");
            set({ authUser: res.data.user }); // Assuming `user` is returned
        } catch (error) {
            console.error("Error in checkAuth:", error.message, error.response);
            set({ authUser: null }); // Set authUser to null on error
        } finally {
            set({ isCheckingAuth: false });
        }
    },
    signup:async(data)=>{

    }
}));// Create a new store with authUser and isCheckingAuth state variables and checkAuth action
