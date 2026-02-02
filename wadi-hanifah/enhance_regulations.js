const fs = require('fs');
const path = require('path');

const extractedDir = path.join(__dirname, 'extracted');

// Define the structured regulations based on the actual PDF content analysis
const enhancedRegulations = {
  'T3.1': {
    document: 'T3.1',
    name_en: 'Large Villa Residential',
    name_ar: 'سكني فلل كبير',
    zone_classification: 'Residential - Large Villas',
    source: 'Wadi Hanifah Urban Code - RCRC',
    version: '4.0 (2025)',
    regulations: {
      development_type: {
        allowed: ['Villas (Single Residential Unit)'],
        prohibited: ['Multi-unit residential', 'Commercial', 'Subdivision of villa'],
        ar_description: 'يسمح بالفلل السكنية فقط كنمط تطوير'
      },
      plot_requirements: {
        minimum_area_sqm: 1000,
        minimum_width_m: 15,
        review_required_area_sqm: 5000,
        ar_description: 'الحد الأدنى لمساحة الأرض = ١٠٠٠ متر مربع'
      },
      building_height: {
        max_floors: 2,
        max_height_ground_floor_m: 4,
        max_height_first_floor_m: 4,
        max_height_annex_m: 4,
        max_building_height_from_sidewalk_m: 12,
        courtyard_level_above_sidewalk_m: 0.45,
        parapet_min_m: 0.2,
        parapet_max_m: 0.4,
        annex_parapet_height_m: 1.8,
        ar_description: 'دورين + ملحق علوي'
      },
      setbacks: {
        main_facade: {
          ground_floor: {
            advanced_facade_percent: 60,
            setback_m: 0
          },
          upper_floors: {
            setback_min_m: 0,
            setback_max_m: 8
          }
        },
        rear_facade: {
          ground_floor_m: 0,
          upper_floors_m: 8
        },
        left_side_facade: {
          ground_floor_m: 0,
          upper_floors_m: 8
        },
        right_side_facade: {
          ground_floor_m: 0,
          upper_floors_m: 8
        },
        ar_description: 'الارتدادات حسب نوع الواجهة'
      },
      building_coverage: {
        ground_floor_max_percent: 60,
        coverage_for_plots_under_2500_sqm_percent: 60,
        includes_ground_annexes: true,
        ar_description: 'نسبة تغطية الأرض ٦٠٪ كحد أقصى'
      },
      courtyard_requirements: {
        required: true,
        min_area_sqm: 30,
        min_side_length_m: 5,
        must_be_enclosed_by: 'three sides minimum (two from main building)',
        ar_description: 'يجب توفير فناء داخلي لكل وحدة سكنية'
      },
      parking: {
        min_spaces: 2,
        max_entrance_width_m: 3,
        max_facade_coverage_percent: 30,
        corner_lot_entrance_distance_m: 3,
        ar_description: 'يجب توفير موقفين داخل حد الملكية بحد أدنى'
      },
      fencing: {
        front_advanced_facade: {
          max_height_solid_m: 0.75,
          max_height_decorated_m: 1.5,
          column_max_width_m: 0.75,
          column_spacing_m: '1-5'
        },
        front_setback_facade: {
          max_height_solid_m: 2.2,
          max_height_decorated_m: 2.6
        },
        side_fences: {
          max_height_m: 2.2,
          must_be_within_property: true
        },
        ar_description: 'ضوابط الأسوار'
      },
      materials_restrictions: {
        prohibited: [
          'Reflective surfaces (marble, granite)',
          'Aluminum cladding',
          'Bright colored glass',
          'Unfinished cement blocks',
          'Sloped roofs',
          'Metal screens'
        ],
        glass_requirements: 'transparent or colors derived from approved palette',
        ar_description: 'المواد الممنوعة في واجهات المباني'
      },
      sidewalk_design: {
        width_by_street_width: {
          'less_than_15m': 1.2,
          '15-17m': 1.8,
          '18-20m': 2,
          'more_than_20m': 2.5
        },
        height_above_street_m: 0.15,
        ar_description: 'تصميم الأرصفة'
      }
    }
  },
  'T3.2': {
    document: 'T3.2',
    name_en: 'Small-Medium Villa Residential',
    name_ar: 'سكني فلل صغير-متوسط',
    zone_classification: 'Residential - Small/Medium Villas',
    source: 'Wadi Hanifah Urban Code - RCRC',
    version: '4.0 (2025)',
    regulations: {
      development_type: {
        allowed: ['Villas', 'Duplex (attached villas)'],
        prohibited: ['Multi-unit residential', 'Commercial'],
        ar_description: 'الفلل والفلل المتلاصقة (الدوبلكس)'
      },
      plot_requirements: {
        villa: {
          min_area_sqm: 300,
          max_area_sqm: 999,
          min_width_m: 12
        },
        duplex: {
          min_area_sqm: 400,
          max_area_sqm: 999,
          min_width_m: 10
        },
        ar_description: 'مساحة الأرض من ٣٠٠ إلى ٩٩٩ متر مربع'
      },
      building_height: {
        max_floors: '2 floors + 50% rooftop annex',
        max_height_ground_floor_m: 4,
        max_height_first_floor_m: 4,
        max_height_annex_m: 4,
        courtyard_level_above_sidewalk_m: 0.45,
        parapet_height_m: 1.8,
        ar_description: 'دورين + ٥٠٪ ملحق علوي'
      },
      setbacks: {
        main_facade: {
          ground_floor_advanced_percent: 60,
          ground_floor_setback: 0,
          upper_floors_min_m: 0,
          upper_floors_max_m: 8
        },
        secondary_facade: {
          min_setback_percent: 30,
          remaining_percent: 70,
          setback_range_m: '0-8'
        },
        rear_facade: {
          ground_floor_m: 0,
          upper_floors_m: 8
        },
        side_facades: {
          left_ground_m: 0,
          left_upper_m: 8,
          right_ground_m: 0,
          right_upper_m: 8
        },
        ar_description: 'ضوابط الارتداد'
      },
      building_coverage: {
        max_percent: 70,
        ar_description: 'نسبة تغطية الأرض ٧٠٪ كحد أقصى'
      },
      courtyard_requirements: {
        required: true,
        min_area_sqm: 20,
        min_side_length_m: 4,
        ar_description: 'يجب توفير فناء داخلي لكل وحدة سكنية'
      },
      parking: {
        for_plots_550sqm_or_less: 1,
        for_plots_over_550sqm: 2,
        max_entrance_width_m: 3,
        max_facade_coverage_percent: 30,
        ar_description: 'موقف واحد للفلل ٥٥٠م² أو أقل، موقفين للأكبر'
      },
      fencing: {
        front_advanced_facade: {
          max_height_m: 1.5,
          solid_max_height_m: 0.75
        },
        front_setback_facade: {
          solid_max_m: 2.2,
          decorated_max_m: 2.6
        },
        ar_description: 'ضوابط الأسوار'
      }
    }
  },
  'T4.1': {
    document: 'T4.1',
    name_en: 'Urban District',
    name_ar: 'المقطع الحضري',
    zone_classification: 'Urban Mixed-Use District',
    source: 'Wadi Hanifah Urban Code - RCRC',
    version: '2.3 (2024)',
    regulations: {
      development_types: {
        allowed: [
          'Residential Buildings (apartments)',
          'Mixed-Use Buildings (commercial ground floor + residential)',
          'Townhouses',
          'Subdivided Units',
          'Detached Villas'
        ],
        ar_description: 'أنماط التطوير: العمائر، الفلل المتلاصقة، الوحدات المفروزة، الفلل المنفصلة'
      },
      apartment_buildings: {
        max_floors: '3 floors + services rooftop',
        building_coverage_max_percent: 75,
        setbacks: {
          main_facade_advanced_percent: 60,
          main_facade_setback_m: 0,
          rear_setback_m: 3,
          side_setback_m: 0
        },
        courtyard: {
          min_area_sqm: 30,
          min_side_m: 5,
          or_external_space_min_sqm: 40
        },
        windows_min_percent_facade: 20,
        ar_description: 'العمائر السكنية والمختلطة'
      },
      townhouses: {
        max_floors: 3,
        building_coverage_max_percent: 70,
        courtyard: {
          min_area_percent: 6,
          min_side_m: 3
        },
        external_space: {
          min_area_percent: 8,
          min_side_m: 3
        },
        ar_description: 'الفلل المتلاصقة (التاون هاوس)'
      },
      subdivided_units: {
        max_floors: '3 floors + 10% rooftop services',
        building_coverage_max_percent: 75,
        setbacks: {
          main_facade_advanced_percent: 60,
          rear_min_m: 2,
          side_min_m: 2
        },
        ar_description: 'الوحدات المفروزة'
      },
      detached_villas: {
        max_floors: '2 floors + 50% rooftop',
        building_coverage_max_percent: 60,
        setbacks: {
          main_facade_m: 0,
          rear_m: 2,
          sides_m: 2
        },
        courtyard: {
          min_area_percent: 6,
          min_side_m: 5
        },
        ar_description: 'الفلل المنفصلة'
      },
      building_heights: {
        ground_floor_commercial_min_m: 3.25,
        ground_floor_residential_max_m: 4,
        upper_floors_max_m: 3,
        basement_max_above_sidewalk_m: 1.5,
        ar_description: 'ضوابط الارتفاعات'
      },
      parking: {
        for_550sqm_or_less: 1,
        for_over_550sqm: 2,
        max_entrance_percent_of_facade: 30,
        entrance_must_not_protrude_sidewalk: true,
        ar_description: 'مواقف السيارات'
      },
      commercial_uses: {
        ground_floor_allowed: [
          'Retail shops', 'Pharmacy', 'Cafes', 'Restaurants',
          'Personal services', 'Medical clinics'
        ],
        prohibited: [
          'Repair workshops', 'Car services', 'Industrial',
          'Large warehouses', 'Noisy activities'
        ],
        ar_description: 'الاستخدامات التجارية المسموحة'
      },
      fencing: {
        residential_facade: {
          setback_zone_max_m: 1.5,
          advanced_zone_max_m: 1
        },
        commercial_facade: 'No fences allowed in commercial areas',
        ar_description: 'ضوابط الأسوار'
      }
    }
  },
  'T5.1': {
    document: 'T5.1',
    name_en: 'Central District (with setbacks)',
    name_ar: 'المقطع المركزي (بالارتداد النظامي)',
    zone_classification: 'Central Mixed-Use District',
    source: 'Wadi Hanifah Urban Code - RCRC',
    version: '2.3 (2024)',
    regulations: {
      development_types: {
        allowed: [
          'Residential Buildings',
          'Mixed-Use Buildings',
          'Commercial Buildings',
          'Office Buildings'
        ],
        ar_description: 'المقطع المركزي - تطوير مختلط'
      },
      building_requirements: {
        max_floors: '4-5 floors depending on use',
        building_coverage_max_percent: 80,
        setbacks: {
          main_facade_advanced_percent: 70,
          setback_m: 0,
          rear_min_m: 3,
          side_min_m: 0
        },
        ar_description: 'اشتراطات البناء'
      },
      heights: {
        ground_floor_commercial_min_m: 4,
        upper_floors_m: 3.5,
        max_building_height_m: 20,
        ar_description: 'ضوابط الارتفاعات'
      },
      commercial_requirements: {
        ground_floor_mandatory_commercial_on_main_streets: true,
        min_facade_opening_percent: 30,
        shading_required: true,
        ar_description: 'اشتراطات المحلات التجارية'
      },
      parking: {
        basement_required_for_large_buildings: true,
        min_spaces_per_residential_unit: 1,
        min_spaces_per_100sqm_commercial: 2,
        ar_description: 'مواقف السيارات'
      },
      design_guidelines: {
        local_character: 'Must reflect Wadi Hanifah local architectural style',
        materials: 'Natural desert colors, no reflective surfaces',
        windows: 'Shaded on south/west facades',
        sustainability: 'Drought-resistant landscaping encouraged',
        ar_description: 'الموجهات التصميمية'
      }
    }
  }
};

// Update each JSON file with enhanced structured data
for (const [code, data] of Object.entries(enhancedRegulations)) {
  const filePath = path.join(extractedDir, `${code}.json`);

  if (fs.existsSync(filePath)) {
    // Read existing data
    const existing = JSON.parse(fs.readFileSync(filePath, 'utf8'));

    // Merge enhanced data with existing raw data
    const enhanced = {
      ...data,
      extraction_info: {
        extraction_date: existing.extraction_date,
        pdf_info: existing.pdf_info,
        raw_text_length: existing.raw_text_length
      },
      raw_sections: existing.sections,
      structured_data_raw: existing.structured_data?.slice(0, 50) // Keep first 50 for reference
    };

    // Write enhanced file
    const enhancedPath = path.join(extractedDir, `${code}_enhanced.json`);
    fs.writeFileSync(enhancedPath, JSON.stringify(enhanced, null, 2), 'utf8');
    console.log(`Enhanced: ${enhancedPath}`);
  }
}

// Create master regulations index
const masterRegulations = {
  collection_name: 'Wadi Hanifah Urban Code Regulations - Structured',
  source_authority: 'Royal Commission for Riyadh City (RCRC)',
  source_website: 'https://hanifaurbancode.rcrc.gov.sa',
  extraction_date: new Date().toISOString(),
  schema_version: '2.0.0',
  coverage_area: {
    name: 'Wadi Hanifah',
    name_ar: 'وادي حنيفة',
    region: 'Riyadh',
    country: 'Saudi Arabia'
  },
  zone_types: [
    {
      code: 'T3.1',
      name_en: 'Large Villa Residential',
      name_ar: 'سكني فلل كبير',
      type: 'Residential',
      file: 'T3.1_enhanced.json'
    },
    {
      code: 'T3.2',
      name_en: 'Small-Medium Villa Residential',
      name_ar: 'سكني فلل صغير-متوسط',
      type: 'Residential',
      file: 'T3.2_enhanced.json'
    },
    {
      code: 'T4.1',
      name_en: 'Urban District',
      name_ar: 'المقطع الحضري',
      type: 'Mixed-Use',
      file: 'T4.1_enhanced.json'
    },
    {
      code: 'T5.1',
      name_en: 'Central District (with setbacks)',
      name_ar: 'المقطع المركزي',
      type: 'Central/Commercial',
      file: 'T5.1_enhanced.json'
    }
  ],
  common_regulations: {
    prohibited_materials: [
      'Reflective marble/granite',
      'Aluminum cladding (Cladding)',
      'Bright colored glass',
      'Unfinished cement blocks',
      'Sloped roofs with tiles',
      'Metal screens on fences'
    ],
    color_palette: 'Natural/desert colors only - no bright or primary colors',
    sustainability: 'Drought-resistant landscaping recommended, minimize water usage',
    architectural_style: 'Must be compatible with local Wadi Hanifah character',
    accessibility: 'Sidewalk ramps required for pedestrians and disabled access'
  },
  extraction_notes: [
    'Regulations extracted from official RCRC PDF documents',
    'Arabic text preserved with English translations',
    'Numerical values verified against source documents',
    'Some values may require verification with latest official documents',
    'Values in meters (m) unless otherwise specified'
  ]
};

const masterPath = path.join(extractedDir, 'wadi_hanifah_regulations_master.json');
fs.writeFileSync(masterPath, JSON.stringify(masterRegulations, null, 2), 'utf8');
console.log(`\nMaster index: ${masterPath}`);

console.log('\nEnhancement complete!');
