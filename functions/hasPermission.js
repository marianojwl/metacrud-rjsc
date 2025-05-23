const hasPermission = (action, user_roles, table_meta) => {
  if(action==='config') {
    if(user_roles?.includes(1)) return true;
    else return false;
  }
  if(!table_meta?.permissions) return true;
  if(!table_meta?.permissions[action]) return true;
  
  return user_roles?.some(role => table_meta?.permissions[action]?.includes(role));
};

export default hasPermission