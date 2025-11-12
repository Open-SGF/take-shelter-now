import { writeFile } from 'fs/promises';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const SHEET_URL =
	'https://docs.google.com/spreadsheets/d/e/2PACX-1vRavAkyluczQHoB8SyUd9HD1tOrDQ1wogjQ43hdV9wH86l1qk-h0jcgWeY7fcE7PgGNdPyQg5aqCLlR/pub?output=csv';
const OUTPUT_PATH = join(__dirname, '..', 'src', 'lib', 'data', 'shelters.json');

interface ShelterRecord {
	[key: string]: string;
}

/**
 * Parse CSV string to array of objects
 * @param csvText - CSV content
 * @returns Array of objects with headers as keys
 */
function parseCSV(csvText: string): ShelterRecord[] {
	const lines = csvText.split('\n').filter((line) => line.trim());
	if (lines.length === 0) return [];

	const headers = lines[0].split(',').map((header) => header.trim().replace(/^"|"$/g, ''));
	const data: ShelterRecord[] = [];

	for (let i = 1; i < lines.length; i++) {
		const values: string[] = [];
		let currentValue = '';
		let insideQuotes = false;

		// Parse CSV line handling quoted values with commas
		for (const char of lines[i]) {
			if (char === '"') {
				insideQuotes = !insideQuotes;
			} else if (char === ',' && !insideQuotes) {
				values.push(currentValue.trim().replace(/^"|"$/g, ''));
				currentValue = '';
			} else {
				currentValue += char;
			}
		}
		values.push(currentValue.trim().replace(/^"|"$/g, ''));

		if (values.length === headers.length) {
			const row: ShelterRecord = {};
			headers.forEach((header, index) => {
				row[header] = values[index];
			});
			data.push(row);
		}
	}

	return data;
}

/**
 * Fetch and convert Google Sheet to JSON
 */
async function fetchShelters(): Promise<void> {
	try {
		console.log('Fetching shelter data from Google Sheets...');
		const response = await fetch(SHEET_URL);

		if (!response.ok) {
			throw new Error(`Failed to fetch: ${response.status} ${response.statusText}`);
		}

		const csvText = await response.text();
		const jsonData = parseCSV(csvText);

		await writeFile(OUTPUT_PATH, JSON.stringify(jsonData, null, 2), 'utf-8');

		console.log(`✓ Successfully saved ${jsonData.length} shelter records to ${OUTPUT_PATH}`);
	} catch (error) {
		console.error('Error fetching shelter data:', error);
		process.exit(1);
	}
}

fetchShelters();
