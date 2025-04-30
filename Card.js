import React from 'react'
import {MetaCrudContext} from './MetaCrud'
import CardValue from './CardValue';
import { Link } from 'react-router-dom';

function Card({record, modalTitle=""}) {
  const { columns, wrappers, primaryKeyName } = React.useContext(MetaCrudContext);

  const cardElements = ["image", "image_thumb", "title", "subtitle", "text", "footer", "goToLink"];

  const cardValues = cardElements?.map(element => ({[element]:{label:columns?.find(column => column?.Comment?.metacrud?.cardElement === element)?.Comment?.metacrud?.label, value:record[columns?.find(column => column?.Comment?.metacrud?.cardElement === element)?.Field]}}));

  const cardValuesObj = Object.assign({}, ...cardValues);

  const badges = columns?.filter(column => column?.Comment?.metacrud?.cardElement === 'badge')?.map(column => column);
  const moreInfos = columns?.filter(column => column?.Comment?.metacrud?.cardElement === 'moreInfo')?.map(column => column);
  
  const linksRelated = columns?.filter(column => column?.Comment?.metacrud?.cardElement === 'relatedLink')?.map(column => column);

  const FW = wrappers?.fecha_venta;

  const cardTitleColumn = columns?.find(column => column?.Comment?.metacrud?.cardElement === 'title')??columns[1]??null;
  
  const cardSubtitleColumn = columns?.find(column => column?.Comment?.metacrud?.cardElement === 'subtitle')??columns[2]??null;

  const cardFooterColumn = columns?.find(column => column?.Comment?.metacrud?.cardElement === 'footer')??columns[10]??null;

  const modalId = `modalAnticipada-${record[primaryKeyName]}`;

  const cardTitleField = cardTitleColumn?.Comment?.metacrud?.foreign_value?.replace('.','_')??cardTitleColumn?.Field;
  const cardSubtitleField = cardSubtitleColumn?.Comment?.metacrud?.foreign_value?.replace('.','_')??cardSubtitleColumn?.Field;
  const cardFooterField = cardFooterColumn?.Comment?.metacrud?.foreign_value?.replace('.','_')??cardFooterColumn?.Field;

  
  const imageEncodedURL = cardValuesObj?.image?.value; //encodeURI(cardValuesObj?.image?.value);
  
  return (<>
    <div className="modal" id={modalId}>
      <div className="modal-dialog" style={{maxWidth: '90%'}}>
        <div className="modal-content">
          <div className="modal-header">
            <h4 className="modal-title" title={"#"+record[primaryKeyName]}>{modalTitle}</h4>
            <button type="button" className="btn-close" data-bs-dismiss="modal"></button>
          </div>
          <div className="modal-body">
          <div className="card border-0">
            <div className="row g-0">
              {cardValuesObj?.image?.value &&
              <div className="col-4 border" style={{backgroundImage: `url("${cardValuesObj?.image?.value}")`, backgroundSize: 'cover', backgroundPosition: 'center'}}>
              </div>
              }
              <div className={cardValuesObj?.image?.value?"col-8":""}>
                <div className="card-body px-3 py-2">
                  <h4 className="card-title"><CardValue field={cardTitleField} record={record} /></h4>
                  <h5 className="text-muted"><CardValue field={cardSubtitleField} record={record} /></h5>
                  <h5 className="text-muted"><CardValue field={cardFooterField} record={record} /></h5>
                  {
                    !badges?.length ? null : <div className='mb-2'>{
                    badges?.map(badge => <div key={'badge-'+badge?.Field} className='d-inline-flex me-2 mb-2'><CardValue field={badge?.Field} record={record} /></div>)}</div>
                  }
                  <p className="card-text">{cardValuesObj?.text?.value}</p>
                  {
                    moreInfos?.map((info,i) => <div key={'info-'+i} className='my-2'><CardValue field={info?.Field} record={record} /></div>)
                  }
                  <h6 className='text-muted'>Links Relacionados</h6>
                  {
                    linksRelated?.map((link,i) => <div key={'link'+i} className='my-2'><a href={record[link?.Field]} target="_blank" className='text-decoration-none'>
                      <span className="material-symbols-outlined align-bottom">{link?.Comment?.metacrud?.cardIcon}</span> {link?.Comment?.metacrud?.label}
                    </a></div>)
                  }
                </div>
              </div>
            </div>
          </div>
          </div>
          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Cerrar</button>
          </div>
        </div>
      </div>
    </div>

    <div className="card mb-2 me-2" style={{"maxWidth": "500px", "minWidth": "300px"}}>
      <div className="row g-0">
        {cardValuesObj?.image?.value &&
        <div className="col-4" style={{backgroundImage: `url("${cardValuesObj?.image_thumb?.value??cardValuesObj?.image?.value}")`, backgroundSize: 'cover', backgroundPosition: 'center'}}>
        </div>
      }
        <div className={cardValuesObj?.image?.value?"col-8":""}>
          <div className="card-body px-3 py-2">
            <h5 className="card-title" style={{overflow: 'hidden', whiteSpace: 'nowrap'}}
            ><CardValue field={cardTitleField} record={record} /></h5>
            <h6 className="card-title"><CardValue field={cardSubtitleField} record={record} /></h6>
            {
              !badges?.length ? null : <div className='mb-2'>{
              badges?.map(badge => <div key={'badg-'+badge?.Field} className='d-inline-flex me-2 mb-2'><CardValue field={badge?.Field} record={record} /></div>)}</div>
            }
            <p className="card-text" style={{maxHeight: '3rem', overflow: 'hidden'}}
            >{cardValuesObj?.text?.value}</p>
            <p className="card-text">
              <button type="button" className="mb-2 btn btn-sm btn-primary float-end" data-bs-toggle="modal" data-bs-target={'#'+modalId}>
                <span className="material-symbols-outlined align-middle">zoom_in</span>
              </button>
              {
                cardValuesObj?.goToLink?.value && (
                  <Link to={cardValuesObj?.goToLink?.value} type="button" className="mb-2 me-1 btn btn-sm btn-primary float-end">
                    <span className="material-symbols-outlined align-middle">open_in_new</span>
                  </Link> 
                )
              }
              <small className="text-body-secondary"><CardValue field={cardFooterField} record={record} /></small>
            </p>
            
          </div>
        </div>
      </div>
    </div>
    </>
  )
}

export default Card