const app = Vue.createApp({
    data(){
        return {
            currentTrack: undefined,
            isPlaying: false,
            tracksMetadata: [],
            songDuration: 0,
            currentTimeValue: 0,
            timer: ''
        }
    },
    mounted() {
        this.getTracks();
        this.timer = setInterval(this.updateCurrentTimeValue,100);
    },
    computed: {
        displayCurrentTime() {
            const minutes = Math.floor(this.currentTimeValue/60).toString();
            let seconds = Math.floor(this.currentTimeValue%60).toString();
            if(seconds.length === 1)
                seconds = '0' + seconds;
            return minutes + ':' + seconds;
        },
        displaySongDuration() {
            const minutes = Math.floor(this.songDuration/60).toString();
            let seconds = Math.floor(this.songDuration%60).toString();
            if(seconds.length === 1)
                seconds = '0' + seconds;
            return minutes + ':' + seconds;
        }
    },
    methods: {
        changeTrack(track){
            if(song)
                song.stop();
            this.currentTrack = track;
            this.isPlaying = false;
            this.currentTimeValue = 0;
            song = loadSound(this.currentTrack.url,this.play);
        },
        updateCurrentTimeValue(){
            if(song && song.isPlaying())
                this.currentTimeValue = song.currentTime();
        },
        cancelAutoUpdate () {
            clearInterval(this.timer);
        },
        async getTracks(){
            try{
                this.tracksMetadata = (await axios.get('http://localhost:3000/api/music')).data.files;
            }
            catch(error){
                console.log(error);
            }
        },
        play(){
            this.isPlaying = true;
            const val = this.currentTimeValue;
            song.play();
            song.jump(val);
            this.songDuration = song.duration();
        },
        pause(){
            this.isPlaying = false;
            song.pause();
        },
        currentTimeChanged(){
            song.jump(this.currentTimeValue);
        }
    },
    destroyed() {
        this.cancelAutoUpdate();
    }
});