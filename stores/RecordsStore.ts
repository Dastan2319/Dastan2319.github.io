import { defineStore } from 'pinia'
import CONFIG from "../api";
interface IPerson {
  f: string,
  i: string,
  o: string,
  address: string,
  birthday: string,
  city: string,
  id: number,
  phone: string,
}

interface IMeta {
  currentPage: number,
  pageCount: number,
  pageSize: number,
  totalCount: number,
}
export const useMyRecordsStore = defineStore("myRecordsStore", () => {
  const auth = useAuthStore();
  const records = ref([] as Array<IPerson>);
  const meta = ref({} as IMeta);

  const getRecords = computed(() => records.value);
  const getMeta = computed(() => meta.value);

  const getById = computed((id) => {
    return records.value.find((item: any) => { return item?.id == id })
  })

  async function getApiRecords(query?:object) {
    try {
      await $fetch(CONFIG.RECORDS, {
        method: "GET",
        query:query,
        headers: {
          Authorization: `Bearer ${auth.authToken}`
        }
      }).then((data: any) => {
        records.value = data.items;
        meta.value = data._meta;
      })
    } catch (e:any) {
      console.error(e)
      if (e.response.status == 401) {
        auth.exit();
      }
    }
  }

  async function postCreateRecord(body:object , id?:number) {
    try {
      let api = CONFIG.RECORDS ;
      if (id) api + '/' + id
      await $fetch(api, {
        method: id ? "PUT":"POST",
        body:body,
        headers: {
          Authorization: `Bearer ${auth.authToken}`
        }
      }).then((data: any) => {
        if(!id){
          records.value.push(data);
        }else{
          let index = records.value.findIndex((el:any)=>{
            if(el.id == id) return el;
          })
          records.value[index] = data;
        }
        // meta.value = data._meta;
      })
    } catch (e:any) {
      console.error(e)     
      if (e.response.status == 401) {
        auth.exit();
      } 
    }
  }

  async function delRecord(id:number) {
    try {
      await $fetch(CONFIG.RECORDS + '/' + id, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${auth.authToken}`
        }
      }).then((data: any) => {
          let filtered = records.value.filter((el:any)=>{
            return el.id != data.id
          })
          records.value = filtered;
      })
    } catch (e:any) {
      console.error(e)
      if (e.response.status == 401) {
        auth.exit();
      }      
    }
  }

  return { records, meta, getMeta, getRecords, getById, getApiRecords , postCreateRecord , delRecord }
})
