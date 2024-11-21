export function deleteCookie(name: string) {
  console.log(name,'nameee');
  
    document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/;`;
  }
  