import * as fs from "fs"; // Use named import for fs

let fetch: any; // Declare fetch as a variable

(async () => {
  fetch = (await import("node-fetch")).default;
})().catch((err) => console.error("Initialization Error:", err));

// Define the LLMResponse interface
interface LLMResponse {
  choices: Array<{
    message: {
      content: string;
    };
  }>;
}

// Export the ocr function
export async function ocr({
  filePath,
  model = "llama3.2-vision:latest",
}: {
  filePath: string;
  model?: string;
}) {
  const finalMarkdown = await getMarkDown({ model, filePath });
  return finalMarkdown;
}

// Define the getMarkDown function
async function getMarkDown({
  model,
  filePath,
}: {
  model: string;
  filePath: string;
}) {
  const systemPrompt = `Convert the provided image into Markdown format. Ensure that all content from the page is included, such as headers, footers, subtexts, images (with alt text if possible), tables, and any other elements.

  Requirements:

  - Output Only Markdown: Return solely the Markdown content without any additional explanations or comments.
  - No Delimiters: Do not use code fences or delimiters like \`\`\`markdown.
  - Complete Content: Do not omit any part of the page, including headers, footers, and subtext.
  `;

  const imageBase64 = isRemoteFile(filePath)
    ? await fetchBase64(filePath)
    : encodeImage(filePath);

  const requestBody = {
    model,
    messages: [
      {
        role: "user",
        content: systemPrompt,
        images: [imageBase64],
      },
    ],
  };

  const response = await fetch("http://localhost:11434/api/chat", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(requestBody),
  });

  if (!response.ok) {
    throw new Error(`Error from LLM service: ${response.statusText}`);
  }

  const data = (await response.json()) as LLMResponse;

  return data.choices[0]?.message?.content || "No content returned.";
}

// Encode image to Base64
function encodeImage(imagePath: string) {
  const imageFile = fs.readFileSync(imagePath);
  return Buffer.from(imageFile).toString("base64");
}

// Check if the file path is remote
function isRemoteFile(filePath: string): boolean {
  return filePath.startsWith("http://") || filePath.startsWith("https://");
}

// Fetch and convert remote file to Base64
async function fetchBase64(url: string): Promise<string> {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Error fetching remote file: ${response.statusText}`);
  }
  const buffer = await response.arrayBuffer();
  return Buffer.from(buffer).toString("base64");
}

// CLI Argument Support
const args = process.argv.slice(2); // Arguments after "node index.js"
const filePath = args[0]; // First argument is the file path

if (!filePath) {
  console.error("Please provide the file path as the first argument.");
  process.exit(1); // Exit with error if no file path is provided
}

ocr({ filePath })
  .then((result) => {
    console.log("OCR Result:");
    console.log(result);
  })
  .catch((error) => {
    console.error("Error during OCR:");
    console.error(error.message);
  });