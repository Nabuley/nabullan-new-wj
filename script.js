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

class NBYTools{
    static __all__ = function() {
        const all_things = {
            "Heap" : ["parent", "heapify", "buildHeap", "push", "pop", "popAt", "sort", "peek", "size", "print"], 
            "Queue" : ["push", "pop", "size", "print"], 
            "Stack" : ["push", "pop", "size", "print"], 
            "EtcFunctions" : ["CollatzConjecture", "{static} CollatzConjecture"]
        }
        for (let i of Object.keys(all_things)) {
            output(`${i} : ${all_things[i].join(", ")}`);
        }
    } 
    static Heap = class {
        constructor(heap) {
            this._heap = heap;
        }
        parent(index) {
            return Math.floor((index - 1) / 2);
        }
        #leftChild(index) {
            return 2 * index + 1;
        }
        #rightChild(index) {
            return 2 * index + 2;
        }
        heapify(index) {
            let smallest = index;
            let leftIndex = this.#leftChild(index);
            let rightIndex = this.#rightChild(index);
      
            if (leftIndex < this._heap.length && this._heap[leftIndex] < this._heap[smallest]) {
                smallest = leftIndex;
            }
            if (rightIndex < this._heap.length && this._heap[rightIndex] < this._heap[smallest]) {
                smallest = rightIndex;
            }
            if (smallest !== index) {
                [this._heap[index], this._heap[smallest]] = [this._heap[smallest], this._heap[index]];
                this.heapify(smallest);
            }
        }
        buildHeap() {
            for (let i = Math.floor(this.size() / 2) - 1; i >= 0; i--) {
                this.heapify(i);
            }
        }
        push(value) {
            this._heap.push(value);
            let index = this.size() - 1;
            while (index > 0 && this._heap[this.parent(index)] > this._heap[index]) {
                [this._heap[this.parent(index)], this._heap[index]] = [this._heap[index], this._heap[this.parent(index)]];
                index = this.parent(index);
            }
        }
        pop() {
            if (this.size() === 0) {
                return undefined;
            }
            let root = this._heap[0];
            this._heap[0] = this._heap[this._heap.length - 1];
            this._heap.pop();
            this.heapify(0);
            return root;
        }
        popAt(index) {
            if (index < 0 || index >= this.size()) {
                return undefined;
            }
        
            let removedValue = this._heap[index];
            
            this._heap[index] = this._heap[this._heap.length - 1];
            this._heap.pop();

            if (this._heap[index] < removedValue) {
                this.heapify(index); // 아래로 내려가기
            } else {
                let parentIndex = this.parent(index);
                while (index > 0 && this._heap[parentIndex] > this._heap[index]) {
                [this._heap[parentIndex], this._heap[index]] = [this._heap[index], this._heap[parentIndex]];
                index = parentIndex;
                parentIndex = this.parent(index);
                }
            }
        
            return removedValue;
        }
        sort() {
            this.buildHeap();
            if (this.size() === 0) return [];
            let res = [];
            while (this.size() !== 0) {
                res.push(this.pop());
            }
            return res;
        }
        peek() {
            return this._heap.length > 0 ? this._heap[0] : undefined;
        }
        size() {
            return this._heap.length;
        }
        print() {
            output(this._heap);
        }
        get heap() {
            return this._heap;
        }
        set heap(new_heap) {
            this._heap = new_heap;
            //this.buildHeap();
        }
    }
    static Queue = class {
        constructor (queue) {
            this._queue = queue;
        }
        pop() {
            const res = this._queue[0];
            this._queue = this._queue.slice(1, this.size());
            return res;
        }
        push(k) {
            this._queue.push(k);
        }
        size() {
            return this._queue.length;
        }
        print() {
            output(this._queue);
        }
        get queue() {
            return this._queue;
        }
        set queue(new_queue) {
            this._queue = new_queue;
        }
    }
    static Stack = class {
        constructor (stack) {
            this._stack = stack;
        }
        pop() {
            const res = this._stack[-1];
            this._stack = this._stack.slice(0, this.size() - 1);
            return res;
        }
        push(k) {
            this._stack.push(k);
        }
        size() {
            return this._stack.length;
        }
        print() {
            output(this._stack);
        }
        get stack() {
            return this._stack;
        }
        set stack(new_queue) {
            this._stack = new_queue;
        }
    }

    static PhysicsEngine = class {
        #spring = class {
            constructor(k) {
                this.k = k;
            }
            strength(x) {
                return this.k * x;
            }
            PotentialEnergy(x) {
                return this.strength(x) * 0.5 * x;
            }
        }
        constructor({weight, speed, g = 9.8, name = ""}) {
            this.weight = weight;
            this.speed = speed;
            this.g = g;
            this.name = name;
        }
    }
    static EtcFunctions = class {
        #memo_c = {};
        #memo_f = {};
        constructor(number) {
            this.number = number;
        }
        #check_memo(option, number) {
            let res = [false];
            switch(option) {
                case "CollatzConjecture":
                    if (this.#memo_c[number]) {
                        res = [true, this.#memo_c[number]];
                    }
                break;
                case "Fibonacci":
                    if (this.#memo_f[number]) {
                        res = [true, this.#memo_f[number]];
                    }
                break;
            }
            return res;
        }
        /*Fibonacci(number, now_number = 1, before_number = 1) {
            const now_number = 1;

        }*/
        CollatzConjecture() {
            const start_number = this.number;
            let res = [start_number];
            let check = false;
            let number = start_number;
            while (number !== 1) {
                check = this.#check_memo("CollatzConjecture", number)
                if (check[0]) {
                    res = [...res, ...check[1].slice(1, check[1].length)];
                    //console.log(1);
                    break;
                } else {
                    number = number % 2 ? number * 3 + 1 : number / 2;
                    res.push(number);
                }
            }
            this.#memo_c[start_number] = res;
            return res;
        }
        static CollatzConjecture(number) {
            return (new NBYTools).EtcFunctions(number).CollatzConjecture();
        }
    }
}

const customKeywords = ['and', 'or', 'not', 'ignore', 'reloop', 'func', 'when'];
const customOverlay = {
    token: function(stream) {
        // 현재 문자 읽기
        // let string_big_opened = false;
        // let string_small_opened = false;
        // let backtick_opened = false;
        let strings = false;
        let currentChar = stream.peek();
        //let inComment = false;
        // "and", "or", "not"과 같은 단어인지 확인
        let word = "";
        while (currentChar && /[a-zA-Z_0-9]/.test(currentChar)) { // 알파벳인 동안 계속 읽기
            // strings = (string_big_opened || string_small_opened || backtick_opened);
            // if (!inComment && word.endsWith('"') && !(string_small_opened || backtick_opened)) {
            //     string_big_opened = ! string_big_opened;
            // } else if (!inComment && word.endsWith("'") && !(string_big_opened || backtick_opened)) {
            //     string_small_opened = ! string_small_opened;
            // } else if (!inComment && word.endsWith("`") && !(string_big_opened || string_small_opened)) {
            //     backtick_opened = ! backtick_opened;
            // }
            word += currentChar;
            stream.next();  // 문자 소비
            currentChar = stream.peek();  // 다음 문자 확인
        }
        // word가 'and', 'or', 'not'인지 확인
        if (customKeywords.includes(word) && !strings) {
            const prevChar = stream.peek(); // 이전 문자를 확인
                        // 앞에 munja 문자가 있거나 아무 문자도 없을 경우 하이라이팅
            if (munja.includes(prevChar) || prevChar === undefined) {
                return 'keyword-custom'; // 하이라이팅
            }
        }

        // 일치하지 않으면 그 문자 소비하고 null 반환
        stream.next();
        return null;
    }
};
const classKeywords = ['NBYTools'];
const classOverlay = {
    token: function(stream) {
        // 현재 문자 읽기
        // let string_big_opened = false;
        // let string_small_opened = false;
        // let backtick_opened = false;
        let strings = false;
        let currentChar = stream.peek();
        //let inComment = false;
        // "and", "or", "not"과 같은 단어인지 확인
        let word = "";
        while (currentChar && /[a-zA-Z_0-9]/.test(currentChar)) { // 알파벳인 동안 계속 읽기
            // strings = (string_big_opened || string_small_opened || backtick_opened);
            // if (!inComment && word.endsWith('"') && !(string_small_opened || backtick_opened)) {
            //     string_big_opened = ! string_big_opened;
            // } else if (!inComment && word.endsWith("'") && !(string_big_opened || backtick_opened)) {
            //     string_small_opened = ! string_small_opened;
            // } else if (!inComment && word.endsWith("`") && !(string_big_opened || string_small_opened)) {
            //     backtick_opened = ! backtick_opened;
            // }
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
// const customOverlay = {
//     token: function(stream) {
//         // 현재 문자 읽기
//         let string_big_opened = false;
//         let string_small_opened = false;
//         let backtick_opened = false;
//         let comment = false;
//         let idx = 0;
//         const customCode = ""
//         let codes = ""
//         const munja = ["(", ")", " ", "{", "}", "[", "]", ";"];
//         while (true) {
//             let code = stream.peek()
//             idx ++;
//             let strings = (string_big_opened || string_small_opened || backtick_opened);
//             if (! comment) codes += code;
//             if (codes.endsWith("!(") && ! strings) {
//                 codes = codes.slice(0, -2);
//                 comment = true;
//             } else if (code == ")" && comment) {
//                 comment = false;
//             } else if (comment) {
//                 continue;
//             }
            
//             try {
//                 if (codes.endsWith("or") && (munja.includes(codes[codes.length - 3]) && munja.includes(customCode[idx])) && ! strings) {
//                     return 'keyword-custom'
//                 } else if (codes.endsWith("and") && (munja.includes(codes[codes.length - 4]) && munja.includes(customCode[idx])) && ! strings) {
//                     return 'keyword-custom'
//                 } else if ((codes.endsWith("not") && (munja.includes(codes[codes.length - 4]) && munja.includes(customCode[idx]))) && ! strings) {
//                     return 'keyword-custom'
//                 } else if ((codes.endsWith("ignore") && (munja.includes(codes[codes.length - 7]) && munja.includes(customCode[idx]))) && ! strings) {
//                     return 'keyword-custom'
//                 } else if ((codes.endsWith("reloop") && (munja.includes(codes[codes.length - 7]) && munja.includes(customCode[idx]))) && ! strings) {
//                     return 'keyword-custom'
//                 }
//             }
//             catch (err) { console.log(err); }
//             if (codes.endsWith('"') && !(string_small_opened || backtick_opened)) {
//                 string_big_opened = ! string_big_opened;
//             } else if (codes.endsWith("'") && !(string_big_opened || backtick_opened)) {
//                 string_small_opened = ! string_small_opened;
//             } else if (codes.endsWith("`") && !(string_big_opened || string_small_opened)) {
//                 backtick_opened = ! backtick_opened;
//             }
//             try {
//                 stream.next();
//             } catch (err) {
//                 break;
//             }
//         }
//         const outputElement = document.getElementById("output");
//         outputElement.textContent = "";

//     }
// };
/*const commentOverlay = {
    token: function(stream) {
        // 처음으로 주석 시작 지점을 찾습니다.
        if (!stream.eol() && stream.match('!(')) {
            
            while (!stream.eol()) {
                // 주석 끝 지점을 찾습니다.
                if (stream.match(')', false)) {
                    stream.next(); // 닫는 괄호를 지나갑니다.
                    return 'comment-custom';
                }
                stream.next();
            }
            return 'comment-custom'; // 줄 끝까지 주석으로 처리
        }
        stream.next();
        return null;
    }
};*/


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
            //const from = doc.posFromIndex(start);
            //doc.markText(from, position, { className: 'comment-custom' });
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
            //const from = doc.posFromIndex(start);
            //doc.markText(from, position, { className: 'comment-custom' });
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
editor.setValue(`!(Program Here!)
func main() {
    print("Hello, World!");     !(Please Use This Well!)
}
`);
// Add the custom overlay
editor.addOverlay(customOverlay);
editor.addOverlay(classOverlay);
//editor.addOverlay(commentOverlay);


function Nabullan(customCode) {
    let codes = "";
    let string_big_opened = false;
    let string_small_opened = false;
    let backtick_opened = false;
    let comment = false;
    let idx = 0;
    let comment_stack = 0;
    for (let code of customCode) {
        idx ++;
        let strings = (string_big_opened || string_small_opened || backtick_opened);
        if (! comment) codes += code;
        if (codes.endsWith("!(") && ! strings) {
            codes = codes.slice(0, -2);
            comment = true;
            comment_stack ++;
        } else if (code === "(" && ! strings && comment) {
            comment_stack ++;
        } else if (code === ")" && ! strings && comment) {
            comment_stack --;
            if (comment_stack <= 0) {
                comment = false;
            }
        }
        if (comment) {
            continue;
        }
        
        try {
            //if(codes.endsWith("not")){console.log(munja.includes(codes[codes.length - 4]))}
            //console.log(codes[codes.length - 3], [codes.length - 4]);
            if (codes.endsWith("print")) {
                if (codes.length === 5) {
                    codes = codes.slice(0, -5) + "output";
                } else if ((munja.includes(codes[codes.length - 6]) && munja.includes(customCode[idx])) && ! strings) {
                    codes = codes.slice(0, -5) + "output";
                }
            } else if (codes.endsWith("func")) {
                if (codes.length === 4) {
                    codes = codes.slice(0, -4) + "function";
                } else if ((munja.includes(codes[codes.length - 5]) && munja.includes(customCode[idx])) && ! strings) {
                    codes = codes.slice(0, -4) + "function";
                }
            } else if (codes.endsWith("when")) {
                if (codes.length === 4) {
                    codes = codes.slice(0, -4) + "if";
                } else if ((munja.includes(codes[codes.length - 5]) && munja.includes(customCode[idx])) && ! strings) {
                    codes = codes.slice(0, -4) + "if";
                }
            } else if (codes.endsWith("or")) {
                if (codes.length === 2) {
                    codes = codes.slice(0, -2) + " || ";
                } else if ((munja.includes(codes[codes.length - 3]) && munja.includes(customCode[idx])) && ! strings) {
                    codes = codes.slice(0, -2) + " || ";
                }
            } else if (codes.endsWith("and")) {
                if (codes.length === 3) {
                    codes = codes.slice(0, -3) + " && ";
                } else if ((munja.includes(codes[codes.length - 4]) && munja.includes(customCode[idx])) && ! strings) {
                    codes = codes.slice(0, -3) + " && ";
                }
            } else if (codes.endsWith("not")) {
                if (codes.length === 3) {
                    codes = codes.slice(0, -3) + " ! ";
                } else if ((munja.includes(codes[codes.length - 4]) && munja.includes(customCode[idx])) && ! strings) {
                    codes = codes.slice(0, -3) + " ! ";
                }
            } else if (codes.endsWith("ignore")) {
                if (codes.length === 6){
                    codes = codes.slice(0, -6);
                } else if (((munja.includes(codes[codes.length - 7]) && munja.includes(customCode[idx]))) && ! strings) {
                    codes = codes.slice(0, -6);
                }
            } else if (codes.endsWith("reloop")) {
                if (codes.length === 6){
                    codes = codes.slice(0, -6) + "continue";
                } else if ((munja.includes(codes[codes.length - 7]) && munja.includes(customCode[idx])) && ! strings) {
                    codes = codes.slice(0, -6) + "continue";
                }
            }
        }
        catch (err) { console.log(err); }
        if (code.endsWith('"') && !(string_small_opened || backtick_opened)) {
            string_big_opened = ! string_big_opened;
        } else if (code.endsWith("'") && !(string_big_opened || backtick_opened)) {
            string_small_opened = ! string_small_opened;
        } else if (code.endsWith("`") && !(string_big_opened || string_small_opened)) {
            backtick_opened = ! backtick_opened;
        }
    }
    //console.log(codes);
    const outputElement = document.getElementById("output");
    outputElement.textContent = "";
    return codes;
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
//highlightComments(editor);
//highlightComments(editor)
//editor.on('change', () => highlightKeywords(editor));
editor.on('change', () => highlightComments(editor));
//highlightKeywords(editor);

// 코드 입력 시 자동 들여쓰기 처리
// const codeInput = document.getElementById("codeInput");
// codeInput.addEventListener("keydown", function (e) {
    //     if (e.key === "Tab") {
        //         e.preventDefault();
        //         const start = this.selectionStart;
        //         const end = this.selectionEnd;
        
        //         // 들여쓰기 (탭) 추가
//         this.value = this.value.substring(0, start) + "    " + this.value.substring(end);
//         this.selectionStart = this.selectionEnd = start + 4;
//     } else if (e.key === "Enter") {
//         e.preventDefault();
//         const start = this.selectionStart;
//         const end = this.selectionEnd;

//         // 현재 줄을 감지하여 이전 줄의 들여쓰기 수준 가져오기
//         const currentLine = this.value.substring(0, start).split("\n").pop();
//         const indentMatch = currentLine.match(/^(\s*)/);
//         const currentIndent = indentMatch ? indentMatch[1] : "";

//         // 중괄호가 있다면 추가로 들여쓰기
//         let extraIndent = "";
//         if (currentLine.trim().endsWith("{")) {
//             extraIndent = "    ";
//         }

//         // 줄바꿈 후 들여쓰기 추가
//         const newIndent = currentIndent + extraIndent;
//         this.value = this.value.substring(0, start) + "\n" + newIndent + this.value.substring(end);
//         this.selectionStart = this.selectionEnd = start + 1 + newIndent.length;
//     } else if (e.key === "}") {
//         // 중괄호를 입력할 때 자동으로 들여쓰기 감소
//         const start = this.selectionStart;
//         const currentLine = this.value.substring(0, start).split("\n").pop();
//         const indentMatch = currentLine.match(/^(\s*)/);
//         const currentIndent = indentMatch ? indentMatch[1] : "";

//         if (currentIndent.length >= 4) {
//             // 줄에서 4칸 들여쓰기를 줄임
//             e.preventDefault();
//             const reducedIndent = currentIndent.slice(0, -4);
//             this.value = this.value.substring(0, start - 4) + "}" + this.value.substring(start);
//             this.selectionStart = this.selectionEnd = start;
//         }
//     }
// });
