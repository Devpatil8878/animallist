// App.js
import React, { useState, useEffect } from 'react';

const App = () => {
  const [animals, setAnimals] = useState<any[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [editIndex, setEditIndex] = useState<any>(null);

  useEffect(() => {
    // Fetch animals from server when component mounts
    fetch('http://localhost:3000/animals')
      .then(res => res.json())
      .then(data => setAnimals(data))
      .catch(error => console.error('Error fetching animals:', error));
  }, []);

  const handleAddAnimal = () => {
    if (inputValue.trim() !== '') {
      fetch('http://localhost:3000/animals', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name: inputValue.trim() }),
      })
        .then(res => res.json())
        .then(data => {
          setAnimals([...animals, data]);
          setInputValue('');
        })
        .catch(error => console.error('Error adding animal:', error));
    }
  };

  const handleRemoveAnimal = (id: any) => {
    fetch(`http://localhost:3000/animals/${id}`, {
      method: 'DELETE',
    })
      .then(() => setAnimals(animals.filter(animal => animal._id !== id)))
      .catch(error => console.error('Error deleting animal:', error));
  };

  const handleEditAnimal = (index: any) => {
    setEditIndex(index);
    setInputValue(animals[index].name);
  };

  const handleSaveEdit = (id: any) => {
    const updatedAnimal = { name: inputValue.trim() };
    fetch(`http://localhost:3000/animals/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updatedAnimal),
    })
      .then(res => res.json())
      .then(data => {
        const updatedAnimals = [...animals];
        updatedAnimals[editIndex] = data;
        setAnimals(updatedAnimals);
        setInputValue('');
        setEditIndex(null);
      })
      .catch(error => console.error('Error updating animal:', error));
  };

  return (
    <div className="container mt-20">
      <h1>Animal List</h1>
      <ul className='mt-10'>
        {animals.map((animal, index) => (
          <li key={animal._id} className=' w-[20rem] flex justify-between h-[3rem] '>
            {editIndex === index ? (
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                className=' rounded-md p-2 h-[2rem] mt-2'
              />
            ) : (
              <span className='mt-1 p-2 h-[2rem]'>
                {animal.name}
                </span>
            )}
            <span>
              {editIndex === index ? (
                <button onClick={() => handleSaveEdit(animal._id)} className='scale-75 '>Save</button>
              ) : (
                <span className=''>
                  <button onClick={() => handleEditAnimal(index)} className='scale-75'>Edit</button>
                  <button onClick={() => handleRemoveAnimal(animal._id)} className='scale-75'>Remove</button>
                </span>
              )}
            </span>
          </li>
        ))}
      </ul>
      <div className="form mt-10">
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="Enter an animal"
          className='p-2 rounded-md'
        />
        <button onClick={handleAddAnimal}>Add</button>
      </div>
    </div>
  );
};

export default App;
