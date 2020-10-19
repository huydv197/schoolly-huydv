<template>
  <div class="container mytutor-olclass">
    <breadcrumb />
    <div class="row">
      <div class="col-md-3">
        <MenuSideMyTutor :active="1" />
      </div>

      <div class="col-md-9">
        <sub-block-section title="Lớp học online">
          <template v-slot:content>
            <div class="d-flex justify-content-between mb-4">
              <div>
                <div class="d-flex-center mb-2">
                  <div class="filter-form__item">
                    <app-search
                      v-model="payload.query"
                      class="w-100 mb-0"
                      :placeholder="'Nhập để tìm kiếm...'"
                      :size="'sm'"
                      bordered
                      @submit="search"
                      @keyup.enter.native="search"
                    ></app-search>
                  </div>

                  <div class="filter-form__item">
                    <app-button
                      :color="showFilter ? 'primary' : 'white'"
                      :size="'sm'"
                      square
                      @click="toggleFilter"
                    >
                      <IconHamberger
                        :class="showFilter ? 'fill-white' : 'fill-primary'"
                        class="mr-2"
                      />
                      <span>Lọc kết quả</span>
                    </app-button>
                  </div>
                </div>

                <div v-if="showFilter" class="d-flex-center mb-2">
                  <div class="filter-form__item">
                    <app-select
                      placeholder="Trạng thái"
                      size="sm"
                      bordered
                      searchable
                      v-model="status"
                      :options="statusOpts"
                      @change="handleChangeStatus"
                    ></app-select>
                  </div>
                  <div class="filter-form__item">
                    <app-select
                      label="text"
                      placeholder="Môn học"
                      size="sm"
                      bordered
                      searchable
                      v-model="subject"
                      :options="subjectsAllOpts"
                      @change="handleChangeSubject"
                    ></app-select>
                  </div>
                  <div class="filter-form__item">
                    <app-select
                      placeholder="Khối"
                      size="sm"
                      bordered
                      searchable
                      v-model="grade"
                      :options="gradesAllOpts"
                      @change="handleChangeGrade"
                    ></app-select>
                  </div>
                </div>

                <app-button
                  color="pink"
                  size="sm"
                  :disabled="ids.length == 0"
                  @click.prevent="handleClickCancel"
                >
                  <IconRemoveCircleOutline
                    class="icon fill-opacity-1 body-1 mr-2"
                  />Hủy
                </app-button>
              </div>

              <n-link
                :to="'/elearning/mytutor/olclass/create'"
                class="btn btn--size-sm btn--color-primary btn--square btn-right"
              >
                <IconAddCircleOutline class="icon fill-opacity-1 mr-2 body-1" />
                <span class="color-white">Tạo lớp học</span>
              </n-link>
            </div>

            <app-table
              :loading="loading"
              :heads="tableHeads"
              :pagination="pagination"
              :data="olclassList"
              multiple-selection
              @pagechange="onPageChange"
              @selectionChange="selectRow"
              @sort="handleSort"
            >
              <td slot="cell(name)" slot-scope="{ row }" class="row-name">
                {{ row.name }}
              </td>

              <td slot="cell(fee)" slot-scope="{ row }" class="row-name">
                {{ row.fee | numeralFormat("0,0") }}
              </td>

              <td
                slot="cell(status)"
                slot-scope="{ row }"
                :class="[row.status === '1' ? 'text-primary' : 'text-secondary']"
              >
                {{ row.status === '1' ? "Đang hoạt động" : "Đã kết thúc" }}
              </td>

              <td slot="cell(range_time)" slot-scope="{ row }">
                {{ convertRangTime(row.range_time) }}
              </td>

              <template slot="actions" slot-scope="{ row }">
                <button @click.prevent="handleEditOlClass(row.id)">
                  <IconBorderColor
                    class="icon fill-opacity-1 mr-3 purple"
                  />Chỉnh sửa
                </button>

                <button @click.prevent="handleClickDetail(row.id)">
                  <IconRemoveRedEye
                    class="icon fill-opacity-1 mr-3 text-info"
                  />Xem chi tiết
                </button>

                <button @click.prevent="handeClickShowStudent">
                  <IconPeopleOutline
                    class="icon fill-opacity-1 mr-3 text-warning"
                  />Xem danh sách học sinh
                </button>

                <button @click.prevent="handeClickShowExams">
                  <IconEventNote
                    class="icon fill-opacity-1 mr-3 text-primary"
                  />Xem bài tập bài kiểm tra
                </button>
              </template>
            </app-table>
          </template>
        </sub-block-section>
      </div>
    </div>

    <app-modal
      v-model="modalDetail"
      :footer="false"
      :width="828"
      :title="olClassListDetail.name ? olClassListDetail.name : ''"
      @close="modalDetail = false"
    >
      <OnlineClassDetail
        slot="content"
        :requestId="requestId"
        @close="modalDetail = false"
      />
    </app-modal>
  </div>
</template>

<script>
import { initBreadcrumb } from "~/utils/common";
import MenuSideMyTutor from "~/components/page/elearning/mytutor/MenuSideMyTutor";
import OnlineClassDetail from "~/components/page/elearning/mytutor/olclass/create/OnlineClassDetail";
import IconAddCircleOutline from "~/assets/svg/v2-icons/add_circle_outline_24px.svg?inline";
import IconHamberger from "~/assets/svg/icons/hamberger.svg?inline";
import IconRemoveCircleOutline from "~/assets/svg/v2-icons/remove_circle_outline_24px.svg?inline";
import IconBorderColor from "~/assets/svg/v2-icons/border_color_24px.svg?inline";
import IconRemoveRedEye from "~/assets/svg/v2-icons/remove_red_eye_24px.svg?inline";
import IconPeopleOutline from "~/assets/svg/v2-icons/people_outline_24px.svg?inline";
import IconEventNote from "~/assets/svg/v2-icons/event_note_24px.svg?inline";
import { get } from "lodash";
import moment from "moment";
import { mapState, mapGetters } from "vuex";
import * as actionTypes from "~/utils/action-types";

export default {
  head: {
    title: "Quản lý lớp học online",
  },

  components: {
    MenuSideMyTutor,
    OnlineClassDetail,
    IconAddCircleOutline,
    IconHamberger,
    IconRemoveCircleOutline,
    IconBorderColor,
    IconRemoveRedEye,
    IconPeopleOutline,
    IconEventNote,
  },

  data() {
    const allOpt = {
      value: null,
      text: "Tất cả",
    };

    return {
      allOpt,
      showFilter: false,
      keyword: "",
      status: null,
      subject: null,
      grade: null,
      statusOpts: [
        allOpt,
        { value: '1', text: "Đang hoạt động" },
        { value: '0', text: "Đã kết thúc" },
        // { value: "SCHEDULED", text: "Đã lên lịch" },
        // { value: "WRITTING", text: "Đã huỷ" },
      ],
      subjectOpts: [allOpt, { value: 456, text: "Môn toán" }],
      gradeOpts: [allOpt, { value: 789, text: "Khối 6" }],
      ids: [],
      loading: false,
      requestId: "",
      tableHeads: [
        { name: "name", text: "Tên lớp học" },
        { name: "subject", text: "Môn học" },
        { name: "grade", text: "Khối" },
        { name: "fee", text: "Học phí/Buổi" },
        { name: "status", text: "Trạng thái" },
        { name: "range_time", text: "Thời gian" },
      ],
      pagination: {
        total_pages: 0,
        number: 0,
        size: 10,
        total_elements: 0,
        first: 0,
        last: 0,
      },
      elearningList: [
        {
          name:
            "Neque porro quisquam est qui dolorem ipsum quia dolor sit amet",
          subject: "Toán",
          grade: 6,
          price: "1.500.000đ",
          status: 1,
          range_time: "15/11/2019 - 10/10/2020",
        },
      ],
      olclassList: [],
      modalDetail: false,
      payload: {
        page: 1,
        size: 10,
        query: "",
        subject_id: null,
        grade_id: null,
        class_status: null,
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
    ]);
  },

  computed: {
    ...mapState("elearning/mytutor/olclass", [
      "olClassList",
      "olClassListDetail",
    ]),
    ...mapGetters("elearning/public/public-subject", ["subjectsAllOpts"]),
    ...mapGetters("elearning/public/public-grades", ["gradesAllOpts"]),
  },

  created() {
    this.getList();
  },

  methods: {
    get,

    async getList() {
      const self = this;
      try {
        self.loading = true;
        Object.keys(this.payload).map((k) => {
          if (this.payload[k] == null || this.payload[k] == -1) {
            delete this.payload[k];
          }
        });
        let params = { ...this.payload };
        await this.$store.dispatch(
          `elearning/mytutor/olclass/${actionTypes.MYTUTOR_OLCLASS.LIST}`,
          { params }
        );
        self.olclassList = self.get(self.olClassList, "data.content", []);
        self.pagination.size = self.get(self.olClassList, "data.page.size", 10);
        self.pagination.first = self.get(self.olClassList, "data.page.first", 1);
        self.pagination.last = self.get(self.olClassList, "data.page.last", 1);
        self.pagination.number = self.get(self.olClassList, "data.page.number", 0);
        self.pagination.total_pages = self.get(
          self.olClassList,
          "data.page.total_pages",
          0
        );
        self.pagination.total_elements = self.get(
          self.olClassList,
          "data.page.total_elements",
          0
        );
        self.pagination.number_of_elements = self.get(
          self.stateClass,
          "data.number_of_elements",
          0
        );
        // console.log("pagination", self.pagination);
      } catch (e) {
      } finally {
        self.loading = false;
      }
    },

    convertRangTime(rangeTime) {
      if (!rangeTime) return;
      let dates = rangeTime && rangeTime.split(" - ");
      let start = moment(dates[0]).format("DD/MM/YYYY");
      let end = moment(dates[1]).format("DD/MM/YYYY");

      return start + " - " + end;
    },

    toggleFilter() {
      if (
        this.showFilter &&
        (this.status != null || this.subject != null || this.grade != null)
      ) {
        this.status = null;
        this.grade = null;
        this.subject = null;
        this.payload.subject_id = null;
        this.payload.grade_id = null;
        this.payload.class_status = null;
        this.getList();
      }
      this.showFilter = !this.showFilter;
    },

    search() {
      this.getList();
    },

    handleChangeStatus(_val) {
      // console.log("handleChangeStatus", _val);
      this.payload.class_status = _val;
      this.getList();
    },

    handleChangeSubject(_val) {
      // console.log("handleChangeSubject", _val);
      this.payload.subject_id = _val;
      this.getList();
    },

    handleChangeGrade(_val) {
      // console.log("handleChangeGrade", _val);
      this.payload.grade_id = _val;
      this.getList();
    },

    onPageChange(e) {
      const that = this;
      that.pagination = { ...that.pagination, ...e };
      that.payload.size = that.pagination.size;
      that.payload.page = that.pagination.number + 1;
      this.checkPage = false;
      that.getList();
    },
    selectRow(data) {
      // console.log("selectRow", data);
      this.ids = data.map((item) => {
        return item.id;
      });
    },
    async handleClickCancel() {
      const doCreate = await this.$store.dispatch(
        `elearning/mytutor/olclass/${actionTypes.MYTUTOR_OLCLASS.DELETE}`,
        { online_class_ids: this.ids }
      );
      if (doCreate.success) {
        this.$toasted.success("Thành công");
        this.getList();
      } else if (doCreate.message) {
        this.$toasted.error(doCreate.message);
      }
    },
    handleSort() {},
    handleClickDetail(_id) {
      this.requestId = _id;
      this.modalDetail = true;
    },

    handleEditOlClass(id) {
      this.$router.push("/elearning/mytutor/olclass/edit/" + id);
    },

    handeClickShowStudent(){
      this.$router.push(`/elearning/mytutor/student`);
    },

    handeClickShowExams(){
      this.$router.push(`/elearning/mytutor/exams`);
    }
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
        title: "Lớp học online",
        to: "/elearning/mytutor/olclass",
      },
    ];
    initBreadcrumb(this, breadcrumb);
  },
};
</script>

<style lang="scss" scoped>
@import "~/assets/scss/components/elearning/manager/_elearning-manager.scss";
@import "~/assets/scss/components/elearning/_elearning-filter-form.scss";

.row-name {
  width: 22.4rem;
}

.purple {
  color: #9b51e0;
}
</style>
