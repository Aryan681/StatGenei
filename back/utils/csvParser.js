// utils/csvParser.js
import fs from 'fs';
import { parse } from 'csv-parse';

export const parseCsvFile = (filePath) => {
    return new Promise((resolve, reject) => {
        const results = [];
        const parser = parse({
            columns: true, // Use the first row as headers
            skip_empty_lines: true,
            trim: true // This is crucial to handle spaces in column names
        });

        fs.createReadStream(filePath)
            .pipe(parser)
            .on('data', (data) => results.push(data))
            .on('end', () => {
                // Check if the parsed data has the expected structure
                if (results.length > 0) {
                    console.log('✅ CSV parsing successful.');
                    console.log('Parsed Columns:', Object.keys(results[0]));
                    resolve(results);
                } else {
                    console.error('❌ CSV parsing failed. No data rows found.');
                    reject(new Error("CSV parsing failed: No data rows found. Check file content and format."));
                }
            })
            .on('error', (error) => {
                console.error("❌ CSV parsing stream error:", error);
                reject(error);
            });
    });
};