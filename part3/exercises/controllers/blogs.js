const blogsRouter = require('express').Router()
const Blog = require('../models/blog')

blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({})
  response.json(blogs.map(blog => blog.toJSON()))
})

blogsRouter.post('/', async (request, response) => {
  const body = request.body

  if (body.likes === undefined) {
    body.likes = 0
  }

  if (!body.title || !body.url) {
    return response.status(400).json({ error: 'title or url missing' })
  }

  const blog = new Blog(request.body)

  const savedBlog = await blog.save()
  response.status(201).json(savedBlog.toJSON())
})

blogsRouter.delete('/:id', async (request, response) => {
  await Blog.findByIdAndDelete(request.params.id)
  response.status(204).end()
})

blogsRouter.put('/:id', async (request, response) => {
  const newLikes = request.body.likes
  console.log(request.params.id)

  const blogToUpdate = await Blog.findById(request.params.id)

  blogToUpdate.likes = newLikes

  const savedNote = await blogToUpdate.save()
  response.status(204).json(savedNote.toJSON())
})

module.exports = blogsRouter