import React from 'react';
import { startLogout }  from './components/auth/loginAcciones';
//import {firebase} from './firebase/firebase-config';
//import  ScrollToTop  from '../src/ScrollToTop';
import {useDispatch} from 'react-redux';
import { Link  } from 'react-router-dom';
//import { Login } from './components/auth/Login';
export const AppTopbar = (props) => {
    //const history = useHistory();

    const dispatch = useDispatch();
    //const uid = useSelector(state => state.login);

    const handleLogout = () =>{
       
        //return alert('handleLogout');
        //<ScrollToTop children="/login" />
        dispatch (startLogout());
      
        //return <Route path="/login" exact component={ Login } />
        //window.location.href = '/login';
        //this.props.history.push('/login');
//        alert('Antes de redireccionar');
         //return <Redirect to="/crud" />
        //return (<Link to="/login" />);
    }
    
  
    return (


        <div className="layout-topbar clearfix">
            <button type="button" className="p-link layout-menu-button" onClick={props.onToggleMenu}>
           
                <span className="pi pi-bars" />
            </button>
            <span style={{marginLeft:"10px",fontSize:"25px",color:"white"}} >Sistema Administración de Colegios</span>            
            <div className="layout-topbar-icons">
             <Link onClick={ handleLogout } to="/login" style={{color:"white", fontSize:"15px",fontWeight:"bold"}} >Salir</Link> 
               
                
                <button type="button" className="p-link">
                    {/*<span className="layout-topbar-item-text">User</span> */}
                    <span className="layout-topbar-icon pi pi-user" />
                </button>
            </div>
        </div>
    );
}
