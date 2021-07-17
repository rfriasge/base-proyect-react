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
import { addDepartamentoAction, listarDepartamentosAction, updateDepartamentoAction, deleteDepartamentoAction, updateDepartamentoActual } from './DepartamentoDucks';
import moment from 'moment';


export const Departamentos =   () => {

    const { departamentos, departamento_actual } = useSelector(state => state.departamento);
	
  
    const dispatch = useDispatch();
    const [ globalFilter, setGlobalFilter] = useState(null);
    const [ departamentoDialog, setDepartamentoDialog ] = useState(false);
    const [departamentoActual, setDepartamentoActual] = useState(null);
    const { uid } = useSelector(state => state.login);
    const toast = useRef(null);
    const dt = useRef(null);
    const [actualizar, setActualizar] = useState(false);
    const [deleteDialogShow, setDeleteDialogShow] = useState(false);
    const [nombreDepartamentoDelete, setNombreDepartamentoDelete] = useState('');
    const [idDepartamentoDelete, setIdDepartamentoDelete] = useState('');

    const [error, setError] = useState({
        errorNombre:'',
        errorDireccion:'',
        errorEmail:'',
        errorClass:''       
    })

	const [ formValue, setFormValue, handleInputChange, reset ] = useForm({
    	nombre_departamento:'',
		id:0,
		usrcre:'usrcre',
		feccre: new Date(),
		usrmod:'usrmod',
		fecmod: new Date()
	});
    
    useEffect(() => {
        dispatch(listarDepartamentosAction(uid));
     }, [dispatch, uid])

    const { nombre_departamento,departamento_id,usrcre,feccre,usrmod,fecmod } = formValue;

    useEffect(() =>{
        dispatch( updateDepartamentoActual(formValue));
    },[nombre_departamento]);
            
    
      

	const addDlg = (departamento) =>{
        setActualizar(false);
		setDepartamentoDialog(true);
	}

    const editDlg = (pdepartamento) =>{
        
        setActualizar(true);

        setFormValue({
            
			nombre_departamento: pdepartamento.nombre_departamento,
			id: pdepartamento.id,
			usrcre: pdepartamento.usrcre,
			feccre: pdepartamento.feccre,
			usrmod: pdepartamento.usrmod,
			fecmod: pdepartamento.fecmod
        })
 		setDepartamentoDialog(true);
	}

         
	const onHide = (name) => {
        setError({});  
        reset();
        setDepartamentoDialog(false);

    }

    const handleDeleteDepartamento = () =>{
        dispatch(deleteDepartamentoAction(idDepartamentoDelete));
        hideShowDeleteDialog(false);
    }
    
    const onSubmit = () =>{


		  if (!isFormValid()){
              return false;
          }
         
          if (actualizar){
            dispatch( updateDepartamentoAction(formValue) );
          }else{
            dispatch( addDepartamentoAction( formValue ) );
          }
          setDepartamentoDialog(false);
          reset();

          

    }
    
    const header = (
		<div className="table-header">
			<h5 id="id_label_search" className="p-m-0">Listado de Departamentos</h5>
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
            <Button label="Borrar" icon="pi pi-check" className="p-button-text" onClick={()=>handleDeleteDepartamento()} />
        </>
    );

    

    const hideDeleteDialog = () =>{
        hideShowDeleteDialog(false);         
    }
          
      const showDeleteDepartamento = (id, nombre) =>{
        setNombreDepartamentoDelete(nombre);
        setIdDepartamentoDelete(id);
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
    
        if (nombre_departamento.trim().length === 0 ){
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
                <Button icon="pi pi-trash" className="p-button-rounded p-button-warning" onClick={ ()=>showDeleteDepartamento(rowData.id, rowData.nombre_departamento) } />
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
						<DataTable   value={departamentos}   ref={dt} 
                        onSelectionChange={  (e) =>setDepartamentoActual(e.value) } 
						header="Small Table" 
							dataKey="id" paginator rows={10} rowsPerPageOptions={[5, 10, 25]} className="datatable-responsive p-datatable-sm"
							paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown" globalFilter={globalFilter}
							currentPageReportTemplate="Showing {first} to {last} of {totalRecords} Departamentos"
							emptyMessage="No existen registros"  header={header} selectionMode="single" 
							>
{/* 						<Column style={{width:"2.3%" }} selectionMode="multiple" ></Column> */}	
							<Column style={{width:"55%" }} field="nombre_departamento" header="Nombre Departamento" sortable ></Column>
							<Column  field="usrcre" header="Creado Por" sortable ></Column>
			
							<Column field="feccre" header="Fecha Creado"  sortable></Column>
							<Column field="usrmod" header="Modificado Por" sortable ></Column>
                            <Column field="fecmod" header="Fecha Modificado" sortable ></Column>
							<Column header="Acción" style={{ width:"5.6%" }} body={actionBodyTemplate} > </Column>
						</DataTable>

				   

		 	<Dialog visible={departamentoDialog} style={{ width: '30%' }} header="Departamento" modal className="p-fluid" footer={footer} onHide={onHide}>
                <form  >


                    <div className="p-fluid p-formgrid p-grid">
            
                        <div className="p-field p-col-12 p-md-12 p-mt-3 ">
                            <label htmlFor="firstname6">Nombre departamento</label>
                            <InputText name="nombre_departamento" type="text"  className =  { error.errorNombre?.length && error.errorClass }
                            onChange = { handleInputChange  } value ={ nombre_departamento }/>
                            <div style={{ fontSize:12, color:"red" }}> { error.errorNombre }</div>
                        </div>


                    </div>
                    
                </form>
           </Dialog>


           <Dialog visible={deleteDialogShow} style={{ width: '450px' }} header="Confirmación" modal footer={deleteDialogFooter} onHide={()=>hideShowDeleteDialog(false)}>
                       <div className="confirmation-content">
                           <i className="pi pi-exclamation-triangle p-mr-3" style={{ fontSize: '2rem' }} />
                           { <span>Esta seguro de borrar el registro :  <b style={{'color':'red'}}>{ nombreDepartamentoDelete }</b>?</span>}
                       </div>
                   </Dialog>


					</div>
				</div>
			</div>
		</div>
	)
}
