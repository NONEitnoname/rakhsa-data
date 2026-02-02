# Wadi Hanifah Urban Code Regulations - Extracted Data

## Overview

This directory contains structured JSON files extracted from the official Wadi Hanifah Urban Code PDF documents published by the Royal Commission for Riyadh City (RCRC).

**Source:** https://hanifaurbancode.rcrc.gov.sa

**Extraction Date:** 2026-02-02

## Files

### Master Index
- `wadi_hanifah_regulations_master.json` - Master index with all zone types and common regulations
- `extracted_regulations.json` - Basic extraction summary

### Raw Extractions (Original PDF Text)
- `T3.1.json` - Large Villa Residential (38 pages)
- `T3.2.json` - Small-Medium Villa Residential (40 pages)
- `T4.1.json` - Urban District (101 pages)
- `T5.1.json` - Central District (40 pages)

### Enhanced Structured Data
- `T3.1_enhanced.json` - Large Villa Residential with structured regulations
- `T3.2_enhanced.json` - Small-Medium Villa Residential with structured regulations
- `T4.1_enhanced.json` - Urban District with structured regulations
- `T5.1_enhanced.json` - Central District with structured regulations

## Zone Types Summary

| Code | Name (English) | Name (Arabic) | Type |
|------|----------------|---------------|------|
| T3.1 | Large Villa Residential | سكني فلل كبير | Residential |
| T3.2 | Small-Medium Villa Residential | سكني فلل صغير-متوسط | Residential |
| T4.1 | Urban District | المقطع الحضري | Mixed-Use |
| T5.1 | Central District (with setbacks) | المقطع المركزي | Central/Commercial |

## Key Regulations Extracted

### Building Heights
- T3.1/T3.2: 2 floors + rooftop annex (max ~12m)
- T4.1: 3 floors + services (varies by use type)
- T5.1: 4-5 floors (max ~20m)

### Building Coverage
- T3.1: 60% maximum
- T3.2: 70% maximum
- T4.1: 70-75% (depends on development type)
- T5.1: 80% maximum

### Setbacks
- Front facade: Generally 0m with advanced facade requirements
- Rear: 0-8m depending on zone and floor
- Sides: 0-8m depending on zone and floor

### Parking Requirements
- T3.1: Minimum 2 spaces
- T3.2: 1 space (plots <= 550sqm), 2 spaces (plots > 550sqm)
- T4.1/T5.1: Similar to T3.2, plus basement parking for larger buildings

### Courtyard Requirements
- T3.1: Minimum 30sqm, 5m minimum side
- T3.2: Minimum 20sqm, 4m minimum side
- T4.1: Varies by development type (6-8% of plot)

## Extraction Methodology

### Tools Used
- **pdf-parse** (Node.js library) for text extraction
- Custom regex patterns for numerical value extraction
- Section categorization by keywords (Arabic and English)

### Process
1. PDF files loaded using pdf-parse library
2. Text extracted page by page
3. Sections identified using keyword matching
4. Numerical values extracted using regex patterns
5. Data structured into JSON format
6. Enhanced files created with manually verified values

### Limitations
1. **Table Extraction:** PDF tables may not extract perfectly in structured format
2. **Arabic Text:** Some Arabic characters may not render correctly
3. **Diagrams:** Visual content (diagrams, illustrations) not captured
4. **Updates:** Always verify with latest official documents

## Data Structure

### Raw Extraction Files (T3.1.json, etc.)
```json
{
  "document": "T3.1",
  "name_en": "Large Villa Residential",
  "name_ar": "سكني فلل كبير",
  "pdf_info": { "num_pages": 38 },
  "regulations": {
    "zone_code": "T3.1",
    "building_height": { ... },
    "setbacks": { ... },
    "parking": { ... }
  },
  "sections": {
    "zoning": [...],
    "building_requirements": [...],
    "height_regulations": [...]
  },
  "raw_text_sample": "..."
}
```

### Enhanced Files (T3.1_enhanced.json, etc.)
```json
{
  "document": "T3.1",
  "name_en": "Large Villa Residential",
  "name_ar": "سكني فلل كبير",
  "zone_classification": "Residential - Large Villas",
  "regulations": {
    "development_type": { ... },
    "plot_requirements": { ... },
    "building_height": { ... },
    "setbacks": { ... },
    "building_coverage": { ... },
    "courtyard_requirements": { ... },
    "parking": { ... },
    "fencing": { ... },
    "materials_restrictions": { ... }
  }
}
```

## Usage Notes

1. **For Compliance Checking:** Use the enhanced JSON files for structured data
2. **For Full Text Search:** Use the raw JSON files which contain extracted text sections
3. **For Quick Reference:** Use the master index file
4. **Units:** All dimensions in meters unless otherwise noted

## Common Prohibited Materials (All Zones)

- Reflective marble/granite
- Aluminum cladding
- Bright colored glass
- Unfinished cement blocks
- Sloped roofs with tiles
- Metal screens on fences
- Barbed wire or broken glass on walls

## Color Palette

All zones require natural/desert colors. Primary and bright colors are prohibited.

## Disclaimer

This data is extracted for reference purposes. Always verify regulations with the official RCRC documents before making planning or construction decisions.

**Official Source:** https://hanifaurbancode.rcrc.gov.sa
