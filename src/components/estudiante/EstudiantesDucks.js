import moment from "moment";
import { db } from "../../firebase/firebase-config";


// Consts  
const initialState = {
	estudiantes : [],
	estudiante_actual : {
		id:'',
		nombres:'',
		apellidos:'',
		direccion:'',
		telefono_residencial:'',
		celular:'',
		cedula:'',
		fecha_nacimiento:'',
		nombre_padre:'',
		celular_padre:'',
		telefono_residencia_padre:'',
		telefono_oficina_padre:'',
		nombre_madre:'',
		celular_madre:'',
		telefono_residencia_madre:'',		
		telefono_oficina_madre:'',
		observacion:'',
		estado:'1',
		fecha_egreso:'',
		fecha_ingreso:'',
		grado_inicial:'',
		persona_emergencia:'',
		telefono_emergencia:'',		
		usrcre:'usrcre',
		feccre: '',
		usrmod:'usrmod',
		fecmod: ''
	},
	estados:[
		{label: 'Activo', value: '1'},
		{label: 'Inactivo', value: '2'},
	]
}





// Types
const ESTUDIANTE_ADD = 'ESTUDIANTE_ADD';
const ESTUDIANTE_SAVE = 'ESTUDIANTE_SAVE';
const ESTUDIANTE_DELETE = 'ESTUDIANTE_DELETE';
const ESTUDIANTE_LIST  = 'ESTUDIANTE_LIST';
const ESTUDIANTE_EDIT  = 'ESTUDIANTE_EDIT';
const UPDATE_ESTUDIANTE_ACTUAL = 'UPDATE_ESTUDIANTE_ACTUAL';

// Reducers
export const estudiantesReducer = (state = initialState, action) =>{
 
	switch (action.type) {
		case ESTUDIANTE_ADD:
            return {...state, 
				    estudiantes: [...action.payload]
			}
				   
		case ESTUDIANTE_SAVE:
				return {
					...state, estudiante_actual: action.payload
				}								
		case ESTUDIANTE_DELETE:
				return	{...state,	
					     estudiantes: [...action.payload]	
				} 
			

		case ESTUDIANTE_EDIT:
			return {...state,estudiante_actual : action.payload
			}											

		case ESTUDIANTE_LIST:
			return {...state,estudiantes: action.payload
		}											
		case UPDATE_ESTUDIANTE_ACTUAL:
			return {...state,estudiante_actual: action.payload
		}											
	
		default:
			return state;
	}
}



// Actions
export const addEstudianteAction =  () =>{
	return async (dispatch, getState) =>{
		
		const { uid } = getState().login;

		const { estudiante_actual, estudiantes } = getState().estudiante;
		

		delete estudiante_actual['id'];

		estudiante_actual.feccre = moment(new Date()).format("DD/MM/YYYY h:mm:ss a"); 
		estudiante_actual.fecmod = moment(new Date()).format("DD/MM/YYYY h:mm:ss a"); 
		
		try{	
			const docRef = await db.collection(`${uid}/colegiodb/estudiantes`).add(estudiante_actual);
			const {id} = docRef;
			estudiante_actual.id = id;
		}
		catch(error){
			console.log(error);
	   }

	   let vestudiantes = [...estudiantes,estudiante_actual];
	   dispatch({
		type:ESTUDIANTE_ADD,
		payload: vestudiantes
	   })
	}

}


export const listarEstudianteAction = (uid) => async (dispatch, getState) =>{

	    let vestudiantes = [];    
		try{
			   const estudiantesSnap = await db.collection(`${uid}/colegiodb/estudiantes`).get();

			   estudiantesSnap.forEach((datos) => {

			   		vestudiantes = [...vestudiantes, {
                               ...datos.data(),
							   //cargo:datos.cargo,
							   //:datos.datos.departamento,
							   //cargo:datos.datos.tipo_estudiante,
  						       id:datos.id
					}];

				});	
				
		}
		catch(error){
			   console.log(error);
		}

		dispatch({
			type:ESTUDIANTE_LIST,
			payload: vestudiantes
  		});

}




export const deleteEstudianteAction = () => {
	return async (dispatch, getState) =>{
        
		const uid = getState().login.uid;
		const {estudiante_actual, estudiantes} = getState().estudiante;

		let vestudiantes = [];
		try{
			await db.doc(`${uid}/colegiodb/estudiantes/${estudiante_actual.id}`).delete();
			vestudiantes = estudiantes.filter(estudiante => estudiante.id !== estudiante_actual.id);
		}catch(error){
			console.log(error);
		}
		
		dispatch({
			type:ESTUDIANTE_DELETE,
			payload: vestudiantes
	    });
		
	}
}

export const updateEstudianteAction = () =>async (dispatch, getState) => {
   const {estudiantes, estudiante_actual} = getState().estudiante;

   let { uid } = getState().login;

   try {
	   
       const _id = estudiante_actual.id;
	   delete estudiante_actual.id;
	   estudiante_actual.fecmod = moment(new Date()).format("DD/MM/YYYY h:mm:ss a"); 

	   await db.doc(`${uid}/colegiodb/estudiantes/${_id}`).update(estudiante_actual);
	   estudiante_actual.id = _id;

	   estudiantes.map(est =>{

		   if (est.id === _id){
			est.nombres = estudiante_actual.nombres
			est.apellidos = estudiante_actual.apellidos;
			est.direccion = estudiante_actual.direccion;
			est.telefono_residencial = estudiante_actual.telefono_residencial;
			est.celular = estudiante_actual.celular;
			est.cedula = estudiante_actual.cedula;
			est.departamento = estudiante_actual.departamento;
			est.cargo = estudiante_actual.cargo;
			est.tipo_estudiante = estudiante_actual.tipo_estudiante;
			est.fecha_nacimiento = estudiante_actual.fecha_nacimiento;
			est.persona_emergencia = estudiante_actual.persona_emergencia;
			est.telefono_emergencia = estudiante_actual.telefono_emergencia;
			est.fecha_ingreso = estudiante_actual.fecha_ingreso;
			est.sueldo = estudiante_actual.sueldo;
			est.estado = estudiante_actual.estado;
            est.observacion =  estudiante_actual.observacion;
			est.usrcre = estudiante_actual.usrcre;
			est.feccre = estudiante_actual.feccre;
			est.usrmod = estudiante_actual.usrmod;
			est.fecmod = estudiante_actual.fecmod;
		   }
		   return null;
	   })
       
	   dispatch({
		type:ESTUDIANTE_LIST,
		payload: estudiantes
	   })

   } catch (error) {
	   console.log('Ocurrio un error al actualizar : ' + error);

   }

}

export const updateEstudianteActual  = (estudiante_actual) =>({
	type:'UPDATE_ESTUDIANTE_ACTUAL',
	payload: estudiante_actual
})

