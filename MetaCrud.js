import React, {useState, useEffect, createContext, useMemo} from 'react';
import useApi from './useApi';
import Table from './Table';
import ActionBar from './ActionBar';
import Form from './Form';
import DeleteConfirm from './DeleteConfirm';
import Config from './Config';

export const MetaCrudContext = createContext();

function MetaCrud({ defaultPageLimit=10, view=null, hideTableTitle=false, createCallbacks=[], updateCallbacks=[], deleteCallbacks=[], tablename, api_url, user_roles, extra_columns=[], wrappers={}, defaultOrderBy=1, defaultOrderDir="ASC"}) {
  // SECTIONS
  const sections = {
    "read": { "action":"", "label":"Tabla", "buttonClassName":"secondary", "icon":"table" },
    "create": { "action":"create", "label":"Nuevo", "buttonClassName":"success", "icon":"add" },
    "duplicate": { "action":"create", "label":"Duplicar", "buttonClassName":"success", "icon":"content_copy" },
    "update": { "action":"update", "label":"Editar", "buttonClassName":"warning",  "icon":"edit" },
    "delete": { "action":"delete", "label":"Eliminar", "buttonClassName":"danger", "icon":"delete" },
    "config": { "action":"config", "label":"", "buttonClassName":"tertiary", "icon":"settings" }
  };
  const [section, setSection] = useState('read');
  
  // SELECTED ROWS
  const [selectedRows, setSelectedRows] = useState([]);

  useEffect(() => {
    if(section === 'delete') return;
    setSelectedRows([]);
  }, [section]);

  
  // LAST RESULT
  const [lastResult, setLastResult] = useState(null);

  // RELOAD LOGIC
  const [reloads, setReloads] = useState(0);

  const doReload = React.useCallback(() => {
    setReloads(prev => prev + 1);
    setSection('read');
  }, []);

  // API CALLBACK
  const apiCallback = React.useCallback((r) => {
    setLastResult(r);
    if(r?.success) doReload();
  }, []);

  const getCallback = React.useCallback((r) => {
    setLastResult(r);
  }, []);

  // PAGINATION
  const [page, setPage] = useState(1);
  const [pageLimit, setPageLimit] = useState(defaultPageLimit);

  // SEARCH
  const [search, setSearch] = useState('');

  useEffect(() => {
    setPage(1);
  }, [search]);
  
  // SORTING
  const [orderBy, setOrderBy] = useState(defaultOrderBy);
  const [orderDir, setOrderDir] = useState(defaultOrderDir);

  // FILTERS
  const [filters, setFilters] = useState({});

  // HOOKS
  const columns_data_hook = useApi(api_url + '/meta/' + tablename + '/columns', '', true);

  const columns = columns_data_hook?.response?.data;

  //const numberOfHiddenColumns = columns?.filter(column=>column?.Comment?.metacrud?.hidden===true)?.length || 0;

  const numberOfHiddenColumns = useMemo(() => columns?.filter(column=>column?.Comment?.metacrud?.hidden===true)?.length || 0, [(columns)]);
  
  //const primaryKeyName = columns?.find(column => column?.Key === 'PRI')?.Field;

  const primaryKeyName = useMemo(() => columns?.find(column => column?.Key === 'PRI')?.Field, [(columns)]);

  const table_data_hook = useApi(api_url + '/meta/' + tablename + '/table', '', true, [reloads]);

  const restrictions = table_data_hook?.response?.data?.Comment?.metacrud?.restrictions??{};

  //const mappedFilters = Object.keys(filters).map(key => filters[key]?.map(value => key+'[]='+value).join('&'));

  const mappedFilters = useMemo(() => Object.keys(filters).map(key => filters[key]?.map(value => key+'[]='+value).join('&')), [(filters)]);

  const query = '?page='+page
              + '&limit='+pageLimit
              +'&sort='+orderBy
              +'&order='+orderDir 
              + ( view ? '&metacrudView='+view : '')
              + ( Object.keys(filters).length ? '&'+mappedFilters.join('&') : '')
              + (search!==''?'&search='+search:'');

              
  const records_data_hook = useApi(api_url + '/crud/' + tablename, query, true, [query, reloads], getCallback);


  //const reloadRecords = ()=>records_data_hook?.get(query);
  const reloadRecords = ()=>setReloads(prev => prev + 1);
  // useEffect(() => {
  //   records_data_hook?.get(query);
  // }, [query]);
  //}, [page, pageLimit, orderBy, orderDir, search]);

  const table_status = table_data_hook?.response?.data;

  const table_meta = table_status?.Comment?.metacrud??{};

  const tableTitle = table_meta?.views?.[view]?.title??table_meta?.title??table_status?.Name;
  
  return ( table_data_hook?.loading ? <div className='spinner-border spinner-border-sm text-primary'></div> :
    <MetaCrudContext.Provider value={{restrictions, query, reloadRecords, table_data_hook, view, filters, setFilters, sections, columns, numberOfHiddenColumns, primaryKeyName, extra_columns, wrappers, search, setSearch, orderBy, orderDir, setOrderBy, setOrderDir, apiCallback, setLastResult, table_meta, table_status, user_roles, page, setPage, pageLimit, setPageLimit, doReload, selectedRows, setSelectedRows, section, setSection, table_data_hook, columns_data_hook, records_data_hook, tablename, api_url, createCallbacks, updateCallbacks, deleteCallbacks}}>
      <div className='px-1 py-1'>
      { hideTableTitle ? null :
        <h3 className='border-bottom ps-1 pt-2 pb-2 mb-2'>{tableTitle}</h3>
      }
        { (section === 'read' && lastResult && (lastResult?.message || lastResult?.error)) &&
          <div className={'my-1 px-2 py-1 alert alert-'+(lastResult?.success?'success':'warning')}>
            {lastResult?.message} {lastResult?.error}
          </div>
        }
        <ActionBar className='my-0' />
        { section === 'read' && <Table /> }
        { section === 'create' && <Form /> }
        { section === 'update' && <Form /> }
        { section === 'duplicate' && <DeleteConfirm /> }
        { section === 'delete' && <DeleteConfirm /> }
        { section === 'config' && <Config /> }
      </div>
      
    </MetaCrudContext.Provider>
  )
}

export default MetaCrud