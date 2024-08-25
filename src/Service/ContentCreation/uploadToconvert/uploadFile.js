const axios = require('axios');
const dotenv = require('dotenv');
const FormData = require('form-data');
const fs = require('fs');
const path = require('path');
const transcribtController = require('../../../Controller/ContentCreation/OpenAi Controllers/recapTranscript_controller');
dotenv.config();

const prosessOnFile = async (inputBody, file, index, cutStart, cutEnd, transcriptionResults) => {
    const headers = {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': `Bearer ${process.env.FREECONVERT_API_KEY}`
    };

    try {
        // Step 1: Create a job
        const createJobResponse = await axios.post('https://api.freeconvert.com/v1/process/jobs', inputBody, { headers });
        const jobId = createJobResponse.data.id;

        console.log('Create Job Response:', createJobResponse.data);

        const importTask = createJobResponse.data.tasks.find(task => task.name === 'import-1');
        if (!importTask || !importTask.result) {
            console.error('Missing import-1 result:', createJobResponse.data);
            throw new Error('An error occurred: Missing import-1 result.');
        }

        const uploadUrl = importTask.result.form.url;
        const uploadParams = importTask.result.form.parameters;

        // Step 2: Upload the file
        const formData = new FormData();
        for (const key in uploadParams) {
            formData.append(key, uploadParams[key]);
        }
        formData.append('file', file.buffer, file.originalname);

        await axios.post(uploadUrl, formData, {
            headers: {
                ...formData.getHeaders()
            }
        });

        let jobStatus = 'processing';
        let downloadUrl;
        while (jobStatus === 'processing') {
            await new Promise(resolve => setTimeout(resolve , 10000 )); // Wait 10 seconds to get trimmed
            const statusResponse = await axios.get(`https://api.freeconvert.com/v1/process/jobs/${jobId}`, { headers });
            jobStatus = statusResponse.data.status;
            console.log(`Job status: ${jobStatus}`);
            if (jobStatus === 'completed') {
                const exportTask = statusResponse.data.tasks.find(task => task.name === 'export-1');
                if (exportTask && exportTask.result && exportTask.result.url) {
                    downloadUrl = exportTask.result.url;
                } else {
                    console.error('Missing export-1 result:', statusResponse.data);
                    throw new Error('An error occurred: Missing export-1 result.');
                }
            }
        }

        if (jobStatus === 'completed' && downloadUrl) {
            const fileResponse = await axios.get(downloadUrl, { responseType: 'stream' });
            const filePath = path.join('/tmp', `converted_part${index}.mp3`);

            // Ensure the directory exists
            fs.mkdirSync(path.dirname(filePath), { recursive: true });

            const writer = fs.createWriteStream(filePath);
            fileResponse.data.pipe(writer);

            await new Promise((resolve, reject) => {
                writer.on('finish', resolve);
                writer.on('error', reject);
            });

            // Transcribe the file
            const transcription = await transcribtController.transcribeFile(filePath);
            transcriptionResults.push({ part: index, "time duration": `${cutStart}:${cutEnd}`, transcription });

            return { message: `File part ${index} saved successfully`, filePath };

        } else {
            throw new Error('An error occurred during file conversion.');
        }

    } catch (error) {
        console.error('Error during file conversion:', {
            response: error.response ? error.response.data : null,
            message: error.message,
            stack: error.stack,
            config: error.config,
            request: error.request,
            htmlResponse: error.response ? error.response.data : null
        });

        if (error.response && error.response.data && error.response.data.errors) {
            const errorMessage = error.response.data.errors[0].message;
            if (errorMessage.includes('Insufficient CPU minutes')) {
                throw new Error('Job creation failed due to insufficient CPU minutes. Please check your FreeConvert account check money and your qute.');
            }
        }
        throw new Error('An error occurred during file conversion.');
    }
}

export {
    prosessOnFile
}
