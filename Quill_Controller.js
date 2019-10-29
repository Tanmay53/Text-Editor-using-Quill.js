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
var nIndntKepr = new Array();
lnKepr[0] = 0;
nIndntKepr[0] = 0;
//var selIndex = ;
var selLength = 0;
quill.on("editor-change", function(eventName, chA, chB, source) {
    //console.log(/*lIndex +*/ ":" + selLength);
    //let [line, offset] = quill.getLine(5);
    //let index = quill.getIndex(line);
    if(eventName == "text-change") {
        var delta = chA;
        var oldDelta = chB;
        var retainh = ((delta.ops[0].retain != undefined) ? delta.ops[0].retain : 0);
        var deltaTxt = (((cursorPos == 1) || (cursorPos == 0)) ? delta.ops[0].insert : delta.ops[1].insert);
        if(deltaTxt != undefined) {
            var dTxtLn = deltaTxt.length;
            var incStart = lnKepr.findIndex(function(elem) { return elem >= retainh; });
            for(var inc = incStart; inc < lnKepr.length; inc++) {
                lnKepr[inc] += dTxtLn;
            }
            var deltaTxt1 = deltaTxt;
            var lngLn = 0;
            while(deltaTxt1.indexOf("\n") != -1) {
                var shLn = deltaTxt1.indexOf("\n");
                lnKepr.splice(incStart++, 0, (retainh + shLn + lngLn));
                lngLn += shLn +  1;
                deltaTxt1 = deltaTxt1.substr(shLn + 1);
                lineCount++;
            }
        }
        else {
            var delno = ((cursorPos == 0) ? delta.ops[0].delete : delta.ops[1].delete);
            var delAr = lnKepr.filter(function(elem) { return ((elem >= retainh) && (elem < (retainh + delno))); });
            var delArLn = delAr.length;
            var delStart = lnKepr.findIndex(function(elem) { return elem >= retainh; });
            lnKepr.splice(delStart, delArLn);
            lineCount += delArLn;
            for(var dec = delStart; dec < lnKepr.length; dec++) {
                lnKepr[dec] -= delno;
            }
        }
        curLine = (lnKepr.findIndex(function(elem) { return elem >= cursorPos; })) + 1;
        console.log("Current Line : " + curLine);
        console.log(JSON.stringify(lnKepr));
        console.log(JSON.stringify(delta) + " : " + JSON.stringify(oldDelta) + " : " + JSON.stringify(source)); //JSON.stringify(delta.ops[0].retain)
        console.log("LineCount : " + lineCount);
    }
    if(eventName == "selection-change") {
        var uSelect = quill.getSelection();
        //selIndex = uSelect.index; Simillar to cursorPos.
        selLength = ((uSelect != undefined) ? uSelect.length : 0);//whenever selected text is required, the length and the index can be used on the oldDelta
        var range = chA;
        var oldRange = chB;
        cursorPos = ((range != null) ? range.index : cursorPos);
        prCursorPos = ((oldRange != null) ? oldRange.index : prCursorPos);
        tcurLine = (lnKepr.findIndex(function(elem) { return elem >= cursorPos; })) + 1;
        curLine = ((tcurLine == 0) ? curLine : tcurLine);
        console.log("Length : " + selLength/* + " Index : " + selIndex*/);
        console.log(JSON.stringify(range) + " : " + JSON.stringify(oldRange) + " : " + JSON.stringify(source)); //JSON.stringify(delta.ops[0].retain)
        console.log(cursorPos + " : " + prCursorPos);
        console.log("Current Line : " + curLine);
    }
});
//OnKeypress