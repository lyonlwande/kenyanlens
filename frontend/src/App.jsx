import React, { useEffect } from 'react'
import { Route, Routes } from 'react-router-dom'
import 'quill/dist/quill.snow.css';
import Home from './pages/Home.jsx'
import Blog from './pages/Blog.jsx'
import Login from './pages/Login.jsx';
import Signup from './pages/Signup.jsx';
import useAuthStore from './zustandStores/authStore.js';
import Profile from './pages/Profile.jsx';
import Layout from './pages/BlogAuthors/Layout.jsx';
import DashBoard from './pages/BlogAuthors/Dash.jsx';
import AddBlog from './pages/BlogAuthors/AddBlog.jsx';
import ListBlog from './pages/BlogAuthors/ListBlog.jsx';
import EditBlog from './pages/BlogAuthors/EditBlog.jsx';
import Comments from './pages/BlogAuthors/Comments.jsx';
import DraftsList from './pages/BlogAuthors/DraftsList.jsx';
const App = () => {
  const checkAuth = useAuthStore((state) => state.checkAuth);

  
  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  return (
    <div className='text-black/80'>
      <Routes>
        <Route path='/' element={<Home/>} />
        <Route path='/blog/:id' element={<Blog/>} />
        <Route path='/login' element={<Login />} />
        <Route path='/signup' element={<Signup />} />
        <Route path='/profile' element={<Profile />} />
        <Route path='/author' element={<Layout/>}>
          <Route index element={<DashBoard/>}/>
          <Route path='addBlog' element={<AddBlog/>}/>
          <Route path='listBlog' element={<ListBlog/>}/>
          <Route path='editBlog/:id' element={<EditBlog/>}/>
          <Route path='comments' element={<Comments/>} />
          <Route path='drafts' element={<DraftsList/>} />
        </Route>
      </Routes>
    </div>
  )
}

export default App
