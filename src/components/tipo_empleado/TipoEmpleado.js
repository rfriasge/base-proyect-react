import React, { useRef, useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux';
import { Toast } from 'primereact/toast';
import validator from 'validator';
import { Dialog } from 'primereact/dialog';
import { Button } from 'primereact/button';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { InputMask } from 'primereact/inputmask';
import { InputText } from 'primereact/inputtext';
import { useForm } from '../../hooks/useForm';
import { addTipoEmpleadoAction, listarTiposEmpleadoAction, updateTipoEmpleadoAction, deleteTipoEmpleadoAction, updateTipoEmpleadoActual } from './tipoEmpleadoDucks';



export const TipoEmpleado = () => {


    const { tipos_empleado } = useSelector(state => state.tipo_empleado);
    
  
    const dispatch = useDispatch();
    const [ globalFilter, setGlobalFilter] = useState(null);
    const [ tipoEmpleadoDialog, setTipoEmpleadoDialog ] = useState(false);
    const { uid } = useSelector(state => state.login);
    const toast = useRef(null);
    const dt = useRef(null);
    const [actualizar, setActualizar] = useState(false);
    const [deleteDialogShow, setDeleteDialogShow] = useState(false);
    const [desTipoEmpleadoDelete, setDesTipoEmpleadoDelete] = useState('');
    const [idTipoEmpleadoDelete, setIdTipoEmpleadoDelete] = useState('');

    const [error, setError] = useState({
        errorNombre:'',
        errorDireccion:'',
        errorEmail:'',
        errorClass:''       
    })

	const [ formValue, setFormValue, handleInputChange, reset ] = useForm({
    	des_tipo_empleado:'',
		id:0,
		usrcre:'usrcre',
		feccre: new Date(),
		usrmod:'usrmod',
		fecmod: new Date()
	});
    
    useEffect(() => {
        dispatch(listarTiposEmpleadoAction(uid));
     }, [dispatch, uid])

    const { des_tipo_empleado,id,usrcre,feccre,usrmod,fecmod } = formValue;

    useEffect(() =>{
        dispatch( updateTipoEmpleadoActual(formValue));
    },[formValue, dispatch]);
            
    
      

	const addDlg = () =>{
        setActualizar(false);
		setTipoEmpleadoDialog(true);
	}

    const editDlg = (tipo_empleado) =>{
        
        setActualizar(true);

        setFormValue({
            
			des_tipo_empleado: tipo_empleado.des_tipo_empleado,
			id: tipo_empleado.id,
			usrcre: tipo_empleado.usrcre,
			feccre: tipo_empleado.feccre,
			usrmod: tipo_empleado.usrmod,
			fecmod: tipo_empleado.fecmod
        })
 		setTipoEmpleadoDialog(true);
	}

         
	const onHide = (name) => {
        setError({});  
        reset();
        setTipoEmpleadoDialog(false);

    }

    const handleDeleteTipoEmpleado = () =>{
        dispatch(deleteTipoEmpleadoAction(idTipoEmpleadoDelete));
        hideShowDeleteDialog(false);
    }
    
    const onSubmit = () =>{

		  if (!isFormValid()){
              return false;
          }
         

          if (actualizar){
            dispatch( updateTipoEmpleadoAction() );
          }else{
            dispatch( addTipoEmpleadoAction() );
          }
          setTipoEmpleadoDialog(false);
          reset();
        
    }

	

    const header = (
		<div className="table-header">
			<h5 id="id_label_search" className="p-m-0">Listado Tipos Empleado</h5>
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
            <Button label="Grabar xxx" icon="pi pi-check" onClick={onSubmit} />
            <Button label="Cancelar" icon="pi pi-times" onClick={onHide} />
        </div>
    );

    const deleteDialogFooter =(rowData) => (
    	<div>
        	<Button label="Cancelar" icon="pi pi-times" className="p-button-text" onClick={()=>hideShowDeleteDialog(false)} />
        	<Button label="Borrar" icon="pi pi-check" className="p-button-text" onClick={()=>handleDeleteTipoEmpleado()} />
    	</div>
	);
 
    const showDeleteTipoEmpleado = (id, nombre) =>{
        setDesTipoEmpleadoDelete(nombre);
        setIdTipoEmpleadoDelete(id);
        hideShowDeleteDialog(true);
    }

    const hideShowDeleteDialog = (hideShow) =>{
          setDeleteDialogShow(hideShow);
    }

    const isFormValid = () =>{
    setError({});   
    let errorDesTipoEmpleado = '';


    
        if (des_tipo_empleado.trim().length === 0 ){
            errorDesTipoEmpleado = 'Descripción es obligatoria';
        } 

        if (errorDesTipoEmpleado){
            setError({errorDesTipoEmpleado, errorClass:'errorClass'});
            return false
        }
        return true;
    }

    const actionBodyTemplate = (rowData) => {
        
        return (

            <div className="actions" style={{width:"75px"}}>
                <Button icon="pi pi-pencil" className="p-button-rounded p-button-success p-mr-2" onClick={() => editDlg(rowData)} />
                <Button icon="pi pi-trash" className="p-button-rounded p-button-warning" onClick={ ()=>showDeleteTipoEmpleado(rowData.id, rowData.des_tipo_empleado) } />
            </div>
        );
    }
   
    const exportCSV = () => {
        dt.current.exportCSV();
    }    
    return (
		<div>
			<div className="p-grid crud-demo">
				<div className="p-col-12">
					<div className="card">
						<Toast ref={toast} />
						<DataTable   value={tipos_empleado}   ref={dt} 
						    header="Small Table" 
							dataKey="id" paginator rows={10} rowsPerPageOptions={[5, 10, 25]} className="datatable-responsive p-datatable-sm"
							paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown" globalFilter={globalFilter}
							currentPageReportTemplate="Showing {first} to {last} of {totalRecords} Tipos Empleado"
							emptyMessage="No existen registros"  header={header} selectionMode="single" 
							>
							<Column style={{width:"55%" }} field="des_tipo_empleado" header="Descripción Tipo Empleado" sortable ></Column>
							<Column field="usrcre" header="Creado Por" sortable ></Column>
							<Column field="feccre" header="Fecha Creado"  sortable></Column>
							<Column field="usrmod" header="Modificado Por" sortable ></Column>
                            <Column field="fecmod" header="Fecha Modificado" sortable ></Column>
							<Column header="Acción" style={{ width:"5.6%" }} body={actionBodyTemplate} > </Column>
						</DataTable>

				   

		 	<Dialog visible={tipoEmpleadoDialog} style={{ width: '30%' }} header="Tipo Empleado" modal className="p-fluid" footer={footer} onHide={onHide}>
                <form  >


                    <div className="p-fluid p-formgrid p-grid">
            
                        <div className="p-field p-col-12 p-md-12 p-mt-3 ">
                            <label htmlFor="firstname">Descripción Tipo Empleado</label>
                            <InputText name="des_tipo_empleado" type="text"  className =  { error.errorDesTipoEmpleado?.length && error.errorClass } autoFocus
                            onChange = { handleInputChange  } value ={ des_tipo_empleado }/>
                            <div style={{ fontSize:12, color:"red" }}> { error.errorDesTipoEmpleado }</div>
                        </div>


                    </div>
                    
                </form>
           </Dialog>


           <Dialog visible={deleteDialogShow} style={{ width: '450px' }} header="Confirmación" modal footer={deleteDialogFooter} onHide={()=>hideShowDeleteDialog(false)}>
                       <div className="confirmation-content">
                           <i className="pi pi-exclamation-triangle p-mr-3" style={{ fontSize: '2rem' }} />
                           { <span>Esta seguro de borrar el registro :  <b style={{'color':'red'}}>{ desTipoEmpleadoDelete }</b>?</span>}
                       </div>
           </Dialog>


					</div>
				</div>
			</div>
		</div>
	)
}

