import React, { useRef, useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux';
import { Toast } from 'primereact/toast';
import validator from 'validator';
import { Dialog } from 'primereact/dialog';
import { Button } from 'primereact/button';
//import classNames from 'classnames';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
//import { FileUpload } from 'primereact/fileupload';
//import { Rating } from 'primereact/rating';
//import { Toolbar } from 'primereact/toolbar';
//import { InputTextarea } from 'primereact/inputtextarea';
//import { RadioButton } from 'primereact/radiobutton';
//import { InputNumber } from 'primereact/inputnumber';
import { InputMask } from 'primereact/inputmask';
import { InputText } from 'primereact/inputtext';
//import { useForm } from "react-hook-form";
import { useForm } from '../../hooks/useForm';
//import { loadColegios } from './colegioAcciones';
import { listarColegiosAccion, addColegio, editColegio, updateColegio, deleteColegio } from './colegioDucks';
//       


export const Colegio =   () => {


    
    
    const dispatch = useDispatch();
    const [ globalFilter, setGlobalFilter] = useState(null);
    const [ colegioDialog, setColegioDialog ] = useState(false);
	const { colegios } = useSelector  (state => state.colegio)
    const [colegioActual, setColegioActual] = useState(null);
    const { uid } = useSelector(state => state.login);
    const toast = useRef(null);
    const dt = useRef(null);
    const [actualizar, setActualizar] = useState(false);
    const [deleteDialogShow, setDeleteDialogShow] = useState(false);
    const [nombreColegioDelete, setNombreColegioDelete] = useState('');
    const [idColegioDelete, setIdColegioDelete] = useState('');

    const [error, setError] = useState({
        errorNombre:'',
        errorDireccion:'',
        errorEmail:'',
        errorClass:''       
    })

	const [ formValue, setFormValue, handleInputChange, reset ] = useForm({
        id:'',
        nombre:'',
        direccion:'',
        telefono1:'',
        telefono2:'',
        email:'',
        director:'',
        rnc:'',
        anoEscolarActual:0,
        direccionRegional:'',
        distritoEscolar:'',
        codigoColegio:'',
        ciudadEmision:'',
        tanda:'',
        sector:'',
        secretariaDocente:'',
        directorDistrito:'',
        supervidorDistrito:'',
        diasGraciaCobro:0
    });
    
    useEffect(() => {
       dispatch(listarColegiosAccion(uid));
    }, [dispatch, uid])

            
    const {nombre,direccion,telefono1,telefono2,email,director,secretariaDocente,codigoColegio,direccionRegional,
		distritoEscolar,directorDistrito,supervidorDistrito,diasGraciaCobro } = formValue;

        



	const addDlg = (colegio) =>{
        setActualizar(false);
		setColegioDialog(true);
	}

    const editDlg = (colegio) =>{
        //console.log(colegio);
        setActualizar(true);
        dispatch(editColegio(colegio));
        setFormValue({
            id:colegio.id,
            nombre:colegio.nombre,
            direccion:colegio.direccion,
            telefono1:colegio.telefono1,
            telefono2:colegio.telefono2,
            email:colegio.email,
            director:colegio.director,
            rnc:null,
            anoEscolarActual:0,
            direccionRegional:colegio.direccionRegional,
            distritoEscolar:colegio.distritoEscolar,
            codigoColegio:colegio.codigoColegio,
            ciudadEmision:null,
            tanda:null,
            sector:null,
            secretariaDocente:colegio.secretariaDocente,
            directorDistrito:colegio.directorDistrito,
            supervidorDistrito:colegio.supervidorDistrito,
            diasGraciaCobro:colegio.diasGraciaCobro
        })
 		setColegioDialog(true);
	}

         
	const onHide = (name) => {
        setError({});  
        reset();
        setColegioDialog(false);

    }
    const onSubmit = () =>{

		  if (!isFormValid()){
              return false;
          }

          if (actualizar){
            dispatch( updateColegio( formValue, uid ) );
          }else{
            dispatch( addColegio( formValue, uid ) );
          }
          setColegioDialog(false);
          reset();
          //dispatch(listarColegiosAccion(uid));

    }
    
    const header = (
		<div className="table-header">
			<h5 id="id_label_search" className="p-m-0">Listado de Colegios</h5>
			<Button label="Export Excel" icon="pi pi-upload" className="p-button-help"  style={{marginRight:"10px"}}  onClick={()=>exportCSV()} /> 			
			<Button  id="btn_new" label="Agregar" icon="pi pi-plus" onClick={ addDlg } />
			<span id="text_search"  className="p-input-icon-left">
			   <i className="pi pi-search" />
				<InputText id="id_text_search" type="search" onInput={(e) => setGlobalFilter(e.target.value)} />
			</span>
		</div>
	);

	const footer = (
        <div>
            <Button label="Grabar" icon="pi pi-check" onClick={onSubmit} />
            <Button label="Cancelar" icon="pi pi-times" onClick={onHide} />
        </div>
    );

    
    const deleteDialogFooter =() => (
        <>
            <Button label="Cancelar" icon="pi pi-times" className="p-button-text" onClick={()=>hideShowDeleteDialog(false)} />
            <Button label="Borrar" icon="pi pi-check" className="p-button-text" onClick={()=>borrarColegio(idColegioDelete, uid)} />
        </>
    );

    

    const hideDeleteDialog = () =>{
           
    }
    const borrarColegio  = (id, uid) =>{
        dispatch(deleteColegio(id));
        hideShowDeleteDialog(false);

    }
    const showDeleteColegio = (id, nombre) =>{
        setNombreColegioDelete(nombre);
        setIdColegioDelete(id);
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
    
        if (nombre.trim().length === 0 ){
            errorNombre = 'El nombre es obligatorio';
        } 

        if ( email.trim().length === 0 ){
            errorEmail = 'Email es obligatorio';
        }else if ( !validator.isEmail(email) ){
            errorEmail = 'Email no valido';
        }

        if (direccion.trim().length === 0 ){
            errorDireccion = 'La dirección es obligatoria';
        } 

        if (errorNombre || errorDireccion || errorEmail){
            setError({errorNombre, errorDireccion, errorEmail, errorClass:'errorClass'});
            return false
        }
        return true;
    }

    const actionBodyTemplate = (rowData) => {
        
        return (

            <div className="actions" style={{width:"75px"}}>
                <Button icon="pi pi-pencil" className="p-button-rounded p-button-success p-mr-2" onClick={() => editDlg(rowData)} />
                <Button icon="pi pi-trash" className="p-button-rounded p-button-warning" onClick={ ()=>showDeleteColegio(rowData.id, rowData.nombre) } />
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
                        {/* <DataTable  ref={dt} value={products} selection={selectedProducts} onSelectionChange={(e) => setSelectedProducts(e.value)} */}
						<DataTable   value={colegios}   ref={dt} 
                        onSelectionChange={  (e) =>setColegioActual(e.value) } 
						header="Small Table" 
							dataKey="id" paginator rows={10} rowsPerPageOptions={[5, 10, 25]} className="datatable-responsive p-datatable-sm"
							paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown" globalFilter={globalFilter}
							currentPageReportTemplate="Showing {first} to {last} of {totalRecords} colegios"
							emptyMessage="No existen registros"  header={header} selectionMode="single" 
							>
							{/* < style={{width:"2.3%" }} selectionMode="multiple" ></ Column> */}
							<Column style={{width:"60%" }} field="nombre" header="Nombre Colegio" sortable ></Column>
							<Column  field="telefono1" header="Teléfono 1" sortable ></Column>
			
							<Column field="telefono2" header="Teléfono 2"  sortable></Column>
							<Column field="email" header="Email" sortable ></Column>
							<Column header="Acción" style={{ width:"5.6%" }} body={actionBodyTemplate} > </Column>
						</DataTable>

				   

		 	<Dialog visible={colegioDialog} style={{ width: '50%' }} header="Colegio" modal className="p-fluid" footer={footer} onHide={onHide}>
                <form  >


                    <div className="p-fluid p-formgrid p-grid">
            
                        <div className="p-field p-col-12 p-md-12 p-mt-3 ">
                            <label htmlFor="firstname6">Nombre colegio</label>
                            <InputText name="nombre" type="text"  className =  { error.errorNombre?.length && error.errorClass } autoFocus
                            onChange = { handleInputChange } value={ nombre }/>
                            <div style={{ fontSize:12, color:"red" }}> { error.errorNombre }</div>
                        </div>


                        <div className="p-field p-col-12 p-md-3">
                            <label htmlFor="telefono1">Teléfono 1</label>
                            <InputMask  id="telefono1" type="text" mask="(999) 999-9999" placeholder="(999) 999-9999" name='telefono1'
                            onChange = { handleInputChange } value={ telefono1 }/>
                        </div>
                        <div className="p-field p-col-12 p-md-3">
                            <label htmlFor="telefono2">Teléfono 2</label>
                            <InputMask id="telefono2" type="text" mask="(999) 999-9999" placeholder="(999) 999-9999" name='telefono2'
                            onChange = { handleInputChange } value={ telefono2 }/>
                        </div>
            
                        <div className="p-field p-col-12 p-md-6">
                            <label htmlFor="email">Email</label>
                            <InputText id="email" type="text" name='email' onChange = { handleInputChange } value={ email } className = { error.errorEmail?.length && error.errorClass }/>
                            <div style={{ fontSize:12, color:"red" }}> {error.errorEmail }</div>
                        </div>

                        <div className="p-field p-col-12">
                            <label htmlFor="direccion">Dirección</label>
                            <InputText id="direccion" type="text" name='direccion' onChange = { handleInputChange } value={ direccion } className = { error.errorDireccion?.length && error.errorClass }/>
                            <div style={{ fontSize:12, color:"red" }}> {error.errorDireccion }</div>
                        </div>
                        <div className="p-field p-col-5">
                            <label htmlFor="director">Director(a)</label>
                            <InputText id="director" type="text" name='director' onChange = { handleInputChange } value={ director }/>
                        </div>
                        <div className="p-field p-col-5">
                            <label htmlFor="secretarioDocente">Secretaria Docente</label>
                            <InputText id="secretariaDocente" name='secretariaDocente' onChange = { handleInputChange } value={ secretariaDocente }/>
                        </div>
                        <div className="p-field p-col-2">
                            <label htmlFor="cod_colegio">Código Colegio</label>
                            <InputText id="codigoColegio" type="text" name='codigoColegio' onChange = { handleInputChange } value={ codigoColegio }/>
                        </div>
                        <div className="p-field p-col-4">
                            <label htmlFor="direccion_regional">Dirección Regional</label>
                            <InputText id="direccionRegional" type="text" name='direccionRegional' onChange = { handleInputChange } value={ direccionRegional }/>
                        </div>        
            
                        <div className="p-field p-col-4">
                            <label htmlFor="distrito_escolar">Distrito Escolar</label>
                            <InputText id="distrito_escolar" type="text" name='distritoEscolar' onChange = { handleInputChange } value={ distritoEscolar }/>
                        </div>        
            
                        <div className="p-field p-col-4">
                            <label htmlFor="director_distrito">Director(a) Distrito</label>
                            <InputText id="director_distrito" type="text" name='directorDistrito' onChange = { handleInputChange } value={ directorDistrito }/>
                        </div>        
            
                        <div className="p-field p-col-4">
                            <label htmlFor="supervisor_distrito">Supervisor(a) Distrito</label>
                            <InputText id="supervidorDistrito" type="text" name='supervidorDistrito' onChange = { handleInputChange } value={ supervidorDistrito }/>
                        </div>        
                        <div className="p-field p-col-4">
                            <label htmlFor="dias_gracia_cobro">Días de Gracia Cobro</label>
                            <InputText id="diasGraciaCobro" type="text" name='diasGraciaCobro' onChange = { handleInputChange } value={ diasGraciaCobro }/>
                        </div>        
                    </div>
                    
                </form>
           </Dialog>


           <Dialog visible={deleteDialogShow} style={{ width: '450px' }} header="Confirmación" modal footer={deleteDialogFooter} onHide={()=>hideShowDeleteDialog(false)}>
                       <div className="confirmation-content">
                           <i className="pi pi-exclamation-triangle p-mr-3" style={{ fontSize: '2rem' }} />
                           { <span >Esta seguro de borrar el registro :  <b style={{'color':'red'}}>{ nombreColegioDelete }</b>  ?</span>}
                       </div>
                   </Dialog>


					</div>
				</div>
			</div>
		</div>
	)
}
