<template>
<div>
    <div>
        <div @click="launchFilePicker()">
          <slot name="activator"></slot>
        </div>
        <slot name="visualizer"></slot>
    </div>
    <input type="file" @change="onPickedFile($event)" style="display: none" ref="fileInput" accept="image/*"/>
</div>
</template>

<script>
export default {
  name: 'imageUploader',
  props: {
    disabled: {
      type: Boolean,
      default: false,
    },
    value: Object,
    maxSize: {
      type: Number,
      default: 1024
    }
  },
  data: function () {
    return {
      
    }
  },
  methods: {
    launchFilePicker () {
      if(!this.disabled) {
        this.$refs.fileInput.click()
      }
    },
    onPickedFile (event) {
      const imageFile = event.target.files[0]
      const imageURL = URL.createObjectURL(imageFile)
      const fileReader = new FileReader()
      fileReader.addEventListener('load', () => {
        const fileData = fileReader.result
        this.$emit('file-changed', { imageURL, fileData, imageFile })
      })
      fileReader.readAsDataURL(imageFile)
    }
  }
}

</script>
