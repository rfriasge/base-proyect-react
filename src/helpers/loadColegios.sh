
export const loadColegios = async () =>{

    const colegiosSnap = await db.collection(`${uid}/colegiodb/colegios`).get();
	const colegios = [];
	
	const { uid } = getState().login;
	
	colegiosSnap.forEach((datos) => {
        colegios.push({
			...datos.data()
		});

	return colegios;
}