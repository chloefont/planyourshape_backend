// Importing module
import express from 'express';
import bodyParser from 'body-parser';
import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

const app = express();
const PORT:Number=3000;

app.use(bodyParser.json());

// Handling GET / Request
app.get('/', (req, res) => {
	res.send('Welcome to typescript backend!');
})

app.post('/login', (req, res) => {
    console.log(req.body.username);
    res.status(200).send();
})

app.post('/register', async (req, res) => {
    await prisma.$connect();
    await prisma.user.create({
		data:{
			firstname: "Luca",
			lastname: "Coduri",
			username: "bafana",
			email: "luca@gmail.com",
			password: "banane"
		}
	})

	prisma.$disconnect;
	// res.json(user);
	res.send("coucou");
})

// Server setup
app.listen(PORT,() => {
	console.log('The application is listening '
		+ 'on port http://localhost:'+PORT);
})
