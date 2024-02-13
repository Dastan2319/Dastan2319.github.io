<template>
  <div class="main">
    <div class="crudTop">
      <v-spacer></v-spacer>
      <v-btn @click="auth.exit" color="error">Exit</v-btn>
    </div>
    <div class="crudTop">
      <span>CRUD</span>
      <v-btn
        color="primary"
        dark
        class="mb-2"
        @click="
          () => {
            newItemDialog = true;
          }
        "
      >
        New Item
      </v-btn>
    </div>
    <v-data-table
      :headers="headers"
      :items="store.getRecords"
      item-value="name"
      :items-per-page="store.meta.pageSize"
      :page="store.meta.currentPage"
      @update:options="loadItems"
      :items-length="store.getRecords.length"
    >
      <template v-slot:item.actions="{ item }">
        <v-icon @click="editRecords(item)" size="small" class="me-2"> mdi-pencil </v-icon>
        <v-icon @click="delRecords(item)" size="small"> mdi-delete </v-icon>
      </template>
    </v-data-table>
    <v-dialog v-model="newItemDialog" max-width="500px">
      <v-card>
        <v-card-title>
          <span class="text-h5">Create new item Records</span>
        </v-card-title>

        <v-card-text>
          <v-container>
            <v-form ref="form">
              <v-text-field v-model="state.f" label="Имя" :rules="rules"></v-text-field>
              <v-text-field
                v-model="state.i"
                label="Отчество"
                :rules="rules"
              ></v-text-field>
              <v-text-field
                v-model="state.o"
                label="Отчество"
                :rules="rules"
              ></v-text-field>

              <v-text-field
                v-model="state.city"
                label="Город"
                :rules="rules"
              ></v-text-field>
              <v-text-field
                v-model="state.address"
                label="Адрес"
                :rules="rules"
              ></v-text-field>
              <v-text-field
                v-model="state.birthday"
                label="Дата рождения"
                type="date"
                :rules="rules"
              ></v-text-field>
              <v-text-field
                v-model="state.phone"
                label="Номер телефона"
                :rules="rules"
                type="tel"
              ></v-text-field>

              <v-btn class="me-4" @click="submitBtns"> submit </v-btn>
            </v-form>
          </v-container>
        </v-card-text>
      </v-card>
    </v-dialog>
  </div>
</template>

<script lang="ts" setup>
const store = useMyRecordsStore();
const auth = useAuthStore();
definePageMeta({
  layout: "custom",
});
const rules = [(v: any) => !!v || "is required"];
const state = ref({
  id: null,
  f: "",
  i: "",
  o: "",
  city: "",
  address: "",
  birthday: "",
  phone: "",
});
const newItemDialog = ref(false);
const form = ref();
const headers = ref([
  { title: "Фамилия", key: "f", align: "end" },
  { title: "Имя", key: "i", align: "end" },
  { title: "Отчество", key: "o", align: "end" },
  { title: "Город", key: "city", align: "end" },
  { title: "Адрес", key: "address", align: "end" },
  { title: "Дата рождения", key: "birthday", align: "end" },
  { title: "Номер телефона", key: "phone", align: "end" },
  { title: "Actions", key: "actions", sortable: false },
] as Array<object>);

const loadItems = ({ page, itemsPerPage, sortBy }: any) => {
  let query = {} as object[];
  if (sortBy.length) {
    query["sort"] = sortBy[0].key;
  }
  store.getApiRecords(query);
};
const submitBtns = async () => {
  form.value?.validate().then(({ valid: isValid }: any) => {
    if (isValid) {
      let body = {};
      headers.value.forEach((el: any) => {
        if (state && state.value[el.key]) {
          body[el.key] = state.value[el.key];
        }
      });
      console.log("state.value.id", state.value.id);
      if (state.value.id == null) {
        store.postCreateRecord(body);
      } else {
        store.postCreateRecord(body, state.value.id);
      }
      newItemDialog.value = false;
    }
  });
};
const editRecords = (item: any) => {
  state.value = item;
  newItemDialog.value = true;
};
const delRecords = (item: any) => {
  store.delRecord(item.id);
};

watch(newItemDialog, (newData: any) => {
  if (!newData) {
    state.value = {
      id: null,
      f: "",
      i: "",
      o: "",
      city: "",
      address: "",
      birthday: "",
      phone: "",
    };
  }
});
</script>

<style lang="scss" scoped>
.crudTop {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 12px;
}
.main {
  display: flex;
  flex-direction: column;
}
.listItem {
  border-radius: 16px;
  border: 1px solid rgb(222, 222, 240);
  margin-bottom: 8px;
  padding: 8px 24px;
}
</style>
