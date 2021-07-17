import moment from "moment";
import { db } from "../../firebase/firebase-config";


// Consts  
const initialState = {
	departamentos : [],

	departamento_actual : {
		nombre_departamento:'',
		id:0,
		usrcre:'usrcre',
		feccre: '',
		usrmod:'usrmod',
		fecmod: ''
	}

}





// Types
const DEPARTAMENTO_ADD = 'DEPARTAMENTO_ADD';
const DEPARTAMENTO_SAVE = 'DEPARTAMENTO_SAVE';
const DEPARTAMENTO_DELETE = 'DEPARTAMENTO_DELETE';
const DEPARTAMENTO_LIST  = 'DEPARTAMENTO_LIST';
const DEPARTAMENTO_EDIT  = 'DEPARTAMENTO_EDIT';
const UPDATE_DEPARTAMENTO_ACTUAL = 'UPDATE_DEPARTAMENTO_ACTUAL';


// Reducers
export const departamentoReducer = (state = initialState, action) =>{

	switch (action.type) {
		case DEPARTAMENTO_ADD:
            return {...state, 
				    departamentos: [...action.payload]
			}
				   
		case DEPARTAMENTO_SAVE:
				return {
					...state, departamento_actual: action.payload
				}								
		case DEPARTAMENTO_DELETE:
				return	{...state,	
					     departamentos: [...action.payload]	
				} 
			

		case DEPARTAMENTO_EDIT:
			return {...state,departamento_actual : action.payload
			}											

		case DEPARTAMENTO_LIST:
			return {...state,departamentos: action.payload
		}											
		case UPDATE_DEPARTAMENTO_ACTUAL:
			return {...state,departamento_actual: action.payload
		}											
	
		default:
			return state;
	}
}



// Actions

const FormatDate =(fecha) =>{
	return moment(fecha).format("DD/MM/YYYY h:mm:ss a"); 
}

export const editDepartamento = (departamento) => (dispatch) => {
	alert(JSON.stringify(departamento));
	dispatch({
		type:DEPARTAMENTO_EDIT,
		payload: departamento
	   })
}

export const addDepartamentoAction =  (pdepartamento_actual) =>{
	return async (dispatch, getState) =>{
		


		dispatch( updateDepartamentoActual(pdepartamento_actual));
		const { uid } = getState().login;
		const { departamento_actual, departamentos } = getState().departamento;
		delete departamento_actual['id'];

		departamento_actual.feccre = moment(new Date()).format("DD/MM/YYYY h:mm:ss a"); 
		departamento_actual.fecmod = moment(new Date()).format("DD/MM/YYYY h:mm:ss a"); 

		try{	
			const docRef = await db.collection(`${uid}/colegiodb/departamentos`).add(departamento_actual);
			const {id} = docRef;
			departamento_actual.id = id;
		}
		catch(error){
			console.log(error);
	   }

	   let vdepartamentos = [...departamentos,departamento_actual];
	   dispatch({
		type:DEPARTAMENTO_ADD,
		payload: vdepartamentos
	   })
	}

}


export const listarDepartamentosAction = (uid) => async (dispatch, getState) =>{
	 
			try{
			   const departamentosSnap = await db.collection(`${uid}/colegiodb/departamentos`).get();
			   const departamentos = [];


			   departamentosSnap.forEach((datos) => {


				   const fecha = datos.data().feccre;

				   departamentos.push({
					   ...datos.data(),
					   id: datos.id

				   });
				});
		
			dispatch({
					  type:DEPARTAMENTO_LIST,
					  payload: departamentos
				});
		  }
		  catch(error){
			   console.log(error);
		  }

}




export const deleteDepartamentoAction = (_id) => {
	return async (dispatch, getState) =>{
        
		const uid = getState().login.uid;
		const departamentos = getState().departamento.departamentos;
		let vdepartamentos = [];
		try{
			await db.doc(`${uid}/colegiodb/departamentos/${_id}`).delete();
			vdepartamentos = departamentos.filter(departamento => departamento.id !== _id);
		}catch(error){
			console.log(error);
		}
		
		dispatch({
			type:DEPARTAMENTO_DELETE,
			payload: vdepartamentos
	    });
		
	}
}

export const updateDepartamentoAction = (vdepartamento) =>async (dispatch, getState) => {
   const departamentos = getState().departamento.departamentos;

   const vdepartamento_actual   = vdepartamento;
   let { uid } = getState().login;

   try {
	   
       const _id = vdepartamento_actual.id;
	   delete vdepartamento_actual.id;
	   vdepartamento_actual.fecmod = moment(new Date()).format("DD/MM/YYYY h:mm:ss a"); 
	   await db.doc(`${uid}/colegiodb/departamentos/${_id}`).update(vdepartamento_actual);
	   
	   departamentos.map(departamento =>{
		   if (departamento.id === _id){
			   departamento.nombre_departamento = vdepartamento_actual.nombre_departamento;
			   departamento.usrmod = vdepartamento_actual.usrmod;
			   departamento.fecmod = vdepartamento_actual.fecmod;
		   }
	   })


	   dispatch({
		type:DEPARTAMENTO_LIST,
		payload: departamentos
	   })

   } catch (error) {
	   console.log('Ocurrio un error al actualizar : ' + error);

   }

}

export const updateDepartamentoActual  = (departamento_actual) =>({
	type:'UPDATE_DEPARTAMENTO_ACTUAL',
	payload: departamento_actual
})