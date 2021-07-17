import React, { useRef, useState, useEffect } from 'react';
import {  useDispatch, useSelector } from 'react-redux';
import { Toast } from 'primereact/toast';
import validator from 'validator';
import { Dialog } from 'primereact/dialog';
import { Button } from 'primereact/button';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { InputMask } from 'primereact/inputmask';
import { InputNumber } from 'primereact/inputnumber';
import { InputText } from 'primereact/inputtext';
import { InputTextarea } from 'primereact/inputtextarea';
import { useForm } from '../../hooks/useForm';
import CurrencyInput from 'react-currency-masked-input';
import { Dropdown } from 'primereact/dropdown';
import { addEmpleadoAction, listarEmpleadoAction, updateEmpleadoAction, deleteEmpleadoAction, updateEmpleadoActual } from "./EmpleadosDucks";
import { listarGradoAction } from "../grado/gradosDucks";
import moment from 'moment';
import { listarDepartamentosAction } from '../departamento/DepartamentoDucks';
import { listarCargosAction } from '../cargo/cargoDucks';

 

export const Empleados = () => {

  
    const { empleados, empleado_actual } = useSelector(state => state.empleado);
	
	
   const dispatch = useDispatch();
    const [ globalFilter, setGlobalFilter] = useState(null);
    const [ empleadoDialog, setEmpleadoDialog ] = useState(false);
    const [ empleadoActual, setEmpleadoActual] = useState(null);
    const { uid } = useSelector(state => state.login);
	const { grados } = useSelector(state => state.grado);
    const { departamentos } = useSelector(state => state.departamento);
    const { cargos } = useSelector(state => state.cargo);        
	const { tipos_empleado, estados } = useSelector(state => state.empleado);
    const toast = useRef(null);
    const dt = useRef(null);
    const [actualizar, setActualizar] = useState(false);
    const [deleteDialogShow, setDeleteDialogShow] = useState(false);
	
    
    const [error, setError] = useState({
        errorDescripcion:'',
        errorClass:''       
    })

	const [ formValue, setFormValue, handleInputChange, reset ] = useForm({
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
	});
    
    useEffect(() => {
        dispatch(listarEmpleadoAction(uid));
        dispatch(listarDepartamentosAction(uid));
        dispatch(listarCargosAction(uid));        
		dispatch(listarGradoAction(uid));
     }, [dispatch, uid]);
     
    const { id,	nombres,apellidos,direccion,telefono_residencial,celular,cedula,departamento,cargo,tipo_empleado,fecha_nacimiento,
	        persona_emergencia,telefono_emergencia,fecha_ingreso,sueldo,estado,usrcre,feccre,usrmod,fecmod, observacion, fecha_egreso } = formValue;

    useEffect(() =>{
        dispatch( updateEmpleadoActual(formValue));
    },[formValue]);
    
            
    const addDlg = () =>{
        reset();
        setActualizar(false);
		setEmpleadoDialog(true);
	}

    const editDlg = (empleado) =>{
        setActualizar(true);
        actualizaEmpleadoActual(empleado);
 		setEmpleadoDialog(true);
	}

    const deleteDlg = (empleado) =>{
        actualizaEmpleadoActual(empleado);
        hideShowDeleteDialog(true);
	}

         
    const actualizaEmpleadoActual = (empleado) =>{
        setFormValue({
			id:empleado.id,
			nombres:empleado.nombres,
			apellidos:empleado.apellidos,
			direccion:empleado.direccion,
			telefono_residencial:empleado.telefono_residencial,
			celular:empleado.celular,
			cedula:empleado.cedula,
			departamento:empleado.departamento?empleado.departamento:'',
			cargo:empleado.cargo?empleado.cargo:'',
			tipo_empleado:empleado.tipo_empleado?empleado.tipo_empleado:'',
			fecha_nacimiento:empleado.fecha_nacimiento,
			persona_emergencia:empleado.persona_emergencia,
			telefono_emergencia:empleado.telefono_emergencia,
			fecha_ingreso:empleado.fecha_ingreso,
			sueldo:empleado.sueldo,
			estado:empleado.estado,
            observacion: empleado.observacion,
			usrcre:empleado.usrcre,
			feccre:empleado.feccre,
			usrmod:empleado.usrmod,
			fecmod:empleado.fecmod
        })
    }
	const onHide = (name) => {
        setError({});  
        reset();
        setEmpleadoDialog(false);

    }

    const handleDeleteEmpleado = (_id) =>{
        dispatch(deleteEmpleadoAction(_id));
        hideShowDeleteDialog(false);
    }
     
    const onSubmit = () =>{


		  if (!isFormValid()){
              return false;
          }
         
          if (actualizar){
            dispatch( updateEmpleadoAction() );
          }else{
            dispatch( addEmpleadoAction() );
          }
          setEmpleadoDialog(false);
          reset();
        
    }

    const hideShowDeleteDialog = (hideShow) =>{
        setDeleteDialogShow(hideShow);
  }

  const isFormValid = () =>{
      setError({});   
      let errorNombres = '';
  
      if (nombres.trim().length === 0 ){
          errorNombres = 'Nombre es obligatorio';
      } 

      if (errorNombres){
          setError({errorNombres, errorClass:'errorClass'});
          return false
      }
      return true;
  }

 
  const exportCSV = () => {
      dt.current.exportCSV();
  }

  const FormatDate =(fecha) =>{
      return moment(fecha).format("DD/MM/YYYY"); 
  }


// Templates

    const header = (
		<div className="table-header">
			<h5 id="id_label_search" className="p-m-0">Listado de Empleados</h5>
			<Button label="Export Excel" icon="pi pi-upload" className="p-button-help"  style={{marginRight:"10px"}}  onClick={()=>exportCSV()} /> 			
			<Button  id="btn_new" label="Agregar" icon="pi pi-plus" onClick={ addDlg } />
			<span id="text_search"  className="p-input-icon-left">
			   <i className="pi pi-search" />
				<InputText name="txt_buscar" id="txt_buscar" type="search" onInput={(e) => setGlobalFilter(e.target.value)} />
			</span>
		</div>
	);

	const footer = (
        <div>
            <Button label="Grabar" icon="pi pi-check" onClick={onSubmit} />
            <Button label="Cancelar" icon="pi pi-times" onClick={onHide} />
        </div>
    );

    const deleteDialogFooter =(rowData) => (
    	<div>
        	<Button label="Cancelar" icon="pi pi-times" className="p-button-text" onClick={()=>hideShowDeleteDialog(false)} />
        	<Button label="Borrar" icon="pi pi-check" className="p-button-text" onClick={()=>handleDeleteEmpleado()} />
    	</div>
	);
    

    const actionBodyTemplate = (rowData) => {
        return (

            <div className="actions" style={{width:"75px"}}>
                <Button icon="pi pi-pencil" className="p-button-rounded p-button-success p-mr-2" onClick={() => editDlg(rowData)} />
                <Button icon="pi pi-trash" className="p-button-rounded p-button-warning" onClick={ ()=>deleteDlg(rowData) } />
            </div>
        );
    }

	const gradoOptionTemplate = (option) => {
		return (
			<div >
				<div>{option.descripcion}</div>
			</div>
		);
	}

  return (
		<div>
			<div className="p-grid crud-demo">
				<div className="p-col-12">
					<div className="card">
						<Toast ref={toast} />
						<DataTable   value={empleados}   ref={dt}  id="tbEmpleado"
                        onSelectionChange={  (e) =>setEmpleadoActual(e.value) } 
						header="Small Table" 
							dataKey="id" paginator rows={10} rowsPerPageOptions={[5, 10, 25]} className="datatable-responsive p-datatable-sm"
							paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown" globalFilter={globalFilter}
							currentPageReportTemplate="Showing {first} to {last} of {totalRecords} Empleados"
							emptyMessage="No existen registros"  header={header} selectionMode="single">
							<Column style={{width:"15%" }} field="nombres" header="Nombre Empleado / Profesor" sortable ></Column>
                            <Column style={{width:"15%" }} field="apellidos" header="Apellidos" sortable ></Column>
                            <Column style={{width:"10%" }} field="cedula" header="cedula" sortable ></Column>
                            <Column style={{width:"10%" }} field="celular" header="Celular" sortable ></Column>
                            <Column style={{width:"10%" }} field="departamento.nombre_departamento" header="Departamento" sortable ></Column>
                            <Column style={{width:"10%" }} field="cargo.nombre_cargo" header="Cargo" sortable ></Column>
							<Column header="Acción" style={{ width:"5.6%" }} body={actionBodyTemplate} > </Column>
						</DataTable>

				   

		 	<Dialog visible={empleadoDialog} style={{ width: '50%' }} header="Empleado" modal className="p-fluid" footer={footer} onHide={onHide}>
                <form  >


                    <div className="p-fluid p-formgrid p-grid">
            
                        <div className="p-field p-col-12 p-md-3 p-mt-3 ">
                            <label htmlFor="nombres">Nombre(s) empleado / Profesor</label>
                            <InputText  name="nombres" type="text"  className =  { error.errorNombre?.length && error.errorClass } autoFocus 
                            onChange = { handleInputChange  } value ={ nombres }/>
                            <div style={{ fontSize:12, color:"red" }}> { error.errorNombre }</div>
                        </div>

                        <div className="p-field p-col-12 p-md-3 p-mt-3 ">
                            <label htmlFor="apellidos">Apellido(s)</label>
                            <InputText  name="apellidos" type="text"  className =  { error.errorApellidos?.length && error.errorClass }
                            onChange = { handleInputChange  } value ={ apellidos }/>
                            <div style={{ fontSize:12, color:"red" }}> { error.errorApelidos }</div>
                        </div>

                        <div className="p-field p-col-12 p-md-3 p-mt-3 ">
                            <label htmlFor="cedula">Cédula/Rnc</label>
                            <InputText  name="cedula" type="text"  className =  { error.errorCedula?.length && error.errorClass }
                            onChange = { handleInputChange  } value ={ cedula }/>
                            <div style={{ fontSize:12, color:"red" }}> { error.errorCedula }</div>
                        </div>

                        <div className="p-field p-col-12 p-md-3 p-mt-3 ">
                            <label htmlFor="tipo_empleado">Tipo Empleado</label>
							<Dropdown name="tipo_empleado" value={tipo_empleado} options={tipos_empleado} optionLabel="label" 
                             placeholder="Seleccione Tipo Empleado" 
                            onChange = { handleInputChange  } />
                            <div style={{ fontSize:12, color:"red" }}> { error.errorTipoEmpleado }</div>
                        </div>						

                        <div className="p-field p-col-12 p-md-6 p-mt-1 ">
                          <label htmlFor="direccion">Dirección</label>
                          <InputText  name="direccion" type="text"  className =  { error.errorDireccion?.length && error.errorClass }
                          onChange = { handleInputChange  } value ={ direccion }/>
                          <div style={{ fontSize:12, color:"red" }}> { error.errorDireccion }</div>
                      </div>

                      <div className="p-field p-col-12 p-md-3 p-mt-1 ">
                          <label htmlFor="direccion">Teléfon Residencia</label>
                          <InputMask  name="telefono_residencial" type="text" mask="(999) 999-9999" placeholder="(999) 999-9999" 
                          onChange = { handleInputChange  } value ={ telefono_residencial }/>
                          <div style={{ fontSize:12, color:"red" }}> { error.errorTelefonoResidencial }</div>
                      </div>

                      <div className="p-field p-col-12 p-md-3 p-mt-1 ">
                          <label htmlFor="celular">Celular</label>
                          <InputMask  name="celular" type="text" mask="(999) 999-9999" placeholder="(999) 999-9999"
                          onChange = { handleInputChange  } value ={ celular }/>
                          <div style={{ fontSize:12, color:"red" }}> { error.errorCelular }</div>
                      </div>

                      <div className="p-field p-col-12 p-md-3 p-mt-1 ">
                            <label htmlFor="departamento">Departamento</label>
							<Dropdown name="departamento" value={departamento} options={departamentos} optionLabel="nombre_departamento" 
                             placeholder="Seleccione Departamento" 
                            onChange = { handleInputChange  } />
                            <div style={{ fontSize:12, color:"red" }}> { error.errorDepartamento }</div>
                        </div>

                        <div className="p-field p-col-12 p-md-3 p-mt-1 ">
                            <label htmlFor="cargo">Cargo</label>
							<Dropdown name="cargo" value={cargo} options={cargos} optionLabel="nombre_cargo" 
                             placeholder="Seleccione Cargo" 
                            onChange = { handleInputChange  } />
                            <div style={{ fontSize:12, color:"red" }}> { error.errorCargo }</div>
                        </div>

                      <div className="p-field p-col-12 p-md-2 p-mt-1 ">
                          <label htmlFor="fecha_nacimiento">Fecha Nacimiento</label>
                          <InputMask  name="fecha_nacimiento" type="text" mask="99/99/9999" placeholder="dd/mm/yyyy" slotChar="dd/mm/yyyy" 
                          onChange = { handleInputChange  } value ={ fecha_nacimiento }/>
                          <div style={{ fontSize:12, color:"red" }}> { error.errorFechaNacimiento }</div>
                      </div>

                      <div className="p-field p-col-12 p-md-2 p-mt-1 ">
                          <label htmlFor="celular">Fecha Ingreso</label>
                          <InputMask  name="fecha_ingreso" type="text" mask="99/99/9999" placeholder="dd/mm/yyyy" slotChar="dd/mm/yyyy" 
                          onChange = { handleInputChange  } value ={ fecha_ingreso }/>
                          <div style={{ fontSize:12, color:"red" }}> { error.errorFechaIngreso }</div>
                      </div>

                      <div className="p-field p-col-12 p-md-2 p-mt-1 ">
                          <label htmlFor="celular">Fecha Egreso</label>
                          <InputMask  name="fecha_egreso" type="text" mask="99/99/9999" placeholder="dd/mm/yyyy" slotChar="dd/mm/yyyy" 
                          onChange = { handleInputChange  } value ={ fecha_egreso }/>
                          <div style={{ fontSize:12, color:"red" }}> { error.errorFechaEgreso }</div>
                      </div>

                      <div className="p-field p-col-12 p-md-3 p-mt-1 ">
                          <label htmlFor="persona_emergencia">Persona Emergencia</label>
                          <InputText  name="persona_emergencia" type="text"  className =  { error.errorPersonaEmergencia?.length && error.errorClass }
                          onChange = { handleInputChange  } value ={ persona_emergencia }/>
                          <div style={{ fontSize:12, color:"red" }}> { error.errorPersonaEmergencia }</div>
                      </div>

                      <div className="p-field p-col-12 p-md-3 p-mt-1 ">
                          <label htmlFor="telefono_emergencia">Teléfono Persona Emergencia</label>
                          <InputMask  name="telefono_emergencia" type="text" mask="(999) 999-9999" placeholder="(999) 999-9999" 
                          onChange = { handleInputChange  } value ={ telefono_emergencia }/>
                          <div style={{ fontSize:12, color:"red" }}> { error.errorTelefonoEmergencia }</div>
                      </div>

                      <div className="p-field p-col-12 p-md-3 p-mt-1 ">
                          <label htmlFor="sueldo">Sueldo</label>
                          <InputText  name="sueldo" type="text"  className =  { error.errorSueldo?.length && error.errorClass }
                          onChange = { handleInputChange  } value ={ sueldo }/>
                          <div style={{ fontSize:12, color:"red" }}> { error.errorSueldo }</div>
                      </div>

                        <div className="p-field p-col-12 p-md-3 p-mt-1 ">
                            <label htmlFor="estado">Estado</label>
							<Dropdown name="estado" value={estado} options={estados} optionLabel="label" 
                             placeholder="Seleccione Estado" 
                            onChange = { handleInputChange  } />
                            <div style={{ fontSize:12, color:"red" }}> { error.errorGrado }</div>
                        </div>
                        <div className="p-field p-col-12 p-md-12 p-mt-1 ">
                          <label htmlFor="observacion">Obsevación</label>
                          <InputTextarea   name="observacion" type="text"  className =  { error.errorObservacion?.length && error.errorClass } rows={5}
                          onChange = { handleInputChange  } value ={ observacion }/>
                          <div style={{ fontSize:12, color:"red" }}> { error.errorObservacion }</div>
                      </div>                        

                    </div>
                    
                </form>
           </Dialog>


           <Dialog visible={deleteDialogShow} style={{ width: '30%' }} header="Confirmación" modal footer={deleteDialogFooter} onHide={()=>hideShowDeleteDialog(false)}>
                       <div className="confirmation-content">
                           <i className="pi pi-exclamation-triangle p-mr-3" style={{ fontSize: '2rem' }} />
                           { <span>Esta seguro de borrar el registro :  <b style={{'color':'red'}}>{ nombres } { apellidos}</b>?</span>}
                       </div>
           </Dialog>


					</div>
				</div>
			</div>
		</div>
	)

}
