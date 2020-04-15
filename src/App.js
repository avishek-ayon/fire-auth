import React, { useState } from 'react';
import logo from './logo.svg';
import './App.css';
import * as firebase from "firebase/app";
import "firebase/auth";
import firebaseConfig from './firebase.config';

firebase.initializeApp(firebaseConfig);




function App() {

const[user,setUser]=useState({
  isSignedIn:false,
  name:'',
  email:'',
  photo:''

})


  const provider = new firebase.auth.GoogleAuthProvider();
  const handleSignIn=()=>{
    firebase.auth().signInWithPopup(provider)
    .then(res=>{
      const {displayName,email,photoURL}=res.user;
      const signedInUser={
        isSignedIn:true,
        name:displayName,
        email:email,
        photo:photoURL
      }
      setUser(signedInUser);
      console.log(email,displayName,photoURL);
    })
    //console.log("joy ram takur")
    .catch(err=>{
      console.log(err);
      console.log(err.message);
    })
  }
  const handleSignOut=()=>{
    firebase.auth().signOut()
    .then(res=>{
      const signedOutUser={
        isSignedIn:false,
        name:'',
        email:'',
        photo:'',
        password:'',
        error:'',
        isValid:false,
        existingUser:false
      }
      setUser(signedOutUser);

    })
    .catch(err=>{

    })
  
 
    //console.log("signout");
  }
  const is_valid_email = email => /(.+)@(.+){2,}\.(.+){2,}/.test(email); 
  const hasNumber=input =>  /\d/.test(input);
  const switchForm=event=>{
    const createUser={...user};
    createUser.existingUser=event.target.checked;
    setUser(createUser);
    //console.log(event.target.checked);
  }
  const handleChange= event =>{
    const newUserInfo={
      ...user
    
    };
    //debugger;

    //perform validation
    let isValid=true;
    if(event.target.name ==='email')
    {
      isValid=is_valid_email(event.target.value);
    }
    if(event.target.name ==='password')
    {
      isValid=event.target.value.length>8 && hasNumber(event.target.value);
    }
    newUserInfo[event.target.name]=event.target.value;
    newUserInfo.isValid=isValid;
    setUser(newUserInfo);
    //console.log(newUserInfo);
    //console.log(event.target.name,event.target.value);
  }
  const createAccount=(eventBubble)=>
  {
    if(user.isValid){
    firebase.auth().createUserWithEmailAndPassword(user.email,user.password)
    .then(res=>{
      console.log(res);
      const createUser={...user};
      createUser.isSignedIn=true;
      createUser.error='';
      setUser(createUser);
    }) 
    .catch(err=>{
      console.log(err.message);
      const createUser={...user};
      createUser.isSignedIn=false;
      createUser.error=err.message;
      setUser(createUser);
    })
    //console.log(user.email,user.password)
    }
    else
    {
      console.log("form is not valid",user);
    }
    eventBubble.preventDefault();
    eventBubble.target.reset();
  }
    const signInUser=eventBubble=>{
      
      if(user.isValid){
        firebase.auth().signInWithEmailAndPassword(user.email,user.password)
        .then(res=>{
          console.log(res);
          const createUser={...user};
          createUser.isSignedIn=true;
          createUser.error='';
          setUser(createUser);
        }) 
        .catch(err=>{
          console.log(err.message);
          const createUser={...user};
          createUser.isSignedIn=false;
          createUser.error=err.message;
          setUser(createUser);
        })
        //console.log(user.email,user.password)
        }


      eventBubble.preventDefault();
      eventBubble.target.reset();
    }

  

  return (
    <div className="App">
      {user.isSignedIn ? <button onClick={handleSignOut}>Sign Out</button> 
      :<button onClick={handleSignIn}>Sign In</button>}
      {
        user.isSignedIn && 
        <div>
        <p>Welcome {user.name}</p>
        <p>mail {user.email}</p>
        <img src={user.photo}  alt=""/>
        </div>
      }
      
      <h1>Our Own Authentication:</h1>
      <input type="checkbox" name="swithForm" onChange={switchForm} id="switchForm"/>
      <label htmlFor="switchForm">Returning user</label>
      <form style={{display:user.existingUser ? 'block' : 'none'}} onSubmit ={signInUser}>
        <input type="text" onBlur={handleChange} name="email" placeholder="your email" required/>
        <br/>
        <input type ="password" onBlur={handleChange} name="password" placeholder="your password" required/>
        <br/>
        <input type="submit" value="SignIn"/>
      </form>


      <form style={{display:user.existingUser ? 'none' : 'block'}} onSubmit ={createAccount}>
        <input type="text" onBlur={handleChange} name="name" placeholder="your name" required/>
        <br/>
        <input type="text" onBlur={handleChange} name="email" placeholder="your email" required/>
        <br/>
        <input type ="password" onBlur={handleChange} name="password" placeholder="your password" required/>
        <br/>
        <input type="submit" value="Create Account"/>
      </form>
      {
        user.error && <p style={{color:'red'}}>{user.error}</p>
      }

    </div>
  );
}

export default App;
