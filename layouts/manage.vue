<template>
  <div class="page-wrap layout-manage">
    <TheHeader />

    <nuxt class="page-content" />

    <Footer />

    <portal-target name="modal" multiple></portal-target>
  </div>
</template>

<script>
import { mapState, mapGetters, mapMutations } from "vuex";
import TheHeader from "~/components/layout/header/Header";
import Footer from "~/components/layout/footer/Footer";
import { TITLE_PAGE_DEFAULT } from "~/utils/config";

export default {
  middleware: ["teacher-role"],

  components: {
    TheHeader,
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

  mounted() {
    console.log("[manage]");
    const self = this;
    document &&
      document.addEventListener("visibilitychange", (event) => {
        // console.log("[manage] visibilitychange", document.visibilityState);
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
  },
};
</script>

<style lang="scss">
.layout-manage {
  display: flex;
  flex-direction: column;

  .page-content {
    flex-grow: 1;
  }
}
</style>
