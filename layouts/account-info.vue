<template>
  <div class="page-wrap layout-default">
    <TheHeader />
    <nuxt class="page-content" />

    <portal-target name="modal" multiple></portal-target>
  </div>
</template>

<script>
import { mapState, mapMutations, mapGetters } from "vuex";

import TheHeader from "~/components/layout/header/Header";
import { TITLE_PAGE_DEFAULT } from "~/utils/config";

export default {
  middleware: ["authenticated"],

  components: {
    TheHeader,
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

  mounted() {
    const self = this;
    document &&
      document.addEventListener("visibilitychange", (event) => {
        // console.log(
        //   "[account-info] visibilitychange",
        //   document.visibilityState
        // );
        const isVisible = document.visibilityState == "visible";
        self.setIsVisibility(isVisible);
      });
  },

  watch: {
    countSumNoti() {
      this.$meta().refresh();
    },
  },

  methods: {
    ...mapMutations("event", ["setIsVisibility"]),
  }
};
</script>

<style lang="scss">
@import "~/assets/scss/layouts/_default.scss";
</style>
