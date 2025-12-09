const path = require('path');
const fs = require('fs');
const axios = require('axios');
const FormData = require('form-data');
const { ml_api_url } = require('../configs/envConfig');

async function requestDetect(res, filename) {
    if (!filename) {
        return res.status(400).json({ message: 'filename is required in request body' });
    }

    const filePath = path.resolve(__dirname, '../../image/raw', filename);
    if (!fs.existsSync(filePath)) {
        return res.status(404).json({ message: `File not found: ${filename}` });
    }

    const form = new FormData();
    form.append('image', fs.createReadStream(filePath), { filename });

    const detectResp = await axios.post(ml_api_url, form, {
        headers: form.getHeaders(),
        maxContentLength: Infinity,
        maxBodyLength: Infinity,
    });

    saveBase64Result(filename, detectResp.data.result);

    return detectResp.data;
}

async function saveBase64Result(filename, base64) {
    if (!filename) throw new Error('filename is required');
    if (!base64) throw new Error('base64 is required');

    // Strip data URL prefix if present
    const match = /^data:.*;base64,(.*)$/.exec(base64);
    const base64Payload = match ? match[1] : base64;

    const buffer = Buffer.from(base64Payload, 'base64');

    const dir = path.resolve(__dirname, '../../image/result');
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
    }

    const filePath = path.join(dir, filename);
    await fs.promises.writeFile(filePath, buffer);
    return filePath;
}

module.exports = {
    requestDetect,
    saveBase64Result
};