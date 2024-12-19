import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Blog from './Blog';
import { expect, test } from 'vitest';

test('verify blog component shows title and author, not URL or likes', () => {
  const blog = {
    title: 'Understanding React',
    author: 'Jane Doe',
    url: 'https://www.example.com/understanding-react',
    likes: 100,
    user: {
      name: 'John Smith',
      username: 'johnsmith',
    },
  };

  const { container } = render(<Blog blog={blog} />);

  const element = screen.getByText('Understanding React Jane Doe');

  screen.debug(element);
  expect(element).toBeDefined();

  const details = container.querySelector('.blogDetails');
  expect(details).toBeNull();
});

test('verify URL and likes are shown after clicking the details button', async () => {
  const blog = {
    title: 'Understanding React',
    author: 'Jane Doe',
    url: 'https://www.example.com/understanding-react',
    likes: 100,
    user: {
      name: 'John Smith',
      username: 'johnsmith',
    },
  };

  const blogUser = {
    name: 'John Smith',
    username: 'johnsmith',
  }
  
  render(<Blog blog={blog} user={blogUser}/>)
  
  const user = userEvent.setup();
  const button = screen.getByText('show');
  await user.click(button);

  const url = screen.getByText('https://www.example.com/understanding-react')
  const likes = screen.getByText('likes 100')

  expect(url).toBeDefined();
  expect(likes).toBeDefined();
})

test('verify like button click triggers event handler twice', async () => {  
  const blog = {
    title: 'Understanding React',
    author: 'Jane Doe',
    url: 'https://www.example.com/understanding-react',
    likes: 100,
    user: {
      name: 'John Smith',
      username: 'johnsmith',
    },
  };

  const blogUser = {
    name: 'John Smith',
    username: 'johnsmith',
  }

  const updateLike = vi.fn();

  render(<Blog blog={blog} user={blogUser} updateBlog={updateLike} />)

  const user = userEvent.setup();
  const buttonShow = screen.getByText('show');
  await user.click(buttonShow)

  const buttonLike = screen.getByText('like')
  await user.click(buttonLike)
  await user.click(buttonLike)

  expect(updateLike.mock.calls).toHaveLength(2);
})