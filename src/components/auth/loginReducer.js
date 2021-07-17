import { loginTypes as types } from './loginTypes';

const initialState = {
	uid:"",
	name: "",
	ruta_base:'/',
	isConnected: false
}
 export const loginReducer = (state = initialState, action) =>{

	 switch (action.type) {

		 case types.login: 
			 return {
				 uid: action.payload.uid,
				 name: action.payload.displayName,
				 isConnected:true
	 		}
		case types.logout:
			return{
				uid: "",
				name: "",
				isConnected:false
			}	 

		 default:
			return state;
	 }
 }

  