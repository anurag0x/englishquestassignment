import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Navbar from './Navbar';
import { useNavigate } from 'react-router-dom';

const View = () => {
  const { id: bookid } = useParams();
  const [book, setBook] = useState({});
  const token = localStorage.getItem('token')
  const navigate = useNavigate();

  const getBook = () => {
    try {
      fetch(`https://englishquestapi.onrender.com/book/${bookid}`, {
        headers: {
          "Content-type": "application/json",
          "Authorization": token
        }
      })
        .then(res => res.json())
        .then((data) => {
          setBook(data.book);
        })
        .catch(err => console.log(err));
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getBook();
  }, [bookid]);

  return (
    <div style={{ width: "80%", margin: "auto", padding: "20px" }}>
      <Navbar />
      <div style={{ display: "flex", alignItems: "center", justifyContent: "flex-end", marginBottom: "20px" }}>
        <button onClick={() => navigate("/")} style={{ padding: "10px", fontSize: "16px", border: "none", cursor: "pointer", backgroundColor: "#3498db", color: "white", borderRadius: "5px" }}>⬅️ Back To Homepage</button>
      </div>
      {Object.keys(book).length > 0 ? (
        <div style={{ boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)", padding: "20px", borderRadius: "10px", backgroundColor: "#fff" }}>
          <h2 style={{ color: "#3498db", marginBottom: "10px" }}>{book.title}</h2>
          <p><strong>Category:</strong> {book.category}</p>
          <p><strong>Author:</strong> {book.author.name}</p>
          <hr style={{ margin: "10px 0", borderColor: "#ecf0f1" }} />
          <p><strong>Summary:</strong></p>
          <p>{book.content}</p>
        </div>
      ) : (
        <p style={{ textAlign: "center", color: "#95a5a6" }}>Loading...</p>
      )}
    </div>
  );
};

export default View;
