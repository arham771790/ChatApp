import { create } from "zustand"; 
import instance from "../Lib/axios"; 
import toast from "react-hot-toast"; 

const safeParse = (data, fallback = null) => {
    try {
      return JSON.parse(data) || fallback;
    } catch {
      return fallback;
    }
};

export const useAuthStore = create((set) => ({
    // State variables
    authUser: safeParse(localStorage.getItem("authUser")),
    isCheckingAuth: true,
    isSigningUp: false,
    isLoggingIn: false,
    isUpdatingProfile: false,
    onlineUsers:[],

    // Action to check if the user is authenticated
    checkAuth: async () => {
        try {
          const accessToken = localStorage.getItem("accessToken");
          const refreshToken = localStorage.getItem("refreshToken");

          // If tokens are missing, log out
          if (!accessToken || !refreshToken) {
            throw new Error("Tokens are missing or invalid");
          }

          // Check if the access token is still valid
          const res = await instance.get("/auth/check", {
            headers: {
              'Authorization': `Bearer ${accessToken}`,
              'Content-Type': 'application/json',
            },
          });

          // Set authenticated user
          set({ authUser: res.data.user });
        } catch (error) {
          console.error("Error in checkAuth:", error.message);
          
          // Clear invalid tokens and authUser
          localStorage.removeItem("accessToken");
          localStorage.removeItem("refreshToken");
          localStorage.removeItem("authUser");
          
          set({ authUser: null });
        } finally {
          set({ isCheckingAuth: false });
        }
    },

    // Action to handle user signup
    signup: async (data) => {
        set({ isSigningUp: true });
        try {
            const res = await instance.post("auth/signup", data);
            set({ authUser: res.data });
        } catch (error) {
            console.log(error.message);
            toast.error(error.response?.data?.message || "Signup failed");
        } finally {
            set({ isSigningUp: false });
        }
    },

    // Action to handle user login
    login: async (credentials) => {
        set({ isLoggingIn: true });
        try {
            const res = await instance.post('/auth/login', credentials);
            const { user, accessToken, refreshToken } = res.data.data;
          
            // Save tokens and user data
            localStorage.setItem("accessToken", accessToken);
            localStorage.setItem("refreshToken", refreshToken);
            localStorage.setItem("authUser", JSON.stringify(user));

            set({ authUser: user });
            toast.success("Logged in successfully");
            return true;
        } catch (error) {
            console.error("Error in login:", error.response);
            toast.error("Failed to login");
        } finally {
            set({ isLoggingIn: false });
        }
    },

    // Action to handle user logout
    logout: async () => {
        try {
          await instance.post("/auth/logout");
        } catch (error) {
          console.error("Error in logout:", error.message);
          toast.error("Some error occurred while logging out");
        } finally {
          // Clear all tokens and state
          localStorage.clear();
          set({ authUser: null });
          toast.success("Logged out successfully");
        }
    },

    // Action to handle user profile update
     updateProfile : async (data) => {
      set({ isUpdatingProfile: true });
      try {
          const res = await instance.put("/auth/updateProfile", data);
          console.log("Backend response:", res.data); // Log the response from backend
          const user = res.data.data; // Assuming the response contains `data`
          
          // Sync updated user in localStorage and store
          localStorage.setItem("authUser", JSON.stringify(user));
          set({ authUser: user });
  
          toast.success("Profile updated successfully");
      } catch (error) {
          console.error("Error updating profile:", error);
          toast.error(error.response?.data?.message || "Failed to update profile");
      } finally {
          set({ isUpdatingProfile: false });
      }
  },
  
}));
