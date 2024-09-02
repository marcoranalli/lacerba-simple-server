import express from 'express';

const app = express();

app.get('/', (req, res) => {
    return res.send(`<h1>Ciao Lacerba</h1>`)
});

app.get('/ciao', (req, res) => {
    return res.send(`<h1>Ciao Lacerba</h1><p>questa è la pagina "/ciao!"</p>`)
});

app.get('/greetings/:name', (req, res) => {
    const name:string = req.params.name;
    return res.send(`<h1>Ciao ${name}</h1><p>questa è la pagina greetings</p>`)
});

app.get('*', (req, res) => {
    return res.status(404).send(`<h1>404</h1><p>Pagina non trovata</p>`);
});

interface BlogPost {
    id: number,
    title: string,
    date: Date,
    body: string,
    draft: boolean,
}

const posts: BlogPost[] = [
    {
        id: 0,
        title: "fist post",
        date: new Date(),
        body: "this is my first post on this Blog",
        draft: false,
    },
    {
        id: 1,
        title: "second post",
        date: new Date(),
        body: "this is my second post on this Blog",
        draft: false,
    }
];

app.get("/posts/:id", (req, res) => {
    const id = Number(req.params.id);
    const post = posts.find(post => post.id === id);
    if(!posts) {
        return res.status(404).send({ msg: 'not found' });
    };
    return res.send(posts);
});

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`🚀 Server started at https://localhost:3000`);
});