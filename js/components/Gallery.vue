<template>
    <div class="gl">
        <slot />
        <div class="gallery">
            <div v-for="(file, key) in dataItems"
                    :key="key"
                    class="gallery__block">
                <div :class="['gallery__figure box has-background-light raises-on-hover file-box has-padding-large',
                    {'_iframe': !file.mime_type.split('/')[0] === 'image'}]"
                    @click="files.length > 0 ? initGallery(key) : changeGallery(key)">
                    <div class="gallery__wrp">
                        <img v-if="file.mime_type.split('/')[0] === 'image'"
                            :ref="`gallery:${key}`"
                            :src="file.url"
                            :alt="file.name">
                        <label v-else
                            class="pdf__iframe"
                            :ref="`gallery:${key}`"
                            :src="file.url"
                            :alt="file.name"
                            type="application/pdf"
                            frameborder="0">
                            <span class="icon is-large">
                                <fa size="3x" class="fa mdi mdi-48px" :icon="'file-pdf'" />
                            </span>
                        </label>
                    </div>
                    <div class="gallery__preview">
                        <span class="icon is-medium ">
                            <fa class="fa-2x" icon="eye" />
                        </span>
                    </div>
                    <label class="label">
                        <span class="icon">
                            <fa class="fa" :icon="file.mime_type.split('/')[0] === 'image' ? 'file-image' : 'file-pdf'" />
                        </span>
                        <span class="word-break">{{file.name}}</span>
                    </label>
                    <div class="gallery__controler">
                        <!-- <span class="icon is-medium ">
                            <fa class="fa" icon="download" />
                        </span>
                        <span class="icon is-medium ">
                            <fa class="fa" icon="check" />
                        </span> -->
                    </div>
                </div>
            </div>
        </div>
        <div ref="preview" class="pswp" tabindex="-1" role="dialog" aria-hidden="true">
            <div class="pswp__bg"></div>
            <div class="pswp__scroll-wrap">
                <div class="pswp__container">
                    <div class="pswp__item"></div>
                    <div class="pswp__item"></div>
                    <div class="pswp__item"></div>
                </div>
                <div class="pswp__ui pswp__ui--hidden">
                    <div class="pswp__top-bar">
                        <div class="pswp__counter"></div>

                        <button class="pswp__button pswp__button--close" title="Close (Esc)"></button>

                        <button class="pswp__button pswp__button--fs" title="Toggle fullscreen"></button>

                        <button class="pswp__button pswp__button--zoom" title="Zoom in/out"></button>
                        <div class="pswp__preloader">
                            <div class="pswp__preloader__icn">
                            <div class="pswp__preloader__cut">
                                <div class="pswp__preloader__donut"></div>
                            </div>
                            </div>
                        </div>
                    </div>
                    <div class="pswp__share-modal pswp__share-modal--hidden pswp__single-tap">
                        <div class="pswp__share-tooltip"></div>
                    </div>
                    <button class="pswp__button pswp__button--arrow--left" title="Previous (arrow left)">
                    </button>
                    <button class="pswp__button pswp__button--arrow--right" title="Next (arrow right)">
                    </button>
                    <div class="pswp__caption">
                        <div class="pswp__caption__center"></div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import PhotoSwipe from 'photoswipe/dist/photoswipe';
import PhotoSwipeUI_Default from 'photoswipe/dist/photoswipe-ui-default';
import 'photoswipe/dist/photoswipe.css';
import 'photoswipe/dist/default-skin/default-skin.css';

import { library } from '@fortawesome/fontawesome-svg-core';
import {
    faEnvelope,
    faPencilAlt,
    faFile,
    faAt,
    faSync,
    faCheck,
    faTimes,
    faDownload,
    faEye,
    faFileImage,
    faFilePdf,
} from '@fortawesome/free-solid-svg-icons';

library.add([
    faEnvelope,
    faPencilAlt,
    faFile,
    faAt,
    faSync,
    faCheck,
    faTimes,
    faDownload,
    faEye,
    faFileImage,
    faFilePdf,
]);

export default {
    props: {
        dataItems: {
            type: Array,
            default: [],
        }
    },
    data() {
        return {
            gallery: null,
            files: [],
        }
    },
    methods: {
        changeGallery(index, next = 0) {
            let file = this.dataItems[next];

            if (file.mime_type.split('/')[0] === 'image') {
                const img = this.$refs[`gallery:${next}`][0];

                this.files.push({
                    src: file.url,
                    title: file.name,
                    w: img.naturalWidth,
                    h: img.naturalHeight,
                });

                this.controlGalleryAction(index, next);
            } else {
                axios.get(file.url, {
                    responseType: 'arraybuffer'
                }).then(({data}) => {
                    let pdf = new Buffer(data, 'binary').toString('base64');

                    this.files.push({
                        html: `<iframe class="pdf__iframes" frameborder="0" type="application/pdf" src="data:application/pdf;base64,${pdf}"></iframe>`,
                        title: file.name,
                    });

                    this.controlGalleryAction(index, next);
                });
            }
        },
        controlGalleryAction(index, next) {
            next === (this.dataItems.length - 1) ?
                this.initGallery(index) :
                this.changeGallery(index, next+1);
        },
        initGallery(index) {
            const pswpElement = this.$refs.preview;
            const options = {
                galleryUID: 0,
                index: index,
                timeToIdle: 4000,
                maxSpreadZoom: 10,
                history: false,
            };

            this.gallery = new PhotoSwipe( pswpElement, PhotoSwipeUI_Default, this.files, options);
            this.$nextTick(() => this.gallery.init());
        }
    }
}
</script>

<!--width: 70%
        height: calc(100vh - 88px)
        overflow: hidden

        gallery__block

        max-width: 19%
        margin: 5px auto
        -->

<style lang="sass">
.pswp__caption__center
    text-align: center

.gl
    max-height: 100%
    width: 100%

.modal-gallery
    .time
        font-size: 11px
        letter-spacing: 1px

.pdf
    &__container
        width: 100%
        height: 100%
        display: flex
        justify-content: center
        align-items: center
    &__iframe
        display: flex
        width: 200px
        justify-content: center
    &__iframes
        width: 70%
        height: calc(100vh - 88px)
        overflow: hidden

.pswp
    &__zoom-wrap
        display: flex
        justify-content: center
        align-items: center

.gallery
    display: flex
    align-items: flex-start
    flex-wrap: wrap
    max-height: calc(100vh - 150px)
    min-height: 70%
    overflow: auto
    padding: 1em .7em
    margin-bottom: .5em
    box-shadow: inset 0 2px 3px hsla(0,0%,4%,.1), 0 0 0 1px hsla(0,0%,4%,.1)
    &__head
        margin-bottom: 0 !important
    &__block
        display: flex
        justify-content: flex-start
        align-items: center
        position: relative
        flex-direction: column
        min-width: 9%
        &:hover
            .gallery__wrp
                opacity: .5
            .gallery__controler,
            .gallery__preview
                opacity: 1
                svg
                    transform: none
            .gallery__figure
    &__wrp
        display: flex
        justify-content: center
        align-items: center
        position: relative
        height: 230px
        width: auto
        transition: .3s ease-out
    &__figure
        height: auto
        position: relative
        display: flex
        justify-content: center
        align-items: center
        box-shadow: 0 0 14px 0 rgba(128, 128, 128, 0.28)
        border-radius: 4px
        overflow: hidden
        max-height: 230px
        max-width: 100%
        border: none
        padding: 0
        margin: 5px
        cursor: pointer
        &:hover
            box-shadow: 0 2px 18px 1px rgba(42, 51, 83, 0.35)
        .label
            width: 100%
            position: absolute
            top: 0
            padding: .5rem .8rem
            white-space: nowrap
            overflow: hidden
            text-overflow: ellipsis
            background-color: whitesmoke
        &._iframe
            iframe
                height: 250px
                width: 150px
                pointer-events: none
        img
            position: relative
            width: auto
            height: 100%
            max-width: none
        a
            display: flex
            justify-content: center
            align-items: center
            width: 100%
    &__controler
        display: flex
        align-items: flex-end
        justify-content: center
        width: 100%
        position: absolute
        bottom: 0
        opacity: 0
        transition: .3s ease-out
        svg
            transition: .1s ease-in
            transform: scale(.2, .2)
    &__preview
        position: absolute
        opacity: 0
        transition: .3s ease-out
        svg
            transition: .1s ease-in
            transform: scale(.2, .2)

.word-break
    white-space: pre-wrap
    word-break: break-all

.pswp--animate_opacity,
.pswp__bg,
.pswp__caption,
.pswp__top-bar,
.pswp--has_mouse .pswp__button--arrow--left,
.pswp--has_mouse .pswp__button--arrow--right
    transition: opacity 333ms cubic-bezier(.4,0,.22,1)
</style>
