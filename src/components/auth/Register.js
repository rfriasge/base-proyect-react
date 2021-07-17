import React from 'react'
import { useDispatch } from 'react-redux';
import { InputText } from 'primereact/inputtext';
import { Panel } from 'primereact/panel';
import { Password } from 'primereact/password';
import { Button } from 'primereact/button';
import { Link } from 'react-router-dom';
import validator from 'validator';
import Swal from 'sweetalert2'
import {   StartRegisterWithEmailPasswordName } from './loginAcciones'

import 'primeflex/primeflex.css';
import { useForm } from '../../hooks/useForm';



export const Register = () => {
	
	const dispatch = useDispatch();
    //const {loading, msgError} = useSelector(state => state.ui);

	const [formValue, setFormValue, handleInputChange, reset ] = useForm({
		name:'',
		email:'',
		clave:'',
		clave2:''
	});
	
	
	const {email, clave, clave2, name} = formValue;
  
	const handleRegister = (e) =>{
		e.preventDefault();
		
		if (isFormValid()){
			alert('Nombre a grabar : ' + name);
			dispatch( StartRegisterWithEmailPasswordName(email, clave, name) );
		}
	  }

	const isFormValid = () =>{



		if (name.trim().length === 0 ){
			Swal.fire('Error', 'El nombre es obligatorio', 'error');
			return false;
		} else if (email.trim().length === 0 ){
			Swal.fire('Error', 'El email es obligatorio', 'error');
			return false;
		} else if ( !validator.isEmail(email) ){
			Swal.fire('Error', 'Email no valido', 'error');
			return false;
		} else if (clave !== clave2 | clave.trim().length < 6 ) {
			Swal.fire('Error', 'Claves no coinsiden o clave es menor 6 caracteres', 'error');
			return false;
		}
		//dispatch (removeError());
		
		return true;
	}

	return (
		<>
			<form >
				<div className="p-fluid" style={{width:"25%", margin:"0 auto", marginTop:"250px"}}>

					<Panel header="Registrar Nuevo Usuario" >

						{/*   msgError &&
							(	
								<div className="auth__alert-error">
										<p>{ msgError }</p>
								</div>
							)
							*/}	


						<div className="p-field">
							<label htmlFor="name">Name</label>
							<InputText 
							name="name"
							value={name}
							onChange={ handleInputChange }
							/>
						</div>

						<div className="p-field">
							<label htmlFor="email">Email</label>
							<InputText 
							name="email"
							value={email}
							onChange={ handleInputChange }
							/>
						</div>

						<div className="p-field">
							<label htmlFor="clave">Clave</label>
							<Password 
							name="clave"
							value={ clave }
							onChange = { handleInputChange }
							/>
						</div>

						<div className="p-field">
							<label htmlFor="clave">Clave nuevamente</label>
							<Password 
							name="clave2"
							value={ clave2 }
							onChange = { handleInputChange }
							/>
						</div>


			 			<div style={{display:"flex"}}>

				
		 				<Button onClick={ handleRegister }  label="Registrar" icon="pi pi-user"
						 style={{ width:"49%" }}>
							
						</Button>
						

						<Link to ='/login'  style={{ width:"49%",marginLeft:"2%" }}  >
								<Button label="Login" icon="pi pi-user">
								  
								</Button>
						</Link>



						</div>												




					</Panel>				


				</div>
			</form>			
		</>
	)
}
