<template>
  <div>
    <create-content-box title="Bài tập">
      <template v-slot:content>
        <div class="cc-panel__body">
          <app-alert type="warning" class="mb-4" show-close>
            <template slot="icon">
              <IconInfoCircle class="icon ce-alert-icon heading-3 fill-sub" />
            </template>
            Bạn có thể tạo bài kiểm tra bắt buộc cho bài giảng, khóa học của bạn
            tại đây. Học sinh cần hoàn thành bài kiểm tra và đạt điểm để hoàn
            thành khóa học.
          </app-alert>

          <app-button normal color="secondary" size="sm" square>
            Tạo bài tập
          </app-button>
        </div>
      </template>
    </create-content-box>

    <create-content-box title="Bài tập">
      <template v-slot:content>
        <div class="cc-panel__body">
          <div class="mb-4">
            <label for="title" class="text-sub mb-2 d-inline-block"
              >Tiêu đề bài tập</label
            >
            <app-input id="title" :counter="100" />
          </div>

          <div class="d-md-flex align-items-center mb-4">
            <div class="">
              <label for="require" class="text-gray caption"
                >Bài tập bắt buộc?</label
              >
            </div>
            &nbsp;
            <div class="">
              <app-select
                class="cc-select"
                id="require"
                :options="[
                  { value: 1, text: 'Có' },
                  { value: 0, text: 'Không' },
                ]"
                placeholder="Chọn yêu cầu"
                size="sm"
                style="width: 143px; color: #333;"
              >
                <template slot="placeholder-icon">
                  <IconAngleDown class="icon" />
                </template>
              </app-select>
            </div>
          </div>

          <div class="d-flex justify-content-end">
            <app-button size="sm" color="disabled" class="mr-4" square normal>
              Huỷ bỏ
            </app-button>
            <app-button size="sm" color="primary" square normal>
              Tạo bài tập
            </app-button>
          </div>
        </div>
      </template>
    </create-content-box>

    <create-content-box title="Bài tập">
      <template v-slot:content>
        <div class="cc-panel__body">
          <div class="cc-box">
            <div
              class="ce-item cc-box__head d-flex align-items-center justify-content-between"
            >
              <div class="ce-item__left d-flex align-items-center">
                <h3 class="body-2 mr-3">Bài tập 1</h3>
                <a
                  href
                  class="ce-item__action edit mr-3"
                  @click.prevent="isEdited = !isEdited"
                  title="Chỉnh sửa"
                >
                  <IconEditAlt class="icon d-block subheading fill-primary" />
                </a>
                <a href class="ce-item__action delete mr-3" title="Xóa">
                  <IconTrashAlt
                    class="icon d-block subheading fill-secondary"
                  />
                </a>
              </div>

              <div class="ce-item__right">
                <a
                  href
                  class="text-secondary"
                  @click.prevent="isEdited = !isEdited"
                  >Thêm câu hỏi</a
                >
              </div>
            </div>

            <div class="cc-box__body" v-if="isEdited">
              <div class="cc-box__bg-gray pa-4">
                <div class="ce-question-type">
                  <a
                    href
                    :class="{ active: editType === 'choice' }"
                    @click.prevent="editType = 'choice'"
                  >
                    <IconFileCheck class="icon" />Câu hỏi trắc nghiệm
                  </a>
                  <a
                    href
                    :class="{ active: editType === 'essay' }"
                    @click.prevent="editType = 'essay'"
                  >
                    <IconClipboardNotes class="icon" />Tự luận
                  </a>
                  <a
                    href
                    :class="{ active: editType === 'upload' }"
                    @click.prevent="editType = 'upload'"
                  >
                    <IconUpload class="icon" />Upload câu hỏi
                  </a>
                </div>

                <app-divider class="my-4" />

                <div v-if="editType === 'choice'">
                  <label class="d-inline-block mb-3" for="question-editor"
                    >Nội dung câu hỏi</label
                  >

                  <app-editor id="question-editor" class="mb-4" />

                  <div class="row mb-4">
                    <div class="col-md-3">
                      <label class="d-inline-block mb-3" for="answer-a"
                        >Đáp án đúng</label
                      >
                      <div>
                        <app-radio name="answer" value="a" id="answer-a"
                          >A</app-radio
                        >
                      </div>
                    </div>

                    <div class="col-md-9">
                      <label class="d-inline-block mb-3" for="answer-editor"
                        >Nội dung đáp án</label
                      >
                      <div class="d-flex align-items-start">
                        <div class="flex-grow mr-4">
                          <app-editor id="answer-editor" />
                        </div>

                        <div>
                          <button>
                            <IconTrashAlt
                              class="icon d-block subheading fill-secondary"
                            />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div class="row mb-4">
                    <div class="col-md-3">
                      <label class="d-inline-block mb-3" for=""
                        >Điểm cho đáp án đúng</label
                      >
                    </div>
                    <div class="col-md-2">
                      <app-input></app-input>
                    </div>
                  </div>
                </div>

                <div v-if="editType === 'essay'">
                  <label class="d-inline-block mb-3" for="question-editor"
                    >Nội dung câu hỏi</label
                  >

                  <app-editor class="mb-4" id="question-editor" />
                </div>

                <div v-if="editType === 'upload'">
                  <label class="d-inline-block mb-3" for="question-editor"
                    >Upload câu hỏi</label
                  >
                  <div class="mb-4">
                    <app-upload class="w-100"></app-upload>
                  </div>
                </div>

                <div class="d-flex justify-content-end">
                  <app-button
                    color="disabled"
                    class="mr-4"
                    size="sm"
                    square
                    normal
                  >
                    Huỷ bỏ
                  </app-button>
                  <app-button color="primary" size="sm" square normal>
                    Lưu câu hỏi
                  </app-button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </template>
    </create-content-box>

    <create-content-box title="Bài tập">
      <template v-slot:content>
        <div class="cc-panel__body">
          <div class="cc-box">
            <div class="cc-box__head">
              <div class="cc-box__head-left">
                <h2 class="cc-box__title heading-6">Bài tập 1</h2>
                <button class="cc-box__btn cc-box__btn-edit">
                  <IconEditAlt class="icon" />
                </button>
              </div>
            </div>

            <div class="cc-box__body">
              <div class="cc-box__bg-gray pa-4">
                <div class="ce-question-type">
                  <a
                    href
                    :class="{ active: createType === 'choice' }"
                    @click.prevent="createType = 'choice'"
                  >
                    <IconFileCheck class="icon" />Câu hỏi trắc nghiệm
                  </a>
                  <a
                    href
                    :class="{ active: createType === 'essay' }"
                    @click.prevent="createType = 'essay'"
                  >
                    <IconClipboardNotes class="icon" />Tự luận
                  </a>
                  <a
                    href
                    :class="{ active: createType === 'upload' }"
                    @click.prevent="createType = 'upload'"
                  >
                    <IconUpload class="icon" />Upload câu hỏi
                  </a>
                </div>

                <app-divider class="my-4" />

                <div v-if="createType === 'choice'">
                  <label class="d-inline-block mb-3" for="question-editor"
                    >Nội dung câu hỏi</label
                  >

                  <app-editor id="question-editor" class="mb-4" />

                  <div class="row mb-4">
                    <div class="col-md-3">
                      <label class="d-inline-block mb-3" for="answer-a"
                        >Đáp án đúng</label
                      >
                      <div>
                        <app-radio name="answer" value="a" id="answer-a"
                          >A</app-radio
                        >
                      </div>
                    </div>

                    <div class="col-md-9">
                      <label class="d-inline-block mb-3" for="answer-editor"
                        >Nội dung đáp án</label
                      >
                      <div class="d-flex align-items-start">
                        <div class="flex-grow mr-4">
                          <app-editor id="answer-editor" />
                        </div>

                        <div>
                          <button>
                            <IconTrashAlt
                              class="icon d-block subheading fill-secondary"
                            />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div class="row mb-4">
                    <div class="col-md-3">
                      <label class="d-inline-block mb-3" for=""
                        >Điểm cho đáp án đúng</label
                      >
                    </div>
                    <div class="col-md-2">
                      <app-input></app-input>
                    </div>
                  </div>
                </div>

                <div v-if="createType === 'essay'">
                  <label class="d-inline-block mb-3" for="question-editor"
                    >Nội dung câu hỏi</label
                  >

                  <app-editor class="mb-4" id="question-editor" />
                </div>

                <div v-if="createType === 'upload'">
                  <label class="d-inline-block mb-3" for="question-editor"
                    >Upload câu hỏi</label
                  >
                  <div class="mb-4">
                    <app-upload class="w-100"></app-upload>
                  </div>
                </div>

                <div class="d-flex justify-content-end">
                  <app-button
                    color="disabled"
                    class="mr-4"
                    size="sm"
                    square
                    normal
                  >
                    Huỷ bỏ
                  </app-button>
                  <app-button color="primary" size="sm" square normal>
                    Lưu câu hỏi
                  </app-button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </template>
    </create-content-box>
  </div>
</template>

<script>
import CreateContentBox from "~/components/page/classroom/create/CreateContentBox";
import IconInfoCircle from "~/assets/svg/design-icons/info-circle.svg?inline";
import IconAngleDown from "~/assets/svg/design-icons/angle-down.svg?inline";
import IconTrashAlt from "~/assets/svg/design-icons/trash-alt.svg?inline";
import IconEditAlt from "~/assets/svg/design-icons/edit-alt.svg?inline";
import IconFileCheck from "~/assets/svg/design-icons/file-check.svg?inline";
import IconClipboardNotes from "~/assets/svg/design-icons/clipboard-notes.svg?inline";
import IconUpload from "~/assets/svg/design-icons/upload.svg?inline";

export default {
  components: {
    CreateContentBox,
    IconInfoCircle,
    IconAngleDown,
    IconTrashAlt,
    IconEditAlt,
    IconFileCheck,
    IconClipboardNotes,
    IconUpload,
  },
  data() {
    return {
      editor: null,
      answerEditor: null,
      createType: "choice", // 'choice' | 'essay' | 'upload',
      editType: "choice", // 'choice' | 'essay' | 'upload',
      isEdited: false,
    };
  },
  mounted() {},
};
</script>

<style lang="scss">
@import "~/assets/scss/components/classroom/create/_create-exercise.scss";
</style>
