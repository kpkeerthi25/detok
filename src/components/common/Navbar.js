import React from "react";
import { useSelector } from "react-redux";

const CustomNavbar = (props) => {
    const isAuthenticated = useSelector((state)=>state.counter.isAuthenticated);
    const user = useSelector((state)=>state.counter.address);
    return (
<nav class="navbar navbar-light bg-light">
  <div class="container-fluid">
      
    <a class="navbar-brand " href="#">
      {/* <img src="/docs/5.1/assets/brand/bootstrap-logo.svg" alt="" width="30" height="24" class="d-inline-block align-text-top" /> */}
       DETOK
    </a>
    <form class="d-flex">
        {

           !isAuthenticated && <button class="btn btn-primary" type="button" onClick={()=>{props.login();console.log(isAuthenticated)}}>Connect Wallet</button>
           
        }
        {
            user && <p style={{paddingTop:"3%", paddingRight:"10px", fontFamily:"sans-serif" , color:"green"}}>{user}</p>
        }
         {
            
            isAuthenticated && <button class="btn btn-danger" type="button" onClick={()=>props.logout()}>Logout</button>
        }
        
      </form>
  </div>
  

</nav>
    )
    
}

export default CustomNavbar;