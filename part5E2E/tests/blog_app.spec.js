const { test, expect, beforeEach, describe } = require('@playwright/test');
const { loginWith, createBlog } = require('./helper');

describe('Blog app', () => {
  beforeEach(async ({ page, request }) => {
    await request.post('/api/testing/reset');
    await request.post('/api/users', {
      data: {
        name: 'angel',
        username: 'angel123',
        password: 'angel321',
      },
    });

    await request.post('/api/users', {
      data: {
        name: 'adrian',
        username: 'adrian123',
        password: 'adrian321'
      }
    })

    await page.goto('/');
  });

  test('Login form is shown', async ({ page }) => {
    const formElement = page.getByText('Log in to application').locator('..');
    await expect(formElement).toBeVisible();
  });

  describe('Login', () => {
    test('User can log in', async ({ page }) => {
      await loginWith(page, 'angel123', 'angel321');
      await expect(page.getByText('Blogs')).toBeVisible();
    });

    test('user can not login with incorrect credentials', async ({ page }) => {
      await loginWith(page, 'abc123', 'abc321');
      await expect(page.getByText('wrong username or password')).toBeVisible();
    });
  });

  describe('When logged in', () => {
    beforeEach(async ({ page }) => {
      await loginWith(page, 'angel123', 'angel321');
    });

    test('a new blog can be created', async ({ page }) => {
      await createBlog(page, 'book', 'new author', 'http://www.new-url.com');

      await expect(page.getByText('book new author')).toBeVisible();
    });

    describe('a note exists', () => {
      beforeEach(async ({ page }) => {
        await createBlog(page, 'book', 'new author', 'http://www.new-url.com');
      });

      test('can be edited by clicking the like button', async ({ page }) => {
        const blogElement = page.getByText('book new author').locator('..');
        await blogElement.getByRole('button', { name: 'show' }).click();
        await blogElement.getByRole('button', { name: 'like' }).click();

        await expect(blogElement.getByText('likes 1')).toBeVisible();
      });
      
      test('blog can be deleted', async ({ page }) => {
        const blogElement = page.getByText('book new author').locator('..');
        await blogElement.getByRole('button', { name: 'show' }).click();

        await blogElement.getByRole('button', { name: 'remove' }).click();

        page.on('dialog', async (dialog) => {
          await dialog.accept();
          await expect(page.getByText('book new author')).not.toBeVisible();
        })
      })

      describe('other user logged in', () => {
        beforeEach(async ({ page }) => {
          await page.getByRole('button', { name: 'logout' }).click();
          await loginWith(page, 'adrian123', 'adrian321')
        })
    
        test('can not see remove button', async ({ page }) => {
          const blogElement = page.getByText('book new author').locator('..');
          await blogElement.getByRole('button', { name: 'show' }).click();
    
          await expect(blogElement.getByRole('button', { name: 'remove '})).not.toBeVisible();
        })
      })
    });

    describe('With multiple blogs created', () => {
      beforeEach(async ({ page }) => {
        await createBlog(page, 'First blog', 'Author One', 'http://www.first-url.com');
        await createBlog(page, 'Second blog', 'Author Two', 'http://www.second-url.com');
        await createBlog(page, 'Third blog', 'Author Three', 'http://www.third-url.com');
      })

      test('blogs are displayed in the correct order of likes', async ({ page }) => {
        const blogs = [
          { element: page.locator('li', { hasText: 'First blog Author One' }), likes: 3 },
          { element: page.locator('li', { hasText: 'Second blog Author Two' }), likes: 2 },
          { element: page.locator('li', { hasText: 'Third blog Author Three' }), likes: 1 }
        ];
      
        for (const blog of blogs) {
          await blog.element.getByRole('button', { name: 'show' }).click();
        }
        
        for (const blog of blogs) {
          for (let i = 0; i < blog.likes; i++) {
            await blog.element.getByRole('button', { name: 'like' }).click();
            await blog.element.getByText(`likes ${i + 1}`).waitFor();
          }
        }
      
        const blogItems = page.locator('.blogList li');
        
        await expect(blogItems.nth(0)).toContainText('First blog Author One');
        await expect(blogItems.nth(1)).toContainText('Second blog Author Two');
        await expect(blogItems.nth(2)).toContainText('Third blog Author Three');
      });
    })
  });
});
