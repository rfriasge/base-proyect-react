import moment from "moment";
import { db } from "../../firebase/firebase-config";


// Consts  
const initialState = {
	grados : [],

	grado_actual : {
		descripcion:'',
		estado:'A',
		id:0,
		colegiatura:'',
		inscripcion:'',
		usrcre:'usrcre',
		feccre: '',
		usrmod:'usrmod',
		fecmod: ''
	}
}





// Types
const GRADO_ADD = 'GRADO_ADD';
const GRADO_SAVE = 'GRADO_SAVE';
const GRADO_DELETE = 'GRADO_DELETE';
const GRADO_LIST  = 'GRADO_LIST';
const GRADO_EDIT  = 'GRADO_EDIT';
const UPDATE_GRADO_ACTUAL = 'UPDATE_GRADO_ACTUAL';

// Reducers
export const gradosReducer = (state = initialState, action) =>{
 
	switch (action.type) {
		case GRADO_ADD:
            return {...state, 
				    grados: [...action.payload]
			}
				   
		case GRADO_SAVE:
				return {
					...state, grado_actual: action.payload
				}								
		case GRADO_DELETE:
				return	{...state,	
					     grados: [...action.payload]	
				} 
			

		case GRADO_EDIT:
			return {...state,grado_actual : action.payload
			}											

		case GRADO_LIST:
			return {...state,grados: action.payload
		}											
		case UPDATE_GRADO_ACTUAL:
			return {...state,grado_actual: action.payload
		}											
	
		default:
			return state;
	}
}



// Actions
export const addGradoAction =  () =>{
	return async (dispatch, getState) =>{
		
		const { uid } = getState().login;

		const { grado_actual, grados } = getState().grado;
		

		delete grado_actual['id'];

		grado_actual.feccre = moment(new Date()).format("DD/MM/YYYY h:mm:ss a"); 
		grado_actual.fecmod = moment(new Date()).format("DD/MM/YYYY h:mm:ss a"); 
		
		try{	
			const docRef = await db.collection(`${uid}/colegiodb/grados`).add(grado_actual);
			const {id} = docRef;
			grado_actual.id = id;
		}
		catch(error){
			console.log(error);
	   }

	   let vgrados = [...grados,grado_actual];
	   dispatch({
		type:GRADO_ADD,
		payload: vgrados
	   })
	}

}


export const listarGradoAction = (uid) => async (dispatch, getState) =>{

	    let vgrados = [];    
		try{
			   const gradosSnap = await db.collection(`${uid}/colegiodb/grados`).get();

			   gradosSnap.forEach((datos) => {

			   		vgrados = [...vgrados, {
                               ...datos.data(),
  						       id:datos.id
					}];

				});	
				
		}
		catch(error){
			   console.log(error);
		}

		dispatch({
			type:GRADO_LIST,
			payload: vgrados
  		});

}




export const deleteGradoAction = () => {
	return async (dispatch, getState) =>{
        
		const uid = getState().login.uid;
		const {grado_actual, grados} = getState().grado;

		let vgrados = [];
		try{
			await db.doc(`${uid}/colegiodb/grados/${grado_actual.id}`).delete();
			vgrados = grados.filter(grado => grado.id !== grado_actual.id);
		}catch(error){
			console.log(error);
		}
		
		dispatch({
			type:GRADO_DELETE,
			payload: vgrados
	    });
		
	}
}

export const updateGradoAction = () =>async (dispatch, getState) => {
   const {grados, grado_actual} = getState().grado;

   let { uid } = getState().login;

   try {
	   
       const _id = grado_actual.id;
	   delete grado_actual.id;
	   grado_actual.colegiatura  = parseFloat(grado_actual.colegiatura).toFixed(2);
	   grado_actual.inscripcion = parseFloat(grado_actual.inscripcion).toFixed(2);
	   grado_actual.fecmod = moment(new Date()).format("DD/MM/YYYY h:mm:ss a"); 

	   await db.doc(`${uid}/colegiodb/grados/${_id}`).update(grado_actual);
	   grado_actual.id = _id;

	   grados.map(grado =>{

		   if (grado.id === _id){
			grado.descripcion = grado_actual.descripcion;
			grado.colegiatura = grado_actual.colegiatura;
			grado.inscripcion = grado_actual.inscripcion;
			grado.fecmod = grado_actual.fecmod;
		   }else{
			   grado = grado;
		   }
		   return null;
	   })


	   dispatch({
		type:GRADO_LIST,
		payload: grados
	   })

   } catch (error) {
	   console.log('Ocurrio un error al actualizar : ' + error);

   }

}

export const updateGradoActual  = (grado_actual) =>({
	type:'UPDATE_GRADO_ACTUAL',
	payload: grado_actual
})

