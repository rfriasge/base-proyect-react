//import ReactDOM from 'react-dom';
//import { Link, BrowserRouter as Router  } from 'react-router-dom';
import { firebase, googleAuthProvider } from '../../firebase/firebase-config';
import { loginTypes } from './loginTypes';
import Swal from 'sweetalert2'
//import { PrivateRoute } from './PrivateRoute';
//import { Dashboard } from '../Dashboard';



export const startLoginEmailPassword = (email, password) =>{
	return (dispatch) =>{
		setTimeout(()=>{
			dispatch( login(123, "pedro"));
		},3500);
	}
}


export const startGoogleLogin = () => {
	return (dispatch) => {
			firebase.auth().signInWithPopup( googleAuthProvider )
	        .then( ({ user }) =>{
				dispatch (
					login (user.uid, user.displayName)
				)
			});
		}
}
export const login = (uid, displayName) =>
	({
		type: loginTypes.login,
		payload:{
			uid,
			displayName
	}});

export const setError = (msgError) =>({
   type: loginTypes.uiSetError,
   payload: msgError

});

export const removeError = () =>({
	type: loginTypes.uiRemoveError
 })

 export const StartRegisterWithEmailPasswordName = (email, password, name) =>{
	
	return (dispatch) =>{

		firebase.auth().createUserWithEmailAndPassword(email, password)
				.then(async ({user}) =>{
					await user.updateProfile({displayName: name});
					dispatch(
						login(user.uid, user.displayName)
					)
				})
				.catch( e => {
					console.log('Error : ' + e);
				})
	}
 }

 export const signWithEmailPassword = (email, password, name, isConnected="true") =>{

	

	return (dispatch) =>{
		dispatch( startLoading());
		
		firebase.auth().signInWithEmailAndPassword(email, password)
				.then(async ({user}) =>{

					//await user.updateProfile({displayName: name});
					dispatch(login(user.uid, user.displayName))
					dispatch( finishLoading());
						 			    
									})
				.catch( e => {
					Swal.fire('Error', 'Error : ' + e, 'error');
					dispatch( finishLoading());
					console.log('Error : ' + e);
				})
	}
}

 export const startLoading = ()=>({ 
	 type: loginTypes.uiStartLoading
 })

export const finishLoading = ()=>({ 
	type: loginTypes.uiFinishLoading
})

 export const uiFinishLoading = ()=>{ }


 export const logout = () => ({
	type: loginTypes.logout
})

 export const startLogout = () =>{
	return async(dispatch) => {
		await firebase.auth().signOut();
		dispatch(logout());
	}
}



