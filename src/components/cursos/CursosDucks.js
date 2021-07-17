import moment from "moment";
import { db } from "../../firebase/firebase-config";


// Consts  
const initialState = {
	cursos : [],
	curso_actual : {
		descripcion:'',
		id:0,
		grado:'',
		aula:'',
		tanda:'',
		usrcre:'usrcre',
		feccre: '',
		usrmod:'usrmod',
		fecmod: ''
	},
	tandas:[
		{label: 'Mañana', value: 'mañana'},
		{label: 'Tarde', value: 'tarde'},
		{label: 'Noche', value: 'noche'},
	]
}





// Types
const CURSO_ADD = 'CURSO_ADD';
const CURSO_SAVE = 'CURSO_SAVE';
const CURSO_DELETE = 'CURSO_DELETE';
const CURSO_LIST  = 'CURSO_LIST';
const CURSO_EDIT  = 'CURSO_EDIT';
const UPDATE_CURSO_ACTUAL = 'UPDATE_CURSO_ACTUAL';

// Reducers
export const cursosReducer = (state = initialState, action) =>{
 
	switch (action.type) {
		case CURSO_ADD:
            return {...state, 
				    cursos: [...action.payload]
			}
				   
		case CURSO_SAVE:
				return {
					...state, curso_actual: action.payload
				}								
		case CURSO_DELETE:
				return	{...state,	
					     cursos: [...action.payload]	
				} 
			

		case CURSO_EDIT:
			return {...state,curso_actual : action.payload
			}											

		case CURSO_LIST:
			return {...state,cursos: action.payload
		}											
		case UPDATE_CURSO_ACTUAL:
			return {...state,curso_actual: action.payload
		}											
	
		default:
			return state;
	}
}



// Actions
export const addCursoAction =  () =>{
	return async (dispatch, getState) =>{
		
		const { uid } = getState().login;

		const { curso_actual, cursos } = getState().curso;
		

		delete curso_actual['id'];

		curso_actual.feccre = moment(new Date()).format("DD/MM/YYYY h:mm:ss a"); 
		curso_actual.fecmod = moment(new Date()).format("DD/MM/YYYY h:mm:ss a"); 
		
		try{	
			const docRef = await db.collection(`${uid}/colegiodb/cursos`).add(curso_actual);
			const {id} = docRef;
			curso_actual.id = id;
		}
		catch(error){
			console.log(error);
	   }

	   let vcursos = [...cursos,curso_actual];
	   dispatch({
		type:CURSO_ADD,
		payload: vcursos
	   })
	}

}


export const listarCursoAction = (uid) => async (dispatch, getState) =>{

	    let vcursos = [];    
		try{
			   const cursosSnap = await db.collection(`${uid}/colegiodb/cursos`).get();

			   cursosSnap.forEach((datos) => {

			   		vcursos = [...vcursos, {
                               ...datos.data(),
  						       id:datos.id
					}];

				});	
				
		}
		catch(error){
			   console.log(error);
		}

		dispatch({
			type:CURSO_LIST,
			payload: vcursos
  		});

}




export const deleteCursoAction = () => {
	return async (dispatch, getState) =>{
        
		const uid = getState().login.uid;
		const {curso_actual, cursos} = getState().curso;

		let vcursos = [];
		try{
			await db.doc(`${uid}/colegiodb/cursos/${curso_actual.id}`).delete();
			vcursos = cursos.filter(curso => curso.id !== curso_actual.id);
		}catch(error){
			console.log(error);
		}
		
		dispatch({
			type:CURSO_DELETE,
			payload: vcursos
	    });
		
	}
}

export const updateCursoAction = () =>async (dispatch, getState) => {
   const {cursos, curso_actual} = getState().curso;

   let { uid } = getState().login;

   try {
	   
       const _id = curso_actual.id;
	   delete curso_actual.id;
	   curso_actual.fecmod = moment(new Date()).format("DD/MM/YYYY h:mm:ss a"); 

	   await db.doc(`${uid}/colegiodb/cursos/${_id}`).update(curso_actual);
	   curso_actual.id = _id;

	   cursos.map(curso =>{

		   if (curso.id === _id){
			curso.descripcion = curso_actual.descripcion;
			curso.grado = curso_actual.grado;
			curso.aula = curso_actual.aula;
			curso.tanda = curso_actual.tanda;
			curso.fecmod = curso_actual.fecmod;
		   }else{
			curso = curso;
		   }
		   return null;
	   })


	   dispatch({
		type:CURSO_LIST,
		payload: cursos
	   })

   } catch (error) {
	   console.log('Ocurrio un error al actualizar : ' + error);

   }

}

export const updateCursoActual  = (curso_actual) =>({
	type:'UPDATE_CURSO_ACTUAL',
	payload: curso_actual
})

