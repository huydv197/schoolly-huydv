<template>
  <edit-question-frame @cancel="cancelEdit" @submit="submitForm">
    <div>
      <div class="row">
        <div class="col-md-4">
          <question-type-viewer :type="EXAM_TYPE_QUESTION['FILL_IN_BLANK']"></question-type-viewer>
        </div>
        <div class="col-md-8">
          <!-- <question-level-selection
            v-if="questionDetail.method == 'MANUAL' || questionDetail.method == 'UPLOAD'"
            :level="questionDetail && questionDetail.manual && questionDetail.manual.level || 'EASSY'"
            @change="changeLevel"
          ></question-level-selection>
          <question-level-selection
            v-else-if="questionDetail.method == 'SELECT'"
            :level="questionDetail && questionDetail.select && questionDetail.select.level || 'EASSY'"
            @change="changeLevel"
          ></question-level-selection> -->
          <!-- <app-error :error="'something wrong'" /> -->
        </div>
        <div class="col-12">
          <question-content-editor
            v-if="questionDetail.method == 'MANUAL' || questionDetail.method == 'UPLOAD'"
            class="mt-3 mb-4"
            :content="questionDetail && questionDetail.manual && questionDetail.manual.content || ''"
            @change="changeContent"
            :note="NOTE"
          ></question-content-editor>
          <question-content-editor
            v-else-if="questionDetail.method == 'SELECT'"
            class="mt-3 mb-4"
            :content="questionDetail && questionDetail.select && questionDetail.select.content || ''"
            @change="changeContent"
            :note="NOTE"
          ></question-content-editor>
        </div>
        <div class="col-12">
          <question-note-editor
            class="mb-1"
            :content="questionDetail && questionDetail.manual && questionDetail.manual.note"
            @change="changeNote"
          ></question-note-editor>
        </div>
      </div>
    </div>
  </edit-question-frame>
</template>
<script>
import EditQuestionFrame from "~/components/page/course/create/common/EditQuestionFrame";
import QuestionTypeViewer from "~/components/page/course/create/common/QuestionTypeViewer";
import QuestionLevelSelection from "~/components/page/course/create/common/QuestionLevelSelection";
import QuestionContentEditor from "~/components/page/course/create/common/QuestionContentEditor";
import QuestionNoteEditor from "~/components/page/course/create/common/QuestionNoteEditor";
import { EXAM_TYPE_QUESTION, EXAM_LEVEL } from "~/utils/constants";
import { get, cloneDeep } from "lodash";
import { useEffect, questionBankTypeArr } from "~/utils/common";

const QUESTION_FAKE = {
  id: 7,
  level: "EASY",
  type: "FILL_IN_BLANK",
  content:
    "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry multiple choice",
  note: "Note content",
  answers: "",
};

const NOTE =
  "<p class='heading-5'>Lưu ý: Soạn câu hỏi và sử dụng [dấu ngoặc] để đặt vị trí cần điền từ. Ví dụ: Con [rùa] chạy chậm hơn con [thỏ]. Nếu chỗ điền từ có nhiều đáp án đúng thì có thể cách nhau bởi dấu “|”. Ví dụ: Con [rùa|sên|gà] chạy chậm hơn con [thỏ|sư tử].</p>";

export default {
  components: {
    EditQuestionFrame,
    QuestionTypeViewer,
    QuestionLevelSelection,
    QuestionContentEditor,
    QuestionNoteEditor,
  },
  props: {
    editingItem: {},
  },
  data() {
    return {
      EXAM_TYPE_QUESTION: Object.freeze(EXAM_TYPE_QUESTION),
      EXAM_LEVEL: Object.freeze(EXAM_LEVEL),
      NOTE: Object.freeze(NOTE),
      questionDetail: cloneDeep(this.editingItem),
    };
  },
  methods: {
    // changeLevel(val) {
    //   console.log("[Change Level]", val);
    //   this.questionDetail.manual.level = val;
    // },
    changeContent(val) {
      console.log("[Change content]", val);
      this.questionDetail.manual.content = val;
    },
    changeNote(val) {
      console.log("[Change note]", val);
      this.questionDetail.manual.note = val;
    },
    cancelEdit() {
      this.$emit("cancel");
      console.log("[Cancel edit]");
    },
    submitForm() {
      this.handleFormatPayload();
      this.questionDetail.question_id = this.questionDetail.id;
      this.$emit("submit", this.questionDetail);
      console.log("[Submit form]");
    },
    handleFormatPayload() {
      if (this.questionDetail.type === questionBankTypeArr[3]["id"]) {
        this.questionDetail.answers = null;
      }
      if (this.questionDetail.type === questionBankTypeArr[4]["id"]) {
        this.questionDetail.answers = null;
      }
      if (this.questionDetail.type === questionBankTypeArr[6]["id"]) {
        this.questionDetail.answers = null;
      }
    },
  },
};
</script>
<style lang="scss" scoped>
</style>