<template>
  <div class="container mytutor-olclass">
    <breadcrumb />
    <div class="row">
      <div class="col-md-3">
        <MenuSideMyTutor :active="1" />
      </div>

      <div class="col-md-9">
        <sub-block-section class="mb-4" hasIcon title="Tạo lớp học online">
          <template v-slot:content>
            <div class="mb-5">
              <h2 class="form-title heading-5 mb-3">
                Tên lớp học online
                <span class="text-base font-weight-normal"
                  >(Tối đa 60 ký tự)</span
                >
              </h2>
              <app-input
                :placeholder="`Nhập tiêu đề của lớp học online`"
                :counter="60"
                class="mb-2"
                v-model="params.name"
              />
              <app-error
                v-if="params.name.length > 60"
                :error="
                  get(error, 'name', 'Tên lớp học không được dài quá 60 ký tự')
                "
              ></app-error>
            </div>

            <div class="mb-5">
              <h2 class="form-title heading-5 mb-3">Mô tả</h2>
              <app-editor
                class="bg-input-gray mb-3"
                v-model="params.description"
                :sticky-offset="`{ top: 70, bottom: 0 }`"
              />
              <app-error :error="get(error, 'description', '')"></app-error>
            </div>

            <div class="d-flex flex-wrap">
              <div class="mb-5 mr-6">
                <h2 class="form-title heading-5 mb-3">Chọn khối</h2>
                <app-select
                  placeholder="Khối"
                  has-border
                  style="min-width: 10.1rem"
                  searchable
                  v-model="grade"
                  :options="gradesAllOpts"
                  @change="handleChangeGrade"
                />
                <app-error :error="get(error, 'group', '')"></app-error>
              </div>

              <div class="mb-5 mr-6">
                <h2 class="form-title heading-5 mb-3">Chọn môn học</h2>
                <app-select
                  placeholder="Môn học"
                  has-border
                  style="min-width: 10.1rem"
                  searchable
                  v-model="subject"
                  :options="subjectsAllOpts"
                  @change="handleChangeSubject"
                />
                <app-error :error="get(error, 'subject', '')"></app-error>
              </div>

              <div class="mb-5 mr-6">
                <h2 class="form-title heading-5 mb-3">Học phí (đ)</h2>

                <div class="d-flex align-items-center">
                  <app-input
                    class="mb-0 mr-6"
                    placeholder="Học phí"
                    size="sm"
                    style="width: 10.4rem"
                    v-model="params.fee"
                  >
                    <template slot="unit">đ</template>
                  </app-input>

                  <app-radio
                    class="mr-6"
                    name="price"
                    value="LESSON"
                    v-model="params.fee_type"
                    >Buổi</app-radio
                  >
                  <app-radio
                    name="price"
                    value="COURSE"
                    v-model="params.fee_type"
                    >Khoá học</app-radio
                  >
                </div>
                <app-error :error="get(error, 'price', '')"></app-error>
              </div>
            </div>

            <div class="d-flex flex-wrap">
              <div class="mb-5 mr-6">
                <h2 class="form-title heading-5 mb-3">Hình thức</h2>
                <app-radio
                  class="mr-6"
                  name="private"
                  value="PUBLIC"
                  v-model="params.privacy"
                  >Công khai</app-radio
                >
                <app-radio
                  class="mr-6"
                  name="private"
                  value="PRIVATE"
                  v-model="params.privacy"
                  >Riêng tư</app-radio
                >
                <app-error :error="get(error, 'private', '')"></app-error>
              </div>

              <div class="mb-5 mr-6">
                <h2 class="form-title heading-5 mb-3">
                  Thuộc lớp/nhóm học tập
                </h2>
                <app-vue-select
                  multiple
                  style="width: 25rem"
                  class="app-vue-select form-item__selection"
                  placeholder="Chọn lớp hoặc nhóm học tập"
                  has-border
                  v-model="filterClassGroup"
                  :options="groupClsOpts"
                  :reduce="(item) => item"
                  @input="(e) => handleChangedClassGroup(e)"
                  label="name"
                ></app-vue-select>
              </div>
            </div>

            <app-divider class="mb-4" color="disabled" />

            <h2 class="form-title heading-5">
              Lịch học
              <span class="text-base font-weight-normal"
                >(Việc tạo lịch học là bắt buộc)</span
              >
            </h2>
            <div class="table-schedule-wrapper" v-if="schedules.length > 0">
              <table class="table-schedule">
                <tbody>
                  <tr v-for="(item, index) in schedules" :key="index">
                    <td>
                      {{ getTimeHH_MM_A(item.start_time) }} -
                      {{ getEndTime(item.start_time, duration) }}
                    </td>
                    <td>{{ convertDay(item.days_of_week) }}</td>
                    <td>
                      {{ getDateBirthDay(item.from_date) }} -
                      {{ getDateBirthDay(item.to_date) }}
                    </td>
                    <td>
                      <app-button
                        class="px-2"
                        color="default"
                        size="sm"
                        flat
                        @click.prevent="handleEditOlclass(item, index)"
                      >
                        <IconBorderColor
                          class="icon fill-opacity-1 text-primary body-1"
                        />
                      </app-button>
                      <app-button
                        class="px-2"
                        color="default"
                        size="sm"
                        flat
                        @click.prevent="handleRemoveSchedule(index)"
                      >
                        <IconTrashAlt
                          class="icon fill-opacity-1 text-secondary body-1"
                        />
                      </app-button>
                    </td>
                  </tr>
                  <!-- <tr>
                    <td>08:00 - 10:00</td>
                    <td>Hàng tuần vào thứ 3,5,7</td>
                    <td>30/03/2020 - 30/04/2020</td>
                    <td>
                      <app-button class="px-2" color="default" size="sm" flat>
                        <IconBorderColor
                          class="icon fill-opacity-1 text-primary body-1"
                        />
                      </app-button>
                      <app-button class="px-2" color="default" size="sm" flat>
                        <IconTrashAlt
                          class="icon fill-opacity-1 text-secondary body-1"
                        />
                      </app-button>
                    </td>
                  </tr> -->
                </tbody>
              </table>
            </div>
            <button class="btn-add" @click="modalAdd = true">
              <IconAdd class="icon fill-opacity-1 mr-2" />Thêm lịch
            </button>
          </template>
        </sub-block-section>

        <div class="text-right">
          <app-button @click.prevent="handleAddClass">
            <IconDownloadDone class="icon fill-opacity-1 body-1 mr-2" />Tạo lớp
            học
          </app-button>
          <!-- <app-button>
                <IconSync class="icon fill-opacity-1 body-1 mr-2" />Cập nhật
          </app-button>-->
        </div>
      </div>
    </div>

    <app-modal
      v-if="modalAdd"
      v-model="modalAdd"
      title="Thêm lịch"
      :footer="false"
      :width="828"
      @close="modalAdd = false"
    >
      <FormAddSchedule
        slot="content"
        @close="modalAdd = false"
        @handleAddSchedule="handleAddSchedule"
        :dataEdit="{}"
        :indexEdit="null"
      />
    </app-modal>
    <app-modal
      v-if="modalEdit"
      title="Sửa lịch"
      :footer="false"
      :width="828"
      @close="modalEdit = false"
    >
      <FormEditSchedule
        slot="content"
        @close="modalEdit = false"
        @handleEditSchedule="handleEditSchedule"
        :dataEdit="dataEdit"
        :indexEdit="indexEdit"
      />
    </app-modal>
  </div>
</template>

<script>
import { get } from "lodash";
import { initBreadcrumb } from "~/utils/common";
import MenuSideMyTutor from "~/components/page/elearning/mytutor/MenuSideMyTutor";
import FormAddSchedule from "~/components/page/elearning/mytutor/olclass/create/FormAddSchedule";
import FormEditSchedule from "~/components/page/elearning/mytutor/olclass/create/FormEditSchedule";
import IconDownloadDone from "~/assets/svg/v2-icons/download_done_24px.svg?inline";
import IconSync from "~/assets/svg/v2-icons/sync_24px.svg?inline";
import IconBorderColor from "~/assets/svg/v2-icons/border_color_24px.svg?inline";
import IconTrashAlt from "~/assets/svg/design-icons/trash-alt.svg?inline";
import IconAdd from "~/assets/svg/v2-icons/add_24px.svg?inline";
import * as actionTypes from "~/utils/action-types";
import { mapState, mapGetters } from "vuex";
import {
  getDateBirthDay,
  getUTCDateTime,
  getTimeHH_MM_A,
  getUTCDateTimeHH_MM_A,
  getEndTime,
  hoursToMinutes,
} from "~/utils/moment";
import moment from "moment";

export default {
  head: {
    title: "Tạo lớp học online - Quản lý lớp học online",
  },

  components: {
    MenuSideMyTutor,
    FormAddSchedule,
    FormEditSchedule,
    IconDownloadDone,
    IconSync,
    IconBorderColor,
    IconTrashAlt,
    IconAdd,
  },

  data() {
    return {
      error: {},
      modalAdd: false,
      modalEdit: false,
      dataEdit: {},
      indexEdit: null,
      duration: null,
      subject: null,
      grade: null,
      schedules: [],
      filterClassGroup: null,
      params: {
        elearning_id: "",
        assign_class_ids: [],
        assign_group_ids: [],
        fee_type: "LESSON",
        assignment_type: "CLASS_GROUP",
        name: "",
        description: "",
        grade_id: "",
        subject_id: "",
        fee: 0,
        privacy: "PUBLIC",
        is_invite_all: false,
        is_allow_download: false,
        schedules: [],
      },
    };
  },

  async fetch({ params, query, store, route }) {
    const schoolId = store.getters["auth/organizationId"];
    const schoolLevel = store.getters["auth/organizationLevel"];
    const queryGrades = {
      school_id: schoolId ? schoolId : null,
      school_level: schoolLevel ? schoolLevel : null,
    };
    await Promise.all([
      store.dispatch(
        `elearning/public/public-subject/${actionTypes.ELEARNING.SUBJECT}`
      ),
      store.dispatch(
        `elearning/public/public-grades/${actionTypes.PUBLIC_GRADES.GRADES_ALL}`,
        {
          params: queryGrades,
        }
      ),
      store.dispatch(`elearning/${actionTypes.TEACHER_CLASS_GROUP.LIST}`),
    ]);
  },

  computed: {
    ...mapGetters("elearning/public/public-subject", ["subjectsAllOpts"]),
    ...mapGetters("elearning/public/public-grades", ["gradesAllOpts"]),
    ...mapGetters("elearning", ["groupClsOpts"]),
    ...mapState("elearning", ["groupCls"]),
  },

  methods: {
    get,
    getTimeHH_MM_A,
    getDateBirthDay,
    getEndTime,
    getUTCDateTimeHH_MM_A,
    changeName(e) {
      if (e.target.value.length < 61) {
        this.params.name = e.target.value;
      } else {
        e.target.value = this.params.name;
      }
    },

    convertDay(days_of_week) {
      const items = days_of_week.split(",");
      const sorter = {
        mon: 1,
        tue: 2,
        wed: 3,
        thu: 4,
        fri: 5,
        sat: 6,
        sun: 7,
      };
      let tmp = {};
      items.forEach(function(value) {
        let index = sorter[value.toLowerCase()];
        tmp[index] = value;
      });

      let i = 0;
      return Object.values(tmp).reduce((result, item) => {
        let text = "";
        if (item) i++;
        switch (item) {
          case "MON":
            text = "2";
            break;
          case "TUE":
            text = "3";
            break;
          case "WED":
            text = "4";
            break;
          case "THU":
            text = "5";
            break;
          case "FRI":
            text = "6";
            break;
          case "SAT":
            text = "7";
            break;
          case "SUN":
            text = "CN";
            break;
        }
        const com = i > 1 ? ", " : "";
        return (result = result + com + text);
      }, "Hàng tuần vào thứ ");
    },

    handleChangeSubject(_val) {
      // console.log("handleChangeSubject", _val);
      this.params.subject_id = _val.toString();
    },

    handleChangeGrade(_val) {
      // console.log("handleChangeGrade", _val);
      this.params.grade_id = _val;
    },

    handleChangedClassGroup(e) {
      // console.log("handleChangedClassGroup", e);
      this.params.assign_class_ids = e
        .filter((i) => i.type == "CLASS")
        .map((k) => {
          return k.id;
        });
      this.params.assign_group_ids = e
        .filter((i) => i.type == "GROUP")
        .map((k) => {
          return k.id;
        });
      if (
        this.params.assign_class_ids.length > 0 &&
        this.params.assign_group_ids.length > 0
      ) {
        this.params.assignment_type = "CLASS_GROUP";
      } else if (
        this.params.assign_class_ids.length > 0 &&
        this.params.assign_group_ids.length == 0
      ) {
        this.params.assignment_type = "CLASS";
      } else if (
        this.params.assign_group_ids.length > 0 &&
        this.params.assign_class_ids.length == 0
      ) {
        this.params.assignment_type = "GROUP";
      }
    },

    handleAddSchedule(data, _duration) {
      this.modalAdd = false;
      this.duration = _duration;
      this.schedules.push(data);
      this.params.schedules = this.schedules;

    },

    handleEditSchedule(data, index, _duration) {
      this.modalEdit = false;
      this.duration = _duration;
      if (typeof index == "number") {
        this.schedules[index] = data;
      }
      this.params.schedules = this.schedules;

    },

    handleEditOlclass(item, index) {
      this.modalEdit = true;
      this.dataEdit = item;
      this.indexEdit = index;
    },

    handleRemoveSchedule(index) {
      this.schedules.splice(index, 1);
      this.params.schedules = this.schedules;
    },

    async handleAddClass() {
      try {
        // console.log("handleAddClass");
        for (let index = 0; index < this.schedules.length; index++) {
          const el = { ...this.schedules[index] };
          const that = this;
          that.params.schedules[index].start_time = getUTCDateTimeHH_MM_A(
            new Date("2020-01-01 " + el.start_time)
          );
          if (that.params.schedules[index].start_time.indexOf("PM") != -1) {
            const indexOfCheck = el.start_time.indexOf(" ");
            const checkData = el.start_time.slice(0, indexOfCheck);
            const date1 = Date.parse(`01/01/2020 ${checkData}`);
            const date2 = Date.parse("01/01/2020 5:00");
            if (date1 > date2) {
              that.params.schedules[index].from_date = moment(el.from_date)
                .subtract(1, "days")
                .format("YYYY-MM-DD");
            }
          }
        }
        const doCreate = await this.$store.dispatch(
          `elearning/mytutor/olclass/${actionTypes.MYTUTOR_OLCLASS.ADD}`,
          JSON.stringify({ ...this.params, enable: true })
        );
        if (doCreate.success) {
          this.$toasted.success("Thành công");
          this.$router.push('/elearning/mytutor/olclass');
        } else if (doCreate.message) {
          this.$toasted.error(doCreate.message);
        }
      } catch (error) {
        console.log("error", error);
      }
    },
  },

  mounted() {
    const breadcrumb = [
      {
        title: "E-learning",
        to: "/elearning",
      },
      {
        title: "Quản lý lớp học online",
        to: "/elearning/mytutor",
      },
      {
        title: "Tạo lớp học online",
        to: "/elearning/mytutor/olclass/create",
      },
    ];
    initBreadcrumb(this, breadcrumb);
  },
};
</script>

<style lang="scss" scoped>
@import "~/assets/scss/components/elearning/manager/_elearning-manager.scss";
@import "~/assets/scss/pages/elearning/mytutor/olclass/_create.scss";
</style>
