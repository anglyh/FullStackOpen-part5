import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import BlogForm from './BlogForm';
import { expect, test } from 'vitest';

test('calls event handler with correct details when a new blog is created', async () => {  
  const createBlog = vi.fn();
  const user = userEvent.setup();

  render(<BlogForm createBlog={createBlog} />)

  const inputs = screen.getAllByRole('textbox');
  const sendButton = screen.getByText('create');

  await user.type(inputs[0], 'sun');
  await user.type(inputs[1], 'p3');
  await user.type(inputs[2], 'www.atlus.com');
  await user.click(sendButton);

  console.log('createBlog mock', createBlog.mock.calls);

  expect(createBlog.mock.calls).toHaveLength(1);

  expect(createBlog.mock.calls[0][0].title).toBe('sun');
  expect(createBlog.mock.calls[0][0].author).toBe('p3');
  expect(createBlog.mock.calls[0][0].url).toBe('www.atlus.com');
})