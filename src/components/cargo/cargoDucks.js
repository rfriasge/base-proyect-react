import moment from "moment";
import { db } from "../../firebase/firebase-config";


// Consts  
const initialState = {
	cargos : [],

	cargo_actual : {
		nombre_cargo:'',
		id:0,
		usrcre:'usrcre',
		feccre: '',
		usrmod:'usrmod',
		fecmod: ''
	}
}





// Types
const CARGO_ADD = 'CARGO_ADD';
const CARGO_SAVE = 'CARGO_SAVE';
const CARGO_DELETE = 'CARGO_DELETE';
const CARGO_LIST  = 'CARGO_LIST';
const CARGO_EDIT  = 'CARGO_EDIT';
const UPDATE_CARGO_ACTUAL = 'UPDATE_CARGO_ACTUAL';


// Reducers
export const cargoReducer = (state = initialState, action) =>{

	switch (action.type) {
		case CARGO_ADD:
            return {...state, 
				    cargos: [...action.payload]
			}
				   
		case CARGO_SAVE:
				return {
					...state, cargo_actual: action.payload
				}								
		case CARGO_DELETE:
				return	{...state,	
					     cargos: [...action.payload]	
				} 
			

		case CARGO_EDIT:
			return {...state,cargo_actual : action.payload
			}											

		case CARGO_LIST:
			return {...state,cargos: action.payload
		}											
		case UPDATE_CARGO_ACTUAL:
			return {...state,cargo_actual: action.payload
		}											
	
		default:
			return state;
	}
}



// Actions

const FormatDate =(fecha) =>{
	return moment(fecha).format("DD/MM/YYYY h:mm:ss a"); 
}

export const editCargo = (cargo) => (dispatch) => {
	alert(JSON.stringify(cargo));
	dispatch({
		type:CARGO_EDIT,
		payload: cargo
	   })
}

export const addCargoAction =  (pcargo_actual) =>{
	return async (dispatch, getState) =>{
		


		dispatch( updateCargoActual(pcargo_actual));
		const { uid } = getState().login;
		const { cargo_actual, cargos } = getState().cargo;
		delete cargo_actual['id'];

		cargo_actual.feccre = moment(new Date()).format("DD/MM/YYYY h:mm:ss a"); 
		cargo_actual.fecmod = moment(new Date()).format("DD/MM/YYYY h:mm:ss a"); 

		try{	
			const docRef = await db.collection(`${uid}/colegiodb/cargos`).add(cargo_actual);
			const {id} = docRef;
			cargo_actual.id = id;
		}
		catch(error){
			console.log(error);
	   }

	   let vcargos = [...cargos,cargo_actual];
	   dispatch({
		type:CARGO_ADD,
		payload: vcargos
	   })
	}

}


export const listarCargosAction = (uid) => async (dispatch, getState) =>{
	 
			try{
			   const cargosSnap = await db.collection(`${uid}/colegiodb/cargos`).get();
			   const cargos = [];


			   cargosSnap.forEach((datos) => {


				   const fecha = datos.data().feccre;

				   cargos.push({
					   ...datos.data(),
					   id: datos.id

				   });
				});
		
			dispatch({
					  type:CARGO_LIST,
					  payload: cargos
				});
		  }
		  catch(error){
			   console.log(error);
		  }

}




export const deleteCargoAction = (_id) => {
	return async (dispatch, getState) =>{
        
		const uid = getState().login.uid;
		const cargos = getState().cargo.cargos;
		let vcargos = [];
		try{
			await db.doc(`${uid}/colegiodb/cargos/${_id}`).delete();
			vcargos = cargos.filter(cargo => cargo.id !== _id);
		}catch(error){
			console.log(error);
		}
		
		dispatch({
			type:CARGO_DELETE,
			payload: vcargos
	    });
		
	}
}

export const updateCargoAction = (vcargo) =>async (dispatch, getState) => {
   const cargos = getState().cargo.cargos;

   const vcargo_actual   = vcargo;
   let { uid } = getState().login;

   try {
	   
       const _id = vcargo_actual.id;
	   delete vcargo_actual.id;
	   vcargo_actual.fecmod = moment(new Date()).format("DD/MM/YYYY h:mm:ss a"); 
	   await db.doc(`${uid}/colegiodb/cargos/${_id}`).update(vcargo_actual);
	   
	   cargos.map(cargo =>{
		   if (cargo.id === _id){
			   cargo.nombre_cargo = vcargo_actual.nombre_cargo;
			   cargo.usrmod = vcargo_actual.usrmod;
			   cargo.fecmod = vcargo_actual.fecmod;
		   }
	   })


	   dispatch({
		type:CARGO_LIST,
		payload: cargos
	   })

   } catch (error) {
	   console.log('Ocurrio un error al actualizar : ' + error);

   }

}

export const updateCargoActual  = (cargo_actual) =>({
	type:'UPDATE_CARGO_ACTUAL',
	payload: cargo_actual
})