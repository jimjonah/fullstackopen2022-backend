const listHelper = require('../utils/list_helper');


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

//another way to test the blogs
// describe('total likes', () => {
//   const listWithOneBlog = [
//     {
//       _id: '5a422aa71b54a676234d17f8',
//       title: 'Go To Statement Considered Harmful',
//       author: 'Edsger W. Dijkstra',
//       url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
//       likes: 5,
//       __v: 0
//     }
//   ]
//
//   test('when list has only one blog, equals the likes of that', () => {
//     const result = listHelper.totalLikes(listWithOneBlog)
//     expect(result).toBe(5)
//   })
// })
