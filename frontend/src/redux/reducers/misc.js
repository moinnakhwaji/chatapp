import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isNewGroup: false,
  isAddmember: false,
  isNotification: false,
  isMobile: false,
  isSearch: false,
  isFileMenu: false,
  isDeleteMenu: false,
  uploadingLoader: false,
  selectDeletChat: {
    chatId: "",
    groupchat: false,
  },
};

const miscSlice = createSlice({
  name: "misc",
  initialState,
  reducers: {
    setIsNewGroup: (state, action) => {
      state.isNewGroup = action.payload;
    },
    setIsAddmember: (state, action) => {
      state.isAddmember = action.payload;
    },
    setIsNotification: (state, action) => {
      state.isNotification = action.payload;
    },
    setIsMobile: (state, action) => {
      state.isMobile = action.payload;
    },
    setIsSearch: (state, action) => {
      state.isSearch = action.payload;
    },
    setIsFileMenu: (state, action) => {
      state.isFileMenu = action.payload;
    },
    setIsDeleteMenu: (state, action) => {
      state.isDeleteMenu = action.payload;
    },
    setUploadingLoader: (state, action) => {
      state.uploadingLoader = action.payload;
    },
    setSelectDeletChat: (state, action) => {
      state.selectDeletChat = action.payload;
    },
  },
});
export default miscSlice;

export const {
  setIsNewGroup,
  setIsAddmember,
  setIsNotification,
  setIsMobile,
  setIsSearch,
  setIsFileMenu,
  setIsDeleteMenu,
  setUploadingLoader,
  setSelectDeletChat,
} = miscSlice.actions;
