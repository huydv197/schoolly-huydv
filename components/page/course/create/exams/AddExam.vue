<template>
  <sub-block-section
    title="Bài kiểm tra"
    :content-cls="{ 'pb-3': true, 'px-0': true, 'mb-0': true, 'pt-2': true }"
  >
    <template v-slot:content>
      <div class="cc-panel__body">
        <div class="mb-4">
          <label for="title" class="heading-5 font-weight-bold mb-2 d-inline-block">
            Tiêu đề bài kiểm tra
            <span class="caption text-base font-weight-normal">(Tối đa 60 ký tự)</span>
          </label>
          <app-input
            id="title"
            :counter="60"
            placeholder="Nhập tiêu đề bài kiểm tra"
            v-model="payload.title"
            @input="checkTitle()"
          />
          <app-error :error="get(error, 'title', '')" />
        </div>

        <div class="mb-4">
          <h5 for="require" class="mb-3">Loại bài kiểm tra</h5>
          <app-select
            :options="typeOpts"
            v-model="payload.type"
            placeholder="Chọn loại bài kiểm tra"
            bordered
          ></app-select>

          <!-- <app-radio-group>
            <app-radio
              name="group2"
              value="CHOICE"
              class="mr-4"
              :checked="payload.type === 'CHOICE'"
              @click="handleChangeType('CHOICE')"
              >Trắc nghiệm</app-radio
            >
            <app-radio
              name="group2"
              value="ESSAY"
              :checked="payload.type === 'ESSAY'"
              @click="handleChangeType('ESSAY')"
              >Tự luận</app-radio
            >
          </app-radio-group>-->
          <app-error :error="get(error, 'type', '')" />
        </div>

        <div class="caculate-point">
          <div class="row">
            <div class="col-md-6">
              <h5 class="mb-4">Chọn cách tính điểm</h5>

              <div class="d-flex mb-4">
                <app-radio
                  value="coefficient"
                  :checked="typeRadio == 'coefficient'"
                  @click="handleSelectType"
                  name="caculate-point"
                  :disabled="disabledType"
                  :class="{ 'mr-6': true, 'disabled-input': disabledType }"
                >
                  Theo hệ số
                  <v-popover placement="right" trigger="hover" class="d-inline-block">
                    <IconQuestionCircle
                      width="12px"
                      height="12px"
                      class="fill-gray vertical-middle"
                    />

                    <template #popover>
                      <p>Các bài kiểm tra được cài đặt theo hệ số 1 hoặc hệ số 2</p>
                      <p class="mb-3">để làm cơ sở tính điểm trung bình cho học sinh.</p>

                      <a href>Xem chi tiết</a>
                    </template>
                  </v-popover>
                </app-radio>

                <app-radio
                  :checked="typeRadio == 'weight'"
                  value="weight"
                  :disabled="disabledType"
                  @click="handleSelectType"
                  name="caculate-point"
                  :class="{ 'disabled-input': disabledType }"
                >
                  Theo trọng số
                  <v-popover placement="right" trigger="hover" class="d-inline-block">
                    <IconQuestionCircle
                      width="12px"
                      height="12px"
                      class="fill-gray vertical-middle"
                    />

                    <template #popover>
                      <p>Các bài kiểm tra được cài đặt theo trọng số, tính theo %.</p>
                      <p class="mb-3">Tổng trọng số của tất cả các bài kiểm tra là 100%.</p>

                      <a href>Xem chi tiết</a>
                    </template>
                  </v-popover>
                </app-radio>
              </div>
            </div>

            <div class="col-md-6">
              <div class="mb-5" v-if="typeRadio == 'coefficient'">
                <h5 class="mb-3">Hệ số của bài kiểm tra này</h5>

                <app-select
                  class="mr-3"
                  size="sm"
                  bordered
                  :value="payload.coefficient"
                  @change="handleChangeCoefficient"
                  :options="[
                    { value: 1, text: '1' },
                    { value: 2, text: '2' }
                  ]"
                >
                  <template slot="placeholder-icon">
                    <IconAngleDown class="icon" />
                  </template>
                </app-select>

                <!-- <p class="text-warning">
                  * Lưu ý: Bạn sẽ không thể thay đổi cách tính điểm sau khi bài kiểm tra
                  đã được tạo
                </p>-->
              </div>

              <div class="mb-5" v-if="typeRadio == 'weight'">
                <h5 class="mb-3">Trọng số của bài kiểm tra này</h5>

                <app-input
                  class="mr-3 mb-0 w-90 pr-3 input--modifer"
                  size="sm"
                  @onFocus="event => event.target.select()"
                  v-model="payload.weight"
                  @input="checkWeight()"
                >
                  <template slot="unit">
                    <span class="text-primary">%</span>
                  </template>
                </app-input>

                <!-- <p class="text-warning">
                  * Lưu ý: Bạn sẽ không thể thay đổi cách tính điểm sau khi bài kiểm tra
                  đã được tạo
                </p>-->
              </div>
              <app-error :error="get(error, 'weight', '')" />
            </div>
          </div>
        </div>

        <div class="row align-items-center mb-4" v-show="payload.required">
          <div class="col-12 col-md-4">
            <label for="time" class="heading-5 font-weight-bold text-dark">Thời gian làm bài</label>

            <app-input
              type="text"
              @onFocus="event => event.target.select()"
              class="mb-0 ce-input-with-unit mt-3"
              id="time"
              size="sm"
              style="width: 112px"
              v-model="payload.duration"
            >
              <div slot="unit">Phút</div>
            </app-input>
          </div>

          <div class="col-12 col-md-4">
            <label for="point" class="heading-5 font-weight-bold text-dark">Điểm đạt</label>

            <app-input
              type="text"
              @onFocus="event => event.target.select()"
              min="0"
              max="10"
              class="mb-0 ce-input-with-unit mt-3"
              id="point"
              size="sm"
              style="width: 102px"
              v-model="payload.pass_score"
            >
              <div slot="unit">/10</div>
            </app-input>
          </div>

          <div class="col-12 col-md-4">
            <label for="count" class="heading-5 font-weight-bold text-dark">Số lần làm bài tối đa</label>

            <app-input
              type="text"
              class="mb-0 mt-3 ce-input-with-unit"
              @onFocus="event => event.target.select()"
              id="count"
              size="sm"
              style="width: 102px"
              v-model="payload.reworks"
            >
              <div slot="unit">Lần</div>
            </app-input>
          </div>
        </div>

        <div class="setup-time mt-5 mb-6">
          <h5 class="mb-4">
            Cài đặt thời gian
            <span class="font-weight-bold">
              (Không bắt buộc)
              <IconQuestionCircle width="12px" height="12px" class="fill-gray" />
            </span>
          </h5>

          <div class="d-flex align-items-center mb-3">
            <p class="w-120">Thời gian bắt đầu:</p>

            <SelectDate
              @onChange="handleChangeOpenTime"
              :value="payload.open_time"
              :disabled="!payload.opentime_enable"
            />
            <app-checkbox v-model="payload.opentime_enable">
              <span class="text-base">Áp dụng</span>
            </app-checkbox>
          </div>
          <app-error :error="get(error, 'open_time', '')" />

          <div class="d-flex align-items-center">
            <p class="w-120">Thời gian kết thúc:</p>

            <SelectDate
              @onChange="handleChangeCloseTime"
              :value="payload.close_time"
              :disabled="!payload.closetime_enable"
            />

            <app-checkbox v-model="payload.closetime_enable">
              <span class="text-base">Áp dụng</span>
            </app-checkbox>
          </div>
          <app-error :error="get(error, 'close_time', '')" />
        </div>

        <div class="d-flex justify-content-end">
          <app-button
            size="md"
            color="default"
            outline
            class="font-weight-semi-bold mr-4 text-secondary"
            @click="$emit('cancel')"
          >Huỷ</app-button>
          <app-button
            size="md"
            color="primary"
            class="font-weight-semi-bold"
            @click="handleAddExam"
          >Tạo bài kiểm tra</app-button>
        </div>

        <app-modal-confirm
          centered
          v-if="showModalConfirm"
          :confirmLoading="confirmLoading"
          @ok="handleOk"
          @cancel="handleCancel"
          title="Tạo bài kiểm tra"
          description="Bạn có chắc chắn muốn tạo bài kiểm tra này?"
        />
      </div>
    </template>
  </sub-block-section>
</template>

<script>
import IconAngleDown from "~/assets/svg/design-icons/angle-down.svg?inline";
import IconEvent24px from "~/assets/svg/v2-icons/event_24px.svg?inline";
import IconQuestionCircle from "~/assets/svg/design-icons/question-circle.svg?inline";
import IconCalender from "~/assets/svg/v2-icons/calendar_today_24px.svg?inline";
import SelectDate from "~/components/page/course/create/setting/SelectDate";
import moment from "moment";
import * as actionTypes from "~/utils/action-types";
import { getParamQuery, useEffect } from "~/utils/common";
import { get } from "lodash";
import { mapState, mapActions } from "vuex";
import { createPayloadExercise } from "~/models/course/AddCourse";
import numeral from "numeral";
import { getUTCDateTime, getLocalDateTime } from "~/utils/moment";
import { EXAM_CONFIG } from "~/utils/config";
import { CATEGORY_TEST, PAGE_SIZE } from "~/utils/constants";
const EXAM_STORE = `elearning/manager/bank/exam`;
export default {
  components: {
    IconAngleDown,
    IconEvent24px,
    IconQuestionCircle,
    IconCalender,
    SelectDate,
  },

  computed: {
    ...mapState("elearning/create", {
      general: "general",
      lesson: "lesson",
      exams: "exams",
      setting: "setting",
    }),
    ...mapState(EXAM_STORE, ["getListBankExam"]),
    disabledType() {
      return !!(
        get(this, "getListBankExam.content.0.settings.weight", "") !== "" ||
        get(this, "getListBankExam.content.0.settings.coefficient", "") !== ""
      );
    },
  },

  mounted() {
    useEffect(this, this.watchExams.bind(this), ["exams"]);
  },

  data() {
    return {
      payload: {
        // index: 1,
        elearning_id: "",
        required: true,
        title: "",
        type: null,
        pass_score: 0,
        reworks: 1,
        duration: 0,
        category: "TEST",
        open_time: "",
        opentime_enable: false,
        close_time: "",
        closetime_enable: false,
        coefficient: 1,
        // id: "",
        weight: "",
      },
      showModalConfirm: false,
      confirmLoading: false,
      typeRadio: "coefficient",
      error: {
        title: "",
        type: "",
        weight: "",
        opent_time: "",
        close_time: "",
      },
      typeOpts: [
        { text: "Tự luận", value: "ESSAY" },
        { text: "Trắc nghiệm", value: "CHOICE" },
        { text: "Hỗn hợp", value: "MIX" },
      ],
    };
  },

  methods: {
    ...mapActions(EXAM_STORE, ["bankExamAdd"]),
    handleChangeType(type) {
      this.payload.type = type;
      this.checkType();
    },

    checkPayload() {
      const title = this.checkTitle();
      const type = this.checkType();
      const weight = this.checkWeight();
      const openCloseTime = this.checkOpenCloseTime();
      return title && type && weight && openCloseTime;
    },

    checkOpenCloseTime() {
      console.log("[checkOpenCloseTime]");
      this.error.open_time = "";
      this.error.close_time = "";

      // if donot enable opentime
      if (!this.payload.opentime_enable && !this.payload.closetime_enable)
        return true;
      if (!this.payload.open_time && this.payload.opentime_enable) {
        this.error.open_time = "Bạn chưa chọn thời gian mở đề";
        return false;
      }
      if (!this.payload.close_time && this.payload.closetime_enable) {
        this.error.close_time = "Bạn chưa chọn thời gian đóng đề";
        return false;
      }

      const starttime_enable = get(this, "setting.starttime_enable", true);
      const start_time = get(this, "setting.start_time", "");
      const endtime_enable = get(this, "setting.endtime_enable", true);
      const end_time = get(this, "setting.end_time", "");
      const duration = get(this, "payload.duration", 0);

      // start_time format
      let open_time_timestamp = this.payload.open_time
        ? moment(this.payload.open_time).format("x")
        : null;
      let start_time_timestamp = this.setting.start_time
        ? getLocalDateTime(this.setting.start_time).format("x")
        : null;

      // end_time format
      let close_time_timestamp = this.payload.close_time
        ? moment(this.payload.close_time).format("x")
        : null;
      let end_time_timestamp = this.setting.end_time
        ? getLocalDateTime(this.setting.end_time).format("x")
        : null;

      // 1. if starttime_enable == true && endtime_enable == true
      if (starttime_enable && endtime_enable) {
        // Thời gian mở đề > thời gian bắt đầu bài giảng/khóa học (ít nhất 24 giờ)
        if (
          this.isValidTimeEnable(
            open_time_timestamp,
            this.payload.opentime_enable
          ) &&
          !this.check2TimeDuration(
            start_time_timestamp,
            open_time_timestamp,
            EXAM_CONFIG.TIME_TO_START_OPEN_QUESTION
          )
        ) {
          this.error.open_time =
            "Thời gian mở đề phải lớn hơn thời gian bắt đầu bài giảng/khoá học ít nhất 24 giờ";
          return false;
        }
        // Thời gian mở đề < thời gian kết thúc bài giảng (interval ít nhất là 24 giờ)
        if (
          this.isValidTimeEnable(
            open_time_timestamp,
            this.payload.opentime_enable
          ) &&
          !this.check2TimeDuration(
            open_time_timestamp,
            end_time_timestamp,
            EXAM_CONFIG.TIME_TO_START_CLOSE_QUESTION
          )
        ) {
          this.error.open_time =
            "Thời gian mở đề phải nhỏ hơn thời gian kết thúc bài giảng/khoá học ít nhất 24 giờ";
          return false;
        }
        // Thời gian đóng đề > thời gian bắt đầu bài giảng/khóa học (ít nhất 24 giờ)
        if (
          this.isValidTimeEnable(
            close_time_timestamp,
            this.payload.closetime_enable
          ) &&
          !this.check2TimeDuration(
            start_time_timestamp,
            close_time_timestamp,
            EXAM_CONFIG.TIME_TO_START_OPEN_QUESTION
          )
        ) {
          this.error.close_time =
            "Thời gian đóng đề tra phải lớn hơn thời gian bắt đầu bài giảng/khoá học ít nhất 24 giờ";
          return false;
        }
        // Thời giao đóng đề - thời gian mở đề >= thời gian làm bài
        if (
          this.isValidTimeEnable(
            open_time_timestamp,
            this.payload.opentime_enable
          ) &&
          this.isValidTimeEnable(
            close_time_timestamp,
            this.payload.closetime_enable
          ) &&
          !this.check2TimeDuration(
            open_time_timestamp,
            close_time_timestamp,
            duration * 60 * 1000
          )
        ) {
          this.error.open_time =
            "Cài đặt lượng thời gian làm bài cho phép không đúng";
          return false;
        }
        // Thời gian đóng đề <= thời gian kết thúc bài giảng/khóa học
        if (
          this.isValidTimeEnable(
            close_time_timestamp,
            this.payload.closetime_enable
          ) &&
          !this.check2TimeDuration(close_time_timestamp, end_time_timestamp, 0)
        ) {
          this.error.close_time =
            "Thời gian đóng đề tra phải nhỏ hơn thời gian kết thúc bài giảng/khoá học";
          return false;
        }
      }

      // 2. if starttime_enable == false && endtime_enable == false
      if (!starttime_enable && !endtime_enable) {
        // Thời gian mở đề > thời gian tạo bài giảng/khóa học (interval ít nhất là 24 giờ)
        // if(open_time_timestamp && !this.check2TimeDuration(new Date().getTime(), open_time_timestamp, EXAM_CONFIG.TIME_TO_START_OPEN_QUESTION)) {
        //   this.error.open_time =
        //     "Thời gian mở đề phải lớn hơn thời gian tạo giảng/khoá học ít nhất 24 giờ";
        //   return false;
        // }
        // Thời gian đóng đề > Thời gian bắt đầu (interval ít nhất là 24 giờ)
        // Thời gian đóng đề > thời gian mở đề
        if (
          this.isValidTimeEnable(
            open_time_timestamp,
            this.payload.opentime_enable
          ) &&
          this.isValidTimeEnable(
            close_time_timestamp,
            this.payload.closetime_enable
          ) &&
          !this.check2TimeDuration(open_time_timestamp, close_time_timestamp, 0)
        ) {
          this.error.close_time =
            "Thời gian đóng đề phải lớn hơn thời gian mở đề";
          return false;
        }
        // Thời giao đóng đề - thời gian mở đề >= thời gian làm bài
        if (
          this.isValidTimeEnable(
            open_time_timestamp,
            this.payload.opentime_enable
          ) &&
          this.isValidTimeEnable(
            close_time_timestamp,
            this.payload.closetime_enable
          ) &&
          !this.check2TimeDuration(
            open_time_timestamp,
            close_time_timestamp,
            duration * 60 * 1000
          )
        ) {
          this.error.open_time =
            "Cài đặt lượng thời gian làm bài cho phép không đúng";
          return false;
        }
      }

      // 3. if starttime_enable == true && endtime_enable == false
      if (starttime_enable && !endtime_enable) {
        // Thời gian mở đề > thời gian bắt đầu bài giảng/khóa học (ít nhất 24 giờ)
        if (
          this.isValidTimeEnable(
            open_time_timestamp,
            this.payload.opentime_enable
          ) &&
          !this.check2TimeDuration(
            start_time_timestamp,
            open_time_timestamp,
            EXAM_CONFIG.TIME_TO_START_OPEN_QUESTION
          )
        ) {
          this.error.open_time =
            "Thời gian bắt đầu bài kiểm tra phải lớn hơn thời gian bắt đầu giảng/khoá học ít nhất 24 giờ";
          return false;
        }
        // Thời gian đóng đề > thời gian mở đề
        if (
          this.isValidTimeEnable(
            open_time_timestamp,
            this.payload.opentime_enable
          ) &&
          this.isValidTimeEnable(
            close_time_timestamp,
            this.payload.closetime_enable
          ) &&
          !this.check2TimeDuration(open_time_timestamp, close_time_timestamp, 0)
        ) {
          this.error.close_time =
            "Thời gian kết thúc bài kiểm tra phải lớn hơn thời gian bắt đầu bài kiểm tra";
          return false;
        }
        // Thời giao đóng đề - thời gian mở đề >= thời gian làm bài
        if (
          this.isValidTimeEnable(
            open_time_timestamp,
            this.payload.opentime_enable
          ) &&
          this.isValidTimeEnable(
            close_time_timestamp,
            this.payload.closetime_enable
          ) &&
          !this.check2TimeDuration(
            open_time_timestamp,
            close_time_timestamp,
            duration * 60 * 1000
          )
        ) {
          this.error.open_time =
            "Cài đặt lượng thời gian làm bài cho phép không đúng";
          return false;
        }
      }

      // 4. if starttime_enable == false && endtime_enable == true
      if (!starttime_enable && endtime_enable) {
        // Thời gian mở đề > thời gian tạo bài giảng/khóa học (interval ít nhất là 24 giờ)
        // if(open_time_timestamp && !this.check2TimeDuration(new Date().getTime(), open_time_timestamp, EXAM_CONFIG.TIME_TO_START_OPEN_QUESTION)) {
        //   this.error.open_time =
        //     "Thời gian mở đề phải lớn hơn thời gian tạo giảng/khoá học ít nhất 24 giờ";
        //   return false;
        // }
        // Thời gian đóng đề > thời gian mở đề
        if (
          this.isValidTimeEnable(
            open_time_timestamp,
            this.payload.opentime_enable
          ) &&
          this.isValidTimeEnable(
            close_time_timestamp,
            this.payload.closetime_enable
          ) &&
          !this.check2TimeDuration(open_time_timestamp, close_time_timestamp, 0)
        ) {
          this.error.close_time =
            "Thời gian kết thúc bài kiểm tra phải lớn hơn thời gian bắt đầu bài kiểm tra";
          return false;
        }
        // Thời giao đóng đề - thời gian mở đề >= thời gian làm bài
        if (
          this.isValidTimeEnable(
            open_time_timestamp,
            this.payload.opentime_enable
          ) &&
          this.isValidTimeEnable(
            close_time_timestamp,
            this.payload.closetime_enable
          ) &&
          !this.check2TimeDuration(
            open_time_timestamp,
            close_time_timestamp,
            duration * 60 * 1000
          )
        ) {
          this.error.close_time =
            "Cài đặt lượng thời gian làm bài cho phép không đúng";
          return false;
        }
        // Thời gian đóng đề <= thời gian kết thúc bài giảng/khóa học
        if (
          this.isValidTimeEnable(
            close_time_timestamp,
            this.payload.closetime_enable
          ) &&
          !this.check2TimeDuration(close_time_timestamp, end_time_timestamp, 0)
        ) {
          this.error.close_time =
            "Thời gian đóng đề tra phải nhỏ hơn thời gian kết thúc bài giảng/khoá học";
          return false;
        }
      }

      return true;
    },

    check2TimeDuration(start_time, end_time, duration) {
      console.log("[check2TimeDuration]", start_time, end_time, duration);
      if (!start_time || !end_time || duration == null || duration == undefined)
        return false;
      const result = end_time - start_time >= duration;
      return result;
    },

    checkWeight() {
      if (this.typeRadio !== "weight") {
        this.error.weight = "";
        return true;
      }

      if (!this.payload.weight) {
        this.error.weight = "Bạn cần nhập trọng số";
        return false;
      }

      const checkInteger = Number.isInteger(+this.payload.weight);
      if (!checkInteger) {
        this.error.weight = "Trọng số phải là số nguyên";
        return false;
      }

      if (+this.payload.weight <= 0) {
        this.error.weight = "Trọng số phải lớn hơn 0";
        return false;
      }

      if (+this.payload.weight > 100) {
        this.error.weight = "Trọng số không được lớn hơn 100";
        return false;
      }

      this.error.weight = "";
      return true;
    },

    checkType() {
      if (this.payload.type === "") {
        this.error.type = "Bạn cần nhập loại bài kiểm tra";
        return false;
      }
      this.error.type = "";
      return true;
    },

    checkTitle() {
      if (!this.payload.title) {
        this.error.title = "Bạn cần nhập tiêu đề";
        return false;
      }
      this.error.title = "";
      return true;
    },

    watchExams() {
      if (get(this, "getListBankExam.content.0.settings.weight", "") !== "") {
        // this.payload.weight = get(this, "exams.content.0.weight", "");
        this.typeRadio = "weight";
      }
      if (
        get(this, "getListBankExam.content.0.settings.coefficient", "") !== ""
      ) {
        // this.payload.coefficient = get(this, "exams.content.0.coefficient", "");
        this.typeRadio = "coefficient";
      }
    },

    handleChangeCoefficient(value) {
      this.payload.coefficient = value;
    },

    handleChangeOpenTime(date) {
      this.payload.open_time = date;
      this.checkOpenCloseTime();
    },

    handleChangeCloseTime(date) {
      this.payload.close_time = date;
      this.checkOpenCloseTime();
    },

    async handleAddExam() {
      if (!this.checkPayload()) {
        this.$toasted.error("Invalid params");
        return;
      }
      this.showModalConfirm = true;
    },

    handleSelectDate(date) {
      this.date = date;
    },

    handleSelectTime(time) {
      this.time = time;
    },

    async handleOk() {
      this.confirmLoading = true;

      this.payload.elearning_id = get(this, "general.id", "");

      let data = { ...this.payload };
      if (data.opentime_enable) {
        data.open_time = getUTCDateTime(data.open_time).format(
          "YYYY-MM-DD HH:mm:ss"
        );
      }
      if (data.closetime_enable) {
        data.close_time = getUTCDateTime(data.close_time).format(
          "YYYY-MM-DD HH:mm:ss"
        );
      }

      if (!data.open_time) delete data.open_time;
      if (!data.close_time) delete data.close_time;
      if (this.typeRadio === "coefficient") delete data.weight;
      if (this.typeRadio === "weight") delete data.coefficient;
      console.log("[data]", data);
      const body = new FormData();
      body.append("category", data.category);
      body.append("parent", "elearning");
      body.append("name", data.title);
      body.append("type", this.payload.type);
      body.append("parent_id", getParamQuery("elearning_id"));
      body.append("duration", data.duration);
      body.append("passing_score", data.pass_score);
      body.append("starttime_enable", data.opentime_enable);
      body.append("endtime_enable", data.closetime_enable);
      body.append("works", this.payload.reworks);
      if (data.opentime_enable) {
        body.append("start_time", data.open_time);
      }
      if (data.closetime_enable) {
        body.append("end_time", data.close_time);
      }
      if (data.coefficient) {
        body.append("coefficient", data.coefficient);
      }
      if (data.weight) {
        body.append("weight", data.weight);
      }
      if (this.general && this.general.subject && this.general.subject.id) {
        body.append("subject_id", this.general.subject.id);
      }
      if (this.general && this.general.grade && this.general.grade.id) {
        body.append("grade_id", this.general.grade.id);
      }
      await this.bankExamAdd(body).then((result) => {
        if (result.success) {
          console.log("[bankExamAdd]", result);
          // this.$store.dispatch("elearning/create/getExams");
          this.$store.dispatch(`${EXAM_STORE}/${actionTypes.BANK_EXAM.LIST}`, {
            category: CATEGORY_TEST.TEST,
            parent: "ELEARNING",
            parent_id: getParamQuery("elearning_id"),
            show_statistic: true,
            page: 1,
            size: PAGE_SIZE.MAXIMIZE,
          });
          const data = {
            apply: true,
            calculation_method:
              this.typeRadio === "coefficient" ? "COEFFICIENT" : "WEIGHT",
            elearning_id: this.payload.elearning_id,
          };
          this.handleCalculatePoint(data);
          this.$emit("cancel");
          return;
        } else {
          this.$toasted.error(result.message);
        }
      });

      // const res = await this.$axios({
      //   url: "/elearning/creating/test",
      //   method: "post",
      //   headers: {
      //     "Content-Type": "application/json",
      //   },
      //   data,
      // });

      this.handleCancel();

      // if (get(res, "data.success", false)) {
      //   this.$toasted.success(get(res, "data.message", "Thành công"));
      // this.$store.dispatch("elearning/create/getExams");
      // const data = {
      //   apply: true,
      //   calculation_method:
      //     this.typeRadio === "coefficient" ? "COEFFICIENT" : "WEIGHT",
      //   elearning_id: this.payload.elearning_id,
      // };
      // await this.handleCalculatePoint(data);
      // this.$emit("cancel");
      // return;
      // }

      // this.$toasted.error(get(res, "data.message", "Có lỗi xảy ra"));
    },

    async handleCalculatePoint(data) {
      const res = await this.$axios({
        url: "/elearning/creating/point_calculation",
        method: "post",
        headers: {
          "Content-Type": "application/json",
        },
        data,
      });
      return res;
    },

    handleCancel() {
      this.showModalConfirm = false;
      this.confirmLoading = false;
    },

    handleSelectType(e) {
      this.typeRadio = e.target.value;
    },

    isValidTimeEnable(_time, _enable) {
      return _enable && !!_time;
    },

    get,
  },

  watch: {
    "payload.opentime_enable"(_newVal) {
      console.log("[payload.opentime_enable]", _newVal);
      this.checkOpenCloseTime();
    },
    "payload.closetime_enable"(_newVal) {
      console.log("[payload.closetime_enable]", _newVal);
      this.checkOpenCloseTime();
    },
  },
};
</script>

<style lang="scss">
@import "~/assets/scss/components/elearning/course/creat/_form-creat-excercise.scss";
</style>
