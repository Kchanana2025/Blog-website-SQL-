const express = require('express');

const db = require('../data/database');

const router = express.Router();

router.get('/', function (req, res) {
    res.redirect('/posts');
});

router.get('/posts', async function (req, res) {
    const query = `SELECT posts.*,authors.name AS author_name FROM posts
     INNER JOIN authors ON posts.author_id=authors.id
    `;
    const [posts] = await db.query(query);
    res.render('posts-list', { posts: posts });//express will automatically look for this file in views folder
});

router.get('/new-post', async function (req, res) {

    const [authors] = await db.query('SELECT * FROM authors');
    res.render('create-post', { authors: authors });

});

router.post('/posts', async function (req, res) {
    const data = [req.body.title, req.body.summary, req.body.content, req.body.author];
    await db.query('INSERT INTO posts(title,summary,body,author_id)VALUES(?)', [data]);//mysql package will expand array values and place it in place of question mark
    // db.query('INSERT INTO posts(title,summary,body,author_id)VALUES(?,?,?,?)', [data[0],data[1],data[2],data[3]]);aise bhi likh skte thee
    res.redirect('/posts');
});

router.get('/posts/:id', async function (req, res) {
    const query = `SELECT posts.*,authors.name AS author_name,authors.email AS author_email FROM posts
INNER JOIN authors ON posts.author_id=authors.id WHERE posts.id=?
`;
    //req.params.id will contain a dyanmic value which is present at the end of the url
    const [posts] = await db.query(query, [req.params.id]);//dyanmic ko aise alag se array bnake likh dia kro as a second parameter

    if (!posts || posts.length === 0) {//in case posts array is empty
        return res.status(404).render('404')
    }
    const postData = {
        ...posts[0], //this is spread operator with help of this all key value pairs are seperated. 
        date: posts[0].date.toISOString(),
        humanReadableDate: posts[0].date.toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        }) //converts date into human readable string
    };
    res.render('post-detail', { post: postData });
});

router.get('/posts/:id/edit', async function (req, res) {//this route will be triggered with you click on edit post
    const query = `SELECT * FROM posts WHERE ID=?`;
    const [posts] = await db.query(query, [req.params.id]);

    if (!posts || posts.length === 0) {
        return res.status(404).render('404');
    }

    res.render('update-post', { post: posts[0] });
});

router.post('/posts/:id/edit', async function (req, res) {//this route will be triggered when you click on update post button

    const query = `
    UPDATE posts SET title=?,summary=?,body=? 
    WHERE id=?`;
    await db.query(query, [req.body.title, req.body.summary, req.body.content, req.params.id]);

    res.redirect('/posts');

});

router.post('/posts/:id/delete', async function (req, res) {
    await db.query('DELETE FROM posts WHERE id=?', [req.params.id]);
    res.redirect('/posts');
});

module.exports = router;
