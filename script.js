const munja = ["(", ")", " ", "{", "}", "[", "]", ";", "\n", '"', "'", '`'];
const class_munja = ["(", ")", " ", "{", "}", "[", "]", ";", "\n", '.'];

Array.prototype.equal = function (arr) {
    if (!Array.isArray(arr) || arr.length !== this.length) return false;

    for (let i in arr) {
        if (Array.isArray(arr[i]) && Array.isArray(this[i])) {
            if (!this[i].equal(arr[i])) return false;
        } else if (arr[i] !== this[i]) return false;
    }
    return true;
}

const customKeywords = ['and', 'or', 'not', 'ignore', 'reloop', 'func', 'when'];
const customOverlay = {
    token: function(stream) {
        let strings = false;
        let currentChar = stream.peek();
        let word = "";
        while (currentChar && /[a-zA-Z_0-9]/.test(currentChar)) { // 알파벳인 동안 계속 읽기
            word += currentChar;
            stream.next();  // 문자 소비
            currentChar = stream.peek();  // 다음 문자 확인
        }
        if (customKeywords.includes(word) && !strings) {
            const prevChar = stream.peek(); // 이전 문자를 확인
            if (munja.includes(prevChar) || prevChar === undefined) {
                return 'keyword-custom'; // 하이라이팅
            }
        }
        stream.next();
        return null;
    }
};
const classKeywords = ['NBYTools'];
const classOverlay = {
    token: function(stream) {
        let strings = false;
        let currentChar = stream.peek();
        //let inComment = false;
        // "and", "or", "not"과 같은 단어인지 확인
        let word = "";
        while (currentChar && /[a-zA-Z_0-9]/.test(currentChar)) { // 알파벳인 동안 계속 읽기
            word += currentChar;
            stream.next();  // 문자 소비
            currentChar = stream.peek();  // 다음 문자 확인
        }
        
        // word가 'and', 'or', 'not'인지 확인
        if (classKeywords.includes(word) && !strings) {
            const prevChar = stream.peek(); // 이전 문자를 확인
            // 앞에 munja 문자가 있거나 아무 문자도 없을 경우 하이라이팅
            if (class_munja.includes(prevChar) || prevChar === undefined) {
                return 'classKeywords-custom'; // 하이라이팅
            }
        }

        // 일치하지 않으면 그 문자 소비하고 null 반환
        stream.next();
        return null;
    }
};

function highlightComments(editor) {
    const doc = editor.getDoc();
    const code = doc.getValue();
    let position = 0;
    let inComment = false;
    let start = 0;
    let string_big_opened = false;
    let string_small_opened = false;
    let backtick_opened = false;
    let strings = (string_big_opened || string_small_opened || backtick_opened);
    const marks = doc.getAllMarks();
    let comment_stack = 0;
    marks.forEach(mark => mark.clear());
    while (position < code.length) {
        strings = (string_big_opened || string_small_opened || backtick_opened);
        if (!inComment && code.startsWith('"', position) && !(string_small_opened || backtick_opened)) {
            string_big_opened = ! string_big_opened;
        } else if (!inComment && code.startsWith("'", position) && !(string_big_opened || backtick_opened)) {
            string_small_opened = ! string_small_opened;
        } else if (!inComment && code.startsWith("`", position) && !(string_big_opened || string_small_opened)) {
            backtick_opened = ! backtick_opened;
        }

        if (!inComment && code.startsWith('!(', position) && !strings) {
            inComment = true;
            start = position;
            comment_stack ++;
            position += 2; // Skip '!('
            continue;
        } else if (code.startsWith("(", position) && ! strings && inComment) {
            comment_stack ++;
        } else if (code.startsWith(")", position) && ! strings && inComment) {
            comment_stack --;
            if (comment_stack <= 0) {
                inComment = false;
                const end = position + 1; // Include ')'
                const from = doc.posFromIndex(start);
                const to = doc.posFromIndex(end);
                doc.markText(from, to, { className: 'comment-custom' });
                position = end;
                continue;
            }
        }


        position++;
    }
}
function highlightKeywords(editor) {
    const doc = editor.getDoc();
    const code = doc.getValue();
    let position = 0;
    let inComment = false;
    let start = 0;
    let string_big_opened = false;
    let string_small_opened = false;
    let backtick_opened = false;
    let strings = (string_big_opened || string_small_opened || backtick_opened);
    const marks = doc.getAllMarks();
    marks.forEach(mark => mark.clear());
    while (position < code.length) {
        strings = (string_big_opened || string_small_opened || backtick_opened);
        if (!inComment && code.startsWith('"', position) && !(string_small_opened || backtick_opened)) {
            string_big_opened = ! string_big_opened;
        } else if (!inComment && code.startsWith("'", position) && !(string_big_opened || backtick_opened)) {
            string_small_opened = ! string_small_opened;
        } else if (!inComment && code.startsWith("`", position) && !(string_big_opened || string_small_opened)) {
            backtick_opened = ! backtick_opened;
        }

        if (code.startsWith("or", position) && (munja.includes(code[code.length - 3]) && munja.includes(code[position])) && ! strings) {
            const end = position + 2; // Include ')'
            const from = doc.posFromIndex(start);
            const to = doc.posFromIndex(end);
            doc.markText(from, to, { className: 'comment-custom' });
            position = end;
            continue;
        } else if (code.startsWith("and", position) && (munja.includes(code[code.length - 4]) && munja.includes(code[position])) && ! strings) {
            const end = position + 3; // Include ')'
            const from = doc.posFromIndex(start);
            const to = doc.posFromIndex(end);
            doc.markText(from, to, { className: 'comment-custom' });
            position = end;
            continue;
        } else if ((code.startsWith("not", position) && (munja.includes(code[code.length - 4]) && munja.includes(code[position]))) && ! strings) {
            const end = position + 3; // Include ')'
            const from = doc.posFromIndex(start);
            const to = doc.posFromIndex(end);
            doc.markText(from, to, { className: 'comment-custom' });
            position = end;
            continue;
        } else if ((code.startsWith("ignore", position) && (munja.includes(code[code.length - 7]) && munja.includes(code[position]))) && ! strings) {
            const end = position + 6; // Include ')'
            const from = doc.posFromIndex(start);
            const to = doc.posFromIndex(end);
            doc.markText(from, to, { className: 'comment-custom' });
            position = end;
            continue;
        } else if ((code.startsWith("reloop", position) && (munja.includes(code[code.length - 7]) && munja.includes(code[position]))) && ! strings) {
            const end = position + 6; // Include ')'
            const from = doc.posFromIndex(start);
            const to = doc.posFromIndex(end);
            doc.markText(from, to, { className: 'comment-custom' });
            position = end;
            continue;
        }
        if (!inComment && code.startsWith('!(', position) && !strings) {
            start = position;
            position += 2; // Skip '!('
            continue;
        }

        if (inComment && code.startsWith(')', position) && !strings) {
            const end = position + 1; // Include ')'
            const from = doc.posFromIndex(start);
            const to = doc.posFromIndex(end);
            doc.markText(from, to, { className: 'comment-custom' });
            position = end;
            continue;
        }

        position++;
    }
}
const editor = CodeMirror.fromTextArea(document.getElementById('codeInput'), {
    lineNumbers: true,
    mode: "javascript",
    theme: "dracula"
});

// Add the custom overlay
editor.addOverlay(customOverlay);
editor.addOverlay(classOverlay);
//editor.addOverlay(commentOverlay);


function Nabullan(customCode) {
    return customCode;
}
function saveCode() {
    const code = editor.getValue();
    const blob = new Blob([code], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'MyProject.nby'; // Default filename
    a.click();
    URL.revokeObjectURL(url);
}

function loadCode(event) {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            editor.setValue(e.target.result);
        };
        reader.readAsText(file);
    }
}

function output(...message) {
    const outputElement = document.getElementById("output");
    for (let i of message) {
        outputElement.textContent += i + " ";
    }
    outputElement.textContent += "\n";
}

function executeScript() {
    const codeInput = editor.getValue();
    const transformedCode = Nabullan(codeInput);
    try {
        const fn = Function(`${transformedCode}`);
        fn();
    } catch (err) {
        output("Error: " + err.message);
    }
}
editor.on('change', () => highlightComments(editor));
