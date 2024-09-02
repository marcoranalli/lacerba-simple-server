import express from 'express';

const app = express();

app.use(express.json());

const validateMiddleware: express.RequestHandler = (req, res, next) => {
    const postData: BlogPost = req.body;

    if(!postData.title) {
        return res.status(403).send({ error: 'title field is required' });
    }

    if(!postData.body) {
        return res.status(403).send({ error: 'body field is required' });
    }
    next();
}

const sumAndMed = (nums:number[]):[number, number] => {
    let sum = 0;
    for(let n of nums) {
        sum += n;
    }
    let med = sum / nums.length;
    return [sum, med];
}

app.get('/stats', (req, res) => {
    const nums:number[] = (req.query.nums as string[]).map((n) => {
        return Number(n);
    });

    const [sum, med] = sumAndMed(nums);

    res.send(`
        <p> la somma è ${sum} </p>
        <p> la media è ${med} </p>
        `)
});

app.post('/stats', (req, res) => {
    const numbers = req.body;
    const [sum, med] = sumAndMed(numbers);
    return res.send({ sum, med });
});

interface BlogPost {
    title: string,
    date: Date,
    body: string,
    id: number,
    draft: boolean,
}

let posts: BlogPost[] = [];

app.get('/posts/', (req, res) => {
    res.send(posts);
})

app.get('/posts/:id', (req, res) => {
    const id = Number(req.params.id);
    const post = posts.find((post) => post.id == id);
    if (!post) {
        return res.status(404).send({ msg: 'not found' });
    }
    return res.send(post);
});

app.post('/posts/:id/public', (req, res) => {
    const id = Number(req.params.id);
    const postToPublic = posts.findIndex((post) => post.id == id);
    if (!posts[postToPublic]) {
        return res.status(404).send({ msg: 'not found' });
    }
    posts[postToPublic].draft = true;
    return res.send(posts[postToPublic]);
});

app.post('/posts', validateMiddleware, (req, res) => {
    const postData: Pick<BlogPost, 'body' | 'title'> = req.body;
    const lastPost = posts[posts.length - 1];
    const newPost: BlogPost = {
        id: lastPost ? lastPost.id + 1 : 0,
        date: new Date(),
        draft: false,
        title: postData.title,
        body: postData.body,
    };
    posts.push(newPost);
    return res.status(201).send(newPost);
});

app.delete('/posts/:id',  (req, res) => {
    const id = Number(req.params.id);
    const postToDelete = posts.find((post) => post.id == id);
    if(!postToDelete) {
        return res.status(404).send({ msg: 'not found' });
    }
    posts = posts.filter((post) => post.id != id);
    return res.send(postToDelete);
});

app.put('/posts/:id', validateMiddleware, (req, res) => {
    const id = Number(req.params.id);
    const postData = req.body;
    const toUpdate = posts.findIndex((post) => post.id === id);
    if (!posts[toUpdate]) {
        res.status(404).send({ msg:'not found' });
    }
    posts[toUpdate] = {
        ...posts[toUpdate],
        title: postData.title,
        body: postData.body
    }
    return  res.send(posts[toUpdate]);
})

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`🚀 Server started at http://localhost:3000`);
})