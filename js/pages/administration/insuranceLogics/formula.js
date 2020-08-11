ace.define("formula_highlight_rules",
    ["require","exports","module","ace/lib/oop","ace/lib/lang","ace/mode/text_highlight_rules"],
    function(acequire, exports, module) {
    "use strict";

    var oop = acequire("ace/lib/oop");
    var lang = acequire("ace/lib/lang");
    var TextHighlightRules = acequire("ace/mode/text_highlight_rules").TextHighlightRules;

    var formulaHighlightRules = function(textClass) {
        this.$rules = {
            "start" : [
                {
                    token : "test",
                    regex : /(?:^|\s)(І|і)(?=\s)|(?:^|\s)(А|а)(Б|б)(О|о)(?=\s)|(?:^|\s)(Я|я)(К|к)(Щ|щ)(О|о)(?=\s)|(?:^|\s)(Т|т)(О|о)(Д|д)(І|і)(?=\s)|(?:^|\s)(І|і)(Н|н)(А|а)(К|к)(Ш|ш)(Е|е)(?=\s)|(?:^|\s)(К|к)(І|і)(Н|н)(Е|е)(Ц|ц)(Ь|ь)(?=\s)|(?:^|\s)<(?=\s)|(?:^|\s)>(?=\s)|(?:^|\s)>=(?=\s)|(?:^|\s)<=(?=\s)|(?:^|\s)=(?=\s)|(?:^|\s)==(?=\s)|(?:^|\s)!=(?=\s)|=>/g
                },
                /*{
                    token : "error",
                    regex : /;\s+\S.*|[_№:~@$^&,\.\?\\]|\S+[<>=+/*-;\.\?\\](\S+|)|[<>=+/*-;\.\?\\]\S+|=>/g
                },*/
                {
                    token : "succes",
                    regex : /[\-+*]|=>/g
                },
                {
                    token : "wit",
                    regex : /[();]|=>/g
                },
                {
                    token : "number",
                    regex : /\d+|=>/g
                },
                {
                    token : "link",
                    regex : '#[a-zA-Zа-яА-ЯЇЄІїєі0-9]+',
                },
                {
                    token : "texts",
                    regex : /"|'|=>/g,
                    next  : "qstring"
                },
            ],
            "qstring" : [
                {token : "texts", regex : /"|'|=>/g,  next  : "start"},
                {defaultToken : "texts"}
            ]
        };
    };

    oop.inherits(formulaHighlightRules, TextHighlightRules);

    exports.formulaHighlightRules = formulaHighlightRules;
});

ace.define("ace/mode/matching_brace_outdent",["require","exports","module","ace/range"], function(acequire, exports, module) {
    "use strict";

    var Range = acequire("../range").Range;

    var MatchingBraceOutdent = function() {};

    (function() {

        this.checkOutdent = function(line, input) {
            if (! /^\s+$/.test(line)) return false;

            return /^\s*\}/.test(input);
        };

        this.autoOutdent = function(doc, row) {
            var line = doc.getLine(row);
            var match = line.match(/^(\s*\})/);

            if (!match) return 0;

            var column = match[1].length;
            var openBracePos = doc.findMatchingBracket({row: row, column: column});

            if (!openBracePos || openBracePos.row == row) return 0;

            var indent = this.$getIndent(doc.getLine(openBracePos.row));
            doc.replace(new Range(row, 0, row, column-1), indent);
        };

        this.$getIndent = function(line) {
            return line.match(/^\s*/)[0];
        };

    }).call(MatchingBraceOutdent.prototype);

    exports.MatchingBraceOutdent = MatchingBraceOutdent;
});

ace.define("formula", ["require","exports","module","ace/lib/oop","ace/mode/text","ace/mode/text_highlight_rules","formula_highlight_rules","ace/mode/matching_brace_outdent"],  function(acequire, exports, module) {
    "use strict";

    var oop = acequire("ace/lib/oop");
    var TextMode = acequire("ace/mode/text").Mode;
    var TextHighlightRules = acequire("ace/mode/text_highlight_rules").TextHighlightRules;
    var formulaHighlightRules = acequire("formula_highlight_rules").formulaHighlightRules;
    var MatchingBraceOutdent = acequire("ace/mode/matching_brace_outdent").MatchingBraceOutdent;

    var Mode = function(suppressHighlighting) {
        if (suppressHighlighting)
            this.HighlightRules = formulaHighlightRules;
        else
            this.HighlightRules = formulaHighlightRules;
        this.$outdent = new MatchingBraceOutdent();
        this.$behaviour = this.$defaultBehaviour;
    };
    oop.inherits(Mode, TextMode);

    (function() {
       this.lineCommentStart = "%";
       this.getNextLineIndent = function(state, line, tab) {
          return this.$getIndent(line);
       };

       this.allowAutoInsert = function() {
          return false;
       };
        this.$id = "formula";
    }).call(Mode.prototype);

    exports.Mode = Mode;
});

