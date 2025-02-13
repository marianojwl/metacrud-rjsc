import { useState, useEffect } from 'react';

function useApi(endpoint, query='', auto=false, dependencies=[], callback=null) {
  const [response, setResponse] = useState(null);
  const [loading, setLoading] = useState(false);
  const [count, setCount] = useState(0);

  const handleFecthError = (e) => {
    alert('Error de conexión.  No se pudo completar la solicitud.  Verifique su conexión a internet y, si el problema persiste, contacte al administrador del sistema.');
  }

  const get = async (query='', callbacks=[]) => {
    setLoading(true);
    try{
      const res = await fetch(endpoint + query);
      const json = await res.json();
      setResponse(json);
      if(callback) callback(json);
      callbacks.forEach(cb => cb(json));
    } catch(e){
      handleFecthError(e);
      if(callback) callback({ success:false, message:'Algo salió mal' });
      callbacks.forEach(cb => cb({ success:false, message:'Algo salió mal' }));
    } finally {
      setLoading(false);
    }
  }

  const post = async (body, callbacks=[], method='POST') => {
    setLoading(true);
    try {
      const res = await fetch(endpoint, {
        method: method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      const json = await res.json();
      setResponse(json);
      if(callback) callback(json);
      callbacks.forEach(cb => cb(json));
    } catch(e){
      handleFecthError(e);
      if(callback) callback({ success:false, message:'Algo salió mal' });
    } finally {
      setLoading(false);
    }
  }

  const put = async (body, callbacks=[]) => post(body, callbacks, 'PUT');

  useEffect(() => {
    //console.log('useEffect useApi + ' + endpoint);
    if(count === 0 && !auto) return;
    setCount(prev=>{
      get(query);
      return prev+1;
    });
    // get(query);
  }, dependencies);

  return { response, loading, get, post, put };
}

export default useApi;