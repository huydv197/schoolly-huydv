<template>
  <div>
    <div class="mb-5">
      <h6 class="mb-3 body-1">Mô tả</h6>
      <div class="text-gray-3" v-html="olClassListDetail.description"></div>
    </div>

    <div class="mb-5 d-flex justify-content-between">
      <div class="mr-3 body-1 text-dark font-weight-bold">
        Môn học:
        <span class="text-primary">{{
          olClassListDetail.subject_name ? olClassListDetail.subject_name : ""
        }}</span>
      </div>
      <div class="mr-3 body-1 text-dark font-weight-bold">
        Khối:
        <span class="text-primary">{{
          olClassListDetail.grade_name ? olClassListDetail.grade_name : ""
        }}</span>
      </div>
      <div class="mr-3 body-1 text-dark font-weight-bold">
        Hình thức:
        <span class="text-primary">{{
          olClassListDetail.privacy == "PUBLIC" ? "Công Khai" : "Riêng tư"
        }}</span>
      </div>
      <div class="body-1 text-dark font-weight-bold">
        Học phí:
        <span class="text-primary">
          {{ olClassListDetail.fee | numeralFormat("0,0") }}đ
          <span class="text-gray-3 font-weight-normal">/ buổi</span>
        </span>
      </div>
    </div>

    <div class="mb-5">
      <h6 class="body-1">Lịch học</h6>
      <div class="table-schedule-wrapper">
        <table class="table-schedule">
          <tbody>
            <tr
              v-for="(item, index) in olClassListDetail.schedules"
              :key="index"
            >
              <td>
                {{ convertStart(item.start_time) }} -
                {{ getEndTime(item.start_time, minutesToHours(item.duration)) }}
              </td>
              <td>{{ convertDay(item.days_of_week) }}</td>
              <td>
                {{ getDateBirthDay(item.from_date) }} -
                {{ getDateBirthDay(item.to_date) }}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <div class="text-center mt-4">
      <app-button @click="$emit('close')">Đóng</app-button>
    </div>
  </div>
</template>

<script>
import IconBorderColor from "~/assets/svg/v2-icons/border_color_24px.svg?inline";
import IconTrashAlt from "~/assets/svg/design-icons/trash-alt.svg?inline";
import { mapState, mapActions } from "vuex";
import {
  getDateBirthDay,
  getLocalTimeHH_MM_A,
  getEndTime,
  minutesToHours,
} from "~/utils/moment";

export default {
  components: {
    IconBorderColor,
    IconTrashAlt,
  },
  props: {
    requestId: {
      type: String,
      default: "",
    },
  },

  computed: {
    ...mapState("elearning/mytutor/olclass", ["olClassListDetail"]),
  },

  created() {
    // this.DAYS = Object.freeze(DAYS);
    this.onlineClassListDetail(this.requestId);
  },

  methods: {
    getDateBirthDay,
    getLocalTimeHH_MM_A,
    getEndTime,
    minutesToHours,
    ...mapActions("elearning/mytutor/olclass", ["onlineClassListDetail"]),

    convertStart(tmp) {
      console.log("convertStart");
      const indexOfCheck = tmp && tmp.lastIndexOf(" ");
      const checkData = tmp && tmp.slice(0, indexOfCheck);
      const dataTime = this.getLocalTimeHH_MM_A(`2020-01-01 ${checkData}`);
      return dataTime;
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
  },
};
</script>

<style lang="scss" scoped>
@import "~/assets/scss/pages/elearning/mytutor/olclass/_create.scss";
</style>
