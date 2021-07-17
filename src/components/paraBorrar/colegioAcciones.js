import { db } from "../../firebase/firebase-config";

export const addColegio = (formValue = {}) =>{
    
	delete formValue['id_colegio'];

	return async (dispatch, getState) =>{
		const { uid } = getState().login;
		const docRef = await db.collection(`${uid}/colegiodb/colegios`).add(formValue);
	}
}

