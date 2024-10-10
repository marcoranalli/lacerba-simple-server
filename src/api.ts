import express from 'express';

const app = express();

const validateInputMiddleware: express.RequestHandler = (req, res, next) => {
    const postData: PostInputData = req.body;
    if (!postData.title) {
        return res.status(403).send({error: "title field is required"});
    }
    if (!postData.body) {
        return res.status(403).send({error: "body field is required"});
    }
    next();
}

type PostInputData = Pick<BlogPost, 'body' | 'title' >;

app.use(express.json());

interface BlogPost {
    title: string;
    date: Date;
    body: string;
    id: number;
    draft: boolean;
}

let posts: BlogPost[] = [];

app.get('/posts', (req, res) => {
    res.send(posts);
});

app.get('/posts/:id', (req, res) => {
    const id = Number(req.params.id);
    const post = posts.find((post) => post.id === id);
    if (!post) {
        return res.status(404).send({ msg: 'impossibile trovare il post che hai cercato' });
    }
    return res.send(post);
});

app.post('/posts/', validateInputMiddleware, (req, res) => {
    const postData: Pick<BlogPost, 'body' | 'title'> = req.body;
    const lastPost = posts[posts.length - 1];
    const newPost: BlogPost = {
        id: lastPost ? lastPost.id + 1 : 0,
        date: new Date(),
        draft: false,
        title: postData.title,
        body: postData.body,
    }
    posts.push(newPost);
    return res.status(201).send(newPost);
});

app.delete('/posts/:id', (req, res) => {
    const id = Number(req.params.id);
    const toDelete = posts.find((post) => post.id === id);
    if(!toDelete) {
        return res.status(404).send(`post non trovato`);
    }
    posts = posts.filter((post) => post.id != toDelete.id)
    return res.send(toDelete);
});

app.put('/posts/:id', validateInputMiddleware, (req, res) => {
    const id = Number(req.params.id);
    const postData: PostInputData = req.body;
    const postToUpdateIndex = posts.findIndex((post) => post.id === id);
    if (!posts[postToUpdateIndex]) {
        return res.status(404).send({ msg: 'impossibile trovare il post che hai cercato' });
    }
    posts[postToUpdateIndex] = {
        ...posts[postToUpdateIndex],
        title: postData.title,
        body: postData.body,
    }
    return res.send(posts[postToUpdateIndex]);
});

let cnt = 0;
app.get('/', (req, res) => {
    cnt += 1;
    res.send({ hello: 'world', cnt });
});

app.post('/', (req, res) => {
    cnt += 1;
    res.send({ hello: 'world', cnt });
});

const calcSumAndMed = (nums:number[]):[number, number] => {
    let sum = 0;
    for (let n of nums) {
        sum += n;
    }
    let med = sum / nums.length;
    return [sum, med]
}

app.get('/stats', (req, res) => {
    const nums: number[] = (req.query.nums as string[]).map((n) => Number(n));
    const [sum, med] = calcSumAndMed(nums);
    res.send(` <p>
        somma = ${sum}
        media = ${med}
        </p> `)
});

app.post('/stats', (req, res) => {
    const numbers:number[] = req.body;
    const [sum, med] = calcSumAndMed(numbers)
    res.send({ sum, med });
});

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`🚀 Server started at https://localhost:3000`);
});