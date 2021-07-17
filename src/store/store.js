import { createStore, combineReducers, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';

import { loginReducer } from '../components/auth/loginReducer';
import { uiReducer } from '../components/auth/uiReducer';
import { colegioReducer }  from '../components/colegio/colegioDucks';
import { cargoReducer } from '../components/cargo/cargoDucks'
import { puestoReducer } from '../components/puesto/puestoDucks';
import { tipoEmpleadoReducer } from '../components/tipo_empleado/tipoEmpleadoDucks';
import { anoEscolarReducer } from '../components/ano_escolar/anoEscolarDuck';
import { gradosReducer } from '../components/grado/gradosDucks';
import { materiasReducer } from '../components/materia/MateriasDucks';
import { horariosReducer } from '../components/horario/HorariosDucks';
import { cursosReducer } from '../components/cursos/CursosDucks';
import { empleadosReducer } from '../components/empleado/EmpleadosDucks';
import { departamentoReducer } from '../components/departamento/DepartamentoDucks';
import { estudiantesReducer } from '../components/estudiante/EstudiantesDucks';





const composeEnhancers = (window).__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
  
const reducers = combineReducers({
	login: loginReducer,
	ui: uiReducer,
	colegio: colegioReducer,
	cargo: cargoReducer,
	puesto: puestoReducer,
	tipo_empleado: tipoEmpleadoReducer,
	ano_escolar: anoEscolarReducer,
	grado: gradosReducer,
	materia: materiasReducer,
	horario: horariosReducer,
	curso: cursosReducer,
	empleado:empleadosReducer,
	departamento:departamentoReducer,
	estudiante:estudiantesReducer
});


export const store = createStore(
	reducers,
	composeEnhancers(
		applyMiddleware( thunk )
	)
	
);


