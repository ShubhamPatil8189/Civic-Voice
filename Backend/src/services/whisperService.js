const { exec } = require("child_process");
const path = require("path");

exports.transcribeAudio = (filePath) => {
  return new Promise((resolve, reject) => {
    const command = `whisper ${filePath} --model base --language auto --output_format json`;

    exec(command, (error, stdout, stderr) => {
      if (error) return reject(error);

      const outputFile = filePath.replace(/\.[^/.]+$/, ".json");
      const result = require(path.resolve(outputFile));

      resolve({
        text: result.text,
        language: result.language
      });
    });
  });
};
