import { createSlice } from "@reduxjs/toolkit";
import toast from "react-hot-toast";
import { adminLogin,getAdmin,adminLogout } from "./thunks/admin";

const initialState = {
  user: null,
  isAdmin: false,
  isLoading: false,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    UserExist: (state, action) => {
      state.user = action.payload;
      state.isLoading = false;
    },
    UserNotExists: (state) => {
      state.user = false;
      state.loader = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(adminLogin.fulfilled, (state, action) => {
        state.isAdmin = true;
        toast.success(action.payload);
      })
      .addCase(adminLogin.rejected, (state, action) => {
        state.isAdmin = false;
        toast.error(action.error.message);
      }) 
      .addCase(getAdmin.fulfilled, (state, action) => {
        if (action.payload) {
          state.isAdmin = true;
        } else {
          state.isAdmin = false;
        }
      })
      .addCase(getAdmin.rejected, (state, action) => {
        state.isAdmin = false;
      })
      .addCase(adminLogout.fulfilled, (state, action) => {
        state.isAdmin = false;
        toast.success(action.payload);
      })
      .addCase(adminLogout.rejected, (state, action) => {
        state.isAdmin = true;
        toast.error(action.error.message);
      });
  },
});

export default authSlice;

export const { UserExist, UserNotExists } = authSlice.actions;
