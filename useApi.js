import { useState, useEffect } from 'react';

function useApi(endpoint, query='', auto=false, dependencies=[], callback=null) {
  const [response, setResponse] = useState(null);
  const [loading, setLoading] = useState(false);
  const [count, setCount] = useState(0);

  const handleFecthError = (e) => {
    alert('Error de conexión.  No se pudo completar la solicitud.  Verifique su conexión a internet y, si el problema persiste, contacte al administrador del sistema.');
  }

  const get = async (query='') => {
    setLoading(true);
    try{
      const res = await fetch(endpoint + query);
      const json = await res.json();
      setResponse(json);
      if(callback) callback(json);
    } catch(e){
      handleFecthError(e);
      if(callback) callback({ success:false, message:'Algo salió mal' });
    } finally {
      setLoading(false);
    }
  }

  const post = async (body, method='POST') => {
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
    } catch(e){
      handleFecthError(e);
      if(callback) callback({ success:false, message:'Algo salió mal' });
    } finally {
      setLoading(false);
    }
  }

  const put = async (body) => post(body, 'PUT');

  useEffect(() => {
    if(count === 0 && !auto) return;
    setCount(prev=>prev+1);
    get(query);
  }, dependencies);

  return { response, loading, get, post, put };
}

export default useApi;