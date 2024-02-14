import CONFIG from "../api";
export const useAuthStore = defineStore('auth', () => {
    const authToken = ref("")

    const getIsAuth = computed(() => {
        if (authToken.value) {
            return true;
        } else {
            if (localStorage.getItem('token')) {
                authToken.value = localStorage.getItem('token') as string;
                return true;
            }
            return false;
        }
    })

    async function auth(email: string, password: string) {
        useFetchData(CONFIG.AUTH, "POST", {}, { email, password }).then((data: any) => {
            authToken.value = data?.access_token;
            localStorage.setItem("token", authToken.value)
            navigateTo('/')
        })
    }
    function exit() {
        localStorage.removeItem("token");
        authToken.value = "";
        navigateTo('/auth')
    }

    function refreshToken() {
        return useFetchData(CONFIG.REFRESH, "POST")
        // .then((data: any) => {
        //     authToken.value = data?.access_token;
        //     localStorage.setItem("token", authToken.value)
        //     console.log('then')
        //     return true;
        // })
    }

    return { authToken, refreshToken, getIsAuth, auth, exit }
})