 let state = {
     time: '00:00.000',
     heading: ["Vue is super fun", "I lo Vue", "You are bvuetiful", "Is this it?", "Buy bitcoin", "Life is epic"],
     bgColor: "blue",
     align: "center",
     myString: "Skriv texten som står i högra rutan",
     colors: ["Skyblue", "Orchid", "Yellow", "Tomato", "Khaki", "Peachpuff"],
     bgColors: ["Darkgreen", "Darkmagenta", "Darkorchid", "Darkred", "Black", "Darkgoldenrod"],
     random1: 0,
     random2: 0,
     random3: 0,
     starta: false,
     playerName: "John",


 }
 let mutations = {
     updateMessage(state, message) {
         state.playerName = message
     },
     sparaState(state) {
         state.allText.push(state.myString)
     },
     update(state, x) {
         state.myString = x
     },
     // Stopwatch
 }

 let store = new Vuex.Store({
     state,
     mutations
 })

 Vue.component('my-header', {
     methods: {

         clockRunning() {
             this.currentTime = new Date(),
                 this.timeElapsed = new Date(this.currentTime - this.timeBegan - this.stoppedDuration),
                 this.hour = this.timeElapsed.getUTCHours(),
                 this.min = this.timeElapsed.getUTCMinutes(),
                 this.sec = this.timeElapsed.getUTCSeconds(),
                 this.ms = this.timeElapsed.getUTCMilliseconds();

             $store.state.time =
                 this.zeroPrefix(hour, 2) + ":" +
                 this.zeroPrefix(min, 2) + ":" +
                 this.zeroPrefix(sec, 2) + "." +
                 this.zeroPrefix(ms, 3);
         },

         zeroPrefix(num, digit) {
             this.zero = '';
             for (var i = 0; i < digit; i++) {
                 this.zero += '0';
             }
             return (this.zero + num).slice(-digit);
         },
         addScore() {
             fetch('https://avancera.app/cities/', {
                     body: `{ "name": "${this.gameName}", "population": ${this.score} }`,
                     headers: {
                         'Content-Type': 'application/json'
                     },
                     method: 'POST'
                 })
                 .then(response => response.json())
                 .then(result => {
                     console.log(result)
                 })
         },
     },
     data: function() {
         return {
             gameName: "",
             score: 0,
             formColor: "gray",
             newColor: "",
             myClass: "class1",
             timeBegan: null,
             timeStopped: null,
             stoppedDuration: 0,
             started: null,
             running: false,
             currentTime: 00,
             zero: 0,
         }
     },
     methods: {

         changeClass: function() {
             (this.myClass == "class1") ? this.myClass = "class2": this.myClass = "class1"
         }
     },
     template: `<div class="myHeader" >        
     <nav>
         <ul>
                <li>
                    <router-link to="/">Home</router-link>
                </li>
                <li>
                    <router-link to="/highscore">Topplista</router-link>
                </li>
            </ul>
        </nav>
        <div>
        <h1>Copy The Box</h1>
        <p> Få den vänstra lådan att se ut som den högra </p>
        </div>
        <span class="time">{{ $store.state.time }}</span>
        
        </div>
            
    `
 })

 const game = Vue.component('Game', {
     computed: {
         myString: {
             get() {
                 return this.$store.state.myString
             },
             set(x) {
                 this.$store.commit('update', x)
             }
         },
     },

     methods: {

         addHs() {
             console.log(this.$store.state.playerName, this.$store.state.time)
             fetch('https://avancera.app/cities/', {
                     body: `{ "name": "############## ${this.$store.state.playerName}", "population": "${this.$store.state.time}" }`,
                     headers: {
                         'Content-Type': 'application/json'
                     },
                     method: 'POST'
                 })
                 .then(response => response.json())
                 .then(result => {
                     console.log(result)
                 })
         },
         // Stopwatch
         stop() {
             this.running = false;
             this.timeStopped = new Date();
             clearInterval(this.started);
         },
         reset() {
             this.running = false;
             this.stoppedDuration = 0;
             this.timeBegan = null;
             this.timeStopped = null;
             this.$store.state.time = "00:00:00.000";
         },

         start() {
             this.$store.state.playerName = this.nameChange;
             console.log(this.$store.state.playerName)
             if (this.running) return;

             if (this.timeBegan === null) {
                 this.reset();
                 this.timeBegan = new Date();
             }

             if (this.timeStopped !== null) {
                 this.stoppedDuration += (new Date() - this.timeStopped);
             }

             this.started = setInterval(this.clockRunning, 10);
             this.running = true;
         },
         clockRunning() {
             this.currentTime = new Date(),
                 this.timeElapsed = new Date(this.currentTime - this.timeBegan - this.stoppedDuration),
                 this.min = this.timeElapsed.getUTCMinutes(),
                 this.sec = this.timeElapsed.getUTCSeconds(),
                 this.ms = this.timeElapsed.getUTCMilliseconds();

             this.$store.state.time =
                 this.zeroPrefix(this.min, 2) + ":" +
                 this.zeroPrefix(this.sec, 2) + "." +
                 this.zeroPrefix(this.ms, 3);
         },

         zeroPrefix(num, digit) {
             this.zero = '';
             for (var i = 0; i < digit; i++) {
                 this.zero += '0';
             }
             return (this.zero + num).slice(-digit);
         },
         startGame() {
             this.isStarted = true;
             this.reset()
             this.start();

             this.$store.state.starta = true,
                 this.$store.state.random1 = Math.floor(Math.random() * 5);
             console.log(this.$store.state.random1)
             this.$store.state.random2 = Math.floor(Math.random() * 5);
             console.log(this.$store.state.random2)
             this.$store.state.random3 = Math.floor(Math.random() * 5);
             console.log(this.$store.state.random3)

         },
         saveCol(e) {
             this.userString = e
             console.log(this.userString)
         },
         saveBg(e) {
             this.userBg = e
         },
         check() {
             if (!this.$store.state.starta) { return alert("Fyll i ditt namn och tryck på start :)") }
             if (this.$store.state.myString == this.$store.state.heading[this.$store.state.random3] &&
                 this.selected == this.$store.state.colors[this.$store.state.random2] &&
                 this.selectedBg == this.$store.state.bgColors[this.$store.state.random1]) {
                 alert("GRATTIS! Du hamnade på topplistan!"), this.addHs(), this.stop()

             } else {
                 alert("Försök igen :)")
             }
         },
     },





     data: function() {
         return {
             selected: "white",
             selectedBg: "black",
             userString: "",
             userColor: "",
             userBg: "",
             timer: 0,
             nameChange: "",
             isStarted: false,


             // Stopwatch
             timeBegan: null,
             timeStopped: null,
             stoppedDuration: 0,
             started: null,
             running: false,
             currentTime: 00,
             zero: 0,
         }
     },
     template: ` <div class="container" >
    <div class="start" >
    
    <input id="playerName" v-model="nameChange" placeholder="Player Name">
        <input class="button" type="button" @click="startGame" value="Starta">
        </div>

    <div class="top" >
    <div v-bind:style="{ backgroundColor: this.selectedBg}" class="box">
    <h1  v-bind:style="{ color: this.selected}">{{$store.state.myString}}</h1>
    </div>

    
    

    <div class="box"  v-bind:style="{ backgroundColor: $store.state.bgColors[$store.state.random1]}">
    <h1 v-bind:style="{ color: $store.state.colors[$store.state.random2]}" > {{$store.state.heading[$store.state.random3]}} </h1>
    </div>
</div>


    <div v-if="isStarted" class="box" id="userBox" >
    <div v-show=true class="form__group field" >

    <label class="form__label" for="rubrik">Text:</label>
    <input class="form__field" name="rubrik" value="rubrik" v-model:value="$store.state.myString" >

    <label class="form__label" for="colors">Textfärg:</label>
    <select v-model="selected" @change="saveCol($event)" class="form__field" id="textfärg" name="colors">
     <option v-for="color in $store.state.colors">{{ color }}</option>
</select>

<label class="form__label" for="bgColor">Bakgrundsfärg:</label>
    <select v-model="selectedBg" @change="saveBg($event)" class="form__field" id="bgFärg" name="bgColors">
     <option v-for="color in $store.state.bgColors">{{ color }}</option>
</select>

    </div>

    <input class="button" type="button" value="Klar" @click=check() >
    </div>
    </div>`
 })


 const highScore = Vue.component('high-score', {
     data: function() {
         return {
             names: [],
             sorted: []
         }
     },
     created: function() {
         fetch('https://avancera.app/cities/')
             .then((response) => response.json())
             .then((result) => {
                 this.names = result.filter(function(el) {
                     return el.name.length > 15;
                 });
             })
         this.sorted = this.names.sort(function(a, b) { return a.population - b.population });
         console.log(this.sorted + "hej")
     },
     template: `<div class="myHighs" >
     <h1> Topplista </h>
    <ul>
    <li class="highScores" v-for="name in names">{{name.name}} {{name.population}}</li>
    </ul>
        </div>`
 })



 // MY STOPWATCH///////////////////////////////


 const router = new VueRouter({
     routes: [{
         component: game,
         path: '/'
     }, {
         component: highScore,
         path: '/highscore'
     }]
 })


 new Vue({
     el: '#app',
     store,
     router
 })