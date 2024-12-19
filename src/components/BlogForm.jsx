import { useState } from 'react';

const BlogForm = ({ createBlog }) => {
  const [newBlog, setNewBlog] = useState({
    title: '',
    author: '',
    url: '',
  });

  const addBlog = (event) => {
    event.preventDefault();
    createBlog(newBlog);

    setNewBlog({ title: '', author: '', url: '' });
  };

  return (
    <form onSubmit={addBlog}>
      <div>
        title:
        <input
          type='text'
          value={newBlog.title}
          name='blog-title'
          onChange={({ target }) =>
            setNewBlog((prev) => ({ ...prev, title: target.value }))
          }
          data-testid='blog-title'
        />
      </div>

      <div>
        author:
        <input
          type='text'
          value={newBlog.author}
          name='blog-author'
          onChange={({ target }) =>
            setNewBlog((prev) => ({ ...prev, author: target.value }))
          }
          data-testid='blog-author'
        />
      </div>

      <div>
        url:
        <input
          type='text'
          value={newBlog.url}
          name='blog-url'
          onChange={({ target }) =>
            setNewBlog((prev) => ({ ...prev, url: target.value }))
          }
          data-testid='blog-url'
        />
      </div>

      <button type='submit'>create</button>
    </form>
  );
};

export default BlogForm;