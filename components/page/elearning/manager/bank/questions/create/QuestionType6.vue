<template>
  <div class="create-question">
    <div class="d-flex">
      <div class="mr-6 pr-6">
        <p class="label">Loại câu hỏi:</p>
        <div class="d-flex-center">
          <IconQuestion6 />
          <strong class="color-primary ml-3">Chọn từ</strong>
        </div>
      </div>
      <!-- <div>
        <p class="label">Chọn cấp độ cho câu hỏi:</p>
        <div class="radios">
          <app-radio
            name="level"
            @change="handleChangeLevel"
            :value="levels[0]['id']"
            :checked="data.manual.level === levels[0]['id']"
            >Dễ</app-radio
          >
          <app-radio
            name="level"
            @change="handleChangeLevel"
            :value="levels[1]['id']"
            :checked="data.manual.level === levels[1]['id']"
            >Trung bình</app-radio
          >
          <app-radio
            name="level"
            @change="handleChangeLevel"
            :value="levels[2]['id']"
            :checked="data.manual.level === levels[2]['id']"
            >Khó</app-radio
          >
        </div>
      </div> -->
    </div>
    <div class="mt-5 mb-4">
      <p class="label">Nội dung câu hỏi:</p>
      <div class="qoute">
        <div class="pr-2"><IconError /></div>
        <p>
          Lưu ý: Soạn câu hỏi và sử dụng [dấu ngoặc] để đặt vị trí cần điền từ.
          Ví dụ: Hành tinh lớn nhất của hệ mặt trời là [sao Mộc|sao Hỏa|Trái
          Đất]. Khi bạn sử dụng “|” để cung cấp nhiều câu trả lời, trong đó <b>vị
          trí đầu tiên là đáp án chính xác</b>. Câu hỏi chọn từ hợp lệ phải có từ 2
          lựa chọn trở lên.
        </p>
      </div>
      <app-editor
        class="bg-input-gray mb-3"
        :sticky-offset="`{ top: 40, bottom: 0 }`"
        v-model="data.manual.content"
      />
    </div>

    <div class="mt-4">
      <div class="label d-flex-center" @click="showMemo = !showMemo">
        <div style="cursor: pointer" class="d-flex-center">
          <IconRight v-if="!showMemo" />
          <IconDown v-else />
          <span class="pr-3">Ghi chú</span>
        </div>
        <div class="tooltip">
          <IconHelp />
          <p class="text">Giải thích đáp án đúng hoặc kiến thức bổ sung</p>
        </div>
      </div>
      <app-input
        textarea
        v-if="showMemo"
        rows="3"
        placeholder="Viết ghi chú..."
        v-model="data.manual.note"
      />
    </div>
  </div>
</template>

<script>
import IconHelp from "~/assets/svg/v2-icons/help_24px.svg?inline";
import IconRight from "~/assets/svg/v2-icons/chevron_right_24px.svg?inline";
import IconDown from "~/assets/svg/v2-icons/chevron_down_24px.svg?inline";
import IconEdit24 from "~/assets/svg/v2-icons/edit_24px.svg?inline";
import IconDelete from "~/assets/svg/v2-icons/delete_24px.svg?inline";
import IconError from "~/assets/svg/v2-icons/error_outline_24px.svg?inline";
import IconQuestion6 from "~/assets/svg/images/question5.svg?inline";
import { get, cloneDeep } from "lodash";
import { useEffect } from "~/utils/common";
import { LEVEL_QUESTIONS } from "~/utils/constants";

export default {
  components: {
    IconQuestion6,
    IconHelp,
    IconRight,
    IconDown,
    IconEdit24,
    IconDelete,
    IconError,
  },

  props: {
    visible: Boolean,
    question: {},
  },

  mounted() {
    useEffect(this, this.handleChangeData.bind(this), ["data"]);
    useEffect(this, this.handleChangeQuestion.bind(this), ["question"]);
  },

  data() {
    return {
      showMemo: false,
      active: 1,
      name: "",
      level: "1",
      error: {},
      levels: LEVEL_QUESTIONS,
      data: {
        manual: {
          //level: "",
          content: "",
          note: "",
        },
      },
    };
  },

  methods: {
    handleChangeQuestion() {
      if (this.question) {
        this.data = cloneDeep(this.question);
      }
    },

    handleChangeData() {
      this.$emit("handleChangeData", this.data);
    },

    // handleChangeLevel(e) {
    //   this.data.manual.level = e.target.value;
    // },
    get,
  },
};
</script>

<style lang="scss" scoped>
@import "~/assets/scss/components/elearning/bank/_questions.scss";
</style>
