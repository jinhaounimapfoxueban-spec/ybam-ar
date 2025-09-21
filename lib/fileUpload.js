import formidable from 'formidable';
import fs from 'fs';
import path from 'path';

export const config = {
  api: {
    bodyParser: false,
  },
};

export async function parseForm(req, uploadDir) {
  const options = {
    uploadDir: uploadDir,
    keepExtensions: true,
    maxFileSize: 50 * 1024 * 1024, // 50MB
    multiples: false,
  };

  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
  }

  const form = formidable(options);

  return new Promise((resolve, reject) => {
    form.parse(req, (err, fields, files) => {
      if (err) {
        reject(err);
        return;
      }
      resolve({ fields, files });
    });
  });
}

export function getFileUrl(filename, req) {
  const host = req.headers.host;
  const protocol = req.headers['x-forwarded-proto'] || 'http';
  return `${protocol}://${host}/uploads/${filename}`;
}
