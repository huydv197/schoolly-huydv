<template>
  <div class="create-question">
    <div class="d-flex">
      <div class="mr-6 pr-6">
        <p class="label">Loại câu hỏi:</p>
        <div class="d-flex-center">
          <IconQuestion2 />
          <strong class="color-primary ml-3">Một lựa chọn</strong>
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
          >Dễ</app-radio>
          <app-radio
            name="level"
            @change="handleChangeLevel"
            :value="levels[1]['id']"
            :checked="data.manual.level === levels[1]['id']"
          >Trung bình</app-radio>
          <app-radio
            name="level"
            @change="handleChangeLevel"
            :value="levels[2]['id']"
            :checked="data.manual.level === levels[2]['id']"
          >Khó</app-radio>
        </div>
      </div> -->
    </div>
    <div class="mt-5 mb-4">
      <p class="label">Nội dung câu hỏi:</p>
      <app-editor
        class="bg-input-gray mb-3"
        :sticky-offset="`{ top: 40, bottom: 0 }`"
        v-model="data.manual.content"
      />
    </div>
    <div class="row row-center">
      <div class="col-3">
        <p class="label">Chọn đáp án đúng:</p>
      </div>
      <div class="col-9">
        <p class="label">Nội dung đáp án:</p>
      </div>

      <fragment v-for="(answer, index) in data.answers" :key="index">
        <div class="col-3">
          <app-radio
            name="answer"
            :class="answer.selected ? 'avtive' : 'xxx'"
            @click="handleSelectAnswerTrue(index)"
            :checked="answer.selected"
          >
            <span class="pr-3 text-uppercase">{{ alphabet[index] }}</span>
          </app-radio>
        </div>
        <div class="col-9">
          <div class="edit answer-tooltip not-full" @click="handleEditContent(index)">
            <span v-html="answer.content"></span>
            <IconEdit24 class="icon-edit" />
            <div class="answer-text" v-if="answer.content">
              <div v-html="answer.content"></div>
            </div>
          </div>
          <button @click="handleDeleteAnswer(index)" class="btn-delete">
            <IconDelete class="fill-red" />
          </button>
        </div>
      </fragment>

      <div class="col-12 mt-3">
        <button @click="addItem" class="ml-auto d-flex-center color-primary">
          <IconPlus2 class="fill-primary" />Thêm đáp án
        </button>
      </div>
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

    <ModalUpdateAnswer
      v-if="showEditAnswer"
      @click-close="handleCancel"
      :index="index"
      type="answer"
      @handleSaveContent="handleEditContentAnswer"
      :data="data"
    />
  </div>
</template>

<script>
import IconHelp from "~/assets/svg/v2-icons/help_24px.svg?inline";
import IconRight from "~/assets/svg/v2-icons/chevron_right_24px.svg?inline";
import IconDown from "~/assets/svg/v2-icons/chevron_down_24px.svg?inline";
import IconEdit24 from "~/assets/svg/v2-icons/edit_24px.svg?inline";
import IconDelete from "~/assets/svg/v2-icons/delete_24px.svg?inline";
import ModalUpdateAnswer from "~/components/page/elearning/manager/bank/questions/create/ModalUpdateAnswer";
import IconQuestion2 from "~/assets/svg/images/question2.svg?inline";
import { get, cloneDeep } from "lodash";
import { useEffect } from "~/utils/common";
import { LEVEL_QUESTIONS } from "~/utils/constants";
import IconPlus2 from "~/assets/svg/icons/plus2.svg?inline";

export default {
  components: {
    IconQuestion2,
    ModalUpdateAnswer,
    IconHelp,
    IconRight,
    IconDown,
    IconEdit24,
    IconDelete,
    IconPlus2,
  },

  props: {
    visible: Boolean,
    question: {},
  },

  data() {
    return {
      alphabet: [..."abcdefghijklmnopqrstuvwxyz"],
      showEditAnswer: false,
      showMemo: false,
      active: 1,
      name: "",
      level: "1",
      levels: LEVEL_QUESTIONS,
      error: {},
      index: "",
      data: {
        manual: {
          //level: "",
          content: "",
          note: "",
        },
        answers: [{ selected: false, content: "", index: 0 }],
      },
    };
  },

  mounted() {
    useEffect(this, this.handleChangeQuestion.bind(this), ["question"]);
    useEffect(this, this.handleChangeData.bind(this), ["data"]);
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

    handleSelectAnswerTrue(index) {
      // if (!this.data.answers[index].index) {
      //   this.data.answers[index].index = index;
      // }
      this.data.answers.map((answer, _index) => {
        this.data.answers[_index].selected = false;
        if (+_index === +index) {
          this.data.answers[_index].selected = true;
        }
      });
    },

    handleEditContentAnswer(type, index, content) {
      // if (!this.data.answers[index].index) {
      //   this.data.answers[index].index = index;
      // }
      this.data.answers[index].content = content;
      this.data.answers[index].name = "answer";
      this.showEditAnswer = false;
    },

    handleEditContent(index) {
      // if (!this.data.answers[index].index) {
      //   this.data.answers[index].index = index;
      // }
      this.index = index;
      this.showEditAnswer = true;
    },

    // handleChangeLevel(e) {
    //   this.data.manual.level = e.target.value;
    // },

    handleDeleteAnswer(index) {
      this.data.answers.splice(index, 1);
    },

    handleCancel() {
      this.showEditAnswer = false;
    },

    addItem() {
      const index = +get(this, "data.answers.length", 0);
      let item = {
        content: "",
        index: index,
        matching: {
          content: "matching",
          index: index,
          name: "matching",
        },
        name: "answer",
        selected: false,
      };
      if (this.data.answers) {
        this.data.answers.push(item);
        return;
      }
      this.data.answers = [item];
    },

    get,
  },
};
</script>

<style lang="scss" scoped>
@import "~/assets/scss/components/elearning/bank/_questions.scss";
</style>
