
import express from "express"
import mongoose from "mongoose";
import bodyParser from "body-parser";
import cors from "cors"

const app = express();
const port = 3000;

app.use(cors()); 
app.use(bodyParser.json());

mongoose.connect('mongodb://localhost:27017/animalList', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
const Animal = mongoose.model('Animal', { name: String });

app.use(bodyParser.json());

app.get('/animals', async (req, res) => {
  try {
    const animals = await Animal.find();
    res.json(animals);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.post('/animals', async (req, res) => {
  const animal = new Animal({ name: req.body.name });
  try {
    const newAnimal = await animal.save();
    res.status(201).json(newAnimal);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

app.put('/animals/:id', async (req, res) => {
  try {
    const animal = await Animal.findByIdAndUpdate(req.params.id, { name: req.body.name }, { new: true });
    if (animal) {
      res.json(animal);
    } else {
      res.status(404).json({ message: 'Animal not found' });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

app.delete('/animals/:id', async (req, res) => {
  try {
    const animal = await Animal.findByIdAndDelete(req.params.id);
    if (animal) {
      res.json({ message: 'Animal deleted' });
    } else {
      res.status(404).json({ message: 'Animal not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
