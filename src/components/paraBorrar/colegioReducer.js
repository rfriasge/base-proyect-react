import { colegioTypes as Types} from "./colegioTypes";

const initialState = {
	colegios : [],
	colegio_actual: null,
	colegio_actual : {
		id:'',
		nombre:'',
		direccion:'',
		telefono1:'',
		telefono2:'',
		email:'',
		director:'',
		rnc:'',
		ano_escolar_actual:0,
		direccion_regional:'',
		distrito_escolar:'',
		codigo_colegio:'',
		ciudad_emision:'',
		tanda:'',
		sector:'',
		secretaria_docente:'',
		director_distrito:'',
		supervisor_distrito:'',
		dias_gracia_cobro:0,
		imagen_fondo:'',
		logo:''
	}
}

export const colegioReducer = (state = initialState, action) => {

	switch (action.type) {
		case Types.colegioAdd:
 			return {
				 ...state,
				 colegios: action.payload
			 }
		case Types.colegioLoad:

			return {
				...state,
				colegios: action.payload
			}
			/*	
		case Types.delete:

			return state;			
		case Types.load:

			return state;			*/

		default:
			return state;
	}


}
