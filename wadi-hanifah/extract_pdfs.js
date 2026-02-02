const fs = require('fs');
const path = require('path');
const { PDFParse } = require('pdf-parse');

// PDF files to process
const pdfFiles = [
  { code: 'T3.1', name_en: 'Large Villa Residential', name_ar: 'سكني فلل كبير' },
  { code: 'T3.2', name_en: 'Small-Medium Villa Residential', name_ar: 'سكني فلل صغير-متوسط' },
  { code: 'T4.1', name_en: 'Urban District', name_ar: 'المقطع الحضري' },
  { code: 'T5.1', name_en: 'Central District (with setbacks)', name_ar: 'المقطع المركزي' }
];

const pdfsDir = path.join(__dirname, 'pdfs');
const extractedDir = path.join(__dirname, 'extracted');

// Ensure extracted directory exists
if (!fs.existsSync(extractedDir)) {
  fs.mkdirSync(extractedDir, { recursive: true });
}

async function extractPdfText(filePath) {
  const dataBuffer = fs.readFileSync(filePath);
  const parser = new PDFParse({ data: dataBuffer });

  // Load the PDF
  await parser.load();

  // Get text and info
  const textResult = await parser.getText();
  const info = await parser.getInfo();

  // Handle text result - it returns an object with pages array
  let fullText = '';
  let numPages = 0;

  if (textResult && textResult.pages && Array.isArray(textResult.pages)) {
    numPages = textResult.pages.length;
    fullText = textResult.pages.map(p => p.text || '').join('\n\n');
  } else if (typeof textResult === 'string') {
    fullText = textResult;
  }

  return {
    text: fullText,
    numPages: numPages,
    info: info || {},
    pages: textResult?.pages || []
  };
}

// Function to parse regulations from text
function parseRegulations(text, code) {
  const regulations = {
    zone_code: code,
    building_height: {},
    setbacks: {},
    parking: {},
    far: {},
    building_coverage: {},
    land_use: {},
    plot_size: {},
    other_requirements: {}
  };

  // Common patterns to extract
  const patterns = {
    // Height patterns (meters)
    height_meters: /(?:maximum|max\.?|الارتفاع|ارتفاع)[^\d]*(\d+(?:\.\d+)?)\s*(?:m|meters?|متر)/gi,
    height_floors: /(?:floors?|stories?|storeys?|طوابق|أدوار)[^\d]*(\d+)/gi,

    // Setback patterns
    front_setback: /(?:front\s*setback|الارتداد الأمامي)[^\d]*(\d+(?:\.\d+)?)\s*(?:m|meters?|متر)?/gi,
    side_setback: /(?:side\s*setback|الارتداد الجانبي)[^\d]*(\d+(?:\.\d+)?)\s*(?:m|meters?|متر)?/gi,
    rear_setback: /(?:rear\s*setback|الارتداد الخلفي)[^\d]*(\d+(?:\.\d+)?)\s*(?:m|meters?|متر)?/gi,
    setback_generic: /(?:setback|ارتداد)[^\d]*(\d+(?:\.\d+)?)\s*(?:m|meters?|متر)?/gi,

    // FAR and coverage
    far_ratio: /(?:FAR|floor\s*area\s*ratio|نسبة\s*البناء)[^\d]*(\d+(?:\.\d+)?)/gi,
    coverage: /(?:coverage|building\s*coverage|نسبة\s*التغطية)[^\d]*(\d+(?:\.\d+)?)\s*%?/gi,

    // Parking
    parking: /(?:parking|مواقف)[^\d]*(\d+)\s*(?:spaces?|per|لكل)?/gi,

    // Plot/lot size
    min_plot: /(?:minimum\s*(?:plot|lot)\s*(?:size|area)|الحد الأدنى للمساحة)[^\d]*(\d+(?:,\d+)?)\s*(?:m2|sqm|م2)?/gi,
    max_plot: /(?:maximum\s*(?:plot|lot)\s*(?:size|area)|الحد الأقصى للمساحة)[^\d]*(\d+(?:,\d+)?)\s*(?:m2|sqm|م2)?/gi
  };

  // Extract values using patterns
  for (const [key, pattern] of Object.entries(patterns)) {
    const matches = [...text.matchAll(pattern)];
    if (matches.length > 0) {
      const values = matches.map(m => m[1]).filter(v => v);
      if (values.length > 0) {
        if (key.includes('height')) {
          regulations.building_height[key] = values;
        } else if (key.includes('setback')) {
          regulations.setbacks[key] = values;
        } else if (key.includes('far') || key.includes('coverage')) {
          regulations.far[key] = values;
        } else if (key.includes('parking')) {
          regulations.parking[key] = values;
        } else if (key.includes('plot')) {
          regulations.plot_size[key] = values;
        }
      }
    }
  }

  return regulations;
}

// Function to extract tables - looking for structured data
function extractStructuredData(text) {
  const lines = text.split('\n');
  const structuredData = [];

  // Look for patterns that indicate tabular data
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();

    // Skip empty lines
    if (!line) continue;

    // Look for lines with multiple numbers (likely table rows)
    const numbers = line.match(/\d+(?:\.\d+)?/g);
    if (numbers && numbers.length >= 2) {
      structuredData.push({
        line: i + 1,
        content: line,
        values: numbers
      });
    }
  }

  return structuredData;
}

// Function to extract specific sections
function extractSections(text) {
  const sections = {
    zoning: [],
    building_requirements: [],
    setback_regulations: [],
    height_regulations: [],
    parking_requirements: [],
    land_use: []
  };

  // Split into paragraphs
  const paragraphs = text.split(/\n{2,}/);

  const keywords = {
    zoning: ['zone', 'zoning', 'تصنيف', 'منطقة'],
    building_requirements: ['building', 'construction', 'بناء', 'إنشاء'],
    setback_regulations: ['setback', 'ارتداد'],
    height_regulations: ['height', 'floor', 'story', 'ارتفاع', 'طابق'],
    parking_requirements: ['parking', 'vehicle', 'موقف', 'سيارة'],
    land_use: ['use', 'residential', 'commercial', 'استخدام', 'سكني', 'تجاري']
  };

  for (const para of paragraphs) {
    const lowerPara = para.toLowerCase();
    for (const [section, words] of Object.entries(keywords)) {
      if (words.some(word => lowerPara.includes(word))) {
        sections[section].push(para.trim().substring(0, 500)); // First 500 chars
      }
    }
  }

  return sections;
}

async function processPdf(pdfInfo) {
  const filePath = path.join(pdfsDir, `${pdfInfo.code}.pdf`);

  if (!fs.existsSync(filePath)) {
    console.log(`File not found: ${filePath}`);
    return null;
  }

  console.log(`Processing ${pdfInfo.code}...`);

  try {
    const pdfData = await extractPdfText(filePath);

    const result = {
      document: pdfInfo.code,
      name_en: pdfInfo.name_en,
      name_ar: pdfInfo.name_ar,
      extraction_date: new Date().toISOString(),
      pdf_info: {
        num_pages: pdfData.numPages,
        title: pdfData.info?.Title || null,
        author: pdfData.info?.Author || null,
        creator: pdfData.info?.Creator || null
      },
      regulations: parseRegulations(pdfData.text, pdfInfo.code),
      sections: extractSections(pdfData.text),
      structured_data: extractStructuredData(pdfData.text),
      raw_text_sample: pdfData.text.substring(0, 5000), // First 5000 chars for reference
      raw_text_length: pdfData.text.length
    };

    // Save individual JSON file
    const outputPath = path.join(extractedDir, `${pdfInfo.code}.json`);
    fs.writeFileSync(outputPath, JSON.stringify(result, null, 2), 'utf8');
    console.log(`Saved: ${outputPath}`);

    return result;
  } catch (error) {
    console.error(`Error processing ${pdfInfo.code}:`, error.message);
    return {
      document: pdfInfo.code,
      name_en: pdfInfo.name_en,
      name_ar: pdfInfo.name_ar,
      error: error.message
    };
  }
}

async function main() {
  console.log('Starting PDF extraction...\n');

  const allResults = [];

  for (const pdfInfo of pdfFiles) {
    const result = await processPdf(pdfInfo);
    if (result) {
      allResults.push(result);
    }
  }

  // Create master index file
  const masterIndex = {
    collection_name: 'Wadi Hanifah Urban Code Regulations - Extracted',
    source_authority: 'Royal Commission for Riyadh City (RCRC)',
    extraction_date: new Date().toISOString(),
    total_documents: allResults.length,
    documents: allResults.map(r => ({
      code: r.document,
      name_en: r.name_en,
      name_ar: r.name_ar,
      file: `${r.document}.json`,
      num_pages: r.pdf_info?.num_pages || null,
      has_error: !!r.error
    })),
    extraction_notes: [
      'Text extracted using pdf-parse library',
      'Arabic text preserved where possible',
      'Numerical values extracted using regex patterns',
      'Some formatting may be lost during extraction'
    ]
  };

  const masterPath = path.join(extractedDir, 'extracted_regulations.json');
  fs.writeFileSync(masterPath, JSON.stringify(masterIndex, null, 2), 'utf8');
  console.log(`\nMaster index saved: ${masterPath}`);

  console.log('\nExtraction complete!');
}

main().catch(console.error);
