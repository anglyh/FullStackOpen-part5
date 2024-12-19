import PropTypes from 'prop-types';
import { useState } from 'react';

const Blog = ({ blog, user, updateBlog, deleteBlog }) => {
  const [visible, setVisible] = useState(false);

  const toggleVisibility = () => setVisible(!visible);

  const handleLike = () => {
    updateBlog({
      ...blog,
      likes: blog.likes + 1,
      user: blog.user.id
    });
  };

  const handleDelete = () => {
    if (confirm(`Remove blog ${blog.title} by ${blog.author}`)) {
      deleteBlog(blog.id);
    }
  };

  return (
    <li className="blog">
      {blog.title} {blog.author}{' '}
      <button onClick={toggleVisibility}>
        {visible ? 'hide' : 'show'}
      </button>

      {visible && (
        <div className="blogDetails">
          <p>{blog.url}</p>
          likes {blog.likes} <button onClick={handleLike}>like</button>
          <p>{blog.user.name}</p>
          {user.username === blog.user.username &&
            <button onClick={handleDelete}>remove</button>
          }
        </div>
      )}
    </li>
  );
};

Blog.propTypes = {
  blog: PropTypes.object.isRequired,
  user: PropTypes.object.isRequired,
  updateBlog: PropTypes.func.isRequired,
  deleteBlog: PropTypes.func.isRequired
};

export default Blog;