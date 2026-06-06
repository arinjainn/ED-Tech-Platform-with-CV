import axios from "axios";
import { LANGUAGE_VERSIONS } from "../utils/compilerconstants";

const API = axios.create({
  baseURL: "https://emkc.org/api/v2/piston",
});

const executeJavaScriptLocally = (sourceCode) => {
  const originalLog = console.log;
  const originalError = console.error;
  const logs = [];

  console.log = (...args) => {
    logs.push(args.map(arg => typeof arg === "object" ? JSON.stringify(arg) : arg).join(" "));
  };
  console.error = (...args) => {
    logs.push("Error: " + args.map(arg => typeof arg === "object" ? JSON.stringify(arg) : arg).join(" "));
  };

  try {
    const result = new Function(sourceCode)();
    if (result !== undefined) {
      logs.push(String(result));
    }
  } catch (err) {
    logs.push("Error: " + err.message);
  } finally {
    console.log = originalLog;
    console.error = originalError;
  }

  return {
    run: {
      output: logs.join("\n"),
      stderr: logs.some(l => l.startsWith("Error:")) ? "Error" : null
    }
  };
};

export const executeCode = async (language, sourceCode) => {
  if (language === "javascript") {
    return executeJavaScriptLocally(sourceCode);
  }

  try {
    const response = await API.post("/execute", {
      language: language,
      version: LANGUAGE_VERSIONS[language],
      files: [
        {
          content: sourceCode,
        },
      ],
    });
    return response.data;
  } catch (error) {
    if (error.response && (error.response.status === 401 || error.response.status === 403 || error.response.status === 400 || (error.response.data && error.response.data.message && error.response.data.message.includes("whitelist")))) {
      return {
        run: {
          output: `Error: The public Piston API is now whitelist-only as of 2/15/2026.\nTo run ${language} code, please self-host Piston locally or provide a whitelisted API key.\n\nTip: Select "JavaScript" to use the built-in, fully-functional in-browser execution!`,
          stderr: "Piston Whitelist Restriction"
        }
      };
    }
    throw error;
  }
};