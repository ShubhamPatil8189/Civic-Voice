# CSV Import Guide

## Quick Start

### 1. Prepare Your CSV File

Make sure your CSV has these columns:
- `scheme_name` - Name of the government scheme
- `slug` - URL-friendly identifier (optional, will be auto-generated)
- `details` - Detailed description of the scheme
- `benefits` - Benefits provided (comma-separated or JSON array)
- `eligibility` - Eligibility criteria (text or JSON object)
- `application` - Application process (text or JSON with steps)
- `documents` - Required documents (comma-separated or JSON array)
- `level` - "Central" or "State"
- `schemeCategory` - Category like "Pension", "Education", "Health", etc.

### 2. Import the CSV

```bash
cd Backend
node seeder/csvImporter.js --file=path/to/schemes.csv --clear
```

**Options:**
- `--file=PATH` - Path to your CSV file (required)
- `--clear` - Clear existing schemes before import
- `--test` - Test mode (doesn't actually insert, just parses)

**Example:**
```bash
# Windows
node seeder/csvImporter.js --file=D:\schemes\government_schemes.csv --clear

# Linux/Mac
node seeder/csvImporter.js --file=/home/user/schemes/government_schemes.csv --clear
```

### 3. Verify Import

After import, check your MongoDB:
```bash
mongosh civic_voice
db.schemes.countDocuments()  # Should show the number of imported schemes
db.schemes.findOne()  # View a sample scheme
```

## CSV Format Examples

### Simple Format (Text-based)

```csv
scheme_name,slug,details,benefits,eligibility,application,documents,level,schemeCategory
Pradhan Mantri Kisan Samman Nidhi,pm-kisan,Financial support for farmers,₹6000/year in 3 installments,Small and marginal farmers,Apply online at pmkisan.gov.in,Aadhaar card; Land ownership documents; Bank account details,Central,Agriculture
```

### Advanced Format (JSON-based)

```csv
scheme_name,details,benefits,eligibility,application,level,schemeCategory
PM-KISAN,"Support for farmers","[""₹6000 per year"", ""Direct benefit transfer""]","{""minAge"": 18, ""maxAge"": 100}","{""steps"": [{""stepNumber"": 1, ""stepTitle"": ""Visit official website""}]}",Central,Agriculture
```

## Field Parsing

The importer intelligently parses fields:

- **Arrays (benefits, documents)**: 
  - Comma-separated: `Doc1, Doc2, Doc3`
  - JSON array: `["Doc1", "Doc2", "Doc3"]`
  
- **Eligibility**:
  - Text: `"Age 18-60, BPL card holder"`
  - JSON: `{"minAge": 18, "maxAge": 60, "bplRequired": true}`

- **Application Process**:
  - Text with numbers: `"1. Visit website\n2. Fill form\n3. Submit"`
  - JSON: `{"steps": [{"stepNumber": 1, "stepTitle": "Visit website", ...}]}`

## Troubleshooting

### Import failed
- Check CSV file path is correct
- Ensure MongoDB is running
- Verify MONGO_URI in `.env` file

### Schemes not showing in app
- Restart backend server
- Clear browser cache
- Check scheme names match search queries

### LLM not using CSV data
- Verify schemes are in database: `db.schemes.countDocuments()`
- Check backend logs for errors
- Ensure geminiService is receiving full scheme objects
