import moment from "moment";
import { db } from "../../firebase/firebase-config";


// Consts  
const initialState = {
	puestos : [],

	puesto_actual : {
		nombre_puesto:'',
		id:0,
		usrcre:'usrcre',
		feccre: '',
		usrmod:'usrmod',
		fecmod: ''
	}
}





// Types
const PUESTO_ADD = 'PUESTO_ADD';
const PUESTO_SAVE = 'PUESTO_SAVE';
const PUESTO_DELETE = 'PUESTO_DELETE';
const PUESTO_LIST  = 'PUESTO_LIST';
const PUESTO_EDIT  = 'PUESTO_EDIT';
const UPDATE_PUESTO_ACTUAL = 'UPDATE_PUESTO_ACTUAL';

// Reducers
export const puestoReducer = (state = initialState, action) =>{

	switch (action.type) {
		case PUESTO_ADD:
            return {...state, 
				    puestos: [...action.payload]
			}
				   
		case PUESTO_SAVE:
				return {
					...state, puesto_actual: action.payload
				}								
		case PUESTO_DELETE:
				return	{...state,	
					     puestos: [...action.payload]	
				} 
			

		case PUESTO_EDIT:
			return {...state,puesto_actual : action.payload
			}											

		case PUESTO_LIST:
			return {...state,puestos: action.payload
		}											
		case UPDATE_PUESTO_ACTUAL:
			return {...state,puesto_actual: action.payload
		}											
	
		default:
			return state;
	}
}



// Actions

//const FormatDate =(fecha) =>{
//	return moment(fecha).format("DD/MM/YYYY h:mm:ss a"); 
//}

/*export const editPuesto = (puesto) => (dispatch) => {
	alert(JSON.stringify(puesto));
	dispatch({
		type:PUESTO_EDIT,
		payload: puesto
	   })
}*/

export const addPuestoAction =  () =>{
	return async (dispatch, getState) =>{
		


		//dispatch( updatePuestoActual());
		const { uid } = getState().login;
		const { puesto_actual, puestos } = getState().puesto;
		delete puesto_actual['id'];

		puesto_actual.feccre = moment(new Date()).format("DD/MM/YYYY h:mm:ss a"); 
		puesto_actual.fecmod = moment(new Date()).format("DD/MM/YYYY h:mm:ss a"); 

		try{	
			const docRef = await db.collection(`${uid}/colegiodb/puestos`).add(puesto_actual);
			const {id} = docRef;
			puesto_actual.id = id;
		}
		catch(error){
			console.log(error);
	   }

	   let vpuestos = [...puestos,puesto_actual];
	   dispatch({
		type:PUESTO_ADD,
		payload: vpuestos
	   })
	}

}


export const listarPuestosAction = (uid) => async (dispatch, getState) =>{
	 
			try{
			   const puestosSnap = await db.collection(`${uid}/colegiodb/puestos`).get();
			   const puestos = [];


			   puestosSnap.forEach((datos) => {


//				   const fecha = datos.data().feccre;

				   puestos.push({
					   ...datos.data(),
					   id: datos.id

				   });
				});
		
			dispatch({
					  type:PUESTO_LIST,
					  payload: puestos
				});
		  }
		  catch(error){
			   console.log(error);
		  }

}




export const deletePuestoAction = (_id) => {
	return async (dispatch, getState) =>{
        
		const uid = getState().login.uid;
		const puestos = getState().puesto.puestos;
		let vpuestos = [];
		try{
			await db.doc(`${uid}/colegiodb/puestos/${_id}`).delete();
			vpuestos = puestos.filter(PUESTO => PUESTO.id !== _id);
		}catch(error){
			console.log(error);
		}
		
		dispatch({
			type:PUESTO_DELETE,
			payload: vpuestos
	    });
		
	}
}

export const updatePuestoAction = () =>async (dispatch, getState) => {
   const {puestos, puesto_actual} = getState().puesto;


   //const vpuesto_actual   = vpuesto;
   let { uid } = getState().login;

   try {
	   
       const _id = puesto_actual.id;
	   delete puesto_actual.id;
	   puesto_actual.fecmod = moment(new Date()).format("DD/MM/YYYY h:mm:ss a"); 
	   await db.doc(`${uid}/colegiodb/puestos/${_id}`).update(puesto_actual);
	   puesto_actual.id = _id;

	   puestos.map(puesto =>{
		   if (puesto.id === _id){
			puesto.nombre_puesto = puesto_actual.nombre_puesto;
			puesto.usrmod = puesto_actual.usrmod;
			puesto.fecmod = puesto_actual.fecmod;
		   };
		   return null;
	   })


	   dispatch({
		type:PUESTO_LIST,
		payload: puestos
	   })

   } catch (error) {
	   console.log('Ocurrio un error al actualizar : ' + error);

   }

}

export const updatePuestoActual  = (puesto_actual) =>({
	type:'UPDATE_PUESTO_ACTUAL',
	payload: puesto_actual
})