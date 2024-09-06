import React, { lazy, Suspense, useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import axios from "axios";
import { Server } from "./constant/config";
import { Toaster } from "react-hot-toast";
import { UserExist, UserNotExists } from "./redux/reducers/auth";
import { Loader } from "./layout/Loader";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import { HelmetProvider } from "react-helmet-async";
import "./index.css";
import { SocketProvider } from "./socket";
import Newgroup from "./specific/Newgroup";
import AdminProtectedRoute from "./components/auth/AdminProtectedRoute ";

const Home = lazy(() => import("./pages/Home"));
const Login = lazy(() => import("./pages/Login"));
const Chat = lazy(() => import("./pages/Chat"));
const Group = lazy(() => import("./pages/Group"));
const Notfound = lazy(() => import("./pages/Notfound"));
const Adminlogin = lazy(() => import("./pages/admin/Adminlogin"));
const Dashboard = lazy(() => import("./pages/admin/Dashboard"));
const ChatManagement = lazy(() => import("./pages/admin/ChatManagement"));
const MessageManagement = lazy(() => import("./pages/admin/MessageManagement"));
const UserManagement = lazy(() => import("./pages/admin/UserManagement"));

const App = () => {
  const { user } = useSelector((state) => state.auth);
  const { isAdmin } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  useEffect(() => {
    axios
      .get(`${Server}/api/v4/user/me`, { withCredentials: true })
      .then(({ data }) => dispatch(UserExist(data.user)))
      .catch((err) => dispatch(UserNotExists()));
  }, [dispatch]);

  return (
    <HelmetProvider>
      <BrowserRouter>
        <Suspense fallback={<Loader />}>
          <Routes>
            <Route
              element={
                <SocketProvider>
                  <ProtectedRoute user={user} />
                </SocketProvider>
              }
            >
              <Route path="/" element={<Home />} />
              <Route path="/chat/:chatId" element={<Chat />} />
              <Route path="/group" element={<Group />} />
            </Route>

            <Route
              path="/login"
              element={
                <ProtectedRoute user={!user} redirect="/">
                  <Login />
                </ProtectedRoute>
              }
            />

            <Route path="/admin" element={<Adminlogin />} />
            <Route
              element={
                <SocketProvider>
                  <AdminProtectedRoute />
                </SocketProvider>
              }
            >
              <Route path="/admin/dashboard" element={<Dashboard />} />
              <Route path="/admin/users" element={<UserManagement />} />
              <Route path="/admin/chats" element={<ChatManagement />} />
              <Route path="/admin/messages" element={<MessageManagement />} />
            </Route>

            <Route path="*" element={<Notfound />} />
          </Routes>
        
        
        </Suspense>

        <Toaster position="bottom-center" />
      </BrowserRouter>
    </HelmetProvider>
  );
};

export default App;
