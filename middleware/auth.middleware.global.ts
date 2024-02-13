export default defineNuxtRouteMiddleware((to, from) => {
    const store = useAuthStore();
 
    if (process.client) {
        if(!store.getIsAuth && to.path !== '/auth'){ 
            return navigateTo('/auth')
          }
          else if (store.getIsAuth && to.path !== '/'){
            return navigateTo('/')  
          }
          return
       
    }
    return;

})
