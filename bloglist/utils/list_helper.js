const Blog = require('../models/blog')


const dummy = (blogs) => {
  return 1;
}

const totalLikes = (blogs) => {
  const reducer = (sum, blog) => {
    return sum + blog.likes
  }

  return blogs.length === 0
      ? 0
      : blogs.reduce(reducer, 0)
}

const favoriteBlog = (blogs) => {
  let faveBlog;
  let likeCount = -1;

  blogs.forEach(blog => {
    if(blog.likes > likeCount){
      likeCount = blog.likes;
      faveBlog = blog;
    }
  })

  return faveBlog;
}

module.exports = {
  dummy, totalLikes, favoriteBlog
}
