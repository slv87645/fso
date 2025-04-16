const { test, after, beforeEach } = require('node:test')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const helper = require('./test_helper')

const api = supertest(app)
const Blog = require('../models/blog')
const assert = require('node:assert')

beforeEach(async () => {
  await Blog.deleteMany({})

  for (let blog of helper.initialBlogs) {
    let blogObject = new Blog(blog)
    await blogObject.save()
  }
})

test('blogs are returned as json', async () => {
  await api
    .get('/api/blogs')
    .expect(200)
    .expect('Content-Type', /application\/json/)
})

test('there are six blogs', async () => {
  const response = await api.get('/api/blogs')
  assert.strictEqual(response.body.length, helper.initialBlogs.length)
})

test('blogs have id property instead of _id', async  () => {
  const response = await api.get('/api/blogs')
  const blog = response.body[0]
  assert.ok(blog.id, )
  assert.strictEqual(blog._id, undefined)
})

test('creating a new blog works', async () => {
  const newBlog = {
    // _id is removed as MongoDB generates it automatically
    title: 'test blog',
    author: 'skibidy',
    url: 'https://rizz.com/',
    likes: 7,
    __v: 0
  }

  await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(201)
    .expect('Content-Type', /application\/json/)

  const blogsAtEnd = await helper.blogsInDb()
  assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length + 1)

  const contents = blogsAtEnd.map(e => e.title)
  assert.ok(contents.includes('test blog'))
})

test('creating a new blog without likes defaults to 0', async () => {
  const newBlog = {
    // _id is removed as MongoDB generates it automatically
    title: 'test blog',
    author: 'skibidy',
    url: 'https://rizz.com/',
    __v: 0
  }

  const response = await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(201)
    .expect('Content-Type', /application\/json/)

  // Check that the response has a likes property
  const blogsAtEnd = await helper.blogsInDb()
  assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length + 1)
  assert.strictEqual(response.body.likes, 0)
})

test('creating a new blog without title returns 400', async () => {
  const newBlog = {
    // _id is removed as MongoDB generates it automatically
    author: 'skibidy',
    url: 'https://rizz.com/',
    __v: 0
  }

  const response = await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(400)
    .expect('Content-Type', /application\/json/)
  assert.strictEqual(response.body.error, 'title or url missing')
})

test('creating a new blog without url returns 400', async () => {
  const newBlog = {
    // _id is removed as MongoDB generates it automatically
    title: 'test blog',
    author: 'skibidy',
    __v: 0
  }

  const response = await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(400)
    .expect('Content-Type', /application\/json/)
  assert.strictEqual(response.body.error, 'title or url missing')
})

test('deleting a blog works', async () => {
  const blogsAtStart = await helper.blogsInDb()
  const blogToDelete = blogsAtStart[0]

  await api
    .delete(`/api/blogs/${blogToDelete.id}`)
    .expect(204)

  const blogsAtEnd = await helper.blogsInDb()
  assert.strictEqual(blogsAtEnd.length, blogsAtStart.length - 1)

  const contents = blogsAtEnd.map(e => e.title)
  assert(!contents.includes(blogToDelete.title))
})

test('updating likes of a blog works', async () => {
  const blogsAtStart = await helper.blogsInDb()
  const blogToUpdate = blogsAtStart[0]
  const newLike = {
    likes: 9
  }

  await api
    .put(`/api/blogs/${blogToUpdate.id}`)
    .send(newLike)
    .expect(204)

  console.log('put request completed')

  const blogsAtEnd = await helper.blogsInDb()
  const updatedBlog = blogsAtEnd[0]
  assert.strictEqual(updatedBlog.likes, newLike.likes)
})

after(async () => {
  await mongoose.connection.close()
})