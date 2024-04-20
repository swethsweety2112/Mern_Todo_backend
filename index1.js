const mongoose = require('mongoose');
const express = require('express');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 5000;

mongoose.connect('mongodb+srv://swethsweety2112:sweety21@home.xxrpqjm.mongodb.net/?retryWrites=true&w=majority&appName=home')
    .then(() => {
        console.log('Connected to Swetha database');
    })
    .catch((err) => {
        console.error(err);
    });

const UserSchema = new mongoose.Schema({
    todo: { type: String, required: true },
    age: { type: Number, required: true },
    gender: { type: String, required: true },
});

const Collections = mongoose.model('happys', UserSchema);

app.use(express.json());
app.use(cors());

app.post('/posting', async (req, res) => {
    try {
        const { todo, age, gender } = req.body;
        const user = new Collections({ todo, age, gender });
        const result = await user.save();
        res.status(201).json(result);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Something went wrong' });
    }
});

app.get('/posting', async (req, res) => {
    try {
        const todos = await Collections.find();
        res.send(todos);
    } catch (error) {
        console.error(error);
        res.status(500).send('Something Went Wrong');
    }
});

app.get('/posting/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const todo = await Collections.findById(id);
        if (!todo) {
            return res.status(404).send('Todo not found');
        }
        res.send(todo);
    } catch (error) {
        console.error(error);
        res.status(500).send('Something Went Wrong');
    }
});

// PUT (Update) a todo by ID
// PUT (Update) a todo by ID
app.put('/posting/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { todo, age, gender } = req.body;
        const updatedTodo = await Collections.findByIdAndUpdate(id, { todo, age, gender }, { new: true });
        res.json(updatedTodo); // Return the updated todo item with all fields
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Something went wrong' });
    }
});
app.delete('/posting/:id', async (req, res) => {
    try {
        const { id } = req.params;
        await Collections.findByIdAndDelete(id);
        res.send('Todo deleted successfully');
    } catch (error) {
        console.error(error);
        res.status(500).send('Something Went Wrong');
    }
});

app.listen(port, () => {
    console.log('Server is running on port ${port}');
});