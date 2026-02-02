# Rakhsa Data Catalog

This directory contains all data files for the Rakhsa platform, including zoning regulations, parcel data, and building rules for the Riyadh region.

## Directory Structure

```
data/
├── README.md                          # This file - Data catalog and access guide
├── wadi-hanifah/
│   ├── pdfs/                          # Original PDF files
│   ├── extracted_regulations.json     # Parsed regulations
│   └── metadata.json                  # Document metadata
├── rcrc/
│   ├── raw/                           # Raw API responses
│   ├── zones.geojson                  # Zone geometries
│   ├── parcels.geojson               # Parcel data (if available)
│   └── zone_mappings.json            # Category mappings
├── trc/
│   ├── regulations/                   # Scraped HTML/text
│   ├── building_rules.json           # Structured rules
│   ├── parking_standards.json        # Parking requirements
│   └── sources.json                  # Source documentation
└── deployment/
    ├── github_config.json            # GitHub repo settings
    ├── gdrive_config.json            # Google Drive settings
    └── access_methods.md             # How platform accesses data
```

## Data Sources

- **Wadi Hanifah**: https://hanifaurbancode.rcrc.gov.sa
- **RCRC Open Data**: https://opendata.rcrc.gov.sa
- **TRC Building Requirements**: https://trc.alriyadh.gov.sa

## Update Schedule

| Data Source | Update Frequency | Status |
|-------------|------------------|--------|
| Wadi Hanifah Regulations | Manual (on policy change) | ⏳ In Progress |
| RCRC Zones | Monthly | ⏳ In Progress |
| TRC Building Rules | Quarterly | ⏳ In Progress |

## Access Methods

See `deployment/access_methods.md` for detailed instructions on:
- GitHub (recommended for production)
- Google Drive (easy sharing)
- Local files (development)
