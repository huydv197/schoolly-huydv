<template>
  <div class="upload-resource-form">
		<div
			class="uprf__wrapper"
			@drop="handleDrop"
			@dragover="handleDragover"
			@dragenter="handleDragover"
		>
			<!--Upload notification-->
			<div class="upload-alert" v-show="isSuccess || isError">
				<!--Upload fail-->
				<div class="upload-alert--error" v-if="isError">
					<div class="upload-alert--error__info mb-2">
						<div style="line-height: 100%;">
							<IconCloseOutline class="icon icon--close-alert"/>
						</div>
						<div>
							<span class="upload-alert--error__mess">{{ get(error, 'message', '') }}</span>
						</div>
					</div>
		
					<div class="upload-alert--error__status">
						{{ get(error, 'reason', '') }}
					</div>
				</div>
	
				<!--Upload success-->
				<div class="upload-alert--success" v-if="isSuccess">
					<p class="upload-alert--success__title">
						<!-- <IconSuccess class="icon" width="30" height="30" style="height: 1.8rem; width: 1.8rem;"/> -->
						<span>Đã tải xong 1 file lên</span>
					</p>
					<div class="d-flex justify-content-center mb-4">
						<p class="file-name" :title="currentFile.name">
							<span>{{ currentFile.name | truncStrFilter(35) }}</span>
							<IconCheckPrimary class="ml-auto"/>
						</p>
						<button @click="deleteRecentFile" class="ml-3">
							<IconClose24px/>
						</button>
					</div>
				</div>
	
				<!--Button continue uploading-->
				<div class="text-center" v-show="isError || isSuccess">
					<app-button
						@click="uploadOther"
						rounded
						color="primary"
						outline
						class="text-primary font-weight-medium"
						size="md"
					>
						<slot name="icon">
							<IconUploadFile class="icon--btn icon--btn--pre" style="height: 17px;"/>
						</slot>
						<span>Tải lên</span>
					</app-button>
				</div>
			</div>

			<!--Uploading-->
			<div class="py-3" v-if="isUploading">
				<div class="d-flex justify-content-center">
					<p class="file-name mb-2" :title="currentFile.name"><b>{{ currentFile.name | truncStrFilter(35) }}</b></p>
				</div>
				<div class="mb-2" style="padding-right: 2.7rem; position: relative">
					<div>
						<app-progress
							:percentage="uploadPercentage"
							rounded
							size="lg"
							:inner-options="{ 'background-color': '#6FDA44' }"
						>
						</app-progress>
					</div>
					<IconCloseOutline class='icon icon-uploading-cancel' title="Hủy" @click="cancelUpload"/>
				</div>
				<p class="process--upload__status">
					<span>Đang tải lên {{ uploadPercentage }}</span>% - <span>{{ uploadSpeed }}</span> (<span>{{ this.currentFile.size | fileSizeFilter }}</span>)
				</p>
			</div>

			<!--Drag & drop file-->
			<div class="text-center" v-if="isInitial">
				<p class="mb-4 text-instruction">Click để chọn tập tin hoặc kéo thả tập tin vào đây để tải lên.</p>
				<app-button
					@click="handleUpload"
					rounded
					color="primary"
					outline
					class="text-primary font-weight-medium mb-4"
					size="md"
				>
					<slot name="icon">
						<IconUploadFile class="icon--btn icon--btn--pre" style="height: 17px;"/>
					</slot>
					<span>Tải lên</span>
				</app-button>
				<div style="opacity: 0.5; line-height: 1.3rem;">
					<p class="body-3">
						Xem các định dạng file được chấp nhận
						<slot name="availabelFileType">
							<v-popover
								class="d-inline"
								offset="10"
								trigger="hover"
								placement="top"
								popover-class="tooltip--available-file"
							>
								<IconInfo class="" style="width: 1.3rem; height: 1.3rem; margin-bottom: -2px;"/>
								<template slot="popover" class="tooltip-detail">
									<div>
										<p class="mb-3">
											Định dạng file văn bản được chấp nhận:
											<span class="text-dark font-weight-semi-bold">.doc, .docx, .pdf, .rtf , .txt, .csv, .xls, .xlsx, .ppt, .pptx, odt, odp, .ods, .zip</span>
										</p>
										<p>
											Định dạng video được chấp nhận:
											<span class="text-dark font-weight-semi-bold">.mp4, .f4v, .mov, .m4a, .m4v, .mp4a, .mp4v, .3gp, .3g2, .flv, .smil</span>
										</p>
									</div>
								</template>
							</v-popover>
						</slot>
					</p>
				</div>
				
				<input
					class="d-none"
					ref="upload-input"
					type="file"
					accept=".m4a, .mp3, .jpeg, .jpg, .png, .gif, .bmp, .docx, .doc, .ppt, .pptx, .pdf, .txt, .mp4, .mov, .f4v, .m4v, .mp4a, .mp4v, .3gp, .3g2, .smil, .flv, .zip"
					style="z-index: -9999;"
					@change="handleClick"
				/>
			</div>
		</div>
  </div>
</template>

<script>
  import IconUploadFile from "~/assets/svg/v2-icons/cloud_upload_24px.svg?inline"
  import IconInfo from "~/assets/svg/v2-icons/info_24px.svg?inline"
  import IconCloseOutline from '~/assets/svg/icons/Close-outline.svg?inline'
  import IconClose from '~/assets/svg/icons/close.svg?inline'
	import IconSuccess from '~/assets/svg/icons/success.svg?inline'
	import IconCheckPrimary from '~/assets/svg/v2-icons/check_primary.svg?inline'
	import IconClose24px from '~/assets/svg/v2-icons/close_24px.svg?inline';
  // import {createPayloadAddRepository} from "~/models/elearning/Repository"
  import {get} from "lodash"
  import { fileSizeFilter } from "~/plugins/filters";
  import * as yup from "yup"
  import * as actionTypes from "~/utils/action-types"
  import { MAX_UPLOADED_REPOSITORY_FILE_SIZE } from "~/utils/config"

  const schema = yup.object().shape({
    name: yup.string().required(),
    // file: yup.object().required()
  });

  // const STORE_NAMESPACE = 'elearning/teaching/repository-files'
  const DEFAULT_ERROR_MESSAGE = 'Tải lên không thành công'
  const DEFAULT_ERROR_REASON = 'Xảy ra lỗi'

  const STATUS = {
    INITIAL: 0,
    ERROR: 1,
    SUCCESS: 2,
    UPLOADING: 3
  }

  export default {
    data() {
      return {
        payload: {
          file: '',
          name: ''
        },
        error: {
          message: '',
          reason: ''
        },
        currentFile: {},
        uploadPercentage: 0,
        loadedPayload: 0,
        uploadTimestamp: 0,
        diffTimestamp: 1,
        diffPayload: 0,
        currentStatus: 0,
        cancelUploadToken: null
      }
    },
    props: {
      multiple: Boolean,
      beforeUpload: Function, // eslint-disable-line
      onSuccess: Function,// eslint-disable-line,
    },
    components: {
      IconUploadFile,
      IconInfo,
      IconCloseOutline,
      IconClose,
			IconSuccess,
			IconCheckPrimary,
			IconClose24px
    },
    computed: {
      uploadSpeed: function() {
        return `${Number((this.diffPayload / this.diffTimestamp).toFixed(1))} KB/s`
      },
      isInitial: function () {
        return this.currentStatus == STATUS['INITIAL']
      },
      isError: function () {
        return this.currentStatus == STATUS['ERROR']
      },
      isSuccess: function () {
        return this.currentStatus == STATUS['SUCCESS']
      },
      isUploading: function () {
        return this.currentStatus == STATUS['UPLOADING']
      }
    },
    watch: {
      uploadTimestamp: function(newVal, oldVal) {
        this.diffTimestamp = newVal - oldVal
      },
      loadedPayload: function(newVal, oldVal) {
        this.diffPayload = newVal - oldVal
      }
    },
    methods: {
      async addFile(rawFile) {
        this.payload.name = rawFile.name
        this.payload.file = rawFile

        this.currentFile.name = rawFile.name
        this.currentFile.size = rawFile.size

				// const modelData = createPayloadAddRepository(this.payload)
				const modelData = this.payload;

        const payload = new FormData();
        for (const key in modelData) {
          payload.append(key, modelData[key]);
        }

        const CancelToken = this.$axios.CancelToken;

        let config = {
          onUploadProgress: progressEvent => {
            console.log("[onUploadProgress]", progressEvent);
            
            this.loadedPayload = progressEvent.loaded
            this.uploadTimestamp = progressEvent.timeStamp
            let totalPayload = progressEvent.total
            this.uploadPercentage = Math.floor((this.loadedPayload * 100) / totalPayload)
          },
          cancelToken: new CancelToken( cancel => {
            this.cancelUploadToken = cancel
          }),
        }

        // const res = await this.$store.dispatch(
        //   `${STORE_NAMESPACE}/${actionTypes.ELEARNING_TEACHING_REPOSITORY_FILE.ADD}`,
        //   { payload, config }
				// );

				// Mock response
				const res = {
					success: true
				};
        return res;
      },
      async validateAddFile(data) {
        const isValid = await schema.isValid(data)
        return isValid
      },
      handleDrop(e) {
        e.stopPropagation()
        e.preventDefault()
        if (this.loading) return

        const files = e.dataTransfer.files

        if (files.length !== 1) {
          this.hasError(DEFAULT_ERROR_MESSAGE, 'Chỉ cho phép tải một file tại một thời điểm!')
          return
        }

        const rawFile = files[0] // only use files[0]
        if (!this.isValidFile(rawFile)) {
          return false
        }
        this.upload(rawFile)
        e.stopPropagation()
        e.preventDefault()
      },

      async upload(rawFile) {
        try {
          this.currentStatus = STATUS['UPLOADING']
          this.$refs['upload-input'].value = null // fix can't select the same excel
  
          let res
  
          if (!this.beforeUpload) {
            res = await this.addFile(rawFile)
          } else {
            const before = this.beforeUpload(rawFile)
            if (before) {
              res = await this.addFile(rawFile)
            }
          }
          if (res && get(res, 'success', false)) {
            this.currentStatus = STATUS['SUCCESS']
            this.onSuccess && this.onSuccess(res)
          } else {
            let reason = res && get(res, "message", false) ? get(res, "message") : DEFAULT_ERROR_REASON
            this.hasError(DEFAULT_ERROR_MESSAGE, reason)
          }
        } catch (e) {
          if (!this.$axios.isCancel(e)) {
            this.hasError(DEFAULT_ERROR_MESSAGE, DEFAULT_ERROR_REASON)
          }
        }
      },
      handleDragover(e) {
        e.stopPropagation()
        e.preventDefault()
        e.dataTransfer.dropEffect = 'copy'
      },
      handleUpload() {
        this.$refs['upload-input'].click()
      },
      async handleClick(e) {
        const files = e.target.files
        const rawFile = files[0] // only use files[0]
        if (!rawFile) return
        if (!this.isValidFile(rawFile)) {
          return
        }
        await this.upload(rawFile)
      },
      isValidFile(file) {
        if (!this.isValidType(file)) {
          this.hasError(DEFAULT_ERROR_MESSAGE, 'File tải lên không đúng định dạng cho phép')
          return false
        }
        if (!this.isValidSize(file)) {
          this.hasError(DEFAULT_ERROR_MESSAGE, `Dung lượng quá giới hạn > ${fileSizeFilter(MAX_UPLOADED_REPOSITORY_FILE_SIZE*1024*1024)}`)
          return false
        }
        if (!this.isAvailableStorage(file)) {
          this.hasError(DEFAULT_ERROR_MESSAGE, `Kho học liệu của bạn không đủ dung lượng trống để tải file`)
          return false
        }
        return true
      },
      isValidType(file) {
        return /\.(m4a|mp3|jpeg|jpg|png|gif|bmp|docx|doc|ppt|pptx|pdf|txt|mp4|mov|f4v|m4v|mp4a|mp4v|3gp|3g2|smil|flv|zip)$/.test(file.name.toLowerCase())
      },
      isValidSize(file) {
        const isLtSize = file.size / 1024 / 1024 < MAX_UPLOADED_REPOSITORY_FILE_SIZE
        return isLtSize
      },
      isAvailableStorage(file) {
        // temp config
        return true;
        // const fileSize = file.size
        // return this.availableCapcity * 1024 * 1024 > fileSize
      },
      async cancelUpload() {
        console.log('[Upload warehouse] Cancal upload')
        if (this.isUploading) {
          await this.cancelUploadToken('Cancel upload file')
          this.resetUpload()
        }
      },
      resetUpload() {
        this.currentStatus = STATUS['INITIAL']
        this.currentFile = {}
      },
      uploadOther() {
        this.resetUpload()
      },
      hasError(message, reason) {
        this.currentStatus = STATUS['ERROR']
        this.error = {
          message: message,
          reason: reason
        }
			},
			deleteRecentFile() {
				console.log('[Delete recent file]')
			},
      get
    }
  }
</script>
<style lang="scss">
@import "~/assets/scss/components/course/create/_upload-file-form.scss";
</style>