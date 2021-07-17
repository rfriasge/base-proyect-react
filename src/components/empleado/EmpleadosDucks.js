import moment from "moment";
import { db } from "../../firebase/firebase-config";


// Consts  
const initialState = {
	empleados : [],
	empleado_actual : {
		id:'',
		nombres:'',
		apellidos:'',
		direccion:'',
		telefono_residencial:'',
		celular:'',
		cedula:'',
		departamento:'',
		cargo:'',
		tipo_empleado:'',
		fecha_nacimiento:'',
		persona_emergencia:'',
		telefono_emergencia:'',
		fecha_ingreso:'',
		fecha_egreso:'',
		observacion:'',
		sueldo:'',
		estado:'1',
		usrcre:'usrcre',
		feccre: '',
		usrmod:'usrmod',
		fecmod: ''
	},
	tipos_empleado:[
		{label: 'Empleado_administrativo', value: '1'},
		{label: 'Empleado Docente', value: '2'},
		{label: 'Otros', value: '3'},
	],
	estados:[
		{label: 'Activo', value: '1'},
		{label: 'Inactivo', value: '2'},
	]
}





// Types
const EMPLEADO_ADD = 'EMPLEADO_ADD';
const EMPLEADO_SAVE = 'EMPLEADO_SAVE';
const EMPLEADO_DELETE = 'EMPLEADO_DELETE';
const EMPLEADO_LIST  = 'EMPLEADO_LIST';
const EMPLEADO_EDIT  = 'EMPLEADO_EDIT';
const UPDATE_EMPLEADO_ACTUAL = 'UPDATE_EMPLEADO_ACTUAL';
const UPDATE_EMPLEADOS = 'UPDATE_EMPLEADOS';

// Reducers
export const empleadosReducer = (state = initialState, action) =>{
 
	switch (action.type) {
		case EMPLEADO_ADD:
            return {...state, 
				    empleados: [...action.payload]
			}
				   
		case EMPLEADO_SAVE:
				return {
					...state, empleado_actual: action.payload
				}								
		case EMPLEADO_DELETE:
				return	{...state,	
					     empleados: [...action.payload]	
				} 
			

		case EMPLEADO_EDIT:
			return {...state,empleado_actual : action.payload
			}											

		case EMPLEADO_LIST:
			return {...state,empleados: action.payload
		}											
		case UPDATE_EMPLEADO_ACTUAL:
			return {...state,empleado_actual: action.payload
		}
		case UPDATE_EMPLEADOS:
			return {...state,
				empleados: state.empleados.map(
                   emp => emp.id === action.payload.id?action.payload.empleado:emp

				   
				)
		}																						
	
		default:
			return state;
	}
}



// Actions
export const addEmpleadoAction =  () =>{
	return async (dispatch, getState) =>{
		
		const { uid } = getState().login;

		const { empleado_actual, empleados } = getState().empleado;
		

		delete empleado_actual['id'];

		empleado_actual.feccre = moment(new Date()).format("DD/MM/YYYY h:mm:ss a"); 
		empleado_actual.fecmod = moment(new Date()).format("DD/MM/YYYY h:mm:ss a"); 
		
		try{	
			const docRef = await db.collection(`${uid}/colegiodb/empleados`).add(empleado_actual);
			const {id} = docRef;
			empleado_actual.id = id;
		}
		catch(error){
			console.log(error);
	   }

	   let vempleados = [...empleados,empleado_actual];
	   dispatch({
		type:EMPLEADO_ADD,
		payload: vempleados
	   })
	}

}


export const listarEmpleadoAction = (uid) => async (dispatch, getState) =>{

	    let vempleados = [];    
		try{
			   const empleadosSnap = await db.collection(`${uid}/colegiodb/empleados`).get();

			   empleadosSnap.forEach((datos) => {

			   		vempleados = [...vempleados, {
                               ...datos.data(),
							   //cargo:datos.cargo,
							   //:datos.datos.departamento,
							   //cargo:datos.datos.tipo_empleado,
  						       id:datos.id
					}];

				});	
				
		}
		catch(error){
			   console.log(error);
		}

		dispatch({
			type:EMPLEADO_LIST,
			payload: vempleados
  		});

}




export const deleteEmpleadoAction = () => {
	return async (dispatch, getState) =>{
        
		const uid = getState().login.uid;
		const {empleado_actual, empleados} = getState().empleado;

		let vempleados = [];
		try{
			await db.doc(`${uid}/colegiodb/empleados/${empleado_actual.id}`).delete();
			vempleados = empleados.filter(empleado => empleado.id !== empleado_actual.id);
		}catch(error){
			console.log(error);
		}
		
		dispatch({
			type:EMPLEADO_DELETE,
			payload: vempleados
	    });
		
	}
}

export const updateEmpleadoAction = () =>async (dispatch, getState) => {
   const {empleados, empleado_actual} = getState().empleado;

   let { uid } = getState().login;

   try {
	   
       const _id = empleado_actual.id;
	   delete empleado_actual.id;
	   empleado_actual.fecmod = moment(new Date()).format("DD/MM/YYYY h:mm:ss a"); 

	   await db.doc(`${uid}/colegiodb/empleados/${_id}`).update(empleado_actual);
	   empleado_actual.id = _id;

	   var vempleados = [];
	   /*empleados.map(empleado =>{

		   if (empleado.id === _id){
			empleado.nombres = empleado_actual.nombres
			empleado.apellidos = empleado_actual.apellidos;
			empleado.direccion = empleado_actual.direccion;
			empleado.telefono_residencial = empleado_actual.telefono_residencial;
			empleado.celular = empleado_actual.celular;
			empleado.cedula = empleado_actual.cedula;
			empleado.departamento = empleado_actual.departamento;
			empleado.cargo = empleado_actual.cargo;
			empleado.tipo_empleado = empleado_actual.tipo_empleado;
			empleado.fecha_nacimiento = empleado_actual.fecha_nacimiento;
			empleado.persona_emergencia = empleado_actual.persona_emergencia;
			empleado.telefono_emergencia = empleado_actual.telefono_emergencia;
			empleado.fecha_ingreso = empleado_actual.fecha_ingreso;
			empleado.sueldo = empleado_actual.sueldo;
			empleado.estado = empleado_actual.estado;
            empleado.observacion =  empleado_actual.observacion;
			empleado.usrcre = empleado_actual.usrcre;
			empleado.feccre = empleado_actual.feccre;
			empleado.usrmod = empleado_actual.usrmod;
			empleado.fecmod = empleado_actual.fecmod;
			vempleados.push(empleado);
		}else{
			vempleados.push(empleado);
		   }
		  empleados = vempleados;
	   })
       */
       updateEmpleados(empleado_actual.id, empleado_actual);

	   dispatch({
		type:EMPLEADO_LIST,
		payload: empleados
	   })

   } catch (error) {
	   console.log('Ocurrio un error al actualizar : ' + error);

   }

}

export const updateEmpleadoActual  = (empleado_actual) =>({
	type:'UPDATE_EMPLEADO_ACTUAL',
	payload: empleado_actual
})

export const updateEmpleados = (id, empleado) =>({
     type:'UPDATE_EMPLEADOS',
     payload:{
		 id, 
		 empleado
	 }
});

