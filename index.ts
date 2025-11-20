import express , {Request ,Response} from 'express';

const app = express();
const PORT = 5000;
import mongoose from 'mongoose';
import {User} from './src/models/User';
import { authMiddleware } from './src/middleware/auth';
mongoose.connect('mongodb://mongo:27017/mydatabase')
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('Could not connect to MongoDB', err));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

app.get('/', (req:Request, res:Response) => {
  res.send('Hello, World!');
});

app.get('/users', authMiddleware, async (req:Request, res:Response) => {
  try {
    const users = await User.find();  
    res.status(200).send(users);
  }
  catch (error) {
    res.status(500).send('Error fetching users');
  }
});


app.post('/users', authMiddleware,   async (req:Request, res:Response) => {
  try {
    const { name, email, password } = req.body;
    if(!name || !email || !password) {
      return res.status(400).send('All fields are required');
    }

    const newUser = new User({ name, email, password });
    await newUser.save();
    res.status(201).send(newUser);
  }
  catch (error) {
    res.status(500).send('Error creating user');
  } 
});




app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
