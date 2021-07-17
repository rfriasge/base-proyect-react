import moment from "moment";
import { db } from "../../firebase/firebase-config";


// Consts  
const initialState = {
	horarios : [],

	horario_actual : {
		descripcion:'',
		id:0,
		usrcre:'usrcre',
		feccre: '',
		usrmod:'usrmod',
		fecmod: ''
	}
}





// Types
const HORARIO_ADD = 'HORARIO_ADD';
const HORARIO_SAVE = 'HORARIO_SAVE';
const HORARIO_DELETE = 'HORARIO_DELETE';
const HORARIO_LIST  = 'HORARIO_LIST';
const HORARIO_EDIT  = 'HORARIO_EDIT';
const UPDATE_HORARIO_ACTUAL = 'UPDATE_HORARIO_ACTUAL';

// Reducers
export const horariosReducer = (state = initialState, action) =>{
 
	switch (action.type) {
		case HORARIO_ADD:
            return {...state, 
				    horarios: [...action.payload]
			}
				   
		case HORARIO_SAVE:
				return {
					...state, horario_actual: action.payload
				}								
		case HORARIO_DELETE:
				return	{...state,	
					     horarios: [...action.payload]	
				} 
			

		case HORARIO_EDIT:
			return {...state,horario_actual : action.payload
			}											

		case HORARIO_LIST:
			return {...state,horarios: action.payload
		}											
		case UPDATE_HORARIO_ACTUAL:
			return {...state,horario_actual: action.payload
		}											
	
		default:
			return state;
	}
}



// Actions
export const addHorarioAction =  () =>{
	return async (dispatch, getState) =>{
		
		const { uid } = getState().login;

		const { horario_actual, horarios } = getState().horario;
		

		delete horario_actual['id'];

		horario_actual.feccre = moment(new Date()).format("DD/MM/YYYY h:mm:ss a"); 
		horario_actual.fecmod = moment(new Date()).format("DD/MM/YYYY h:mm:ss a"); 
		
		try{	
			const docRef = await db.collection(`${uid}/colegiodb/horarios`).add(horario_actual);
			const {id} = docRef;
			horario_actual.id = id;
		}
		catch(error){
			console.log(error);
	   }

	   let vhorarios = [...horarios,horario_actual];
	   dispatch({
		type:HORARIO_ADD,
		payload: vhorarios
	   })
	}

}


export const listarHorarioAction = (uid) => async (dispatch, getState) =>{

	    let vhorarios = [];    
		try{
			   const horariosSnap = await db.collection(`${uid}/colegiodb/horarios`).get();

			   horariosSnap.forEach((datos) => {

			   		vhorarios = [...vhorarios, {
                               ...datos.data(),
  						       id:datos.id
					}];

				});	
				
		}
		catch(error){
			   console.log(error);
		}

		dispatch({
			type:HORARIO_LIST,
			payload: vhorarios
  		});

}




export const deleteHorarioAction = () => {
	return async (dispatch, getState) =>{
        
		const uid = getState().login.uid;
		const {horario_actual, horarios} = getState().horario;

		let vhorarios = [];
		try{
			await db.doc(`${uid}/colegiodb/horarios/${horario_actual.id}`).delete();
			vhorarios = horarios.filter(horario => horario.id !== horario_actual.id);
		}catch(error){
			console.log(error);
		}
		
		dispatch({
			type:HORARIO_DELETE,
			payload: vhorarios
	    });
		
	}
}

export const updateHorarioAction = () =>async (dispatch, getState) => {
   const {horarios, horario_actual} = getState().horario;

   let { uid } = getState().login;

   try {
	   
       const _id = horario_actual.id;
	   delete horario_actual.id;
	   horario_actual.fecmod = moment(new Date()).format("DD/MM/YYYY h:mm:ss a"); 

	   await db.doc(`${uid}/colegiodb/horarios/${_id}`).update(horario_actual);
	   horario_actual.id = _id;

	   horarios.map(horario =>{

		   if (horario.id === _id){
			horario.descripcion = horario_actual.descripcion;
			horario.fecmod = horario_actual.fecmod;
		   }else{
			horario = horario;
		   }
		   return null;
	   })


	   dispatch({
		type:HORARIO_LIST,
		payload: horarios
	   })

   } catch (error) {
	   console.log('Ocurrio un error al actualizar : ' + error);

   }

}

export const updateHorarioActual  = (horario_actual) =>({
	type:'UPDATE_HORARIO_ACTUAL',
	payload: horario_actual
})

