<template>
    <b-container fluid class="w-100 mx-5 px-3 py-2">
        <b-row>
            <b-col cols="3">
                <div v-for="(trackMetadata,index) in tracksMetadata" :key="index" class="my-2 track p-2" @click="currentTrack = trackMetadata">
                    <h3>{{trackMetadata.title}}</h3>
                    <h4>{{trackMetadata.artist[0]}}</h4>
                </div>
            </b-col>
            <b-col cols="9">
                <div class="music-visualization d-flex align-items-center justify-content-center px-4">
                    <client-only>
                        <vue-p5 v-on="{setup, draw}"></vue-p5>
                    </client-only>
                </div>
                <div v-if="currentTrack" class="d-flex align-items-center flex-column px-4">
                    <div class="d-flex align-items-center flex-column">
                        <h1>{{currentTrack.title}}</h1>
                        <h2>{{currentTrack.artist[0]}}</h2>
                    </div>
                    <b-form-input v-model="rangeValue" type="range" min="0" max="100" class="mt-2"></b-form-input>
                    <div class="mt-4">
                        <b-icon v-if="isPlaying" icon="pause-circle" font-scale="4" @click="pause"></b-icon>
                        <b-icon v-else icon="play-circle" font-scale="4" @click="play"></b-icon>
                    </div>
                </div>
            </b-col>
        </b-row>
    </b-container>
</template>

<script lang="ts">
import Vue from 'vue';
import * as p5 from "p5";
import VueP5 from "vue-p5";

export default Vue.extend({
    components: {
        "vue-p5": VueP5
    },
    data(){
        return {
            currentTrack: undefined,
            isPlaying: false,
            rangeValue: 0,
            fft: undefined
        }
    },
    async asyncData({$axios}){
        try{
            const tracksMetadata = (await $axios.$get('/api/music')).files;
            return { tracksMetadata };
        }                                                                                                                                                                                                        
        catch(error){
            console.log(error);
        }
    },
    methods: {
        play(){
            this.isPlaying = true;
            console.log(this.currentTrack);
        },
        pause(){
            this.isPlaying = false;
        },
        setup(sketch: p5) {
            sketch.resizeCanvas(880, 600);
            sketch.background('green');
            sketch.text('Hello p5!', 20, 20);
        },
        draw(sketch: p5){
            sketch;
        }
    }
})
</script>

<style>
    #__layout {
        background: #36393F;
        display: flex;
        justify-content: center;
        align-items: center;
        min-width: 100vw;
        min-height: 100vh;
    }
    .container-fluid {
        background: black;
        border-radius: 45px;
        overflow: hidden;
    }

    h1 {
        font-size: 25px;
        color: white;
    }

    h2{
        font-size: 20px;
        color: rgb(189, 189, 189);
    }

    h3 {
        font-size: 20px;
        color: white;
    }

    h4{
        font-size: 16px;
        color: rgb(189, 189, 189);
    }

    .track {
        border-bottom: white solid 2px;
        transition: background 0.2s;
    }

    .track:hover {
        border-radius: 10px;
        background: rgb(32, 32, 32);
        cursor: pointer;
    }

    svg {
        color: white;
    }

    svg:hover {
        cursor: pointer;
    }

    .music-visualization {
        height: 75%;
    }
</style>
