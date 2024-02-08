import React, { useEffect, useState } from 'react';
import Navbar from './Navbar';
import { Link, useNavigate } from 'react-router-dom';
import '../App.css'
import "./Homepage.css"
const Homepage = () => {
  // State variables
  const [data, setData] = useState([]);
  const [filterBy, setFilterBy] = useState("");
  const [sortBy, setSortBy] = useState("");
  const [title, setTitle] = useState("");
  const role=localStorage.getItem("role")
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const userid=localStorage.getItem("user")

  // Function to fetch data based on filters
  const getData = async () => {
    try {
      // Constructing filtering parameters
      let filtering = [];
      if (filterBy) filtering.push(`category=${filterBy}`);
      if (title) filtering.push(`title=${title}`);
      if (sortBy) filtering.push(`${sortBy}=1`);
      
      // Constructing query string
      let query = filtering.join("&&");
      
      // Fetching data from the server
      let response = await fetch(`https://englishquestapi.onrender.com/book/allBooks?${query}`, {
        headers: {
          "Content-type": "application/json",
          "Authorization": token
        }
      })
      .then(res => res.json())
      .then((el) =>{
         setData(el.books)
        console.log(el)
      })
      .catch(err => console.log(err));
    } catch (error) {
      console.log("error", error);
    }
  };
  if(!token){
    window.location="/login"
  }

  // Function to handle delete operation
  const handleClickDelete = (id) => {
    try {
      fetch(`https://englishquestapi.onrender.com/book/${id}`, {
        method: "DELETE",
        headers: {
          "Content-type": "application/json",
          "Authorization": token
        }
      })
      .then(res => res.json())
      .then((el) =>{
        getData()
      alert(el.message)
    } )
        
      .catch(err => console.log(err));
    } catch (error) {
      console.log(error);
    }
  };
const handlelogout=()=>{
  localStorage.removeItem('user')
  localStorage.clear()
  window.location='./login'
}
  // Function to handle edit operation (not implemented)
  const handleClickEdit = (id) => {
    // Implement edit functionality
    navigate(`/editbook/${id}`)
  };

  // useEffect hook to fetch data on component mount and when dependencies change
  useEffect(() => {
    if (token) {
      getData();
    }
  }, [sortBy, filterBy, token,title]);
  

  // JSX structure
  return (
    <div className='maincont' style={{ width: "90%", margin: "auto" }}>
      <Navbar />
      <div className='navbar-container'>
        <button className='add-book-button' style={{ display: (role === "CREATOR") ? "default" : "none" }} onClick={() => navigate('/addbook')}>
          Add Book
        </button>
       
      </div>
      <div style={{display:'flex',justifyContent:"flex-end",bottom:(role==="CREATOR"?"141px":"150px")}} > <button className='logout-button' onClick={handlelogout}>
          Logout
        </button></div>
      <div style={{ display: "flex", justifyContent: "space-around" }}>
        {/* Input for searching books */}
        <div>
    <input className="search-input" onChange={(e) => setTitle(e.target.value)} placeholder='Search Books...' />
  </div>
  {/* Dropdown for filtering by category */}
  <div>
    <label>Filter By Category</label>
    <select className="filter-select" onChange={(e) => setFilterBy(e.target.value)}>
      <option value="">All</option>
      <option value="Poetry">Poetry</option>
      <option value="Science">Science</option>
      <option value="Mystery">Mystery</option>
      <option value="Programming">Programming</option>
    </select>
  </div>
  {/* Dropdown for sorting */}
  <div>
    <label>Sort</label>
    <select className="sort-select" onChange={(e) => setSortBy(e.target.value)}>
      <option value="">All</option>
      <option value="new">New</option>
      <option value="old">Old</option>
    </select>
  </div>

      </div>
      {/* Table displaying book data */}
      <table style={{ width: "100%", marginTop: "100px", textAlign: "center" }}>
        <thead>
          <tr>
            <th>S N0.</th>
            <th>Title</th>
            <th>Author</th>
            <th>Category</th>
            <th>Content</th>
            <th style={{ display: (role === "CREATOR") ? "default" : "none" }}>Edit</th>
            <th style={{ display: (role === "CREATOR") ? "default" : "none" }}>Delete</th>
          </tr>
        </thead>
        <tbody>
          {data.map((el, i) => (
            <tr key={el._id}>
              <td>{i + 1}</td>
              <td>{el.title}</td>
              <td>{el.author.name}</td>
              <td>{el.category}</td>
              <td><button onClick={() => navigate(`/view/${el._id}`)}>View</button></td>
              <td style={{ display: (role === "CREATOR"&&el.author._id==userid) ? "default" : "none"}}>
                <button onClick={() => handleClickEdit(el._id)}>Edit</button>
              </td>
              <td style={{ display: (role === "CREATOR"&&el.author._id==userid) ? "default" : "none" }}>
                <button onClick={() => handleClickDelete(el._id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Homepage;
