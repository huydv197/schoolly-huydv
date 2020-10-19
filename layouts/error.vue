<template>
  <div class="container">
    <component :is="errorPage" :error="error" />
  </div>
</template>

<script>
import { mapState, mapGetters } from "vuex";
import error404 from "~/components/layout/error/404.vue";
import { TITLE_PAGE_DEFAULT } from "~/utils/config";
export default {
  name: "page-error",
  layout: "default", // optional
  props: {
    error: {
      type: Object,
      default: () => {},
    },
  },

  head() {
    const titleTemplate = (title) => {
      return `${
        this.countSumNoti ? `(${this.countSumNoti}) ` : ``
      }${title} | ${TITLE_PAGE_DEFAULT}`;
    };

    if (this.$device.isMobile) {
      return {
        titleTemplate,
        meta: [
          {
            hid: "viewport",
            name: "viewport",
            // content: "width=1200, user-scalable=yes",
            content: "user-scalable=no",
          },
        ],
      };
    } else {
      return {
        titleTemplate,
      };
    }
  },

  computed: {
    ...mapState(["desktopView"]),
    ...mapGetters("elearning/study/notifications", ["countSumNoti"]),

    errorPage() {
      if (this.error.statusCode === 404) {
        return error404;
      }
    },
  },

  watch: {
    countSumNoti() {
      this.$meta().refresh();
    },
  },
};
</script>

<style></style>
