<template>
  <div>
    <div class>
      <div class="d-flex-center">
        <h6 class="mb-3 body-1">Giờ học</h6>
      </div>

      <div class="d-flex-center mb-3">
        <div class="d-flex-center mb-4 mr-6">
          <label class="text-gray-3 mr-3">Bắt đầu vào lúc</label>
          <app-date-picker
            class="ml-3"
            v-model="startTime"
            @input="changeSchedules"
            square
            size="sm"
            valueFormat="HH:mm"
            placeholder="giờ:phút"
            type="time"
            :minuteStep="5"
          >
            <template v-slot:icon-calendar>
              <IconClock />
            </template>
          </app-date-picker>
        </div>

        <div class="d-flex-center mb-4">
          <label class="text-gray-3 mr-3">Thời lượng</label>
          <app-date-picker
            class="ml-3"
            v-model="duration"
            @input="changeSchedules"
            square
            size="sm"
            :minute-step="5"
            valueFormat="HH:mm"
            type="time"
            placeholder="giờ:phút"
          >
            <template v-slot:icon-calendar>
              <IconClock />
            </template>
          </app-date-picker>
        </div>
      </div>
    </div>

    <div class="form-item mb-4">
      <h6 class="mb-3 body-1">Ngày học trong tuần</h6>
      <div class="d-flex-center flex-wrap">
        <app-checkbox
          class="mr-5 mb-3"
          label="Thứ 2"
          :isChangeLabelColor="true"
          @change="check($event, 'MON')"
          :checked="checkIncules(initialSchedule.days_of_week, 'MON')"
        ></app-checkbox>
        <app-checkbox
          class="mr-5 mb-3"
          label="Thứ 3"
          :isChangeLabelColor="true"
          @change="check($event, 'TUE')"
          :checked="checkIncules(initialSchedule.days_of_week, 'TUE')"
        />
        <app-checkbox
          class="mr-5 mb-3"
          label="Thứ 4"
          :isChangeLabelColor="true"
          @change="check($event, 'WED')"
          :checked="checkIncules(initialSchedule.days_of_week, 'WED')"
        />
        <app-checkbox
          class="mr-5 mb-3"
          label="Thứ 5"
          :isChangeLabelColor="true"
          @change="check($event, 'THU')"
          :checked="checkIncules(initialSchedule.days_of_week, 'THU')"
        />
        <app-checkbox
          class="mr-5 mb-3"
          label="Thứ 6"
          :isChangeLabelColor="true"
          @change="check($event, 'FRI')"
          :checked="checkIncules(initialSchedule.days_of_week, 'FRI')"
        />
        <app-checkbox
          class="mr-5 mb-3"
          label="Thứ 7"
          :isChangeLabelColor="true"
          @change="check($event, 'SAT')"
          :checked="checkIncules(initialSchedule.days_of_week, 'SAT')"
        />
        <app-checkbox
          class="mb-3"
          label="Chủ nhật"
          :isChangeLabelColor="true"
          @change="check($event, 'SUN')"
          :checked="checkIncules(initialSchedule.days_of_week, 'SUN')"
        />
      </div>
    </div>

    <div class="d-flex">
      <div class="form-item mb-0">
        <h6 class="mb-3 body-1">Thời gian áp dụng</h6>
        <div>
          <div class="d-flex-center">
            <div class="d-flex-center mr-4">
              <label class="text-dark font-weight-medium">Từ</label>
              <app-date-picker
                class="ml-3"
                v-model="fromDate"
                square
                size="sm"
                placeholder="yyyy-mm-dd"
                valueFormat="YYYY-MM-DD"
                @input="(e) => schedulesDateChange(e, false)"
                :clearDate="fromClear"
              >
                <template v-slot:icon-calendar>
                  <IconCalendar />
                </template>
              </app-date-picker>
            </div>
            <div class="d-flex-center">
              <label class="text-dark font-weight-medium">Đến</label>
              <app-date-picker
                class="ml-3"
                v-model="toDate"
                square
                size="sm"
                placeholder="yyyy-mm-dd"
                valueFormat="YYYY-MM-DD"
                @input="(e) => schedulesDateChange(e, true)"
                :clearDate="toClear"
              >
                <template v-slot:icon-calendar>
                  <IconCalendar />
                </template>
              </app-date-picker>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="mt-6 text-center">
      <app-button
        color="white"
        @click.prevent="$emit('close', '')"
        class="mr-4 color-red border"
        >Hủy</app-button
      >
      <app-button :disabled="checkBtn" @click.prevent="handleEditSchedule"
        >Cập nhật</app-button
      >
    </div>
  </div>
</template>

<script>
import IconClock from "~/assets/svg/icons/clock.svg?inline";
import IconCalendar from "~/assets/svg/icons/calendar2.svg?inline";
import {
  getUTCDateTimeHH_MM_A,
  getEndTime,
  hoursToMinutes,
  minutesToHours
} from "~/utils/moment";
import moment from "moment";

export default {
  components: {
    IconClock,
    IconCalendar,
  },

  props: {
    dataEdit: {
      type: Object,
      default: {},
    },
    indexEdit: Number,
  },

  data() {
    return {
      schedulesUpdate: 0,
      selectedItems: [],
      fromClear: false,
      toClear: false,
      startTime: null,
      duration: null,
      fromDate: null,
      toDate: null,
      initialSchedule: {
        from_date: "",
        to_date: "",
        start_time: "",
        duration: "",
        days_of_week: "",
      },
    };
  },

  watch: {
    schedulesUpdate(newValue, oldValue) {
      this.updateSchedules();
    },
  },

  computed: {
    checkBtn() {
      let tmp = true;
      if (
        this.initialSchedule.from_date &&
        this.initialSchedule.to_date &&
        this.initialSchedule.duration &&
        this.initialSchedule.days_of_week
      ) {
        tmp = false;
      } else {
        tmp = true;
      }
      return tmp;
    },
  },

  created() {
    if (this.dataEdit && this.dataEdit.start_time) {
      this.startTime = this.dataEdit.start_time;
      this.duration = minutesToHours(this.dataEdit.duration);
      this.fromDate = this.dataEdit.from_date;
      this.toDate = this.dataEdit.to_date;
      this.initialSchedule = this.dataEdit;
      // if(this.dataEdit.start_time.lastIndexOf("PM" != -1) || this.dataEdit.start_time.lastIndexOf("AM" != -1)){
      //   const indexOfCheck = this.dataEdit.start_time.lastIndexOf(" ");
      //   const checkData = this.dataEdit.start_time.slice(0, indexOfCheck);
      //   this.startTime = moment(checkData, 'HH:mm').format("HH:mm");
      // }
    } else {
      this.clearForm();
    }
  },

  methods: {
    getUTCDateTimeHH_MM_A,
    getEndTime,
    hoursToMinutes,
    minutesToHours,
    changeSchedules(e) {
      this.schedulesUpdate++;
    },

    updateSchedules() {
      this.initialSchedule.start_time = this.startTime;
      this.initialSchedule.duration = hoursToMinutes(this.duration);
    },

    schedulesDateChange(e, isTo) {
      this.fromClear = false;
      this.toClear = false;
      if (isTo) {
        if (
          this.initialSchedule.from_date &&
          this.initialSchedule.from_date > e
        ) {
          this.fromClear = true;
          this.initialSchedule = { ...this.initialSchedule, from_date: null };
        } else {
          this.initialSchedule = { ...this.initialSchedule, to_date: e };
        }
      } else {
        if (this.initialSchedule.to_date && this.initialSchedule.to_date < e) {
          this.toClear = true;
          this.initialSchedule = { ...this.initialSchedule, to_date: null };
        } else {
          this.initialSchedule = { ...this.initialSchedule, from_date: e };
        }
      }
      this.schedulesUpdate++;
    },

    check(checked, item) {
      if (checked) {
        this.pushSelectedIndexes(item);
      } else {
        this.popSelectedIndexes(item);
      }
    },

    popSelectedIndexes(item) {
      if (this.selectedItems.includes(item)) {
        this.selectedItems = [...this.selectedItems].filter((i) => {
          return i !== item;
        });
        this.initialSchedule.days_of_week = this.arrayToString(
          this.selectedItems
        );
      }
    },
    pushSelectedIndexes(item, index) {
      if (!_.some(this.initialSchedule.days_of_week, item)) {
        this.selectedItems.push(item);
        this.initialSchedule.days_of_week = this.arrayToString(
          this.selectedItems
        );
      }
    },
    arrayToString(data) {
      return data.reduce((result, item) => {
        const com = result ? "," : "";
        return (result = result + com + item);
      }, "");
    },

    checkIncules(list, val) {
      let result = list ? list.includes(val) : false;
      return result;
    },

    handleEditSchedule() {
      this.$emit("handleEditSchedule", this.initialSchedule, this.indexEdit, this.duration)
    },
    clearForm() {
      this.startTime = "";
      this.duration = "";
      this.fromDate = "";
      this.toDate = "";
      this.selectedItems = [];
      this.initialSchedule = {};
    },
  },
};
</script>

<style></style>
