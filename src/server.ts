import express from 'express';
const app = express();

let cnt = 0;

app.get('/sum:num1/:num2', (req, res) => {
    const num1 = Number(req.params.num1);
    const num2 = Number(req.params.num2);

    res.send(`
        <p> ${num1} + ${num2} = ${num1 + num2} </p>
    `);
});

app.get('diff/:num1/:num2', (req, res) => {
    const num1 = Number(req.params.num1);
    const num2 = Number(req.params.num2);

    res.send(`
        <p> ${num1} - ${num2} = ${num1 - num2} </p>
    `);
});

app.get('/stats', (req, res) => {
    const nums: number[] = (req.query.nums as string[]).map((n) => {
        return Number(n);
    });

    let sum = 0
    for(let n of nums) {
        sum += n;
    }

    const med = sum / nums.length;

    res.send(`
        <p> La somma è ${sum} </p>
        <p> La media è ${med} </p>
    `);
});

// app.get('/stats', (req, res) => {
//     const nums:number[] = (req.query.nums as string[]).map((n) => {
//         return Number(n);
//     });

//     let sum = 0;
//     for (let n of nums) {
//         sum += n;
//     }

//     const med = sum / nums.length;

//     return res.send(`
//         <p> La somma è ${sum} </p>
//         <p> La media è ${med} </p>
//         `);
// });



app.listen(3000, () => {
    console.log('server started at http://localhost:3000');
});