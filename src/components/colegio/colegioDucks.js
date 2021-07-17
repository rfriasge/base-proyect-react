//import {dispatch, useSelector } from 'react-redux';
//import thunk from 'redux-thunk'
import { db } from "../../firebase/firebase-config";

//constantes

const initialState = {
   colegios: [],

   colegio_actual : {
	id:'',
	nombre:'',
	direccion:'',
	telefono1:'',
	telefono2:'',
	email:'',
	director:'',
	rnc:null,
	anoEscolarActual:0,
	direccionRegional:'',
	distritoEscolar:'',
	codigoColegio:'',
	ciudadEmision:null,
	tanda:null,
	sector:null,
	secretariaDocente:'',
	directorDistrito:'',
	supervidorDistrito:'',
	diasGraciaCobro:''														   
   }
}

// types

const ADD_COLEGIO = 'ADD_COLEGIO';
const UPDATE_COLEGIO = 'UPDATE_COLEGIO';
const DELETE_COLEGIO = 'DELETE_COLEGIO';
const LIST_COLEGIOS  = 'LIST_COLEGIOS';
const EDIT_COLEGIO  = 'EDIT_COLEGIO';
const REFRESH_COLEGIO = 'REFRESH_COLEGIO';



// reducers

export const colegioReducer = (state = initialState, action) => {

	switch(action.type){
	case ADD_COLEGIO:
            return {...state, 
				    colegios: [...action.payload]
			}		
	case LIST_COLEGIOS :
			return {...state, colegios : action.payload}   
	case EDIT_COLEGIO :
			return {...state, colegio_actual : action.payload}   			
	case DELETE_COLEGIO:
				return	{...state,	
							 colegios: [...action.payload]	
				} 				
	case REFRESH_COLEGIO :
				return {
					...state,
				    colegios: state.colegios.map(
						colegio => colegio.id === action.payload.id
						           ?action.payload.colegio:colegio
					)
				}   						
								
	default :
        return state;
  }
}




// acciones

export const listarColegiosAccion = (uid) =>  async (dispatch, getState) => {


   try{
     	const colegiosSnap = await db.collection(`${uid}/colegiodb/colegios`).get();
		const colegios = [];
    	colegiosSnap.forEach((datos) => {
    		colegios.push({
				...datos.data(),
				id: datos.id
			});
     	});

		
    
     	dispatch({
       		type:LIST_COLEGIOS,
       		payload: colegios
     	});
   } 
   catch(error){
		console.log(error);
   }
}
  

export const addColegio =  (colegio_actual = {}, uid) => async (dispatch, getState) => {
	let  {colegios}  = getState().colegio;
	delete colegio_actual['id'];

	try{	
		const docRef = await db.collection(`${uid}/colegiodb/colegios`).add(colegio_actual);
        const { id } = docRef;
		colegio_actual.id = id;
	}
	catch(error){
		console.log(error);
   }
   colegios = [...colegios, colegio_actual];
   
   dispatch({
		type:ADD_COLEGIO,
		payload: colegios
   })

}

export const updateColegio = (colegio_actual, uid ) => async (dispatch, getState) =>{
	let { colegios } = getState().colegio;

	try {
		
  	    const _id  = colegio_actual.id;
		delete colegio_actual.id;
		await db.doc(`${uid}/colegiodb/colegios/${_id}`).update(colegio_actual);
        colegio_actual.id = _id;
		colegios.map(colegio =>{
			if (colegio.id === _id){
				colegio.nombre = colegio_actual.nombre;
				colegio.direccion = colegio_actual.direccion;
				colegio.telefono1 = colegio_actual.telefono1;
				colegio.telefono2 = colegio_actual.telefono2;
				colegio.email = colegio_actual.email;
				colegio.director = colegio_actual.director;
				colegio.rnc = colegio_actual.rnc;
				colegio.anoEscolarActual = colegio_actual.anoEscolarActual;
				colegio.direccionRegional = colegio_actual.direccionRegional;
				colegio.distritoEscolar = colegio_actual.distritoEscolar;
				colegio.codigoColegio = colegio_actual.codigoColegio;
				colegio.ciudadEmision = colegio_actual.ciudadEmision;
				colegio.tanda  = colegio_actual.tanda;
				colegio.sector = colegio_actual.sector;
				colegio.secretariaDocente = colegio_actual.secretariaDocente;
				colegio.directorDistrito = colegio_actual.directorDistrito;
				colegio.supervidorDistrito = colegio_actual.supervidorDistrito;
				colegio.diasGraciaCobro = colegio_actual.diasGraciaCobro;											
			}
		});
        
        dispatch({
			type:LIST_COLEGIOS,
			payload: colegios
	   });

	} catch (error) {
		console.log('Ocurrio un error al actualizar : ' + error);

	}


}

export const editColegio = (colegioActual) => (dispatch, getState) =>{
	
   dispatch({
	   type:EDIT_COLEGIO,
	   payload:colegioActual
   })
}

export const deleteColegio = (_id) =>{
	return async (dispatch, getState) =>{
		const uid = getState().login.uid;
		const colegios = getState().colegio.colegios;
		let   vcolegios = [];
		try{
			await db.doc(`${uid}/colegiodb/colegios/${_id}`).delete();
			vcolegios = colegios.filter(colegio => colegio.id !== _id);
		}catch(error){
			console.log(error);
		}

		dispatch({
			type:'DELETE_COLEGIO',
			payload: vcolegios
		})

        
		
	}

}

export const refreshColegio = (id, colegio) =>({
   type:REFRESH_COLEGIO,
   payload:{
	   id,
	   colegio
   }
})