import moment from "moment";
import { db } from "../../firebase/firebase-config";


// Consts  
const initialState = {
	anos_escolares : [],

	ano_escolar_actual : {
		descripcion:'',
		estado:'',
		id:0,
		fecha_examen_sem:'',
		fecha_examen_com:'',
		usrcre:'usrcre',
		feccre: '',
		usrmod:'usrmod',
		fecmod: ''
	}
}





// Types
const ANO_ESCOLAR_ADD = 'ANO_ESCOLAR_ADD';
const ANO_ESCOLAR_SAVE = 'ANO_ESCOLAR_SAVE';
const ANO_ESCOLAR_DELETE = 'ANO_ESCOLAR_DELETE';
const ANO_ESCOLAR_LIST  = 'ANO_ESCOLAR_LIST';
const ANO_ESCOLAR_EDIT  = 'ANO_ESCOLAR_EDIT';
const UPDATE_ANO_ESCOLAR_ACTUAL = 'UPDATE_ANO_ESCOLAR_ACTUAL';

// Reducers
export const anoEscolarReducer = (state = initialState, action) =>{

	switch (action.type) {
		case ANO_ESCOLAR_ADD:
            return {...state, 
				    anos_escolares: [...action.payload]
			}
				   
		case ANO_ESCOLAR_SAVE:
				return {
					...state, ano_escolar_actual: action.payload
				}								
		case ANO_ESCOLAR_DELETE:
				return	{...state,	
					     anos_escolares: [...action.payload]	
				} 
			

		case ANO_ESCOLAR_EDIT:
			return {...state,ano_escolar_actual : action.payload
			}											

		case ANO_ESCOLAR_LIST:
			return {...state,anos_escolares: action.payload
		}											
		case UPDATE_ANO_ESCOLAR_ACTUAL:
			return {...state,ano_escolar_actual: action.payload
		}											
	
		default:
			return state;
	}
}



// Actions
export const addAnoEscolarAction =  () =>{
	return async (dispatch, getState) =>{
		
		const { uid } = getState().login;

		const { ano_escolar_actual, anos_escolares } = getState().ano_escolar;
		

		delete ano_escolar_actual['id'];

		ano_escolar_actual.feccre = moment(new Date()).format("DD/MM/YYYY h:mm:ss a"); 
		ano_escolar_actual.fecmod = moment(new Date()).format("DD/MM/YYYY h:mm:ss a"); 
		
		//ano_escolar_actual.fecha_examen_com = moment(ano_escolar_actual.fecha_examen_com).format('L'); 
		//ano_escolar_actual.fecha_examen_sem = moment(ano_escolar_actual.fecha_examen_sem).format('L'); 
		
		//ano_escolar_actual.fecha_examen_sem = ano_escolar_actual.fecha_examen_sem.substr(0,10);
		//ano_escolar_actual.fecha_examen_com = ano_escolar_actual.fecha_examen_com.substr(0,10);
		console.log(ano_escolar_actual.fecha_examen_sem);
		console.log(ano_escolar_actual.fecha_examen_com);

		try{	
			const docRef = await db.collection(`${uid}/colegiodb/ano_escolar`).add(ano_escolar_actual);
			const {id} = docRef;
			ano_escolar_actual.id = id;
		}
		catch(error){
			console.log(error);
	   }

	   let vanos_escolares = [...anos_escolares,ano_escolar_actual];
	   dispatch({
		type:ANO_ESCOLAR_ADD,
		payload: vanos_escolares
	   })
	}

}


export const listarAnosEscolaresAction = (uid) => async (dispatch, getState) =>{

	    let vanos_escolares = [];    
		try{
			   const anoEscolarSnap = await db.collection(`${uid}/colegiodb/ano_escolar`).get();

			   anoEscolarSnap.forEach((datos) => {

			   vanos_escolares = [...vanos_escolares, {
					                                        ...datos.data(),
															id:datos.id
														}];
				});	

		}
		catch(error){
			   console.log(error);
		}

		dispatch({
			type:ANO_ESCOLAR_LIST,
			payload: vanos_escolares
  		});

}




export const deleteAnoEscolarAction = () => {
	return async (dispatch, getState) =>{
        
		const uid = getState().login.uid;
		const {ano_escolar_actual, anos_escolares} = getState().ano_escolar;
		console.log('Borrar : ' + ano_escolar_actual);
		let vanos_escolares = [];
		try{
			await db.doc(`${uid}/colegiodb/ano_escolar/${ano_escolar_actual.id}`).delete();
			vanos_escolares = anos_escolares.filter(ano_escolar => ano_escolar.id !== ano_escolar_actual.id);
		}catch(error){
			console.log(error);
		}
		
		dispatch({
			type:ANO_ESCOLAR_DELETE,
			payload: vanos_escolares
	    });
		
	}
}

export const updateAnoEscolarAction = () =>async (dispatch, getState) => {
   const {anos_escolares, ano_escolar_actual} = getState().ano_escolar;

   let { uid } = getState().login;

   try {
	   
       const _id = ano_escolar_actual.id;
	   delete ano_escolar_actual.id;
	   ano_escolar_actual.fecmod = moment(new Date()).format("DD/MM/YYYY h:mm:ss a"); 
	   await db.doc(`${uid}/colegiodb/ano_escolar/${_id}`).update(ano_escolar_actual);
	   ano_escolar_actual.id = _id;
	   anos_escolares.map(ano_escolar =>{

		   if (ano_escolar.id === _id){
			ano_escolar.descripcion = ano_escolar_actual.descripcion;
			ano_escolar.fecha_examen_com = ano_escolar_actual.fecha_examen_com;
			ano_escolar.fecha_examen_sem = ano_escolar_actual.fecha_examen_sem;
			ano_escolar.usrmod = ano_escolar_actual.usrmod;
			ano_escolar.fecmod = ano_escolar_actual.fecmod;
		   }
		   return null;
	   })


	   dispatch({
		type:ANO_ESCOLAR_LIST,
		payload: anos_escolares
	   })

   } catch (error) {
	   console.log('Ocurrio un error al actualizar : ' + error);

   }

}

export const updateAnoEscolarActual  = (ano_escolar_actual) =>({
	type:'UPDATE_ANO_ESCOLAR_ACTUAL',
	payload: ano_escolar_actual
})

