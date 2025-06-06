function getFlagEmoji(countryCode: string): string {
    return countryCode
        .toUpperCase()
        .split('')
        .map(char => String.fromCodePoint(char.charCodeAt(0) + 127397))
        .join('');
}

export const countries = [
    { value: "Argentina", label: "ar" },
    { value: "Australia", label: "au" },
    { value: "Bangladesh", label: "bd" },
    { value: "Brazil", label: "br" },
    { value: "Canada", label: "ca" },
    { value: "China", label: "cn" },
    { value: "Egypt", label: "eg" },
    { value: "Finland", label: "fi" },
    { value: "France", label: "fr" },
    { value: "Germany", label: "de" },
    { value: "Ghana", label: "gh" },
    { value: "India", label: "in" },
    { value: "Indonesia", label: "id" },
    { value: "Italy", label: "it" },
    { value: "Japan", label: "jp" },
    { value: "Kenya", label: "ke" },
    { value: "Mexico", label: "mx" },
    { value: "Netherlands", label: "nl" },
    { value: "Nigeria", label: "ng" },
    { value: "Pakistan", label: "pk" },
    { value: "Philippines", label: "ph" },
    { value: "Poland", label: "pl" },
    { value: "Russia", label: "ru" },
    { value: "Saudi Arabia", label: "sa" },
    { value: "Singapore", label: "sg" },
    { value: "South Africa", label: "za" },
    { value: "South Korea", label: "kr" },
    { value: "Spain", label: "es" },
    { value: "Sri Lanka", label: "lk" },
    { value: "Sweden", label: "se" },
    { value: "Turkey", label: "tr" },
    { value: "United Kingdom", label: "gb" },
    { value: "United States", label: "us" },
    { value: "Vietnam", label: "vn" },
].map(country => ({
    ...country,
    flag: getFlagEmoji(country.label),
}));

export const states = [
    { value: "Andhra Pradesh", label: "andhra_pradesh" },
    { value: "Arunachal Pradesh", label: "arunachal_pradesh" },
    { value: "Assam", label: "assam" },
    { value: "Bihar", label: "bihar" },
    { value: "Chhattisgarh", label: "chhattisgarh" },
    { value: "Goa", label: "goa" },
    { value: "Gujarat", label: "gujarat" },
    { value: "Haryana", label: "haryana" },
    { value: "Himachal Pradesh", label: "himachal_pradesh" },
    { value: "Jharkhand", label: "jharkhand" },
    { value: "Karnataka", label: "karnataka" },
    { value: "Kerala", label: "kerala" },
    { value: "Madhya Pradesh", label: "madhya_pradesh" },
    { value: "Maharashtra", label: "maharashtra" },
    { value: "Manipur", label: "manipur" },
    { value: "Meghalaya", label: "meghalaya" },
    { value: "Mizoram", label: "mizoram" },
    { value: "Nagaland", label: "nagaland" },
    { value: "Odisha", label: "odisha" },
    { value: "Punjab", label: "punjab" },
    { value: "Rajasthan", label: "rajasthan" },
    { value: "Sikkim", label: "sikkim" },
    { value: "Tamil Nadu", label: "tamil_nadu" },
    { value: "Telangana", label: "telangana" },
    { value: "Tripura", label: "tripura" },
    { value: "Uttar Pradesh", label: "uttar_pradesh" },
    { value: "Uttarakhand", label: "uttarakhand" },
    { value: "West Bengal", label: "west_bengal" },
];
export const departments = [
    { value: "Disaster Management Department", label: "disaster_management" },
    { value: "Electricity Board", label: "electricity_board" },
    { value: "Environment Protection Department", label: "environment_protection" },
    { value: "Fire Department", label: "fire_department" },
    { value: "Forest Department", label: "forest_department" },
    { value: "Municipal Electrical Department", label: "municipal_electrical" },
    { value: "Municipal Garden Department", label: "garden_department" },
    { value: "Pollution Control Board", label: "pollution_control" },
    { value: "Public Health Department", label: "public_health" },
    { value: "Public Works Department (PWD)", label: "pwd" },
    { value: "Sewage & Drainage Department", label: "sewage_drainage" },
    { value: "Solid Waste Management", label: "waste_management" },
    { value: "Town Planning Department", label: "town_planning" },
    { value: "Traffic Management Department", label: "traffic_management" },
    { value: "Urban Development Department", label: "urban_development" },
    { value: "Water Supply Department", label: "water_supply" },
];
export const departmentPosts = [
    {
        department: "disaster_management",
        posts: [
            { label: "field_officer", value: "Field Officer" },
            { label: "district_disaster_officer", value: "District Disaster Officer" },
            { label: "rescue_team_lead", value: "Rescue Team Lead" },
            { label: "relief_coordinator", value: "Relief Coordinator" }
        ]
    },
    {
        department: "electricity_board",
        posts: [
            { label: "lineman", value: "Lineman" },
            { label: "junior_engineer", value: "Junior Engineer" },
            { label: "assistant_engineer", value: "Assistant Engineer" },
            { label: "executive_engineer", value: "Executive Engineer" },
            { label: "chief_electrical_engineer", value: "Chief Electrical Engineer" }
        ]
    },
    {
        department: "environment_protection",
        posts: [
            { label: "environment_officer", value: "Environment Officer" },
            { label: "research_analyst", value: "Research Analyst" },
            { label: "field_inspector", value: "Field Inspector" },
            { label: "conservation_specialist", value: "Conservation Specialist" }
        ]
    },
    {
        department: "fire_department",
        posts: [
            { label: "fireman", value: "Fireman" },
            { label: "leading_fireman", value: "Leading Fireman" },
            { label: "sub_officer", value: "Sub Officer" },
            { label: "station_officer", value: "Station Officer" },
            { label: "divisional_officer", value: "Divisional Officer" },
            { label: "chief_fire_officer", value: "Chief Fire Officer" }
        ]
    },
    {
        department: "forest_department",
        posts: [
            { label: "forest_guard", value: "Forest Guard" },
            { label: "range_forest_officer", value: "Range Forest Officer" },
            { label: "deputy_conservator", value: "Deputy Conservator" },
            { label: "chief_conservator", value: "Chief Conservator" }
        ]
    },
    {
        department: "municipal_electrical",
        posts: [
            { label: "electrician", value: "Electrician" },
            { label: "je_electrical", value: "JE (Electrical)" },
            { label: "ae_electrical", value: "AE (Electrical)" },
            { label: "executive_engineer", value: "Executive Engineer" }
        ]
    },
    {
        department: "garden_department",
        posts: [
            { label: "gardener", value: "Gardener" },
            { label: "horticulture_supervisor", value: "Horticulture Supervisor" },
            { label: "assistant_horticulturist", value: "Assistant Horticulturist" },
            { label: "landscape_officer", value: "Landscape Officer" }
        ]
    },
    {
        department: "pollution_control",
        posts: [
            { label: "field_inspector", value: "Field Inspector" },
            { label: "environmental_engineer", value: "Environmental Engineer" },
            { label: "lab_technician", value: "Lab Technician" },
            { label: "regional_officer", value: "Regional Officer" }
        ]
    },
    {
        department: "public_health",
        posts: [
            { label: "health_inspector", value: "Health Inspector" },
            { label: "sanitary_officer", value: "Sanitary Officer" },
            { label: "medical_officer", value: "Medical Officer" },
            { label: "chief_health_officer", value: "Chief Health Officer" }
        ]
    },
    {
        department: "pwd",
        posts: [
            { label: "site_supervisor", value: "Site Supervisor" },
            { label: "junior_engineer", value: "Junior Engineer" },
            { label: "assistant_engineer", value: "Assistant Engineer" },
            { label: "executive_engineer", value: "Executive Engineer" },
            { label: "superintending_engineer", value: "Superintending Engineer" }
        ]
    },
    {
        department: "sewage_drainage",
        posts: [
            { label: "drainage_worker", value: "Drainage Worker" },
            { label: "pump_operator", value: "Pump Operator" },
            { label: "je_sewage", value: "JE (Sewage)" },
            { label: "ae_drainage", value: "AE (Drainage)" }
        ]
    },
    {
        department: "waste_management",
        posts: [
            { label: "sanitation_worker", value: "Sanitation Worker" },
            { label: "supervisor", value: "Supervisor" },
            { label: "sanitary_inspector", value: "Sanitary Inspector" },
            { label: "chief_sanitary_officer", value: "Chief Sanitary Officer" }
        ]
    },
    {
        department: "town_planning",
        posts: [
            { label: "town_planner", value: "Town Planner" },
            { label: "assistant_town_planner", value: "Assistant Town Planner" },
            { label: "planning_draftsman", value: "Planning Draftsman" },
            { label: "survey_officer", value: "Survey Officer" }
        ]
    },
    {
        department: "traffic_management",
        posts: [
            { label: "traffic_constable", value: "Traffic Constable" },
            { label: "traffic_inspector", value: "Traffic Inspector" },
            { label: "signal_controller", value: "Signal Controller" },
            { label: "zonal_traffic_officer", value: "Zonal Traffic Officer" }
        ]
    },
    {
        department: "urban_development",
        posts: [
            { label: "urban_planner", value: "Urban Planner" },
            { label: "infrastructure_engineer", value: "Infrastructure Engineer" },
            { label: "zonal_officer", value: "Zonal Officer" },
            { label: "development_officer", value: "Development Officer" }
        ]
    },
    {
        department: "water_supply",
        posts: [
            { label: "pump_operator", value: "Pump Operator" },
            { label: "plumber", value: "Plumber" },
            { label: "je_water_supply", value: "JE (Water Supply)" },
            { label: "ae_water_supply", value: "AE (Water Supply)" },
            { label: "executive_engineer", value: "Executive Engineer" }
        ]
    }
];
