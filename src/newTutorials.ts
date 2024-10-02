import express from 'express';

const app = express();

app.use(express.json());

app.post('reply', (req, res) => {
    const body = req.body;
    console.log(body);
    res.send({body : body})
});

interface BlogPost {
    title: string;
    date: Date;
    body: string;
    id: number;
    draft: boolean;
}

const posts: BlogPost[] = [{
    id: 0,
    title: 'first post',
    date: new Date(),
    body: 'my first post',
    draft: false
}, 
{
    id: 1,
    title: 'second post',
    date: new Date(),
    body: 'my second post',
    draft: false
}];

app.get('/posts', (req, res) => {
    res.send(posts);
});

app.get('/posts/:id', (req, res) => {
    const id = Number(req.params.id);
    const post = posts.find((post) => post.id === id);
    if(!post) {
        res.status(404).send({msg: 'not found'});
    }
    res.send({post})
});

app.get('/sum/:number1/:number2', (req, res) => {
    const number1 = Number(req.params.number1);
    const number2 = Number(req.params.number2);
    const summ = number1 + number2
    res.send(`la somma tra ${number1} e ${number2} è ${summ}`);
});

app.get('/diff/:number1/:number2', (req, res) => {
    const number1 = Number(req.params.number1);
    const number2 = Number(req.params.number2);
    const diff = number1 - number2
    res.send(`
        <p> la differenza tra ${number1} e ${number2} è ${diff} </p>
        `);
});

app.get('/stats?nums=:num1&nums=:num2&nums=num3', (req, res) => {
    const nums:number[] = (req.query.nums as string[]).map((n) => Number(n));

   let somma = 0;
   for (let n of nums) {
    somma += n;
   }

   const media = somma / nums.length

     return res.send(`
        <h1> Ciao Blog! </h2>
        <p> Questo è il nostro primo server! </p>
        <p> Somma: ${somma} </p>
        <p> Media: ${media} </p>
    `)
})

app.get('*', (req, res) => {
    return res.status(404).send('<h1> 404 </h1> <p> pagina non trovata </p>')
})

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`server started at 
        https://localhost:3000`)
});