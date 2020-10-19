<template>
  <div class="page-wrap">
    <nuxt class="page-content" />
  </div>
</template>

<script>
import { mapState, mapGetters } from "vuex";
import { TITLE_PAGE_DEFAULT } from "~/utils/config";

export default {
  name: "Empty",

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
  },

  watch: {
    countSumNoti() {
      this.$meta().refresh();
    },
  },
};
</script>

<style lang="scss">
@import "~/assets/scss/layouts/_create.scss";
</style>
