"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ocr = ocr;
var fs = require("fs"); // Use named import for fs
var fetch; // Declare fetch as a variable
(function () { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, Promise.resolve().then(function () { return require("node-fetch"); })];
            case 1:
                fetch = (_a.sent()).default;
                return [2 /*return*/];
        }
    });
}); })().catch(function (err) { return console.error("Initialization Error:", err); });
// Export the ocr function
function ocr(_a) {
    return __awaiter(this, arguments, void 0, function (_b) {
        var finalMarkdown;
        var filePath = _b.filePath, _c = _b.model, model = _c === void 0 ? "llama3.2-vision:latest" : _c;
        return __generator(this, function (_d) {
            switch (_d.label) {
                case 0: return [4 /*yield*/, getMarkDown({ model: model, filePath: filePath })];
                case 1:
                    finalMarkdown = _d.sent();
                    return [2 /*return*/, finalMarkdown];
            }
        });
    });
}
// Define the getMarkDown function
function getMarkDown(_a) {
    return __awaiter(this, arguments, void 0, function (_b) {
        var systemPrompt, imageBase64, _c, requestBody, response, data;
        var _d, _e;
        var model = _b.model, filePath = _b.filePath;
        return __generator(this, function (_f) {
            switch (_f.label) {
                case 0:
                    systemPrompt = "Convert the provided image into Markdown format. Ensure that all content from the page is included, such as headers, footers, subtexts, images (with alt text if possible), tables, and any other elements.\n\n  Requirements:\n\n  - Output Only Markdown: Return solely the Markdown content without any additional explanations or comments.\n  - No Delimiters: Do not use code fences or delimiters like ```markdown.\n  - Complete Content: Do not omit any part of the page, including headers, footers, and subtext.\n  ";
                    if (!isRemoteFile(filePath)) return [3 /*break*/, 2];
                    return [4 /*yield*/, fetchBase64(filePath)];
                case 1:
                    _c = _f.sent();
                    return [3 /*break*/, 3];
                case 2:
                    _c = encodeImage(filePath);
                    _f.label = 3;
                case 3:
                    imageBase64 = _c;
                    requestBody = {
                        model: model,
                        messages: [
                            {
                                role: "user",
                                content: systemPrompt,
                                images: [imageBase64],
                            },
                        ],
                    };
                    return [4 /*yield*/, fetch("http://localhost:11434/api/chat", {
                            method: "POST",
                            headers: {
                                "Content-Type": "application/json",
                            },
                            body: JSON.stringify(requestBody),
                        })];
                case 4:
                    response = _f.sent();
                    if (!response.ok) {
                        throw new Error("Error from LLM service: ".concat(response.statusText));
                    }
                    return [4 /*yield*/, response.json()];
                case 5:
                    data = (_f.sent());
                    return [2 /*return*/, ((_e = (_d = data.choices[0]) === null || _d === void 0 ? void 0 : _d.message) === null || _e === void 0 ? void 0 : _e.content) || "No content returned."];
            }
        });
    });
}
// Encode image to Base64
function encodeImage(imagePath) {
    var imageFile = fs.readFileSync(imagePath);
    return Buffer.from(imageFile).toString("base64");
}
// Check if the file path is remote
function isRemoteFile(filePath) {
    return filePath.startsWith("http://") || filePath.startsWith("https://");
}
// Fetch and convert remote file to Base64
function fetchBase64(url) {
    return __awaiter(this, void 0, void 0, function () {
        var response, buffer;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, fetch(url)];
                case 1:
                    response = _a.sent();
                    if (!response.ok) {
                        throw new Error("Error fetching remote file: ".concat(response.statusText));
                    }
                    return [4 /*yield*/, response.arrayBuffer()];
                case 2:
                    buffer = _a.sent();
                    return [2 /*return*/, Buffer.from(buffer).toString("base64")];
            }
        });
    });
}
// CLI Argument Support
var args = process.argv.slice(2); // Arguments after "node index.js"
var filePath = args[0]; // First argument is the file path
if (!filePath) {
    console.error("Please provide the file path as the first argument.");
    process.exit(1); // Exit with error if no file path is provided
}
ocr({ filePath: filePath })
    .then(function (result) {
    console.log("OCR Result:");
    console.log(result);
})
    .catch(function (error) {
    console.error("Error during OCR:");
    console.error(error.message);
});
