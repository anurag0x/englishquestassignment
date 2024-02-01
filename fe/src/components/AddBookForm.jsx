// AddBookForm.js

import React, { useState } from 'react';
import Navbar from './Navbar';
import './AddBookForm.css'; // Import your CSS file for styling

const AddBookForm = () => {
  const [formData, setFormData] = useState({
    title: '',
    category: '',
    content: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const token =localStorage.getItem("token")

      const response = await fetch('https://englishquestapi.onrender.com/book/addBook', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          "Authorization": token,
        },
        body: JSON.stringify(formData),
      }).then(res=>res.json()).then(res=>alert(res.message));

     

      
      setFormData({
        title: '',
        category: '',
        content: '',
      });
      window.location="/"
    } catch (error) {
      console.error('Error adding book:', error);
     
      // Handle error, you might want to display an error message
    }
  };

  return (
    <div className="add-book-form-container">
      <Navbar />
      <h2>Add a New Book</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="title">Title:</label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="category">Category:</label>
          <select
            id="category"
            name="category"
            value={formData.category}
            onChange={handleChange}
            required
          >
            <option value="">Select Category</option>
            <option value="Poetry">Poetry</option>
            <option value="Science">Science</option>
            <option value="Mystery">Mystery</option>
            <option value="Programming">Programming</option>
          </select>
        </div>
        <div className="form-group">
          <label htmlFor="content">Content:</label>
          <textarea
            id="content"
            name="content"
            value={formData.content}
            onChange={handleChange}
            required
          />
        </div>
        <button type="submit">Add Book</button>
      </form>
    </div>
  );
};

export default AddBookForm;
