import { useState, useEffect, useRef } from 'react';
import './App.css';
import blogService from './services/blogs';
import loginService from './services/login';
import Notification from './components/Notification';
import Togglable from './components/Togglable';
import Blog from './components/Blog';
import BlogForm from './components/BlogForm';
import LoginForm from './components/LoginForm';

const App = () => {
  const [blogs, setBlogs] = useState([]);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [user, setUser] = useState(null);
  const [notificationMessage, setNotificationMessage] = useState('');
  const [isSuccessful, setIsSuccessful] = useState(false);

  useEffect(() => {
    console.log('useEffect ejecutado');
    fetchBlogs();
  }, []);

  useEffect(() => {
    const loggedUserJSON = localStorage.getItem('loggedBlogappUser');
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON);
      console.log('user', user);
      setUser(user);
      blogService.setToken(user.token);
    }
  }, []);

  const fetchBlogs = async () => {
    const initialBlogs = await blogService.getAll();
    console.log(initialBlogs);
    setBlogs(initialBlogs);
  };

  const handleLogin = async (event) => {
    event.preventDefault();
    try {
      const user = await loginService.login({
        username,
        password,
      });

      console.log('user in handleLogin', user);

      localStorage.setItem('loggedBlogappUser', JSON.stringify(user));
      blogService.setToken(user.token);

      setUser(user);
      setUsername('');
      setPassword('');
    } catch (exception) {
      console.log('Wrong credentials');
      setIsSuccessful(false);
      setNotificationMessage('wrong username or password');
      setTimeout(() => setNotificationMessage(null), 5000);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('loggedBlogappUser');
    setUser(null);
  };

  const loginForm = () => (
    <LoginForm
      handleSubmit={handleLogin}
      handleUsernameChange={({ target }) => setUsername(target.value)}
      handlePasswordChange={({ target }) => setPassword(target.value)}
      username={username}
      password={password}
      notificationMessage={notificationMessage}
      isSuccessful={isSuccessful}
    />
  );

  const blogFormRef = useRef();

  const addBlog = async (blogObject) => {
    try {
      blogFormRef.current.toggleVisibility();

      const blog = await blogService.create(blogObject);
      console.log('blog in addBlog', blog);

      setBlogs((prevBlogs) => [...prevBlogs, blog]);

      setIsSuccessful(true);
      setNotificationMessage(
        `a new blog ${blog.title} by ${blog.author} added`
      );

      setTimeout(() => setNotificationMessage(null), 5000);
    } catch (exception) {
      console.log('Error at trying to create a blog', exception);
    }
  };

  const updateLike = async (blogObject) => {
    try {
      const updatedBlog = await blogService.update(blogObject);

      setBlogs(prevBlogs =>
        prevBlogs.map(blog => blog.id !== updatedBlog.id ? blog : updatedBlog)
      );

    } catch (exception) {
      console.log('Error trying to update blog', exception);
    }
  };

  const removeBlog = async (blogId) => {
    try {
      await blogService.remove(blogId);

      setBlogs(prevBlogs =>
        prevBlogs.filter(blog => blog.id !== blogId)
      );
    } catch (exception) {
      console.log('Error trying to delete blog', exception);
    }
  };

  const blogsSortedByLikes = blogs.sort((a, b) => b.likes - a.likes);

  return (
    <>
      {!user && loginForm()}
      {user && (
        <>
          <h2>Blogs</h2>
          <Notification message={notificationMessage} isSuccessful={isSuccessful} />
          {user.name} logged-in
          <button onClick={handleLogout}>logout</button>

          <Togglable buttonLabel='add blog' ref={blogFormRef}>
            <BlogForm createBlog={addBlog} />
          </Togglable>

          <ul className="blogList">
            {blogsSortedByLikes.map(blog => (
              <Blog
                key={blog.id}
                blog={blog}
                user={user}
                updateBlog={updateLike}
                deleteBlog={removeBlog}
              />
            ))}
          </ul>
        </>
      )}
    </>
  );
};

export default App;
