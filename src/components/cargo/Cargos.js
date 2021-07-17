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
import { addCargoAction, listarCargosAction, updateCargoAction, deleteCargoAction, updateCargoActual } from './cargoDucks';
import moment from 'moment';


export const Cargos =   () => {

    const { cargos, cargo_actual } = useSelector(state => state.cargo);
	
  
    const dispatch = useDispatch();
    const [ globalFilter, setGlobalFilter] = useState(null);
    const [ cargoDialog, setCargoDialog ] = useState(false);
    const [cargoActual, setCargoActual] = useState(null);
    const { uid } = useSelector(state => state.login);
    const toast = useRef(null);
    const dt = useRef(null);
    const [actualizar, setActualizar] = useState(false);
    const [deleteDialogShow, setDeleteDialogShow] = useState(false);
    const [nombreCargoDelete, setNombreCargoDelete] = useState('');
    const [idCargoDelete, setIdCargoDelete] = useState('');

    const [error, setError] = useState({
        errorNombre:'',
        errorDireccion:'',
        errorEmail:'',
        errorClass:''       
    })

	const [ formValue, setFormValue, handleInputChange, reset ] = useForm({
    	nombre_cargo:'',
		id:0,
		usrcre:'usrcre',
		feccre: new Date(),
		usrmod:'usrmod',
		fecmod: new Date()
	});
    
    useEffect(() => {
        dispatch(listarCargosAction(uid));
     }, [dispatch, uid])

    const { nombre_cargo,cargo_id,usrcre,feccre,usrmod,fecmod } = formValue;

    useEffect(() =>{
        dispatch( updateCargoActual(formValue));
    },[nombre_cargo]);
            
    
      

	const addDlg = (cargo) =>{
        setActualizar(false);
		setCargoDialog(true);
	}

    const editDlg = (pcargo) =>{
        
        setActualizar(true);

        setFormValue({
            
			nombre_cargo: pcargo.nombre_cargo,
			id: pcargo.id,
			usrcre: pcargo.usrcre,
			feccre: pcargo.feccre,
			usrmod: pcargo.usrmod,
			fecmod: pcargo.fecmod
        })
 		setCargoDialog(true);
	}

         
	const onHide = (name) => {
        setError({});  
        reset();
        setCargoDialog(false);

    }

    const handleDeleteCargo = () =>{
        dispatch(deleteCargoAction(idCargoDelete));
        hideShowDeleteDialog(false);
    }
    
    const onSubmit = () =>{


		  if (!isFormValid()){
              return false;
          }
         
          if (actualizar){
            dispatch( updateCargoAction(formValue) );
          }else{
            dispatch( addCargoAction( formValue ) );
          }
          setCargoDialog(false);
          reset();

          

    }
    
    const header = (
		<div className="table-header">
			<h5 id="id_label_search" className="p-m-0">Listado de Cargos</h5>
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
        <>
            <Button label="Cancelar" icon="pi pi-times" className="p-button-text" onClick={()=>hideShowDeleteDialog(false)} />
            <Button label="Borrar" icon="pi pi-check" className="p-button-text" onClick={()=>handleDeleteCargo()} />
        </>
    );

    

    const hideDeleteDialog = () =>{
        hideShowDeleteDialog(false);         
    }
          
      const showDeleteCargo = (id, nombre) =>{
        setNombreCargoDelete(nombre);
        setIdCargoDelete(id);
        hideShowDeleteDialog(true);
    }

    const hideShowDeleteDialog = (hideShow) =>{
          setDeleteDialogShow(hideShow);
    }

    const isFormValid = () =>{
    setError({});   
    let errorNombre = '';
    let errorDireccion = '';
    let errorEmail = '';
    
        if (nombre_cargo.trim().length === 0 ){
            errorNombre = 'El nombre es obligatorio';
        } 

        if (errorNombre){
            setError({errorNombre, errorDireccion, errorEmail, errorClass:'errorClass'});
            return false
        }
        return true;
    }

    const actionBodyTemplate = (rowData) => {
        
        return (

            <div className="actions" style={{width:"75px"}}>
                <Button icon="pi pi-pencil" className="p-button-rounded p-button-success p-mr-2" onClick={() => editDlg(rowData)} />
                <Button icon="pi pi-trash" className="p-button-rounded p-button-warning" onClick={ ()=>showDeleteCargo(rowData.id, rowData.nombre_cargo) } />
            </div>
        );
    }
   
    const exportCSV = () => {
        dt.current.exportCSV();
    }

    const FormatDate =(fecha) =>{
        return moment(fecha).format("DD/MM/YYYY"); 
    }

	return (
		<div>
			<div className="p-grid crud-demo">
				<div className="p-col-12">
					<div className="card">
						<Toast ref={toast} />
						<DataTable   value={cargos}   ref={dt} 
                        onSelectionChange={  (e) =>setCargoActual(e.value) } 
						header="Small Table" 
							dataKey="id" paginator rows={10} rowsPerPageOptions={[5, 10, 25]} className="datatable-responsive p-datatable-sm"
							paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown" globalFilter={globalFilter}
							currentPageReportTemplate="Showing {first} to {last} of {totalRecords} Cargos"
							emptyMessage="No existen registros"  header={header} selectionMode="single" 
							>
{/* 						<Column style={{width:"2.3%" }} selectionMode="multiple" ></Column> */}	
							<Column style={{width:"55%" }} field="nombre_cargo" header="Nombre Cargo" sortable ></Column>
							<Column  field="usrcre" header="Creado Por" sortable ></Column>
			
							<Column field="feccre" header="Fecha Creado"  sortable></Column>
							<Column field="usrmod" header="Modificado Por" sortable ></Column>
                            <Column field="fecmod" header="Fecha Modificado" sortable ></Column>
							<Column header="Acción" style={{ width:"5.6%" }} body={actionBodyTemplate} > </Column>
						</DataTable>

				   

		 	<Dialog visible={cargoDialog} style={{ width: '30%' }} header="Cargo" modal className="p-fluid" footer={footer} onHide={onHide}>
                <form  >


                    <div className="p-fluid p-formgrid p-grid">
            
                        <div className="p-field p-col-12 p-md-12 p-mt-3 ">
                            <label htmlFor="firstname6">Nombre cargo</label>
                            <InputText name="nombre_cargo" type="text"  className =  { error.errorNombre?.length && error.errorClass } autoFocus
                            onChange = { handleInputChange  } value ={ nombre_cargo }/>
                            <div style={{ fontSize:12, color:"red" }}> { error.errorNombre }</div>
                        </div>


                    </div>
                    
                </form>
           </Dialog>


           <Dialog visible={deleteDialogShow} style={{ width: '450px' }} header="Confirmación" modal footer={deleteDialogFooter} onHide={()=>hideShowDeleteDialog(false)}>
                       <div className="confirmation-content">
                           <i className="pi pi-exclamation-triangle p-mr-3" style={{ fontSize: '2rem' }} />
                           { <span>Esta seguro de borrar el registro :  <b style={{'color':'red'}}>{ nombreCargoDelete }</b>?</span>}
                       </div>
                   </Dialog>


					</div>
				</div>
			</div>
		</div>
	)
}
