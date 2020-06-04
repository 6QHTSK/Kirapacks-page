//import Chart from "https://cdn.jsdelivr.net/npm/chart.js@2.9.3/dist/Chart.min.js";
module.exports = {
    data: function () {
        return {
            diffid: 2,
            inputstr: "",
            chartjson: "",
            diffcolor: "",
            npsdiff: 25,
            hpsdiff: 25,
            totaldiff: 25.2,
            totalintdiff: 25,
            totalstrdiff : "",
            npsstrdiff: "",
            hpsstrdiff: "",
            bpmlow: 10000000,
            bpmhigh: -1,
            showdetail: false,
            totalflick: 0,
            maxhps: 0.0,
            maxfps: 0.0,
            maxslidespeed: 0.0,
            totaltimemin: 0,
            totaltimesec: 0,
            totalnote: 0,
            totalnps: 0,
            totalhitnote: 0,
            totalhps: 0
        }
    },
    mounted() {
        this.drawmap = new Chart(map, {
            type: "line",
            data: {
                labels: [],
                datasets: [{
                    label: "NPS",
                    data: [],
                    cubicInterpolationMode: 'monotone',
                    borderColor: "rgb(64,158,255)",
                    fill: false
                },
                {
                    label: "HPS",
                    data: [],
                    cubicInterpolationMode: 'monotone',
                    borderColor: "rgb(103,194,58)",
                    fill: false
                },
                {
                    label: "FPS",
                    data: [],
                    cubicInterpolationMode: 'monotone',
                    borderColor: "rgb(245,108,108)",
                    fill: false
                }
                ]
            },
            options: {
                scales: {
                    yAxes: [{
                        ticks: {
                            beginAtZero: true
                        }
                    }]
                }
            }
        });
    },
    methods: {
        showdiffname(val) {
            diffname = ["Easy", "Normal", "Hard", "Expert"];
            return diffname[val];
        },
        getdiffcolor() {
            diffcolor = ["#409EFF", "#67C23A", "#E6A23C", "#F56C8C"];
            this.calcdifficulty();
            return diffcolor[this.diffid];
        },
        transferJson(str) {
            try {
                this.chartjson = JSON.parse(str);
                return true;
            }
            catch (err) {
                this.$message("解析失败");
                return false;
            }
        },
        drawchart(timelist, npslist, hpslist, fpslist) {
            var map = document.getElementById("map");
            this.drawmap.data.labels = timelist;
            this.drawmap.data.datasets[0].data = npslist;
            this.drawmap.data.datasets[1].data = hpslist;
            this.drawmap.data.datasets[2].data = fpslist;
            this.drawmap.update();
            this.$forceUpdate();
        },
        analysis() {
            if (this.transferJson(this.inputstr)) {
                this.showdetail = true;
                this.totalflick = 0;
                this.maxslidespeed = 0.0;
                this.maxfps = 0;
                this.maxhps = 0;
                notelist = this.calctime();
                totalnote = notelist.length;
                totalhitnote = 0;
                npslist = [];
                hpslist = [];
                fpslist = [];
                timelist = [];
                offsettime = 0.0;
                lastnotetime = notelist[totalnote - 1].time;
                notesub = 0;
                hitsub = 0;
                flicksub = 0;
                subtime = lastnotetime / 19.9;
                this.calcmaxslidespeed(notelist);
                for (i in notelist) {
                    note = notelist[i];
                    while (note.time - offsettime >= subtime) {
                        var subnps = notesub / subtime;
                        var subhps = hitsub / subtime;
                        var subfps = flicksub / subtime;
                        npslist.push(subnps.toFixed(2));
                        hpslist.push(subhps.toFixed(2));
                        fpslist.push(subfps.toFixed(2));
                        timelist.push(offsettime.toFixed(0));
                        offsettime = offsettime + subtime;
                        notesub = 0;
                        hitsub = 0;
                        flicksub = 0;
                        if (subhps > this.maxhps) {
                            this.maxhps = subhps.toFixed(2);
                        }
                        if (subfps > this.maxfps) {
                            this.maxfps = subfps.toFixed(2);
                        }
                    }
                    notesub++;
                    if (note.note == "Single" || (note.note == "Slide" && note.start == true)) {
                        totalhitnote++;
                        hitsub++;
                    }
                    if (note.flick) {
                        this.totalflick++;
                        flicksub++;
                    }
                }
                var subnps = notesub / (lastnotetime - offsettime);
                var subhps = hitsub / (lastnotetime - offsettime);
                var subfps = flicksub / (lastnotetime - offsettime);
                this.totalnps = (totalnote / (notelist[totalnote - 1].time - notelist[0].time)).toFixed(2);
                this.totalhps = (totalhitnote / (notelist[totalnote - 1].time - notelist[0].time)).toFixed(2);
                this.totalnote = totalnote;
                this.totalhitnote = totalhitnote;
                this.totaltimemin = Math.floor(lastnotetime / 60.0);
                this.totaltimesec = (lastnotetime - this.totaltimemin * 60.0).toFixed(1);
                npslist.push(subnps.toFixed(2));
                hpslist.push(subhps.toFixed(2));
                fpslist.push(subfps.toFixed(2));
                timelist.push(offsettime.toFixed(0));
                this.drawchart(timelist, npslist, hpslist, fpslist);
                this.calcdifficulty()
            }
        },
        inputchange(e) {
            this.$forceUpdate();
        },
        calctime() {
            bpm = 60;
            offsettime = 0.0;
            offsetbeat = 0;
            notelist = [];
            istherenote = false;
            for (i in this.chartjson) {
                note = this.chartjson[i];
                if (note.type == "System") {
                    offsettime = (note.beat - offsetbeat) * (60.0 / bpm) + offsettime;
                    bpm = note.bpm;
                    offsetbeat = note.beat;
                    if (istherenote == false) {
                        this.bpmlow = 1000000;
                        this.bpmhigh = -1;
                    }
                    if (bpm < this.bpmlow) {
                        this.bpmlow = bpm;
                    }
                    if (bpm > this.bpmhigh) {
                        this.bpmhigh = bpm;
                    }
                }
                else if (note.type == "Note") {
                    istherenote = true;
                    note.time = (note.beat - offsetbeat) * (60.0 / bpm) + offsettime;
                    notelist.push(note);
                }
            }
            return notelist;
        },
        calcmaxslidespeed(notelist) {
            slidenote = [{ lane: 0, time: 0 }, { lane: 0, time: 0 }];
            for (i in notelist) {
                note = notelist[i];
                if (note.type == "Note" && note.note == "Slide") {
                    pos = note.pos == "A" ? 0 : 1;
                    if (note.start) {
                        slidenote[pos] = { lane: note.lane, time: note.time };
                        continue;
                    }
                    slidespeed = Math.abs(note.lane - slidenote[pos].lane) / (note.time - slidenote[pos].time);
                    slidenote[pos] = { lane: note.lane, time: note.time };
                    if (slidespeed > this.maxslidespeed) {
                        this.maxslidespeed = slidespeed.toFixed(2);
                    }
                }
            }
        },
        calcdifficulty() {
            diffconst = [
                [5, 6, 7, 8, 9, 10, 11],
                [10, 11, 12, 13, 14, 15, 16],
                [15, 16, 17, 18, 19, 20, 21, 22],
                [21, 22, 23, 24, 25, 26, 27]
            ]
            npsconst = [
                [0, 0.72, 1.06, 1.36, 1.48, 1.68, 1.93],
                [0, 1.5, 1.66, 2.09, 2.5, 2.85, 3.3],
                [0, 2.98, 3.59, 4.02, 4.59, 4.69, 5.28, 5.65],
                [0, 4.2, 4.63, 5.37, 5.69, 6.67, 8,]]
            hpsconst = [[0, 0.67, 0.84, 1.13, 1.28, 1.45, 1.71],
            [0, 1.41, 1.46, 1.79, 2.05, 2.45, 3],
            [0, 2.64, 2.84, 3.24, 3.72, 3.76, 4.2, 4.35],
            [0, 3.1, 3.39, 4.26, 4.67, 5.44, 6.5]]
            maxhpsconst = [[0, 1.03, 1.77, 2.25, 2.88, 3.13, 3.21],
            [0, 1.71, 2.3, 3.27, 3.81, 4.34, 4.53],
            [0, 3.89, 4.61, 5.56, 5.89, 6.09, 6.18, 6.5],
            [0, 5, 5.42, 6.64, 6.82, 7.46, 9.1]]
            maxfpsconst = [[], [], [0, 0.01, 2.99, 4.12, 4.57, 4.66, 4.84, 5], [0, 2.5, 4, 4.4, 5.47, 5.54, 6.22]]
            maxspdconst = [[], [], [0, 0.01, 6, 9.2, 12.5, 14.3, 15.8, 18], [0, 9, 12, 14, 17, 20, 24]]
            flag = true
            length = diffconst[this.diffid].length
            for (i in npsconst[this.diffid]) {
                if (this.totalnps < npsconst[this.diffid][i]) {
                    npsdiff = this.npsdiff = diffconst[this.diffid][i - 1];
                    flag = false;
                    break;
                }
            }
            if (flag) {
                npsdiff = this.npsdiff = diffconst[this.diffid][length-1]
            }
            flag = true
            for (i in hpsconst[this.diffid]) {
                if (this.totalhps < hpsconst[this.diffid][i]) {
                    hpsdiff = this.hpsdiff = diffconst[this.diffid][i - 1];
                    flag = false;
                    break;
                }
            }
            if (flag) {
                hpsdiff = this.hpsdiff = diffconst[this.diffid][length-1]
            }
            flag = true
            for (i in maxhpsconst[this.diffid]) {
                if (this.maxhps < maxhpsconst[this.diffid][i]) {
                    maxhpsdiff = diffconst[this.diffid][i - 1];
                    flag = false;
                    break;
                }
            }
            if (flag) {
                maxhpsdiff = diffconst[this.diffid][length-1]
            }
            if(this.diffid >= 2){
                flag = true
                for (i in maxfpsconst[this.diffid]) {
                    if (this.maxfps < maxfpsconst[this.diffid][i]) {
                        maxfpsdiff = diffconst[this.diffid][i - 1];
                        flag = false;
                        break;
                    }
                }
                if (flag) {
                    maxfpsdiff = diffconst[this.diffid][length-1];
                }
                flag = true
                for (i in maxspdconst[this.diffid]) {
                    if (this.maxspd < maxspdconst[this.diffid][i]) {
                        maxspddiff = diffconst[this.diffid][i - 1];
                        flag = false;
                        break;
                    }
                }
                if (flag) {
                    maxspddiff = diffconst[this.diffid][length-1];
                }
            }
            else{
                maxfpsdiff = maxspddiff = 0;
            }
            sumdiff = this.npsdiff + this.hpsdiff;
            itemdiff = 2;
            if(maxhpsdiff >= Math.floor(sumdiff/itemdiff)){
                sumdiff = sumdiff + maxhpsdiff;
                itemdiff ++ ;
            }
            if(maxfpsdiff >= Math.floor(sumdiff/itemdiff)){
                sumdiff = sumdiff + maxfpsdiff;
                itemdiff ++ ;
            }
            if(maxspddiff >= Math.floor(sumdiff/itemdiff)){
                sumdiff = sumdiff + maxspddiff;
                itemdiff ++ ;
            } 
            if(this.totaltimemin >= 3){
                timediff = 0.75;
            }
            else{
                timediff = 0;
            }
            this.totaldiff = totaldiff = (sumdiff/itemdiff+timediff).toFixed(1);
            this.totalintdiff = totalintdiff = Math.floor(this.totaldiff);
            //console.log([npsdiff,hpsdiff,maxhpsdiff,maxfpsdiff,maxspddiff,timediff]);
            if((totaldiff >= 10.67 && this.diffid == 0)||(totaldiff >= 15.67 && this.diffid == 1)||(totaldiff >= 21.67 && this.diffid == 2)||(totaldiff >= 26.67 && this.diffid == 3)){
                this.totalstrdiff = Math.ceil(totaldiff).toString() + "(+)";
            }
            else if((totaldiff <= 10.33 && this.diffid == 1)||(totaldiff <= 15.33 && this.diffid == 2)||(totaldiff <= 21.33 && this.diffid == 3)){
                this.totalstrdiff = totalintdiff.toString() + "(-)";
            }
            else if(totaldiff - totalintdiff >= 0.67){
                this.totalstrdiff = totalintdiff.toString() + "+";
            }
            else{
                this.totalstrdiff = totalintdiff.toString();
            }
            if((npsdiff == 11 && this.diffid == 0)||(npsdiff == 16 && this.diffid == 1)||(npsdiff == 22 && this.diffid == 2)||(npsdiff == 27 && this.diffid == 3)){
                this.npsstrdiff = npsdiff.toString() + "(+)"
            }
            else if((npsdiff == 10 && this.diffid == 1)||(npsdiff == 15 && this.diffid == 2)||(npsdiff == 21 && this.diffid == 3)){
                this.npsstrdiff = npsdiff.toString() + "(-)"
            }
            else{
                this.npsstrdiff = npsdiff.toString()
            }
            if((hpsdiff == 11 && this.diffid == 0)||(hpsdiff == 16 && this.diffid == 1)||(hpsdiff == 22 && this.diffid == 2)||(hpsdiff == 27 && this.diffid == 3)){
                this.hpsstrdiff = hpsdiff.toString() + "(+)"
            }
            else if((hpsdiff == 10 && this.diffid == 1)||(hpsdiff == 15 && this.diffid == 2)||(hpsdiff == 21 && this.diffid == 3)){
                this.hpsstrdiff = hpsdiff.toString() + "(-)"
            }
            else{
                this.hpsstrdiff = hpsdiff.toString()
            }
        },
        calcpercentage(){
            if(this.totaldiff*100/27 > 100)
                return 100;
            else
                return this.totaldiff*100/27;
        }
    }
}