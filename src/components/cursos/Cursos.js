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
import { useForm } from '../../hooks/useForm';
import CurrencyInput from 'react-currency-masked-input';
import { Dropdown } from 'primereact/dropdown';
import { addCursoAction, listarCursoAction, updateCursoAction, deleteCursoAction, updateCursoActual } from "./CursosDucks";
import { listarGradoAction } from "../grado/gradosDucks";
import moment from 'moment';

 

export const Cursos = () => {

  
    const { cursos, curso_actual } = useSelector(state => state.curso);
	
	
   const dispatch = useDispatch();
    const [ globalFilter, setGlobalFilter] = useState(null);
    const [ cursoDialog, setCursoDialog ] = useState(false);
    const [ cursoActual, setCursoActual] = useState(null);
    const { uid } = useSelector(state => state.login);
	const { grados } = useSelector(state => state.grado);
	const { tandas } = useSelector(state => state.curso);
    const toast = useRef(null);
    const dt = useRef(null);
    const [actualizar, setActualizar] = useState(false);
    const [deleteDialogShow, setDeleteDialogShow] = useState(false);
	
    
    const [error, setError] = useState({
        errorDescripcion:'',
        errorClass:''       
    })

	const [ formValue, setFormValue, handleInputChange, reset ] = useForm({
    	descripcion:'',
		id:0,
		grado:'',
		aula:'',
		tanda:'',
		usrcre:'usrcre',
		feccre: new Date(),
		usrmod:'usrmod',
		fecmod: new Date()
	});
    
    useEffect(() => {
        dispatch(listarCursoAction(uid));
		dispatch(listarGradoAction(uid));
     }, [dispatch, uid]);

    const { descripcion,id, grado, aula, tanda, usrcre,feccre,usrmod,fecmod } = formValue;

    useEffect(() =>{
        dispatch( updateCursoActual(formValue));
    },[formValue]);
    
            
    const addDlg = () =>{
        reset();
        setActualizar(false);
		setCursoDialog(true);
	}

    const editDlg = (curso) =>{
        setActualizar(true);
        actualizaCursoActual(curso);
 		setCursoDialog(true);
	}

    const deleteDlg = (curso) =>{
        actualizaCursoActual(curso);
        hideShowDeleteDialog(true);
	}

         
    const actualizaCursoActual = (curso) =>{
        setFormValue({
			descripcion: curso.descripcion,
			id: curso.id,
			grado:curso.grado,
			aula: curso.aula,
			tanda: curso.tanda,
			usrcre: curso.usrcre,
			feccre: curso.feccre,
			usrmod: curso.usrmod,
			fecmod: curso.fecmod
        })
    }
	const onHide = (name) => {
        setError({});  
        reset();
        setCursoDialog(false);

    }

    const handleDeleteCurso = (_id) =>{
        dispatch(deleteCursoAction(_id));
        hideShowDeleteDialog(false);
    }
    
    const onSubmit = () =>{


		  if (!isFormValid()){
              return false;
          }
         
          if (actualizar){
            dispatch( updateCursoAction() );
          }else{
            dispatch( addCursoAction() );
          }
          setCursoDialog(false);
          reset();
        
    }

    const hideShowDeleteDialog = (hideShow) =>{
        setDeleteDialogShow(hideShow);
  }

  const isFormValid = () =>{
      setError({});   
      let errorDescripcion = '';
  
      if (descripcion.trim().length === 0 ){
          errorDescripcion = 'Descripción es obligatoria';
      } 

      if (errorDescripcion){
          setError({errorDescripcion, errorClass:'errorClass'});
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
			<h5 id="id_label_search" className="p-m-0">Listado de Cursos</h5>
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
        	<Button label="Borrar" icon="pi pi-check" className="p-button-text" onClick={()=>handleDeleteCurso()} />
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
						<DataTable   value={cursos}   ref={dt}  id="tbCurso"
                        onSelectionChange={  (e) =>setCursoActual(e.value) } 
						header="Small Table" 
							dataKey="id" paginator rows={10} rowsPerPageOptions={[5, 10, 25]} className="datatable-responsive p-datatable-sm"
							paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown" globalFilter={globalFilter}
							currentPageReportTemplate="Showing {first} to {last} of {totalRecords} Cursos"
							emptyMessage="No existen registros"  header={header} selectionMode="single">
							<Column style={{width:"20%" }} field="descripcion" header="Descripción Curso" sortable ></Column>
                            <Column style={{width:"10%" }} field="grado.descripcion" header="Grado" sortable ></Column>
                            <Column style={{width:"10%" }} field="aula" header="Aula" sortable ></Column>
                            <Column style={{width:"10%" }} field="tanda" header="Tanda" sortable ></Column>
							<Column field="usrcre" header="Creado Por" sortable ></Column>
							<Column field="feccre" header="Fecha Creado"  sortable></Column>
							<Column field="usrmod" header="Modificado Por" sortable ></Column>
                            <Column field="fecmod" header="Fecha Modificado" sortable ></Column>
							<Column header="Acción" style={{ width:"5.6%" }} body={actionBodyTemplate} > </Column>
						</DataTable>

				   

		 	<Dialog visible={cursoDialog} style={{ width: '30%' }} header="Curso" modal className="p-fluid" footer={footer} onHide={onHide}>
                <form  >


                    <div className="p-fluid p-formgrid p-grid">
            
                        <div className="p-field p-col-12 p-md-9 p-mt-3 ">
                            <label htmlFor="descripcion">Descripción de la Curso</label>
                            <InputText  name="descripcion" type="text"  className =  { error.errorDescripcion?.length && error.errorClass } autoFocus 
                            onChange = { handleInputChange  } value ={ descripcion }/>
                            <div style={{ fontSize:12, color:"red" }}> { error.errorDescripcion }</div>
                        </div>

                        <div className="p-field p-col-12 p-md-3 p-mt-3 ">
                            <label htmlFor="aula">Aula</label>
                            <InputText  name="aula" type="text"  className =  { error.errorAula?.length && error.errorClass }
                            onChange = { handleInputChange  } value ={ aula }/>
                            <div style={{ fontSize:12, color:"red" }}> { error.errorAula }</div>
                        </div>

                        <div className="p-field p-col-12 p-md-6 p-mt-3 ">
                            <label htmlFor="grado">Grado</label>
							<Dropdown name="grado" value={grado} options={grados} optionLabel="descripcion" 
                             placeholder="Seleccione el Grado" itemTemplate={gradoOptionTemplate} 
                            onChange = { handleInputChange  } />
                            <div style={{ fontSize:12, color:"red" }}> { error.errorGrado }</div>
                        </div>

                        <div className="p-field p-col-12 p-md-6 p-mt-3 ">
                            <label htmlFor="tanda">Tanda</label>
							<Dropdown name="tanda" value={tanda} options={tandas} optionLabel="label" 
                             placeholder="Seleccione la Tanda" 
                            onChange = { handleInputChange  } />
                            <div style={{ fontSize:12, color:"red" }}> { error.errorTanda }</div>
                        </div>						

                    </div>
                    
                </form>
           </Dialog>


           <Dialog visible={deleteDialogShow} style={{ width: '30%' }} header="Confirmación" modal footer={deleteDialogFooter} onHide={()=>hideShowDeleteDialog(false)}>
                       <div className="confirmation-content">
                           <i className="pi pi-exclamation-triangle p-mr-3" style={{ fontSize: '2rem' }} />
                           { <span>Esta seguro de borrar el registro :  <b style={{'color':'red'}}>{ descripcion }</b>?</span>}
                       </div>
           </Dialog>


					</div>
				</div>
			</div>
		</div>
	)

}
