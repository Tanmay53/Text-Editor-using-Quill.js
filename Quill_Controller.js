var toolbarOptions = ["bold", "italic", "underline", "strike"];
var quill = new Quill('#editor', {
    modules: {
        toolbar: toolbarOptions
    },
    theme: 'snow'
});
var cursorPos = 0;
var prCursorPos = 0;
var lineCount = 1;//tmp
var lnKepr = new Array();
var curLine = 1;
lnKepr[0] = 0;
quill.on("editor-change", function(eventName, chA, chB, source) {
    var uSelect = quill.getSelection();
    //var lIndex = uSelect.index;
    //var selLength = uSelect.length;
    //console.log(/*lIndex +*/ ":" + selLength);
    //let [line, offset] = quill.getLine(5);
    //let index = quill.getIndex(line);
    if(eventName == "text-change") {
        var delta = chA;
        var oldDelta = chB;
        var retainh = ((delta.ops[0].retain != undefined) ? delta.ops[0].retain : 0);
        var deltaTxt = (((cursorPos == 1) || (cursorPos == 0)) ? delta.ops[0].insert : delta.ops[1].insert);//errrrrr for 0 position.
        var tlk = 0;//tmp
        var lnHold = new Array();
        if(deltaTxt != undefined) {
            var dTxtLn = deltaTxt.length;
            while(deltaTxt.indexOf("\n") != -1) {
                var lnIndx = deltaTxt.indexOf("\n");
                lineCount += 1;
                lnHold[tlk] = ((tlk == 0) ? (retainh + lnIndx) : (lnHold[tlk-1] + lnIndx + 1));
                console.log("Reatin & ln : " + retainh + " : " + lnIndx);
                tlk += 1;
                deltaTxt = deltaTxt.substr(lnIndx + 1);
            }
            var ldr = ((lnKepr.indexOf(retainh) == -1) ? 0 : 1);
            console.log("ldr : " + ldr);
            var maxLn = lnKepr.findIndex(function(ln) {
                return ln > retainh;
            });
            var l = 0;
            for(l = 0; l < tlk; l++) {
                lnKepr.splice(((maxLn != -1) ? (maxLn + l) : lnKepr.length), 0, lnHold[l]);
            }
            if(ldr && (tlk > 0)) {
                var flHold = lnKepr[maxLn - 1];
                lnKepr.splice(maxLn - 1, 1);
                lnKepr.splice(maxLn + l -1, 0, flHold);
            }
            l = l - ldr;
            while(((maxLn + l) < lnKepr.length) && (maxLn != -1)) {
                lnKepr[maxLn + l] += dTxtLn;
                l++;
            }
            console.log("maxLn : " + maxLn + " : " + JSON.stringify(lnKepr) + " : " + l);
            console.log("Entered : " + JSON.stringify(lnHold));
        }
        else {
            var delno = ((cursorPos == 0) ? delta.ops[0].delete : delta.ops[1].delete);
            console.log("No. of deletions : " + delno);
            var delStr = oldDelta.ops[0].insert.substr(delta.ops[0].retain, delno);
            while(delStr.indexOf("\n") != -1) {
                var idk = delStr.indexOf("\n");
                lineCount -= 1;
                delStr = delStr.substr(idk + 1);
            }
            var delElem = lnKepr.filter(function(elem) {
                return ((elem >= retainh) && (elem < (retainh + delno)));
            });
            lnKepr.splice(lnKepr.indexOf(delElem[0]), delElem.length);
            var decStart = lnKepr.findIndex(function(elem) { return retainh < elem; });
            for(var dec = decStart; dec < lnKepr.length; dec++) {
                lnKepr[dec] -= delno;
            }
            console.log(JSON.stringify(lnKepr));
        }
        console.log(JSON.stringify(delta) + " : " + JSON.stringify(oldDelta) + " : " + JSON.stringify(source)/* + " : " + delta.ops[1].delete*/); //JSON.stringify(delta.ops[0].retain)
        console.log("LineCount : " + lineCount);
    }
    if(eventName == "selection-change") {
        var range = chA;
        var oldRange = chB;
        cursorPos = ((range != null) ? range.index : cursorPos);
        prCursorPos = ((oldRange != null) ? oldRange.index : prCursorPos);
        curLine = lnKepr.findIndex(function(elem) { return elem >= cursorPos; });
        curLine = ((curLine == -1) ? lnKepr.length : ((curLine == 0) ? 1 :curLine));
        console.log(JSON.stringify(range) + " : " + JSON.stringify(oldRange) + " : " + JSON.stringify(source)); //JSON.stringify(delta.ops[0].retain)
        console.log(cursorPos + " : " + prCursorPos);
        console.log("Current Line : " + curLine);
    }
});
//OnKeypress