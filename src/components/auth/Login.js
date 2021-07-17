import React from 'react'
import ReactDOM from 'react-dom';
import Swal from 'sweetalert2'
import { useDispatch, useSelector } from 'react-redux';
import { InputText } from 'primereact/inputtext';
import { Panel } from 'primereact/panel';
import { Password } from 'primereact/password';
import { Button } from 'primereact/button';
import { Link  } from 'react-router-dom';
import validator from 'validator';
import {  signWithEmailPassword, startGoogleLogin   } from './loginAcciones'

import 'primeflex/primeflex.css';
import { useForm } from '../../hooks/useForm';
//import { Dashboard } from '../Dashboard';
//import { Crud } from '../../pages/Crud';
//import { PrivateRoute } from './PrivateRoute';
//import { PublicRoute } from './PublicRoute';
//import { Register } from './Register';

export const Login = () => {

	const [formValues, setValues, handleInputChange, reset ] = useForm({
		email:'',
		clave:''
	});
	
	
	const {email, clave} = formValues;


	//const { register, handleSubmit, formState: { errors } } = useForm();

	const dispatch = useDispatch();
//    const {loading, msgError} = useSelector(state => state.ui);
	const { isConnected, name } = useSelector(state => state.login);
	

	const handleLogin = (e) => {
        
		e.preventDefault();
		if (!isFormValid()){
			return false;
		}

		try{
		  
		  dispatch( signWithEmailPassword(email, clave, name) );
		}catch(error){
			Swal.fire('Error', 'Usuario o Password incorrecto', 'error');
		}
		//<PrivateRoute path="/" exact component={Dashboard}  isAuthenticated = {  isConnected } />
		//<PublicRoute path="/register" exact component={ Register }  />
	}

	const handleGoogleLogin = () =>{
		dispatch( startGoogleLogin() );
	}


	const isFormValid = () =>{
		   
		if (email.trim().length === 0 ){
			Swal.fire('Error', 'El email es obligatorio', 'error');
			return false;
		} else if ( !validator.isEmail(email) ){
			Swal.fire('Error', 'Email no valido','error');
			return false;
		} else if (clave.trim().length === 0 | clave === null) {
			Swal.fire('Error', 'Password es obligatorio','error');
			return false;
		}
		//dispatch (removeError());
		return true;
	}
	
	return (
		<>
			<form>
				<div className="p-fluid" style={{width:"25%", margin:"0 auto", marginTop:"250px"}}>

					<Panel header="Conexión al Sistema" >

						{/*   msgError &&
							(	
								<div className="auth__alert-error textCenter">
										<p> Esperando......</p>
								</div>
							)
							*/}	
						<div className="p-field">
							<label htmlFor="email">Email</label>
							<InputText 
							id="email" 
							name="email"
							value={email}
							onChange={ handleInputChange }
							//autoComplete="off"
							/>
						</div>
						<div className="p-field">
							<label htmlFor="clave">Clave</label>
							<Password 
							id="clave" 
							name="clave"
							value={ clave }
							onChange = { handleInputChange }
							autoComplete="off"
							/>
						</div>

						<div style={{
							display:"flex",
							margin:"2"
						}}>

						<Button id="btnLogin" label="Conectar" onClick={ handleLogin } style={{ width:"45%" }} >
								<span className="layout-topbar-icon 	pi pi-user" > </span>
						</Button>

						<Link to ='/register' style={{ width:"45%",marginLeft:"10%" }} >
								<Button id="btnRegistrar" label="Registrar">
								    <span className="layout-topbar-icon pi pi-user" > </span>
								</Button>
						</Link>

							

						</div>

						<br/>						
						<Button  onClick={ handleGoogleLogin } className="p-button-success" label="Conectar con Gmail" >
						  <span className="layout-topbar-icon pi pi-user"> </span>
						</Button>

					</Panel>				


				</div>
			</form>			
		</>
	)
}
