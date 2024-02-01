import logo from './logo.svg';
import './App.css';
import Login from './components/Login';
import Homepage from './components/Homepage';
import Navbar from './components/Navbar';
import {Routes,Route} from 'react-router-dom'
import View from './components/View';
import AddBookForm from './components/AddBookForm';
import Register from './components/Register';
import PrivateRoute from './components/PrivateRoute';
import Editbook from './components/Edit';
function App() {
  return<>
  <Routes>
        <Route path="/" element={<PrivateRoute><Homepage /></PrivateRoute>} />
        <Route path="/view/:id" element={<PrivateRoute><View/></PrivateRoute>} />
        <Route path="/addbook" element={<PrivateRoute><AddBookForm/></PrivateRoute>} />
        <Route path="/editbook/:id" element={<PrivateRoute><Editbook/></PrivateRoute>} />
        <Route path="/login" element={<Login/>} />
        <Route path="/register" element={<Register/>} />
      </Routes>
{/* <Homepage/> */}
 
  </>
}

export default App;
