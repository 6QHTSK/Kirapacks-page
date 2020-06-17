function transferJson(vm, str) { // 解析数据
    try {
        vm.chartjson = JSON.parse(str);
        return true;
    }
    catch (err) {
        vm.$message("解析失败");
        return false;
    }
}
function calcmaxslidespeed(notelist) {
    maxslidespeed = 0;
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
            if (slidespeed > maxslidespeed) {
                maxslidespeed = slidespeed.toFixed(2);
            }
        }
    }
    return maxslidespeed;
}
function calctime(chartjson) {
    var bpm = 60;
    var offsettime = 0.0;
    var offsetbeat = 0;
    var notelist = [];
    var bpmlow = 1000000;
    var bpmhigh = -1;
    var istherenote = false;
    for (i in chartjson) {
        note = chartjson[i];
        if (note.type == "System") {
            offsettime = (note.beat - offsetbeat) * (60.0 / bpm) + offsettime;
            bpm = note.bpm;
            offsetbeat = note.beat;
            if (istherenote == false) {
                bpmlow = 1000000;
                bpmhigh = -1;
            }
            if (bpm < bpmlow) {
                bpmlow = bpm;
            }
            if (bpm > bpmhigh) {
                bpmhigh = bpm;
            }
        }
        else if (note.type == "Note") {
            istherenote = true;
            note.time = (note.beat - offsetbeat) * (60.0 / bpm) + offsettime;
            notelist.push(note);
        }
    }
    return { "notelist": notelist, "bpmlow": bpmlow, "bpmhigh": bpmhigh };
}
function calcdifficulty(diffid, totalnps, totalhps, maxhps, maxfps, maxslidespeed, totaltimemin) {
    diffconst = [
        [5, 6, 7, 8, 9, 10, 11],
        [10, 11, 12, 13, 14, 15, 16],
        [15, 16, 17, 18, 19, 20, 21, 22],
        [21, 22, 23, 24, 25, 26, 27, 29]
    ]
    npsconst = [
        [0, 0.72, 1.06, 1.36, 1.48, 1.68, 1.93],
        [0, 1.5, 1.66, 2.09, 2.5, 2.85, 3.3],
        [0, 2.98, 3.59, 4.02, 4.59, 4.69, 5.28, 5.65],
        [0, 4.2, 4.63, 5.37, 5.69, 6.67, 8, 9.36]]
    hpsconst = [[0, 0.67, 0.84, 1.13, 1.28, 1.45, 1.71],
    [0, 1.41, 1.46, 1.79, 2.05, 2.45, 3],
    [0, 2.64, 2.84, 3.24, 3.72, 3.76, 4.2, 4.35],
    [0, 3.1, 3.39, 4.26, 4.67, 5.44, 6.5, 7.78]]
    maxhpsconst = [[0, 1.03, 1.77, 2.25, 2.88, 3.13, 3.21],
    [0, 1.71, 2.3, 3.27, 3.81, 4.34, 4.53],
    [0, 3.89, 4.61, 5.56, 5.89, 6.09, 6.18, 6.5],
    [0, 5, 5.42, 6.64, 6.82, 7.46, 9.1, 10.5]]
    maxfpsconst = [[], [], [0, 0.01, 0.8, 0.93, 1.12, 1.15, 1.21, 1.35], [0, 0.4, 0.6, 0.92, 1.37, 1.54, 2.22, 4.8]]
    maxspdconst = [[], [], [0, 0.01, 6, 9.2, 12.5, 14.3, 15.8, 18], [0, 9, 12, 14, 17, 20, 24, 48]]
    flag = true
    length = diffconst[diffid].length
    for (i in npsconst[diffid]) {
        if (totalnps < npsconst[diffid][i]) {
            npsdiff = diffconst[diffid][i - 1];
            flag = false;
            break;
        }
    }
    if (flag) {
        npsdiff = diffconst[diffid][length - 1]
    }
    flag = true
    for (i in hpsconst[diffid]) {
        if (totalhps < hpsconst[diffid][i]) {
            hpsdiff = diffconst[diffid][i - 1];
            flag = false;
            break;
        }
    }
    if (flag) {
        hpsdiff = diffconst[diffid][length - 1]
    }
    flag = true
    for (i in maxhpsconst[diffid]) {
        if (maxhps < maxhpsconst[diffid][i]) {
            maxhpsdiff = diffconst[diffid][i - 1];
            flag = false;
            break;
        }
    }
    if (flag) {
        maxhpsdiff = diffconst[diffid][length - 1]
    }
    if (diffid >= 2) {
        flag = true
        for (i in maxfpsconst[diffid]) {
            if (maxfps < maxfpsconst[diffid][i]) {
                maxfpsdiff = diffconst[diffid][i - 1];
                flag = false;
                break;
            }
        }
        if (flag) {
            maxfpsdiff = diffconst[diffid][length - 1];
        }
        flag = true
        for (i in maxspdconst[diffid]) {
            //console.log([this.maxslidespeed,maxspdconst[this.diffid][i]])
            if (maxslidespeed < maxspdconst[diffid][i]) {
                maxspddiff = diffconst[diffid][i - 1];
                flag = false;
                break;
            }
        }
        if (flag) {
            maxspddiff = diffconst[diffid][length - 1];
        }
    }
    else {
        maxfpsdiff = maxspddiff = 0;
    }
    sumdiff = npsdiff + hpsdiff;
    itemdiff = 2;
    if (maxhpsdiff >= sumdiff / itemdiff) {
        //console.log([1,maxhpsdiff,Math.floor(sumdiff / itemdiff)])
        sumdiff = sumdiff + maxhpsdiff;
        itemdiff++;
        //console.log([2,maxhpsdiff,sumdiff / itemdiff])
    }
    if (maxfpsdiff >= sumdiff / itemdiff) {
        sumdiff = sumdiff + maxfpsdiff;
        itemdiff++;
    }
    if (maxspddiff >= sumdiff / itemdiff) {
        sumdiff = sumdiff + maxspddiff;
        itemdiff++;
    }
    if (totaltimemin >= 3) {
        timediff = 0.75;
    }
    else {
        timediff = 0;
    }
    //console.log([3,sumdiff,itemdiff,sumdiff / itemdiff])
    totaldiff = (sumdiff / itemdiff + timediff).toFixed(1);
    totalintdiff = Math.floor(totaldiff);
    //console.log([totaldiff,npsdiff,hpsdiff,maxhpsdiff,maxfpsdiff,maxspddiff,timediff]);
    if ((totaldiff - timediff >= 10.6 && diffid == 0) || (totaldiff - timediff >= 15.6 && diffid == 1) || (totaldiff - timediff >= 21.6 && diffid == 2) || (totaldiff - timediff >= 26.6 && diffid == 3)) {
        totalstrdiff = "≥" + Math.ceil(totaldiff).toString();
    }
    else if ((totaldiff - timediff <= 10.33 && diffid == 1) || (totaldiff - timediff <= 15.33 && diffid == 2) || (totaldiff - timediff <= 21.33 && diffid == 3)) {
        totalstrdiff = "≤" + totalintdiff.toString();
    }
    else if (totaldiff - totalintdiff >= 0.67) {
        totalstrdiff = totalintdiff.toString() + "+";
    }
    else {
        totalstrdiff = totalintdiff.toString();
    }
    if ((npsdiff == 11 && diffid == 0) || (npsdiff == 16 && diffid == 1) || (npsdiff == 22 && diffid == 2) || (npsdiff >= 27 && diffid == 3)) {
        npsstrdiff = "≥" + npsdiff.toString();
    }
    else if ((npsdiff == 10 && diffid == 1) || (npsdiff == 15 && diffid == 2) || (npsdiff == 21 && diffid == 3)) {
        npsstrdiff = "≤" + npsdiff.toString();
    }
    else {
        npsstrdiff = npsdiff.toString()
    }
    if ((hpsdiff == 11 && diffid == 0) || (hpsdiff == 16 && diffid == 1) || (hpsdiff == 22 && diffid == 2) || (hpsdiff >= 27 && diffid == 3)) {
        hpsstrdiff = "≥" + hpsdiff.toString()
    }
    else if ((hpsdiff == 10 && diffid == 1) || (hpsdiff == 15 && diffid == 2) || (hpsdiff == 21 && diffid == 3)) {
        hpsstrdiff = "≤" + hpsdiff.toString()
    }
    else {
        hpsstrdiff = hpsdiff.toString()
    }
    return {
        "npsdiff": npsdiff,
        "npsstrdiff": npsstrdiff,
        "hpsdiff": hpsdiff,
        "hpsstrdiff": hpsstrdiff,
        "totaldiff": totaldiff,
        "totalintdiff": totalintdiff,
        "totalstrdiff": totalstrdiff
    };
}
function details(chartjson, diffid, drawchart) {
    tmp = calctime(chartjson);
    notelist = tmp.notelist
    //console.log(chartjson);
    bpmlow = tmp.bpmlow;
    bpmhigh = tmp.bpmhigh;
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
    maxhps = 0;
    maxfps = 0;
    totalflick = 0;
    subtime = lastnotetime / 19.9;
    maxslidespeed = calcmaxslidespeed(notelist);
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
            if (subhps > maxhps) {
                maxhps = subhps.toFixed(2);
            }
            if (subfps > maxfps) {
                maxfps = subfps.toFixed(2);
            }
        }
        notesub++;
        if (note.note == "Single" || (note.note == "Slide" && note.start == true)) {
            totalhitnote++;
            hitsub++;
        }
        if (note.flick) {
            totalflick++;
            flicksub++;
        }
    }
    var subnps = notesub / (lastnotetime - offsettime);
    var subhps = hitsub / (lastnotetime - offsettime);
    var subfps = flicksub / (lastnotetime - offsettime);
    totalnps = (totalnote / (notelist[totalnote - 1].time - notelist[0].time)).toFixed(2);
    totalhps = (totalhitnote / (notelist[totalnote - 1].time - notelist[0].time)).toFixed(2);
    totalnote = totalnote;
    totalhitnote = totalhitnote;
    totaltimemin = Math.floor(lastnotetime / 60.0);
    totaltimesec = (lastnotetime - totaltimemin * 60.0).toFixed(1);
    npslist.push(subnps.toFixed(2));
    hpslist.push(subhps.toFixed(2));
    fpslist.push(subfps.toFixed(2));
    timelist.push(offsettime.toFixed(0));
    if (drawchart != null) {
        drawchart(timelist, npslist, hpslist, fpslist);
    }
    diffset = calcdifficulty(diffid, totalnps, totalhps, maxhps, maxfps, maxslidespeed)
    return {
        "diffset": diffset,
        "totaltimemin": totaltimemin,
        "totaltimesec": totaltimesec,
        "totalnps": totalnps,
        "totalhps": totalhps,
        "totalnote": totalnote,
        "totalhitnote": totalhitnote,
        "totalflick": totalflick,
        "maxslidespeed": maxslidespeed,
        "maxhps": maxhps,
        "maxfps": maxfps,
        "bpmlow": bpmlow,
        "bpmhigh": bpmhigh
    }
}
function getbestdorichart(vm,bestdoriid) {
    url = "https://bird.ioliu.cn/v1?url=https://player.banground.fun/api/bestdori/community/" + bestdoriid;
    flag = false;
    axios.get(url).then(function (res) {
        vm.loading = false;
        if (res.status == 200) {
            //console.log(res)
            if (res.data.result) {
                vm.inputstr = JSON.stringify(res.data.data.notes);
                vm.diffid = res.data.data.difficulty < 3 ? res.data.data.difficulty : 3;
                vm.analysis()
            }
            else {
                vm.$message("谱面id输入错误")
            }
            vm.$forceUpdate();
        }
        else {
            vm.$message("访问bestdori失败");
        }
    })
}