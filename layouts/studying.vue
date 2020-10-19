<template>
  <div class="page-wrap layout-create">
    <nuxt class="page-content" />

    <Footer />

    <portal-target name="modal" multiple></portal-target>
  </div>
</template>

<script>
import { mapState, mapGetters } from "vuex";
import Footer from "~/components/layout/footer/Footer";
import { TITLE_PAGE_DEFAULT } from "~/utils/config";

export default {
  middleware: ["authenticated"],

  components: {
    Footer,
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
