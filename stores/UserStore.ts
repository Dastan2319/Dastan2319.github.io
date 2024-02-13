import CONFIG from "../api";
export const useAuthStore = defineStore('auth', () => {
    const authToken = ref("")

    
    const getIsAuth = computed(() => {
        if(authToken.value){
            return true;
        }else{
            if(localStorage.getItem('token')){
                authToken.value = localStorage.getItem('token') as string;
                return true;
            }
            return false;
        }
    })

    async function auth(email: string, password: string) {
        try {
            await $fetch(CONFIG.AUTH,{
                method:"POST",
                body:{ email, password }
            }).then((data: any) => {
                authToken.value = data?.access_token;
                localStorage.setItem("token",authToken.value)
                navigateTo('/')
            })
        } catch (e) {
            console.error(e)
        }
    }
    function exit() {
        localStorage.removeItem("token");
        authToken.value = "";
        navigateTo('/auth')
    }

    async function refreshToken(){
        try {
            await $fetch(CONFIG.REFRESH,{
                method:"POST",
                headers:{
                    Authorization:`Bearer ${authToken.value}`
                }
            }).then((data: any) => {
                authToken.value = data?.access_token;
                localStorage.setItem("token",authToken.value)               
            })
        } catch (e) {
            console.error(e)
        }
    }

    return { authToken, refreshToken , getIsAuth, auth , exit }
})