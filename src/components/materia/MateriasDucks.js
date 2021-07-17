import moment from "moment";
import { db } from "../../firebase/firebase-config";


// Consts  
const initialState = {
	materias : [],

	materia_actual : {
		descripcion:'',
		id:0,
		usrcre:'usrcre',
		feccre: '',
		usrmod:'usrmod',
		fecmod: ''
	}
}





// Types
const MATERIA_ADD = 'MATERIA_ADD';
const MATERIA_SAVE = 'MATERIA_SAVE';
const MATERIA_DELETE = 'MATERIA_DELETE';
const MATERIA_LIST  = 'MATERIA_LIST';
const MATERIA_EDIT  = 'MATERIA_EDIT';
const UPDATE_MATERIA_ACTUAL = 'UPDATE_MATERIA_ACTUAL';

// Reducers
export const materiasReducer = (state = initialState, action) =>{
 
	switch (action.type) {
		case MATERIA_ADD:
            return {...state, 
				    materias: [...action.payload]
			}
				   
		case MATERIA_SAVE:
				return {
					...state, materia_actual: action.payload
				}								
		case MATERIA_DELETE:
				return	{...state,	
					     materias: [...action.payload]	
				} 
			

		case MATERIA_EDIT:
			return {...state,materia_actual : action.payload
			}											

		case MATERIA_LIST:
			return {...state,materias: action.payload
		}											
		case UPDATE_MATERIA_ACTUAL:
			return {...state,materia_actual: action.payload
		}											
	
		default:
			return state;
	}
}



// Actions
export const addMateriaAction =  () =>{
	return async (dispatch, getState) =>{
		
		const { uid } = getState().login;

		const { materia_actual, materias } = getState().materia;
		

		delete materia_actual['id'];

		materia_actual.feccre = moment(new Date()).format("DD/MM/YYYY h:mm:ss a"); 
		materia_actual.fecmod = moment(new Date()).format("DD/MM/YYYY h:mm:ss a"); 
		
		try{	
			const docRef = await db.collection(`${uid}/colegiodb/materias`).add(materia_actual);
			const {id} = docRef;
			materia_actual.id = id;
		}
		catch(error){
			console.log(error);
	   }

	   let vmaterias = [...materias,materia_actual];
	   dispatch({
		type:MATERIA_ADD,
		payload: vmaterias
	   })
	}

}


export const listarMateriaAction = (uid) => async (dispatch, getState) =>{

	    let vmaterias = [];    
		try{
			   const materiasSnap = await db.collection(`${uid}/colegiodb/materias`).get();

			   materiasSnap.forEach((datos) => {

			   		vmaterias = [...vmaterias, {
                               ...datos.data(),
  						       id:datos.id
					}];

				});	
				
		}
		catch(error){
			   console.log(error);
		}

		dispatch({
			type:MATERIA_LIST,
			payload: vmaterias
  		});

}




export const deleteMateriaAction = () => {
	return async (dispatch, getState) =>{
        
		const uid = getState().login.uid;
		const {materia_actual, materias} = getState().materia;

		let vmaterias = [];
		try{
			await db.doc(`${uid}/colegiodb/materias/${materia_actual.id}`).delete();
			vmaterias = materias.filter(materia => materia.id !== materia_actual.id);
		}catch(error){
			console.log(error);
		}
		
		dispatch({
			type:MATERIA_DELETE,
			payload: vmaterias
	    });
		
	}
}

export const updateMateriaAction = () =>async (dispatch, getState) => {
   const {materias, materia_actual} = getState().materia;

   let { uid } = getState().login;

   try {
	   
       const _id = materia_actual.id;
	   delete materia_actual.id;
	   materia_actual.fecmod = moment(new Date()).format("DD/MM/YYYY h:mm:ss a"); 

	   await db.doc(`${uid}/colegiodb/materias/${_id}`).update(materia_actual);
	   materia_actual.id = _id;

	   materias.map(materia =>{

		   if (materia.id === _id){
			materia.descripcion = materia_actual.descripcion;
			materia.fecmod = materia_actual.fecmod;
		   }else{
			materia = materia;
		   }
		   return null;
	   })


	   dispatch({
		type:MATERIA_LIST,
		payload: materias
	   })

   } catch (error) {
	   console.log('Ocurrio un error al actualizar : ' + error);

   }

}

export const updateMateriaActual  = (materia_actual) =>({
	type:'UPDATE_MATERIA_ACTUAL',
	payload: materia_actual
})

