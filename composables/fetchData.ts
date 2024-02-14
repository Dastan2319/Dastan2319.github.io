
export const useFetchData = async (api: string, methods?: any, query?: object, body?: object) => {
  const store = useAuthStore();
  return new Promise((resolve, reject) => {
    useFetch(api, {
      method: methods,
      query: query,
      body: body,

      onRequest({ request, options }) {
        options.headers = options.headers || {}
        options.headers.authorization = `Bearer ${store.authToken}`;
      },
      onResponse(context) {
        if (context.response && context.response.status === 401) {
          try {
            store.refreshToken().then((data: any) => {
              store.authToken = data?.access_token;
              localStorage.setItem("token", data?.access_token)
              useFetch(api, {
                method: methods,
                query: query,
                body: body,

                onRequest({ request, options }) {
                  options.headers = options.headers || {}
                  options.headers.authorization = `Bearer ${store.authToken}`;
                },
              }).then((data) => {
                resolve(data.data?.value)
              })
            })
          } catch (error) {
            store.exit();
            reject();
          }
        }else if(context.response && context.response.status === 200){
          resolve(context.response._data)
        }
      }
    })
  })
}
