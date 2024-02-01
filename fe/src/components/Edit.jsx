// Editbook.js

import React, { useEffect, useState } from 'react';
import Navbar from './Navbar';
import './AddBookForm.css';
import { useParams } from 'react-router-dom';

const Editbook = () => {
  const [formData, setFormData] = useState({
    title: '',
    category: '',
    content: '',
  });

  const { id: bookid } = useParams();
  const [book, setBook] = useState({});
  const token = localStorage.getItem('token');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

   const  getBook = async () => {
    try {
      const response = await fetch(`https://englishquestapi.onrender.com/book/${bookid}`, {
        headers: {
          'Content-type': 'application/json',
          "Authorization": token,
        },
      });

      const data = await response.json();
      setBook(data.book);
    } catch (error) {
      console.log(error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
          await fetch(`https://englishquestapi.onrender.com/book/${bookid}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          "Authorization": token,
        },
        body: JSON.stringify(formData),
      }).then(res=>res.json()).then((res)=>{

        alert(res.message)
        window.location = '/';
    }).catch(err => console.log(err));
    } catch (error) {
      console.error('Error editing book:', error);
    }
  };

  useEffect(() => {
    getBook();
  }, [bookid]); // Only use bookid in the dependency array if it's needed for fetching the book details

  return (
    <div className="add-book-form-container">
      <Navbar />
      <h2>Edit your Book</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="title">Title:</label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title||book.title} // Use formData or fallback to book details
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="category">Category:</label>
          <select
            id="category"
            name="category"
            value={formData.category||book.category } // Use formData or fallback to book details
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
            value={formData.content||book.content } // Use formData or fallback to book details
            onChange={handleChange}
            required
          />
        </div>
        <button type="submit">Edit Book</button>
      </form>
    </div>
  );
};

export default Editbook;

