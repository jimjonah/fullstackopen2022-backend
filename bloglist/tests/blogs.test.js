const listHelper = require('../utils/list_helper');
const Blog = require('../models/blog');


describe('blogs test', () => {
  test('dummy returns one', () => {
    const blogs = [];

    const result = listHelper.dummy(blogs);
    expect(result).toBe(1);
  });

  test('return total of all likes', () => {
    let blogs = [];

    let result = listHelper.totalLikes(blogs);
    expect(result).toBe(0);

    blogs.push({
      "title": "New Blog Title",
      "author": "Jim Jonah",
      "url": "www.mysite.com",
      "likes": 3
    });

    blogs.push({
      "title": "Second Blog Title",
      "author": "Jim Jonah",
      "url": "www.mysite.com",
      "likes": 2
    });

    result = listHelper.totalLikes(blogs);
    expect(result).toBe(5);
  });
});
