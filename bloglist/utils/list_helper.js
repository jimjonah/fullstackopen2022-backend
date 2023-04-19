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

const mostBlogs = (blogs) => {
  const authors = new Map();
  let topAuthor;
  let authorBlogCount = 0;
  blogs.forEach(blog => {
    let blogCount = 1;
    if(authors.has(blog.author)){
      blogCount = authors.get(blog.author) + 1;
      authors.set(blog.author, blogCount);
    } else {
      authors.set(blog.author, blogCount);
    }

    if(blogCount > authorBlogCount){
      authorBlogCount = blogCount;
      topAuthor = blog.author;
    }
  });

  return {
    author: topAuthor,
    blogs: authorBlogCount
  }
}

const mostLikes = (blogs) => {
  const authors = new Map();
  let topAuthor;
  let authorLikeCount = 0;
  blogs.forEach(blog => {
    let likeCount = blog.likes;
    if(authors.has(blog.author)){
      likeCount = authors.get(blog.author) + blog.likes;
      authors.set(blog.author, likeCount);
    } else {
      authors.set(blog.author, likeCount);
    }

    if(likeCount > authorLikeCount){
      authorLikeCount = likeCount;
      topAuthor = blog.author;
    }
  });

  return {
    author: topAuthor,
    likes: authorLikeCount
  }

}


module.exports = {
  dummy, totalLikes, favoriteBlog, mostBlogs, mostLikes
}
