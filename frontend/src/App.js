import 'react-calendar/dist/Calendar.css';
import './style/_main.scss';
import { useState, useEffect} from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import jwt_decode from "jwt-decode";
import axios from "axios";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Homepage from './components/homepage/Homepage';
import NewRequest from './components/Request/NewRequest';
import Login from './components/user/Login';
import Navbar from './components/Navbar/Navbar';
import ViewRequest from './components/Request/ViewRequest';


function App() {
  const [isAuth, setIsAuth] = useState(false);
  const [user, setUser] = useState({});

  useEffect(()=>{
    let token = localStorage.getItem("token");
    if(token != null){
      let user = jwt_decode(token);
        getUser(user.user.id);
      if(user){
        setIsAuth(true);
        setUser(user);
      }else if(!user){
        localStorage.removeItem("token");
        setIsAuth(false);
      }
    }
  },[])

  const getUser = (id) =>{
    axios.get(`http://localhost:3306/employee/${id}`)
    .then(res => {
      setUser(res.data[0])
    })
    .catch(err => {
      console.log(err)
    })
  } 

  const loginHandler = (cred) =>{
    try {
      axios.post("http://localhost:3306/employee/login", cred)
      .then(res =>{
      if(res.data.token != null){
          localStorage.setItem("token", res.data.token);
          let user = jwt_decode(res.data.token);
          setIsAuth(true);
          getUser(user.user.id);
        }
      })
      .catch(error => {
        toast.error(error.response.data.error)
      })
    
    } catch (error) {
      toast.error(error)

    }
    }

    const onLogoutHandler = (e) => {
      e.preventDefault();
      localStorage.removeItem("token");
      setIsAuth(false);
      setUser(null);
      toast('You are logged out successfully!',{
        position: "top-right"
      })
      window.location.replace("/login")
    }

  return (
    <Router>
    <div className="App">
    <div>{isAuth ? <Navbar onLogoutHandler={onLogoutHandler} user={user} isAuth={isAuth}></Navbar> : null}</div>
      <Routes>
        <Route path="/" element={isAuth? <Homepage user={user}/> : <Login login={loginHandler}/>} />
        <Route path="/login" element={isAuth? <Homepage user={user}/> : <Login login={loginHandler}/>} />
        <Route path="/request/new" element={isAuth? <NewRequest user={user}/> : <Login login={loginHandler}/>} />        
        <Route path="/request/:id" element={<ViewRequest/>} />        
      </Routes>
      <ToastContainer />
    </div>
  </Router>
  );
}

export default App;
