import moment from "moment";
import { db } from "../../firebase/firebase-config";


// Consts  
const initialState = {
	tipos_empleado : [],

	tipo_empleado_actual : {
		des_tipo_empleado:'',
		id:0,
		usrcre:'usrcre',
		feccre: '',
		usrmod:'usrmod',
		fecmod: ''
	}
}





// Types
const TIPO_EMPLEADO_ADD = 'TIPO_EMPLEADO_ADD';
const TIPO_EMPLEADO_SAVE = 'TIPO_EMPLEADO_SAVE';
const TIPO_EMPLEADO_DELETE = 'TIPO_EMPLEADO_DELETE';
const TIPO_EMPLEADO_LIST  = 'TIPO_EMPLEADO_LIST';
const TIPO_EMPLEADO_EDIT  = 'TIPO_EMPLEADO_EDIT';
const UPDATE_TIPO_EMPLEADO_ACTUAL = 'UPDATE_TIPO_EMPLEADO_ACTUAL';

// Reducers
export const tipoEmpleadoReducer = (state = initialState, action) =>{

	switch (action.type) {
		case TIPO_EMPLEADO_ADD:
            return {...state, 
				    tipos_empleado: [...action.payload]
			}
				   
		case TIPO_EMPLEADO_SAVE:
				return {
					...state, tipo_empleado_actual: action.payload
				}								
		case TIPO_EMPLEADO_DELETE:
				return	{...state,	
					     tipos_empleado: [...action.payload]	
				} 
			

		case TIPO_EMPLEADO_EDIT:
			return {...state,tipo_empleado_actual : action.payload
			}											

		case TIPO_EMPLEADO_LIST:
			return {...state,tipos_empleado: action.payload
		}											
		case UPDATE_TIPO_EMPLEADO_ACTUAL:
			return {...state,tipo_empleado_actual: action.payload
		}											
	
		default:
			return state;
	}
}



// Actions
export const addTipoEmpleadoAction =  () =>{
	return async (dispatch, getState) =>{
		
		const { uid } = getState().login;

		const { tipo_empleado_actual, tipos_empleado } = getState().tipo_empleado;
		

		delete tipo_empleado_actual['id'];

		tipo_empleado_actual.feccre = moment(new Date()).format("DD/MM/YYYY h:mm:ss a"); 
		tipo_empleado_actual.fecmod = moment(new Date()).format("DD/MM/YYYY h:mm:ss a"); 

		try{	
			const docRef = await db.collection(`${uid}/colegiodb/tipos_empleado`).add(tipo_empleado_actual);
			const {id} = docRef;
			tipo_empleado_actual.id = id;
		}
		catch(error){
			console.log(error);
	   }

	   let vtipos_empleado = [...tipos_empleado,tipo_empleado_actual];
	   dispatch({
		type:TIPO_EMPLEADO_ADD,
		payload: vtipos_empleado
	   })
	}

}


export const listarTiposEmpleadoAction = (uid) => async (dispatch, getState) =>{
	 
			try{
			   const tiposEmpleadoSnap = await db.collection(`${uid}/colegiodb/tipos_empleado`).get();
			   const tipos_empleado = [];
               //console.log(tipos_empleado);
			   //console.log(tiposEmpleadoSnap);

			   tiposEmpleadoSnap.forEach((datos) => {


				  // const fecha = datos.data().feccre;

				   tipos_empleado.push({
					   ...datos.data(),
					   id: datos.id

				   });
				});
		
			dispatch({
					  type:TIPO_EMPLEADO_LIST,
					  payload: tipos_empleado
				});
		  }
		  catch(error){
			   console.log(error);
		  }

}




export const deleteTipoEmpleadoAction = (_id) => {
	return async (dispatch, getState) =>{
        
		const uid = getState().login.uid;
		const tipos_empleado = getState().tipo_empleado.tipos_empleado;
		let vtipos_empleado = [];
		try{
			await db.doc(`${uid}/colegiodb/tipos_empleado/${_id}`).delete();
			vtipos_empleado = tipos_empleado.filter(tip_emp => tip_emp.id !== _id);
		}catch(error){
			console.log(error);
		}
		
		dispatch({
			type:TIPO_EMPLEADO_DELETE,
			payload: vtipos_empleado
	    });
		
	}
}

export const updateTipoEmpleadoAction = () =>async (dispatch, getState) => {
   const {tipos_empleado, tipo_empleado_actual} = getState().tipo_empleado;

   let { uid } = getState().login;

   try {
	   
       const _id = tipo_empleado_actual.id;
	   delete tipo_empleado_actual.id;
	   tipo_empleado_actual.fecmod = moment(new Date()).format("DD/MM/YYYY h:mm:ss a"); 
	   await db.doc(`${uid}/colegiodb/tipos_empleado/${_id}`).update(tipo_empleado_actual);
	   tipo_empleado_actual.id = _id;

	   tipos_empleado.map(tip_emp =>{
		   if (tip_emp.id === _id){
			tip_emp.des_tipo_empleado = tipo_empleado_actual.des_tipo_empleado;
			tip_emp.usrmod = tipo_empleado_actual.usrmod;
			tip_emp.fecmod = tipo_empleado_actual.fecmod;
		   }
		   return null;
	   })


	   dispatch({
		type:TIPO_EMPLEADO_LIST,
		payload: tipos_empleado
	   })

   } catch (error) {
	   console.log('Ocurrio un error al actualizar : ' + error);

   }

}

export const updateTipoEmpleadoActual  = (tipo_empleado_actual) =>({
	type:'UPDATE_TIPO_EMPLEADO_ACTUAL',
	payload: tipo_empleado_actual
})