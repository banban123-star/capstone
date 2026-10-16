const shopConfig = {
    name: "MotoCare OS",
    address: "123 Example Street, City",
    phone: "+1 (555) 123-4567"
};

// --- Shared Motorcycle Brands Configuration ---
const MOTORCYCLE_BRANDS_CONFIG = [
    { id: 'yamaha', label: 'Yamaha', suggestedModels: ['Sniper'], defaultModel: 'Sniper' },
    { id: 'honda', label: 'Honda', suggestedModels: [] },
    { id: 'rusi', label: 'Rusi', suggestedModels: [] },
    { id: 'kawasaki', label: 'Kawasaki', suggestedModels: [] },
    { id: 'motoposh', label: 'Motoposh', suggestedModels: [] },
    { id: 'other', label: 'Other', isFreeText: true, suggestedModels: [] }
];

const DEFAULT_BRAND_ID = 'yamaha';

function getBrandLabel(vehicle) {
    if (!vehicle) return '';
    if (typeof vehicle === 'string') {
        const str = vehicle.trim();
        if (!str || str === 'undefined') return '';
        if (str.toLowerCase() === 'other') return 'Other';
        const matched = MOTORCYCLE_BRANDS_CONFIG.find(b => b.id === str.toLowerCase() || b.label.toLowerCase() === str.toLowerCase());
        return matched ? matched.label : str;
    }
    if (typeof vehicle === 'object') {
        if (vehicle.brandId && !MOTORCYCLE_BRANDS_CONFIG.some(b => b.id === vehicle.brandId)) {
            // Any saved vehicle with an unknown brandId becomes "other" with that old name kept as brandText
            const oldName = (vehicle.brandText && vehicle.brandText.trim()) || 
                            (vehicle.brand && vehicle.brand.trim()) || 
                            String(vehicle.brandId);
            vehicle.brandId = 'other';
            vehicle.brandText = (oldName && oldName !== 'undefined') ? oldName : '';
        } else if (!vehicle.brandId && vehicle.brand) {
            const matchedBrand = MOTORCYCLE_BRANDS_CONFIG.find(b => b.id === String(vehicle.brand).toLowerCase() || b.label.toLowerCase() === String(vehicle.brand).toLowerCase());
            if (matchedBrand) {
                vehicle.brandId = matchedBrand.id;
            } else {
                vehicle.brandId = 'other';
                vehicle.brandText = String(vehicle.brand) !== 'undefined' ? String(vehicle.brand) : '';
            }
        }
    }
    const bId = vehicle.brandId || '';
    if (bId === 'other') {
        if (vehicle.brandText && vehicle.brandText.trim() && vehicle.brandText.trim() !== 'undefined') {
            return vehicle.brandText.trim();
        }
        return 'Other';
    }
    const matched = MOTORCYCLE_BRANDS_CONFIG.find(b => b.id === bId);
    if (matched) return matched.label;
    if (vehicle.brandText && vehicle.brandText.trim() && vehicle.brandText.trim() !== 'undefined') return vehicle.brandText.trim();
    if (vehicle.brand && vehicle.brand.trim() && vehicle.brand.trim() !== 'undefined') return vehicle.brand.trim();
    return '';
}
window.getBrandLabel = getBrandLabel;
window.MOTORCYCLE_BRANDS_CONFIG = MOTORCYCLE_BRANDS_CONFIG;

const MOTORCYCLE_BRANDS = MOTORCYCLE_BRANDS_CONFIG.map(b => b.label);

// --- Mock Inventory Data for Diagnostics Autocomplete ---
const mockInventory = [
    // 1. Transmission & Drivetrain
    { id: '980187', sku: '980187', name: 'Chain (Global 428h/120l)', category: 'Transmission & Drivetrain', comp: 'Universal', price: 400, stock: 12, minStock: 5, reserved: 0, dtc: null, img: 'https://placehold.co/48x48/eff6ff/1d4ed8?text=Chn' },
    { id: '330124', sku: '330124', name: 'Chain (Krx 428h/130l)', category: 'Transmission & Drivetrain', comp: 'Universal', price: 450, stock: 8, minStock: 5, reserved: 0, dtc: null, img: 'https://placehold.co/48x48/eff6ff/1d4ed8?text=Chn' },
    { id: '120707', sku: '120707', name: 'Sprocket (TRQ 14t)', category: 'Transmission & Drivetrain', comp: 'Universal', price: 200, stock: 15, minStock: 5, reserved: 0, dtc: null, img: 'https://placehold.co/48x48/eff6ff/1d4ed8?text=Spr' },
    { id: '120701', sku: '120701', name: 'Sprocket (TRQ 38t)', category: 'Transmission & Drivetrain', comp: 'Universal', price: 350, stock: 4, minStock: 5, reserved: 0, dtc: null, img: 'https://placehold.co/48x48/eff6ff/1d4ed8?text=Spr' },
    { id: '120708', sku: '120708', name: 'Sprocket (TRQ 42t)', category: 'Transmission & Drivetrain', comp: 'Universal', price: 400, stock: 0, minStock: 5, reserved: 0, dtc: null, img: 'https://placehold.co/48x48/eff6ff/1d4ed8?text=Spr' },

    // 2. Electrical & Electronics
    { id: '170010', sku: '170010', name: 'Battery (Spypower 12n5l)', category: 'Electrical & Electronics', comp: 'Universal 12V', price: 900, stock: 5, minStock: 3, reserved: 0, dtc: 'P0560, P0562, P0563', linkedDTCs: ['P0560', 'P0562', 'P0563'], dtcPartName: 'Motorcycle Battery (12V)', img: 'https://placehold.co/48x48/eff6ff/1d4ed8?text=Bat' },
    { id: 'SNP-001', sku: 'SNP-001', name: 'Throttle Position Sensor (TPS)', category: 'Electrical & Electronics', comp: 'Yamaha Sniper 150', price: 750, stock: 8, minStock: 3, reserved: 0, dtc: 'P0120, P0122, P0123', linkedDTCs: ['P0120', 'P0122', 'P0123'], dtcPartName: 'Throttle Position Sensor (TPS)', img: 'https://placehold.co/48x48/eff6ff/1d4ed8?text=TPS' },
    { id: 'SNP-002', sku: 'SNP-002', name: 'Manifold Absolute Pressure (MAP) Sensor', category: 'Electrical & Electronics', comp: 'Yamaha Sniper 150', price: 680, stock: 6, minStock: 3, reserved: 0, dtc: 'P0105, P0107, P0108', linkedDTCs: ['P0105', 'P0107', 'P0108'], dtcPartName: 'Manifold Absolute Pressure (MAP) Sensor', img: 'https://placehold.co/48x48/eff6ff/1d4ed8?text=MAP' },
    { id: 'SNP-003', sku: 'SNP-003', name: 'Side Stand Switch', category: 'Electrical & Electronics', comp: 'Yamaha Sniper 150', price: 320, stock: 0, minStock: 3, reserved: 0, dtc: 'P1601, P1901', linkedDTCs: ['P1601', 'P1901'], dtcPartName: 'Side Stand Switch', img: 'https://placehold.co/48x48/eff6ff/1d4ed8?text=Swch' },
    { id: 'SNP-004', sku: 'SNP-004', name: 'Intake Air Temperature (IAT) Sensor', category: 'Electrical & Electronics', comp: 'Yamaha Sniper 150', price: 450, stock: 7, minStock: 3, reserved: 0, dtc: 'P0110, P0112, P0113', linkedDTCs: ['P0110', 'P0112', 'P0113'], dtcPartName: 'Intake Air Temperature (IAT) Sensor', img: 'https://placehold.co/48x48/eff6ff/1d4ed8?text=IAT' },
    { id: 'SNP-005', sku: 'SNP-005', name: 'Oxygen (O2) Sensor', category: 'Electrical & Electronics', comp: 'Yamaha Sniper 150', price: 850, stock: 2, minStock: 3, reserved: 0, dtc: 'P0130, P0131, P0132', linkedDTCs: ['P0130', 'P0131', 'P0132'], dtcPartName: 'Oxygen (O2) Sensor', img: 'https://placehold.co/48x48/eff6ff/1d4ed8?text=O2' },
    { id: 'SNP-006', sku: 'SNP-006', name: 'Lean Angle Sensor (Bank Angle Sensor)', category: 'Electrical & Electronics', comp: 'Yamaha Sniper 150', price: 620, stock: 5, minStock: 2, reserved: 0, dtc: 'P1500, P1999', linkedDTCs: ['P1500', 'P1999'], dtcPartName: 'Lean Angle Sensor (Bank Angle Sensor)', img: 'https://placehold.co/48x48/eff6ff/1d4ed8?text=BAS' },
    { id: 'SNP-007', sku: 'SNP-007', name: 'Speedometer Cable / Speed Sensor', category: 'Electrical & Electronics', comp: 'Yamaha Sniper 150', price: 280, stock: 9, minStock: 3, reserved: 0, dtc: 'P0500', linkedDTCs: ['P0500'], dtcPartName: 'Speedometer Cable / Speed Sensor', img: 'https://placehold.co/48x48/eff6ff/1d4ed8?text=Spd' },
    { id: 'SNP-008', sku: 'SNP-008', name: 'Stator Assembly', category: 'Electrical & Electronics', comp: 'Yamaha Sniper 150', price: 1650, stock: 4, minStock: 2, reserved: 0, dtc: 'P0335, P0336', linkedDTCs: ['P0335', 'P0336'], dtcPartName: 'Stator Assembly', img: 'https://placehold.co/48x48/eff6ff/1d4ed8?text=Stat' },
    { id: 'SNP-009', sku: 'SNP-009', name: 'Engine Coolant Temperature (ECT) Sensor', category: 'Electrical & Electronics', comp: 'Yamaha Sniper 150', price: 850, stock: 2, minStock: 3, reserved: 0, dtc: 'P0115, P0117, P0118', linkedDTCs: ['P0115', 'P0117', 'P0118'], dtcPartName: 'Engine Coolant Temperature (ECT) Sensor', img: 'https://placehold.co/48x48/eff6ff/1d4ed8?text=ECT' },
    { id: 'SNP-010', sku: 'SNP-010', name: 'Yamaha Ignition Coil', category: 'Electrical & Electronics', comp: 'Yamaha Sniper 150', price: 550, stock: 6, minStock: 2, reserved: 0, dtc: 'P0351', linkedDTCs: ['P0351'], dtcPartName: 'Yamaha Ignition Coil', img: 'https://placehold.co/48x48/eff6ff/1d4ed8?text=Coil' },
    { id: 'SNP-011', sku: 'SNP-011', name: 'Yamaha Regulator Rectifier', category: 'Electrical & Electronics', comp: 'Yamaha Sniper 150', price: 650, stock: 5, minStock: 2, reserved: 0, dtc: 'P0560, P0562, P0563', linkedDTCs: ['P0560', 'P0562', 'P0563'], dtcPartName: 'Yamaha Regulator Rectifier', img: 'https://placehold.co/48x48/eff6ff/1d4ed8?text=Reg' },
    { id: '212028', sku: '212028', name: 'Ignition Switch (TTGR TMX supremo)', category: 'Electrical & Electronics', comp: 'TMX Supremo', price: 250, stock: 10, minStock: 5, reserved: 0, dtc: null, img: 'https://placehold.co/48x48/eff6ff/1d4ed8?text=Ign' },
    { id: '211637', sku: '211637', name: 'Starter Relay (TTGR gy6)', category: 'Electrical & Electronics', comp: 'GY6', price: 150, stock: 20, minStock: 5, reserved: 0, dtc: null, img: 'https://placehold.co/48x48/eff6ff/1d4ed8?text=Rel' },
    { id: '210844', sku: '210844', name: 'Regulator (TTGR 5wire green white)', category: 'Electrical & Electronics', comp: 'Universal 5-wire', price: 300, stock: 3, minStock: 5, reserved: 0, dtc: null, img: 'https://placehold.co/48x48/eff6ff/1d4ed8?text=Reg' },
    { id: '330601', sku: '330601', name: 'Ignition Switch (Leitakitaca tmx155)', category: 'Electrical & Electronics', comp: 'TMX 155', price: 220, stock: 0, minStock: 5, reserved: 0, dtc: null, img: 'https://placehold.co/48x48/eff6ff/1d4ed8?text=Ign' },

    // 3. Fuel & Engine Intake
    { id: 'SNP-012', sku: 'SNP-012', name: 'Fuel Injector', category: 'Fuel & Engine Intake', comp: 'Yamaha Sniper 150', price: 1100, stock: 8, minStock: 3, reserved: 0, dtc: 'P0201', linkedDTCs: ['P0201'], dtcPartName: 'Fuel Injector', img: 'https://placehold.co/48x48/eff6ff/1d4ed8?text=Inj' },
    { id: 'SNP-013', sku: 'SNP-013', name: 'Fuel Injector Coupler', category: 'Fuel & Engine Intake', comp: 'Yamaha Sniper 150', price: 180, stock: 12, minStock: 4, reserved: 0, dtc: 'P0201', linkedDTCs: ['P0201'], dtcPartName: 'Fuel Injector Coupler', img: 'https://placehold.co/48x48/eff6ff/1d4ed8?text=Cplr' },
    { id: 'SNP-014', sku: 'SNP-014', name: 'Spark Plug', category: 'Fuel & Engine Intake', comp: 'Yamaha Sniper 150 / Universal', price: 150, stock: 15, minStock: 5, reserved: 0, dtc: 'P0351', linkedDTCs: ['P0351'], dtcPartName: 'Spark Plug', img: 'https://placehold.co/48x48/eff6ff/1d4ed8?text=Plg' },
    { id: '211700', sku: '211700', name: 'Carburetor (Keihin xr200)', category: 'Fuel & Engine Intake', comp: 'XR200', price: 1200, stock: 2, minStock: 3, reserved: 0, dtc: null, img: 'https://placehold.co/48x48/eff6ff/1d4ed8?text=Carb' },
    { id: '121060', sku: '121060', name: 'Carburetor (Keihin tmx 155)', category: 'Fuel & Engine Intake', comp: 'TMX 155', price: 950, stock: 4, minStock: 3, reserved: 0, dtc: null, img: 'https://placehold.co/48x48/eff6ff/1d4ed8?text=Carb' },
    { id: '212031', sku: '212031', name: 'Carburetor (Keihin tmx 125)', category: 'Fuel & Engine Intake', comp: 'TMX 125', price: 900, stock: 6, minStock: 3, reserved: 0, dtc: null, img: 'https://placehold.co/48x48/eff6ff/1d4ed8?text=Carb' },
    { id: '330161', sku: '330161', name: 'Carburetor (Keihin 28mm/26mm)', category: 'Fuel & Engine Intake', comp: 'Universal 28mm/26mm', price: 1100, stock: 3, minStock: 3, reserved: 0, dtc: null, img: 'https://placehold.co/48x48/eff6ff/1d4ed8?text=Carb' },
    { id: '981057', sku: '981057', name: 'Fuel Tank Cap (Crossspoo tmx)', category: 'Fuel & Engine Intake', comp: 'TMX', price: 150, stock: 12, minStock: 5, reserved: 0, dtc: null, img: 'https://placehold.co/48x48/eff6ff/1d4ed8?text=Cap' },

    // 4. Wheels & Tires
    { id: '330027', sku: '330027', name: 'Tube Tire (Krx 2.25x17)', category: 'Wheels & Tires', comp: 'Universal 17"', price: 450, stock: 8, minStock: 5, reserved: 0, dtc: null, img: 'https://placehold.co/48x48/eff6ff/1d4ed8?text=Tire' },
    { id: '330025', sku: '330025', name: 'Tube Tire (Krx 2.50x17)', category: 'Wheels & Tires', comp: 'Universal 17"', price: 500, stock: 10, minStock: 5, reserved: 0, dtc: null, img: 'https://placehold.co/48x48/eff6ff/1d4ed8?text=Tire' },
    { id: '330313', sku: '330313', name: 'Tube Tire (Krx 410x18)', category: 'Wheels & Tires', comp: 'Universal 18"', price: 800, stock: 4, minStock: 5, reserved: 0, dtc: null, img: 'https://placehold.co/48x48/eff6ff/1d4ed8?text=Tire' },
    { id: '122027', sku: '122027', name: 'Tire (Beast flash 120/70/17)', category: 'Wheels & Tires', comp: 'Universal 17"', price: 1800, stock: 0, minStock: 2, reserved: 0, dtc: null, img: 'https://placehold.co/48x48/eff6ff/1d4ed8?text=Tire' },
    { id: 'PROTO-T01', sku: 'PROTO-T01', name: 'Tire (Fuji 300x17)', category: 'Wheels & Tires', comp: 'Universal 17"', price: 950, stock: 0, minStock: 2, reserved: 0, dtc: null, img: 'https://placehold.co/48x48/eff6ff/1d4ed8?text=Tire' },

    // 5. Suspension, Brakes & Cooling
    { id: 'SNP-015', sku: 'SNP-015', name: 'Cooling Fan', category: 'Suspension, Brakes & Cooling', comp: 'Yamaha Sniper 150', price: 950, stock: 5, minStock: 2, reserved: 0, dtc: 'P0115, P0117, P0118', linkedDTCs: ['P0115', 'P0117', 'P0118'], dtcPartName: 'Cooling Fan', img: 'https://placehold.co/48x48/eff6ff/1d4ed8?text=Fan' },
    { id: '950569', sku: '950569', name: 'Pivot Bushing (Otaka tmx155)', category: 'Suspension, Brakes & Cooling', comp: 'TMX 155', price: 120, stock: 15, minStock: 5, reserved: 0, dtc: null, img: 'https://placehold.co/48x48/eff6ff/1d4ed8?text=Bush' },
    { id: '060110', sku: '060110', name: 'Steel Bushing (tmx155 transparent packaging)', category: 'Suspension, Brakes & Cooling', comp: 'TMX 155', price: 150, stock: 20, minStock: 5, reserved: 0, dtc: null, img: 'https://placehold.co/48x48/eff6ff/1d4ed8?text=Bush' },
    { id: 'PROTO-B01', sku: 'PROTO-B01', name: 'Front Disc Brake Pads', category: 'Suspension, Brakes & Cooling', comp: 'Universal Disc', price: 250, stock: 2, minStock: 5, reserved: 0, dtc: null, img: 'https://placehold.co/48x48/eff6ff/1d4ed8?text=Pad' },
    { id: 'PROTO-S01', sku: 'PROTO-S01', name: 'Front Fork Seals', category: 'Suspension, Brakes & Cooling', comp: 'Universal', price: 180, stock: 0, minStock: 4, reserved: 0, dtc: null, img: 'https://placehold.co/48x48/eff6ff/1d4ed8?text=Seal' },

    // 6. Accessories, Add-Ons & Consumables
    { id: '022278', sku: '022278', name: 'Mini Driving Light (MRM-4596 v1)', category: 'Accessories, Add-Ons & Consumables', comp: 'Universal', price: 650, stock: 8, minStock: 5, reserved: 0, dtc: null, img: 'https://placehold.co/48x48/eff6ff/1d4ed8?text=Lite' },
    { id: '021568', sku: '021568', name: 'Mini Driving Light (MRM-4502 v6)', category: 'Accessories, Add-Ons & Consumables', comp: 'Universal', price: 850, stock: 12, minStock: 5, reserved: 0, dtc: null, img: 'https://placehold.co/48x48/eff6ff/1d4ed8?text=Lite' },
    { id: '980048', sku: '980048', name: 'Snail Horn (Global)', category: 'Accessories, Add-Ons & Consumables', comp: 'Universal', price: 250, stock: 0, minStock: 5, reserved: 0, dtc: null, img: 'https://placehold.co/48x48/eff6ff/1d4ed8?text=Horn' },
    { id: '021718', sku: '021718', name: 'Side Mirror (MRM domino)', category: 'Accessories, Add-Ons & Consumables', comp: 'Universal', price: 350, stock: 4, minStock: 5, reserved: 0, dtc: null, img: 'https://placehold.co/48x48/eff6ff/1d4ed8?text=Mirr' },
];
window.mockInventory = mockInventory;

// --- Mock Customer Data ---
const mockCustomers = [
    { 
        id: 'c1', 
        name: 'Juan Dela Cruz', 
        phone: '09171234567', 
        email: 'juan.delacruz@email.com', 
        lastVisit: '2023-10-15',
        totalVisits: 4,
        motorcycles: [
            { brandId: 'yamaha', brandText: '', brand: 'Yamaha', model: 'Sniper', plate: 'ABC 123' },
            { brandId: 'rusi', brandText: '', brand: 'Rusi', model: 'Model TBC', plate: 'XYZ 987' }
        ]
    },
    { 
        id: 'c2', 
        name: 'Maria Santos', 
        phone: '09181112222', 
        email: 'maria.santos@email.com', 
        lastVisit: '2023-10-10',
        totalVisits: 2,
        motorcycles: [
            { brandId: 'yamaha', brandText: '', brand: 'Yamaha', model: 'Sniper', plate: 'DEF 456' }
        ]
    },
    { 
        id: 'c3', 
        name: 'Jose Rizal', 
        phone: '09192223333', 
        email: '', 
        lastVisit: '2023-09-05',
        totalVisits: 1,
        motorcycles: [
            { brandId: 'honda', brandText: '', brand: 'Honda', model: 'Model TBC', plate: 'HON 555' }
        ]
    },
    { 
        id: 'c4', 
        name: 'Andres Bonifacio', 
        phone: '09203334444', 
        email: 'andres.b@email.com', 
        lastVisit: '2023-08-20',
        totalVisits: 5,
        motorcycles: [
            { brandId: 'yamaha', brandText: '', brand: 'Yamaha', model: 'Sniper', plate: 'JKL 012' }
        ]
    },
    { 
        id: 'c5', 
        name: 'Gabriela Silang', 
        phone: '09214445555', 
        email: 'gsilang@email.com', 
        lastVisit: '2023-10-01',
        totalVisits: 3,
        motorcycles: [
            { brandId: 'other', brandText: '', brand: 'Other', model: 'Model TBC', plate: 'QRS 445' }
        ]
    },
    { 
        id: 'c6', 
        name: 'Antonio Luna', 
        phone: '09225556666', 
        email: '', 
        lastVisit: '2023-07-15',
        totalVisits: 1,
        motorcycles: [
            { brandId: 'rusi', brandText: '', brand: 'Rusi', model: 'Model TBC', plate: 'PQR 678' }
        ]
    },
    { 
        id: 'c7', 
        name: 'Apolinario Mabini', 
        phone: '09236667777', 
        email: 'amabini@email.com', 
        lastVisit: '2023-09-25',
        totalVisits: 6,
        motorcycles: [
            { brandId: 'kawasaki', brandText: '', brand: 'Kawasaki', model: 'Model TBC', plate: 'KAW 666' }
        ]
    },
    { 
        id: 'c8', 
        name: 'Emilio Aguinaldo', 
        phone: '09247778888', 
        email: 'emilio@email.com', 
        lastVisit: '2023-08-10',
        totalVisits: 2,
        motorcycles: [
            { brandId: 'motoposh', brandText: '', brand: 'Motoposh', model: 'Model TBC', plate: 'MOT 777' }
        ]
    }
];

document.addEventListener('change', function(e) {
    // 1. Walk-in Motorcycle Selector Logic
    if (e.target.id === 'motorcycle-select') {
        const walkinFields = document.getElementById('walkin-fields');
        if (walkinFields) {
            if (e.target.value === 'walkin') {
                walkinFields.classList.remove('hidden');
            } else {
                walkinFields.classList.add('hidden');
            }
        }
    }
});

document.addEventListener('input', function(e) {
    // 1. Customer Autocomplete Search Logic
    if (e.target.id === 'cust-search-input') {
        const query = e.target.value.toLowerCase();
        const dropdown = document.getElementById('cust-autocomplete-dropdown');
        
        if (!query) {
            dropdown.classList.add('hidden');
            return;
        }
        
        const matches = mockCustomers.filter(c => 
            c.name.toLowerCase().includes(query) || 
            c.phone.toLowerCase().includes(query)
        ).slice(0, 5); // show up to 5 results
        
        if (matches.length > 0) {
            dropdown.innerHTML = matches.map(c => {
                const motoText = c.motorcycles && c.motorcycles.length > 0 
                    ? `${getBrandLabel(c.motorcycles[0])} ${c.motorcycles[0].model || ''}`.trim()
                    : 'No motorcycle registered';
                return `
                <div class="p-3 border-b border-slate-100 hover:bg-slate-50 cursor-pointer cust-autocomplete-item" data-id="${c.id}">
                    <div class="flex justify-between items-start">
                        <div>
                            <div class="text-sm font-bold text-slate-800">${c.name}</div>
                            <div class="text-xs text-slate-500">${c.phone}</div>
                            <div class="text-[10px] text-slate-400 mt-1">${motoText}</div>
                        </div>
                    </div>
                </div>
            `}).join('');
            dropdown.classList.remove('hidden');
        } else {
            dropdown.innerHTML = `<div class="p-3 text-sm text-slate-500 text-center">No customer found. Fill in the details below to register a new one.</div>`;
            dropdown.classList.remove('hidden');
        }
    }

    // 2. Parts Autocomplete Search Logic
    if (e.target.id === 'part-search-input') {
        const query = e.target.value.toLowerCase();
        const dropdown = document.getElementById('part-autocomplete-dropdown');
        
        if (!query) {
            dropdown.classList.add('hidden');
            return;
        }
        
        const matches = mockInventory.filter(p => p.name.toLowerCase().includes(query) || p.sku.toLowerCase().includes(query));
        
        if (matches.length > 0) {
            dropdown.innerHTML = matches.map(part => {
    let expText = '';
    if (typeof getExpiryStatus === 'function' && getExpiryStatus(part).status === 'expired') {
        expText = '<span class="text-red-600 text-[10px] font-bold ml-1.5">Expired</span>';
    }
    return `
                <div class="p-3 border-b border-slate-100 hover:bg-slate-50 cursor-pointer flex justify-between items-center autocomplete-item" data-id="${part.id}">
                    <div>
                        <div class="text-sm font-bold text-slate-800">${part.name}${expText}</div>
                        <div class="text-[10px] text-slate-500">SKU: ${part.sku}</div>
                    </div>
                    <div class="text-right">
                        <div class="text-sm font-bold text-blue-600">\u20B1${part.price.toFixed(2)}</div>
                        <div class="text-[10px] font-semibold ${part.stock > 0 ? 'text-emerald-600' : 'text-red-500'}">Stock: ${part.stock}</div>
                    </div>
                </div>
            `;
}).join('');
            dropdown.classList.remove('hidden');
        } else {
            dropdown.innerHTML = `<div class="p-3 text-sm text-slate-500 text-center">No parts found matching "${query}"</div>`;
            dropdown.classList.remove('hidden');
        }
    }
    
    // Update plan totals when typing in Final Findings or Labor Cost
    if (e.target.id === 'final-findings' || e.target.id === 'labor-cost-input') {
        if (typeof updatePlanTotals === 'function') {
            updatePlanTotals();
        }
    }
});

document.addEventListener('click', function(e) {
    // 2. Select Customer from Autocomplete
    const custAutocompleteItem = e.target.closest('.cust-autocomplete-item');
    if (custAutocompleteItem) {
        const custId = custAutocompleteItem.getAttribute('data-id');
        const customer = mockCustomers.find(c => c.id === custId);
        if (customer) {
            document.getElementById('cust-name').value = customer.name || '';
            document.getElementById('cust-phone').value = customer.phone || '';
            document.getElementById('cust-email').value = customer.email || '';
            
            document.getElementById('cust-search-input').value = '';
            document.getElementById('cust-autocomplete-dropdown').classList.add('hidden');
            
            inspectionState.customer.name = customer.name || '';
            inspectionState.customer.phone = customer.phone || '';
            inspectionState.customer.email = customer.email || '';
            inspectionState.customer.selectedCustomerId = customer.id;
            
            if (customer.motorcycles && customer.motorcycles.length > 0) {
                const m = customer.motorcycles[0];
                if (!inspectionState.vehicle.plate || inspectionState.vehicle.mode === 'walk-in') {
                    inspectionState.vehicle.mode = 'identified';
                    inspectionState.vehicle.brandId = m.brandId || 'yamaha';
                    inspectionState.vehicle.brandText = m.brandText || '';
                    inspectionState.vehicle.brand = getBrandLabel(m);
                    inspectionState.vehicle.model = m.model || '';
                    inspectionState.vehicle.plate = m.plate || '';
                    if (typeof restoreMotorcycleCard === 'function') restoreMotorcycleCard();
                }
            }
            
            saveInspectionState();
            if (typeof restoreCustomerCard === 'function') restoreCustomerCard();
            if (typeof updateStep3Summaries === 'function') updateStep3Summaries();
        }
    }

    // 2.5 Clear Selected Customer
    const btnClearCust = e.target.closest('#btn-clear-customer');
    if (btnClearCust) {
        document.getElementById('cust-name').value = '';
        document.getElementById('cust-phone').value = '';
        document.getElementById('cust-email').value = '';
        
        inspectionState.customer.name = '';
        inspectionState.customer.phone = '';
        inspectionState.customer.email = '';
        inspectionState.customer.selectedCustomerId = null;
        
        const badge = document.getElementById('cust-selected-badge');
        if (badge) {
            badge.classList.add('hidden');
            badge.classList.remove('flex');
        }
        
        saveInspectionState();
        if (typeof updateStep3Summaries === 'function') updateStep3Summaries();
    }

    // 3. Select Item from Autocomplete
    const autocompleteItem = e.target.closest('.autocomplete-item');
    if (autocompleteItem) {
        const partId = autocompleteItem.getAttribute('data-id');
        const part = mockInventory.find(p => p.id === partId);
        
        if (part) {
            document.getElementById('part-search-input').value = '';
            document.getElementById('part-autocomplete-dropdown').classList.add('hidden');
            if (typeof openManualPartForm === 'function') {
                openManualPartForm(part);
            }
        }
    }

    // 4. Chip Controls (Minus, Plus, Remove)
    const btnMinus = e.target.closest('.btn-qty-minus');
    if (btnMinus) {
        const valSpan = btnMinus.nextElementSibling;
        let qty = parseInt(valSpan.textContent);
        if (qty > 1) {
            valSpan.textContent = qty - 1;
            if (typeof updatePlanTotals === 'function') updatePlanTotals();
        }
    }

    const btnPlus = e.target.closest('.btn-qty-plus');
    if (btnPlus) {
        const valSpan = btnPlus.previousElementSibling;
        let qty = parseInt(valSpan.textContent);
        let max = parseInt(btnPlus.getAttribute('data-max'));
        if (qty < max) {
            valSpan.textContent = qty + 1;
            if (typeof updatePlanTotals === 'function') updatePlanTotals();
        } else {
            alert(`Only ${max} units available in stock.`);
        }
    }

    const btnRemove = e.target.closest('.btn-remove-part');
    if (btnRemove) {
        btnRemove.closest('div[id^="selected-part-"]').remove();
        if (typeof updatePlanTotals === 'function') updatePlanTotals();
    }
    
    // 5. Hide Autocomplete Dropdowns when clicking outside
    if (!e.target.closest('#part-autocomplete-dropdown') && !e.target.closest('#part-search-input')) {
        const dropdown = document.getElementById('part-autocomplete-dropdown');
        if (dropdown) dropdown.classList.add('hidden');
    }
    
    if (!e.target.closest('#cust-autocomplete-dropdown') && !e.target.closest('#cust-search-input')) {
        const custDropdown = document.getElementById('cust-autocomplete-dropdown');
        if (custDropdown) custDropdown.classList.add('hidden');
    }
});
let currentDiagStep = 1;

window.switchDiagStep = function(step, fromStepper = false) {
    if (fromStepper && step > currentDiagStep) return;

    const step1 = document.getElementById('step-1-diagnose');
    const step2 = document.getElementById('step-2-plan');
    const step3 = document.getElementById('step-3-register');
    if (!step1 || !step2 || !step3) return;

    const previousStep = currentDiagStep;
    currentDiagStep = step;

    if (step === 2 && previousStep === 1) {
        if (!planReviewed) {
            syncPlanFromDiagnosis(true);
        }
    }

    if (step === 1) {
        if (typeof restoreMotorcycleCard === 'function') restoreMotorcycleCard();
        if (typeof renderInspectionOverview === 'function') renderInspectionOverview();
        if (typeof refreshDtcPlanButtons === 'function') refreshDtcPlanButtons();
    }

    if (step === 3) {
        if (typeof renderStep3Summary === 'function') renderStep3Summary();
    }

    [step1, step2, step3].forEach((el, idx) => {
        if (idx + 1 === step) {
            el.classList.remove('hidden');
            el.classList.add('flex');
            el.classList.remove('animate-[fadeIn_0.2s_ease-out]');
            void el.offsetWidth; // trigger reflow
            el.classList.add('animate-[fadeIn_0.2s_ease-out]');
        } else {
            el.classList.add('hidden');
            el.classList.remove('flex');
        }
    });

    document.getElementById('main-content-area').scrollTo({ top: 0, behavior: 'smooth' });
    updateDiagStepper();
};
function updateSectionNumbering() {
    let count = 1;
    const complaintTitle = document.getElementById('title-customer-complaint');
    if (complaintTitle) complaintTitle.textContent = `${count++}. Customer Complaint`;

    const setupTitle = document.getElementById('title-inspection-setup');
    if (setupTitle) setupTitle.textContent = `${count++}. Inspection Setup`;

    const ecuCard = document.getElementById('ecu-scan-card');
    const ecuTitle = document.getElementById('title-ecu-scan');
    if (ecuCard && !ecuCard.classList.contains('hidden') && ecuTitle) {
        ecuTitle.textContent = `${count++}. ECU / OBD Diagnostic`;
    }

    const physCard = document.getElementById('physical-inspection-card');
    const physTitle = document.getElementById('title-physical-inspection');
    if (physCard && !physCard.classList.contains('hidden') && physTitle) {
        physTitle.textContent = `${count++}. Physical Inspection Log`;
    }

    const summaryTitle = document.getElementById('title-inspection-summary');
    if (summaryTitle) {
        summaryTitle.textContent = `${count++}. Inspection Summary`;
    }

    const findingsTitle = document.getElementById('title-final-findings');
    if (findingsTitle) {
        findingsTitle.textContent = `${count++}. Final Findings & Diagnosis Verification`;
    }

    const intakeTitle = document.getElementById('title-vehicle-intake');
    if (intakeTitle) {
        intakeTitle.textContent = `${count++}. Vehicle Intake`;
    }
}

// --- Diagnostics View Toggle Handler ---
document.addEventListener('change', function(e) {
    if (e.target.closest('#step-1-diagnose')) {
        setTimeout(() => { if (typeof renderInspectionOverview === 'function') renderInspectionOverview(); }, 0);
    }

    // Check if the changed element is one of our master toggles
    if (e.target.id === 'toggle-physical' || e.target.id === 'toggle-ecu') {
        const isPhysicalOn = document.getElementById('toggle-physical').checked;
        const isEcuOn = document.getElementById('toggle-ecu').checked;

        const physicalCard = document.getElementById('physical-inspection-card');
        const ecuCard = document.getElementById('ecu-scan-card');

        // Toggle the Tailwind 'hidden' class based on checkbox state
        if (physicalCard) physicalCard.classList.toggle('hidden', !isPhysicalOn);
        if (ecuCard) ecuCard.classList.toggle('hidden', !isEcuOn);
        
        updateSectionNumbering();
    }
});

// --- Dynamic Loading Logic (SPA) ---
const mainContentArea = document.getElementById('main-content-area');

let viewLoadToken = 0;

async function loadView(viewName) {
    const allowedScreens = rolePermissions[currentRole] || [];
    const screenAccess = typeof getAccessLevel === 'function' ? getAccessLevel(viewName) : (allowedScreens.includes(viewName) ? 'full' : 'none');
    if (viewName !== 'more' && (!allowedScreens.includes(viewName) || screenAccess === 'none')) {
        const backBtnText = currentRole === 'cashier' ? 'Back to Home' : 'Back to Dashboard';
        mainContentArea.innerHTML = `
            <div class="p-8 text-center bg-white rounded-2xl border border-slate-200 max-w-md mx-auto my-12 shadow-sm">
                <div class="w-12 h-12 rounded-full bg-red-100 text-red-600 flex items-center justify-center mx-auto mb-4 text-2xl font-bold">
                    <i class="ph-bold ph-lock-key"></i>
                </div>
                <h2 class="text-slate-800 font-bold text-lg mb-2">Access Denied</h2>
                <p class="text-slate-500 text-sm mb-6">You do not have access to this screen.</p>
                <button onclick="document.querySelector('.nav-link[data-target=\\'dashboard\\']')?.click()" class="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm rounded-xl transition-colors shadow-sm">
                    ${backBtnText}
                </button>
            </div>
        `;
        mainContentArea.classList.remove('m-screen');
        mainContentArea.scrollTop = 0;
        return;
    }
    const loadToken = ++viewLoadToken;
    let html;
    let useMobileView = false;
    
    try {
        useMobileView = (document.body.classList.contains('mobile-app') || viewName === 'more') && mobileViews.includes(viewName);
        let templateId = `view-${useMobileView ? 'mobile-' : ''}${viewName}`;
        if (viewName === 'dashboard' && currentRole === 'cashier') {
            templateId = 'view-cashier-home';
            useMobileView = false;
        }
        const template = document.getElementById(templateId);
        
        if (!template) {
            throw new Error('Template not found: ' + templateId);
        }
        html = template.innerHTML;
    } catch (error) {
        console.error(error);
        mainContentArea.innerHTML = `
            <div class="p-8 text-center bg-white rounded-2xl border border-slate-200 max-w-md mx-auto my-12 shadow-sm">
                <div class="w-12 h-12 rounded-full bg-red-100 text-red-600 flex items-center justify-center mx-auto mb-4 text-2xl font-bold">
                    <i class="ph-bold ph-warning"></i>
                </div>
                <h2 class="text-slate-800 font-bold text-lg mb-2">This screen failed to load.</h2>
                <p class="text-slate-500 text-sm mb-6">Could not find the embedded template.</p>
                <button onclick="loadView('${viewName}')" class="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm rounded-xl transition-colors shadow-sm">
                    Reload screen
                </button>
            </div>
        `;
        return;
    }

    if (loadToken !== viewLoadToken) return; // a newer navigation superseded this one
    mainContentArea.innerHTML = html;
    mainContentArea.classList.toggle('m-screen', useMobileView);
    mainContentArea.scrollTop = 0;
    
    // Inject mobile sticky header for screens opened from More menu
    const isMobileMode = document.body.classList.contains('mobile-app');
    const primaryMobileViews = ['dashboard', 'repairs', 'diagnostics', 'inventory', 'more'];
    
    if (isMobileMode && !primaryMobileViews.includes(viewName)) {
        const navBtn = document.querySelector(`.nav-link[data-target="${viewName}"]`);
        const titleText = navBtn ? navBtn.textContent.trim() : viewName;
        const headerHTML = `
            <div class="sticky top-0 -mt-4 sm:-mt-6 -mx-4 sm:-mx-6 mb-4 px-4 sm:px-6 py-3 bg-white border-b border-slate-200 z-50 flex items-center justify-between shadow-sm">
                <div class="font-bold text-slate-800 text-lg flex items-center gap-2">
                    <span>${titleText}</span>
                </div>
                <button onclick="mNav('more')" class="w-8 h-8 flex items-center justify-center rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200 hover:text-slate-700 transition-colors">
                    <i class="ph ph-x text-lg"></i>
                </button>
            </div>
        `;
        mainContentArea.insertAdjacentHTML('afterbegin', headerHTML);
    }

    try {
        if (useMobileView && viewName === 'dashboard') renderMobileHome();

        if (viewName === 'dashboard') {
            if (currentRole === 'cashier') {
                renderCashierHome();
            } else {
                const backupAlert = document.getElementById('dashboard-backup-alert');
                if (backupAlert) {
                    const canBackup = rolePermissions[currentRole] && rolePermissions[currentRole].includes('backup');
                    backupAlert.style.display = canBackup ? 'flex' : 'none';
                }
                document.querySelectorAll('#view-dashboard [data-target="users"], #view-dashboard [data-mtab="users"]').forEach(el => {
                    const canUsers = rolePermissions[currentRole] && rolePermissions[currentRole].includes('users');
                    el.style.display = canUsers ? '' : 'none';
                });
            }
        }

        // Initialize Diagnostics view state
        if (viewName === 'diagnostics') {
            isScannerConnected = false;
            const isPhysicalOn = document.getElementById('toggle-physical')?.checked;
            const isEcuOn = document.getElementById('toggle-ecu')?.checked;
            if (document.getElementById('physical-inspection-card')) document.getElementById('physical-inspection-card').classList.toggle('hidden', !isPhysicalOn);
            if (document.getElementById('ecu-scan-card')) document.getElementById('ecu-scan-card').classList.toggle('hidden', !isEcuOn);
            updateSectionNumbering();
            renderInspection();
            planReviewed = false;
            currentDiagStep = 1;
            updatePlanTotals();
            if (typeof updateDiagStepper === 'function') updateDiagStepper();
            if (typeof renderInspectionOverview === 'function') renderInspectionOverview();
        }

        // Initialize Inventory view
        if (viewName === 'inventory') {
            if (window.expandedInvCards) window.expandedInvCards.clear();
            populateCategoryDropdowns();
            renderInventory();
        }

        if (viewName === 'settings') {
            if (typeof initSettingsView === 'function') initSettingsView();
        }

        if (viewName === 'users') { renderUsers(); }
        if (viewName === 'backup') { renderBackupHistory(); }
        if (viewName === 'repairs') { 
            if (window.expandedRepairCards) window.expandedRepairCards.clear();
            renderRepairs(); 
        }
        if (viewName === 'customers') { renderCustomers(); }

        // Initialize Transactions view
        if (viewName === 'transactions') {
            renderTransactions();
        }

        // Initialize History view
        if (viewName === 'history') {
            renderHistory();
        }

        // NEW: Initialize Reports view
        if (viewName === 'reports') {
            renderReports(typeof currentReportRange !== 'undefined' ? currentReportRange : 'today');
            setReportTab(typeof activeReportTab !== 'undefined' ? activeReportTab : 'financial');
        }
        if (viewName === 'audit') { renderAudit(); }

        // Initialize Mobile More view
        if (useMobileView && viewName === 'more') {
            updateMobileMoreNav(currentRole);
        }

        if (typeof updateRoleLabels === 'function') {
            updateRoleLabels();
        }

    } catch (error) {
        console.error(error);
        mainContentArea.innerHTML = `
            <div class="p-8 text-center bg-white rounded-2xl border border-slate-200 max-w-md mx-auto my-12 shadow-sm">
                <div class="w-12 h-12 rounded-full bg-red-100 text-red-600 flex items-center justify-center mx-auto mb-4 text-2xl font-bold">
                    <i class="ph-bold ph-warning"></i>
                </div>
                <h2 class="text-slate-800 font-bold text-lg mb-2">This screen failed to load.</h2>
                <p class="text-slate-500 text-sm mb-6">${error && error.message ? error.message : 'An error occurred while initializing this screen.'}</p>
                <button onclick="loadView('${viewName}')" class="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm rounded-xl transition-colors shadow-sm">
                    Reload screen
                </button>
            </div>
        `;
    }
}

// --- Sidebar Navigation Logic ---
const sidebar = document.getElementById('sidebar');
const sidebarToggle = document.getElementById('sidebar-toggle');
const mobileCloseBtn = document.getElementById('mobile-close-btn');
const mobileOverlay = document.getElementById('mobile-overlay');
const navLinks = document.querySelectorAll('.nav-link[data-target]');

function toggleSidebar(show) {
    if (show) {
        sidebar.classList.remove('-translate-x-full');
        mobileOverlay.classList.remove('hidden');
        setTimeout(() => mobileOverlay.classList.remove('opacity-0'), 10);
    } else {
        sidebar.classList.add('-translate-x-full');
        mobileOverlay.classList.add('opacity-0');
        setTimeout(() => mobileOverlay.classList.add('hidden'), 300);
    }
}

sidebarToggle.addEventListener('click', () => toggleSidebar(true));
mobileCloseBtn.addEventListener('click', () => toggleSidebar(false));
mobileOverlay.addEventListener('click', () => toggleSidebar(false));

function setActiveNavLink(targetId) {
    const allLinks = document.querySelectorAll('.nav-link[data-target]');
    allLinks.forEach(nav => {
        nav.classList.remove('active', 'bg-blue-600', 'text-white', 'shadow-md', 'shadow-blue-900/20');
        nav.classList.add('hover:bg-slate-800', 'hover:text-white');
        const icon = nav.querySelector('i');
        if (icon && icon.classList.contains('ph-fill')) {
            icon.classList.remove('ph-fill');
            icon.classList.add('ph');
        }
    });

    const activeLink = document.querySelector(`.nav-link[data-target="${targetId}"]`);
    if (activeLink) {
        activeLink.classList.add('active', 'bg-blue-600', 'text-white', 'shadow-md', 'shadow-blue-900/20');
        activeLink.classList.remove('hover:bg-slate-800');
        const icon = activeLink.querySelector('i');
        if (icon) {
            icon.classList.remove('ph');
            icon.classList.add('ph-fill');
        }
    }

    const isMobileMode = document.body.classList.contains('mobile-app');
    if (isMobileMode && typeof syncMobileNav === 'function') {
        syncMobileNav(targetId);
    }
}
window.setActiveNavLink = setActiveNavLink;

navLinks.forEach(link => {
    link.addEventListener('click', function() {
        const targetId = this.getAttribute('data-target');
        if(!targetId) return;

        setActiveNavLink(targetId);
        loadView(targetId); // FETCH THE HTML FILE

        if(window.innerWidth < 1024) toggleSidebar(false);
    });
});

// --- Role-Based Access Control (RBAC) Simulation ---
const ROLES_CONFIG = {
    super_admin: {
        id: 'super_admin',
        label: 'Super Admin',
        shortLabel: 'Super Admin',
        description: 'Users and system settings',
        demoEmail: 'superadmin@gmail.com',
        defaultUI: 'desktop',
        canSwitchUI: false
    },
    admin: {
        id: 'admin',
        label: 'Owner/Cashier (Admin)',
        shortLabel: 'Owner/Cashier',
        description: 'Shop operations: owner and cashier',
        demoEmail: 'ownercashier@gmail.com',
        defaultUI: 'desktop',
        canSwitchUI: false
    },
    cashier: {
        id: 'cashier',
        label: 'Cashier',
        shortLabel: 'Cashier',
        description: 'Sales, billing and stock lookup',
        demoEmail: 'cashier@gmail.com',
        defaultUI: 'desktop',
        canSwitchUI: false
    },
    mechanic: {
        id: 'mechanic',
        label: 'Mechanic',
        shortLabel: 'Mechanic',
        description: 'Repairs and diagnostics',
        demoEmail: 'mechanic@gmail.com',
        defaultUI: 'mobile',
        canSwitchUI: false
    }
};

const systemUsers = {
    super_admin: { id: 'u2', name: 'System Admin', role: ROLES_CONFIG.super_admin.label, initials: 'SA', color: 'bg-slate-800', password: 'admin123' },
    admin: { id: 'u1', name: 'User', role: ROLES_CONFIG.admin.label, initials: 'IG', color: 'bg-blue-600', password: 'admin123' },
    cashier: { id: 'u5', name: 'Cashier', role: ROLES_CONFIG.cashier.label, initials: 'CS', color: 'bg-emerald-600', password: 'cashier123' },
    mechanic: { id: 'u3', name: 'Larpus', role: ROLES_CONFIG.mechanic.label, initials: 'JB', color: 'bg-purple-600', password: 'mech123' }
};

let currentRole = 'admin';

function createRolePerms(screenMap) {
    const arr = Object.keys(screenMap).filter(k => screenMap[k] && screenMap[k] !== 'none');
    Object.assign(arr, screenMap);
    arr.access = screenMap;
    return arr;
}

const rolePermissions = {
    super_admin: createRolePerms({
        dashboard: 'full',
        customers: 'full',
        diagnostics: 'full',
        repairs: 'full',
        inventory: 'full',
        transactions: 'full',
        history: 'full',
        reports: 'full',
        audit: 'full',
        users: 'full',
        settings: 'full',
        backup: 'full'
    }),
    admin: createRolePerms({
        dashboard: 'full',
        customers: 'full',
        diagnostics: 'full',
        repairs: 'full',
        inventory: 'full',
        transactions: 'full',
        history: 'full',
        reports: 'full',
        audit: 'read',
        settings: 'full'
    }),
    cashier: createRolePerms({
        dashboard: 'full',
        inventory: 'full',
        transactions: 'full',
        history: 'full',
        settings: 'full'
    }),
    mechanic: createRolePerms({
        dashboard: 'full',
        customers: 'full',
        diagnostics: 'full',
        repairs: 'full',
        inventory: 'full',
        history: 'full',
        settings: 'full'
    })
};
window.rolePermissions = rolePermissions;

function getAccessLevel(screen, role) {
    const rawRole = role || currentRole || sessionStorage.getItem('currentUserRole');
    const activeRole = (rawRole && ROLES_CONFIG[rawRole]) ? rawRole : 'admin';
    const perms = rolePermissions[activeRole];
    if (!perms) return 'none';
    const level = perms[screen];
    if (typeof level === 'string') return level;
    if (perms.includes && perms.includes(screen)) return 'full';
    return 'none';
}
window.getAccessLevel = getAccessLevel;

function canSwitchUI(role) {
    const rawRole = role || currentRole || sessionStorage.getItem('currentUserRole');
    const activeRole = (rawRole && ROLES_CONFIG[rawRole]) ? rawRole : 'admin';
    return !!(ROLES_CONFIG[activeRole] && ROLES_CONFIG[activeRole].canSwitchUI);
}
window.canSwitchUI = canSwitchUI;

function getDefaultUI(role) {
    const rawRole = role || currentRole || sessionStorage.getItem('currentUserRole');
    const activeRole = (rawRole && ROLES_CONFIG[rawRole]) ? rawRole : 'admin';
    return (ROLES_CONFIG[activeRole] && ROLES_CONFIG[activeRole].defaultUI) || 'desktop';
}
window.getDefaultUI = getDefaultUI;

function getRoleByEmail(email) {
    if (!email || typeof email !== 'string') return null;
    const normalized = email.trim().toLowerCase();
    for (const roleId in ROLES_CONFIG) {
        if (ROLES_CONFIG[roleId].demoEmail && ROLES_CONFIG[roleId].demoEmail.toLowerCase() === normalized) {
            return roleId;
        }
    }
    return null;
}
window.getRoleByEmail = getRoleByEmail;

function getDemoAccounts() {
    const order = ['super_admin', 'admin', 'cashier', 'mechanic'];
    return order
        .filter(roleId => ROLES_CONFIG[roleId])
        .map(roleId => ({
            roleId: ROLES_CONFIG[roleId].id,
            email: ROLES_CONFIG[roleId].demoEmail,
            label: ROLES_CONFIG[roleId].label
        }));
}
window.getDemoAccounts = getDemoAccounts;

// --- Role Features Configuration (Inventory RBAC) ---
const roleFeatures = {
    super_admin: {
        viewStock: true,
        walkInSale: true,
        addPart: true,
        editPart: true,
        restock: true,
        autoAssign: true,
        viewMovements: true
    },
    admin: {
        viewStock: true,
        walkInSale: true,
        addPart: true,
        editPart: true,
        restock: true,
        autoAssign: true,
        viewMovements: true
    },
    cashier: {
        viewStock: true,
        walkInSale: true,
        addPart: false,
        editPart: false,
        restock: false,
        autoAssign: false,
        viewMovements: true
    },
    mechanic: {
        viewStock: true,
        walkInSale: false,
        addPart: false,
        editPart: false,
        restock: false,
        autoAssign: false,
        viewMovements: true
    }
};
window.roleFeatures = roleFeatures;

function hasFeature(featureName) {
    const role = (typeof currentRole !== 'undefined' && currentRole) ? currentRole : 'admin';
    return !!(roleFeatures[role] && roleFeatures[role][featureName]);
}
window.hasFeature = hasFeature;

window.can = function(role, permission) {
    if (!permission) {
        permission = role;
        role = currentRole;
    }
    const prefix = 'inventory.';
    if (typeof permission === 'string' && permission.startsWith(prefix)) {
        const feat = permission.slice(prefix.length);
        if (feat === 'view') return hasFeature('viewStock');
        if (feat === 'search') return true;
        return hasFeature(feat);
    }
    return hasFeature(permission);
};

function updateRoleLabels() {
    // 1. Sidebar role label
    const userRoleText = document.getElementById('user-role-text');
    if (userRoleText && ROLES_CONFIG[currentRole]) {
        userRoleText.textContent = ROLES_CONFIG[currentRole].label;
    }

    // 3. Settings > Current Session role
    const accRole = document.getElementById('acc-role');
    if (accRole && ROLES_CONFIG[currentRole]) {
        accRole.textContent = ROLES_CONFIG[currentRole].label;
    }
    const accName = document.getElementById('acc-name');
    if (accName && systemUsers[currentRole]) {
        accName.textContent = systemUsers[currentRole].name;
    }
    const accAvatar = document.getElementById('acc-avatar');
    if (accAvatar && systemUsers[currentRole]) {
        accAvatar.textContent = systemUsers[currentRole].initials;
        accAvatar.className = "w-14 h-14 rounded-full text-white flex items-center justify-center font-bold text-xl shadow-inner shrink-0 " + systemUsers[currentRole].color;
    }

    // 4. Dashboard subtext under "Welcome back"
    const dashSub = document.getElementById('dashboard-subtext');
    if (dashSub) {
        const roleLabel = ROLES_CONFIG[currentRole]?.label || ROLES_CONFIG.admin.label;
        dashSub.textContent = `${roleLabel} | Thursday, September 24, 2026`;
    }

    // Update Dashboard nav link label (reads "Home" for Cashier only)
    const dashNavLink = document.querySelector('.nav-link[data-target="dashboard"]');
    if (dashNavLink) {
        dashNavLink.innerHTML = `<i class="ph-fill ph-squares-four text-lg w-6"></i> ${currentRole === 'cashier' ? 'Home' : 'Dashboard'}`;
    }

    // 5. "Simulate Login As" dropdown
    document.querySelectorAll('#role-switcher, #m-role-switcher').forEach(switcher => {
        const suffixes = { super_admin: ' (System)', admin: ' (User)', cashier: ' (Cashier)', mechanic: ' (Larpus)' };
        switcher.innerHTML = Object.values(ROLES_CONFIG).map(r => 
            `<option value="${r.id}">${r.label}${suffixes[r.id] || ''}</option>`
        ).join('');
        switcher.value = currentRole;
    });

    // 6. User Management: role filter dropdown
    const userFilterRole = document.getElementById('user-filter-role');
    if (userFilterRole) {
        const currentVal = userFilterRole.value;
        userFilterRole.innerHTML = `
            <option value="all">Filter by Role: All</option>
            <option value="super_admin">${ROLES_CONFIG.super_admin.label}</option>
            <option value="admin">${ROLES_CONFIG.admin.label}</option>
            <option value="cashier">${ROLES_CONFIG.cashier.label}</option>
            <option value="mechanic">${ROLES_CONFIG.mechanic.label}</option>
        `;
        if (currentVal) userFilterRole.value = currentVal;
    }

    // 7. User Management: Add/Edit User modal role dropdown
    const userFormRole = document.getElementById('user-form-role');
    if (userFormRole) {
        userFormRole.innerHTML = `
            <option value="" disabled selected>Select Role Assignment...</option>
            <option value="super_admin">${ROLES_CONFIG.super_admin.label} (${ROLES_CONFIG.super_admin.description})</option>
            <option value="admin">${ROLES_CONFIG.admin.label} (${ROLES_CONFIG.admin.description})</option>
            <option value="cashier">${ROLES_CONFIG.cashier.label} (${ROLES_CONFIG.cashier.description})</option>
            <option value="mechanic">${ROLES_CONFIG.mechanic.label} (${ROLES_CONFIG.mechanic.description})</option>
        `;
    }

    // 8. Permissions Matrix headings & table rows
    const matrixSuper = document.querySelector('.matrix-role-super_admin');
    if (matrixSuper) matrixSuper.textContent = ROLES_CONFIG.super_admin.label;
    const matrixAdmin = document.querySelector('.matrix-role-admin');
    if (matrixAdmin) matrixAdmin.textContent = ROLES_CONFIG.admin.label;
    const matrixCashier = document.querySelector('.matrix-role-cashier');
    if (matrixCashier) matrixCashier.textContent = ROLES_CONFIG.cashier.label;
    const matrixMech = document.querySelector('.matrix-role-mechanic');
    if (matrixMech) matrixMech.textContent = ROLES_CONFIG.mechanic.label;
    if (typeof renderPermissionsMatrix === 'function') {
        renderPermissionsMatrix();
    }

    // 9. Audit Logs role filter dropdown
    const auditFilterRole = document.getElementById('audit-filter-role');
    if (auditFilterRole) {
        const currentVal = auditFilterRole.value;
        auditFilterRole.innerHTML = `
            <option value="all">User Role: All</option>
            <option value="super_admin">${ROLES_CONFIG.super_admin.label}</option>
            <option value="admin">${ROLES_CONFIG.admin.label}</option>
            <option value="cashier">${ROLES_CONFIG.cashier.label}</option>
            <option value="mechanic">${ROLES_CONFIG.mechanic.label}</option>
            <option value="automated">Automated (System)</option>
        `;
        if (currentVal) auditFilterRole.value = currentVal;
    }

    // 10. Dashboard Backup Alert & Shortcuts
    const backupAlert = document.getElementById('dashboard-backup-alert');
    if (backupAlert) {
        const canBackup = rolePermissions[currentRole] && rolePermissions[currentRole].includes('backup');
        backupAlert.style.display = canBackup ? 'flex' : 'none';
    }
    document.querySelectorAll('#view-dashboard [data-target="users"], #view-dashboard [data-mtab="users"]').forEach(el => {
        const canUsers = rolePermissions[currentRole] && rolePermissions[currentRole].includes('users');
        el.style.display = canUsers ? '' : 'none';
    });

    // 11. Settings Cards Visibility (if Settings is currently rendered)
    if (typeof updateSettingsCardsVisibility === 'function') {
        updateSettingsCardsVisibility(currentRole);
    }

    // 12. Audit screen access update (if Audit is currently rendered)
    if (document.querySelector('#main-content-area #view-audit') && typeof renderAudit === 'function') {
        renderAudit();
    }

    // 13. User Directory update (if Users is currently rendered)
    if (document.getElementById('users-tbody') && typeof renderUsers === 'function') {
        renderUsers();
    }
}

function updateMobileMoreNav(roleId) {
    const activeRole = roleId || currentRole || 'mechanic';
    const moreView = document.getElementById('m-more-view');
    if (!moreView) return;
    const allowed = rolePermissions[activeRole] || [];
    
    moreView.querySelectorAll('button[data-mtab]').forEach(el => {
        const target = el.getAttribute('data-mtab');
        if (target) {
            el.style.display = allowed.includes(target) ? '' : 'none';
        }
    });

    const deskToggle = document.getElementById('m-more-desktop-toggle');
    if (deskToggle) {
        deskToggle.style.display = canSwitchUI(activeRole) ? '' : 'none';
    }
    
    // Hide parent sections if all children are hidden
    moreView.querySelectorAll('div.bg-white.rounded-2xl').forEach(parentDiv => {
        const anyVisible = Array.from(parentDiv.querySelectorAll('button[data-mtab], #m-more-desktop-toggle')).some(b => b.style.display !== 'none');
        const sectionContainer = parentDiv.parentElement;
        if (sectionContainer) sectionContainer.style.display = anyVisible ? '' : 'none';
    });
}

function switchRole(roleId, isLogin) {
    if (!roleId || !ROLES_CONFIG[roleId] || !systemUsers[roleId]) {
        handleLogout();
        return;
    }
    const user = systemUsers[roleId];
    if (!canSwitchUI(roleId) || roleId !== currentRole) {
        forceOwnerMobile = false;
        sessionStorage.removeItem('forceOwnerMobile');
        localStorage.removeItem('forceOwnerMobile');
    }
    currentRole = roleId;
    localStorage.setItem('activeRole', roleId);
    sessionStorage.setItem('currentUserRole', roleId);
    sessionStorage.setItem('roles_version', 'v4_cashier');

    // 0. Mechanic runs in the mobile-app UI; every other role keeps the desktop UI
    const wasMobile = document.body.classList.contains('mobile-app');
    const isMobile = applyMobileMode(roleId);
    document.querySelectorAll('#role-switcher, #m-role-switcher').forEach(s => { s.value = roleId; });
    
    // 1. Update Profile UI
    const userNameEl = document.getElementById('user-name');
    if (userNameEl) userNameEl.textContent = user.name;
    const userRoleEl = document.getElementById('user-role-text');
    if (userRoleEl) userRoleEl.textContent = ROLES_CONFIG[roleId]?.label || '';
    const avatar = document.getElementById('user-avatar');
    if (avatar) {
        avatar.textContent = user.initials;
        avatar.className = `w-8 h-8 rounded-full text-white flex items-center justify-center font-bold text-xs shrink-0 shadow-inner ${user.color}`;
    }

    // 2. Hide/Show Nav Links based on rolePermissions map
    const allNavLinks = document.querySelectorAll('.nav-link[data-target]');
    let isCurrentViewAllowed = false;
    const currentActiveTarget = document.querySelector('.nav-link.active')?.getAttribute('data-target');

    allNavLinks.forEach(link => {
        const target = link.getAttribute('data-target');
        const allowed = rolePermissions[roleId] && rolePermissions[roleId].includes(target);
        
        if (allowed) {
            link.style.display = 'flex'; // Show link
            if (target === currentActiveTarget) {
                isCurrentViewAllowed = true;
            }
        } else {
            link.style.display = 'none'; // Hide link
        }
    });

    // 3. Hide/Show Header Sections
    const adminHeader = document.getElementById('nav-header-admin');
    const settingsHeader = document.getElementById('nav-header-settings');
    const desktopMobileToggle = document.getElementById('desktop-mobile-toggle');
    
    if (adminHeader) {
        const adminTargets = ['reports', 'users'];
        const hasVisibleAdmin = adminTargets.some(target => {
            const link = document.querySelector(`.nav-link[data-target="${target}"]`);
            return link && link.style.display !== 'none';
        });
        adminHeader.style.display = hasVisibleAdmin ? 'block' : 'none';
    }

    if (settingsHeader) {
        const hasVisibleSettings = Array.from(settingsHeader.querySelectorAll('.nav-link[data-target]'))
            .some(link => link.style.display !== 'none');
        settingsHeader.style.display = hasVisibleSettings ? 'block' : 'none';
    }

    if (desktopMobileToggle) {
        desktopMobileToggle.style.display = canSwitchUI(roleId) ? 'flex' : 'none';
    }

    updateRoleLabels();
    updateMobileMoreNav(roleId);

    if (isLogin) return;

    // 4. Force redirect to Dashboard if the user is currently on a restricted page
    const isCurrentlyOnBackup = !!document.querySelector('#main-content-area #view-backup') || currentActiveTarget === 'backup';
    const roleHasBackupAccess = rolePermissions[roleId] && rolePermissions[roleId].includes('backup');

    const isCurrentlyOnUsers = !!document.querySelector('#main-content-area #view-users') || currentActiveTarget === 'users';

    const isCurrentlyOnAudit = !!document.querySelector('#main-content-area #view-audit') || currentActiveTarget === 'audit';
    const roleHasAuditAccess = typeof getAccessLevel === 'function' ? (getAccessLevel('audit', roleId) !== 'none') : (rolePermissions[roleId] && rolePermissions[roleId].includes('audit'));

    const isCurrentlyOnInventory = !!document.querySelector('#main-content-area #view-inventory') || currentActiveTarget === 'inventory';

    if ((isCurrentlyOnBackup && !roleHasBackupAccess) || (isCurrentlyOnAudit && !roleHasAuditAccess) || !isCurrentViewAllowed) {
        setActiveNavLink('dashboard');
        loadView('dashboard');
    } else if (wasMobile !== isMobile) {
        const isCurrentlyOnMore = !!document.getElementById('m-more-view');
        const targetView = (!isMobile && isCurrentlyOnMore) ? 'dashboard' : (isCurrentlyOnInventory ? 'inventory' : ((currentActiveTarget && (isMobile || currentActiveTarget !== 'more')) ? currentActiveTarget : 'dashboard'));
        setActiveNavLink(targetView);
        loadView(targetView);
    } else if (isCurrentlyOnUsers && typeof renderUsers === 'function') {
        renderUsers();
    } else if (isCurrentlyOnInventory) {
        const aaView = document.getElementById('view-autoassign');
        if (aaView && !aaView.classList.contains('hidden') && !hasFeature('autoAssign')) {
            aaView.classList.add('hidden');
            const invView = document.querySelector('#main-content-area #view-inventory');
            if (invView) invView.classList.remove('hidden');
        }
        if (!hasFeature('restock')) closeRestockModal();
        if (!hasFeature('addPart') && !hasFeature('editPart')) closeAddPartModal();
        if (!hasFeature('walkInSale') && typeof closeWalkInModalInv === 'function') closeWalkInModalInv();
        renderInventory();
    } else if (currentActiveTarget === 'dashboard') {
        setActiveNavLink('dashboard');
        loadView('dashboard');
    } else if (isCurrentlyOnAudit && typeof renderAudit === 'function') {
        renderAudit();
    }
}

// Trigger initial setup
document.addEventListener('DOMContentLoaded', () => {
    const yearSpan = document.getElementById('current-year');
    if (yearSpan) yearSpan.textContent = new Date().getFullYear();

    if (typeof applyShopDetails === 'function') {
        applyShopDetails();
    }

    // Reset old sessions so swapped roles don't grant mismatched access
    const ROLES_SESSION_VERSION = 'v4_cashier';
    if (sessionStorage.getItem('roles_version') !== ROLES_SESSION_VERSION) {
        sessionStorage.clear();
        localStorage.removeItem('activeRole');
        sessionStorage.setItem('roles_version', ROLES_SESSION_VERSION);
    }

    const activeRole = localStorage.getItem('activeRole') || sessionStorage.getItem('currentUserRole');
    if (activeRole && ROLES_CONFIG[activeRole] && systemUsers[activeRole]) {
        if (!canSwitchUI(activeRole)) {
            forceOwnerMobile = false;
            sessionStorage.removeItem('forceOwnerMobile');
            localStorage.removeItem('forceOwnerMobile');
        } else {
            forceOwnerMobile = sessionStorage.getItem('forceOwnerMobile') === 'true';
        }
        try {
            switchRole(activeRole, true);
        } catch (e) {
            console.error('Error restoring active role:', e);
        }
        const loginScreen = document.getElementById('login-screen');
        if (loginScreen) {
            loginScreen.classList.add('hidden');
            loginScreen.classList.remove('flex');
        }
        if (typeof setActiveNavLink === 'function') setActiveNavLink('dashboard');
        if (typeof loadView === 'function') loadView('dashboard');
    } else {
        localStorage.removeItem('activeRole');
        sessionStorage.removeItem('currentUserRole');
        const loginScreen = document.getElementById('login-screen');
        if (loginScreen) {
            loginScreen.classList.remove('hidden');
            loginScreen.classList.add('flex');
        }
        if (typeof showLoginForm === 'function') showLoginForm();
    }
    updateRoleLabels();
});


// --- Event Delegation for Dynamic Content ---
let isScannerConnected = false;

document.addEventListener('click', function(e) {
    if (e.target.closest('#step-1-diagnose')) {
        setTimeout(() => { if (typeof renderInspectionOverview === 'function') renderInspectionOverview(); }, 0);
    }
    
    // 1. Diagnostics Logic
    if (e.target.closest('#btn-connect-scanner')) {
        const connectBtn = e.target.closest('#btn-connect-scanner');
        const btBadge = document.getElementById('bt-badge');
        const btnRunScan = document.getElementById('btn-run-scan');
        const dtcResultsContainer = document.getElementById('dtc-results-container');
        
        if (!isScannerConnected) {
            isScannerConnected = true;
            connectBtn.innerHTML = `<i class="ph ph-x"></i> Disconnect`;
            connectBtn.classList.replace('bg-slate-800', 'bg-slate-200');
            connectBtn.classList.replace('hover:bg-slate-900', 'hover:bg-slate-300');
            connectBtn.classList.replace('text-white', 'text-slate-700');
            btBadge.innerHTML = `<span class="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span> Connected`;
            btBadge.className = "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-700 border border-emerald-200";
            btnRunScan.disabled = false;
            btnRunScan.classList.remove('bg-slate-200', 'text-slate-400', 'cursor-not-allowed');
            btnRunScan.classList.add('bg-blue-600', 'text-white', 'hover:bg-blue-700', 'shadow-md', 'shadow-blue-500/30');
        } else {
            isScannerConnected = false;
            connectBtn.innerHTML = `<i class="ph-fill ph-bluetooth"></i> Pair / Connect`;
            connectBtn.classList.replace('bg-slate-200', 'bg-slate-800');
            connectBtn.classList.replace('hover:bg-slate-300', 'hover:bg-slate-900');
            connectBtn.classList.replace('text-slate-700', 'text-white');
            btBadge.innerHTML = `<span class="w-2 h-2 rounded-full bg-red-500"></span> Disconnected`;
            btBadge.className = "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-red-100 text-red-700 border border-red-200";
            if(dtcResultsContainer) dtcResultsContainer.classList.add('hidden');
        }
    }

    if (e.target.closest('#btn-run-scan')) {
        const runScanBtn = e.target.closest('#btn-run-scan');
        if (!isScannerConnected) {
            const connectBtn = document.getElementById('btn-connect-scanner');
            if (connectBtn) connectBtn.click();
        }
        runScanBtn.disabled = true;
        const dtcResultsContainer = document.getElementById('dtc-results-container');
        const dtcResultsList = document.getElementById('dtc-results-list');
        const dtcNoRefMsg = document.getElementById('dtc-no-ref-message');
        const originalContent = runScanBtn.innerHTML;

        // Clear old results before each scan
        if (dtcResultsList) dtcResultsList.innerHTML = '';
        if (dtcResultsContainer) dtcResultsContainer.classList.add('hidden');
        if (dtcNoRefMsg) dtcNoRefMsg.classList.add('hidden');

        runScanBtn.innerHTML = `<i class="ph ph-spinner animate-spin text-2xl"></i> Scanning ECU...`;
        runScanBtn.classList.replace('bg-blue-600', 'bg-blue-400');

        setTimeout(() => {
            runScanBtn.innerHTML = originalContent;
            runScanBtn.disabled = false;
            runScanBtn.classList.replace('bg-blue-400', 'bg-blue-600');

            const currentVehicle = inspectionState && inspectionState.vehicle;
            const ref = typeof getDtcReference === 'function' ? getDtcReference(currentVehicle) : (DTC_REFERENCE && DTC_REFERENCE.yamaha_sniper);

            if (!ref) {
                if (dtcNoRefMsg) dtcNoRefMsg.classList.remove('hidden');
                if (dtcResultsContainer) dtcResultsContainer.classList.add('hidden');
            } else {
                if (dtcNoRefMsg) dtcNoRefMsg.classList.add('hidden');
                // Default demo: Engine Coolant Temperature, Power Supply / Charging, and Throttle Position Sensor
                renderDtcResults(['P0118', 'P0562', 'P0120']);
                if (dtcResultsContainer) {
                    dtcResultsContainer.classList.remove('hidden');
                    dtcResultsContainer.classList.add('animate-[fadeIn_0.5s_ease-out]');
                }
            }
            if (typeof renderInspectionOverview === 'function') renderInspectionOverview();
        }, 1000);
    }

    // 2. Report Tabs
    const reportBtn = e.target.closest('.report-tab-btn');
    if (reportBtn) {
        const targetId = reportBtn.getAttribute('data-tab') || reportBtn.getAttribute('data-target')?.replace('tab-', '') || 'financial';
        setReportTab(targetId === 'diagnostics' ? 'dtc' : targetId);
    }

    // 3. User Tabs
    const userBtn = e.target.closest('.user-tab-btn');
    if (userBtn) {
        const targetId = userBtn.getAttribute('data-target');
        const view = document.getElementById('view-users');
        if(view) {
            view.querySelectorAll('.user-tab-btn').forEach(b => {
                b.classList.remove('active', 'text-blue-600', 'border-blue-600');
                b.classList.add('text-slate-500', 'border-transparent', 'hover:border-slate-300', 'hover:text-slate-800');
            });
            userBtn.classList.add('active', 'text-blue-600', 'border-blue-600');
            userBtn.classList.remove('text-slate-500', 'border-transparent', 'hover:border-slate-300', 'hover:text-slate-800');
            view.querySelectorAll('.user-tab-content').forEach(content => {
                content.classList.toggle('hidden', content.id !== targetId);
                content.classList.toggle('block', content.id === targetId);
            });
            if (targetId === 'tab-user-matrix' && typeof renderPermissionsMatrix === 'function') {
                renderPermissionsMatrix();
            }
        }
    }
});

// --- Generic Modal Handler ---
function toggleModal(modalId, backdropId, contentId, show, effect = 'scale') {
    const modal = document.getElementById(modalId);
    const backdrop = document.getElementById(backdropId);
    const content = document.getElementById(contentId);
    if (!modal || !backdrop || !content) return;

    if (show) {
        if (modal._hideTimeout) {
            clearTimeout(modal._hideTimeout);
            modal._hideTimeout = null;
        }
        modal.classList.remove('hidden');
        void modal.offsetWidth; 
        backdrop.classList.remove('opacity-0');
        backdrop.classList.add('opacity-100');
        if(effect === 'scale') {
            content.classList.remove('opacity-0', 'scale-95');
            content.classList.add('opacity-100', 'scale-100');
        } else if(effect === 'slide') {
            content.classList.remove('translate-x-full');
            content.classList.add('translate-x-0');
        }
    } else {
        backdrop.classList.remove('opacity-100');
        backdrop.classList.add('opacity-0');
        if(effect === 'scale') {
            content.classList.remove('opacity-100', 'scale-100');
            content.classList.add('opacity-0', 'scale-95');
        } else if(effect === 'slide') {
            content.classList.remove('translate-x-0');
            content.classList.add('translate-x-full');
        }
        if (modal._hideTimeout) clearTimeout(modal._hideTimeout);
        modal._hideTimeout = setTimeout(() => {
            modal.classList.add('hidden');
            modal._hideTimeout = null;
        }, 300);
    }
}

// =====================================================================
// Diagnosis -> Parts plan -> Registration flow
// Auto-assigns parts from the ECU/OBD scan + physical inspection, lets the
// mechanic edit / finalize them, then continues to "Confirm Vehicle for Repair".
// =====================================================================

const fmtPeso = n => '\u20B1 ' + (Number(n) || 0).toLocaleString('en-PH', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

const sourceBadgeStyles = {
    ecu:      { cls: 'bg-blue-50 text-blue-600 border-blue-200',         icon: 'ph-cpu',    label: 'ECU/OBD' },
    physical: { cls: 'bg-orange-50 text-orange-600 border-orange-200',   icon: 'ph-wrench', label: 'Physical' },
    manual:   { cls: 'bg-emerald-50 text-emerald-600 border-emerald-200', icon: 'ph-user',   label: 'Manual' }
};
function sourceBadgesHTML(sources) {
    return (sources && sources.length ? sources : ['manual']).map(s => {
        const b = sourceBadgeStyles[s] || sourceBadgeStyles.manual;
        return `<span class="inline-flex items-center gap-1 ${b.cls} px-1.5 py-0.5 rounded text-[9px] font-bold border uppercase tracking-wider"><i class="ph-bold ${b.icon}"></i> ${b.label}</span>`;
    }).join('');
}

let planReviewed = false;
let repairPlanParts = [];      // true once the mechanic finalized the parts list
Object.defineProperty(window, 'repairPlanParts', {
    get() { return repairPlanParts; },
    set(v) { repairPlanParts = v; },
    configurable: true
});

function escHTML(s) { return String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c])); }

// Adds a part chip to the Repair Plan (shared by the search dropdown, the inspection suggestions and the review modal)

// --- Manual Part Form Logic ---
window.openManualPartForm = function(part) {
    const form = document.getElementById('manual-part-add-form');
    if (!form) return;
    
    document.getElementById('manual-part-id').value = part.id;
    document.getElementById('manual-part-name').textContent = part.name;
    document.getElementById('manual-part-qty').value = 1;
    document.getElementById('manual-part-qty').max = part.stock;
    
    const select = document.getElementById('manual-part-target');
    select.innerHTML = '';
    
    // Populate options from flagged items
    if (inspectionState.flaggedItems && inspectionState.flaggedItems.length > 0) {
        const optgroup = document.createElement('optgroup');
        optgroup.label = "Diagnosis Items";
        inspectionState.flaggedItems.forEach(item => {
            const opt = document.createElement('option');
            opt.value = `${item.name}|${item.category}`;
            opt.textContent = `${item.name} (${item.category})`;
            optgroup.appendChild(opt);
        });
        select.appendChild(optgroup);
    }
    
    const optgroup2 = document.createElement('optgroup');
    optgroup2.label = "Other";
    optgroup2.innerHTML = `
        <option value="General / Shop supplies|Other / General">General / Shop supplies</option>
        <option value="other|Other / General">Other repair...</option>
    `;
    select.appendChild(optgroup2);
    
    toggleManualPartOther();
    form.classList.remove('hidden');
};

window.cancelManualPart = function() {
    const form = document.getElementById('manual-part-add-form');
    if (form) form.classList.add('hidden');
};

window.toggleManualPartOther = function() {
    const select = document.getElementById('manual-part-target');
    const otherWrapper = document.getElementById('manual-part-other-wrapper');
    if (select.value.startsWith('other|')) {
        otherWrapper.classList.remove('hidden');
    } else {
        otherWrapper.classList.add('hidden');
    }
};

window.confirmManualPart = function() {
    const partId = document.getElementById('manual-part-id').value;
    const part = mockInventory.find(p => p.id === partId);
    if (!part) return;
    
    let qty = parseInt(document.getElementById('manual-part-qty').value);
    if (isNaN(qty) || qty < 1) qty = 1;

    
    const selectValue = document.getElementById('manual-part-target').value;
    let target = '';
    let category = '';
    
    if (selectValue.startsWith('other|')) {
        target = document.getElementById('manual-part-other-input').value.trim() || 'Other Repair';
        category = 'Other / General';
    } else {
        const parts = selectValue.split('|');
        target = parts[0];
        category = parts[1] || 'Other / General';
    }
    
    addPartToPlan(part, { qty: qty, target: target, category: category });
    cancelManualPart();
};

window.changePartTarget = function(selectElement) {
    const row = selectElement.closest('[id^="selected-part-"]');
    if (!row) return;
    const partId = row.dataset.id;
    const oldTarget = row.dataset.target;
    const newVal = selectElement.value;
    let newTarget, newCategory;
    
    if (newVal === 'other') {
        const custom = prompt("Enter description for other repair:");
        if (custom && custom.trim()) {
            newTarget = custom.trim();
            newCategory = 'Other / General';
        } else {
            // Revert selection
            selectElement.value = oldTarget;
            return;
        }
    } else {
        const parts = newVal.split('|');
        newTarget = parts[0];
        newCategory = parts[1] || 'Other / General';
    }
    
    // Find the exact item. Note: if there are multiple parts with same ID but different targets, we need to match by ID AND target
    const idx = repairPlanParts.findIndex(p => p.id === partId && p.target === oldTarget);
    if (idx !== -1) {
        const item = repairPlanParts[idx];
        item.target = newTarget;
        item.category = newCategory;
        
        // Merge if identical part ID and new target already exists
        const existingIdx = repairPlanParts.findIndex((p, i) => i !== idx && p.id === partId && p.target === newTarget);
        if (existingIdx !== -1) {
            repairPlanParts[existingIdx].qty += item.qty;
            repairPlanParts.splice(idx, 1);
        }
        
        renderRepairPlan();
        updatePlanTotals();
    }
};

window.getDropdownOptionsHTML = function(currentValue) {
    let options = [];
    if (inspectionState.flaggedItems) {
        options = inspectionState.flaggedItems.map(item => `<option value="${escHTML(item.name)}|${escHTML(item.category)}" ${currentValue === item.name ? 'selected' : ''}>${escHTML(item.name)}</option>`);
    }
    
    const genValue = "General / Shop supplies|Other / General";
    const genSelected = currentValue === "General / Shop supplies" ? 'selected' : '';
    const otherSelected = (!inspectionState.flaggedItems || !inspectionState.flaggedItems.some(i => i.name === currentValue)) && currentValue !== "General / Shop supplies" ? 'selected' : '';
    
    return `
        <optgroup label="Diagnosis Items">
            ${options.join('')}
        </optgroup>
        <optgroup label="Other">
            <option value="General / Shop supplies|Other / General" ${genSelected}>General / Shop supplies</option>
            ${otherSelected ? `<option value="${escHTML(currentValue)}|Other / General" selected>${escHTML(currentValue)}</option>` : ''}
            <option value="other">Other repair...</option>
        </optgroup>
    `;
};

function addPartToPlan(part, opts = {}) {
    if (!part) return false;
    
    const qty = Math.max(1, Math.min(opts.qty || 1, part.stock));
    const target = opts.target || 'Other / General';
    const category = opts.category || 'Manual Addition';
    const isAuto = opts.sources && (opts.sources.includes('ecu') || opts.sources.includes('physical')) ? true : false;
    
    // Find existing part with EXACT SAME TARGET to increase quantity
    const existing = repairPlanParts.find(p => p.id === part.id && p.target === target);
    if (existing) {
        existing.qty = Math.min(existing.qty + qty, part.stock > 0 ? part.stock : existing.qty + qty);
    } else {
        repairPlanParts.push({
            id: part.id,
            part: part,
            qty: qty,
            target: target,
            category: category,
            isAuto: opts.target === undefined ? false : isAuto, // if opts.target is passed manually, isAuto is false
            stock: part.stock
        });
    }
    
    renderRepairPlan();
    updatePlanTotals();
    return true;
}

// Recalculates line totals, parts total, estimated total, empty state, badge and stepper

function renderRepairPlan() {
    const container = document.getElementById('selected-parts-container');
    const emptyState = document.getElementById('plan-empty');
    if (!container || !emptyState) return;

    // Group parts by target
    const groupedParts = {};
    repairPlanParts.forEach(p => {
        const t = p.target || 'Other / General';
        if (!groupedParts[t]) groupedParts[t] = [];
        groupedParts[t].push(p);
    });
    
    if (repairPlanParts.length === 0 && (!window.unlinkedFixesList || window.unlinkedFixesList.length === 0)) {
        container.innerHTML = '';
        emptyState.classList.remove('hidden');
    } else {
        emptyState.classList.add('hidden');
        let html = '';
        
        // Show unlinked note if any
        if (window.unlinkedFixesList && window.unlinkedFixesList.length > 0) {
            html += `
                <div class="bg-blue-50 border border-blue-200 text-blue-800 text-[11px] p-2 rounded-lg mb-2 shadow-sm flex items-start gap-1.5">
                    <i class="ph-fill ph-info text-sm mt-0.5 shrink-0"></i>
                    <div>
                        <span class="font-bold">No part linked for:</span> ${window.unlinkedFixesList.join(', ')}.<br>
                        Add them manually or ask an ${ROLES_CONFIG.admin.shortLabel || 'Owner/Cashier'} to link them in Inventory.
                    </div>
                </div>
            `;
        }
        
        // Show Restore button if there are removed suggestions
        if (window.removedAutoSuggestions && window.removedAutoSuggestions.size > 0) {
            html += `
                <div class="flex justify-end mb-2">
                    <button type="button" onclick="syncPlanFromDiagnosis(false, true)" class="text-[10px] font-bold text-slate-500 hover:text-slate-700 underline decoration-slate-300">Restore removed suggestions</button>
                </div>
            `;
        }

        let outOfStockCount = 0;
        
        Object.keys(groupedParts).forEach(targetName => {
            html += `
                <div class="mb-3 last:mb-0">
                    <h3 class="text-xs font-bold text-slate-700 uppercase mb-1.5 border-b border-slate-200 pb-1">${targetName}</h3>
                    <div class="flex flex-col gap-2">
            `;
            
            groupedParts[targetName].forEach(p => {
                let outOfStock = false;
                let stockStatus = 'in_stock';
                let stockBadge = '';

                if (p.stock === 0) {
                    stockStatus = 'out_of_stock';
                    outOfStock = true;
                    stockBadge = '<span class="inline-flex items-center gap-1 bg-red-50 text-red-600 border-red-200 px-1.5 py-0.5 rounded text-[9px] font-bold border uppercase tracking-wider"><i class="ph-bold ph-warning-circle"></i> Out of stock</span>';
                } else if (p.stock < p.qty) {
                    stockStatus = 'low_stock';
                    outOfStock = true;
                    stockBadge = '<span class="inline-flex items-center gap-1 bg-amber-50 text-amber-600 border-amber-200 px-1.5 py-0.5 rounded text-[9px] font-bold border uppercase tracking-wider"><i class="ph-bold ph-warning-circle"></i> Low stock</span>';
                }

                if (!p.handling) p.handling = 'order';
                
                const isObsolete = p.obsolete;
                
                if (outOfStock && !isObsolete) outOfStockCount++;
                
                html += `
                    <div id="selected-part-${p.id}" data-id="${p.id}" data-price="${p.part.price}" data-target="${p.target}" data-category="${p.category}" data-is-auto="${p.isAuto}" data-source="${p.source || ''}" class="flex flex-col bg-white border ${isObsolete ? 'border-red-200 bg-red-50/20' : 'border-slate-200'} rounded-lg shadow-sm overflow-hidden transition-all duration-200 hover:border-slate-300">
                        <div class="flex items-center justify-between gap-2 p-2.5">
                            <div class="flex-1 min-w-0">
                                <div class="flex flex-wrap items-center gap-x-2 gap-y-1 mb-0.5">
                                    <div class="text-sm font-bold ${stockStatus === 'out_of_stock' ? 'text-red-500' : (stockStatus === 'low_stock' ? 'text-amber-600' : 'text-slate-800')} truncate ${isObsolete ? 'line-through text-slate-400' : ''}">${escHTML(p.part.name)}</div>
                                    ${p.source === 'ecu' || (p.target && p.target.startsWith('ECU/OBD')) ? `<span class="inline-flex items-center gap-1 bg-purple-50 text-purple-600 border-purple-200 px-1.5 py-0.5 rounded text-[9px] font-bold border uppercase tracking-wider">From ECU/OBD scan</span>` : (p.isAuto ? `<span class="inline-flex items-center gap-1 bg-purple-50 text-purple-600 border-purple-200 px-1.5 py-0.5 rounded text-[9px] font-bold border uppercase tracking-wider">Auto-assigned</span>` : `<span class="inline-flex items-center gap-1 bg-blue-50 text-blue-600 border-blue-200 px-1.5 py-0.5 rounded text-[9px] font-bold border uppercase tracking-wider">Added by mechanic</span>`)}
                                    ${isObsolete ? `<span class="inline-flex items-center gap-1 bg-red-100 text-red-700 border-red-200 px-1.5 py-0.5 rounded text-[9px] font-bold border uppercase tracking-wider">No longer needed</span>` : stockBadge}
                                </div>
                                <div class="text-xs text-slate-500">
                                    SKU: ${escHTML(p.part.sku)} · \u20B1${p.part.price.toFixed(2)} / unit · <span class="line-total font-bold text-slate-700 ${isObsolete ? 'line-through text-slate-400' : ''}">\u20B1 ${(p.part.price * p.qty).toLocaleString('en-PH', {minimumFractionDigits: 2, maximumFractionDigits: 2})}</span>
                                </div>
                                <div class="text-[10px] text-slate-400 mt-0.5 flex items-center gap-1">
                                    For: ${escHTML(p.target)} ${p.category ? `(${escHTML(p.category)})` : ''}
                                </div>
                            </div>
                            <div class="flex items-center gap-2 shrink-0">
                                ${isObsolete ? `
                                    <button class="px-3 py-1 bg-red-100 text-red-700 hover:bg-red-200 rounded text-xs font-bold transition-colors" onclick="removePlanPart(this)">Remove</button>
                                ` : `
                                    <div class="flex items-center bg-slate-50 rounded-md border border-slate-200">
                                        <button class="px-2.5 py-1 text-slate-400 hover:text-blue-600 transition-colors" onclick="updatePlanQty(-1, this)"><i class="ph-bold ph-minus"></i></button>
                                        <span class="w-6 text-center text-xs font-bold text-slate-700 qty-val">${p.qty}</span>
                                        <button class="px-2.5 py-1 text-slate-400 hover:text-blue-600 transition-colors" onclick="updatePlanQty(1, this)"><i class="ph-bold ph-plus"></i></button>
                                    </div>
                                    <button class="text-slate-400 hover:bg-red-50 hover:text-red-500 rounded p-1.5 transition-colors" title="Remove part" onclick="removePlanPart(this)"><i class="ph-bold ph-x"></i></button>
                                `}
                            </div>
                        </div>
                        ${outOfStock && !isObsolete ? `
                            <div class="bg-slate-50 p-2.5 border-t border-slate-200 flex flex-col gap-2">
                                <div class="flex flex-wrap items-center gap-2">
                                    <label class="text-[10px] font-bold text-slate-500 uppercase">Handling:</label>
                                    <select class="text-xs border border-slate-300 rounded p-1 flex-1 outline-none focus:border-amber-500" onchange="handlePartWaitAction(this)">
                                        <option value="order" ${p.handling === 'order' ? 'selected' : ''}>Order / wait for part</option>
                                        <option value="replace" ${p.handling === 'replace' ? 'selected' : ''}>Replace with another part</option>
                                        <option value="customer" ${p.handling === 'customer' ? 'selected' : ''}>Customer will bring own part</option>
                                        <option value="remove" ${p.handling === 'remove' ? 'selected' : ''}>Remove from plan</option>
                                    </select>
                                </div>
                                ${p.handling === 'order' ? `
                                <div class="flex flex-wrap items-center gap-2">
                                    <input type="date" class="text-xs border border-slate-300 rounded p-1 outline-none focus:border-amber-500" value="${p.expectedArrival || ''}" onchange="updatePartHandlingData(this, 'arrival')" title="Expected Arrival">
                                    <input type="text" class="text-xs border border-slate-300 rounded p-1 flex-1 outline-none focus:border-amber-500" placeholder="Short note..." value="${p.note || ''}" onchange="updatePartHandlingData(this, 'note')">
                                </div>
                                ` : ''}
                            </div>
                        ` : ''}
                    </div>
                `;
            });
            html += `</div></div>`;
        });
        
        container.innerHTML = html;
        
        const pendingBanner = document.getElementById('pending-parts-banner');
        if (pendingBanner) {
            if (outOfStockCount > 0) {
                document.getElementById('pending-parts-count').textContent = outOfStockCount;
                pendingBanner.classList.remove('hidden');
            } else {
                pendingBanner.classList.add('hidden');
            }
        }
        if (typeof refreshDtcPlanButtons === 'function') refreshDtcPlanButtons();
    }
}


window.handlePartWaitAction = function(selectEl) {
    const row = selectEl.closest('.flex-col').querySelector('[id^="selected-part-"]');
    if (!row) return;
    const id = row.dataset.id;
    const target = row.dataset.target;
    const item = repairPlanParts.find(p => p.id === id && p.target === target);
    if (!item) return;
    
    item.handling = selectEl.value;
    
    if (item.handling === 'replace') {
        document.getElementById('part-search-input')?.focus();
        item.handling = 'order'; 
    } else if (item.handling === 'remove') {
        const idx = repairPlanParts.findIndex(p => p.id === id && p.target === target);
        if (idx !== -1) {
            if (item.isAuto) window.removedAutoSuggestions.add(id + '|' + target);
            repairPlanParts.splice(idx, 1);
        }
    }
    
    renderRepairPlan();
    updatePlanTotals();
};

window.updatePartHandlingData = function(inputEl, type) {
    const row = inputEl.closest('.flex-col').querySelector('[id^="selected-part-"]');
    if (!row) return;
    const id = row.dataset.id;
    const target = row.dataset.target;
    const item = repairPlanParts.find(p => p.id === id && p.target === target);
    if (!item) return;
    
    if (type === 'arrival') item.expectedArrival = inputEl.value;
    if (type === 'note') item.note = inputEl.value;
};


window.updatePlanQty = function(delta, btnElement) {
    const row = btnElement.closest('[id^="selected-part-"]');
    if (!row) return;
    const id = row.dataset.id;
    const target = row.dataset.target;
    
    const item = repairPlanParts.find(p => p.id === id && p.target === target);
    if (item) {
        if (item.qty + delta > 0) {
            item.qty += delta;
            renderRepairPlan();
            updatePlanTotals();
        }
    }
}

window.removePlanPart = function(btnElement) {
    const row = btnElement.closest('[id^="selected-part-"]');
    if (!row) return;
    const id = row.dataset.id;
    const target = row.dataset.target;
    const isAuto = row.dataset.isAuto === 'true';
    
    const idx = repairPlanParts.findIndex(p => p.id === id && p.target === target);
    if (idx !== -1) {
        if (isAuto) window.removedAutoSuggestions.add(id + '|' + target);
        repairPlanParts.splice(idx, 1);
        renderRepairPlan();
        updatePlanTotals();
    }
}

function updatePlanTotals() {
    let total = 0, count = 0;
    let pendingCount = 0;
    
    repairPlanParts.forEach(p => {
        if (p.obsolete) return; // Ignore obsolete parts in totals
        total += p.part.price * p.qty;
        count++;
        if ((p.stock === 0 || p.stock < p.qty) && p.handling === 'order') {
            pendingCount++;
        }
    });
    
    const labor = parseFloat(document.getElementById('labor-cost-input')?.value) || 0;
    const set = (id, v) => { const el = document.getElementById(id); if (el) el.textContent = v; };
    set('plan-parts-count', count);
    set('plan-parts-total', fmtPeso(total));
    set('plan-grand-total', fmtPeso(total + labor));
    
    const banner = document.getElementById('pending-parts-banner');
    if (banner) {
        if (pendingCount > 0) {
            banner.classList.remove('hidden');
            document.getElementById('pending-parts-count').textContent = pendingCount;
        } else {
            banner.classList.add('hidden');
        }
    }
    inspectionState.hasPendingParts = pendingCount > 0;
}


function resetDiagnosticsWorkflow() {
    // Restore UI for next time
    const reviewGrid = document.querySelector('#step-3-register .grid');
    if(reviewGrid) reviewGrid.classList.remove('hidden');
    
    const statusBadge = document.getElementById('step3-job-status');
    if(statusBadge) statusBadge.classList.remove('hidden');
    const actions = document.getElementById('step3-actions');
    if(actions) {
        actions.classList.remove('hidden');
        actions.classList.add('flex');
    }
    
    const successState = document.getElementById('step3-success-state');
    if(successState) {
        successState.classList.add('hidden');
        successState.classList.remove('flex');
    }

    // Reset step 2
    const planBox = document.getElementById('selected-parts-container');
    if (planBox) planBox.innerHTML = '';
    repairPlanParts = [];
    planReviewed = false;
    const laborInput = document.getElementById('labor-cost-input');
    if (laborInput) laborInput.value = '';
    document.querySelectorAll('#final-findings').forEach(el => { el.value = ''; });
    
    // Clear DTC scan results & state
    if (typeof clearDtcScanResults === 'function') clearDtcScanResults();
    
    // Ensure Continue is reset
    
    if (typeof updatePlanTotals === 'function') updatePlanTotals();
    
    if (typeof resetInspection === 'function') resetInspection(true);

    switchDiagStep(1);
}
function openRepairModal() { toggleModal('repair-modal', 'repair-modal-backdrop', 'repair-modal-content', true); }
function closeRepairModal() { toggleModal('repair-modal', 'repair-modal-backdrop', 'repair-modal-content', false); }
function completeJob(event) {
    const btn = event.currentTarget;
    const originalHTML = btn.innerHTML;
    btn.disabled = true;
    setTimeout(() => {
        btn.innerHTML = originalHTML;
        btn.disabled = false;
        closeRepairModal();
    }, 800);
}

let currentEditingPartId = null;
let currentPartDtcTags = [];

function renderDtcChips() {
    const container = document.getElementById('dtc-chips-container');
    if (!container) return;
    container.innerHTML = '';
    currentPartDtcTags.forEach((tag, idx) => {
        const chip = document.createElement('div');
        chip.className = 'inline-flex items-center gap-1 bg-blue-50 text-blue-700 px-2 py-1 rounded-md text-xs font-bold border border-blue-200';
        chip.innerHTML = `<i class="ph-bold ph-cpu text-blue-500"></i> ${tag} <i class="ph-bold ph-x cursor-pointer hover:text-red-500 ml-1" onclick="removeDtcChip(${idx})"></i>`;
        container.appendChild(chip);
    });
}

function removeDtcChip(idx) {
    currentPartDtcTags.splice(idx, 1);
    renderDtcChips();
}

document.addEventListener('DOMContentLoaded', () => {
    const dtcInput = document.getElementById('add-part-dtc');
    if (dtcInput) {
        dtcInput.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' || e.key === ',') {
                e.preventDefault();
                const val = this.value.trim().replace(/,/g, '').toUpperCase();
                if (val && !currentPartDtcTags.includes(val)) {
                    currentPartDtcTags.push(val);
                    renderDtcChips();
                }
                this.value = '';
            }
        });
    }
});

function clearAddPartForm() {
    const form = document.querySelector('#main-content-area #modal-add-part') || document.getElementById('modal-add-part');
    if (!form) return;
    const expiryInput = form.querySelector('.part-expiry-input');
    if (expiryInput) expiryInput.value = '';
    // Container visibility is now handled by updatePartExpiryVisibility() at the end
    const nameEl = form.querySelector('#add-part-name') || document.getElementById('add-part-name');
    if (nameEl) nameEl.value = '';
    const skuEl = form.querySelector('#add-part-sku') || document.getElementById('add-part-sku');
    if (skuEl) skuEl.value = '';
    const catEl = form.querySelector('#add-part-category') || document.getElementById('add-part-category');
    if (catEl) catEl.value = '';
    const compEl = form.querySelector('#add-part-comp') || document.getElementById('add-part-comp');
    if (compEl) compEl.value = '';
    const priceEl = form.querySelector('#add-part-price') || document.getElementById('add-part-price');
    if (priceEl) priceEl.value = '';
    const stockEl = form.querySelector('#add-part-stock') || document.getElementById('add-part-stock');
    if (stockEl) stockEl.value = '';
    const minStockEl = form.querySelector('#add-part-minstock') || document.getElementById('add-part-minstock');
    if (minStockEl) minStockEl.value = '';
    const dtcEl = form.querySelector('#add-part-dtc') || document.getElementById('add-part-dtc');
    if (dtcEl) dtcEl.value = '';
    const nameErr = form.querySelector('#add-part-name-error') || document.getElementById('add-part-name-error');
    if (nameErr) nameErr.classList.add('hidden');
    const stockErr = form.querySelector('#add-part-stock-error') || document.getElementById('add-part-stock-error');
    if (stockErr) stockErr.classList.add('hidden');
    
    currentPartDtcTags = [];
    renderDtcChips();
    
    // Reset title and button
    const title = form.querySelector('h2');
    if (title) title.innerHTML = '<i class="ph-fill ph-plus-circle text-blue-600"></i> Add New Part';
    const btnText = form.querySelector('#btn-save-part-text') || document.getElementById('btn-save-part-text');
    if (btnText) btnText.textContent = 'Save Part';
    currentEditingPartId = null;
    
    updatePartExpiryVisibility(form);
}

function openAddPartModal() { 
    if (!hasFeature('addPart')) { closeAddPartModal(); showToast("You don't have permission to do this."); return; }
    clearAddPartForm();
    const isMobile = document.body.classList.contains('mobile-app');
    const activeCatFilter = isMobile ? (currentCategoryFilter || '') : '';
    if (activeCatFilter) {
        const catSelect = document.getElementById('add-part-category');
        if (catSelect) catSelect.value = activeCatFilter;
    }
    const form = document.getElementById('modal-add-part');
    updatePartExpiryVisibility(form);
    
    requestAnimationFrame(() => {
        updatePartExpiryVisibility(form);
        const categorySelect = document.getElementById('add-part-category');
        console.log("expiry check", document.querySelectorAll(".part-expiry-field").length, categorySelect ? categorySelect.value : '');
    });
    
    toggleModal('modal-add-part', 'add-part-backdrop', 'add-part-content', true); 
}
function closeAddPartModal() { 
    toggleModal('modal-add-part', 'add-part-backdrop', 'add-part-content', false); 
    clearAddPartForm();
}

let currentRestockPartId = null;

function openRestockModal(partId = null) { 
    if (!hasFeature('restock')) { closeRestockModal(); showToast("You don't have permission to do this."); return; }
    
    currentRestockPartId = null;
    const input = document.getElementById('restock-search-input');
    if (input) input.value = '';
    const btn = document.getElementById('restock-clear-btn');
    if (btn) btn.classList.add('hidden');
    const list = document.getElementById('restock-dropdown-list');
    if (list) list.classList.add('hidden');
    
    const qtyInput = document.getElementById('restock-qty');
    if (qtyInput) qtyInput.value = '';
    const notesInput = document.getElementById('restock-notes');
    if (notesInput) notesInput.value = '';
    
    const curStock = document.getElementById('restock-current-stock');
    if (curStock) curStock.textContent = '-';
    
    if (partId && typeof partId === 'string') {
        selectRestockPart(partId);
    }
    
    updateRestockExpiryVisibility();
    toggleModal('modal-restock', 'restock-backdrop', 'restock-content', true); 
}

function closeRestockModal() { toggleModal('modal-restock', 'restock-backdrop', 'restock-content', false); }

function renderRestockDropdown(query) {
    const list = document.getElementById('restock-dropdown-list');
    if (!list) return;
    
    query = (query || '').toLowerCase();
    const filtered = mockInventory.filter(p => 
        p.name.toLowerCase().includes(query) || 
        p.sku.toLowerCase().includes(query) || 
        (p.category && p.category.toLowerCase().includes(query))
    );
    
    if (filtered.length === 0) {
        list.innerHTML = '<div class="p-4 text-center text-sm font-semibold text-slate-500">No parts found.</div>';
        return;
    }
    
    list.innerHTML = filtered.map(p => {
        const cat = p.category || 'Uncategorized';
        const catConf = typeof categoryConfig !== 'undefined' && categoryConfig[cat] ? categoryConfig[cat] : { icon: 'ph-box', bg: 'bg-slate-100', text: 'text-slate-600' };
        
        return '<div class="restock-item p-3 border-b border-slate-50 hover:bg-slate-50 cursor-pointer flex items-center gap-3 transition-colors focus:bg-slate-50 outline-none" data-id="' + p.id + '" tabindex="0">' +
            '<div class="w-8 h-8 rounded shrink-0 flex items-center justify-center ' + catConf.bg + ' ' + catConf.text + '">' +
                '<i class="ph-bold ' + catConf.icon + '"></i>' +
            '</div>' +
            '<div class="flex-1 min-w-0">' +
                '<div class="font-bold text-slate-800 text-sm leading-tight truncate">' + p.name + '</div>' +
                '<div class="text-[10px] font-bold text-slate-500 uppercase">#' + p.sku + '</div>' +
            '</div>' +
            '<div class="shrink-0 text-xs font-bold text-slate-500">' +
                'Stock: ' + p.stock +
            '</div>' +
        '</div>';
    }).join('');
    
    if (typeof lucide !== 'undefined' && lucide.createIcons) {
        lucide.createIcons();
    }
}

function updateRestockExpiryVisibility() {
    const form = document.getElementById('modal-restock');
    if (!form) return;
    const container = form.querySelector('.restock-expiry-field');
    const input = form.querySelector('.restock-expiry-input');
    const hint = form.querySelector('.restock-expiry-hint');
    if (!container || !input || !hint) return;

    let part = null;
    if (currentRestockPartId) {
        part = mockInventory.find(p => p.id === currentRestockPartId) || fullInventoryData.find(p => p.id === currentRestockPartId);
    }
    
    if (part) {
        const conf = categoryConfig[part.category];
        if (conf && conf.hasExpiry) {
            container.classList.remove('hidden');
            input.value = part.expiryDate || '';
            if (part.expiryDate) {
                hint.textContent = `Current: ${part.expiryDate}. Change it only if the new stock has a different expiry.`;
            } else {
                hint.textContent = "No expiry set yet. Enter one if this stock expires.";
            }
            return;
        }
    }
    
    container.classList.add('hidden');
    input.value = '';
    hint.textContent = '';
}

function selectRestockPart(partId) {
    const part = mockInventory.find(p => p.id === partId);
    if (!part) return;
    
    currentRestockPartId = partId;
    const input = document.getElementById('restock-search-input');
    if (input) input.value = part.name;
    
    const btn = document.getElementById('restock-clear-btn');
    if (btn) btn.classList.remove('hidden');
    const list = document.getElementById('restock-dropdown-list');
    if (list) list.classList.add('hidden');
    
    document.getElementById('restock-current-stock').textContent = part.stock + ' Units';
    
    updateRestockExpiryVisibility();
}

window.clearRestockSelection = function() {
    currentRestockPartId = null;
    const input = document.getElementById('restock-search-input');
    if (input) {
        input.value = '';
        input.focus();
    }
    const btn = document.getElementById('restock-clear-btn');
    if (btn) btn.classList.add('hidden');
    renderRestockDropdown('');
    const list = document.getElementById('restock-dropdown-list');
    if (list) list.classList.remove('hidden');
    
    document.getElementById('restock-current-stock').textContent = '-';
    updateRestockExpiryVisibility();
};

window.confirmRestock = function() {
    if (!hasFeature('restock')) {
        showToast("You don't have permission to do this.");
        return;
    }
    if (!currentRestockPartId) {
        showToast('Please select a part to restock.');
        return;
    }
    const qty = parseInt(document.getElementById('restock-qty').value, 10);
    if (isNaN(qty) || qty <= 0) {
        showToast('Please enter a valid quantity.');
        return;
    }
    
    const part = mockInventory.find(p => p.id === currentRestockPartId);
    if (part) {
        const stockBefore = part.stock;
        part.stock += qty;
        const stockAfter = part.stock;
        
        const catConf = categoryConfig[part.category];
        if (catConf && catConf.hasExpiry) {
            const form = document.getElementById('modal-restock');
            if (form) {
                const expInput = form.querySelector('.restock-expiry-input');
                if (expInput && expInput.value) {
                    part.expiryDate = expInput.value;
                }
            }
        }
        
        const noteInput = document.getElementById('restock-notes');
        const note = (noteInput && noteInput.value) ? noteInput.value.trim() : '';
        const ref = note ? `Restock: ${note}` : 'Restock';

        if (typeof recordMovement === 'function') {
            recordMovement({
                part,
                type: 'in',
                quantity: qty,
                stockBefore,
                stockAfter,
                reference: ref
            });
        }
        
        // Optionally update minStock or anything else, but just stock is fine
        showToast(`Restocked ${qty} units of ${part.name}`, 'success');
        updateDashboardWidgets();
        renderInventory();
        closeRestockModal();
    }
};

function openEditPartModal(partId) {
    if (!hasFeature('editPart')) { showToast("You don't have permission to do this."); return; }
    
    const part = fullInventoryData.find(p => p.id === partId);
    if (!part) return;

    clearAddPartForm();
    currentEditingPartId = partId;
    
    const form = document.querySelector('#main-content-area #modal-add-part') || document.getElementById('modal-add-part');
    if (!form) return;

    const title = form.querySelector('h2');
    if (title) title.innerHTML = '<i class="ph-fill ph-pencil text-blue-600"></i> Edit Part';
    const btnText = form.querySelector('#btn-save-part-text') || document.getElementById('btn-save-part-text');
    if (btnText) btnText.textContent = 'Save Changes';

    const nameEl = form.querySelector('#add-part-name') || document.getElementById('add-part-name');
    if (nameEl) nameEl.value = part.name || '';
    const skuEl = form.querySelector('#add-part-sku') || document.getElementById('add-part-sku');
    if (skuEl) skuEl.value = part.sku || '';
    const catEl = form.querySelector('#add-part-category') || document.getElementById('add-part-category');
    if (catEl) catEl.value = part.category || '';
    updatePartExpiryVisibility(form);
    
    if (part.expiryDate) {
        const expiryInput = form.querySelector('.part-expiry-input');
        if (expiryInput) expiryInput.value = part.expiryDate;
    }
    const compEl = form.querySelector('#add-part-comp') || document.getElementById('add-part-comp');
    if (compEl) compEl.value = part.comp || '';
    const priceEl = form.querySelector('#add-part-price') || document.getElementById('add-part-price');
    if (priceEl) priceEl.value = part.price || '';
    const stockEl = form.querySelector('#add-part-stock') || document.getElementById('add-part-stock');
    if (stockEl) stockEl.value = part.stock || '';
    const minStockEl = form.querySelector('#add-part-minstock') || document.getElementById('add-part-minstock');
    if (minStockEl) minStockEl.value = part.minStock || '';
    const dtcEl = form.querySelector('#add-part-dtc') || document.getElementById('add-part-dtc');
    if (dtcEl) dtcEl.value = ''; // Chips input is empty
    
    // Set up chips
    if (part.linkedDTCs && part.linkedDTCs.length > 0) {
        currentPartDtcTags = [...part.linkedDTCs];
    } else if (part.dtc) {
        currentPartDtcTags = part.dtc.split(',').map(s => s.trim().toUpperCase()).filter(s => s);
    } else {
        currentPartDtcTags = [];
    }
    renderDtcChips();

    toggleModal('modal-add-part', 'add-part-backdrop', 'add-part-content', true);
}

function savePartForm() {
    if (currentEditingPartId && !hasFeature('editPart')) {
        showToast("You don't have permission to do this.");
        return;
    }
    if (!currentEditingPartId && !hasFeature('addPart')) {
        showToast("You don't have permission to do this.");
        return;
    }
    const nameEl = document.getElementById('add-part-name');
    const nameErr = document.getElementById('add-part-name-error');
    const stockEl = document.getElementById('add-part-stock');
    const stockErr = document.getElementById('add-part-stock-error');
    
    nameErr.classList.add('hidden');
    stockErr.classList.add('hidden');
    
    const name = nameEl.value.trim();
    if (!name) {
        nameErr.classList.remove('hidden');
        return;
    }
    
    const stock = parseInt(stockEl.value || '0', 10);
    
    let part = null;
    if (currentEditingPartId) {
        part = fullInventoryData.find(p => p.id === currentEditingPartId);
    }
    
    const reserved = part ? (part.reserved || 0) : 0;
    
    if (stock < reserved) {
        stockErr.classList.remove('hidden');
        return;
    }

    // Capture any pending tag in the input
    const pendingTag = document.getElementById('add-part-dtc').value.trim().replace(/,/g, '').toUpperCase();
    if (pendingTag && !currentPartDtcTags.includes(pendingTag)) {
        currentPartDtcTags.push(pendingTag);
    }
    
    const dtcString = currentPartDtcTags.length > 0 ? currentPartDtcTags.join(', ') : null;

    const newData = {
        name: name,
        sku: document.getElementById('add-part-sku').value.trim(),
        category: document.getElementById('add-part-category').value,
        comp: document.getElementById('add-part-comp').value.trim(),
        price: parseFloat(document.getElementById('add-part-price').value || '0'),
        stock: stock,
        minStock: parseInt(document.getElementById('add-part-minstock').value || '0', 10),
        dtc: dtcString,
        linkedDTCs: [...currentPartDtcTags],
        image: part ? part.image : ''
    };
    const conf = categoryConfig[document.getElementById('add-part-category').value];
    if (conf && conf.hasExpiry) {
        const form = document.getElementById('modal-add-part');
        const expiryInput = form ? form.querySelector('.part-expiry-input') : null;
        newData.expiryDate = expiryInput ? (expiryInput.value || '') : '';
    } else {
        newData.expiryDate = '';
    }

    if (part) {
        const oldStock = Number(part.stock) || 0;
        const newStock = Number(newData.stock) || 0;
        const stockDiff = newStock - oldStock;

        // Update existing part in place
        Object.assign(part, newData);

        if (stockDiff !== 0 && typeof recordMovement === 'function') {
            recordMovement({
                part,
                type: 'adjust',
                quantity: Math.abs(stockDiff),
                stockBefore: oldStock,
                stockAfter: newStock,
                reference: 'Manual edit'
            });
        }
    } else {
        // Add new part
        const newId = 'P' + Date.now();
        const newPart = {
            id: newId,
            ...newData,
            reserved: 0
        };
        fullInventoryData.unshift(newPart);

        const initialStock = Number(newPart.stock) || 0;
        if (initialStock > 0 && typeof recordMovement === 'function') {
            recordMovement({
                part: newPart,
                type: 'new',
                quantity: initialStock,
                stockBefore: 0,
                stockAfter: initialStock,
                reference: 'New part'
            });
        }
    }

    closeAddPartModal();
    renderInventory();
    
    if (typeof updateDiagStepper === 'function') updateDiagStepper(); // update any diagnostic steps using it
}

let currentWalkInPartName = '';

function openWalkInModalInv(itemName, itemPrice) {
    if (!hasFeature('walkInSale')) { closeWalkInModalInv(); showToast("You don't have permission to do this."); return; }
    currentWalkInPartName = itemName || '';
    document.getElementById('walkin-inv-item-name').textContent = itemName;
    document.getElementById('walkin-inv-item-price').textContent = "\u20B1" + itemPrice;
    toggleModal('modal-walk-in-inv', 'walkin-inv-backdrop', 'walkin-inv-content', true);
}
function closeWalkInModalInv() { toggleModal('modal-walk-in-inv', 'walkin-inv-backdrop', 'walkin-inv-content', false); }
function confirmWalkInSaleInv(event) {
    if (!hasFeature('walkInSale')) { closeWalkInModalInv(); showToast("You don't have permission to do this."); return; }
    const btn = event.currentTarget;
    const originalHTML = btn.innerHTML;
    btn.innerHTML = `<i class="ph-bold ph-spinner animate-spin text-lg"></i> Processing...`;
    btn.disabled = true;
    setTimeout(() => {
        btn.innerHTML = originalHTML;
        btn.disabled = false;
        closeWalkInModalInv();
        const part = fullInventoryData.find(p => p.name === currentWalkInPartName);
        if (part && part.stock > 0) {
            const stockBefore = part.stock;
            part.stock -= 1;
            const stockAfter = part.stock;
            const txnId = 'TXN-' + Math.floor(100 + Math.random() * 900);
            if (typeof recordMovement === 'function') {
                recordMovement({
                    part,
                    type: 'out',
                    quantity: 1,
                    stockBefore,
                    stockAfter,
                    reference: `Walk-in sale ${txnId}`
                });
            }
            if (typeof mockTxnData !== 'undefined' && Array.isArray(mockTxnData)) {
                mockTxnData.unshift({
                    id: txnId,
                    category: 'completed',
                    type: 'Walk-in Sale',
                    typeClass: 'text-slate-500 bg-slate-100 border-slate-200',
                    typeIcon: 'ph-shopping-bag',
                    customer: 'Walk-in Customer',
                    details: `Purchased: ${part.name} (x1)`,
                    amount: part.price,
                    amountSuffix: '',
                    status: 'Fully Paid',
                    statusClass: 'bg-emerald-50 text-emerald-700 border-emerald-200',
                    statusDot: 'bg-emerald-500',
                    btnText: 'View Receipt',
                    btnClass: 'bg-white hover:bg-slate-50 text-slate-600 border-slate-300',
                    btnIcon: 'ph-receipt',
                    btnAction: 'openReceiptModal()',
                    date: new Date().toISOString()
                });
            }
            renderInventory();
            if (typeof updateDashboardWidgets === 'function') updateDashboardWidgets();
            if (typeof renderCashierHome === 'function') renderCashierHome();
            if (typeof renderTransactions === 'function') renderTransactions();
        }
        showToast("Payment Confirmed! Stock has been deducted automatically.");
    }, 800);
}

// --- Transactions & Billing Logic ---
function openWalkInCheckout() { 
    if (!window.can('inventory.walkInSale')) { closeWalkInCheckout(); showToast("You don't have permission to do this."); return; }
    document.getElementById('walkin-tendered').value = "";
    document.getElementById('walkin-change').textContent = "0.00";
    toggleModal('modal-txn-walkin', 'txn-walkin-backdrop', 'txn-walkin-content', true); 
}
function closeWalkInCheckout() { toggleModal('modal-txn-walkin', 'txn-walkin-backdrop', 'txn-walkin-content', false); }

function calcWalkinChange() {
    const totalDue = 850.00;
    const tendered = parseFloat(document.getElementById('walkin-tendered').value) || 0;
    const changeLabel = document.getElementById('walkin-change');
    if (tendered >= totalDue) {
        changeLabel.textContent = (tendered - totalDue).toFixed(2);
        changeLabel.parentElement.classList.remove('text-red-400');
        changeLabel.parentElement.classList.add('text-emerald-400');
    } else {
        changeLabel.textContent = "0.00";
        changeLabel.parentElement.classList.remove('text-emerald-400');
        changeLabel.parentElement.classList.add('text-red-400');
    }
}

function processWalkinPayment(event) {
    const btn = event.currentTarget;
    const originalHTML = btn.innerHTML;
    btn.innerHTML = `<i class="ph-bold ph-spinner animate-spin text-lg"></i> Processing...`;
    btn.disabled = true;
    setTimeout(() => {
        btn.innerHTML = originalHTML;
        btn.disabled = false;
        closeWalkInCheckout();
        if (Array.isArray(walkinCart) && walkinCart.length > 0) {
            const txnId = 'TXN-' + Math.floor(100 + Math.random() * 900);
            const totalDue = (typeof walkinTotalDue !== 'undefined' && walkinTotalDue > 0) ? walkinTotalDue : walkinCart.reduce((acc, c) => acc + (c.price * c.qty), 0);
            const cartDetails = 'Purchased: ' + walkinCart.map(c => `${c.name} (x${c.qty})`).join(', ');

            walkinCart.forEach(cartItem => {
                const part = fullInventoryData.find(p => p.id === cartItem.id);
                if (part && part.stock > 0) {
                    const stockBefore = part.stock;
                    const qtyDeducted = Math.min(part.stock, cartItem.qty);
                    part.stock = Math.max(0, part.stock - cartItem.qty);
                    const stockAfter = part.stock;
                    if (typeof recordMovement === 'function') {
                        recordMovement({
                            part,
                            type: 'out',
                            quantity: qtyDeducted > 0 ? qtyDeducted : cartItem.qty,
                            stockBefore,
                            stockAfter,
                            reference: `Walk-in sale ${txnId}`
                        });
                    }
                }
            });

            if (typeof mockTxnData !== 'undefined' && Array.isArray(mockTxnData)) {
                mockTxnData.unshift({
                    id: txnId,
                    category: 'completed',
                    type: 'Walk-in Sale',
                    typeClass: 'text-slate-500 bg-slate-100 border-slate-200',
                    typeIcon: 'ph-shopping-bag',
                    customer: 'Walk-in Customer',
                    details: cartDetails,
                    amount: totalDue,
                    amountSuffix: '',
                    status: 'Fully Paid',
                    statusClass: 'bg-emerald-50 text-emerald-700 border-emerald-200',
                    statusDot: 'bg-emerald-500',
                    btnText: 'View Receipt',
                    btnClass: 'bg-white hover:bg-slate-50 text-slate-600 border-slate-300',
                    btnIcon: 'ph-receipt',
                    btnAction: 'openReceiptModal()',
                    date: new Date().toISOString()
                });
            }

            walkinCart = [];
            renderInventory();
            if (typeof updateDashboardWidgets === 'function') updateDashboardWidgets();
            if (typeof renderCashierHome === 'function') renderCashierHome();
            if (typeof renderReports === 'function') renderReports(typeof currentReportRange !== 'undefined' ? currentReportRange : 'today');
            if (typeof renderTransactions === 'function') renderTransactions();
        } else if (typeof mockTxnData !== 'undefined' && Array.isArray(mockTxnData)) {
            const unpaidWalkin = mockTxnData.find(t => t.id === 'TXN-101' || (t.category === 'walkin' && t.status === 'Unpaid'));
            if (unpaidWalkin) {
                unpaidWalkin.status = 'Fully Paid';
                unpaidWalkin.category = 'completed';
                unpaidWalkin.statusClass = 'bg-emerald-50 text-emerald-700 border-emerald-200';
                unpaidWalkin.statusDot = 'bg-emerald-500';
                unpaidWalkin.btnText = 'View Receipt';
                unpaidWalkin.btnClass = 'bg-white hover:bg-slate-50 text-slate-600 border-slate-300';
                unpaidWalkin.btnIcon = 'ph-receipt';
                unpaidWalkin.btnAction = 'openReceiptModal()';
                unpaidWalkin.date = new Date().toISOString();
                if (typeof updateDashboardWidgets === 'function') updateDashboardWidgets();
                if (typeof renderCashierHome === 'function') renderCashierHome();
                if (typeof renderReports === 'function') renderReports(typeof currentReportRange !== 'undefined' ? currentReportRange : 'today');
                if (typeof renderTransactions === 'function') renderTransactions();
            }
        }
        openReceiptModal();
    }, 800);
}

function openRepairCheckout(isFinalSettlement) {
    document.getElementById('repair-tendered').value = "";
    document.getElementById('repair-change').textContent = "0.00";
    
    const btnAdvance = document.getElementById('btn-advance-payment');
    const btnSettle = document.getElementById('btn-settle-balance');

    if(isFinalSettlement) {
        btnAdvance.classList.add('hidden');
        btnSettle.classList.remove('hidden');
    } else {
        btnAdvance.classList.remove('hidden');
        btnSettle.classList.add('hidden');
    }
    toggleModal('modal-txn-repair', 'txn-repair-backdrop', 'txn-repair-content', true);
}
function closeRepairCheckout() { toggleModal('modal-txn-repair', 'txn-repair-backdrop', 'txn-repair-content', false); }

function calcRepairChange() {
    const remainingBalance = 2000.00;
    const tendered = parseFloat(document.getElementById('repair-tendered').value) || 0;
    const changeLabel = document.getElementById('repair-change');
    if (tendered >= remainingBalance) {
        changeLabel.textContent = (tendered - remainingBalance).toFixed(2);
        changeLabel.classList.remove('text-red-400');
        changeLabel.classList.add('text-emerald-400');
    } else {
        changeLabel.textContent = "0.00";
        changeLabel.classList.remove('text-emerald-400');
        changeLabel.classList.add('text-red-400');
    }
}

function processRepairPayment(event) {
    const btn = event.currentTarget;
    const originalHTML = btn.innerHTML;
    btn.innerHTML = `<i class="ph-bold ph-spinner animate-spin text-lg"></i> Finalizing Job...`;
    btn.disabled = true;
    setTimeout(() => {
        btn.innerHTML = originalHTML;
        btn.disabled = false;
        closeRepairCheckout();
        if (typeof mockTxnData !== 'undefined' && Array.isArray(mockTxnData)) {
            const settleTxn = mockTxnData.find(t => t.id === 'TXN-103' || t.category === 'settle');
            if (settleTxn) {
                settleTxn.category = 'completed';
                settleTxn.status = 'Fully Paid';
                settleTxn.statusClass = 'bg-emerald-50 text-emerald-700 border-emerald-200';
                settleTxn.statusDot = 'bg-emerald-500';
                settleTxn.btnText = 'View Receipt';
                settleTxn.btnClass = 'bg-white hover:bg-slate-50 text-slate-600 border-slate-300';
                settleTxn.btnIcon = 'ph-receipt';
                settleTxn.btnAction = 'openReceiptModal()';
                settleTxn.date = new Date().toISOString();
            }
        }
        if (typeof updateDashboardWidgets === 'function') updateDashboardWidgets();
        if (typeof renderCashierHome === 'function') renderCashierHome();
        if (typeof renderTransactions === 'function') renderTransactions();
        openReceiptModal();
    }, 1000);
}

function openReceiptModal() {
    if (typeof applyShopDetails === 'function') applyShopDetails();
    toggleModal('modal-receipt', 'receipt-backdrop', 'receipt-content', true);
}
function closeReceiptModal() { toggleModal('modal-receipt', 'receipt-backdrop', 'receipt-content', false); }

// --- Service History & Audit Logic ---
function openHistoryDetailModal() { toggleModal('modal-history-detail', 'history-detail-backdrop', 'history-detail-content', true); }
function closeHistoryDetailModal() { toggleModal('modal-history-detail', 'history-detail-backdrop', 'history-detail-content', false); }

function openTimelineModal(plate, model) {
    document.getElementById('timeline-vehicle-details').textContent = `${plate} • ${model}`;
    toggleModal('modal-history-timeline', 'history-timeline-backdrop', 'history-timeline-content', true, 'slide');
}
function closeTimelineModal() { toggleModal('modal-history-timeline', 'history-timeline-backdrop', 'history-timeline-content', false, 'slide'); }

function toggleAuditDetail(detailId) {
    const detailRow = document.getElementById(detailId);
    const iconId = detailId.replace('audit-detail-', 'audit-icon-');
    const icon = document.getElementById(iconId);
    if(detailRow.classList.contains('hidden')) {
        detailRow.classList.remove('hidden');
        if(icon) icon.classList.add('rotate-180');
    } else {
        detailRow.classList.add('hidden');
        if(icon) icon.classList.remove('rotate-180');
    }
}

// --- User Management Modal Logic defined below in Interactive User Management Logic ---

// --- Customers & Motorcycles Logic ---
function toggleCustomerRow(rowId) {
    const detailRow = document.getElementById(rowId);
    const iconId = rowId.replace('cust-row-', 'cust-icon-');
    const icon = document.getElementById(iconId);
    
    if(detailRow.classList.contains('hidden')) {
        detailRow.classList.remove('hidden');
        if(icon) icon.classList.add('rotate-180', 'text-blue-500');
    } else {
        detailRow.classList.add('hidden');
        if(icon) icon.classList.remove('rotate-180', 'text-blue-500');
    }
}

function openCustomerModal() { toggleModal('modal-customer', 'customer-backdrop', 'customer-content', true); }
function closeCustomerModal() { toggleModal('modal-customer', 'customer-backdrop', 'customer-content', false); }

let regMotoState = {
    brandId: 'yamaha',
    brandText: '',
    model: 'Sniper'
};

function restoreRegMotoForm() {
    const chipsContainer = document.getElementById('reg-moto-brand-chips');
    const otherContainer = document.getElementById('reg-moto-brand-other-container');
    const otherInput = document.getElementById('reg-moto-brand-other');
    const modelInput = document.getElementById('reg-moto-model');
    const suggestionsContainer = document.getElementById('reg-moto-model-suggestions');
    
    if (!chipsContainer) return;
    
    // 1. Render brand chips
    chipsContainer.innerHTML = MOTORCYCLE_BRANDS_CONFIG.map(b => {
        const isSelected = regMotoState.brandId === b.id;
        const baseClass = "px-3 py-1.5 rounded-lg text-xs font-bold border transition-all cursor-pointer";
        const selectedClass = "bg-blue-600 text-white border-blue-600 shadow-sm";
        const unselectedClass = "bg-white text-slate-600 border-slate-200 hover:bg-slate-50";
        return `<button type="button" onclick="setRegMotoBrand('${b.id}')" class="${baseClass} ${isSelected ? selectedClass : unselectedClass}">${b.label}</button>`;
    }).join('');
    
    // 2. Free-text brand input for 'other'
    if (regMotoState.brandId === 'other') {
        if (otherContainer) otherContainer.classList.remove('hidden');
        if (otherInput) otherInput.value = regMotoState.brandText || '';
    } else {
        if (otherContainer) otherContainer.classList.add('hidden');
        if (otherInput) otherInput.value = '';
    }
    
    // 3. Model input & suggestions
    if (modelInput) {
        if (regMotoState.brandId === 'yamaha') {
            modelInput.placeholder = 'e.g. Sniper';
            if (modelInput.value !== regMotoState.model) modelInput.value = regMotoState.model || '';
        } else if (regMotoState.brandId === 'other') {
            modelInput.placeholder = 'e.g. exact model';
            if (modelInput.value !== regMotoState.model) modelInput.value = regMotoState.model || '';
        } else {
            modelInput.placeholder = 'e.g. model name';
            if (modelInput.value !== regMotoState.model) modelInput.value = regMotoState.model || '';
        }
    }
    
    // Suggestions
    if (suggestionsContainer) {
        const curConfig = MOTORCYCLE_BRANDS_CONFIG.find(b => b.id === regMotoState.brandId);
        if (curConfig && curConfig.suggestedModels && curConfig.suggestedModels.length > 0) {
            suggestionsContainer.classList.remove('hidden');
            suggestionsContainer.innerHTML = curConfig.suggestedModels.map(s => 
                `<button type="button" onclick="selectRegModelSuggestion('${s}')" class="px-2 py-0.5 rounded text-[11px] font-semibold bg-slate-100 text-slate-600 border border-slate-200 hover:bg-blue-50 hover:text-blue-600 transition-colors">${s}</button>`
            ).join('');
        } else {
            suggestionsContainer.classList.add('hidden');
            suggestionsContainer.innerHTML = '';
        }
    }
}

window.setRegMotoBrand = function(brandId) {
    const config = MOTORCYCLE_BRANDS_CONFIG.find(b => b.id === brandId);
    const targetId = config ? config.id : 'other';
    
    if (regMotoState.brandId !== targetId) {
        regMotoState.brandId = targetId;
        regMotoState.brandText = '';
        if (targetId === 'yamaha') {
            regMotoState.model = (config && config.defaultModel) ? config.defaultModel : 'Sniper';
        } else {
            regMotoState.model = '';
        }
    }
    restoreRegMotoForm();
};

window.selectRegModelSuggestion = function(modelName) {
    regMotoState.model = modelName;
    const modelInput = document.getElementById('reg-moto-model');
    if (modelInput) modelInput.value = modelName;
    restoreRegMotoForm();
};

window.updateRegMotoField = function(field, value) {
    if (field === 'brandOther') {
        regMotoState.brandId = 'other';
        regMotoState.brandText = value;
    } else if (field === 'model') {
        regMotoState.model = value;
    }
};

window.openMotorcycleModal = function() {
    regMotoState = {
        brandId: 'yamaha',
        brandText: '',
        model: 'Sniper'
    };
    const plateInput = document.getElementById('reg-moto-plate');
    if (plateInput) plateInput.value = '';
    const engineInput = document.getElementById('reg-moto-engine');
    if (engineInput) engineInput.value = '';
    restoreRegMotoForm();
    toggleModal('modal-motorcycle', 'motorcycle-backdrop', 'motorcycle-content', true);
};

function openMotorcycleModal() {
    window.openMotorcycleModal();
}

window.closeMotorcycleModal = function() {
    toggleModal('modal-motorcycle', 'motorcycle-backdrop', 'motorcycle-content', false);
};

function closeMotorcycleModal() {
    window.closeMotorcycleModal();
}

window.submitRegisterMotorcycle = function() {
    const brandName = getBrandLabel(regMotoState);
    const model = regMotoState.model || '';
    const plateInput = document.getElementById('reg-moto-plate');
    const engineInput = document.getElementById('reg-moto-engine');
    const plate = plateInput ? plateInput.value.trim() : '';
    const engine = engineInput ? engineInput.value.trim() : '';
    
    const make = `${brandName} ${model}`.trim();
    
    if (typeof mockCustomersData !== 'undefined' && mockCustomersData.length > 0) {
        mockCustomersData[0].vehicles.push({
            brandId: regMotoState.brandId,
            brandText: regMotoState.brandText,
            model: model,
            make: make,
            plate: plate || 'TBC',
            engine: engine || 'N/A',
            status: 'Cleared',
            statusClass: 'bg-emerald-50 text-emerald-700 border-emerald-200'
        });
        if (typeof renderCustomers === 'function') renderCustomers();
    }
    
    closeMotorcycleModal();
    if (typeof showToast === 'function') {
        showToast(`Vehicle ${make} registered successfully!`);
    }
};

document.addEventListener('keydown', function(event) {
    if (event.key === 'Escape') {
        closeCustomerModal();
        closeMotorcycleModal();
    }
});

function createRepairTicket(modelName, plateNumber) {
    if(confirm(`Do you want to create a new active repair ticket and run a diagnostic scan for:\n\n${modelName} (${plateNumber})?`)) {
        const diagLink = document.querySelector('.nav-link[data-target="diagnostics"]');
        if (diagLink) {
            diagLink.click();
        }
    }
}

// --- New Advance Payment Modal Logic ---
function openAdvanceModal() { 
    document.getElementById('advance-amount').value = "";
    document.getElementById('advance-remaining').textContent = "\u20B11,800.00";
    toggleModal('modal-advance', 'advance-backdrop', 'advance-content', true); 
}
function closeAdvanceModal() { toggleModal('modal-advance', 'advance-backdrop', 'advance-content', false); }

function calcRemainingAdvance() {
    const estimatedCost = 1800.00;
    const advance = parseFloat(document.getElementById('advance-amount').value) || 0;
    const remainingLabel = document.getElementById('advance-remaining');
    
    let remaining = estimatedCost - advance;
    if (remaining < 0) remaining = 0; // Prevent negative remaining balance
    
    remainingLabel.textContent = `\u20B1${remaining.toFixed(2)}`;
}

function confirmAdvancePayment(event) {
    const btn = event.currentTarget;
    const originalHTML = btn.innerHTML;
    btn.innerHTML = `<i class="ph-bold ph-spinner animate-spin text-lg"></i> Recording...`;
    btn.disabled = true;
    setTimeout(() => {
        btn.innerHTML = originalHTML;
        btn.disabled = false;
        closeAdvanceModal();
        if (typeof mockTxnData !== 'undefined' && Array.isArray(mockTxnData)) {
            const advTxn = mockTxnData.find(t => t.id === 'TXN-102' || t.category === 'advance');
            const advanceVal = parseFloat(document.getElementById('advance-amount')?.value) || 500;
            if (advTxn) {
                advTxn.status = `Partial/Adv Paid (\u20B1${advanceVal.toFixed(0)})`;
                advTxn.statusClass = 'bg-yellow-50 text-yellow-700 border-yellow-200';
                advTxn.statusDot = 'bg-yellow-500';
                advTxn.btnText = 'Settle Balance';
                advTxn.btnClass = 'bg-blue-600 hover:bg-blue-700 text-white shadow-md';
                advTxn.btnAction = 'openRepairCheckout(true)';
                advTxn.category = 'settle';
                advTxn.date = new Date().toISOString();
            }
        }
        if (typeof showToast === 'function') {
            showToast("Advance Payment successfully recorded!", "success");
        }
        if (typeof updateDashboardWidgets === 'function') updateDashboardWidgets();
        if (typeof renderCashierHome === 'function') renderCashierHome();
        if (typeof renderTransactions === 'function') renderTransactions();
    }, 800);
}

// --- Category & Part Type Configuration ---
const PART_TYPES = [
    { id: 'spare', label: 'Spare Parts', icon: 'ph-wrench', color: 'blue' },
    { id: 'engine', label: 'Engine Parts', icon: 'ph-engine', color: 'amber' },
    { id: 'accessory', label: 'Accessories', icon: 'ph-package', color: 'purple' }
];

const categoryConfig = {
    'Transmission & Drivetrain': { name: 'Transmission & Drivetrain', short: 'TRN', shortLabel: 'Transmission', icon: 'ph-nut', bg: 'bg-indigo-50', text: 'text-indigo-600', border: 'border-indigo-100', hasExpiry: false, type: 'engine' },
    'Electrical & Electronics': { name: 'Electrical & Electronics', short: 'ELE', shortLabel: 'Electrical', icon: 'ph-lightning', bg: 'bg-cyan-50', text: 'text-cyan-600', border: 'border-cyan-100', hasExpiry: false, type: 'spare' },
    'Fuel & Engine Intake': { name: 'Fuel & Engine Intake', short: 'FUE', shortLabel: 'Fuel & Intake', icon: 'ph-gas-pump', bg: 'bg-pink-50', text: 'text-pink-600', border: 'border-pink-100', hasExpiry: true, type: 'engine' },
    'Wheels & Tires': { name: 'Wheels & Tires', short: 'WHL', shortLabel: 'Wheels & Tires', icon: 'ph-circle', bg: 'bg-purple-50', text: 'text-purple-600', border: 'border-purple-100', hasExpiry: false, type: 'spare' },
    'Suspension, Brakes & Cooling': { name: 'Suspension, Brakes & Cooling', short: 'SUS', shortLabel: 'Suspension & Brakes', icon: 'ph-shield', bg: 'bg-teal-50', text: 'text-teal-600', border: 'border-teal-100', hasExpiry: false, type: 'spare' },
    'Accessories, Add-Ons & Consumables': { name: 'Accessories, Add-Ons & Consumables', short: 'ACC', shortLabel: 'Accessories', icon: 'ph-package', bg: 'bg-fuchsia-50', text: 'text-fuchsia-600', border: 'border-fuchsia-100', hasExpiry: false, type: 'accessory' }
};

function getPartType(part) {
    if (!part) return '';
    const cat = typeof part === 'string' ? part : (part.category || '');
    const conf = categoryConfig[cat];
    return (conf && conf.type) ? conf.type : '';
}
window.getPartType = getPartType;
window.PART_TYPES = PART_TYPES;

function getStockStatus(part) {
    if (!part) return 'ok';
    const stock = Number(part.stock) || 0;
    const min = (part.minStock !== undefined && part.minStock !== null) ? Number(part.minStock) : 5;
    if (stock === 0) return 'out';
    if (stock <= min) return 'low';
    return 'ok';
}
window.getStockStatus = getStockStatus;

function renderPartIconTile(item) {
    const cat = item.category || 'Uncategorized';
    const catConf = categoryConfig[cat] || { name: cat, icon: 'ph-package', bg: 'bg-slate-100', text: 'text-slate-600', border: 'border-slate-200' };
    const hasCustomImg = item.img && !item.img.includes('placehold.co');
    return `
        <div class="w-12 h-12 rounded-lg shrink-0 overflow-hidden border border-slate-200 bg-slate-50 flex items-center justify-center relative shadow-sm">
            <div class="absolute inset-0 flex items-center justify-center ${catConf.bg} ${catConf.text}">
                <i class="ph-bold ${catConf.icon} text-xl"></i>
            </div>
            ${hasCustomImg ? `<img src="${item.img}" class="absolute inset-0 w-full h-full object-cover z-10" onerror="this.style.display='none'">` : ''}
        </div>
    `;
}
window.renderPartIconTile = renderPartIconTile;

// --- Inventory Movements Data Model & Configuration ---
const MOVEMENT_TYPES = {
    in: {
        id: 'in',
        label: 'Stock In / Restock',
        icon: 'ph-arrow-down-left',
        color: 'emerald'
    },
    out: {
        id: 'out',
        label: 'Stock Out / Sale',
        icon: 'ph-arrow-up-right',
        color: 'red'
    },
    adjust: {
        id: 'adjust',
        label: 'Adjustment',
        icon: 'ph-sliders-horizontal',
        color: 'amber'
    },
    reserved: {
        id: 'reserved',
        label: 'Reserved for repair',
        icon: 'ph-lock-simple',
        color: 'blue'
    },
    released: {
        id: 'released',
        label: 'Reservation released',
        icon: 'ph-lock-simple-open',
        color: 'purple'
    },
    new: {
        id: 'new',
        label: 'New part added',
        icon: 'ph-plus-circle',
        color: 'indigo'
    }
};
window.MOVEMENT_TYPES = MOVEMENT_TYPES;

function calcMovementDate(daysAgo, hour = 10, min = 0) {
    const d = new Date();
    d.setDate(d.getDate() - daysAgo);
    d.setHours(hour, min, 0, 0);
    return d.toISOString();
}

const inventoryMovements = [
    {
        id: 'mov-10',
        timestamp: calcMovementDate(0, 8, 30),
        partId: 'SNP-009',
        partName: 'Engine Coolant Temperature (ECT) Sensor',
        sku: 'SNP-009',
        type: 'out',
        quantity: 1,
        stockBefore: 3,
        stockAfter: 2,
        reference: 'Walk-in sale TXN-101',
        performedBy: 'User (Owner/Cashier)'
    },
    {
        id: 'mov-9',
        timestamp: calcMovementDate(1, 14, 15),
        partId: '120701',
        partName: 'Sprocket (TRQ 38t)',
        sku: '120701',
        type: 'reserved',
        quantity: 2,
        stockBefore: 4,
        stockAfter: 4,
        reference: 'Job ABC-1234',
        performedBy: 'Larpus (Mechanic)'
    },
    {
        id: 'mov-8',
        timestamp: calcMovementDate(2, 11, 45),
        partId: '170010',
        partName: 'Battery (Spypower 12n5l)',
        sku: '170010',
        type: 'out',
        quantity: 1,
        stockBefore: 6,
        stockAfter: 5,
        reference: 'Job XYZ-9876',
        performedBy: 'Larpus (Mechanic)'
    },
    {
        id: 'mov-7',
        timestamp: calcMovementDate(4, 9, 20),
        partId: '212028',
        partName: 'Ignition Switch (TTGR TMX supremo)',
        sku: '212028',
        type: 'adjust',
        quantity: 1,
        stockBefore: 9,
        stockAfter: 10,
        reference: 'Physical audit adjustment',
        performedBy: 'System Admin (Super Admin)'
    },
    {
        id: 'mov-6',
        timestamp: calcMovementDate(5, 16, 10),
        partId: '980187',
        partName: 'Chain (Global 428h/120l)',
        sku: '980187',
        type: 'in',
        quantity: 10,
        stockBefore: 2,
        stockAfter: 12,
        reference: 'Restock PO-8821',
        performedBy: 'User (Owner/Cashier)'
    },
    {
        id: 'mov-5',
        timestamp: calcMovementDate(7, 13, 50),
        partId: '330027',
        partName: 'Tube Tire (Krx 2.25x17)',
        sku: '330027',
        type: 'released',
        quantity: 1,
        stockBefore: 8,
        stockAfter: 8,
        reference: 'Job J-401 reservation released',
        performedBy: 'User (Owner/Cashier)'
    },
    {
        id: 'mov-4',
        timestamp: calcMovementDate(9, 10, 5),
        partId: '211700',
        partName: 'Carburetor (Keihin xr200)',
        sku: '211700',
        type: 'out',
        quantity: 1,
        stockBefore: 3,
        stockAfter: 2,
        reference: 'Walk-in sale TXN-094',
        performedBy: 'User (Owner/Cashier)'
    },
    {
        id: 'mov-3',
        timestamp: calcMovementDate(11, 15, 30),
        partId: '021568',
        partName: 'Mini Driving Light (MRM-4502 v6)',
        sku: '021568',
        type: 'in',
        quantity: 6,
        stockBefore: 6,
        stockAfter: 12,
        reference: 'Supplier Restock',
        performedBy: 'User (Owner/Cashier)'
    },
    {
        id: 'mov-2',
        timestamp: calcMovementDate(13, 9, 0),
        partId: '330124',
        partName: 'Chain (Krx 428h/130l)',
        sku: '330124',
        type: 'new',
        quantity: 10,
        stockBefore: 0,
        stockAfter: 10,
        reference: 'New catalog entry',
        performedBy: 'System Admin (Super Admin)'
    },
    {
        id: 'mov-1',
        timestamp: calcMovementDate(14, 14, 20),
        partId: '121060',
        partName: 'Carburetor (Keihin tmx 155)',
        sku: '121060',
        type: 'out',
        quantity: 1,
        stockBefore: 5,
        stockAfter: 4,
        reference: 'Job J-398',
        performedBy: 'Larpus (Mechanic)'
    }
];
window.inventoryMovements = inventoryMovements;

function recordMovement(params = {}) {
    try {
        const safeParams = (params && typeof params === 'object') ? params : {};
        const rawPart = safeParams.part;

        let partObj = null;
        if (rawPart && typeof rawPart === 'object') {
            partObj = rawPart;
        } else if (rawPart !== undefined && rawPart !== null) {
            const rawId = String(rawPart);
            if (typeof fullInventoryData !== 'undefined' && Array.isArray(fullInventoryData)) {
                partObj = fullInventoryData.find(p => p && p.id === rawId);
            }
            if (!partObj && typeof mockInventory !== 'undefined' && Array.isArray(mockInventory)) {
                partObj = mockInventory.find(p => p && p.id === rawId);
            }
        }

        const partId = (partObj && partObj.id !== undefined && partObj.id !== null)
            ? String(partObj.id)
            : (rawPart && (typeof rawPart === 'string' || typeof rawPart === 'number') ? String(rawPart) : 'unknown');
        const partName = (partObj && partObj.name) ? String(partObj.name) : 'Unknown Part';
        const sku = (partObj && partObj.sku) ? String(partObj.sku) : partId;

        const rawType = safeParams.type;
        const type = (rawType && MOVEMENT_TYPES[rawType]) ? String(rawType) : 'adjust';

        const rawQty = safeParams.quantity;
        const quantity = Math.max(1, Math.abs(Number(rawQty) || 1));

        const currentStock = (partObj && typeof partObj.stock === 'number') ? partObj.stock : 0;

        let stockBefore;
        let stockAfter;

        if (safeParams.stockBefore !== undefined && safeParams.stockAfter !== undefined) {
            stockBefore = Number(safeParams.stockBefore);
            stockAfter = Number(safeParams.stockAfter);
        } else if (safeParams.stockBefore !== undefined) {
            stockBefore = Number(safeParams.stockBefore);
            if (type === 'in' || type === 'released') stockAfter = stockBefore + quantity;
            else if (type === 'out' || type === 'reserved') stockAfter = Math.max(0, stockBefore - quantity);
            else if (type === 'new') stockAfter = stockBefore + quantity;
            else stockAfter = stockBefore;
        } else if (safeParams.stockAfter !== undefined) {
            stockAfter = Number(safeParams.stockAfter);
            if (type === 'in' || type === 'released') stockBefore = Math.max(0, stockAfter - quantity);
            else if (type === 'out' || type === 'reserved') stockBefore = stockAfter + quantity;
            else if (type === 'new') stockBefore = 0;
            else stockBefore = stockAfter;
        } else {
            if (type === 'in') {
                stockBefore = Math.max(0, currentStock - quantity);
                stockAfter = currentStock;
            } else if (type === 'out') {
                stockBefore = currentStock + quantity;
                stockAfter = currentStock;
            } else if (type === 'reserved' || type === 'released') {
                stockBefore = currentStock;
                stockAfter = currentStock;
            } else if (type === 'new') {
                stockBefore = 0;
                stockAfter = currentStock;
            } else {
                stockBefore = currentStock;
                stockAfter = currentStock;
            }
        }

        const reference = (safeParams.reference && String(safeParams.reference).trim())
            ? String(safeParams.reference).trim()
            : (type === 'in' ? 'Restock' : (type === 'out' ? 'Stock Out' : 'Adjustment'));

        let performedBy = '';
        if (safeParams.performedBy && typeof safeParams.performedBy === 'string' && safeParams.performedBy.trim()) {
            performedBy = safeParams.performedBy.trim();
        } else {
            const roleKey = (typeof currentRole !== 'undefined' && currentRole) ||
                            (typeof sessionStorage !== 'undefined' && sessionStorage.getItem('currentUserRole')) ||
                            (typeof localStorage !== 'undefined' && localStorage.getItem('activeRole')) ||
                            'admin';
            const userObj = (typeof systemUsers !== 'undefined' && systemUsers && systemUsers[roleKey]) ? systemUsers[roleKey] : null;
            const roleConfig = (typeof ROLES_CONFIG !== 'undefined' && ROLES_CONFIG && ROLES_CONFIG[roleKey]) ? ROLES_CONFIG[roleKey] : null;
            const name = (userObj && userObj.name) ? userObj.name : 'User';
            const roleLabel = (roleConfig && (roleConfig.shortLabel || roleConfig.label)) || (userObj && userObj.role) || 'Owner/Cashier';
            performedBy = `${name} (${roleLabel})`;
        }

        const entry = {
            id: 'mov-' + Date.now() + '-' + Math.floor(Math.random() * 1000),
            timestamp: (safeParams.timestamp && typeof safeParams.timestamp === 'string') ? safeParams.timestamp : new Date().toISOString(),
            partId,
            partName,
            sku,
            type,
            quantity,
            stockBefore,
            stockAfter,
            reference,
            performedBy
        };

        if (typeof inventoryMovements !== 'undefined' && Array.isArray(inventoryMovements)) {
            inventoryMovements.unshift(entry);
        }
        if (typeof updateDashboardWidgets === 'function') {
            updateDashboardWidgets();
        }
        if (typeof renderReports === 'function' && typeof currentReportRange !== 'undefined') {
            renderReports(currentReportRange);
        }

        return entry;
    } catch (err) {
        const fallbackEntry = {
            id: 'mov-' + Date.now(),
            timestamp: new Date().toISOString(),
            partId: 'unknown',
            partName: 'Unknown Part',
            sku: 'unknown',
            type: 'adjust',
            quantity: 1,
            stockBefore: 0,
            stockAfter: 0,
            reference: 'Manual edit',
            performedBy: 'User (Owner/Cashier)'
        };
        if (typeof inventoryMovements !== 'undefined' && Array.isArray(inventoryMovements)) {
            inventoryMovements.unshift(fallbackEntry);
        }
        if (typeof updateDashboardWidgets === 'function') {
            updateDashboardWidgets();
        }
        if (typeof renderReports === 'function' && typeof currentReportRange !== 'undefined') {
            renderReports(currentReportRange);
        }
        return fallbackEntry;
    }
}
window.recordMovement = recordMovement;

// --- Inventory Movements View Controller ---

let currentInventoryTab = 'stock';
window.currentInventoryTab = currentInventoryTab;

function switchInventoryTab(tab) {
    if (tab === 'movements' && !hasFeature('viewMovements')) return;
    if (tab === 'stock' && !hasFeature('viewStock')) return;
    currentInventoryTab = tab || 'stock';
    window.currentInventoryTab = currentInventoryTab;

    const stockContent = document.getElementById('inv-tab-content-stock');
    const mvContent = document.getElementById('inv-tab-content-movements');
    const tabStockBtn = document.getElementById('tab-inv-stock');
    const tabMvBtn = document.getElementById('tab-inv-movements');

    if (currentInventoryTab === 'stock') {
        if (stockContent) stockContent.classList.remove('hidden');
        if (mvContent) mvContent.classList.add('hidden');
        if (tabStockBtn) {
            tabStockBtn.className = 'px-4 py-2.5 text-sm font-bold border-b-2 border-blue-600 text-blue-600 transition-colors flex items-center gap-2';
        }
        if (tabMvBtn) {
            tabMvBtn.className = 'px-4 py-2.5 text-sm font-semibold border-b-2 border-transparent text-slate-500 hover:text-slate-700 transition-colors flex items-center gap-2';
        }
    } else {
        if (stockContent) stockContent.classList.add('hidden');
        if (mvContent) mvContent.classList.remove('hidden');
        if (tabStockBtn) {
            tabStockBtn.className = 'px-4 py-2.5 text-sm font-semibold border-b-2 border-transparent text-slate-500 hover:text-slate-700 transition-colors flex items-center gap-2';
        }
        if (tabMvBtn) {
            tabMvBtn.className = 'px-4 py-2.5 text-sm font-bold border-b-2 border-blue-600 text-blue-600 transition-colors flex items-center gap-2';
        }
        renderMovements();
    }
}
window.switchInventoryTab = switchInventoryTab;

function formatMovementDateTime(isoString) {
    if (!isoString) return '-';
    try {
        const d = new Date(isoString);
        if (isNaN(d.getTime())) return isoString;
        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        const month = months[d.getMonth()];
        const day = d.getDate();
        const year = d.getFullYear();
        let hours = d.getHours();
        const minutes = String(d.getMinutes()).padStart(2, '0');
        const ampm = hours >= 12 ? 'PM' : 'AM';
        hours = hours % 12;
        hours = hours ? hours : 12;
        return `${month} ${day}, ${year} ${hours}:${minutes} ${ampm}`;
    } catch (e) {
        return isoString;
    }
}

function renderMovementBadge(type) {
    const conf = (typeof MOVEMENT_TYPES !== 'undefined' && MOVEMENT_TYPES[type]) ? MOVEMENT_TYPES[type] : {
        label: type || 'Movement',
        icon: 'ph-arrows-left-right',
        color: 'slate'
    };
    
    const colorClasses = {
        emerald: 'bg-emerald-50 text-emerald-700 border-emerald-200',
        red: 'bg-red-50 text-red-700 border-red-200',
        amber: 'bg-amber-50 text-amber-700 border-amber-200',
        blue: 'bg-blue-50 text-blue-700 border-blue-200',
        purple: 'bg-purple-50 text-purple-700 border-purple-200',
        indigo: 'bg-indigo-50 text-indigo-700 border-indigo-200',
        slate: 'bg-slate-50 text-slate-700 border-slate-200'
    };
    const cls = colorClasses[conf.color] || colorClasses.slate;
    return `<span class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-bold border ${cls}"><i class="ph-bold ${conf.icon}"></i> ${conf.label}</span>`;
}

function formatMovementQty(item) {
    const qty = Number(item.quantity) || 0;
    const type = item.type;
    if (type === 'in' || type === 'new' || type === 'released') {
        return `<span class="font-bold text-emerald-600">+${qty}</span>`;
    }
    if (type === 'out' || type === 'reserved') {
        return `<span class="font-bold text-red-600">-${qty}</span>`;
    }
    if (type === 'adjust') {
        if (item.stockAfter > item.stockBefore) {
            return `<span class="font-bold text-emerald-600">+${qty}</span>`;
        }
        if (item.stockAfter < item.stockBefore) {
            return `<span class="font-bold text-red-600">-${qty}</span>`;
        }
        return `<span class="font-bold text-slate-700">${qty}</span>`;
    }
    return `<span class="font-bold text-slate-700">${qty}</span>`;
}

function matchesMovementDate(timestamp, range) {
    if (!range || range === 'all') return true;
    if (!timestamp) return false;
    const itemDate = new Date(timestamp);
    if (isNaN(itemDate.getTime())) return false;
    const now = new Date();
    
    if (range === 'today') {
        return itemDate.getFullYear() === now.getFullYear() &&
               itemDate.getMonth() === now.getMonth() &&
               itemDate.getDate() === now.getDate();
    }
    if (range === '7d') {
        const diffMs = now.getTime() - itemDate.getTime();
        return diffMs >= 0 && diffMs <= 7 * 24 * 60 * 60 * 1000;
    }
    if (range === '30d') {
        const diffMs = now.getTime() - itemDate.getTime();
        return diffMs >= 0 && diffMs <= 30 * 24 * 60 * 60 * 1000;
    }
    return true;
}

function getMovementPartType(item) {
    if (!item) return '';
    let part = null;
    if (typeof fullInventoryData !== 'undefined' && Array.isArray(fullInventoryData)) {
        part = fullInventoryData.find(p => p && p.id === item.partId);
    }
    if (!part && typeof mockInventory !== 'undefined' && Array.isArray(mockInventory)) {
        part = mockInventory.find(p => p && p.id === item.partId);
    }
    if (part && typeof getPartType === 'function') {
        return getPartType(part);
    }
    return '';
}

function toggleMovementCard(id) {
    const body = document.getElementById(`m-mv-body-${id}`);
    const icon = document.getElementById(`m-mv-icon-${id}`);
    if (!body) return;
    
    const isHidden = body.classList.contains('hidden');
    if (isHidden) {
        body.classList.remove('hidden');
        if (icon) icon.classList.add('rotate-180', 'text-blue-500');
    } else {
        body.classList.add('hidden');
        if (icon) icon.classList.remove('rotate-180', 'text-blue-500');
    }
}
window.toggleMovementCard = toggleMovementCard;

function clearMovementFilters() {
    const searchEl = document.getElementById('mv-search');
    if (searchEl) searchEl.value = '';
    const typeEl = document.getElementById('mv-filter-type');
    if (typeEl) typeEl.value = '';
    const dateEl = document.getElementById('mv-filter-date');
    if (dateEl) dateEl.value = 'all';
    const partTypeEl = document.getElementById('mv-filter-part-type');
    if (partTypeEl) partTypeEl.value = '';
    renderMovements();
}
window.clearMovementFilters = clearMovementFilters;

function renderMovements() {
    const tableBody = document.getElementById('mv-tbody');
    const mobileContainer = document.getElementById('mv-mobile-cards');
    const resultsCount = document.getElementById('mv-results-count');

    // Clear containers before rendering
    if (tableBody) tableBody.innerHTML = '';
    if (mobileContainer) mobileContainer.innerHTML = '';

    const query = (document.getElementById('mv-search')?.value || '').toLowerCase().trim();
    const typeFilter = document.getElementById('mv-filter-type')?.value || '';
    const dateFilter = document.getElementById('mv-filter-date')?.value || 'all';
    const partTypeFilter = document.getElementById('mv-filter-part-type')?.value || '';

    const movements = (typeof inventoryMovements !== 'undefined' && Array.isArray(inventoryMovements)) ? inventoryMovements : [];

    const filtered = movements.filter(item => {
        if (!item) return false;

        const matchesQuery = !query ||
            (item.partName && item.partName.toLowerCase().includes(query)) ||
            (item.sku && item.sku.toLowerCase().includes(query)) ||
            (item.reference && item.reference.toLowerCase().includes(query));

        const matchesType = !typeFilter || item.type === typeFilter;
        const matchesDate = matchesMovementDate(item.timestamp, dateFilter);
        const matchesPartType = !partTypeFilter || getMovementPartType(item) === partTypeFilter;

        return matchesQuery && matchesType && matchesDate && matchesPartType;
    });

    // Sort newest first
    filtered.sort((a, b) => {
        const timeA = a.timestamp ? new Date(a.timestamp).getTime() : 0;
        const timeB = b.timestamp ? new Date(b.timestamp).getTime() : 0;
        return timeB - timeA;
    });

    if (filtered.length === 0) {
        if (resultsCount) {
            resultsCount.textContent = 'Showing 0 movements';
            resultsCount.classList.remove('hidden');
        }
        const emptyHtml = `
            <div class="py-12 px-6 text-center bg-slate-50 rounded-xl border border-slate-200 text-slate-500 font-medium flex flex-col items-center gap-3 w-full">
                <i class="ph-bold ph-magnifying-glass text-4xl text-slate-300"></i>
                <div>No movements found</div>
                <button type="button" onclick="clearMovementFilters()" class="px-5 py-2.5 bg-white border border-slate-200 rounded-lg text-sm font-bold text-slate-700 hover:bg-slate-100 shadow-sm mt-2 transition-colors">Clear filters</button>
            </div>
        `;
        if (tableBody) {
            tableBody.innerHTML = `<tr><td colspan="7" class="p-6 text-center text-slate-500">${emptyHtml}</td></tr>`;
        }
        if (mobileContainer) {
            mobileContainer.innerHTML = emptyHtml;
        }
        return;
    }

    if (resultsCount) {
        resultsCount.textContent = `Showing ${filtered.length} movement${filtered.length === 1 ? '' : 's'}`;
        resultsCount.classList.remove('hidden');
    }

    let tableHtml = '';
    let mobileHtml = '';

    filtered.forEach(item => {
        const safePartName = item.partName || 'Unknown Part';
        const safeSku = item.sku ? '#' + item.sku : '';
        const safeBefore = (item.stockBefore !== undefined && item.stockBefore !== null) ? item.stockBefore : '-';
        const safeAfter = (item.stockAfter !== undefined && item.stockAfter !== null) ? item.stockAfter : '-';
        const safeRef = item.reference || '-';
        const safeBy = item.performedBy || '-';

        // Desktop table row
        tableHtml += `
            <tr class="hover:bg-slate-50/80 transition-colors">
                <td class="p-3.5 text-xs text-slate-600 whitespace-nowrap">${formatMovementDateTime(item.timestamp)}</td>
                <td class="p-3.5">
                    <div class="font-bold text-slate-800 text-sm leading-snug">${safePartName}</div>
                    <div class="text-[11px] text-slate-400 font-mono mt-0.5">${safeSku}</div>
                </td>
                <td class="p-3.5 whitespace-nowrap">${renderMovementBadge(item.type)}</td>
                <td class="p-3.5 whitespace-nowrap text-sm">${formatMovementQty(item)}</td>
                <td class="p-3.5 whitespace-nowrap">
                    <div class="flex items-center gap-1.5 text-xs font-mono">
                        <span class="text-slate-500">${safeBefore}</span>
                        <i class="ph-bold ph-arrow-right text-[10px] text-slate-400"></i>
                        <span class="font-bold text-slate-800">${safeAfter}</span>
                    </div>
                </td>
                <td class="p-3.5 text-xs text-slate-700 font-medium">${safeRef}</td>
                <td class="p-3.5 text-xs text-slate-600 whitespace-nowrap">${safeBy}</td>
            </tr>
        `;

        // Mobile card (collapsed by default)
        mobileHtml += `
            <div class="bg-white rounded-xl border border-slate-200 shadow-sm flex flex-col overflow-hidden">
                <div class="p-3.5 flex items-start gap-3 cursor-pointer hover:bg-slate-50 transition-colors" onclick="toggleMovementCard('${item.id}')">
                    <div class="flex-1 min-w-0">
                        <div class="flex items-center justify-between gap-2 mb-1.5">
                            <span class="text-[11px] text-slate-400 font-medium">${formatMovementDateTime(item.timestamp)}</span>
                            <div>${formatMovementQty(item)}</div>
                        </div>
                        <div class="font-bold text-slate-800 text-sm leading-tight truncate">${safePartName}</div>
                        <div class="text-[11px] text-slate-400 font-mono mt-0.5 mb-2">${safeSku}</div>
                        <div class="flex items-center justify-between">
                            <div>${renderMovementBadge(item.type)}</div>
                            <i id="m-mv-icon-${item.id}" class="ph-bold ph-caret-down text-slate-400 text-base transition-transform"></i>
                        </div>
                    </div>
                </div>
                <div id="m-mv-body-${item.id}" class="hidden p-3.5 pt-2 border-t border-slate-100 bg-slate-50/60 flex flex-col gap-2 text-xs">
                    <div class="flex items-center justify-between">
                        <span class="text-slate-500 font-semibold">Stock:</span>
                        <div class="flex items-center gap-1.5 font-mono">
                            <span class="text-slate-500">${safeBefore}</span>
                            <i class="ph-bold ph-arrow-right text-[10px] text-slate-400"></i>
                            <span class="font-bold text-slate-800">${safeAfter}</span>
                        </div>
                    </div>
                    <div class="flex items-center justify-between">
                        <span class="text-slate-500 font-semibold">Reference:</span>
                        <span class="font-medium text-slate-700 truncate max-w-[200px]" title="${safeRef}">${safeRef}</span>
                    </div>
                    <div class="flex items-center justify-between">
                        <span class="text-slate-500 font-semibold">Performed By:</span>
                        <span class="font-medium text-slate-700">${safeBy}</span>
                    </div>
                </div>
            </div>
        `;
    });

    if (tableBody) tableBody.innerHTML = tableHtml;
    if (mobileContainer) mobileContainer.innerHTML = mobileHtml;

    if (typeof lucide !== 'undefined' && lucide.createIcons) {
        lucide.createIcons();
    }
}
window.renderMovements = renderMovements;

let currentSummaryFilter = '';
window.currentSummaryFilter = currentSummaryFilter;

function renderSummaryStrip() {
    const strip = document.getElementById('inv-summary-strip');
    if (!strip) return;

    const totalCount = fullInventoryData.length;
    const lowCount = fullInventoryData.filter(p => getStockStatus(p) === 'low').length;
    const outCount = fullInventoryData.filter(p => getStockStatus(p) === 'out').length;
    const expiringCount = fullInventoryData.filter(p => {
        if (typeof getExpiryStatus !== 'function') return false;
        const st = getExpiryStatus(p);
        return st && (st.status === 'soon' || st.status === 'expired');
    }).length;

    const isTotalActive = currentSummaryFilter === 'total';
    const isLowActive = currentSummaryFilter === 'low';
    const isOutActive = currentSummaryFilter === 'out';
    const isExpActive = currentSummaryFilter === 'expiring';

    strip.innerHTML = `
        <button type="button" onclick="toggleSummaryFilter('total')" class="text-left p-3.5 rounded-xl border-2 transition-all cursor-pointer flex items-center justify-between ${isTotalActive ? 'border-blue-500 bg-blue-50/80 ring-2 ring-blue-500/20 shadow-md' : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50 shadow-sm'}">
            <div class="min-w-0 pr-2">
                <div class="text-[11px] font-bold uppercase tracking-wider text-slate-500 truncate">Total Items</div>
                <div class="text-2xl font-extrabold text-slate-800 mt-0.5">${totalCount}</div>
            </div>
            <div class="w-10 h-10 rounded-lg bg-blue-100/70 text-blue-600 flex items-center justify-center text-xl shrink-0">
                <i class="ph-bold ph-stack"></i>
            </div>
        </button>

        <button type="button" onclick="toggleSummaryFilter('low')" class="text-left p-3.5 rounded-xl border-2 transition-all cursor-pointer flex items-center justify-between ${isLowActive ? 'border-amber-500 bg-amber-50/80 ring-2 ring-amber-500/20 shadow-md' : 'border-slate-200 bg-white hover:border-amber-300 hover:bg-slate-50 shadow-sm'}">
            <div class="min-w-0 pr-2">
                <div class="text-[11px] font-bold uppercase tracking-wider text-slate-500 truncate">Low Stock</div>
                <div class="text-2xl font-extrabold text-amber-600 mt-0.5">${lowCount}</div>
            </div>
            <div class="w-10 h-10 rounded-lg bg-amber-100/70 text-amber-600 flex items-center justify-center text-xl shrink-0">
                <i class="ph-bold ph-warning"></i>
            </div>
        </button>

        <button type="button" onclick="toggleSummaryFilter('out')" class="text-left p-3.5 rounded-xl border-2 transition-all cursor-pointer flex items-center justify-between ${isOutActive ? 'border-red-500 bg-red-50/80 ring-2 ring-red-500/20 shadow-md' : 'border-slate-200 bg-white hover:border-red-300 hover:bg-slate-50 shadow-sm'}">
            <div class="min-w-0 pr-2">
                <div class="text-[11px] font-bold uppercase tracking-wider text-slate-500 truncate">Out of Stock</div>
                <div class="text-2xl font-extrabold text-red-600 mt-0.5">${outCount}</div>
            </div>
            <div class="w-10 h-10 rounded-lg bg-red-100/70 text-red-600 flex items-center justify-center text-xl shrink-0">
                <i class="ph-bold ph-x-circle"></i>
            </div>
        </button>

        <button type="button" onclick="toggleSummaryFilter('expiring')" class="text-left p-3.5 rounded-xl border-2 transition-all cursor-pointer flex items-center justify-between ${isExpActive ? 'border-orange-500 bg-orange-50/80 ring-2 ring-orange-500/20 shadow-md' : 'border-slate-200 bg-white hover:border-orange-300 hover:bg-slate-50 shadow-sm'}">
            <div class="min-w-0 pr-2">
                <div class="text-[11px] font-bold uppercase tracking-wider text-slate-500 truncate">Expiring / Expired</div>
                <div class="text-2xl font-extrabold text-orange-600 mt-0.5">${expiringCount}</div>
            </div>
            <div class="w-10 h-10 rounded-lg bg-orange-100/70 text-orange-600 flex items-center justify-center text-xl shrink-0">
                <i class="ph-bold ph-clock-countdown"></i>
            </div>
        </button>
    `;
}

window.toggleSummaryFilter = function(filterType) {
    if (filterType === 'total') {
        currentSummaryFilter = '';
    } else if (currentSummaryFilter === filterType) {
        currentSummaryFilter = '';
    } else {
        currentSummaryFilter = filterType;
    }
    window.currentSummaryFilter = currentSummaryFilter;

    const stockSelect = document.getElementById('inv-filter-stock');
    if (stockSelect) {
        if (currentSummaryFilter === 'low') stockSelect.value = 'low';
        else if (currentSummaryFilter === 'out') stockSelect.value = 'out';
        else stockSelect.value = '';
    }

    renderInventory();
};

let currentPartTypeFilter = '';
window.currentPartTypeFilter = currentPartTypeFilter;

let currentCategoryFilter = '';
window.currentCategoryFilter = currentCategoryFilter;

function populateCategoryDropdowns(typeFilter) {
    const activeType = (typeFilter !== undefined) ? typeFilter : currentPartTypeFilter;
    const formSelect = document.getElementById('add-part-category');
    const chipWrap = document.getElementById('inv-chip-wrap');
    
    const categoriesToShow = Object.keys(categoryConfig).filter(cat => {
        if (!activeType) return true;
        return categoryConfig[cat].type === activeType;
    });
    
    if (currentCategoryFilter && !categoriesToShow.includes(currentCategoryFilter)) {
        currentCategoryFilter = '';
        window.currentCategoryFilter = '';
    }
    
    if (formSelect) {
        if (formSelect.options.length <= 1) {
            let formHtml = '<option value="">Select a Category...</option>';
            Object.keys(categoryConfig).forEach(cat => {
                formHtml += `<option value="${cat}">${cat}</option>`;
            });
            formSelect.innerHTML = formHtml;
        }
    }
    
    if (chipWrap) {
        let chipHtml = `<button onclick="setCategoryFilter('')" class="inv-cat-chip shrink-0 px-4 py-2 rounded-full text-sm font-bold border transition-colors bg-blue-600 text-white border-blue-600 h-[40px] whitespace-nowrap" data-cat="">All</button>`;
        categoriesToShow.forEach(cat => {
            const conf = categoryConfig[cat];
            const label = (conf && conf.shortLabel) ? conf.shortLabel : (conf ? conf.name : cat);
            const icon = (conf && conf.icon) ? conf.icon : 'ph-package';
            chipHtml += `<button onclick="setCategoryFilter('${cat.replace(/'/g, "\\'")}')" class="inv-cat-chip shrink-0 px-4 py-2 rounded-full text-sm font-bold border transition-colors bg-white text-slate-600 border-slate-200 hover:bg-slate-50 flex items-center gap-1.5 h-[40px] whitespace-nowrap" data-cat="${cat}"><i class="ph-bold ${icon} text-lg"></i> ${label}</button>`;
        });
        chipWrap.innerHTML = chipHtml;
    }
}

window.setCategoryFilter = function(cat) {
    currentCategoryFilter = cat || '';
    window.currentCategoryFilter = currentCategoryFilter;
    renderInventory();
};

window.setPartTypeFilter = function(typeId) {
    currentPartTypeFilter = typeId || '';
    window.currentPartTypeFilter = currentPartTypeFilter;
    populateCategoryDropdowns(currentPartTypeFilter);
    renderInventory();
};

window.clearInvFilters = function() {
    currentPartTypeFilter = '';
    window.currentPartTypeFilter = '';
    currentSummaryFilter = '';
    window.currentSummaryFilter = '';
    currentCategoryFilter = '';
    window.currentCategoryFilter = '';
    const searchInput = document.getElementById('inv-search');
    if (searchInput) searchInput.value = '';
    const stockSelect = document.getElementById('inv-filter-stock');
    if (stockSelect) stockSelect.value = '';
    populateCategoryDropdowns('');
    renderInventory();
};

document.addEventListener('DOMContentLoaded', () => {
    populateCategoryDropdowns();
});

function updatePartExpiryVisibility(form) {
    if (!form) return;
    const catSelect = form.querySelector('#add-part-category');
    if (!catSelect) return;
    const val = catSelect.value;
    const conf = categoryConfig[val];
    const container = form.querySelector('.part-expiry-field');
    if (!container) return;
    const input = container.querySelector('.part-expiry-input');
    
    if (conf && conf.hasExpiry) {
        container.classList.remove('hidden');
    } else {
        container.classList.add('hidden');
        if (input) input.value = ''; // clear when hidden
    }
}

document.addEventListener('change', (e) => {
    if (e.target.id === 'add-part-category') {
        const form = e.target.closest('#modal-add-part');
        if (form) updatePartExpiryVisibility(form);
    }
});

// --- Interactive Inventory Logic ---



// --- EXPIRY DATE DEMO DATA ---
(function() {
    function addDaysLocal(date, days) {
        const d = new Date(date);
        d.setDate(d.getDate() + days);
        return d;
    }
    
    function formatDateLocal(d) {
        const year = d.getFullYear();
        const month = String(d.getMonth() + 1).padStart(2, '0');
        const day = String(d.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    }

    const today = new Date();
    
    const targets = {
        '211700': formatDateLocal(addDaysLocal(today, -10)),
        '121060': formatDateLocal(addDaysLocal(today, 15)),
        '212031': formatDateLocal(addDaysLocal(today, 180)),
        '330161': formatDateLocal(addDaysLocal(today, 365))
    };
    
    mockInventory.forEach(p => {
        if (targets[p.id]) {
            p.expiryDate = targets[p.id];
        } else if (p.id === '981057') {
            p.expiryDate = '';
        }
    });
})();

const SOON_DAYS = 30;

window.getExpiryStatus = function(part) {
    if (!part || !part.expiryDate) return { status: 'none', days: 0 };
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const [y, m, d] = part.expiryDate.split('-');
    const expDate = new Date(y, m - 1, d);
    
    const diffTime = expDate - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays < 0) {
        return { status: 'expired', days: diffDays };
    } else if (diffDays <= SOON_DAYS) {
        return { status: 'soon', days: diffDays };
    } else {
        return { status: 'ok', days: diffDays };
    }
};

function getExpiryStatus(part) {
    return window.getExpiryStatus(part);
}
// --- END EXPIRY DATE DEMO DATA ---

const fullInventoryData = mockInventory;


// Map inspection item IDs to part IDs (SKUs in this case matching id)
const inspectionToPartMapping = {
    'pad_f': 'PROTO-B01',
    'tire_r': 'PROTO-T01',
    'coolant': 'SNP-009'
};

// Apply mappings dynamically
Object.keys(inspectionToPartMapping).forEach(itemId => {
    const partId = inspectionToPartMapping[itemId];
    const part = mockInventory.find(p => p.id === partId);
    if (part) {
        if (!part.linkedInspectionItems) part.linkedInspectionItems = [];
        part.linkedInspectionItems.push({ itemId, qty: 1 });
    }
});
function renderInventory() {
    const tbody = document.getElementById('inventory-tbody');
    if (!tbody) return;

    renderSummaryStrip();

    const isMobile = document.body.classList.contains('mobile-app');
    
    // Check Permissions
    const canRestock = hasFeature('restock');
    const canAdd = hasFeature('addPart');
    const canEdit = hasFeature('editPart');
    const canWalkIn = hasFeature('walkInSale');
    const canAutoAssign = hasFeature('autoAssign');
    const showActions = canEdit || canWalkIn;

    const tabMvBtn = document.getElementById('tab-inv-movements');
    if (tabMvBtn) {
        tabMvBtn.classList.toggle('hidden', !hasFeature('viewMovements'));
    }
    const tabStockBtn = document.getElementById('tab-inv-stock');
    if (tabStockBtn) {
        tabStockBtn.classList.toggle('hidden', !hasFeature('viewStock'));
    }

    // Apply Permissions to top bar
    const btnWrap = document.getElementById('inv-btn-wrap');
    if (btnWrap) {
        let html = '';
        
        if (isMobile) {
            let topButtons = [];
            if (canAutoAssign) {
                topButtons.push(`<button onclick="openAutoAssignLinks()" class="flex-1 bg-white hover:bg-purple-50 text-purple-700 border border-purple-300 h-[44px] rounded-lg text-sm font-semibold transition-colors shadow-sm flex items-center justify-center gap-1.5 whitespace-nowrap"><i class="ph-bold ph-magic-wand"></i> Auto Assign</button>`);
            }
            if (canRestock) {
                topButtons.push(`<button onclick="openRestockModal()" class="flex-1 bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 h-[44px] rounded-lg text-sm font-semibold transition-colors shadow-sm flex items-center justify-center gap-1.5 whitespace-nowrap"><i class="ph-bold ph-arrows-clockwise"></i> Restock Items</button>`);
            }
            
            if (topButtons.length > 0) {
                html += `<div class="flex gap-2 w-full">${topButtons.join('')}</div>`;
            }
            
            if (canAdd) {
                html += `<button onclick="openAddPartModal()" class="w-full bg-blue-600 hover:bg-blue-700 text-white h-[44px] rounded-lg text-sm font-semibold transition-colors shadow-sm flex items-center justify-center gap-1.5 whitespace-nowrap"><i class="ph-bold ph-plus"></i> Add New Part</button>`;
            }
            
        } else {
            if (canAutoAssign) {
                html += `<button onclick="openAutoAssignLinks()" class="flex-1 lg:flex-none bg-white hover:bg-purple-50 text-purple-700 border border-purple-300 px-4 py-2 rounded-lg text-sm font-semibold transition-colors shadow-sm flex items-center justify-center gap-1.5 whitespace-nowrap">
                    <i class="ph-bold ph-magic-wand"></i> Auto Assign
                </button>`;
            }
            if (canRestock) {
                html += `<button onclick="openRestockModal()" class="flex-1 lg:flex-none bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 px-4 py-2 rounded-lg text-sm font-semibold transition-colors shadow-sm flex items-center justify-center gap-1.5 whitespace-nowrap">
                    <i class="ph-bold ph-arrows-clockwise"></i> Restock Items
                </button>`;
            }
            if (canAdd) {
                html += `<button onclick="openAddPartModal()" class="flex-1 lg:flex-none bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-semibold transition-colors shadow-sm flex items-center justify-center gap-1.5 whitespace-nowrap">
                    <i class="ph-bold ph-plus"></i> Add New Part
                </button>`;
            }
        }
        
        if (!html) {
            btnWrap.className = 'hidden';
            btnWrap.innerHTML = '';
        } else {
            btnWrap.className = isMobile ? 'w-full shrink-0 flex flex-col gap-2 mt-1' : 'flex flex-wrap gap-2 w-full lg:w-auto shrink-0';
            btnWrap.innerHTML = html;
        }
    }

    // Adjust table classes on mobile and action header
    const thead = document.querySelector('#view-inventory thead');
    const table = document.querySelector('#view-inventory table');
    if (thead) {
        if (isMobile) {
            thead.classList.add('hidden');
            table?.classList.remove('min-w-[900px]');
        } else {
            thead.classList.remove('hidden');
            table?.classList.add('min-w-[900px]');
        }
        
        const tr = thead.querySelector('tr');
        if (tr) {
            const ths = tr.querySelectorAll('th');
            if (ths.length >= 5) {
                ths[4].style.display = showActions ? '' : 'none';
            }
        }
    }

    // Render Desktop Type Tabs
    const typeTabsContainer = document.getElementById('inv-type-tabs');
    if (typeTabsContainer) {
        const allCount = fullInventoryData.length;
        const isAllActive = !currentPartTypeFilter;
        let tabsHtml = `
            <button onclick="setPartTypeFilter('')" class="inv-type-tab pb-3 px-3.5 text-sm font-semibold border-b-2 transition-colors flex items-center gap-2 ${isAllActive ? 'border-blue-600 text-blue-600 font-bold' : 'border-transparent text-slate-500 hover:text-slate-800 hover:border-slate-300'}">
                <i class="ph-bold ph-squares-four text-base"></i>
                <span>All Parts</span>
                <span class="text-xs px-2 py-0.5 rounded-full ${isAllActive ? 'bg-blue-100 text-blue-700 font-bold' : 'bg-slate-100 text-slate-600 font-medium'}">${allCount}</span>
            </button>
        `;
        PART_TYPES.forEach(t => {
            const count = fullInventoryData.filter(p => getPartType(p) === t.id).length;
            const isActive = currentPartTypeFilter === t.id;
            tabsHtml += `
                <button onclick="setPartTypeFilter('${t.id}')" class="inv-type-tab pb-3 px-3.5 text-sm font-semibold border-b-2 transition-colors flex items-center gap-2 ${isActive ? 'border-blue-600 text-blue-600 font-bold' : 'border-transparent text-slate-500 hover:text-slate-800 hover:border-slate-300'}">
                    <i class="ph-bold ${t.icon} text-base"></i>
                    <span>${t.label}</span>
                    <span class="text-xs px-2 py-0.5 rounded-full ${isActive ? 'bg-blue-100 text-blue-700 font-bold' : 'bg-slate-100 text-slate-600 font-medium'}">${count}</span>
                </button>
            `;
        });
        typeTabsContainer.innerHTML = tabsHtml;
    }

    // Render Mobile Type Chips
    const typeChipWrap = document.getElementById('inv-type-chip-wrap');
    if (typeChipWrap) {
        const allCount = fullInventoryData.length;
        const isAllActive = !currentPartTypeFilter;
        let chipsHtml = `
            <button onclick="setPartTypeFilter('')" class="inv-type-chip shrink-0 px-3.5 py-1.5 rounded-full text-xs font-bold border transition-colors flex items-center gap-1.5 h-[36px] ${isAllActive ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'}">
                <i class="ph-bold ph-squares-four"></i>
                <span>All Parts</span>
                <span class="text-[10px] px-1.5 py-0.5 rounded-full ${isAllActive ? 'bg-blue-700 text-white' : 'bg-slate-100 text-slate-600'}">${allCount}</span>
            </button>
        `;
        PART_TYPES.forEach(t => {
            const count = fullInventoryData.filter(p => getPartType(p) === t.id).length;
            const isActive = currentPartTypeFilter === t.id;
            chipsHtml += `
                <button onclick="setPartTypeFilter('${t.id}')" class="inv-type-chip shrink-0 px-3.5 py-1.5 rounded-full text-xs font-bold border transition-colors flex items-center gap-1.5 h-[36px] ${isActive ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'}">
                    <i class="ph-bold ${t.icon}"></i>
                    <span>${t.label}</span>
                    <span class="text-[10px] px-1.5 py-0.5 rounded-full ${isActive ? 'bg-blue-700 text-white' : 'bg-slate-100 text-slate-600'}">${count}</span>
                </button>
            `;
        });
        typeChipWrap.innerHTML = chipsHtml;
    }

    // Get filter values
    const query = (document.getElementById('inv-search')?.value || '').toLowerCase();
    const stockFilter = document.getElementById('inv-filter-stock')?.value || '';
    const rawCatFilter = isMobile ? (currentCategoryFilter || '') : '';
    const catFilter = rawCatFilter.toLowerCase();
    
    // Update chip styling based on selection
    const chips = document.querySelectorAll('.inv-cat-chip');
    chips.forEach(chip => {
        const cVal = chip.getAttribute('data-cat');
        if (cVal === rawCatFilter) {
            if (cVal === '') {
                chip.className = 'inv-cat-chip shrink-0 px-4 py-2 rounded-full text-sm font-bold border transition-colors bg-blue-600 text-white border-blue-600 h-[40px] whitespace-nowrap';
            } else {
                const conf = categoryConfig[cVal];
                chip.className = `inv-cat-chip shrink-0 px-4 py-2 rounded-full text-sm font-bold border transition-colors flex items-center gap-1.5 h-[40px] whitespace-nowrap ${conf ? `${conf.bg} ${conf.text} ${conf.border}` : 'bg-blue-600 text-white border-blue-600'}`;
            }
            if (isMobile && chip.offsetParent !== null) {
                try {
                    chip.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'nearest' });
                } catch (e) {
                    chip.scrollIntoView();
                }
            }
        } else {
            if (cVal === '') {
                chip.className = 'inv-cat-chip shrink-0 px-4 py-2 rounded-full text-sm font-bold border transition-colors bg-white text-slate-600 border-slate-200 hover:bg-slate-50 h-[40px] whitespace-nowrap';
            } else {
                chip.className = 'inv-cat-chip shrink-0 px-4 py-2 rounded-full text-sm font-bold border transition-colors bg-white text-slate-600 border-slate-200 hover:bg-slate-50 flex items-center gap-1.5 h-[40px] whitespace-nowrap';
            }
        }
    });

    // Apply filters
    const filtered = fullInventoryData.filter(item => {
        const matchesSearch = item.name.toLowerCase().includes(query) || item.sku.toLowerCase().includes(query) || item.comp.toLowerCase().includes(query);
        
        let matchesStock = true;
        const activeStock = currentSummaryFilter || stockFilter;
        if (activeStock === 'low') matchesStock = getStockStatus(item) === 'low';
        else if (activeStock === 'out') matchesStock = getStockStatus(item) === 'out';
        else if (activeStock === 'expiring') {
            const expSt = (typeof getExpiryStatus === 'function') ? getExpiryStatus(item) : null;
            matchesStock = !!(expSt && (expSt.status === 'soon' || expSt.status === 'expired'));
        }

        let matchesType = true;
        if (currentPartTypeFilter) {
            matchesType = getPartType(item) === currentPartTypeFilter;
        }

        let matchesCat = true;
        if (query === '' && catFilter) {
            matchesCat = item.category.toLowerCase().includes(catFilter);
        }

        return matchesSearch && matchesStock && matchesType && matchesCat;
    });

    // Update result count
    const countEl = document.getElementById('inv-results-count');
    if (countEl) {
        if (isMobile) {
            countEl.textContent = `${filtered.length} part${filtered.length === 1 ? '' : 's'}`;
        } else {
            countEl.textContent = '';
        }
    }

    // Render HTML
    const mobileContainer = document.getElementById('inventory-mobile-cards');

    let mobileHtml = '<div class="flex flex-col gap-2">';
    
    if (query !== '') {
        mobileHtml += `<div class="text-xs text-slate-500 font-medium px-2 py-1 flex items-center gap-1.5 bg-slate-50 rounded-lg border border-slate-200 mb-1"><i class="ph-fill ph-info text-slate-400"></i> Showing results from all categories</div>`;
    }

    if (filtered.length === 0) {
        tbody.innerHTML = `<tr><td colspan="5" class="p-8 text-center text-slate-500 font-medium">No items found matching your criteria. <button onclick="clearInvFilters()" class="text-blue-600 font-bold hover:underline ml-2">Clear filters</button></td></tr>`;
        if (mobileContainer) {
            mobileContainer.innerHTML = mobileHtml + `<div class="py-12 px-6 text-center bg-slate-50 rounded-xl border border-slate-200 text-slate-500 font-medium flex flex-col items-center gap-3"><i class="ph-bold ph-magnifying-glass text-4xl text-slate-300"></i> <div>No parts found</div><button onclick="clearInvFilters()" class="px-5 py-2.5 bg-white border border-slate-200 rounded-lg text-sm font-bold text-slate-700 hover:bg-slate-100 shadow-sm mt-2 transition-colors">Clear filters</button></div></div>`;
        }
        updateDashboardWidgets();
        if (typeof lucide !== 'undefined' && lucide.createIcons) {
            lucide.createIcons();
        }
        return;
    }

    // 1. Generate Desktop HTML
    tbody.innerHTML = filtered.map(item => {
        // DESKTOP TABLE LAYOUT
        let stockBadge = '';
        let rowClass = 'hover:bg-blue-50/30 transition-colors';
        let btnStatus = `onclick="openWalkInModalInv('${item.name.replace(/'/g, "\\'")}', '${item.price.toFixed(2)}')" class="bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 px-3 py-1.5 rounded-md text-xs font-bold transition-colors flex items-center gap-1"`;

        const stockSt = getStockStatus(item);
        if (stockSt === 'out') {
            stockBadge = `<span class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-bold bg-red-100 text-red-700 border border-red-200"><span class="w-2 h-2 rounded-full bg-red-500"></span> 0 Available</span>`;
            rowClass += ' opacity-75 bg-slate-50';
            btnStatus = `disabled class="bg-slate-100 text-slate-400 border border-slate-200 px-3 py-1.5 rounded-md text-xs font-bold cursor-not-allowed flex items-center gap-1"`;
        } else if (stockSt === 'low') {
            stockBadge = `<span class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-bold bg-yellow-100 text-yellow-700 border border-yellow-200"><span class="w-2 h-2 rounded-full bg-yellow-500 animate-pulse"></span> ${item.stock} Available</span>`;
        } else {
            stockBadge = `<span class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-bold bg-emerald-100 text-emerald-700 border border-emerald-200"><span class="w-2 h-2 rounded-full bg-emerald-500"></span> ${item.stock} Available</span>`;
        }

        let expBadgeDesktop = '';
        if (typeof getExpiryStatus === 'function') {
            const st = getExpiryStatus(item);
            let fDate = item.expiryDate;
            if (item.expiryDate) {
                const [y, m, d] = item.expiryDate.split('-');
                const dt = new Date(y, m - 1, d);
                fDate = dt.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
            }
            if (st.status === 'expired') {
                expBadgeDesktop = `<div class="mt-1.5 inline-flex items-center gap-1 text-[10px] font-bold text-red-600 border border-red-200 bg-red-50 px-1.5 py-0.5 rounded"><i class="ph ph-calendar"></i> Expired ${fDate}</div>`;
            } else if (st.status === 'soon') {
                expBadgeDesktop = `<div class="mt-1.5 inline-flex items-center gap-1 text-[10px] font-bold text-orange-600 border border-orange-200 bg-orange-50 px-1.5 py-0.5 rounded"><i class="ph ph-calendar"></i> Expires in ${st.days} days</div>`;
            } else if (st.status === 'ok') {
                expBadgeDesktop = `<div class="mt-1.5 inline-flex items-center gap-1 text-[10px] font-bold text-slate-500 border border-slate-200 bg-slate-50 px-1.5 py-0.5 rounded"><i class="ph ph-calendar"></i> Exp: ${fDate}</div>`;
            }
        }

        let dtcTag = item.dtc ? `<span class="inline-flex items-center gap-1 bg-slate-100 text-slate-600 px-2 py-0.5 rounded text-[10px] font-bold border border-slate-200"><i class="ph-bold ph-cpu text-blue-500"></i> Linked DTC: ${item.dtc}</span>` : '';
        let autoLinksTag = (item.linkedInspectionItems && item.linkedInspectionItems.length > 0) ? `<span class="inline-flex items-center gap-1 bg-purple-50 text-purple-700 px-2 py-0.5 rounded text-[10px] font-bold border border-purple-200 ml-1"><i class="ph-bold ph-magic-wand text-purple-500"></i> Auto: ${item.linkedInspectionItems.map(l => (typeof inspectionItemMap !== 'undefined' && inspectionItemMap[l.itemId]) ? inspectionItemMap[l.itemId].label : l.itemId).join(', ')}</span>` : '';

        return `
            <tr class="${rowClass}">
                <td class="p-4">
                    <div class="flex items-center gap-3">
                        ${renderPartIconTile(item)}
                        <div>
                            <div class="font-bold text-slate-800">${item.name}</div>
                            <div class="text-[11px] text-slate-500 mt-0.5 mb-1.5">SKU: ${item.sku} | Comp: ${item.comp}</div>
                            <div>${dtcTag}${autoLinksTag}</div>
                        </div>
                    </div>
                </td>
                <td class="p-4">
                    <div class="font-medium text-slate-600">${item.category}</div>
                </td>
                <td class="p-4 font-bold text-slate-800">\u20B1${item.price.toFixed(2)}</td>
                <td class="p-4">
                    <div class="flex flex-col items-start">
                        ${stockBadge}
                        ${expBadgeDesktop}
                        <div class="text-[10px] font-semibold text-slate-400 mt-1 ml-1">(${item.reserved} Reserved)</div>
                    </div>
                </td>
                ${showActions ? `
                <td class="p-4 text-right">
                    <div class="flex justify-end gap-2">
                        ${canEdit ? `<button onclick="openEditPartModal('${item.id}')" class="text-slate-500 hover:text-blue-600 hover:bg-blue-50 p-1.5 rounded transition-colors"><i class="ph-bold ph-pencil-simple text-lg"></i></button>` : ''}
                        ${canWalkIn ? `<button ${btnStatus}>
                            <i class="ph-bold ph-shopping-cart-simple"></i> Walk-in Sale
                        </button>` : ''}
                    </div>
                </td>
                ` : ''}
            </tr>
        `;
    }).join('');

    // 2. Generate Mobile Cards HTML
    if (mobileContainer) {
        // Sort filtered array by category order, then by name
        const catOrder = Object.keys(categoryConfig);
        const sortedFiltered = [...filtered].sort((a, b) => {
            const catA = catOrder.indexOf(a.category);
            const catB = catOrder.indexOf(b.category);
            if (catA !== catB) return catA - catB;
            return a.name.localeCompare(b.name);
        });

        // mobileHtml is already initialized above with the search banner if needed
        
        sortedFiltered.forEach(item => {
            const cat = item.category || 'Uncategorized';
            const catConf = categoryConfig[cat] || { name: cat, icon: 'ph-box', bg: 'bg-slate-100', text: 'text-slate-600', border: 'border-slate-200' };
            
            const stockSt = getStockStatus(item);
            let stockBadgeMobile = '';
            if (stockSt === 'out') stockBadgeMobile = `<span class="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-bold bg-red-100 text-red-700">0 Available</span>`;
            else if (stockSt === 'low') stockBadgeMobile = `<span class="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-bold bg-yellow-100 text-yellow-700">${item.stock} Available</span>`;
            else stockBadgeMobile = `<span class="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-700">${item.stock} Available</span>`;
            
            let isOut = stockSt === 'out';
            let dtcTag = item.dtc ? `<span class="inline-flex items-center gap-1 bg-slate-100 text-slate-600 px-2 py-0.5 rounded text-[10px] font-bold border border-slate-200"><i class="ph-bold ph-cpu text-blue-500"></i> Linked DTC: ${item.dtc}</span>` : '';
            
            let expDot = '';
            let expRow = '';
            if (typeof getExpiryStatus === 'function') {
                const st = getExpiryStatus(item);
                let fDate = item.expiryDate;
                if (item.expiryDate) {
                    const [y, m, d] = item.expiryDate.split('-');
                    const dt = new Date(y, m - 1, d);
                    fDate = dt.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
                }
                if (st.status === 'expired') {
                    expDot = '<span class="w-2 h-2 rounded-full bg-red-500 inline-block ml-2 mb-0.5 shadow-sm border border-red-200"></span>';
                    expRow = `<div class="flex justify-between items-center"><span class="font-bold">Expires</span><span class="text-red-600 font-bold flex items-center gap-1"><i class="ph ph-calendar"></i> ${fDate}</span></div>`;
                } else if (st.status === 'soon') {
                    expDot = '<span class="w-2 h-2 rounded-full bg-orange-500 inline-block ml-2 mb-0.5 shadow-sm border border-orange-200"></span>';
                    expRow = `<div class="flex justify-between items-center"><span class="font-bold">Expires</span><span class="text-orange-600 font-bold flex items-center gap-1"><i class="ph ph-calendar"></i> In ${st.days} days</span></div>`;
                } else if (st.status === 'ok') {
                    expRow = `<div class="flex justify-between items-center"><span class="font-bold">Expires</span><span class="text-slate-500 font-medium flex items-center gap-1"><i class="ph ph-calendar"></i> ${fDate}</span></div>`;
                }
            }
            
            mobileHtml += `
            <div class="bg-white rounded-xl border border-slate-200 shadow-sm flex flex-col ${isOut ? 'opacity-75' : ''}">
                <div class="p-3 flex items-start gap-3 cursor-pointer hover:bg-slate-50 transition-colors" onclick="toggleInvPartCard('${item.id}')">
                    ${renderPartIconTile(item)}
                    <div class="flex-1 min-w-0">
                        <div class="font-bold text-slate-800 text-sm leading-tight">${item.name}${expDot}</div>
                        <div class="text-[11px] text-slate-400 font-mono mt-0.5">#${item.sku}</div>
                        <div class="flex items-center justify-between mt-1.5">
                            <span class="font-bold text-slate-700 text-sm">\u20B1${item.price.toLocaleString('en-US', {minimumFractionDigits: 2})}</span>
                            ${stockBadgeMobile}
                        </div>
                    </div>
                    <div class="shrink-0 pt-3">
                        <i id="m-inv-icon-${item.id}" class="ph-bold ph-caret-down text-slate-400 transition-transform"></i>
                    </div>
                </div>
                <div id="m-inv-body-${item.id}" class="hidden border-t border-slate-100 bg-slate-50/50 p-3">
                    <div class="flex flex-col gap-2 text-xs text-slate-600 ${showActions ? 'mb-4' : ''}">
                        <div class="flex justify-between items-center"><span class="font-bold">Category</span><span class="inline-flex items-center gap-1 ${catConf.bg} ${catConf.text} px-1.5 py-0.5 rounded font-bold">${catConf.name}</span></div>
                        <div class="flex justify-between items-center"><span class="font-bold">Compatible</span><span class="text-slate-500">${item.comp}</span></div>
                        <div class="flex justify-between items-center"><span class="font-bold">Reserved</span><span class="text-slate-500">${item.reserved}</span></div>
                        <div class="flex justify-between items-center"><span class="font-bold">Min Stock</span><span class="text-slate-500">${item.minStock}</span></div>
                        ${expRow}
                        ${item.dtc ? `<div class="mt-1">${dtcTag}</div>` : ''}
                    </div>
                    ${showActions ? `
                    <div class="flex flex-col gap-2">
                        ${canEdit ? `<button onclick="openEditPartModal('${item.id}')" class="w-full h-[44px] text-slate-600 border border-slate-200 bg-white hover:bg-slate-50 rounded-lg font-bold text-sm flex items-center justify-center gap-1.5 shadow-sm transition-colors"><i class="ph-bold ph-pencil-simple text-lg"></i> Edit</button>` : ''}
                        ${canWalkIn ? `<button ${isOut ? 'disabled' : `onclick="openWalkInModalInv('${item.name.replace(/'/g, "\\'")}', '${item.price.toFixed(2)}')"`} class="w-full h-[44px] rounded-lg font-bold text-sm flex items-center justify-center gap-1.5 shadow-sm transition-colors ${isOut ? 'bg-slate-100 text-slate-400 border border-slate-200 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700 text-white border border-transparent'}"><i class="ph-bold ph-shopping-cart-simple text-lg"></i> Walk-in Sale</button>` : ''}
                    </div>` : ''}
                </div>
            </div>
            `;
        });
        
        mobileHtml += '</div>';
        
        mobileContainer.innerHTML = mobileHtml;
    }
    updateDashboardWidgets();
    if (typeof renderMovements === 'function') {
        renderMovements();
    }
    if (typeof lucide !== 'undefined' && lucide.createIcons) {
        lucide.createIcons();
    }
}

function getTopSellingList() {
    const counts = {
        'Motul 7100 10W-40 1L': 45,
        'Yamaha Brake Pad Set': 28,
        'NGK Spark Plug CPR8EA-9': 18
    };
    if (typeof inventoryMovements !== 'undefined' && Array.isArray(inventoryMovements)) {
        inventoryMovements.forEach(m => {
            if (m && m.type === 'out' && m.partName) {
                const qty = Number(m.quantity) || 0;
                counts[m.partName] = (counts[m.partName] || 0) + qty;
            }
        });
    }
    const list = Object.keys(counts).map(name => ({ name, sold: counts[name] }));
    list.sort((a, b) => b.sold - a.sold);
    return list;
}
window.getTopSellingList = getTopSellingList;

function updateDashboardWidgets() {
    const lowStockParts = mockInventory.filter(p => getStockStatus(p) === 'low');
    const outOfStockParts = mockInventory.filter(p => getStockStatus(p) === 'out');
    
    const expiredParts = [];
    const soonParts = [];
    if (typeof getExpiryStatus === 'function') {
        mockInventory.forEach(p => {
            const st = getExpiryStatus(p);
            if (st.status === 'expired') expiredParts.push(p);
            else if (st.status === 'soon') {
                p._soonDays = st.days;
                soonParts.push(p);
            }
        });
    }
    const totalAlerts = lowStockParts.length + outOfStockParts.length + expiredParts.length + soonParts.length;


    const countEl = document.getElementById('dashboard-inventory-alerts-count');
    if (countEl) countEl.textContent = totalAlerts;

    const kpiTotal = document.getElementById('kpi-alert-total');
    const kpiLow = document.getElementById('kpi-alert-low');
    const kpiOut = document.getElementById('kpi-alert-out');
    if (kpiTotal) kpiTotal.textContent = totalAlerts;
    if (kpiLow) kpiLow.textContent = lowStockParts.length;
    if (kpiOut) kpiOut.textContent = outOfStockParts.length;

    const dashText = document.getElementById('dashboard-restock-alert-text');
    const mobileText = document.getElementById('mobile-restock-alert-text');
    
    let textParts = [];
    if (outOfStockParts.length > 0) {
        textParts.push(`${outOfStockParts[0].name} is out of stock!`);
    }
    if (lowStockParts.length > 0) {
        textParts.push(`${lowStockParts[0].name} is low (${lowStockParts[0].stock} left).`);
    }
    
    
    expiredParts.forEach(p => {
        textParts.push(`<div class="mb-1"><span class="text-red-600 font-bold">Expired:</span> ${p.name}</div>`);
    });
    soonParts.forEach(p => {
        textParts.push(`<div class="mb-1"><span class="text-orange-600 font-bold">Expiring soon:</span> ${p.name} (${p._soonDays} days)</div>`);
    });
    
    textParts = textParts.map(t => t.startsWith('<div') ? t : `<div class="mb-1">${t}</div>`);
    
    const alertHtml = textParts.length > 0 ? textParts.join('') : 'Inventory levels are looking good.';
    
    if (dashText) dashText.innerHTML = alertHtml;
    if (mobileText) mobileText.innerHTML = alertHtml;

    const backupAlert = document.getElementById('dashboard-backup-alert');
    if (backupAlert) {
        const canBackup = rolePermissions[currentRole] && rolePermissions[currentRole].includes('backup');
        backupAlert.style.display = canBackup ? 'flex' : 'none';
    }

    const reportsTbody = document.getElementById('reports-low-stock-tbody');
    if (reportsTbody) {
        const allAlertParts = [...outOfStockParts, ...lowStockParts];
        if (allAlertParts.length === 0) {
            reportsTbody.innerHTML = `<tr><td colspan="2" class="p-4 text-center text-slate-400 text-xs italic">No low stock items in this period</td></tr>`;
        } else {
            reportsTbody.innerHTML = allAlertParts.map(p => `
                <tr class="hover:bg-slate-50 transition-colors">
                    <td class="p-3 font-semibold text-slate-700">${p.name}</td>
                    <td class="p-3 text-center">
                        <span class="${p.stock === 0 ? 'bg-red-100 text-red-700' : 'bg-orange-100 text-orange-700'} px-2 py-0.5 rounded font-bold">${p.stock}</span>
                    </td>
                </tr>
            `).join('');
        }
    }

    const topSelling = document.getElementById('reports-top-selling');
    if (topSelling) {
        const topParts = getTopSellingList();
        if (!topParts.length || topParts.every(p => !p.sold)) {
            topSelling.innerHTML = `<div class="p-6 text-center text-slate-400 text-xs italic">No fast-moving items in this period</div>`;
        } else {
            const maxSold = Math.max(...topParts.map(p => p.sold), 1);
            const colors = ['bg-emerald-500', 'bg-emerald-400', 'bg-emerald-300'];
            topSelling.innerHTML = topParts.slice(0, 3).map((p, i) => `
                <div>
                    <div class="flex justify-between text-xs mb-1"><span class="font-semibold text-slate-700">${i+1}. ${p.name}</span><span class="font-bold text-slate-500">${p.sold} sold</span></div>
                    <div class="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden"><div class="${colors[i] || 'bg-emerald-300'} h-2.5 rounded-full" style="width: ${Math.round((p.sold / maxSold) * 100)}%"></div></div>
                </div>
            `).join('');
        }
    }

    if (document.getElementById('view-cashier-home') && typeof renderCashierHome === 'function') {
        renderCashierHome();
    }
}

// Global Event Listeners for Inventory Filtering
document.addEventListener('input', function(e) {
    if (e.target.id === 'inv-search') renderInventory();
    if (e.target.id === 'mv-search') renderMovements();
});

document.addEventListener('change', function(e) {
    if (e.target.id === 'inv-filter-stock') {
        currentSummaryFilter = e.target.value;
        window.currentSummaryFilter = currentSummaryFilter;
        renderInventory();
    } else if (e.target.id === 'mv-filter-type' || e.target.id === 'mv-filter-date' || e.target.id === 'mv-filter-part-type') {
        renderMovements();
    }
});

// --- Interactive Walk-In Cart Logic ---

let walkinCart = [];
let walkinTotalDue = 0;

// Updates HTML list and calculates totals
function renderWalkinCart() {
    const container = document.getElementById('walkin-cart-container');
    const totalLabel = document.getElementById('walkin-total-due');
    if (!container || !totalLabel) return;

    walkinTotalDue = walkinCart.reduce((sum, item) => sum + (item.price * item.qty), 0);
    totalLabel.textContent = `\u20B1${walkinTotalDue.toFixed(2)}`;

    if (walkinCart.length === 0) {
        container.innerHTML = `<div class="text-center p-6 bg-slate-50 rounded-lg border border-slate-200 border-dashed text-xs text-slate-400 font-medium">Cart is empty. Search and select parts above.</div>`;
    } else {
        container.innerHTML = walkinCart.map((item, index) => `
            <div class="bg-white p-3 border border-slate-200 rounded-lg flex justify-between items-center shadow-sm animate-[fadeIn_0.2s_ease-out]">
                <div class="flex-1">
                    <div class="text-sm font-bold text-slate-700 truncate pr-2">${item.name}</div>
                    <div class="text-xs text-slate-500">\u20B1${item.price.toFixed(2)} / unit</div>
                </div>
                <div class="flex items-center gap-2 sm:gap-4">
                    <div class="flex items-center bg-slate-50 rounded-md border border-slate-200">
                        <button class="px-2 py-1 text-slate-400 hover:text-emerald-600 btn-cart-minus transition-colors" data-index="${index}"><i class="ph-bold ph-minus"></i></button>
                        <span class="w-6 text-center text-xs font-bold text-slate-700">${item.qty}</span>
                        <button class="px-2 py-1 text-slate-400 hover:text-emerald-600 btn-cart-plus transition-colors" data-index="${index}"><i class="ph-bold ph-plus"></i></button>
                    </div>
                    <div class="text-sm font-bold text-slate-800 w-16 text-right">\u20B1${(item.price * item.qty).toFixed(2)}</div>
                    <button class="text-slate-400 hover:text-red-500 p-1 btn-cart-remove" data-index="${index}"><i class="ph-bold ph-trash"></i></button>
                </div>
            </div>
        `).join('');
    }
    
    // Automatically trigger change calculation whenever cart updates
    calcWalkinChange(); 
}

// 1. Search Bar Autocomplete Listener
document.addEventListener('input', function(e) {
    if (e.target.id === 'walkin-search-input') {
        const query = e.target.value.toLowerCase();
        const dropdown = document.getElementById('walkin-autocomplete-dropdown');
        
        if (!query) {
            dropdown.classList.add('hidden');
            return;
        }
        
        const matches = typeof fullInventoryData !== 'undefined' ? fullInventoryData.filter(p => p.name.toLowerCase().includes(query) || p.sku.toLowerCase().includes(query)) : [];
        
        if (matches.length > 0) {
            dropdown.innerHTML = matches.map(part => {
    let expText = '';
    if (typeof getExpiryStatus === 'function' && getExpiryStatus(part).status === 'expired') {
        expText = '<span class="text-red-600 text-[10px] font-bold ml-1.5">Expired</span>';
    }
    return `
                <div class="p-3 border-b border-slate-100 hover:bg-slate-50 cursor-pointer flex justify-between items-center walkin-autocomplete-item" data-id="${part.id}">
                    <div>
                        <div class="text-sm font-bold text-slate-800">${part.name}${expText}</div>
                        <div class="text-[10px] text-slate-500">Stock Available: ${part.stock}</div>
                    </div>
                    <div class="text-sm font-bold text-emerald-600">\u20B1${part.price.toFixed(2)}</div>
                </div>
            `;
}).join('');
            dropdown.classList.remove('hidden');
        } else {
            dropdown.innerHTML = `<div class="p-3 text-sm text-slate-500 text-center">No parts found matching "${query}".</div>`;
            dropdown.classList.remove('hidden');
        }
    }
});

// 2. Click Delegate for Cart Actions & Autocomplete Selection
document.addEventListener('click', function(e) {
    // Add Item to Cart
    const autocompleteItem = e.target.closest('.walkin-autocomplete-item');
    if (autocompleteItem) {
        const partId = autocompleteItem.getAttribute('data-id');
        const part = fullInventoryData.find(p => p.id === partId);
        
        if (part && part.stock > 0) {
            const existingItem = walkinCart.find(item => item.id === partId);
            if (existingItem) {
                if(existingItem.qty < part.stock) existingItem.qty += 1;
                else showToast('Not enough stock available for this item.');
            } else {
                walkinCart.push({ ...part, qty: 1 });
            }
            renderWalkinCart();
        } else {
            showToast('This item is out of stock.');
        }
        
        document.getElementById('walkin-search-input').value = '';
        document.getElementById('walkin-autocomplete-dropdown').classList.add('hidden');
    }

    // Minus Button
    const btnMinus = e.target.closest('.btn-cart-minus');
    if (btnMinus) {
        const idx = btnMinus.getAttribute('data-index');
        if (walkinCart[idx].qty > 1) walkinCart[idx].qty -= 1;
        renderWalkinCart();
    }

    // Plus Button
    const btnPlus = e.target.closest('.btn-cart-plus');
    if (btnPlus) {
        const idx = btnPlus.getAttribute('data-index');
        if (walkinCart[idx].qty < walkinCart[idx].stock) walkinCart[idx].qty += 1;
        else showToast('You cannot exceed the available stock limit.');
        renderWalkinCart();
    }

    // Remove Button
    const btnRemove = e.target.closest('.btn-cart-remove');
    if (btnRemove) {
        const idx = btnRemove.getAttribute('data-index');
        walkinCart.splice(idx, 1);
        renderWalkinCart();
    }

    // Hide dropdown if clicked outside
    if (!e.target.closest('#walkin-autocomplete-dropdown') && !e.target.closest('#walkin-search-input')) {
        const dropdown = document.getElementById('walkin-autocomplete-dropdown');
        if (dropdown) dropdown.classList.add('hidden');
    }
});

// 3. Override Change Calculator
window.calcWalkinChange = function() {
    const tendered = parseFloat(document.getElementById('walkin-tendered')?.value) || 0;
    const changeLabel = document.getElementById('walkin-change');
    
    if (!changeLabel) return;

    if (tendered >= walkinTotalDue && walkinTotalDue > 0) {
        changeLabel.textContent = `\u20B1${(tendered - walkinTotalDue).toFixed(2)}`;
        changeLabel.parentElement.classList.remove('text-red-400');
        changeLabel.parentElement.classList.add('text-emerald-400');
    } else {
        changeLabel.textContent = "\u20B10.00";
        changeLabel.parentElement.classList.remove('text-emerald-400');
        changeLabel.parentElement.classList.add('text-red-400');
    }
};

// 4. Override Open Modal to clear previous data
window.openWalkInCheckout = function() {
    if (!hasFeature('walkInSale')) {
        if (typeof closeWalkInCheckout === 'function') closeWalkInCheckout();
        showToast("You don't have permission to do this.");
        return;
    }
    walkinCart = []; // Reset Cart Array
    walkinTotalDue = 0;
    
    if (document.getElementById('walkin-search-input')) document.getElementById('walkin-search-input').value = "";
    if (document.getElementById('walkin-tendered')) document.getElementById('walkin-tendered').value = "";
    
    renderWalkinCart(); // Triggers empty state render
    toggleModal('modal-txn-walkin', 'txn-walkin-backdrop', 'txn-walkin-content', true); 
};

// Dynamic sample transaction dates calculated relative to today
const _initTxnDate = new Date();
const _txnTodayMorning = new Date(_initTxnDate.getFullYear(), _initTxnDate.getMonth(), _initTxnDate.getDate(), 9, 30).toISOString();
const _txnTodayMidday = new Date(_initTxnDate.getFullYear(), _initTxnDate.getMonth(), _initTxnDate.getDate(), 11, 0).toISOString();
const _txnYesterday = new Date(_initTxnDate.getFullYear(), _initTxnDate.getMonth(), _initTxnDate.getDate() - 1, 14, 15).toISOString();

// --- Interactive Transactions Queue & Filter Logic ---
let currentTxnFilter = 'all';
const mockTxnData = [
    {
        id: 'TXN-101',
        category: 'walkin',
        type: 'Walk-in Sale',
        typeClass: 'text-emerald-600 bg-emerald-50 border-emerald-100',
        typeIcon: 'ph-shopping-bag',
        customer: 'Walk-in Customer',
        details: 'Purchased: Engine Coolant Temperature (ECT) Sensor (x1)',
        amount: 850.00,
        amountSuffix: '',
        status: 'Unpaid',
        statusClass: 'bg-red-50 text-red-600 border-red-100',
        statusDot: 'bg-red-500',
        btnText: 'Process Payment',
        btnClass: 'bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border-emerald-200',
        btnIcon: 'ph-wallet',
        btnAction: 'openWalkInCheckout()',
        date: _txnTodayMidday
    },
    {
        id: 'TXN-102',
        category: 'advance',
        type: 'Repair Service',
        typeClass: 'text-orange-600 bg-orange-50 border-orange-100',
        typeIcon: 'ph-wrench',
        customer: 'Juan Dela Cruz',
        details: 'Yamaha Sniper 150 (ABC-1234)',
        amount: 1800.00,
        amountSuffix: '<span class="text-[10px] font-normal text-slate-400 ml-1">(Est.)</span>',
        status: 'Unpaid',
        statusClass: 'bg-red-50 text-red-600 border-red-100',
        statusDot: 'bg-red-500',
        btnText: 'Advance Payment',
        btnClass: 'bg-orange-50 hover:bg-orange-100 text-orange-700 border-orange-200',
        btnIcon: 'ph-hand-coins',
        btnAction: 'openAdvanceModal()',
        date: _txnTodayMorning
    },
    {
        id: 'TXN-103',
        category: 'settle',
        type: 'Repair Service',
        typeClass: 'text-blue-600 bg-blue-50 border-blue-100',
        typeIcon: 'ph-wrench',
        customer: 'Maria Clara',
        details: 'Yamaha Sniper 155 (XYZ-9876)',
        amount: 2500.00,
        amountSuffix: '<span class="text-[10px] font-normal text-slate-400 ml-1">(Final)</span>',
        status: 'Partial/Adv Paid (\u20B1500)',
        statusClass: 'bg-yellow-50 text-yellow-700 border-yellow-200',
        statusDot: 'bg-yellow-500',
        btnText: 'Settle Balance',
        btnClass: 'bg-blue-600 hover:bg-blue-700 text-white shadow-md',
        btnIcon: 'ph-check-circle',
        btnAction: 'openRepairCheckout(true)',
        date: _txnYesterday
    },
    {
        id: 'TXN-104',
        category: 'completed',
        type: 'Walk-in Sale',
        typeClass: 'text-slate-500 bg-slate-100 border-slate-200',
        typeIcon: 'ph-shopping-bag',
        customer: 'Walk-in Customer',
        details: 'Purchased: Front Brake Pads (x1)',
        amount: 450.00,
        amountSuffix: '',
        status: 'Fully Paid',
        statusClass: 'bg-emerald-50 text-emerald-700 border-emerald-200',
        statusDot: 'bg-emerald-500',
        btnText: 'View Receipt',
        btnClass: 'bg-white hover:bg-slate-50 text-slate-600 border-slate-300',
        btnIcon: 'ph-receipt',
        btnAction: 'openReceiptModal()',
        date: _txnTodayMorning
    }
];

// Keep track of opened transaction card across re-renders
let openedTxnCardId = null;

// Synchronize transaction filter chip visual state
function updateTxnFilterButtons() {
    document.querySelectorAll('.txn-filter-btn').forEach(btn => {
        const filter = btn.getAttribute('data-filter');
        const defaultClass = btn.getAttribute('data-default') || 'bg-slate-50 text-slate-600 border border-slate-200 hover:bg-slate-100';
        if (filter === currentTxnFilter) {
            btn.className = `txn-filter-btn px-4 py-1.5 rounded-full text-xs font-semibold shadow-sm whitespace-nowrap transition-colors bg-slate-800 text-white border border-transparent`;
        } else {
            btn.className = `txn-filter-btn px-4 py-1.5 rounded-full text-xs font-semibold shadow-sm whitespace-nowrap transition-colors ${defaultClass}`;
        }
    });
}
window.updateTxnFilterButtons = updateTxnFilterButtons;

// Clear Filters for Transactions view
function clearTxnFilters() {
    const searchInput = document.getElementById('txn-search');
    if (searchInput) searchInput.value = '';
    currentTxnFilter = 'all';
    updateTxnFilterButtons();
    renderTransactions();
}
window.clearTxnFilters = clearTxnFilters;

function renderTransactions() {
    const tbody = document.getElementById('transactions-tbody');
    const mobileContainer = document.getElementById('transactions-mobile-cards');
    if (!tbody && !mobileContainer) return;

    // Keep active filter chips visually highlighted
    updateTxnFilterButtons();

    const query = (document.getElementById('txn-search')?.value || '').toLowerCase().trim();
    
    // Filter the Data
    const filtered = mockTxnData.filter(txn => {
        const matchesSearch = txn.customer.toLowerCase().includes(query) || 
                              txn.id.toLowerCase().includes(query) || 
                              txn.details.toLowerCase().includes(query);
        const matchesCategory = currentTxnFilter === 'all' || txn.category === currentTxnFilter;
        // Don't show completed in "All Active" view
        const matchesActive = currentTxnFilter !== 'all' || txn.category !== 'completed';
        
        return matchesSearch && matchesCategory && matchesActive;
    });

    if (filtered.length === 0) {
        if (tbody) {
            tbody.innerHTML = `<tr><td colspan="5" class="p-8 text-center text-slate-500 font-medium">No transactions found.</td></tr>`;
        }
        if (mobileContainer) {
            mobileContainer.innerHTML = `
                <div class="p-8 text-center bg-white rounded-2xl border border-slate-200 text-slate-500 font-medium flex flex-col items-center justify-center gap-3 shadow-sm">
                    <div class="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 text-xl">
                        <i class="ph-bold ph-magnifying-glass"></i>
                    </div>
                    <div class="font-bold text-slate-700 text-base">No transactions found</div>
                    <p class="text-xs text-slate-400 max-w-xs">No transactions match your current search query or filter.</p>
                    <button type="button" onclick="clearTxnFilters()" class="mt-1 bg-blue-50 text-blue-600 hover:bg-blue-100 font-bold text-xs px-4 py-2.5 rounded-lg border border-blue-200 transition-colors inline-flex items-center gap-1.5 min-h-[44px]">
                        <i class="ph-bold ph-arrow-counter-clockwise"></i> Clear filters
                    </button>
                </div>
            `;
        }
        return;
    }

    if (tbody) {
        tbody.innerHTML = filtered.map(txn => {
            const isCompleted = txn.category === 'completed';
            const rowClass = isCompleted ? 'hover:bg-blue-50/30 transition-colors opacity-75' : 'hover:bg-blue-50/30 transition-colors';
            const statusIndicator = isCompleted ? 
                `<i class="ph-bold ph-check"></i> ${txn.status}` : 
                `<span class="w-1.5 h-1.5 rounded-full ${txn.statusDot}"></span> ${txn.status}`;
                
            return `
                <tr class="${rowClass}">
                    <td class="p-4">
                        <div class="font-bold text-slate-800">${txn.id}</div>
                        <div class="inline-flex items-center gap-1 mt-1 text-[10px] font-bold uppercase tracking-wider ${txn.typeClass} px-2 py-0.5 rounded">
                            <i class="ph-fill ${txn.typeIcon}"></i> ${txn.type}
                        </div>
                    </td>
                    <td class="p-4">
                        <div class="font-semibold text-slate-700">${txn.customer}</div>
                        <div class="text-xs text-slate-500 mt-0.5">${txn.details}</div>
                    </td>
                    <td class="p-4 font-bold text-slate-800">\u20B1${txn.amount.toFixed(2)} ${txn.amountSuffix}</td>
                    <td class="p-4">
                        <span class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-bold ${txn.statusClass}">
                            ${statusIndicator}
                        </span>
                    </td>
                    <td class="p-4 text-right">
                        <button onclick="${txn.btnAction}" class="border px-4 py-2 rounded-lg text-xs font-bold transition-colors flex items-center gap-1.5 ml-auto shadow-sm ${txn.btnClass}">
                            <i class="ph-bold ${txn.btnIcon}"></i> ${txn.btnText}
                        </button>
                    </td>
                </tr>
            `;
        }).join('');
    }

    if (mobileContainer) {
        mobileContainer.innerHTML = filtered.map(txn => {
            const isCompleted = txn.category === 'completed';
            const isOpen = openedTxnCardId && openedTxnCardId === txn.id;
            const statusIndicator = isCompleted ? 
                `<i class="ph-bold ph-check"></i> ${txn.status}` : 
                `<span class="w-1.5 h-1.5 rounded-full ${txn.statusDot}"></span> ${txn.status}`;
            const statusBadge = `<span class="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md text-xs font-bold ${txn.statusClass}">${statusIndicator}</span>`;
            
            // Format Amount with Suffix
            const amountDisplay = '\u20B1' + txn.amount.toFixed(2) + (txn.amountSuffix ? ' ' + txn.amountSuffix : '');

            // Derive opened body data
            const isRepair = txn.type === 'Repair Service';
            const vehicleInfo = isRepair ? txn.details : (txn.vehicle || 'None (Walk-in Retail)');
            const itemsOrServices = isRepair 
                ? (txn.services || 'General Diagnostics & Repair Service')
                : (txn.details.startsWith('Purchased:') ? txn.details.replace(/^Purchased:\s*/i, '') : txn.details);

            // Advance paid & Balance due
            let advancePaid = null;
            let balanceDue = null;
            if (txn.status && txn.status.includes('Adv Paid')) {
                const match = txn.status.match(/(\u20B1|PHP|P)?\s*([0-9,]+(\.[0-9]{2})?)/i);
                if (match) {
                    const advVal = parseFloat(match[2].replace(/,/g, ''));
                    advancePaid = '\u20B1' + advVal.toFixed(2);
                    if (txn.amount > advVal) {
                        balanceDue = '\u20B1' + (txn.amount - advVal).toFixed(2);
                    }
                }
            } else if (txn.category === 'advance') {
                balanceDue = '\u20B1' + txn.amount.toFixed(2) + ' (Estimated)';
            } else if (txn.status === 'Unpaid') {
                balanceDue = '\u20B1' + txn.amount.toFixed(2);
            }

            // Date & Time formatting
            let dateTimeStr = 'N/A';
            if (txn.date) {
                const d = new Date(txn.date);
                if (!isNaN(d.getTime())) {
                    dateTimeStr = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) + 
                        ' • ' + d.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
                }
            }

            // Notes
            const notesStr = txn.notes || (isCompleted 
                ? 'Transaction settled and verified.'
                : (txn.category === 'settle'
                    ? 'Awaiting balance payment on release.'
                    : (txn.category === 'advance'
                        ? 'Advance payment requested before repair.'
                        : 'Retail over-the-counter transaction.')));

            // Action buttons calling the SAME functions as desktop
            let actionsHtml = '';
            if (isCompleted) {
                actionsHtml = `
                    <div class="m-actions grid-2">
                        <button type="button" onclick="openReceiptModal()" class="bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 font-bold text-xs py-2.5 px-3 rounded-lg flex items-center justify-center gap-1.5 transition-colors min-h-[44px]">
                            <i class="ph-bold ph-receipt text-sm"></i> View Receipt
                        </button>
                        <button type="button" onclick="openReceiptModal(); setTimeout(function(){ window.print(); }, 300);" class="bg-slate-800 hover:bg-slate-900 text-white font-bold text-xs py-2.5 px-3 rounded-lg flex items-center justify-center gap-1.5 transition-colors shadow-sm min-h-[44px]">
                            <i class="ph-bold ph-printer text-sm"></i> Print
                        </button>
                    </div>
                `;
            } else {
                actionsHtml = `
                    <div class="m-actions">
                        <button type="button" onclick="${txn.btnAction}" class="border px-4 py-2.5 rounded-lg text-xs font-bold transition-colors flex items-center justify-center gap-1.5 w-full min-h-[44px] shadow-sm ${txn.btnClass}">
                            <i class="ph-bold ${txn.btnIcon}"></i> ${txn.btnText}
                        </button>
                    </div>
                `;
            }

            return `
                <div class="m-card ${isOpen ? 'open' : ''}" data-txn-id="${txn.id}">
                    <div class="m-card-head" role="button" tabindex="0" aria-expanded="${isOpen ? 'true' : 'false'}">
                        <div class="flex-1 min-w-0 pr-2">
                            <div class="flex items-center justify-between gap-2">
                                <div class="flex items-center gap-2">
                                    <span class="font-bold text-slate-800 text-sm">${txn.id}</span>
                                    <span class="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider ${txn.typeClass} px-2 py-0.5 rounded">
                                        <i class="ph-fill ${txn.typeIcon}"></i> ${txn.type}
                                    </span>
                                </div>
                                <div class="font-bold text-slate-800 text-sm whitespace-nowrap">${amountDisplay}</div>
                            </div>
                            <div class="flex items-center justify-between gap-2 mt-1.5">
                                <div class="font-semibold text-slate-700 text-sm truncate">${txn.customer}</div>
                                <div class="shrink-0">${statusBadge}</div>
                            </div>
                        </div>
                        <i class="ph-bold ph-caret-down m-card-chevron text-slate-400 text-lg shrink-0"></i>
                    </div>
                    <div class="m-card-body">
                        <div class="m-card-body-inner">
                            <div class="m-row">
                                <span class="m-row-label">Vehicle Info</span>
                                <span class="m-row-value">${vehicleInfo}</span>
                            </div>
                            <div class="m-row">
                                <span class="m-row-label">Items / Services</span>
                                <span class="m-row-value">${itemsOrServices}</span>
                            </div>
                            ${advancePaid ? `
                            <div class="m-row">
                                <span class="m-row-label">Advance Paid</span>
                                <span class="m-row-value text-emerald-600 font-bold">${advancePaid}</span>
                            </div>` : ''}
                            ${balanceDue ? `
                            <div class="m-row">
                                <span class="m-row-label">Balance Due</span>
                                <span class="m-row-value text-red-600 font-bold">${balanceDue}</span>
                            </div>` : ''}
                            <div class="m-row">
                                <span class="m-row-label">Date & Time</span>
                                <span class="m-row-value">${dateTimeStr}</span>
                            </div>
                            <div class="m-row">
                                <span class="m-row-label">Notes</span>
                                <span class="m-row-value text-slate-500 font-normal">${notesStr}</span>
                            </div>
                            ${actionsHtml}
                        </div>
                    </div>
                </div>
            `;
        }).join('');
    }
}

// Attach Event Listeners for Transactions
document.addEventListener('input', function(e) {
    if (e.target.id === 'txn-search') renderTransactions();
});

document.addEventListener('click', function(e) {
    const filterBtn = e.target.closest('.txn-filter-btn');
    if (filterBtn) {
        currentTxnFilter = filterBtn.getAttribute('data-filter');
        updateTxnFilterButtons();
        renderTransactions();
    }
});


// --- Cashier Home Dashboard Logic ---
function cashierReceivePayment() {
    const navBtn = document.querySelector('.nav-link[data-target="transactions"]');
    if (navBtn) {
        navBtn.click();
    } else if (typeof loadView === 'function') {
        loadView('transactions');
    }
    setTimeout(() => {
        const filterBtn = document.querySelector('.txn-filter-btn[data-filter="all"]');
        if (filterBtn) filterBtn.click();
    }, 50);
}
window.cashierReceivePayment = cashierReceivePayment;

function renderCashierHome() {
    const root = document.getElementById('view-cashier-home');
    if (!root) return;

    // 1. Welcome Header (User name, Role label, Today's local date)
    const userObj = (typeof systemUsers !== 'undefined' && systemUsers[currentRole]) ? systemUsers[currentRole] : null;
    const userName = (userObj && userObj.name) ? userObj.name : 'Cashier';
    const userRoleLabel = (typeof ROLES_CONFIG !== 'undefined' && ROLES_CONFIG[currentRole] && ROLES_CONFIG[currentRole].label) ? ROLES_CONFIG[currentRole].label : 'Cashier';

    const now = new Date();
    const dateFormatted = now.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' });

    const userEl = document.getElementById('cashier-home-user');
    if (userEl) userEl.textContent = userName;

    const dateEl = document.getElementById('cashier-home-date');
    if (dateEl) dateEl.textContent = `${userRoleLabel} | ${dateFormatted}`;

    const isSameDay = (d1, d2) => {
        if (!d1 || !d2) return false;
        const a = new Date(d1);
        const b = new Date(d2);
        return a.getFullYear() === b.getFullYear() &&
               a.getMonth() === b.getMonth() &&
               a.getDate() === b.getDate();
    };

    // 2. Stat 1: Today's Sales (total in pesos of today's transactions)
    let todaySalesTotal = 0;
    let todayCompletedCount = 0;
    mockTxnData.forEach(t => {
        if (isSameDay(t.date, now)) {
            if (t.status === 'Fully Paid' || t.category === 'completed') {
                todaySalesTotal += (Number(t.amount) || 0);
                todayCompletedCount++;
            } else if (t.status && t.status.includes('Partial/Adv Paid')) {
                const match = t.status.match(/\u20B1(\d+(\.\d+)?)/);
                if (match) todaySalesTotal += Number(match[1]);
            }
        }
    });
    const statSalesEl = document.getElementById('cashier-stat-today-sales');
    if (statSalesEl) {
        statSalesEl.textContent = `\u20B1${todaySalesTotal.toLocaleString('en-PH', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    }

    // 3. Stat 2: Pending Payments (count and total amount waiting)
    const pendingTxns = mockTxnData.filter(t => t.category !== 'completed' && t.status !== 'Fully Paid');
    let pendingWaitingAmount = 0;
    pendingTxns.forEach(t => {
        if (t.status && t.status.includes('Partial/Adv Paid')) {
            const match = t.status.match(/\u20B1(\d+(\.\d+)?)/);
            const advPaid = match ? Number(match[1]) : 500;
            const remaining = Math.max(0, (Number(t.amount) || 0) - advPaid);
            pendingWaitingAmount += remaining;
        } else {
            pendingWaitingAmount += (Number(t.amount) || 0);
        }
    });
    const statPendingEl = document.getElementById('cashier-stat-pending-payments');
    if (statPendingEl) {
        statPendingEl.innerHTML = `${pendingTxns.length} <span class="text-xs font-medium text-slate-500 ml-1" id="cashier-stat-pending-amount">(\u20B1${pendingWaitingAmount.toLocaleString('en-PH', { minimumFractionDigits: 2, maximumFractionDigits: 2 })})</span>`;
    }

    // 4. Stat 3: Walk-in Sales Today (count)
    const walkinTodayTxns = mockTxnData.filter(t => (t.category === 'walkin' || t.type === 'Walk-in Sale') && isSameDay(t.date, now));
    const statWalkinEl = document.getElementById('cashier-stat-walkin-today');
    if (statWalkinEl) {
        const orderWord = walkinTodayTxns.length === 1 ? 'Order' : 'Orders';
        statWalkinEl.innerHTML = `${walkinTodayTxns.length} <span class="text-xs font-medium text-slate-500 ml-1" id="cashier-stat-walkin-sub">${orderWord}</span>`;
    }

    // 5. Stat 4: Stock Alerts (low stock plus out of stock, using getStockStatus)
    const lowStockParts = (typeof mockInventory !== 'undefined' && Array.isArray(mockInventory)) ? mockInventory.filter(p => getStockStatus(p) === 'low') : [];
    const outOfStockParts = (typeof mockInventory !== 'undefined' && Array.isArray(mockInventory)) ? mockInventory.filter(p => getStockStatus(p) === 'out') : [];
    const totalStockAlerts = lowStockParts.length + outOfStockParts.length;
    const statStockEl = document.getElementById('cashier-stat-stock-alerts');
    if (statStockEl) {
        statStockEl.innerHTML = `${totalStockAlerts} <span class="text-xs font-medium text-slate-500 ml-1" id="cashier-stat-stock-alerts-sub">${lowStockParts.length} Low · ${outOfStockParts.length} Out</span>`;
    }

    // 6. Recent Transactions (last 5)
    const recentTxns = mockTxnData.slice(0, 5);
    const tbody = document.getElementById('cashier-recent-transactions-tbody');
    if (tbody) {
        if (recentTxns.length === 0) {
            tbody.innerHTML = `<tr><td colspan="4" class="p-6 text-center text-slate-500 text-sm font-medium">No transactions yet.</td></tr>`;
        } else {
            tbody.innerHTML = recentTxns.map(txn => {
                const isCompleted = txn.category === 'completed' || txn.status === 'Fully Paid';
                const rowClass = isCompleted ? 'hover:bg-blue-50/30 transition-colors opacity-75 cursor-pointer' : 'hover:bg-blue-50/30 transition-colors cursor-pointer';
                const statusIndicator = isCompleted ?
                    `<i class="ph-bold ph-check"></i> ${txn.status}` :
                    `<span class="w-1.5 h-1.5 rounded-full ${txn.statusDot}"></span> ${txn.status}`;
                return `
                    <tr class="${rowClass}" onclick="document.querySelector('.nav-link[data-target=\\'transactions\\']')?.click() || loadView('transactions')">
                        <td class="p-3">
                            <div class="font-bold text-slate-800 text-xs sm:text-sm">${txn.id}</div>
                            <div class="inline-flex items-center gap-1 mt-0.5 text-[10px] font-bold uppercase tracking-wider ${txn.typeClass} px-2 py-0.5 rounded">
                                <i class="ph-fill ${txn.typeIcon}"></i> ${txn.type}
                            </div>
                        </td>
                        <td class="p-3">
                            <div class="font-semibold text-slate-700 text-xs sm:text-sm">${txn.customer}</div>
                            <div class="text-[11px] text-slate-500 truncate max-w-[140px] sm:max-w-[200px]">${txn.details}</div>
                        </td>
                        <td class="p-3 font-bold text-slate-800 text-xs sm:text-sm whitespace-nowrap">\u20B1${(Number(txn.amount) || 0).toFixed(2)} ${txn.amountSuffix || ''}</td>
                        <td class="p-3 text-right whitespace-nowrap">
                            <span class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-bold ${txn.statusClass}">
                                ${statusIndicator}
                            </span>
                        </td>
                    </tr>
                `;
            }).join('');
        }
    }

    // 7. Stock Alerts widget (up to 5 low/out, plus expired/soon, read-only)
    const alertsContainer = document.getElementById('cashier-stock-alerts-list');
    if (alertsContainer) {
        const lowOrOut = (typeof mockInventory !== 'undefined' && Array.isArray(mockInventory)) ? mockInventory.filter(p => {
            const s = getStockStatus(p);
            return s === 'low' || s === 'out';
        }).slice(0, 5) : [];

        const expParts = (typeof mockInventory !== 'undefined' && Array.isArray(mockInventory) && typeof getExpiryStatus === 'function') ? mockInventory.filter(p => {
            const st = getExpiryStatus(p);
            return st && (st.status === 'expired' || st.status === 'soon');
        }) : [];

        const combinedAlertParts = [...lowOrOut];
        expParts.forEach(ep => {
            if (!combinedAlertParts.some(p => p.id === ep.id)) {
                combinedAlertParts.push(ep);
            }
        });

        if (combinedAlertParts.length === 0) {
            alertsContainer.innerHTML = `<div class="p-6 text-center text-slate-500 text-sm font-medium">All stock levels are fine.</div>`;
        } else {
            alertsContainer.innerHTML = combinedAlertParts.map(part => {
                const stockSt = getStockStatus(part);
                let stockBadge = '';
                if (stockSt === 'out') {
                    stockBadge = `<span class="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md text-[11px] font-bold bg-red-100 text-red-700 border border-red-200"><span class="w-1.5 h-1.5 rounded-full bg-red-500"></span> 0 Left</span>`;
                } else if (stockSt === 'low') {
                    stockBadge = `<span class="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md text-[11px] font-bold bg-yellow-100 text-yellow-700 border border-yellow-200"><span class="w-1.5 h-1.5 rounded-full bg-yellow-500 animate-pulse"></span> ${part.stock} Left</span>`;
                } else {
                    stockBadge = `<span class="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md text-[11px] font-bold bg-emerald-100 text-emerald-700 border border-emerald-200"><span class="w-1.5 h-1.5 rounded-full bg-emerald-500"></span> ${part.stock} Left</span>`;
                }

                let expBadge = '';
                if (typeof getExpiryStatus === 'function') {
                    const st = getExpiryStatus(part);
                    if (st && st.status === 'expired') {
                        expBadge = `<span class="inline-flex items-center gap-1 text-[10px] font-bold text-red-600 border border-red-200 bg-red-50 px-1.5 py-0.5 rounded"><i class="ph ph-calendar"></i> Expired</span>`;
                    } else if (st && st.status === 'soon') {
                        expBadge = `<span class="inline-flex items-center gap-1 text-[10px] font-bold text-orange-600 border border-orange-200 bg-orange-50 px-1.5 py-0.5 rounded"><i class="ph ph-calendar"></i> ${st.days}d left</span>`;
                    }
                }

                return `
                    <div class="flex items-center justify-between p-3 rounded-xl border border-slate-200 bg-slate-50/50 hover:bg-slate-50 transition-colors">
                        <div class="min-w-0 flex-1 mr-3">
                            <p class="text-sm font-bold text-slate-800 truncate">${part.name}</p>
                            <p class="text-[11px] text-slate-500 font-medium">SKU: ${part.sku} · \u20B1${(Number(part.price) || 0).toFixed(2)}</p>
                        </div>
                        <div class="flex flex-wrap items-center justify-end gap-1.5 shrink-0">
                            ${stockBadge}
                            ${expBadge}
                        </div>
                    </div>
                `;
            }).join('');
        }
    }

    // 8. Icon initialization
    if (typeof lucide !== 'undefined' && lucide.createIcons) {
        lucide.createIcons();
    }
}
window.renderCashierHome = renderCashierHome;

// --- Interactive Service History Logic ---
const mockHistoryData = [
    {
        date: 'Oct 24, 2023',
        time: '14:30 PM',
        plate: 'XYZ-9876',
        brandId: 'yamaha',
        brandText: '',
        model: 'Sniper 155',
        vehicle: 'Yamaha Sniper 155',
        customer: 'Maria Clara',
        mechanic: `Leo (${ROLES_CONFIG.mechanic.label})`,
        mechanicId: 'leo',
        issueTitle: 'Throttle & Oil Maintenance',
        issueDesc: 'Throttle body cleaning and standard engine oil replacement.',
        cost: 2500.00
    },
    {
        date: 'Oct 20, 2023',
        time: '09:15 AM',
        plate: 'ABC-1234',
        brandId: 'yamaha',
        brandText: '',
        model: 'Sniper 150',
        vehicle: 'Yamaha Sniper 150',
        customer: 'Juan Dela Cruz',
        mechanic: `Mike (${ROLES_CONFIG.mechanic.label})`,
        mechanicId: 'mike',
        issueTitle: 'Engine Overheating (P0118)',
        issueDesc: 'Replaced faulty Engine Coolant Temperature (ECT) Sensor and front brake pads.',
        cost: 1800.00
    },
    {
        date: 'Oct 18, 2023',
        time: '11:00 AM',
        plate: 'HON-5555',
        brandId: 'honda',
        brandText: '',
        model: 'Model TBC',
        vehicle: 'Honda Model TBC',
        customer: 'Jose Rizal',
        mechanic: `Mike (${ROLES_CONFIG.mechanic.label})`,
        mechanicId: 'mike',
        issueTitle: 'Scheduled Maintenance',
        issueDesc: 'General inspection and fluid check.',
        cost: 950.00
    },
    {
        date: 'Oct 15, 2023',
        time: '16:45 PM',
        plate: 'KAW-6666',
        brandId: 'kawasaki',
        brandText: '',
        model: 'Model TBC',
        vehicle: 'Kawasaki Model TBC',
        customer: 'Apolinario Mabini',
        mechanic: `Leo (${ROLES_CONFIG.mechanic.label})`,
        mechanicId: 'leo',
        issueTitle: 'Brake System Check',
        issueDesc: 'Brake pad replacement and bleeding.',
        cost: 1200.00
    },
    {
        date: 'Oct 12, 2023',
        time: '10:30 AM',
        plate: 'MOT-7777',
        brandId: 'motoposh',
        brandText: '',
        model: 'Model TBC',
        vehicle: 'Motoposh Model TBC',
        customer: 'Emilio Aguinaldo',
        mechanic: `Mike (${ROLES_CONFIG.mechanic.label})`,
        mechanicId: 'mike',
        issueTitle: 'Carburetor Service',
        issueDesc: 'Carburetor cleaning and fuel line check.',
        cost: 850.00
    },
    {
        date: 'Oct 08, 2023',
        time: '13:15 PM',
        plate: 'DEF-5678',
        brandId: 'rusi',
        brandText: '',
        model: 'Model TBC',
        vehicle: 'Rusi Model TBC',
        customer: 'Antonio Luna',
        mechanic: `Leo (${ROLES_CONFIG.mechanic.label})`,
        mechanicId: 'leo',
        issueTitle: 'Drive Chain Service',
        issueDesc: 'Chain cleaning and tension adjustment.',
        cost: 500.00
    },
    {
        date: 'Oct 05, 2023',
        time: '15:00 PM',
        plate: 'QRS-4455',
        brandId: 'other',
        brandText: '',
        model: 'Model TBC',
        vehicle: 'Other Model TBC',
        customer: 'Gabriela Silang',
        mechanic: `Mike (${ROLES_CONFIG.mechanic.label})`,
        mechanicId: 'mike',
        issueTitle: 'General Tune-Up',
        issueDesc: 'Spark plug replacement and oil change.',
        cost: 750.00
    }
];

function getHistoryParts(record) {
    if (!record) return 'Service Consumables';
    if (record.parts) return record.parts;
    const desc = ((record.issueDesc || '') + ' ' + (record.issueTitle || '')).toLowerCase();
    if (desc.includes('spark plug')) return 'Spark Plug, Engine Oil';
    if (desc.includes('coolant temperature') || desc.includes('ect')) return 'ECT Sensor, Front Brake Pads';
    if (desc.includes('carburetor')) return 'Fuel Line Hose, Carb Cleaner';
    if (desc.includes('chain')) return 'Chain Lube, Cleaner';
    if (desc.includes('brake pad') || desc.includes('brake system')) return 'Brake Pads, Brake Fluid';
    if (desc.includes('oil replacement') || desc.includes('oil change') || desc.includes('throttle')) return 'Standard Engine Oil, Throttle Cleaner';
    if (desc.includes('fluid check') || desc.includes('scheduled maintenance')) return 'Brake Fluid, Coolant Top-up';
    return 'Service Consumables';
}
window.getHistoryParts = getHistoryParts;

function clearHistoryFilters() {
    const searchInput = document.getElementById('history-search');
    if (searchInput) searchInput.value = '';
    const mechFilter = document.getElementById('history-mech-filter');
    if (mechFilter) mechFilter.value = 'all';
    const dateFilter = document.getElementById('history-date-filter');
    if (dateFilter) dateFilter.value = '30';
    renderHistory();
}
window.clearHistoryFilters = clearHistoryFilters;

function renderHistory() {
    const tbody = document.getElementById('history-tbody');
    const mobileContainer = document.getElementById('history-mobile-cards');
    if (!tbody && !mobileContainer) return;

    const query = (document.getElementById('history-search')?.value || '').toLowerCase().trim();
    const mechFilter = document.getElementById('history-mech-filter')?.value || 'all';

    // Filter the Data
    const filtered = mockHistoryData.filter(record => {
        const brand = getBrandLabel(record);
        const matchesSearch = !query || 
                              record.plate.toLowerCase().includes(query) || 
                              record.customer.toLowerCase().includes(query) ||
                              record.date.toLowerCase().includes(query) ||
                              (record.vehicle && record.vehicle.toLowerCase().includes(query)) ||
                              (brand && brand.toLowerCase().includes(query)) ||
                              (record.issueTitle && record.issueTitle.toLowerCase().includes(query));
                              
        const matchesMech = mechFilter === 'all' || record.mechanicId === mechFilter;

        return matchesSearch && matchesMech;
    });

    if (filtered.length === 0) {
        if (tbody) {
            tbody.innerHTML = `<tr><td colspan="6" class="p-8 text-center text-slate-500 font-medium">
                <div class="flex flex-col items-center justify-center gap-2">
                    <span>No records found.</span>
                    <button type="button" onclick="clearHistoryFilters()" class="text-xs text-blue-600 hover:underline font-bold">Clear filters</button>
                </div>
            </td></tr>`;
        }
        if (mobileContainer) {
            mobileContainer.innerHTML = `
                <div class="p-8 text-center bg-white rounded-2xl border border-slate-200 text-slate-500 font-medium flex flex-col items-center justify-center gap-3 shadow-sm">
                    <div class="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 text-xl">
                        <i class="ph-bold ph-magnifying-glass"></i>
                    </div>
                    <div class="font-bold text-slate-700 text-base">No records found</div>
                    <p class="text-xs text-slate-400 max-w-xs">No service records match your current search query or filter.</p>
                    <button type="button" onclick="clearHistoryFilters()" class="mt-1 bg-blue-50 text-blue-600 hover:bg-blue-100 font-bold text-xs px-4 py-2.5 rounded-lg border border-blue-200 transition-colors inline-flex items-center gap-1.5 min-h-[44px]">
                        <i class="ph-bold ph-arrow-counter-clockwise"></i> Clear filters
                    </button>
                </div>
            `;
        }
        return;
    }

    // Render Desktop HTML
    if (tbody) {
        tbody.innerHTML = filtered.map(record => {
            const brand = getBrandLabel(record);
            const vehicleLabel = brand ? `${brand} ${record.model || ''}`.trim() : (record.vehicle || '');
            const vehicleLabelEscaped = vehicleLabel.replace(/'/g, "\\'");
            return `
            <tr class="hover:bg-blue-50/30 transition-colors">
                <td class="p-4 text-slate-600 font-medium">${record.date} <br><span class="text-xs text-slate-400">${record.time}</span></td>
                <td class="p-4">
                    <button onclick="openTimelineModal('${record.plate}', '${vehicleLabelEscaped}')" class="font-bold text-blue-600 hover:text-blue-800 hover:underline flex items-center gap-1.5 transition-colors">
                        ${record.plate} <i class="ph-bold ph-clock-counter-clockwise text-xs"></i>
                    </button>
                    <div class="text-xs text-slate-500 mt-0.5">${vehicleLabel}</div>
                    <div class="text-xs font-semibold text-slate-700 mt-1">${record.customer}</div>
                </td>
                <td class="p-4 text-slate-700 font-medium">${record.mechanic}</td>
                <td class="p-4 text-slate-600 text-xs leading-relaxed">
                    <span class="font-bold text-slate-700 block mb-0.5">${record.issueTitle}</span>
                    ${record.issueDesc}
                </td>
                <td class="p-4 font-bold text-slate-800">\u20B1${record.cost.toFixed(2)}</td>
                <td class="p-4 text-center">
                    <button onclick="openHistoryDetailModal()" class="bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 px-3 py-1.5 rounded-md text-xs font-bold transition-colors shadow-sm whitespace-nowrap">
                        View Full Record
                    </button>
                </td>
            </tr>
        `;
        }).join('');
    }

    // Render Mobile Cards
    if (mobileContainer) {
        mobileContainer.innerHTML = filtered.map(record => {
            const brand = getBrandLabel(record);
            const vehicleLabel = brand ? `${brand} ${record.model || ''}`.trim() : (record.vehicle || '');
            const vehicleLabelEscaped = vehicleLabel.replace(/'/g, "\\'");
            const partsUsed = getHistoryParts(record);

            return `
            <div class="m-card" data-history-plate="${record.plate}">
                <div class="m-card-head" role="button" tabindex="0" aria-expanded="false">
                    <div class="flex-1 min-w-0 pr-3">
                        <div class="flex items-center justify-between gap-2">
                            <button type="button" onclick="event.stopPropagation(); openTimelineModal('${record.plate}', '${vehicleLabelEscaped}')" class="font-bold text-blue-600 hover:text-blue-800 text-sm inline-flex items-center gap-1.5 transition-colors">
                                <span>${record.plate}</span>
                                <i class="ph-bold ph-clock-counter-clockwise text-xs text-blue-500"></i>
                            </button>
                            <span class="text-xs font-bold text-slate-800 whitespace-nowrap">\u20B1${record.cost.toFixed(2)}</span>
                        </div>
                        <div class="font-bold text-slate-800 text-sm mt-1 truncate">${record.customer}</div>
                        <div class="text-xs text-slate-500 mt-0.5 truncate">${vehicleLabel}</div>
                        <div class="text-[11px] text-slate-400 mt-1 flex items-center gap-1">
                            <i class="ph-bold ph-calendar-blank text-xs"></i> ${record.date} • ${record.time}
                        </div>
                    </div>
                    <i class="ph-bold ph-caret-down m-card-chevron text-slate-400 text-lg shrink-0"></i>
                </div>
                <div class="m-card-body">
                    <div class="m-card-body-inner">
                        <div class="m-row">
                            <span class="m-row-label">Lead Mechanic</span>
                            <span class="m-row-value font-medium">${record.mechanic || 'N/A'}</span>
                        </div>
                        <div class="m-row">
                            <span class="m-row-label">Services Done</span>
                            <span class="m-row-value font-medium">${record.issueTitle || 'Standard Service'}</span>
                        </div>
                        <div class="m-row">
                            <span class="m-row-label">Parts Used</span>
                            <span class="m-row-value">${partsUsed}</span>
                        </div>
                        <div class="m-row">
                            <span class="m-row-label">Total Cost</span>
                            <span class="m-row-value font-bold text-slate-800">\u20B1${record.cost.toFixed(2)}</span>
                        </div>
                        <div class="m-row">
                            <span class="m-row-label">Notes</span>
                            <span class="m-row-value text-slate-600 font-normal">${record.issueDesc || 'No additional notes.'}</span>
                        </div>
                        <div class="m-actions grid-2">
                            <button type="button" onclick="openHistoryDetailModal()" class="bg-blue-50 text-blue-700 hover:bg-blue-100 border border-blue-200 font-bold text-xs py-2.5 px-3 rounded-lg flex items-center justify-center gap-1.5 transition-colors min-h-[44px]">
                                <i class="ph-bold ph-file-text text-sm"></i> View Details
                            </button>
                            <button type="button" onclick="openHistoryDetailModal(); setTimeout(function(){ window.print(); }, 300);" class="bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 font-bold text-xs py-2.5 px-3 rounded-lg flex items-center justify-center gap-1.5 transition-colors min-h-[44px]">
                                <i class="ph-bold ph-printer text-sm"></i> Print
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            `;
        }).join('');
    }
}
window.renderHistory = renderHistory;

// Attach Event Listeners for History View
document.addEventListener('input', function(e) {
    if (e.target.id === 'history-search') renderHistory();
});

document.addEventListener('change', function(e) {
    if (e.target.id === 'history-mech-filter' || e.target.id === 'history-date-filter') {
        renderHistory();
    }
});

// --- Interactive Reports & Monitoring Logic ---

const mockReportData = {
    today: {
        revTotal: '14,850.00', revParts: '8,200', revLabor: '6,650',
        repTotal: '12', repComp: '9', repProg: '3',
        alertTotal: '8', alertLow: '5', alertOut: '3',
        scanTotal: '15', scanIssue: '8', scanClear: '7',
        chartParts: '5,940', chartRepair: '8,910',
        sumAdv: '3,500.00', sumOut: '4,200.00', sumSet: '11,350.00',
        accuracy: '88%',
        dtcs: [
            { code: 'P0118', name: 'Engine Coolant Temp Sensor High', count: 4 },
            { code: 'P0562', name: 'Charging System Voltage Low', count: 3 },
            { code: 'P0120', name: 'Throttle Position Sensor Circuit', count: 1 }
        ],
        mechanics: [
            { name: 'Mike', count: 5 },
            { name: 'Leo', count: 4 }
        ],
        trend: [
            { label: '9 AM', amount: '₱1.8k', pct: 25 },
            { label: '11 AM', amount: '₱3.2k', pct: 45 },
            { label: '1 PM', amount: '₱4.5k', pct: 65 },
            { label: '3 PM', amount: '₱2.6k', pct: 35 },
            { label: '5 PM', amount: '₱2.75k', pct: 40 }
        ]
    },
    week: {
        revTotal: '84,200.00', revParts: '45,100', revLabor: '39,100',
        repTotal: '68', repComp: '62', repProg: '6',
        alertTotal: '12', alertLow: '8', alertOut: '4',
        scanTotal: '75', scanIssue: '42', scanClear: '33',
        chartParts: '33,680', chartRepair: '50,520',
        sumAdv: '12,500.00', sumOut: '8,400.00', sumSet: '63,300.00',
        accuracy: '86%',
        dtcs: [
            { code: 'P0118', name: 'Engine Coolant Temp Sensor High', count: 12 },
            { code: 'P0562', name: 'Charging System Voltage Low', count: 8 },
            { code: 'P0120', name: 'Throttle Position Sensor Circuit', count: 5 }
        ],
        mechanics: [
            { name: 'Mike', count: 24 },
            { name: 'Leo', count: 18 }
        ],
        trend: [
            { label: 'Mon', amount: '₱2.1k', pct: 30 },
            { label: 'Tue', amount: '₱3.5k', pct: 45 },
            { label: 'Wed', amount: '₱1.8k', pct: 25 },
            { label: 'Thu', amount: '₱4.8k', pct: 60 },
            { label: 'Fri', amount: '₱6.2k', pct: 80 },
            { label: 'Sat', amount: '₱3.9k', pct: 50 },
            { label: 'Sun', amount: '₱7.5k', pct: 95 }
        ]
    },
    month: {
        revTotal: '342,500.00', revParts: '185,000', revLabor: '157,500',
        repTotal: '285', repComp: '270', repProg: '15',
        alertTotal: '18', alertLow: '11', alertOut: '7',
        scanTotal: '310', scanIssue: '180', scanClear: '130',
        chartParts: '137,000', chartRepair: '205,500',
        sumAdv: '45,000.00', sumOut: '22,500.00', sumSet: '275,000.00',
        accuracy: '89%',
        dtcs: [
            { code: 'P0118', name: 'Engine Coolant Temp Sensor High', count: 48 },
            { code: 'P0562', name: 'Charging System Voltage Low', count: 32 },
            { code: 'P0120', name: 'Throttle Position Sensor Circuit', count: 21 },
            { code: 'P0105', name: 'MAP Sensor Malfunction', count: 14 }
        ],
        mechanics: [
            { name: 'Mike', count: 110 },
            { name: 'Leo', count: 85 }
        ],
        trend: [
            { label: 'Week 1', amount: '₱68.5k', pct: 65 },
            { label: 'Week 2', amount: '₱82.1k', pct: 80 },
            { label: 'Week 3', amount: '₱95.4k', pct: 92 },
            { label: 'Week 4', amount: '₱96.5k', pct: 95 }
        ]
    }
};

let activeReportTab = 'financial';
window.activeReportTab = activeReportTab;
let currentReportRange = 'today';
window.currentReportRange = currentReportRange;

function getReportData(range = 'today') {
    const raw = (mockReportData && mockReportData[range]) ? mockReportData[range] : null;
    return {
        revTotal: (raw && raw.revTotal) || '0.00',
        revParts: (raw && raw.revParts) || '0.00',
        revLabor: (raw && raw.revLabor) || '0.00',
        repTotal: (raw && raw.repTotal) || '0',
        repComp: (raw && raw.repComp) || '0',
        repProg: (raw && raw.repProg) || '0',
        alertTotal: (raw && raw.alertTotal) || '0',
        alertLow: (raw && raw.alertLow) || '0',
        alertOut: (raw && raw.alertOut) || '0',
        scanTotal: (raw && raw.scanTotal) || '0',
        scanIssue: (raw && raw.scanIssue) || '0',
        scanClear: (raw && raw.scanClear) || '0',
        chartParts: (raw && raw.chartParts) || '0.00',
        chartRepair: (raw && raw.chartRepair) || '0.00',
        sumAdv: (raw && raw.sumAdv) || '0.00',
        sumOut: (raw && raw.sumOut) || '0.00',
        sumSet: (raw && raw.sumSet) || '0.00',
        accuracy: (raw && raw.accuracy) || '0%',
        dtcs: (raw && Array.isArray(raw.dtcs)) ? raw.dtcs : [],
        mechanics: (raw && Array.isArray(raw.mechanics)) ? raw.mechanics : [],
        trend: (raw && Array.isArray(raw.trend)) ? raw.trend : []
    };
}
window.getReportData = getReportData;

function getDtcAnalyticsList(range = 'today') {
    const data = getReportData(range);
    const list = data.dtcs.map(d => ({ ...d }));

    // Add live scanned codes
    if (typeof dtcScanState !== 'undefined' && Array.isArray(dtcScanState.scanned) && dtcScanState.scanned.length > 0) {
        dtcScanState.scanned.forEach(s => {
            const code = String(s.code || '').trim().toUpperCase();
            if (!code) return;
            const existing = list.find(b => b.code.toUpperCase() === code);
            if (existing) {
                existing.count = (Number(existing.count) || 0) + 1;
            } else {
                const entry = (typeof getDtcEntryById === 'function' && s.id) ? getDtcEntryById(s.id) : (typeof findDtcEntry === 'function' ? findDtcEntry(code) : null);
                const desc = entry ? (entry.component || entry.desc || code) : code;
                list.push({ code: code, name: desc, count: 1 });
            }
        });
    }
    list.sort((a, b) => b.count - a.count);
    return list;
}
window.getDtcAnalyticsList = getDtcAnalyticsList;

function renderDtcAnalytics(range = 'today') {
    const listEl = document.getElementById('reports-dtc-freq-list');
    const accuracyEl = document.getElementById('reports-dtc-accuracy');
    const data = getReportData(range);

    if (accuracyEl) {
        accuracyEl.textContent = data.accuracy || '0%';
    }

    if (listEl) {
        const dtcs = getDtcAnalyticsList(range);
        if (!dtcs.length || dtcs.every(d => !d.count || d.count === 0)) {
            listEl.innerHTML = '<div class="p-6 text-center text-slate-400 text-xs italic">No DTC issues logged in this period</div>';
        } else {
            const maxCount = Math.max(...dtcs.map(d => Number(d.count) || 0), 1);
            listEl.innerHTML = dtcs.map(d => `
                <div class="flex items-center gap-4">
                    <div class="w-12 h-10 bg-purple-100 rounded flex items-center justify-center font-bold text-purple-700 border border-purple-200 text-xs shrink-0">${d.code}</div>
                    <div class="flex-1 min-w-0">
                        <div class="flex justify-between text-xs mb-1">
                            <span class="font-bold text-slate-700 truncate mr-2">${d.name}</span>
                            <span class="font-bold text-slate-500 shrink-0">${d.count} Log${d.count === 1 ? '' : 's'}</span>
                        </div>
                        <div class="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                            <div class="bg-purple-500 h-1.5 rounded-full transition-all" style="width: ${Math.round(((Number(d.count) || 0) / maxCount) * 100)}%"></div>
                        </div>
                    </div>
                </div>
            `).join('');
        }
    }
}
window.renderDtcAnalytics = renderDtcAnalytics;

function renderOperationsPerformance(range = 'today') {
    const chartEl = document.getElementById('reports-ops-mech-chart');
    if (!chartEl) return;
    const data = getReportData(range);
    const mechs = data.mechanics;

    if (!mechs.length || mechs.every(m => !m.count || m.count === 0)) {
        chartEl.innerHTML = '<div class="w-full h-full flex items-center justify-center text-slate-400 text-xs italic">No completed jobs in this period</div>';
    } else {
        const maxCompleted = Math.max(...mechs.map(m => Number(m.count) || 0), 1);
        chartEl.innerHTML = mechs.map((m, i) => {
            const count = Number(m.count) || 0;
            const heightPx = Math.max(24, Math.round((count / maxCompleted) * 120));
            const isTop = i === 0;
            return `
                <div class="w-16 flex flex-col items-center gap-2">
                    <span class="text-xs font-bold ${isTop ? 'text-blue-600 bg-blue-50' : 'text-slate-600 bg-slate-100'} px-2 py-1 rounded">${count}</span>
                    <div class="w-full ${isTop ? 'bg-blue-500' : 'bg-slate-400'} rounded-t-sm transition-all" style="height: ${heightPx}px;"></div>
                    <span class="text-[11px] font-bold text-slate-500 uppercase tracking-wider text-center truncate w-full">${m.name}</span>
                </div>
            `;
        }).join('');
    }
}
window.renderOperationsPerformance = renderOperationsPerformance;

function renderFinancialCharts(range = 'today') {
    const data = getReportData(range);

    const barsEl = document.getElementById('reports-rev-trend-bars');
    const labelsEl = document.getElementById('reports-rev-trend-labels');
    if (barsEl && labelsEl) {
        const trend = data.trend;
        if (!trend.length || trend.every(t => !t.pct || t.pct === 0)) {
            barsEl.innerHTML = '<div class="w-full h-full flex items-center justify-center text-slate-400 text-xs italic">No revenue data in this period</div>';
            labelsEl.innerHTML = '';
        } else {
            barsEl.innerHTML = trend.map(t => `
                <div class="w-[10%] bg-blue-500 rounded-t-sm relative group cursor-pointer transition-all hover:bg-blue-400" style="height: ${t.pct}%">
                    <div class="absolute -top-8 left-1/2 -translate-x-1/2 bg-slate-800 text-white text-[10px] py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">${t.amount}</div>
                </div>
            `).join('');
            labelsEl.innerHTML = trend.map(t => `<span>${t.label}</span>`).join('');
        }
    }

    const partsBar = document.getElementById('reports-rev-parts-bar');
    const repairBar = document.getElementById('reports-rev-repair-bar');
    if (partsBar && repairBar) {
        const partsNum = parseFloat(String(data.chartParts || data.revParts || '0').replace(/,/g, '')) || 0;
        const repairNum = parseFloat(String(data.chartRepair || data.revLabor || '0').replace(/,/g, '')) || 0;
        const total = partsNum + repairNum;
        if (total <= 0) {
            partsBar.style.width = '50%';
            partsBar.textContent = '0%';
            repairBar.style.width = '50%';
            repairBar.textContent = '0%';
        } else {
            const partsPct = Math.round((partsNum / total) * 100);
            const repairPct = 100 - partsPct;
            partsBar.style.width = `${partsPct}%`;
            partsBar.textContent = `${partsPct}%`;
            repairBar.style.width = `${repairPct}%`;
            repairBar.textContent = `${repairPct}%`;
        }
    }
}
window.renderFinancialCharts = renderFinancialCharts;

window.setReportTab = function(id) {
    if (!id) id = 'financial';
    activeReportTab = id;
    window.activeReportTab = activeReportTab;

    const container = document.querySelector('#main-content-area') || document;
    const tabs = container.querySelectorAll('.report-tab-btn');
    const panels = container.querySelectorAll('.report-tab-content');
    if (!tabs.length && !panels.length) return;

    const targetPanelId = (id === 'dtc' || id === 'diagnostics') ? 'tab-dtc' : ('tab-' + id);

    tabs.forEach(tab => {
        const tabId = tab.getAttribute('data-tab') || tab.getAttribute('data-target')?.replace('tab-', '') || '';
        const isMatch = (tabId === id) || (tab.id === 'report-tab-' + id) || (tab.getAttribute('data-target') === 'tab-' + id) || (id === 'dtc' && (tabId === 'diagnostics' || tab.getAttribute('data-target') === 'tab-diagnostics'));
        
        if (isMatch) {
            tab.classList.add('active', 'text-blue-600', 'border-blue-600', 'font-bold');
            tab.classList.remove('text-slate-500', 'border-transparent', 'hover:border-slate-300', 'hover:text-slate-800', 'font-semibold');
            tab.setAttribute('aria-selected', 'true');
            tab.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'nearest' });
        } else {
            tab.classList.remove('active', 'text-blue-600', 'border-blue-600', 'font-bold');
            tab.classList.add('text-slate-500', 'border-transparent', 'hover:border-slate-300', 'hover:text-slate-800', 'font-semibold');
            tab.setAttribute('aria-selected', 'false');
        }
    });

    let matchedPanel = null;
    panels.forEach(panel => {
        const isMatch = (panel.id === targetPanelId) || (id === 'dtc' && (panel.id === 'tab-dtc' || panel.id === 'tab-diagnostics'));
        if (isMatch) {
            matchedPanel = panel;
            panel.classList.remove('hidden');
            panel.classList.add('block');
        } else {
            panel.classList.add('hidden');
            panel.classList.remove('block');
        }
    });

    if (!matchedPanel) {
        const parent = container.querySelector('.report-tab-content')?.parentElement;
        if (parent) {
            matchedPanel = document.createElement('div');
            matchedPanel.id = targetPanelId;
            matchedPanel.className = 'report-tab-content p-5 sm:p-6 block';
            matchedPanel.innerHTML = '<div class="py-12 text-center text-slate-400 text-sm font-medium italic">Coming up in the next step</div>';
            parent.appendChild(matchedPanel);
        }
    }

    // Re-draw charts when a panel opens
    if (id === 'financial') {
        renderFinancialCharts(currentReportRange);
    } else if (id === 'inventory') {
        if (typeof updateDashboardWidgets === 'function') updateDashboardWidgets();
    } else if (id === 'dtc' || id === 'diagnostics') {
        renderDtcAnalytics(currentReportRange);
    } else if (id === 'operations') {
        renderOperationsPerformance(currentReportRange);
    }

    if (typeof lucide !== 'undefined' && lucide.createIcons) {
        lucide.createIcons();
    }
};

function renderReports(range = 'today') {
    currentReportRange = range;
    window.currentReportRange = currentReportRange;
    const data = getReportData(range);

    const syncText = document.getElementById('report-sync-time');
    if (syncText) {
        syncText.textContent = "Syncing...";
        setTimeout(() => syncText.textContent = "Synced: Just now", 500);
    }

    const safeSet = (id, val, prefix = '') => {
        const el = document.getElementById(id);
        if (el) {
            const cleanVal = (val !== undefined && val !== null && val !== '' && !Number.isNaN(val)) ? val : '0';
            el.textContent = prefix ? `${prefix}${cleanVal}` : cleanVal;
        }
    };

    safeSet('kpi-rev-total', data.revTotal);
    safeSet('kpi-rev-parts', data.revParts);
    safeSet('kpi-rev-labor', data.revLabor);

    safeSet('kpi-rep-total', data.repTotal);
    safeSet('kpi-rep-comp', data.repComp);
    safeSet('kpi-rep-prog', data.repProg);

    safeSet('kpi-alert-total', data.alertTotal);
    safeSet('kpi-alert-low', data.alertLow);
    safeSet('kpi-alert-out', data.alertOut);

    const liveScannedCount = (typeof dtcScanState !== 'undefined' && Array.isArray(dtcScanState.scanned)) ? dtcScanState.scanned.length : 0;
    const baseScanTotal = Number(data.scanTotal) || 0;
    const baseScanIssue = Number(data.scanIssue) || 0;
    safeSet('kpi-scan-total', String(baseScanTotal + liveScannedCount));
    safeSet('kpi-scan-issue', String(baseScanIssue + liveScannedCount));
    safeSet('kpi-scan-clear', data.scanClear || '0');

    safeSet('chart-rev-parts', data.chartParts, '₱');
    safeSet('chart-rev-repair', data.chartRepair, '₱');

    safeSet('summary-adv', data.sumAdv, '₱');
    safeSet('summary-out', data.sumOut, '₱');
    safeSet('summary-set', data.sumSet, '₱');

    const dateBtns = document.querySelectorAll('.report-date-btn');
    dateBtns.forEach(btn => {
        const isMatch = btn.getAttribute('data-range') === currentReportRange;
        if (isMatch) {
            btn.className = 'report-date-btn px-3 py-1.5 text-xs font-bold bg-white text-blue-600 shadow-sm rounded-md whitespace-nowrap transition-colors';
        } else {
            btn.className = 'report-date-btn px-3 py-1.5 text-xs font-semibold text-slate-500 hover:text-slate-700 whitespace-nowrap transition-colors';
        }
    });

    renderFinancialCharts(range);
    if (typeof updateDashboardWidgets === 'function') {
        updateDashboardWidgets();
    }
    renderDtcAnalytics(range);
    renderOperationsPerformance(range);
}
window.renderReports = renderReports;

window.exportReportsCSV = function() {
    const tab = activeReportTab || 'financial';
    const range = currentReportRange || 'today';
    const data = getReportData(range);

    const csvRows = [];
    const sanitize = (val) => {
        const str = String(val === undefined || val === null ? '' : val);
        return `"${str.replace(/"/g, '""')}"`;
    };
    const addRow = (...cols) => csvRows.push(cols.map(sanitize).join(','));

    const rangeLabels = { today: 'Today', week: 'This Week', month: 'This Month' };
    const tabLabels = {
        financial: 'Financial & Sales',
        inventory: 'Inventory Movement',
        dtc: 'DTC Analytics',
        operations: 'Operations Performance'
    };

    addRow('Report', tabLabels[tab] || tab);
    addRow('Period', rangeLabels[range] || range);
    addRow('Generated', new Date().toLocaleString());
    addRow('');

    if (tab === 'financial') {
        addRow('Metric', 'Amount (PHP)');
        addRow('Total Gross Revenue', data.revTotal || '0.00');
        addRow('Parts Revenue', data.revParts || '0.00');
        addRow('Labor Revenue', data.revLabor || '0.00');
        addRow('Walk-in Parts Sales', data.chartParts || '0.00');
        addRow('Repair Services (Parts + Labor)', data.chartRepair || '0.00');
        addRow('Total Advance Payments', data.sumAdv || '0.00');
        addRow('Total Outstanding Pending', data.sumOut || '0.00');
        addRow('Total Settled Balances', data.sumSet || '0.00');
    } else if (tab === 'inventory') {
        addRow('FAST-MOVING SPARE PARTS');
        addRow('Rank', 'Part Name', 'Units Sold');
        const topParts = typeof getTopSellingList === 'function' ? getTopSellingList() : [];
        if (!topParts.length || topParts.every(p => !p.sold)) {
            addRow('No fast-moving items in this period');
        } else {
            topParts.forEach((p, i) => addRow(i + 1, p.name, p.sold));
        }
        addRow('');
        addRow('REORDER / STOCKOUT ALERTS');
        addRow('Part Name', 'Remaining Stock', 'Status');
        const alertParts = (typeof mockInventory !== 'undefined' && Array.isArray(mockInventory))
            ? mockInventory.filter(p => (typeof getStockStatus === 'function') && (getStockStatus(p) === 'low' || getStockStatus(p) === 'out'))
            : [];
        if (alertParts.length === 0) {
            addRow('No low stock items in this period');
        } else {
            alertParts.forEach(p => addRow(p.name, p.stock, p.stock === 0 ? 'Out of Stock' : 'Low Stock'));
        }
        addRow('');
        addRow('RECENT INVENTORY MOVEMENTS');
        addRow('Timestamp', 'Part Name', 'SKU', 'Type', 'Quantity', 'Stock Before', 'Stock After', 'Reference', 'Performed By');
        const movements = (typeof inventoryMovements !== 'undefined' && Array.isArray(inventoryMovements)) ? inventoryMovements.slice(0, 50) : [];
        movements.forEach(m => addRow(
            m.timestamp ? new Date(m.timestamp).toLocaleString() : '',
            m.partName || '',
            m.sku || '',
            m.type || '',
            m.quantity || 0,
            m.stockBefore || 0,
            m.stockAfter || 0,
            m.reference || '',
            m.performedBy || ''
        ));
    } else if (tab === 'dtc' || tab === 'diagnostics') {
        addRow('Metric', 'Value');
        const liveScannedCount = (typeof dtcScanState !== 'undefined' && Array.isArray(dtcScanState.scanned)) ? dtcScanState.scanned.length : 0;
        const scanTotal = (Number(data.scanTotal) || 0) + liveScannedCount;
        const scanIssue = (Number(data.scanIssue) || 0) + liveScannedCount;
        addRow('Total ECU Scans', scanTotal);
        addRow('Issues Detected', scanIssue);
        addRow('Clear Scans', data.scanClear || '0');
        addRow('Diagnostic Accuracy', data.accuracy || '0%');
        addRow('');
        addRow('MOST FREQUENT DTCS LOGGED');
        addRow('DTC Code', 'Component / Issue', 'Logs Count');
        const dtcs = typeof getDtcAnalyticsList === 'function' ? getDtcAnalyticsList(range) : [];
        if (!dtcs.length || dtcs.every(d => !d.count || d.count === 0)) {
            addRow('No DTC issues logged in this period');
        } else {
            dtcs.forEach(d => addRow(d.code, d.name, d.count));
        }
    } else if (tab === 'operations') {
        addRow('Metric', 'Value');
        addRow('Total Repair Services', data.repTotal || '0');
        addRow('Completed Services', data.repComp || '0');
        addRow('In Progress Services', data.repProg || '0');
        addRow('');
        addRow('JOBS COMPLETED PER MECHANIC');
        addRow('Mechanic Name', 'Jobs Completed');
        const mechs = data.mechanics || [];
        if (!mechs.length || mechs.every(m => !m.count || m.count === 0)) {
            addRow('No completed jobs in this period');
        } else {
            mechs.forEach(m => addRow(m.name, m.count));
        }
    }

    const csvContent = '\uFEFF' + csvRows.join('\r\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const fileName = `motocare_${tab}_${range}.csv`;
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', fileName);
    link.style.display = 'none';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
};

window.exportReportsPDF = function() {
    const tab = activeReportTab || 'financial';
    const range = currentReportRange || 'today';
    const originalTitle = document.title;
    document.title = `motocare_${tab}_${range}`;
    document.body.classList.add('printing-report');

    let cleaned = false;
    const cleanup = () => {
        if (cleaned) return;
        cleaned = true;
        document.body.classList.remove('printing-report');
        document.title = originalTitle;
        window.removeEventListener('afterprint', cleanup);
    };
    window.addEventListener('afterprint', cleanup);
    window.print();
    setTimeout(cleanup, 1000);
};

// Attach Event Listener for Date Range Filters
document.addEventListener('click', function(e) {
    const filterBtn = e.target.closest('.report-date-btn');
    if (filterBtn) {
        const range = filterBtn.getAttribute('data-range') || 'today';
        currentReportRange = range;
        renderReports(range);
        setReportTab(activeReportTab);
    }
});
// --- Interactive Audit Logs Logic ---

const mockAuditData = [    
    {
        id: '1',
        date: 'Oct 24, 2026',
        time: '11:45:10 AM',
        dateGroup: 'today',
        userName: 'User',
        userRole: ROLES_CONFIG.admin.label,
        roleFilter: 'admin',
        module: 'User Management',
        moduleFilter: 'users',
        action: "Updated system settings and permissions.",
        severity: 'Modification',
        severityClass: 'bg-yellow-50 text-yellow-700 border-yellow-200',
        dotClass: 'bg-yellow-500',
        hasDetails: false
    },
    {
        id: '2',
        date: 'Oct 24, 2026',
        time: '10:15:33 AM',
        dateGroup: 'today',
        userName: 'Mike Cruz',
        userRole: ROLES_CONFIG.mechanic.label,
        roleFilter: 'mechanic',
        module: 'Inventory',
        moduleFilter: 'inventory',
        action: "Manual stock override for 'Front Disc Brake Pads'.",
        severity: 'Modification',
        severityClass: 'bg-yellow-50 text-yellow-700 border-yellow-200',
        dotClass: 'bg-yellow-500',
        hasDetails: true,
        targetId: 'INV-SKU-06455',
        beforeValue: '3 units',
        afterValue: '10 units',
        afterTheme: 'bg-yellow-50 border-yellow-200 text-yellow-800',
        afterLabelTheme: 'text-yellow-600',
        reason: 'Reason: Inventory Correction'
    },
    {
        id: '3',
        date: 'Oct 24, 2026',
        time: '09:00:15 AM',
        dateGroup: 'today',
        userName: 'System Admin',
        userRole: ROLES_CONFIG.super_admin.label,
        roleFilter: 'super_admin',
        module: 'Authentication',
        moduleFilter: 'authentication',
        action: "User session authenticated.",
        severity: 'Standard',
        severityClass: 'bg-blue-50 text-blue-700 border-blue-200',
        dotClass: 'bg-blue-500',
        hasDetails: false
    },
    {
        id: '4',
        date: 'Oct 23, 2026',
        time: '22:00:00 PM',
        dateGroup: 'yesterday',
        userName: 'System',
        userRole: 'Automated',
        roleFilter: 'automated',
        module: 'System Maintenance',
        moduleFilter: 'system maintenance',
        action: "Execution of the manual database backup procedure.",
        severity: 'Critical / Security',
        severityClass: 'bg-red-50 text-red-700 border-red-200',
        dotClass: 'bg-red-500',
        hasDetails: false
    }
];

function renderAudit() {
    const accessLevel = typeof getAccessLevel === 'function' ? getAccessLevel('audit') : 'full';

    // Update Read-only pill visibility near title
    const readonlyPill = document.getElementById('audit-readonly-pill');
    if (readonlyPill) {
        readonlyPill.classList.toggle('hidden', accessLevel !== 'read');
    }
    const mobileHeaderPill = document.getElementById('mobile-audit-readonly-pill');
    if (mobileHeaderPill) {
        mobileHeaderPill.classList.toggle('hidden', accessLevel !== 'read');
    }

    // Export CSV button & mutation actions: hide if not full access
    const exportBtn = document.getElementById('audit-btn-export');
    if (exportBtn) {
        exportBtn.classList.toggle('hidden', accessLevel !== 'full');
    }
    document.querySelectorAll('.audit-mutation-action, [data-action="audit-delete"], [data-action="audit-clear"], [data-action="audit-edit"], [data-action="audit-restore"]').forEach(el => {
        el.classList.toggle('hidden', accessLevel !== 'full');
    });

    const tbody = document.getElementById('audit-tbody');
    const mobileCards = document.getElementById('audit-mobile-cards');
    if (!tbody && !mobileCards) return;

    // Get Active Filters
    const query = (document.getElementById('audit-search')?.value || '').toLowerCase();
    const dateFilter = document.getElementById('audit-filter-date')?.value || 'all';
    const roleFilter = document.getElementById('audit-filter-role')?.value || 'all';
    const moduleFilter = document.getElementById('audit-filter-module')?.value || 'all';

    // Apply Filters
    const filtered = mockAuditData.filter(log => {
        const searchString = `${log.userName} ${log.action} ${log.targetId || ''}`.toLowerCase();
        const matchesSearch = searchString.includes(query);
        const matchesDate = dateFilter === 'all' || log.dateGroup === dateFilter;
        const matchesRole = roleFilter === 'all' || log.roleFilter === roleFilter;
        const matchesModule = moduleFilter === 'all' || log.moduleFilter === moduleFilter;

        return matchesSearch && matchesDate && matchesRole && matchesModule;
    });

    // Render HTML
    if (filtered.length === 0) {
        if (tbody) tbody.innerHTML = `<tr><td colspan="6" class="p-8 text-center text-slate-500 font-medium">No audit logs match the current filters.</td></tr>`;
        if (mobileCards) mobileCards.innerHTML = `<div class="p-6 text-center text-slate-500 font-medium bg-white rounded-xl border border-slate-200">No audit logs match the current filters.</div>`;
        return;
    }

    tbody.innerHTML = filtered.map(log => {
        const roleDisplay = (ROLES_CONFIG[log.roleFilter]?.label || log.userRole).toUpperCase();
        // Build the primary row
        let rowHtml = `
            <tr class="hover:bg-slate-50 transition-colors ${log.hasDetails ? 'cursor-pointer' : ''}" ${log.hasDetails ? `onclick="toggleAuditDetail('audit-detail-${log.id}')"` : ''}>
                <td class="p-4 text-center">
                    ${log.hasDetails ? `<i class="ph-bold ph-caret-down text-slate-400 transition-transform" id="audit-icon-${log.id}"></i>` : ''}
                </td>
                <td class="p-4 text-slate-600 font-medium">${log.date}<br><span class="text-xs text-slate-400">${log.time}</span></td>
                <td class="p-4">
                    <div class="font-semibold text-slate-700">${log.userName}</div>
                    <div class="text-[10px] uppercase font-bold text-slate-400 mt-0.5">${roleDisplay}</div>
                </td>
                <td class="p-4 text-slate-600">${log.module}</td>
                <td class="p-4 text-slate-700">${log.action}</td>
                <td class="p-4 text-center">
                    <span class="inline-flex items-center gap-1.5 px-2 py-1 rounded-md text-[10px] font-bold border uppercase tracking-wider ${log.severityClass}">
                        <span class="w-1.5 h-1.5 rounded-full ${log.dotClass}"></span> ${log.severity}
                    </span>
                </td>
            </tr>
        `;

        // Append the hidden details row if applicable
        if (log.hasDetails) {
            rowHtml += `
                <tr id="audit-detail-${log.id}" class="hidden bg-slate-50/50">
                    <td colspan="6" class="p-0">
                        <div class="px-16 py-4 border-b border-slate-100 flex flex-col gap-2">
                            <div class="text-xs">
                                <span class="font-bold text-slate-500 uppercase tracking-wider">Target Record ID:</span> 
                                <span class="font-mono text-slate-700 bg-white px-1 border border-slate-200 rounded">${log.targetId}</span>
                            </div>
                            <div class="flex items-center gap-4 text-xs mt-1">
                                <div class="bg-white p-2 border border-slate-200 rounded shadow-sm flex items-center gap-2">
                                    <span class="text-slate-400 font-bold uppercase text-[10px]">Before:</span>
                                    <span class="font-bold text-slate-700">${log.beforeValue}</span>
                                </div>
                                <i class="ph-bold ph-arrow-right text-slate-400"></i>
                                <div class="p-2 border rounded shadow-sm flex items-center gap-2 ${log.afterTheme}">
                                    <span class="font-bold uppercase text-[10px] ${log.afterLabelTheme}">After:</span>
                                    <span class="font-bold">${log.afterValue}</span>
                                </div>
                            </div>
                            ${log.reason ? `<div class="text-xs text-slate-500 italic mt-1">${log.reason}</div>` : ''}
                        </div>
                    </td>
                </tr>
            `;
        }
        
        return rowHtml;
    }).join('');

    if (mobileCards) {
        mobileCards.innerHTML = filtered.map(log => {
            const roleDisplay = (ROLES_CONFIG[log.roleFilter]?.label || log.userRole).toUpperCase();
            return `
                <div class="bg-white p-4 rounded-xl shadow-sm border border-slate-200 flex flex-col gap-3">
                    <div class="flex items-start justify-between gap-2 border-b border-slate-100 pb-2.5">
                        <div>
                            <span class="text-xs font-bold text-slate-700">${log.userName}</span>
                            <span class="text-[10px] font-bold uppercase text-slate-400 block">${roleDisplay}</span>
                        </div>
                        <span class="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold border uppercase tracking-wider shrink-0 ${log.severityClass}">
                            <span class="w-1.5 h-1.5 rounded-full ${log.dotClass}"></span> ${log.severity}
                        </span>
                    </div>
                    <div>
                        <div class="text-xs font-bold text-slate-800">${log.action}</div>
                        <div class="text-[11px] text-slate-500 mt-0.5 flex items-center justify-between">
                            <span>${log.module}</span>
                            <span class="text-slate-400">${log.date} ${log.time}</span>
                        </div>
                    </div>
                    ${log.hasDetails ? `
                        <button onclick="toggleAuditDetail('audit-detail-m-${log.id}')" class="text-xs font-bold text-blue-600 flex items-center justify-between pt-1 border-t border-slate-100">
                            <span>View Details</span>
                            <i class="ph-bold ph-caret-down text-slate-400 transition-transform" id="audit-icon-m-${log.id}"></i>
                        </button>
                        <div id="audit-detail-m-${log.id}" class="hidden bg-slate-50 p-3 rounded-lg border border-slate-100 text-xs flex flex-col gap-2">
                            <div>
                                <span class="font-bold text-slate-500 uppercase text-[10px]">Target Record ID:</span>
                                <span class="font-mono text-slate-700 bg-white px-1 border border-slate-200 rounded">${log.targetId}</span>
                            </div>
                            <div class="flex flex-col gap-1.5 text-xs">
                                <div class="bg-white p-1.5 border border-slate-200 rounded shadow-sm">
                                    <span class="text-slate-400 font-bold uppercase text-[10px]">Before:</span>
                                    <span class="font-bold text-slate-700 ml-1">${log.beforeValue}</span>
                                </div>
                                <div class="p-1.5 border rounded shadow-sm ${log.afterTheme}">
                                    <span class="font-bold uppercase text-[10px] ${log.afterLabelTheme}">After:</span>
                                    <span class="font-bold ml-1">${log.afterValue}</span>
                                </div>
                            </div>
                            ${log.reason ? `<div class="text-[11px] text-slate-500 italic">${log.reason}</div>` : ''}
                        </div>
                    ` : ''}
                </div>
            `;
        }).join('');
    }
}

// Global Event Listeners for Audit Logs Filtering
document.addEventListener('input', function(e) {
    if (e.target.id === 'audit-search') renderAudit();
});

document.addEventListener('change', function(e) {
    if (e.target.id === 'audit-filter-date' || e.target.id === 'audit-filter-role' || e.target.id === 'audit-filter-module') {
        renderAudit();
    }
});
// --- Interactive User Management Logic ---

const mockUserData = [
    {
        id: 'u1', initials: 'IG', name: 'User', username: '@User.admin',
        roleName: ROLES_CONFIG.admin.shortLabel || ROLES_CONFIG.admin.label, roleValue: 'admin', roleIcon: 'ph-crown', roleClass: 'bg-slate-800 text-white',
        status: 'Active', statusValue: 'active', statusClass: 'bg-emerald-50 text-emerald-700 border-emerald-200', statusDot: 'bg-emerald-500',
        lastLoginDate: 'Oct 24, 2026', lastLoginTime: '08:00 AM', avatarClass: 'bg-slate-800 text-white'
    },
    {
        id: 'u2', initials: 'SA', name: 'System Admin', username: '@Admin.super_admin',
        roleName: ROLES_CONFIG.super_admin.label, roleValue: 'super_admin', roleIcon: 'ph-shield-check', roleClass: 'bg-purple-50 text-purple-700 border border-purple-200',
        status: 'Active', statusValue: 'active', statusClass: 'bg-emerald-50 text-emerald-700 border-emerald-200', statusDot: 'bg-emerald-500',
        lastLoginDate: 'Oct 24, 2026', lastLoginTime: '08:15 AM', avatarClass: 'bg-purple-100 text-purple-700'
    },
    {
        id: 'u3', initials: 'JB', name: 'Larpus', username: '@Larpus.mechanic',
        roleName: ROLES_CONFIG.mechanic.label, roleValue: 'mechanic', roleIcon: 'ph-wrench', roleClass: 'bg-blue-50 text-blue-700 border border-blue-200',
        status: 'Active', statusValue: 'active', statusClass: 'bg-emerald-50 text-emerald-700 border-emerald-200', statusDot: 'bg-emerald-500',
        lastLoginDate: 'Oct 24, 2026', lastLoginTime: '07:45 AM', avatarClass: 'bg-blue-100 text-blue-700'
    },
    {
        id: 'u4', initials: 'F', name: 'Hiyo', username: '@Hiyo.mechanic',
        roleName: ROLES_CONFIG.mechanic.label, roleValue: 'mechanic', roleIcon: 'ph-wrench', roleClass: 'bg-blue-50 text-blue-700 border border-blue-200',
        status: 'Active', statusValue: 'active', statusClass: 'bg-emerald-50 text-emerald-700 border-emerald-200', statusDot: 'bg-emerald-500',
        lastLoginDate: 'Oct 24, 2026', lastLoginTime: '07:50 AM', avatarClass: 'bg-blue-100 text-blue-700'
    },
    {
        id: 'u5', initials: 'CS', name: 'Cashier', username: '@Cashier.staff',
        roleName: ROLES_CONFIG.cashier.label, roleValue: 'cashier', roleIcon: 'ph-storefront', roleClass: 'bg-emerald-50 text-emerald-700 border border-emerald-200 whitespace-nowrap',
        status: 'Active', statusValue: 'active', statusClass: 'bg-emerald-50 text-emerald-700 border-emerald-200', statusDot: 'bg-emerald-500',
        lastLoginDate: 'Oct 24, 2026', lastLoginTime: '08:05 AM', avatarClass: 'bg-emerald-100 text-emerald-700'
    }
    
];

function renderPermissionsMatrix() {
    const tbody = document.getElementById('permissions-matrix-tbody');
    if (!tbody) return;

    const matrixRows = [
        { key: 'customers', label: 'Customers & Motorcycles' },
        { key: 'diagnostics', label: 'Diagnostics & Inspections' },
        { key: 'repairs', label: 'Active Repairs', notes: { mechanic: 'Can Finalize' } },
        { key: 'inventory', label: 'Inventory Management', notes: { super_admin: 'Full Access', admin: 'Full Access', cashier: 'Stock Lookup', mechanic: 'View / Request' } },
        { key: 'transactions', label: 'Transactions & Billing', notes: { cashier: 'Full Access' } },
        { key: 'reports', label: 'Reports & Monitoring' },
        { key: 'audit', label: 'Audit Logs', notes: { super_admin: 'Full Access', admin: 'Read-only' } },
        { key: 'users', label: 'User Management' },
        { key: 'settings', label: 'Settings' },
        { key: 'backup', label: 'Backup & Restore' }
    ];

    const iconHtml = (allowed, note) => {
        if (allowed) {
            return `<i class="ph-fill ph-check-circle text-emerald-500 text-xl"></i>` +
                (note ? `<br><span class="text-[10px] font-semibold text-slate-500">${note}</span>` : '');
        }
        return `<i class="ph-fill ph-minus-circle text-slate-300 text-xl"></i>`;
    };

    tbody.innerHTML = matrixRows.map(row => {
        const canSuper = rolePermissions.super_admin && rolePermissions.super_admin.includes(row.key);
        const canAdmin = rolePermissions.admin && rolePermissions.admin.includes(row.key);
        const canCashier = rolePermissions.cashier && rolePermissions.cashier.includes(row.key);
        const canMech = rolePermissions.mechanic && rolePermissions.mechanic.includes(row.key);

        return `
            <tr class="hover:bg-slate-50" data-matrix-module="${row.key}">
                <td class="p-4 text-left font-bold text-slate-700 border-r border-slate-200">${row.label}</td>
                <td class="p-4 border-r border-slate-200">${iconHtml(canSuper, row.notes?.super_admin)}</td>
                <td class="p-4 border-r border-slate-200">${iconHtml(canAdmin, row.notes?.admin)}</td>
                <td class="p-4 border-r border-slate-200">${iconHtml(canCashier, row.notes?.cashier)}</td>
                <td class="p-4">${iconHtml(canMech, row.notes?.mechanic)}</td>
            </tr>
        `;
    }).join('');
}

let currentEditingUserId = null;
let openPasswordResetUserId = null;
let openDeactivateUserId = null;
let currentResetPasswords = {};
let passwordResetSuccessMessage = null;
let passwordResetSuccessTimer = null;

function generateRandomPassword() {
    const chars = 'abcdefghjkmnpqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ23456789!@#$%';
    let pass = '';
    for (let i = 0; i < 8; i++) {
        pass += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return pass;
}

function getRoleStyles(roleKey) {
    if (roleKey === 'super_admin') {
        return {
            icon: 'ph-shield-check',
            roleClass: 'bg-purple-50 text-purple-700 border border-purple-200',
            avatarClass: 'bg-purple-100 text-purple-700'
        };
    } else if (roleKey === 'admin') {
        return {
            icon: 'ph-crown',
            roleClass: 'bg-slate-800 text-white',
            avatarClass: 'bg-slate-800 text-white'
        };
    } else if (roleKey === 'cashier') {
        return {
            icon: 'ph-storefront',
            roleClass: 'bg-emerald-50 text-emerald-700 border border-emerald-200 whitespace-nowrap',
            avatarClass: 'bg-emerald-100 text-emerald-700'
        };
    }
    return {
        icon: 'ph-wrench',
        roleClass: 'bg-blue-50 text-blue-700 border border-blue-200',
        avatarClass: 'bg-blue-100 text-blue-700'
    };
}

function populateUserFormRoles() {
    const roleSelect = document.getElementById('user-form-role');
    if (!roleSelect || typeof ROLES_CONFIG === 'undefined') return;
    const currentVal = roleSelect.value;
    roleSelect.innerHTML = `
        <option value="" disabled selected>Select Role Assignment...</option>
        ${Object.values(ROLES_CONFIG).map(r => `
            <option value="${r.id}">${r.label} (${r.description || ''})</option>
        `).join('')}
    `;
    if (currentVal) roleSelect.value = currentVal;
}

function isCurrentUser(user) {
    if (!user || !user.id) return false;
    const activeRoleId = (typeof currentRole !== 'undefined' && currentRole) ||
                         (typeof sessionStorage !== 'undefined' && sessionStorage.getItem('currentUserRole')) ||
                         'super_admin';
    const activeSysUser = (typeof systemUsers !== 'undefined' && systemUsers[activeRoleId]) ? systemUsers[activeRoleId] : null;
    if (activeSysUser && activeSysUser.id) {
        return user.id === activeSysUser.id;
    }
    return user.id === 'u2' && activeRoleId === 'super_admin';
}

function getActiveSuperAdminCount() {
    return mockUserData.filter(u => u.roleValue === 'super_admin' && u.status === 'Active').length;
}

function openEditUserModal(userId) {
    const user = mockUserData.find(u => u.id === userId);
    if (!user) return;
    currentEditingUserId = userId;
    const isCurrent = isCurrentUser(user);
    populateUserFormRoles();
    
    const title = document.getElementById('user-form-title');
    if (title) title.innerHTML = '<i class="ph-fill ph-pencil-simple text-blue-600 text-2xl"></i> Edit User Account';
    
    const btnText = document.getElementById('btn-save-user-text');
    if (btnText) btnText.textContent = 'Save Changes';
    
    const nameInput = document.getElementById('user-form-name');
    if (nameInput) {
        nameInput.value = user.name || '';
        nameInput.classList.remove('border-red-500');
    }
    
    const phoneInput = document.getElementById('user-form-phone');
    if (phoneInput) {
        phoneInput.value = user.phone || '';
    }
    
    const usernameInput = document.getElementById('user-form-username');
    if (usernameInput) {
        usernameInput.value = user.username ? user.username.replace(/^@/, '') : '';
    }
    
    const roleSelect = document.getElementById('user-form-role');
    if (roleSelect) {
        roleSelect.value = user.roleValue || '';
        if (isCurrent) {
            roleSelect.disabled = true;
            roleSelect.classList.add('bg-slate-100', 'cursor-not-allowed', 'text-slate-500');
        } else {
            roleSelect.disabled = false;
            roleSelect.classList.remove('bg-slate-100', 'cursor-not-allowed', 'text-slate-500');
        }
    }

    const roleWarning = document.getElementById('user-form-role-warning');
    if (roleWarning) {
        if (isCurrent) {
            roleWarning.classList.remove('hidden');
        } else {
            roleWarning.classList.add('hidden');
        }
    }

    const lastSuperAdminMsg = document.getElementById('user-form-role-last-super-admin');
    if (lastSuperAdminMsg) lastSuperAdminMsg.classList.add('hidden');
    
    const nameErr = document.getElementById('user-form-name-error');
    if (nameErr) nameErr.classList.add('hidden');
    
    const pwdSection = document.getElementById('user-form-password-fields');
    if (pwdSection) pwdSection.classList.add('hidden');
    
    toggleModal('modal-user-form', 'user-form-backdrop', 'user-form-content', true);
}
window.openEditUserModal = openEditUserModal;

function openUserModal() {
    currentEditingUserId = null;
    populateUserFormRoles();
    
    const title = document.getElementById('user-form-title');
    if (title) title.innerHTML = '<i class="ph-fill ph-user-circle-plus text-blue-600 text-2xl"></i> Add New User';
    
    const btnText = document.getElementById('btn-save-user-text');
    if (btnText) btnText.textContent = 'Save Account Details';
    
    const nameInput = document.getElementById('user-form-name');
    if (nameInput) {
        nameInput.value = '';
        nameInput.classList.remove('border-red-500');
    }
    
    const usernameInput = document.getElementById('user-form-username');
    if (usernameInput) usernameInput.value = '';
    
    const phoneInput = document.getElementById('user-form-phone');
    if (phoneInput) phoneInput.value = '';
    
    const pwdInput = document.getElementById('user-form-pwd');
    if (pwdInput) pwdInput.value = '';
    const pwdConfirm = document.getElementById('user-form-pwd-confirm');
    if (pwdConfirm) pwdConfirm.value = '';

    const roleSelect = document.getElementById('user-form-role');
    if (roleSelect) {
        roleSelect.value = '';
        roleSelect.disabled = false;
        roleSelect.classList.remove('bg-slate-100', 'cursor-not-allowed', 'text-slate-500');
    }

    const roleWarning = document.getElementById('user-form-role-warning');
    if (roleWarning) roleWarning.classList.add('hidden');

    const lastSuperAdminMsg = document.getElementById('user-form-role-last-super-admin');
    if (lastSuperAdminMsg) lastSuperAdminMsg.classList.add('hidden');
    
    const nameErr = document.getElementById('user-form-name-error');
    if (nameErr) nameErr.classList.add('hidden');
    
    const pwdSection = document.getElementById('user-form-password-fields');
    if (pwdSection) pwdSection.classList.remove('hidden');
    
    toggleModal('modal-user-form', 'user-form-backdrop', 'user-form-content', true);
}
window.openUserModal = openUserModal;

function closeUserModal() {
    const nameErr = document.getElementById('user-form-name-error');
    if (nameErr) nameErr.classList.add('hidden');
    const nameInput = document.getElementById('user-form-name');
    if (nameInput) {
        nameInput.value = '';
        nameInput.classList.remove('border-red-500');
    }
    const usernameInput = document.getElementById('user-form-username');
    if (usernameInput) usernameInput.value = '';
    const phoneInput = document.getElementById('user-form-phone');
    if (phoneInput) phoneInput.value = '';
    const pwdInput = document.getElementById('user-form-pwd');
    if (pwdInput) pwdInput.value = '';
    const pwdConfirm = document.getElementById('user-form-pwd-confirm');
    if (pwdConfirm) pwdConfirm.value = '';
    const roleWarning = document.getElementById('user-form-role-warning');
    if (roleWarning) roleWarning.classList.add('hidden');
    const lastSuperAdminMsg = document.getElementById('user-form-role-last-super-admin');
    if (lastSuperAdminMsg) lastSuperAdminMsg.classList.add('hidden');
    const roleSelect = document.getElementById('user-form-role');
    if (roleSelect) {
        roleSelect.value = '';
        roleSelect.disabled = false;
        roleSelect.classList.remove('bg-slate-100', 'cursor-not-allowed', 'text-slate-500');
    }
    toggleModal('modal-user-form', 'user-form-backdrop', 'user-form-content', false);
    currentEditingUserId = null;
}
window.closeUserModal = closeUserModal;

function saveUserForm() {
    const nameInput = document.getElementById('user-form-name');
    const nameVal = nameInput ? nameInput.value.trim() : '';
    const nameErr = document.getElementById('user-form-name-error');
    
    if (!nameVal) {
        if (nameErr) nameErr.classList.remove('hidden');
        if (nameInput) {
            nameInput.classList.add('border-red-500');
            nameInput.focus();
        }
        return;
    }
    if (nameErr) nameErr.classList.add('hidden');
    if (nameInput) nameInput.classList.remove('border-red-500');
    
    const usernameInput = document.getElementById('user-form-username');
    let rawUsername = usernameInput ? usernameInput.value.trim() : '';
    if (rawUsername && !rawUsername.startsWith('@')) rawUsername = '@' + rawUsername;
    
    const roleSelect = document.getElementById('user-form-role');
    const selectedRole = roleSelect ? roleSelect.value : '';
    
    if (currentEditingUserId) {
        const user = mockUserData.find(u => u.id === currentEditingUserId);
        if (user) {
            const isCurrent = isCurrentUser(user);

            // Last-Super-Admin rule on role change:
            // Block role change that would remove the last active Super Admin
            if (user.roleValue === 'super_admin' && user.status === 'Active' && selectedRole && selectedRole !== 'super_admin' && getActiveSuperAdminCount() <= 1) {
                const lastSuperAdminMsg = document.getElementById('user-form-role-last-super-admin');
                if (lastSuperAdminMsg) lastSuperAdminMsg.classList.remove('hidden');
                return;
            }

            user.name = nameVal;
            user.initials = nameVal.split(' ').map(p => p[0]).filter(Boolean).slice(0, 2).join('').toUpperCase() || 'U';
            if (rawUsername) user.username = rawUsername;
            const phoneInput = document.getElementById('user-form-phone');
            if (phoneInput) user.phone = phoneInput.value.trim();

            // Enforce in handler: ignore any role change for the current user
            if (!isCurrent && selectedRole && ROLES_CONFIG[selectedRole]) {
                user.roleValue = selectedRole;
                user.roleName = ROLES_CONFIG[selectedRole].label;
                const roleStyle = getRoleStyles(selectedRole);
                user.roleIcon = roleStyle.icon;
                user.roleClass = roleStyle.roleClass;
                user.avatarClass = roleStyle.avatarClass;
            }

            if (typeof systemUsers !== 'undefined' && systemUsers[user.roleValue] && isCurrent) {
                systemUsers[user.roleValue].name = user.name;
                systemUsers[user.roleValue].initials = user.initials;
            }
            if (typeof currentRole !== 'undefined' && currentRole === user.roleValue) {
                const userNameEl = document.getElementById('user-name');
                if (userNameEl) userNameEl.textContent = user.name;
                const userAvatarEl = document.getElementById('user-avatar');
                if (userAvatarEl) userAvatarEl.textContent = user.initials;
            }
        }
    } else {
        const newId = 'u' + Date.now();
        const roleKey = (selectedRole && ROLES_CONFIG[selectedRole]) ? selectedRole : 'mechanic';
        const roleStyle = getRoleStyles(roleKey);
        const initials = nameVal.split(' ').map(p => p[0]).filter(Boolean).slice(0, 2).join('').toUpperCase() || 'U';
        const newUser = {
            id: newId,
            initials: initials,
            name: nameVal,
            username: rawUsername || ('@' + nameVal.toLowerCase().replace(/\s+/g, '') + '.' + roleKey),
            phone: (document.getElementById('user-form-phone')?.value.trim() || ''),
            roleName: ROLES_CONFIG[roleKey].label,
            roleValue: roleKey,
            roleIcon: roleStyle.icon,
            roleClass: roleStyle.roleClass,
            status: 'Active',
            statusValue: 'active',
            statusClass: 'bg-emerald-50 text-emerald-700 border-emerald-200',
            statusDot: 'bg-emerald-500',
            lastLoginDate: 'Never',
            lastLoginTime: '',
            avatarClass: roleStyle.avatarClass
        };
        mockUserData.push(newUser);
    }
    
    closeUserModal();
    renderUsers();
}
window.saveUserForm = saveUserForm;

function renderUsers() {
    if (typeof renderPermissionsMatrix === 'function') {
        renderPermissionsMatrix();
    }
    const tbody = document.getElementById('users-tbody');
    const mobileContainer = document.getElementById('users-mobile-cards');
    if (!tbody && !mobileContainer) return;

    // Get Active Filters
    const query = (document.getElementById('user-search')?.value || '').toLowerCase();
    const roleFilter = document.getElementById('user-filter-role')?.value || 'all';
    const statusFilter = document.getElementById('user-filter-status')?.value || 'all';

    // Apply Filters
    const filtered = mockUserData.filter(u => {
        const matchesSearch = u.name.toLowerCase().includes(query) || (u.username && u.username.toLowerCase().includes(query));
        const matchesRole = roleFilter === 'all' || u.roleValue === roleFilter;
        const matchesStatus = statusFilter === 'all' || u.statusValue === statusFilter;

        return matchesSearch && matchesRole && matchesStatus;
    });

    // Render Empty State
    if (filtered.length === 0) {
        if (tbody) {
            tbody.innerHTML = `<tr><td colspan="5" class="p-8 text-center text-slate-500 font-medium">No users match the current filters.</td></tr>`;
        }
        if (mobileContainer) {
            mobileContainer.innerHTML = `<div class="p-8 text-center bg-white rounded-xl border border-slate-200 text-slate-500 font-medium">No users match the current filters.</div>`;
        }
        if (typeof lucide !== 'undefined' && lucide.createIcons) {
            lucide.createIcons();
        }
        return;
    }

    // Render Desktop Table Rows
    if (tbody) {
        tbody.innerHTML = filtered.map(u => {
            const roleLabel = (typeof ROLES_CONFIG !== 'undefined' && ROLES_CONFIG[u.roleValue]) 
                ? (ROLES_CONFIG[u.roleValue].shortLabel || ROLES_CONFIG[u.roleValue].label) 
                : (u.roleName || u.roleValue);

            const isCurrent = isCurrentUser(u);
            const isLastSuperAdmin = u.roleValue === 'super_admin' && u.status === 'Active' && getActiveSuperAdminCount() <= 1;
            const isResetActive = openPasswordResetUserId === u.id;
            const isDeactActive = openDeactivateUserId === u.id;
            const hasSuccess = passwordResetSuccessMessage && passwordResetSuccessMessage.userId === u.id;

            let actionBtns = '';
            if (hasSuccess) {
                actionBtns = `
                    <div class="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-50 text-emerald-700 text-xs font-semibold rounded-lg border border-emerald-200">
                        <i class="ph-bold ph-check-circle text-emerald-500"></i> Password reset for ${u.name}
                    </div>
                `;
            } else if (u.statusValue === 'active') {
                const deactBtn = isCurrent
                    ? `<span class="p-2 rounded invisible inline-flex" aria-hidden="true"><i class="ph-bold ph-user-minus text-lg"></i></span>`
                    : `<button type="button" data-user-id="${u.id}" data-action="deactivate" class="text-slate-500 hover:text-red-600 hover:bg-red-50 p-2 rounded transition-colors ${isDeactActive ? 'bg-red-100 text-red-700' : ''}" title="Deactivate Account" aria-label="Deactivate Account"><i class="ph-bold ph-user-minus text-lg"></i></button>`;

                actionBtns = `
                    <button type="button" data-user-id="${u.id}" data-action="edit" class="text-slate-500 hover:text-blue-600 hover:bg-blue-50 p-2 rounded transition-colors" title="Edit Role/Details" aria-label="Edit Role/Details"><i class="ph-bold ph-pencil-simple text-lg"></i></button>
                    <button type="button" data-user-id="${u.id}" data-action="reset-password" class="text-slate-500 hover:text-orange-600 hover:bg-orange-50 p-2 rounded transition-colors ${isResetActive ? 'bg-orange-100 text-orange-700' : ''}" title="Reset Password" aria-label="Reset Password"><i class="ph-bold ph-key text-lg"></i></button>
                    ${deactBtn}
                `;
            } else {
                actionBtns = `
                    <button type="button" data-user-id="${u.id}" data-action="edit" class="text-slate-400 hover:text-blue-600 hover:bg-blue-50 p-2 rounded transition-colors" title="Edit Role/Details" aria-label="Edit Role/Details"><i class="ph-bold ph-pencil-simple text-lg"></i></button>
                    <button type="button" data-user-id="${u.id}" data-action="reactivate" class="text-emerald-600 hover:bg-emerald-50 p-2 rounded transition-colors font-bold text-xs flex items-center gap-1" title="Reactivate Account" aria-label="Reactivate Account"><i class="ph-bold ph-user-plus text-lg"></i> Reactivate</button>
                `;
            }

            let rowHtml = `
                <tr class="hover:bg-slate-50 transition-colors ${u.rowClass || ''}">
                    <td class="p-4">
                        <div class="flex items-center gap-3">
                            <div class="w-10 h-10 rounded-full flex items-center justify-center font-bold shrink-0 ${u.avatarClass}">${u.initials}</div>
                            <div>
                                <div class="font-bold text-slate-800 flex items-center gap-1.5">
                                    <span>${u.name}</span>
                                    ${isCurrent ? '<span class="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-600 border border-slate-200">You</span>' : ''}
                                </div>
                                <div class="text-xs text-slate-500 font-mono mt-0.5">${u.username || ''}</div>
                            </div>
                        </div>
                    </td>
                    <td class="p-4">
                        <span class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider whitespace-nowrap ${u.roleClass}">
                            <i class="ph-fill ${u.roleIcon}"></i> ${roleLabel}
                        </span>
                    </td>
                    <td class="p-4">
                        <span class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-bold border ${u.statusClass}">
                            <span class="w-1.5 h-1.5 rounded-full ${u.statusDot}"></span> ${u.status}
                        </span>
                    </td>
                    <td class="p-4 text-slate-600 text-xs font-medium">${u.lastLoginDate}<br><span class="text-slate-400">${u.lastLoginTime}</span></td>
                    <td class="p-4 text-right">
                        <div class="flex justify-end gap-2 items-center">
                            ${actionBtns}
                        </div>
                    </td>
                </tr>
            `;

            // Inline Reset Password Panel for Desktop Row
            if (isResetActive) {
                rowHtml += `
                    <tr class="bg-orange-50/50 border-b border-orange-200">
                        <td colspan="5" class="px-6 py-3">
                            <div class="flex flex-wrap items-center gap-3">
                                <span class="text-xs font-bold text-slate-700 flex items-center gap-1.5"><i class="ph-bold ph-key text-orange-500"></i> New password for ${u.name}:</span>
                                <input type="text" id="reset-pwd-input-${u.id}" value="${currentResetPasswords[u.id] || ''}" placeholder="New password" class="px-3 py-1.5 rounded-lg border border-slate-300 bg-white text-xs font-mono outline-none focus:ring-2 focus:ring-orange-500/20 w-48">
                                <button type="button" data-user-id="${u.id}" data-action="generate-password" class="px-2.5 py-1.5 text-xs font-semibold bg-white hover:bg-slate-50 text-slate-700 rounded-lg border border-slate-300 shadow-sm flex items-center gap-1 transition-colors"><i class="ph-bold ph-arrows-clockwise"></i> Generate</button>
                                <button type="button" data-user-id="${u.id}" data-action="save-password" class="px-3 py-1.5 text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white rounded-lg shadow-sm flex items-center gap-1 transition-colors"><i class="ph-bold ph-check"></i> Save</button>
                                <button type="button" data-user-id="${u.id}" data-action="cancel-password" class="px-2.5 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg border border-slate-300 transition-colors">Cancel</button>
                                <span id="reset-pwd-error-${u.id}" class="hidden text-xs text-red-600 font-medium">Please enter a password.</span>
                            </div>
                        </td>
                    </tr>
                `;
            }

            // Inline Deactivate Confirmation Panel for Desktop Row
            if (isDeactActive && !isCurrent) {
                if (isLastSuperAdmin) {
                    rowHtml += `
                        <tr class="bg-slate-50 border-b border-slate-200">
                            <td colspan="5" class="px-6 py-3">
                                <div class="flex flex-wrap items-center justify-between gap-3">
                                    <div class="flex items-center gap-2 text-xs text-slate-500 font-medium">
                                        <i class="ph-bold ph-info text-slate-400 text-base shrink-0"></i>
                                        <span>At least one active Super Admin is required.</span>
                                    </div>
                                    <button type="button" data-user-id="${u.id}" data-action="cancel-deactivate" class="px-3 py-1.5 text-xs font-semibold text-slate-600 bg-white hover:bg-slate-50 rounded-lg border border-slate-300 transition-colors">Close</button>
                                </div>
                            </td>
                        </tr>
                    `;
                } else {
                    rowHtml += `
                        <tr class="bg-red-50/50 border-b border-red-200">
                            <td colspan="5" class="px-6 py-3">
                                <div class="flex flex-wrap items-center justify-between gap-3">
                                    <div class="flex items-center gap-2 text-xs text-slate-700 font-medium">
                                        <i class="ph-bold ph-warning-circle text-red-500 text-base shrink-0"></i>
                                        <span>Deactivate <strong>${u.name}</strong>? They will not be able to sign in.</span>
                                    </div>
                                    <div class="flex items-center gap-2">
                                        <button type="button" data-user-id="${u.id}" data-action="confirm-deactivate" class="px-3 py-1.5 text-xs font-bold bg-red-600 hover:bg-red-700 text-white rounded-lg shadow-sm transition-colors">Confirm</button>
                                        <button type="button" data-user-id="${u.id}" data-action="cancel-deactivate" class="px-2.5 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg border border-slate-300 transition-colors">Cancel</button>
                                    </div>
                                </div>
                            </td>
                        </tr>
                    `;
                }
            }

            return rowHtml;
        }).join('');
    }

    // Render Mobile Cards
    if (mobileContainer) {
        mobileContainer.innerHTML = filtered.map(u => {
            const roleLabel = (typeof ROLES_CONFIG !== 'undefined' && ROLES_CONFIG[u.roleValue]) 
                ? (ROLES_CONFIG[u.roleValue].shortLabel || ROLES_CONFIG[u.roleValue].label) 
                : (u.roleName || u.roleValue);

            const isCurrent = isCurrentUser(u);
            const isLastSuperAdmin = u.roleValue === 'super_admin' && u.status === 'Active' && getActiveSuperAdminCount() <= 1;
            const isResetActive = openPasswordResetUserId === u.id;
            const isDeactActive = openDeactivateUserId === u.id;
            const hasSuccess = passwordResetSuccessMessage && passwordResetSuccessMessage.userId === u.id;

            let cardActionBtns = '';
            if (u.statusValue === 'active') {
                if (isCurrent) {
                    cardActionBtns = `
                        <div class="grid grid-cols-2 gap-2 pt-2 border-t border-slate-100">
                            <button type="button" data-user-id="${u.id}" data-action="edit" class="min-h-[44px] flex items-center justify-center gap-1.5 text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors" title="Edit Role/Details" aria-label="Edit Role/Details"><i class="ph-bold ph-pencil-simple text-base"></i> Edit</button>
                            <button type="button" data-user-id="${u.id}" data-action="reset-password" class="min-h-[44px] flex items-center justify-center gap-1.5 text-xs font-bold text-orange-700 bg-orange-50 hover:bg-orange-100 rounded-lg transition-colors border border-orange-200 ${isResetActive ? 'ring-2 ring-orange-500/30' : ''}" title="Reset Password" aria-label="Reset Password"><i class="ph-bold ph-key text-base"></i> Reset</button>
                        </div>
                    `;
                } else {
                    const mDeactBtn = `<button type="button" data-user-id="${u.id}" data-action="deactivate" class="min-h-[44px] flex items-center justify-center gap-1.5 text-xs font-bold text-red-700 bg-red-50 hover:bg-red-100 rounded-lg transition-colors border border-red-200 ${isDeactActive ? 'ring-2 ring-red-500/30' : ''}" title="Deactivate Account" aria-label="Deactivate Account"><i class="ph-bold ph-user-minus text-base"></i> Deactivate</button>`;

                    cardActionBtns = `
                        <div class="grid grid-cols-3 gap-2 pt-2 border-t border-slate-100">
                            <button type="button" data-user-id="${u.id}" data-action="edit" class="min-h-[44px] flex items-center justify-center gap-1.5 text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors" title="Edit Role/Details" aria-label="Edit Role/Details"><i class="ph-bold ph-pencil-simple text-base"></i> Edit</button>
                            <button type="button" data-user-id="${u.id}" data-action="reset-password" class="min-h-[44px] flex items-center justify-center gap-1.5 text-xs font-bold text-orange-700 bg-orange-50 hover:bg-orange-100 rounded-lg transition-colors border border-orange-200 ${isResetActive ? 'ring-2 ring-orange-500/30' : ''}" title="Reset Password" aria-label="Reset Password"><i class="ph-bold ph-key text-base"></i> Reset</button>
                            ${mDeactBtn}
                        </div>
                    `;
                }
            } else {
                cardActionBtns = `
                    <div class="grid grid-cols-2 gap-2 pt-2 border-t border-slate-100">
                        <button type="button" data-user-id="${u.id}" data-action="edit" class="min-h-[44px] flex items-center justify-center gap-1.5 text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors" title="Edit Role/Details" aria-label="Edit Role/Details"><i class="ph-bold ph-pencil-simple text-base"></i> Edit</button>
                        <button type="button" data-user-id="${u.id}" data-action="reactivate" class="min-h-[44px] flex items-center justify-center gap-1.5 text-xs font-bold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 rounded-lg transition-colors border border-emerald-200" title="Reactivate Account" aria-label="Reactivate Account"><i class="ph-bold ph-user-plus text-base"></i> Reactivate</button>
                    </div>
                `;
            }

            let mobilePanels = '';
            if (hasSuccess) {
                mobilePanels += `
                    <div class="mt-2 p-2.5 bg-emerald-50 text-emerald-700 text-xs font-semibold rounded-lg border border-emerald-200 flex items-center gap-2">
                        <i class="ph-bold ph-check-circle text-emerald-500 text-base"></i> Password reset for ${u.name}
                    </div>
                `;
            }

            if (isResetActive) {
                mobilePanels += `
                    <div class="mt-2 p-3 bg-orange-50/70 border border-orange-200 rounded-xl flex flex-col gap-2.5">
                        <div class="text-xs font-bold text-slate-700 flex items-center gap-1.5"><i class="ph-bold ph-key text-orange-500"></i> New password for ${u.name}</div>
                        <div class="flex gap-2">
                            <input type="text" id="m-reset-pwd-input-${u.id}" value="${currentResetPasswords[u.id] || ''}" placeholder="New password" class="flex-1 min-h-[44px] px-3 py-2 rounded-lg border border-slate-300 bg-white text-xs font-mono outline-none focus:ring-2 focus:ring-orange-500/20">
                            <button type="button" data-user-id="${u.id}" data-action="generate-password" class="min-h-[44px] px-3 text-xs font-semibold bg-white hover:bg-slate-50 text-slate-700 rounded-lg border border-slate-300 shadow-sm flex items-center gap-1"><i class="ph-bold ph-arrows-clockwise"></i> Generate</button>
                        </div>
                        <div class="flex gap-2">
                            <button type="button" data-user-id="${u.id}" data-action="save-password" class="flex-1 min-h-[44px] text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white rounded-lg shadow-sm flex items-center justify-center gap-1"><i class="ph-bold ph-check"></i> Save</button>
                            <button type="button" data-user-id="${u.id}" data-action="cancel-password" class="min-h-[44px] px-4 text-xs font-semibold text-slate-600 bg-white hover:bg-slate-50 rounded-lg border border-slate-300">Cancel</button>
                        </div>
                        <span id="m-reset-pwd-error-${u.id}" class="hidden text-xs text-red-600 font-medium">Please enter a password.</span>
                    </div>
                `;
            }

            if (isDeactActive && !isCurrent) {
                if (isLastSuperAdmin) {
                    mobilePanels += `
                        <div class="mt-2 p-3 bg-slate-50 border border-slate-200 rounded-xl flex flex-col gap-2.5">
                            <span class="text-xs text-slate-500 font-medium">At least one active Super Admin is required.</span>
                            <button type="button" data-user-id="${u.id}" data-action="cancel-deactivate" class="min-h-[44px] px-4 text-xs font-semibold text-slate-600 bg-white hover:bg-slate-50 rounded-lg border border-slate-300">Close</button>
                        </div>
                    `;
                } else {
                    mobilePanels += `
                        <div class="mt-2 p-3 bg-red-50/70 border border-red-200 rounded-xl flex flex-col gap-2.5">
                            <div class="text-xs text-slate-700 font-medium flex items-start gap-2">
                                <i class="ph-bold ph-warning-circle text-red-500 text-base shrink-0 mt-0.5"></i>
                                <span>Deactivate <strong>${u.name}</strong>? They will not be able to sign in.</span>
                            </div>
                            <div class="flex gap-2">
                                <button type="button" data-user-id="${u.id}" data-action="confirm-deactivate" class="flex-1 min-h-[44px] text-xs font-bold bg-red-600 hover:bg-red-700 text-white rounded-lg shadow-sm flex items-center justify-center">Confirm</button>
                                <button type="button" data-user-id="${u.id}" data-action="cancel-deactivate" class="min-h-[44px] px-4 text-xs font-semibold text-slate-600 bg-white hover:bg-slate-50 rounded-lg border border-slate-300">Cancel</button>
                            </div>
                        </div>
                    `;
                }
            }

            return `
                <div class="bg-white rounded-xl shadow-sm border border-slate-200 p-4 flex flex-col gap-3">
                    <div class="flex items-start justify-between gap-3">
                        <div class="flex items-center gap-3 min-w-0">
                            <div class="w-10 h-10 rounded-full flex items-center justify-center font-bold shrink-0 ${u.avatarClass}">${u.initials}</div>
                            <div class="min-w-0">
                                <div class="font-bold text-slate-800 text-sm flex items-center gap-1.5 truncate">
                                    <span class="truncate">${u.name}</span>
                                    ${isCurrent ? '<span class="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-600 border border-slate-200 shrink-0">You</span>' : ''}
                                </div>
                                <div class="text-xs text-slate-500 font-mono truncate mt-0.5">${u.username || ''}</div>
                            </div>
                        </div>
                        <span class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider shrink-0 ${u.roleClass}">
                            <i class="ph-fill ${u.roleIcon}"></i> ${roleLabel}
                        </span>
                    </div>
                    <div class="flex items-center justify-between text-xs text-slate-500 pt-1">
                        <span class="inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-xs font-bold border ${u.statusClass}">
                            <span class="w-1.5 h-1.5 rounded-full ${u.statusDot}"></span> ${u.status}
                        </span>
                        <span class="text-[11px] text-slate-400">Last: ${u.lastLoginDate}</span>
                    </div>
                    ${cardActionBtns}
                    ${mobilePanels}
                </div>
            `;
        }).join('');
    }

    if (typeof lucide !== 'undefined' && lucide.createIcons) {
        lucide.createIcons();
    }
}

// Delegated click event listener for user directory action buttons (desktop & mobile)
document.addEventListener('click', function(e) {
    const actionBtn = e.target.closest('#tab-user-dir [data-action][data-user-id], [data-action][data-user-id]');
    if (!actionBtn) return;

    const action = actionBtn.getAttribute('data-action');
    const userId = actionBtn.getAttribute('data-user-id');
    if (!action || !userId) return;

    if (action === 'edit') {
        openEditUserModal(userId);
    } else if (action === 'reset-password') {
        if (openPasswordResetUserId === userId) {
            openPasswordResetUserId = null;
        } else {
            openPasswordResetUserId = userId;
            openDeactivateUserId = null;
        }
        renderUsers();
    } else if (action === 'generate-password') {
        const pass = generateRandomPassword();
        currentResetPasswords[userId] = pass;
        const deskIn = document.getElementById('reset-pwd-input-' + userId);
        if (deskIn) deskIn.value = pass;
        const mobIn = document.getElementById('m-reset-pwd-input-' + userId);
        if (mobIn) mobIn.value = pass;
    } else if (action === 'save-password') {
        const deskIn = document.getElementById('reset-pwd-input-' + userId);
        const mobIn = document.getElementById('m-reset-pwd-input-' + userId);
        const pwdVal = (deskIn ? deskIn.value : (mobIn ? mobIn.value : '')) || currentResetPasswords[userId] || '';
        const trimmed = pwdVal.trim();
        if (!trimmed) {
            const errDesk = document.getElementById('reset-pwd-error-' + userId);
            if (errDesk) errDesk.classList.remove('hidden');
            const errMob = document.getElementById('m-reset-pwd-error-' + userId);
            if (errMob) errMob.classList.remove('hidden');
            return;
        }
        const user = mockUserData.find(u => u.id === userId);
        if (user) {
            user.password = trimmed;
            const savedPwds = JSON.parse(sessionStorage.getItem('mockUserPasswords') || '{}');
            savedPwds[user.id] = trimmed;
            if (user.roleValue) savedPwds[user.roleValue] = trimmed;
            sessionStorage.setItem('mockUserPasswords', JSON.stringify(savedPwds));
            if (typeof systemUsers !== 'undefined' && systemUsers[user.roleValue]) {
                systemUsers[user.roleValue].password = trimmed;
            }
            delete currentResetPasswords[userId];
            openPasswordResetUserId = null;
            passwordResetSuccessMessage = { userId: user.id, name: user.name };
            clearTimeout(passwordResetSuccessTimer);
            passwordResetSuccessTimer = setTimeout(() => {
                passwordResetSuccessMessage = null;
                renderUsers();
            }, 3000);
        }
        renderUsers();
    } else if (action === 'cancel-password') {
        delete currentResetPasswords[userId];
        openPasswordResetUserId = null;
        renderUsers();
    } else if (action === 'deactivate') {
        const user = mockUserData.find(u => u.id === userId);
        if (!user || isCurrentUser(user)) return;
        if (openDeactivateUserId === userId) {
            openDeactivateUserId = null;
        } else {
            openDeactivateUserId = userId;
            openPasswordResetUserId = null;
        }
        renderUsers();
    } else if (action === 'confirm-deactivate') {
        const user = mockUserData.find(u => u.id === userId);
        if (user) {
            if (isCurrentUser(user)) return;
            if (user.roleValue === 'super_admin' && user.status === 'Active' && getActiveSuperAdminCount() <= 1) return;
            user.status = 'Inactive';
            user.statusValue = 'suspended';
            user.statusClass = 'bg-slate-100 text-slate-600 border-slate-200';
            user.statusDot = 'bg-slate-400';
        }
        openDeactivateUserId = null;
        renderUsers();
    } else if (action === 'cancel-deactivate') {
        openDeactivateUserId = null;
        renderUsers();
    } else if (action === 'reactivate') {
        const user = mockUserData.find(u => u.id === userId);
        if (user) {
            user.status = 'Active';
            user.statusValue = 'active';
            user.statusClass = 'bg-emerald-50 text-emerald-700 border-emerald-200';
            user.statusDot = 'bg-emerald-500';
        }
        openDeactivateUserId = null;
        renderUsers();
    }
});

// Real-time change listener for user role dropdown to enforce Last-Super-Admin warning
document.addEventListener('change', function(e) {
    if (e.target.id === 'user-form-role') {
        const lastMsg = document.getElementById('user-form-role-last-super-admin');
        if (currentEditingUserId) {
            const u = mockUserData.find(item => item.id === currentEditingUserId);
            if (u && u.roleValue === 'super_admin' && u.status === 'Active' && e.target.value !== 'super_admin' && getActiveSuperAdminCount() <= 1) {
                if (lastMsg) lastMsg.classList.remove('hidden');
            } else {
                if (lastMsg) lastMsg.classList.add('hidden');
            }
        }
    }
});

// Real-time input synchronization for user forms and inline reset inputs
document.addEventListener('input', function(e) {
    if (e.target.id === 'user-form-name') {
        const nameErr = document.getElementById('user-form-name-error');
        if (nameErr && e.target.value.trim()) {
            nameErr.classList.add('hidden');
            e.target.classList.remove('border-red-500');
        }
    }
    if (e.target.id && (e.target.id.startsWith('reset-pwd-input-') || e.target.id.startsWith('m-reset-pwd-input-'))) {
        const uId = e.target.id.replace('reset-pwd-input-', '').replace('m-reset-pwd-input-', '');
        currentResetPasswords[uId] = e.target.value;
        const errDesk = document.getElementById('reset-pwd-error-' + uId);
        if (errDesk && e.target.value.trim()) errDesk.classList.add('hidden');
        const errMob = document.getElementById('m-reset-pwd-error-' + uId);
        if (errMob && e.target.value.trim()) errMob.classList.add('hidden');
    }
});

// Global Event Listeners for User Directory Filtering
document.addEventListener('input', function(e) {
    if (e.target.id === 'user-search') renderUsers();
});

document.addEventListener('change', function(e) {
    if (e.target.id === 'user-filter-role' || e.target.id === 'user-filter-status') {
        renderUsers();
    }
});
// --- Interactive Backup & Restore Logic ---

const mockBackupHistory = [
    { id: 1, datetime: 'Oct 12, 2026 - 04:30 PM', action: 'Backup Created (motocare_backup_20261012.sql)', type: 'backup', user: `User (${ROLES_CONFIG.admin.label})` },
    { id: 2, datetime: 'Oct 05, 2026 - 10:15 AM', action: 'Backup Created (motocare_backup_20261005.sql)', type: 'backup', user: `User (${ROLES_CONFIG.admin.label})` },
    { id: 3, datetime: 'Sep 28, 2026 - 05:00 PM', action: 'Backup Created (motocare_backup_20260928.sql)', type: 'backup', user: `User (${ROLES_CONFIG.admin.label})` },
    { id: 4, datetime: 'Sep 15, 2026 - 09:00 AM', action: 'System Restored from Archive', type: 'restore', user: `User (${ROLES_CONFIG.admin.label})` },
    { id: 5, datetime: 'Sep 14, 2026 - 04:00 PM', action: 'Backup Created (motocare_backup_20260914.sql)', type: 'backup', user: `User (${ROLES_CONFIG.admin.label})` }
];

function renderBackupHistory() {
    const tbody = document.getElementById('backup-history-tbody');
    if (!tbody) return;

    // Render Table Rows
    tbody.innerHTML = mockBackupHistory.map(entry => {
        const textClass = entry.type === 'backup' ? 'text-blue-600' : 'text-red-600';
        return `
            <tr class="hover:bg-slate-50 transition-colors">
                <td class="p-3.5 text-slate-600 font-medium">${entry.datetime}</td>
                <td class="p-3.5 font-semibold ${textClass}">${entry.action}</td>
                <td class="p-3.5 text-slate-700 font-medium">${entry.user}</td>
            </tr>
        `;
    }).join('');

    // Update Top Status Information dynamically based on newest backup record
    const lastBackup = mockBackupHistory.find(e => e.type === 'backup');
    if (lastBackup) {
        const dateText = document.getElementById('last-backup-date-text');
        if (dateText) dateText.textContent = `Last Manual Backup: ${lastBackup.datetime}`;
    }

    const statusContainer = document.getElementById('backup-status-container');
    if (statusContainer) {
        // Simple logic for the prototype: if the first history item is from today/Oct 24, show as Up to Date
        const isUpToDate = mockBackupHistory[0].datetime.includes('Oct 24');
        
        if (isUpToDate) {
            statusContainer.innerHTML = `
                <span class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                    <span class="w-2 h-2 rounded-full bg-emerald-500"></span> Backup Up to Date
                </span>
            `;
        } else {
            statusContainer.innerHTML = `
                <span class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold bg-red-50 text-red-700 border border-red-200">
                    <span class="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span> Backup Older Than 7 Days (Action Recommended)
                </span>
            `;
        }
    }
}

// Global functions for Backup & Restore UI triggers
window.updateRestoreFileName = function(input) {
    const fileNameSpan = document.getElementById('restore-file-name');
    if (!fileNameSpan) return;
    
    if (input.files && input.files.length > 0) {
        fileNameSpan.textContent = input.files[0].name;
        fileNameSpan.classList.replace('text-slate-700', 'text-blue-600');
    } else {
        fileNameSpan.textContent = 'Choose database file (.sql or .json)';
        fileNameSpan.classList.replace('text-blue-600', 'text-slate-700');
    }
};

window.createManualBackup = function(e) {
    if (!rolePermissions[currentRole] || !rolePermissions[currentRole].includes('backup')) return;
    const btn = e.currentTarget;
    const originalHTML = btn.innerHTML;
    btn.innerHTML = `<i class="ph-bold ph-spinner animate-spin"></i> Generating Backup...`;
    btn.disabled = true;

    // Simulate backend delay, update history table dynamically
    setTimeout(() => {
        btn.innerHTML = originalHTML;
        btn.disabled = false;
        
        const now = new Date();
        const formattedDate = "Oct 24, 2026 - " + now.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
        
        mockBackupHistory.unshift({
            id: Date.now(),
            datetime: formattedDate,
            action: 'Backup Created (motocare_backup_20261024.sql)',
            type: 'backup',
            user: `${systemUsers[currentRole]?.name || 'System Admin'} (${ROLES_CONFIG[currentRole]?.label || 'Super Admin'})`
        });
        
        renderBackupHistory();
        alert('Backup file downloaded successfully!');
    }, 1200);
};

window.openRestorePasswordModal = function() {
    if (!rolePermissions[currentRole] || !rolePermissions[currentRole].includes('backup')) return;
    const fileInput = document.getElementById('restore-file-input');
    if (!fileInput || fileInput.files.length === 0) {
        alert("Please select a backup file to restore first.");
        return;
    }
    toggleModal('modal-restore-password', 'restore-password-backdrop', 'restore-password-content', true);
};

window.closeRestorePasswordModal = function() {
    toggleModal('modal-restore-password', 'restore-password-backdrop', 'restore-password-content', false);
};

window.confirmSystemRestore = function(e) {
    if (!rolePermissions[currentRole] || !rolePermissions[currentRole].includes('backup')) return;
    const pass = document.getElementById('restore-admin-pass').value;
    if (!pass) {
        alert('Please enter your password to proceed.');
        return;
    }
    const btn = e.currentTarget;
    const originalHTML = btn.innerHTML;
    btn.innerHTML = `<i class="ph-bold ph-spinner animate-spin"></i> Restoring Database...`;
    btn.disabled = true;
             
    // Simulate backend delay, update history table dynamically
    setTimeout(() => {
        btn.innerHTML = originalHTML;
        btn.disabled = false;
        document.getElementById('restore-admin-pass').value = '';
        
        const now = new Date();
        const formattedDate = "Oct 24, 2026 - " + now.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
        
        mockBackupHistory.unshift({
            id: Date.now(),
            datetime: formattedDate,
            action: 'System Restored from Archive',
            type: 'restore',
            user: `${systemUsers[currentRole]?.name || 'System Admin'} (${ROLES_CONFIG[currentRole]?.label || 'Super Admin'})`
        });
        
        closeRestorePasswordModal();
        
        // Reset file input UI
        const fileInput = document.getElementById('restore-file-input');
        if(fileInput) fileInput.value = '';
        updateRestoreFileName({ files: [] });

        renderBackupHistory();
        alert('System successfully restored from archive! Audit log updated.');
    }, 1200);
};
// --- Interactive Login & Logout Logic ---

window.handleLogout = function() {
    const loginScreen = document.getElementById('login-screen');
    if (loginScreen) {
        loginScreen.classList.remove('hidden');
        loginScreen.classList.add('flex');
    }
};

window.handleLogin = function(roleId, btn) {
    const originalContent = btn.innerHTML;
    
    // Show loading state on the clicked button
    btn.innerHTML = `
        <div class="flex items-center justify-center w-full py-2 gap-3">
            <i class="ph-bold ph-spinner animate-spin text-2xl text-slate-500"></i>
            <span class="font-bold text-slate-700">Authenticating...</span>
        </div>
    `;
    
    // Simulate network validation delay
    setTimeout(() => {
        btn.innerHTML = originalContent; // Restore original button HTML
        
        // Hide the login screen overlay
        const loginScreen = document.getElementById('login-screen');
        loginScreen.classList.add('hidden');
        loginScreen.classList.remove('flex');
        
        // Sync the bottom-left dropdown to match the selected role
        const switcher = document.getElementById('role-switcher');
        if (switcher) switcher.value = roleId;
        
        // Run your existing role-switching permissions logic
        switchRole(roleId, true);
        
        // Force navigate the user back to the Dashboard upon successful login
        setActiveNavLink('dashboard');
        loadView('dashboard');
        
    }, 800);
};
// --- Interactive Login, PIN Pad & Logout Logic ---

let currentLoginRole = null;
let enteredPin = "";

window.handleLogout = function() {
    const loginScreen = document.getElementById('login-screen');
    if (loginScreen) {
        loginScreen.classList.remove('hidden');
        loginScreen.classList.add('flex');
        backToProfiles(); // Reset to profile selection
    }
};
window.closeLoginScreen = function() {
    const loginScreen = document.getElementById('login-screen');
    if (loginScreen) {
        loginScreen.classList.add('hidden');
        loginScreen.classList.remove('flex');
    }
};

window.promptPin = function(roleId, name, initials, colorClass) {
    currentLoginRole = roleId;
    enteredPin = "";
    if (typeof updatePinDisplay === 'function') updatePinDisplay();

    // Update PIN screen UI with the selected user's details
    const pinName = document.getElementById('pin-name');
    if (pinName) pinName.textContent = name;
    const avatar = document.getElementById('pin-avatar');
    if (avatar) {
        avatar.textContent = initials;
        avatar.className = `w-16 h-16 rounded-full text-white flex items-center justify-center font-bold text-2xl shadow-inner ${colorClass}`;
    }

    // Switch Views inside the modal
    const profileView = document.getElementById('login-profile-view');
    if (profileView) profileView.classList.add('hidden');
    const pinView = document.getElementById('login-pin-view');
    if (pinView) pinView.classList.remove('hidden');
};

window.backToProfiles = function() {
    currentLoginRole = null;
    enteredPin = "";
    if (typeof updatePinDisplay === 'function') updatePinDisplay();
    
    const pinView = document.getElementById('login-pin-view');
    if (pinView) pinView.classList.add('hidden');
    const profileView = document.getElementById('login-profile-view');
    if (profileView) profileView.classList.remove('hidden');
};

// Numpad Functions
window.addPin = function(num) {
    if (enteredPin.length < 4) {
        enteredPin += num;
        if (typeof updatePinDisplay === 'function') updatePinDisplay();
    }
};

window.removePin = function() {
    if (enteredPin.length > 0) {
        enteredPin = enteredPin.slice(0, -1);
        if (typeof updatePinDisplay === 'function') updatePinDisplay();
    }
};

window.clearPin = function() {
    enteredPin = "";
    if (typeof updatePinDisplay === 'function') updatePinDisplay();
};

function updatePinDisplay() {
    const dots = document.querySelectorAll('.pin-dot');
    if (dots.length > 0) {
        dots.forEach((dot, index) => {
            if (index < enteredPin.length) {
                dot.classList.add('bg-blue-600', 'border-blue-600');
                dot.classList.remove('border-slate-300', 'bg-transparent');
            } else {
                dot.classList.remove('bg-blue-600', 'border-blue-600');
                dot.classList.add('border-slate-300', 'bg-transparent');
            }
        });
    }

    const submitBtn = document.getElementById('btn-login-submit');
    if (submitBtn && enteredPin) {
        if (enteredPin.length === 4) {
            submitBtn.disabled = false;
            submitBtn.classList.remove('opacity-50', 'cursor-not-allowed');
        } else {
            submitBtn.disabled = true;
            submitBtn.classList.add('opacity-50', 'cursor-not-allowed');
        }
    }
}

window.submitLogin = function() {
    const roleInput = document.getElementById('login-selected-role');
    const roleId = roleInput ? roleInput.value : '';
    const roleErrorMsg = document.getElementById('login-role-error');
    if (roleErrorMsg) {
        roleErrorMsg.textContent = 'Please choose an account.';
        roleErrorMsg.classList.add('hidden');
    }
    
    if (!roleId) {
        if (roleErrorMsg) roleErrorMsg.classList.remove('hidden');
        return;
    }
    
    const user = systemUsers[roleId];
    if (!user) {
        return;
    }
    
    const btn = document.getElementById('btn-login-submit');
    const originalContent = btn ? btn.innerHTML : '';
    
    if (btn) btn.innerHTML = '<i class="ph-bold ph-spinner animate-spin text-xl"></i> Authenticating...';
    
    setTimeout(() => {
        if (btn) btn.innerHTML = originalContent; 
        
        // Hide the login screen overlay
        const loginScreen = document.getElementById('login-screen');
        if (loginScreen) {
            loginScreen.classList.add('hidden');
            loginScreen.classList.remove('flex');
        }
        
        // Sync the bottom-left dropdown to match the selected role
        const targetRole = currentLoginRole || roleId;
        const switcher = document.getElementById('role-switcher');
        if (switcher) switcher.value = targetRole;
        
        localStorage.setItem('activeRole', targetRole);
        sessionStorage.setItem('currentUserRole', targetRole);
        
        // Run existing role-switching permissions logic
        switchRole(targetRole, true);
        
        // Navigate back to Dashboard
        setActiveNavLink('dashboard');
        loadView('dashboard');
        
    }, 800);
};
// --- Interactive Active Repairs Logic ---

let currentRepairFilter = 'all';

const mockRepairsData = [
    {
        id: 'JOB #1042',
        plate: 'ABC-1234',
        brandId: 'yamaha',
        brandText: '',
        model: 'Sniper',
        customer: 'Juan Dela Cruz',
        mechanicOptions: [`Mike (${ROLES_CONFIG.mechanic.label})`, `Leo (${ROLES_CONFIG.mechanic.label})`],
        selectedMechIndex: 0,
        diagnosis: 'Coolant temp sensor high (P0118). Brake pads heavily worn. Requires part replacement.',
        statusId: 'waiting',
        statusName: 'Waiting for Parts',
        statusClass: 'bg-orange-50 text-orange-600 border-orange-200',
        dotClass: 'bg-orange-500',
        repairPlan: {
            parts: [
                {
                    id: 'part-1',
                    part: { name: 'Coolant Temperature Sensor', price: 850 },
                    target: 'Coolant temp sensor high (P0118) (Engine)',
                    qty: 1,
                    handling: 'order',
                    expectedArrival: '2026-10-07',
                    partStatus: 'Waiting'
                },
                {
                    id: 'part-2',
                    part: { name: 'Front Brake Pads', price: 450 },
                    target: 'Brake pads heavily worn (Brakes)',
                    qty: 1,
                    handling: 'order',
                    expectedArrival: '2026-10-06',
                    partStatus: 'Ordered'
                }
            ],
            laborCost: 500,
            estimatedTotal: 1800
        }
    },
    {
        id: 'JOB #1041',
        plate: 'XYZ-9876',
        brandId: 'yamaha',
        brandText: '',
        model: 'Sniper',
        customer: 'Maria Clara',
        mechanicOptions: [`Mike (${ROLES_CONFIG.mechanic.label})`, `Leo (${ROLES_CONFIG.mechanic.label})`],
        selectedMechIndex: 1,
        diagnosis: 'Throttle body cleaning and standard change oil.',
        statusId: 'pending',
        statusName: 'Pending Post-Scan / Calibration',
        statusClass: 'bg-purple-50 text-purple-600 border-purple-200',
        dotClass: 'bg-purple-500',
        repairPlan: {
            parts: [],
            laborCost: 800,
            estimatedTotal: 800
        }
    },
    {
        id: 'JOB #1043',
        plate: 'DEF-5678',
        brandId: 'rusi',
        brandText: '',
        model: 'Model TBC',
        customer: 'Antonio Luna',
        mechanicOptions: [`Mike (${ROLES_CONFIG.mechanic.label})`, `Leo (${ROLES_CONFIG.mechanic.label})`],
        selectedMechIndex: 1,
        diagnosis: 'Chain and sprocket set replacement.',
        statusId: 'progress',
        statusName: 'In Progress',
        statusClass: 'bg-blue-50 text-blue-600 border-blue-200',
        dotClass: 'bg-blue-500 animate-pulse',
        repairPlan: {
            parts: [],
            laborCost: 600,
            estimatedTotal: 600
        }
    },
    {
        id: 'JOB #1044',
        plate: 'QRS-4455',
        brandId: 'other',
        brandText: '',
        model: 'Model TBC',
        customer: 'Gabriela Silang',
        mechanicOptions: [`Mike (${ROLES_CONFIG.mechanic.label})`, `Leo (${ROLES_CONFIG.mechanic.label})`],
        selectedMechIndex: 0,
        diagnosis: 'Clutch lining replacement.',
        statusId: 'progress',
        statusName: 'In Progress',
        statusClass: 'bg-blue-50 text-blue-600 border-blue-200',
        dotClass: 'bg-blue-500 animate-pulse',
        repairPlan: {
            parts: [],
            laborCost: 750,
            estimatedTotal: 750
        }
    },
    {
        id: 'JOB #1045',
        plate: 'HON-5555',
        brandId: 'honda',
        brandText: '',
        model: 'Model TBC',
        customer: 'Jose Rizal',
        mechanicOptions: [`Mike (${ROLES_CONFIG.mechanic.label})`, `Leo (${ROLES_CONFIG.mechanic.label})`],
        selectedMechIndex: 0,
        diagnosis: 'Brake fluid flush and system inspection.',
        statusId: 'progress',
        statusName: 'In Progress',
        statusClass: 'bg-blue-50 text-blue-600 border-blue-200',
        dotClass: 'bg-blue-500 animate-pulse',
        repairPlan: {
            parts: [],
            laborCost: 500,
            estimatedTotal: 500
        }
    },
    {
        id: 'JOB #1046',
        plate: 'KAW-6666',
        brandId: 'kawasaki',
        brandText: '',
        model: 'Model TBC',
        customer: 'Apolinario Mabini',
        mechanicOptions: [`Mike (${ROLES_CONFIG.mechanic.label})`, `Leo (${ROLES_CONFIG.mechanic.label})`],
        selectedMechIndex: 1,
        diagnosis: 'Drive belt replacement.',
        statusId: 'waiting',
        statusName: 'Waiting for Parts',
        statusClass: 'bg-orange-50 text-orange-600 border-orange-200',
        dotClass: 'bg-orange-500',
        repairPlan: {
            parts: [],
            laborCost: 650,
            estimatedTotal: 650
        }
    },
    {
        id: 'JOB #1047',
        plate: 'MOT-7777',
        brandId: 'motoposh',
        brandText: '',
        model: 'Model TBC',
        customer: 'Emilio Aguinaldo',
        mechanicOptions: [`Mike (${ROLES_CONFIG.mechanic.label})`, `Leo (${ROLES_CONFIG.mechanic.label})`],
        selectedMechIndex: 0,
        diagnosis: 'Carburetor tuning and cleaning.',
        statusId: 'ready',
        statusName: 'Ready for Billing',
        statusClass: 'bg-emerald-50 text-emerald-600 border-emerald-200',
        dotClass: 'bg-emerald-500',
        repairPlan: {
            parts: [],
            laborCost: 550,
            estimatedTotal: 550
        }
    }
];

function checkJobPartsStatus(jobId) {
    const job = mockRepairsData.find(j => j.id === jobId);
    if (!job || !job.repairPlan || !job.repairPlan.parts) return;
    
    const pendingParts = job.repairPlan.parts.filter(p => p.handling === 'order' && p.partStatus !== 'Received');
    
    if (pendingParts.length === 0 && job.statusId === 'waiting') {
        job.statusId = 'progress';
        job.statusName = 'In Progress';
        job.statusClass = 'bg-blue-50 text-blue-600 border-blue-200';
        job.dotClass = 'bg-blue-500 animate-pulse';
        job.startedAnyway = false;
        
        showToast(`All parts ready. ${job.id} moved to In Progress.`);
        renderRepairs();
    } else {
        renderRepairs();
    }
}

function showToast(msg) {
    let toast = document.createElement('div');
    const isMobile = document.body.classList.contains('mobile-app');
    const bottomClass = isMobile ? 'bottom-24 left-4 right-4 mx-auto w-max max-w-[90%]' : 'bottom-4 right-4';
    toast.className = `fixed ${bottomClass} bg-slate-800 text-white px-4 py-2 rounded shadow-lg text-sm font-medium z-[9999] transition-opacity duration-300 text-center`;
    toast.textContent = msg;
    document.body.appendChild(toast);
    setTimeout(() => {
        toast.style.opacity = '0';
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

window.markPartStatus = function(jobId, partId, newStatus) {
    const job = mockRepairsData.find(j => j.id === jobId);
    if (!job) return;
    const part = job.repairPlan.parts.find(p => p.id === partId);
    if (!part) return;
    part.partStatus = newStatus;
    checkJobPartsStatus(jobId);
};

window.checkStockForJob = function(jobId) {
    const job = mockRepairsData.find(j => j.id === jobId);
    if (!job) return;
    
    if (job.repairPlan && job.repairPlan.parts) {
        job.repairPlan.parts.forEach(p => {
            if (p.handling === 'order') {
                p.partStatus = 'Received';
            }
        });
    }
    checkJobPartsStatus(jobId);
};

window.startRepairAnyway = function(jobId) {
    const job = mockRepairsData.find(j => j.id === jobId);
    if (!job) return;
    
    job.statusId = 'progress';
    job.statusName = 'In Progress';
    job.statusClass = 'bg-blue-50 text-blue-600 border-blue-200';
    job.dotClass = 'bg-blue-500 animate-pulse';
    job.startedAnyway = true;
    renderRepairs();
};

window.markRepairDone = function(jobId) {
    const job = mockRepairsData.find(j => j.id === jobId);
    if (!job) return;
    
    // Check if ecu was used (for mock demo, if it has 'sensor' in diagnosis or randomly)
    const ecuUsed = job.diagnosis.toLowerCase().includes('sensor') || job.diagnosis.toLowerCase().includes('ecu');
    
    if (ecuUsed) {
        job.statusId = 'pending';
        job.statusName = 'Pending Post-Scan / Calibration';
        job.statusClass = 'bg-purple-50 text-purple-600 border-purple-200';
        job.dotClass = 'bg-purple-500';
    } else {
        job.statusId = 'ready';
        job.statusName = 'Ready for Billing';
        job.statusClass = 'bg-emerald-50 text-emerald-600 border-emerald-200';
        job.dotClass = 'bg-emerald-500';
    }
    job.startedAnyway = false;
    renderRepairs();
};

window.completePostScan = function(jobId) {
    const job = mockRepairsData.find(j => j.id === jobId);
    if (!job) return;
    
    job.statusId = 'ready';
    job.statusName = 'Ready for Billing';
    job.statusClass = 'bg-emerald-50 text-emerald-600 border-emerald-200';
    job.dotClass = 'bg-emerald-500';
    renderRepairs();
};

// Payment logic state
let currentPaymentJob = null;
let currentPayMethod = 'Cash';

window.proceedToPayment = function(jobId) {
    const job = mockRepairsData.find(j => j.id === jobId);
    if (!job) return;
    
    currentPaymentJob = job;
    
    // Hide active repairs main, show payment
    document.getElementById('active-repairs-main').classList.add('hidden');
    document.getElementById('payment-screen-container').classList.remove('hidden');
    document.getElementById('payment-form-state').classList.remove('hidden');
    document.getElementById('payment-success-state').classList.add('hidden');
    
    document.getElementById('payment-job-summary').textContent = `${job.customer} - ${job.plate} (${job.model}) • ${job.id}`;
    
    // Adjust layout for mobile
    const isMobile = document.body.classList.contains('mobile-app');
    const payContainer = document.getElementById('payment-screen-container');
    const cashSection = document.getElementById('cash-payment-section');
    const payBtn = document.getElementById('btn-complete-payment');
    const payMethodWrapper = document.querySelector('.pay-method-btn').parentElement;
    
    if (isMobile) {
        payContainer.className = 'w-full bg-white flex flex-col min-h-screen pb-32 pt-2 relative z-10';
        if (cashSection) cashSection.className = 'mb-6 flex flex-col gap-4';
        if (payMethodWrapper) payMethodWrapper.className = 'flex flex-wrap gap-2';
        if (payBtn) payBtn.className = 'w-[calc(100%-32px)] bg-slate-800 text-white font-bold py-3.5 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed fixed bottom-20 left-4 right-4 shadow-xl z-20 transition-all';
        document.getElementById('payment-change')?.classList.add('text-2xl', 'py-4');
        document.getElementById('payment-amount')?.classList.add('text-2xl', 'py-4');
    } else {
        payContainer.className = 'max-w-3xl mx-auto bg-white p-6 rounded-xl shadow-sm border border-slate-200';
        if (cashSection) cashSection.className = 'mb-6 flex gap-4';
        if (payMethodWrapper) payMethodWrapper.className = 'flex gap-2';
        if (payBtn) payBtn.className = 'w-full bg-slate-800 text-white font-bold py-3 rounded-lg hover:bg-slate-900 disabled:opacity-50 disabled:cursor-not-allowed';
        document.getElementById('payment-change')?.classList.remove('text-2xl', 'py-4');
        document.getElementById('payment-amount')?.classList.remove('text-2xl', 'py-4');
    }
    
    let itemsHTML = '';
    let grandTotal = 0;
    
    if (job.repairPlan && job.repairPlan.parts) {
        job.repairPlan.parts.forEach(p => {
            const lineTotal = p.part.price * p.qty;
            grandTotal += lineTotal;
            itemsHTML += `
                <div class="flex justify-between text-sm py-1">
                    <div>
                        <span class="font-semibold text-slate-700">${p.part.name}</span> <span class="text-xs text-slate-500">x${p.qty}</span>
                        <div class="text-[10px] text-slate-400">For: ${p.target}</div>
                    </div>
                    <span class="font-mono text-slate-700">\u20B1${lineTotal.toLocaleString('en-US', {minimumFractionDigits: 2})}</span>
                </div>
            `;
        });
        
        if (job.repairPlan.laborCost) {
            grandTotal += job.repairPlan.laborCost;
            itemsHTML += `
                <div class="flex justify-between text-sm py-2 mt-2 border-t border-slate-100">
                    <div class="font-semibold text-slate-700">Labor</div>
                    <span class="font-mono text-slate-700">\u20B1${job.repairPlan.laborCost.toLocaleString('en-US', {minimumFractionDigits: 2})}</span>
                </div>
            `;
        }
    }
    
    document.getElementById('payment-items').innerHTML = itemsHTML || '<div class="text-sm text-slate-500 text-center py-2">No items</div>';
    document.getElementById('payment-grand-total').textContent = `\u20B1${grandTotal.toLocaleString('en-US', {minimumFractionDigits: 2})}`;
    
    currentPaymentJob.computedTotal = grandTotal;
    
    // reset form
    document.getElementById('payment-amount').value = '';
    document.getElementById('payment-change').textContent = '0.00';
    updatePaymentValidation();
};

window.closePaymentScreen = function() {
    document.getElementById('active-repairs-main').classList.remove('hidden');
    document.getElementById('payment-screen-container').classList.add('hidden');
    renderRepairs(); // refresh grid
};

window.completePayment = function() {
    if (!currentPaymentJob) return;
    
    // status paid
    currentPaymentJob.statusId = 'paid';
    currentPaymentJob.statusName = 'Paid / Completed';
    currentPaymentJob.statusClass = 'bg-slate-100 text-slate-600 border-slate-200';
    currentPaymentJob.dotClass = 'bg-slate-400';
    
    // Deduct inventory
    if (currentPaymentJob.repairPlan && currentPaymentJob.repairPlan.parts) {
        currentPaymentJob.repairPlan.parts.forEach(p => {
            if (p.partStatus === 'Received' || !p.partStatus) {
                const invItem = mockInventory.find(inv => inv.name === p.part.name);
                if (invItem) {
                    invItem.stock = Math.max(0, invItem.stock - p.qty);
                }
            }
        });
    }
    
    document.getElementById('payment-form-state').classList.add('hidden');
    document.getElementById('payment-success-state').classList.remove('hidden');
    
    document.getElementById('payment-success-summary').textContent = `${currentPaymentJob.id} for ${currentPaymentJob.plate} has been successfully paid via ${currentPayMethod}.`;
};

// Add event listeners for payment method chips and amount
document.addEventListener('click', function(e) {
    if (e.target.classList.contains('pay-method-btn')) {
        document.querySelectorAll('.pay-method-btn').forEach(btn => {
            btn.className = 'pay-method-btn flex-1 py-2 border border-slate-200 bg-white text-slate-600 rounded font-semibold text-sm hover:bg-slate-50';
        });
        e.target.className = 'pay-method-btn flex-1 py-2 border border-blue-500 bg-blue-50 text-blue-700 rounded font-semibold text-sm';
        currentPayMethod = e.target.getAttribute('data-method');
        
        const cashSection = document.getElementById('cash-payment-section');
        if (cashSection) {
            if (currentPayMethod === 'Cash') {
                cashSection.classList.remove('hidden');
                cashSection.classList.add('flex');
            } else {
                cashSection.classList.add('hidden');
                cashSection.classList.remove('flex');
            }
        }
        updatePaymentValidation();
    }
});

document.addEventListener('input', function(e) {
    if (e.target.id === 'payment-amount' || e.target.id === 'payment-discount') {
        updatePaymentValidation();
    }
});

function updatePaymentValidation() {
    if (!currentPaymentJob) return;
    const btn = document.getElementById('btn-complete-payment');
    if (!btn) return;
    
    const discount = parseFloat(document.getElementById('payment-discount')?.value) || 0;
    const baseTotal = currentPaymentJob.computedTotal || 0;
    const total = Math.max(0, baseTotal - discount);
    
    document.getElementById('payment-grand-total').textContent = `\u20B1${total.toLocaleString('en-US', {minimumFractionDigits: 2})}`;
    
    if (currentPayMethod === 'Cash') {
        const amount = parseFloat(document.getElementById('payment-amount').value) || 0;
        const change = amount - total;
        
        document.getElementById('payment-change').textContent = change >= 0 ? change.toLocaleString('en-US', {minimumFractionDigits: 2}) : '0.00';
        
        btn.disabled = amount < total;
    } else {
        btn.disabled = false;
        document.getElementById('payment-change').textContent = '0.00';
    }
}

window.toggleRepairCard = function(id) {
    if (!window.expandedRepairCards) window.expandedRepairCards = new Set();
    const isExpanding = !window.expandedRepairCards.has(id);
    
    if (isExpanding) {
        window.expandedRepairCards.add(id);
    } else {
        window.expandedRepairCards.delete(id);
    }
    
    // Animate DOM directly to allow smooth transition without destroying elements
    const contentDiv = document.getElementById(`repair-expanded-${id}`);
    const chevron = document.getElementById(`repair-chevron-${id}`);
    
    if (contentDiv && chevron) {
        if (isExpanding) {
            contentDiv.classList.remove('max-h-0', 'opacity-0');
            contentDiv.classList.add('max-h-[2000px]', 'opacity-100');
            chevron.classList.add('rotate-180');
        } else {
            contentDiv.classList.remove('max-h-[2000px]', 'opacity-100');
            contentDiv.classList.add('max-h-0', 'opacity-0');
            chevron.classList.remove('rotate-180');
        }
    } else {
        renderRepairs();
    }
};

function renderRepairs() {
    const grid = document.getElementById('repairs-grid');
    if (!grid) return;
    
    const isMobile = document.body.classList.contains('mobile-app');
    
    const searchInput = document.getElementById('repair-search');
    const searchContainer = searchInput?.parentElement;
    const filterContainer = document.getElementById('repair-filters');
    
    if (isMobile) {
        grid.className = 'flex flex-col gap-3 pb-32';
        if (searchInput) searchInput.placeholder = "Search plate, customer or job #";
        if (searchContainer) searchContainer.className = 'relative w-full';
        if (filterContainer) {
            filterContainer.style.maskImage = 'linear-gradient(to right, black 85%, transparent 100%)';
            filterContainer.style.webkitMaskImage = 'linear-gradient(to right, black 85%, transparent 100%)';
        }
    } else {
        grid.className = 'grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5';
        if (searchInput) searchInput.placeholder = "Search by Plate No., Customer Name, or Job ID...";
        if (searchContainer) searchContainer.className = 'relative w-full sm:max-w-md';
        if (filterContainer) {
            filterContainer.style.maskImage = '';
            filterContainer.style.webkitMaskImage = '';
        }
    }

    const query = (document.getElementById('repair-search')?.value || '').toLowerCase();

    // Filter Data
    const filtered = mockRepairsData.filter(job => {
        const brand = getBrandLabel(job);
        const matchesSearch = job.plate.toLowerCase().includes(query) || 
                              job.customer.toLowerCase().includes(query) || 
                              job.id.toLowerCase().includes(query) ||
                              (job.model && job.model.toLowerCase().includes(query)) ||
                              (brand && brand.toLowerCase().includes(query));
                              
        const matchesStatus = currentRepairFilter === 'all' ? job.statusId !== 'paid' : job.statusId === currentRepairFilter;

        return matchesSearch && matchesStatus;
    });

    // Update Filter Chips Counts
    const statusCounts = { all: mockRepairsData.filter(j => j.statusId !== 'paid').length };
    mockRepairsData.forEach(j => {
        statusCounts[j.statusId] = (statusCounts[j.statusId] || 0) + 1;
    });
    
    document.querySelectorAll('.repair-filter-btn').forEach(btn => {
        const f = btn.getAttribute('data-filter');
        const count = statusCounts[f] || 0;
        if (!btn.hasAttribute('data-original-text')) {
            btn.setAttribute('data-original-text', btn.textContent.trim());
        }
        const origText = btn.getAttribute('data-original-text');
        
        if (isMobile) {
            btn.innerHTML = `${origText} <span class="ml-1 px-1.5 py-0.5 bg-black/10 rounded text-[10px]">${count}</span>`;
        } else {
            btn.textContent = origText;
        }
    });

    let resultCountHTML = '';
    if (isMobile && filtered.length > 0) {
        const countText = filtered.length === 1 ? '1 job' : `${filtered.length} jobs`;
        resultCountHTML = `<div class="text-sm font-semibold text-slate-500 px-1 mb-1">${countText}</div>`;
    }

    if (filtered.length === 0) {
        grid.innerHTML = `<div class="col-span-full p-8 text-center text-slate-500 font-medium bg-white rounded-xl border border-slate-200 shadow-sm">${isMobile ? 'No jobs found' : 'No active repairs found matching your criteria.'}</div>`;
        return;
    }

    // Render HTML Cards
    grid.innerHTML = resultCountHTML + filtered.map(job => {
        const opacityClass = (job.statusId !== 'progress' && job.statusId !== 'waiting') ? 'opacity-80' : '';
        const vehicleLabel = (getBrandLabel(job) ? `${getBrandLabel(job)} ${job.model || ''}`.trim() : (job.model || '')).trim();
        
        // Build mechanic select options
        const mechOptions = job.mechanicOptions.map((mech, idx) => 
            `<option ${idx === job.selectedMechIndex ? 'selected' : ''}>${mech}</option>`
        ).join('');

        let partsHTML = '';
        const showPartsList = job.statusId === 'waiting' || (job.statusId === 'progress' && job.startedAnyway);
        let hasPending = false;
        
        if (job.repairPlan && job.repairPlan.parts) {
            const pendingParts = job.repairPlan.parts.filter(p => p.handling === 'order');
            hasPending = pendingParts.some(p => p.partStatus !== 'Received');
            
            if (showPartsList && pendingParts.length > 0) {
                let partsRows = pendingParts.map(p => {
                    let actionsHTML = '';
                    if (p.partStatus !== 'Received') {
                        if (p.partStatus === 'Waiting' || !p.partStatus) {
                            actionsHTML += `<button onclick="markPartStatus('${job.id}', '${p.id}', 'Ordered')" class="text-[10px] text-blue-600 hover:underline">Mark ordered</button>`;
                        }
                        actionsHTML += `<button onclick="markPartStatus('${job.id}', '${p.id}', 'Received')" class="text-[10px] text-emerald-600 hover:underline ml-2">Mark received</button>`;
                    } else {
                        actionsHTML = `<span class="text-[10px] text-emerald-600 font-bold"><i class="ph-bold ph-check"></i> Ready</span>`;
                    }
                    
                    let statusColor = (!p.partStatus || p.partStatus === 'Waiting') ? 'text-amber-600' : (p.partStatus === 'Ordered' ? 'text-blue-600' : 'text-emerald-600');

                    return `
                        <div class="flex flex-col py-1.5 border-b border-slate-100 last:border-0">
                            <div class="flex justify-between items-start mb-0.5">
                                <span class="text-xs font-semibold text-slate-700">${p.part.name} (x${p.qty})</span>
                                <span class="text-[10px] font-bold ${statusColor}">${p.partStatus || 'Waiting'}</span>
                            </div>
                            <div class="flex justify-between items-center">
                                <span class="text-[10px] text-slate-500 truncate pr-2">For: ${p.target}</span>
                                <span class="text-[10px] text-slate-400 whitespace-nowrap">ETA: ${p.expectedArrival || 'N/A'}</span>
                            </div>
                            <div class="flex justify-end mt-1">${actionsHTML}</div>
                        </div>
                    `;
                }).join('');

                let anywayBtn = '';
                if (job.statusId === 'waiting') {
                    anywayBtn = `<button onclick="startRepairAnyway('${job.id}')" class="text-[10px] font-semibold text-amber-600 hover:text-amber-700 hover:underline mt-2 inline-flex items-center gap-1"><i class="ph-bold ph-play"></i> Start repair anyway</button>`;
                }

                let pendingTag = '';
                if (job.statusId === 'progress' && hasPending) {
                    pendingTag = `<span class="absolute top-3 right-3 bg-orange-50 text-orange-600 border-orange-200 border text-[9px] font-bold px-1.5 py-0.5 rounded uppercase tracking-wider"><i class="ph-bold ph-warning-circle"></i> Parts pending</span>`;
                }

                partsHTML = `
                    <div class="mt-3 bg-slate-50 border border-slate-200 rounded p-2.5 relative">
                        ${pendingTag}
                        <span class="text-[10px] font-bold text-slate-500 uppercase block mb-1">Parts Needed</span>
                        ${partsRows}
                        ${anywayBtn}
                    </div>
                `;
            }
        }

        // Determine primary button based on rules
        let btnText = 'View Details';
        let btnClass = 'bg-slate-800 hover:bg-slate-900 text-white';
        let btnAction = 'openRepairModal()';
        let btnDisabled = false;
        let hintHTML = '';
        
        if (job.statusId === 'waiting') {
            btnText = '<i class="ph-bold ph-arrows-clockwise"></i> Check stock';
            btnAction = `checkStockForJob('${job.id}')`;
        } else if (job.statusId === 'progress') {
            btnText = '<i class="ph-bold ph-check-circle"></i> Mark Repair Done';
            btnAction = `markRepairDone('${job.id}')`;
            if (hasPending) {
                btnDisabled = true;
                btnClass = 'bg-slate-300 text-slate-500 cursor-not-allowed';
                hintHTML = `<div class="text-[10px] text-amber-600 font-medium text-right mt-1 w-full"><i class="ph-bold ph-info"></i> Cannot complete: waiting for parts</div>`;
            }
        } else if (job.statusId === 'pending') {
            btnText = '<i class="ph-bold ph-check-square"></i> Complete Post-Scan';
            btnAction = `completePostScan('${job.id}')`;
        } else if (job.statusId === 'ready') {
            btnText = 'Proceed to Payment <i class="ph-bold ph-arrow-right"></i>';
            btnAction = `proceedToPayment('${job.id}')`;
            btnClass = 'bg-blue-600 hover:bg-blue-700 text-white';
        } else if (job.statusId === 'paid') {
            btnText = '<i class="ph-bold ph-receipt"></i> View Receipt';
            btnAction = ''; // dummy action
            btnClass = 'bg-white border border-slate-300 hover:bg-slate-50 text-slate-700';
        }

        if (isMobile) {
            if (!window.expandedRepairCards) window.expandedRepairCards = new Set();
            const isExpanded = window.expandedRepairCards.has(job.id);
            const chevronClass = isExpanded ? 'rotate-180' : '';
            const expandClasses = isExpanded ? 'max-h-[2000px] opacity-100' : 'max-h-0 opacity-0';
            const pendingBadge = hasPending ? `<span class="px-2 py-0.5 rounded text-[10px] font-bold border bg-amber-50 text-amber-700 border-amber-200">Parts pending</span>` : '';
            
            let mobilePartsHTML = '';
            let mobileAnywayBtn = '';
            let mobileHintHTML = hintHTML ? `<div class="text-[10px] text-amber-600 font-medium text-center w-full"><i class="ph-bold ph-info"></i> Cannot complete: waiting for parts</div>` : '';

            if (job.repairPlan && job.repairPlan.parts && showPartsList) {
                const pendingParts = job.repairPlan.parts.filter(p => p.handling === 'order');
                if (pendingParts.length > 0) {
                    let partsRows = pendingParts.map(p => {
                        let actionsHTML = '';
                        if (p.partStatus !== 'Received') {
                            if (p.partStatus === 'Waiting' || !p.partStatus) {
                                actionsHTML += `<button onclick="markPartStatus('${job.id}', '${p.id}', 'Ordered')" class="flex-1 py-1.5 bg-blue-50 text-blue-600 rounded text-xs font-semibold border border-blue-200 active:bg-blue-100">Mark ordered</button>`;
                            }
                            actionsHTML += `<button onclick="markPartStatus('${job.id}', '${p.id}', 'Received')" class="flex-1 py-1.5 bg-emerald-50 text-emerald-600 rounded text-xs font-semibold border border-emerald-200 active:bg-emerald-100 ml-2">Mark received</button>`;
                        } else {
                            actionsHTML = `<div class="w-full text-center py-1.5 bg-emerald-50 text-emerald-700 rounded text-xs font-bold border border-emerald-200"><i class="ph-bold ph-check"></i> Ready</div>`;
                        }
                        
                        let statusColor = (!p.partStatus || p.partStatus === 'Waiting') ? 'text-amber-600' : (p.partStatus === 'Ordered' ? 'text-blue-600' : 'text-emerald-600');

                        return `
                            <div class="flex flex-col p-2.5 bg-white border border-slate-200 rounded-lg mb-2 last:mb-0 shadow-sm">
                                <div class="flex justify-between items-start mb-1.5">
                                    <span class="text-sm font-bold text-slate-700">${p.part.name} <span class="text-xs font-medium text-slate-500 ml-1">x${p.qty}</span></span>
                                    <span class="text-[10px] font-bold ${statusColor} px-1.5 py-0.5 bg-slate-50 border border-slate-100 rounded uppercase tracking-wider">${p.partStatus || 'Waiting'}</span>
                                </div>
                                <div class="flex flex-col gap-0.5 mb-2">
                                    <span class="text-xs text-slate-500"><span class="font-semibold text-slate-600">For:</span> ${p.target}</span>
                                    <span class="text-xs text-slate-500"><span class="font-semibold text-slate-600">ETA:</span> ${p.expectedArrival || 'N/A'}</span>
                                </div>
                                <div class="flex w-full">
                                    ${actionsHTML}
                                </div>
                            </div>
                        `;
                    }).join('');

                    if (job.statusId === 'waiting') {
                        mobileAnywayBtn = `<button onclick="startRepairAnyway('${job.id}')" class="w-full py-2 bg-transparent text-amber-700 border border-amber-200 rounded-lg text-xs font-bold active:bg-amber-50 mt-1"><i class="ph-bold ph-play"></i> Start repair anyway</button>`;
                    }

                    mobilePartsHTML = `
                        <div class="mt-4 pt-4 border-t border-slate-100">
                            <span class="text-xs font-bold text-slate-500 uppercase block mb-3">Parts Needed</span>
                            <div class="flex flex-col bg-slate-50 p-2.5 rounded-lg border border-slate-200">
                                ${partsRows}
                            </div>
                        </div>
                    `;
                }
            }
            
            return `
            <div class="w-full bg-white rounded-xl shadow-sm border border-slate-200 flex flex-col overflow-hidden ${opacityClass}">
                <div class="p-4 flex items-center justify-between min-h-[44px] gap-3 cursor-pointer" onclick="toggleRepairCard('${job.id}')">
                    <div class="flex-1 min-w-0 flex flex-col gap-1">
                        <div class="flex items-center justify-between gap-2">
                            <div class="flex items-baseline gap-2 min-w-0">
                                <span class="font-bold text-slate-800 text-lg whitespace-nowrap">${job.plate}</span>
                                <span class="text-xs text-slate-500 truncate">${vehicleLabel}</span>
                            </div>
                            <span class="text-[10px] font-bold text-slate-400 uppercase tracking-wider whitespace-nowrap">${job.id}</span>
                        </div>
                        <span class="text-sm font-semibold text-slate-700 truncate">${job.customer}</span>
                        <div class="flex items-center gap-2 mt-1 flex-wrap">
                            <span class="px-2 py-0.5 rounded text-[10px] font-bold border flex items-center gap-1.5 ${job.statusClass}">
                                ${job.dotClass ? `<span class="w-1.5 h-1.5 rounded-full ${job.dotClass}"></span>` : ''} ${job.statusName}
                            </span>
                            ${pendingBadge}
                        </div>
                    </div>
                    <div class="flex-shrink-0 flex items-center justify-center w-8 h-8 rounded-full bg-slate-50 text-slate-400">
                        <i id="repair-chevron-${job.id}" class="ph-bold ph-caret-down transition-transform duration-200 ${chevronClass}"></i>
                    </div>
                </div>
                
                <div id="repair-expanded-${job.id}" class="transition-all duration-200 ease-in-out overflow-hidden ${expandClasses}">
                    <div class="p-4 pt-0 border-t border-slate-100 bg-white flex flex-col gap-3">
                        <div class="flex flex-col gap-1 mt-3">
                            <span class="text-[10px] font-bold text-slate-400 uppercase">Customer</span>
                            <span class="text-sm font-semibold text-slate-700 break-words whitespace-normal">${job.customer}</span>
                        </div>
                        <div class="flex flex-col gap-1">
                            <span class="text-[10px] font-bold text-slate-400 uppercase">Mechanic</span>
                            <select class="w-full text-sm font-medium text-slate-700 border border-slate-200 rounded-md p-2.5 bg-slate-50 outline-none focus:ring-1 focus:ring-blue-500 cursor-pointer shadow-sm">
                                ${mechOptions}
                            </select>
                        </div>
                        <div class="flex flex-col gap-1">
                            <span class="text-[10px] font-bold text-slate-400 uppercase">Initial Diagnosis</span>
                            <p class="text-sm text-slate-600 bg-slate-50 p-3 rounded-md border border-slate-200 leading-relaxed whitespace-normal break-words">
                                ${job.diagnosis}
                            </p>
                        </div>
                        
                        ${mobilePartsHTML}
                        
                        <div class="mt-2 pt-4 border-t border-slate-100 flex flex-col gap-1.5">
                            <button onclick="${btnAction}" class="w-full py-3 rounded-lg text-sm font-bold shadow-sm flex items-center justify-center gap-2 ${btnClass}" ${btnDisabled ? 'disabled' : ''}>
                                ${btnText}
                            </button>
                            ${mobileHintHTML}
                            ${mobileAnywayBtn}
                        </div>
                    </div>
                </div>
            </div>
            `;
        } else {
            return `
            <div class="bg-white rounded-xl shadow-sm border border-slate-200 flex flex-col overflow-hidden hover:shadow-md transition-shadow relative ${opacityClass}">
                <div class="bg-slate-50 border-b border-slate-200 p-3.5 flex justify-between items-center">
                    <div>
                        <span class="font-bold text-slate-800 text-sm">${job.plate}</span>
                        <span class="text-[11px] text-slate-500 ml-1.5">${vehicleLabel}</span>
                    </div>
                    <span class="text-[10px] font-bold text-slate-400 uppercase tracking-wider">${job.id}</span>
                </div>
                <div class="p-4 flex-1 flex flex-col gap-3">
                    <div class="flex justify-between items-start">
                        <span class="text-xs font-bold text-slate-400 uppercase">Customer</span>
                        <span class="text-sm font-semibold text-slate-700">${job.customer}</span>
                    </div>
                    <div class="flex justify-between items-center">
                        <span class="text-xs font-bold text-slate-400 uppercase">Mechanic</span>
                        <select class="text-xs font-medium text-slate-700 border border-slate-200 rounded p-1 bg-slate-50 outline-none focus:ring-1 focus:ring-blue-500 cursor-pointer">
                            ${mechOptions}
                        </select>
                    </div>
                    <div class="mt-1">
                        <span class="text-[10px] font-bold text-slate-400 uppercase block mb-1.5">Initial Diagnosis</span>
                        <p class="text-xs text-slate-600 bg-slate-50 p-2.5 rounded border border-slate-100 leading-relaxed">
                            ${job.diagnosis}
                        </p>
                        ${partsHTML}
                    </div>
                </div>
                <div class="p-3.5 border-t border-slate-100 bg-slate-50/50 flex flex-col items-end">
                    <div class="flex items-center justify-between w-full">
                        <span class="px-2.5 py-1 rounded text-[10px] font-bold border flex items-center gap-1.5 ${job.statusClass}">
                            ${job.dotClass ? `<span class="w-1.5 h-1.5 rounded-full ${job.dotClass}"></span>` : ''} ${job.statusName}
                        </span>
                        <button onclick="${btnAction}" class="text-xs font-semibold px-3.5 py-1.5 rounded transition-colors shadow-sm flex items-center gap-1.5 ${btnClass}" ${btnDisabled ? 'disabled' : ''}>
                            ${btnText}
                        </button>
                    </div>
                    ${hintHTML}
                </div>
            </div>
        `;
        }
    }).join('');
}

// Attach Event Listeners
document.addEventListener('input', function(e) {
    if (e.target.id === 'repair-search') renderRepairs();
});

document.addEventListener('click', function(e) {
    const filterBtn = e.target.closest('.repair-filter-btn');
    if (filterBtn) {
        // Reset all buttons to default classes
        document.querySelectorAll('.repair-filter-btn').forEach(btn => {
            btn.className = `repair-filter-btn px-4 py-1.5 rounded-full text-xs font-semibold shadow-sm whitespace-nowrap transition-colors ${btn.getAttribute('data-default')}`;
        });
        
        // Set Active State
        filterBtn.className = 'repair-filter-btn px-4 py-1.5 rounded-full text-xs font-semibold shadow-sm whitespace-nowrap transition-colors bg-slate-800 text-white border border-transparent';
        
        currentRepairFilter = filterBtn.getAttribute('data-filter');
        renderRepairs();
    }
});
// --- Interactive Customers & Motorcycles Logic ---

const mockCustomersData = [
    {
        id: '1',
        name: 'Juan Dela Cruz',
        joined: 'Jan 15, 2026',
        phone: '0917-123-4567',
        status: 'in-shop',
        statusHtml: '<span class="inline-flex items-center gap-1 bg-orange-50 text-orange-700 px-2 py-0.5 rounded text-[10px] font-bold border border-orange-200 uppercase tracking-wider"><span class="w-1.5 h-1.5 rounded-full bg-orange-500 animate-pulse"></span> 1 In-Shop</span>',
        vehicles: [
            { brandId: 'yamaha', brandText: '', model: 'Sniper', make: 'Yamaha Sniper', plate: 'ABC-1234', engine: 'K59A-1234567', status: 'In-Repair', statusClass: 'bg-orange-50 text-orange-700 border-orange-200' },
            { brandId: 'rusi', brandText: '', model: 'Model TBC', make: 'Rusi Model TBC', plate: 'XYZ-9876', engine: 'B6H-9876543', status: 'Cleared', statusClass: 'bg-emerald-50 text-emerald-700 border-emerald-200' }
        ]
    },
    {
        id: '2',
        name: 'Maria Clara',
        joined: 'Mar 02, 2026',
        phone: '0918-987-6543',
        status: 'cleared',
        statusHtml: '<span class="inline-flex items-center gap-1 bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded text-[10px] font-bold border border-emerald-200 uppercase tracking-wider"><span class="w-1.5 h-1.5 rounded-full bg-emerald-500"></span> Cleared</span>',
        vehicles: [
            { brandId: 'yamaha', brandText: '', model: 'Sniper', make: 'Yamaha Sniper', plate: 'DEF-5678', engine: 'ADV160-55555', status: 'Cleared', statusClass: 'bg-emerald-50 text-emerald-700 border-emerald-200' }
        ]
    },
    {
        id: '3',
        name: 'Jose Rizal',
        joined: 'Feb 10, 2026',
        phone: '0919-222-3333',
        status: 'in-shop',
        statusHtml: '<span class="inline-flex items-center gap-1 bg-orange-50 text-orange-700 px-2 py-0.5 rounded text-[10px] font-bold border border-orange-200 uppercase tracking-wider"><span class="w-1.5 h-1.5 rounded-full bg-orange-500 animate-pulse"></span> 1 In-Shop</span>',
        vehicles: [
            { brandId: 'honda', brandText: '', model: 'Model TBC', make: 'Honda Model TBC', plate: 'HON-5555', engine: 'HON-5555123', status: 'In-Repair', statusClass: 'bg-orange-50 text-orange-700 border-orange-200' }
        ]
    },
    {
        id: '4',
        name: 'Apolinario Mabini',
        joined: 'Feb 18, 2026',
        phone: '0923-666-7777',
        status: 'in-shop',
        statusHtml: '<span class="inline-flex items-center gap-1 bg-orange-50 text-orange-700 px-2 py-0.5 rounded text-[10px] font-bold border border-orange-200 uppercase tracking-wider"><span class="w-1.5 h-1.5 rounded-full bg-orange-500 animate-pulse"></span> 1 In-Shop</span>',
        vehicles: [
            { brandId: 'kawasaki', brandText: '', model: 'Model TBC', make: 'Kawasaki Model TBC', plate: 'KAW-6666', engine: 'KAW-6666123', status: 'Waiting-Parts', statusClass: 'bg-orange-50 text-orange-700 border-orange-200' }
        ]
    },
    {
        id: '5',
        name: 'Emilio Aguinaldo',
        joined: 'Mar 12, 2026',
        phone: '0924-777-8888',
        status: 'cleared',
        statusHtml: '<span class="inline-flex items-center gap-1 bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded text-[10px] font-bold border border-emerald-200 uppercase tracking-wider"><span class="w-1.5 h-1.5 rounded-full bg-emerald-500"></span> Cleared</span>',
        vehicles: [
            { brandId: 'motoposh', brandText: '', model: 'Model TBC', make: 'Motoposh Model TBC', plate: 'MOT-7777', engine: 'MOT-7777123', status: 'Cleared', statusClass: 'bg-emerald-50 text-emerald-700 border-emerald-200' }
        ]
    },
    {
        id: '6',
        name: 'Gabriela Silang',
        joined: 'Jan 28, 2026',
        phone: '0921-444-5555',
        status: 'in-shop',
        statusHtml: '<span class="inline-flex items-center gap-1 bg-orange-50 text-orange-700 px-2 py-0.5 rounded text-[10px] font-bold border border-orange-200 uppercase tracking-wider"><span class="w-1.5 h-1.5 rounded-full bg-orange-500 animate-pulse"></span> 1 In-Shop</span>',
        vehicles: [
            { brandId: 'other', brandText: '', model: 'Model TBC', make: 'Other Model TBC', plate: 'QRS-4455', engine: 'OTH-4455123', status: 'In-Repair', statusClass: 'bg-orange-50 text-orange-700 border-orange-200' }
        ]
    }
];

// Clear Filters for Customers view
function clearCustomerFilters() {
    const searchInput = document.getElementById('cust-search');
    if (searchInput) searchInput.value = '';
    const statusSelect = document.getElementById('cust-filter-status');
    if (statusSelect) statusSelect.value = 'all';
    renderCustomers();
}
window.clearCustomerFilters = clearCustomerFilters;

function renderCustomers() {
    const tbody = document.getElementById('customers-tbody');
    const mobileContainer = document.getElementById('customers-mobile-cards');
    if (!tbody && !mobileContainer) return;

    const query = (document.getElementById('cust-search')?.value || '').toLowerCase().trim();
    const statusFilter = document.getElementById('cust-filter-status')?.value || 'all';

    const filtered = mockCustomersData.filter(customer => {
        const matchesSearch = customer.name.toLowerCase().includes(query) || 
                              customer.phone.toLowerCase().includes(query) ||
                              customer.vehicles.some(v => v.plate.toLowerCase().includes(query) || (v.make && v.make.toLowerCase().includes(query)) || (v.model && v.model.toLowerCase().includes(query)) || (getBrandLabel(v) && getBrandLabel(v).toLowerCase().includes(query)));
        const matchesStatus = statusFilter === 'all' || customer.status === statusFilter;
        return matchesSearch && matchesStatus;
    });

    if (filtered.length === 0) {
        if (tbody) {
            tbody.innerHTML = `<tr><td colspan="5" class="p-8 text-center text-slate-500 font-medium">No customers found.</td></tr>`;
        }
        if (mobileContainer) {
            mobileContainer.innerHTML = `
                <div class="p-8 text-center bg-white rounded-2xl border border-slate-200 text-slate-500 font-medium flex flex-col items-center justify-center gap-3 shadow-sm">
                    <div class="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 text-xl">
                        <i class="ph-bold ph-magnifying-glass"></i>
                    </div>
                    <div class="font-bold text-slate-700 text-base">No customers found</div>
                    <p class="text-xs text-slate-400 max-w-xs">No customers or vehicles match the current search query or filter.</p>
                    <button type="button" onclick="clearCustomerFilters()" class="mt-1 bg-blue-50 text-blue-600 hover:bg-blue-100 font-bold text-xs px-4 py-2.5 rounded-lg border border-blue-200 transition-colors inline-flex items-center gap-1.5 min-h-[44px]">
                        <i class="ph-bold ph-arrow-counter-clockwise"></i> Clear filters
                    </button>
                </div>
            `;
        }
        return;
    }

    if (tbody) {
        tbody.innerHTML = filtered.map(customer => {
            const vehicleRows = customer.vehicles.map(vehicle => {
                const bLabel = getBrandLabel(vehicle);
                const vLabel = (bLabel ? `${bLabel} ${vehicle.model || ''}`.trim() : (vehicle.make || 'Motorcycle')).trim();
                return `
                <div class="flex items-center justify-between ml-2 py-3 px-3 hover:bg-white transition-colors">
                    <div class="flex items-center gap-4">
                        <div class="w-10 h-10 rounded bg-white border border-slate-200 flex items-center justify-center text-slate-400 shrink-0">
                            <i class="ph-fill ph-motorcycle text-xl"></i>
                        </div>
                        <div>
                            <div class="font-bold text-slate-800 flex items-center gap-2">
                                ${vLabel}
                                <span class="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold border uppercase tracking-wider ${vehicle.statusClass}">${vehicle.status}</span>
                            </div>
                            <div class="text-xs text-slate-500 font-mono mt-0.5 flex gap-3">
                                <span>Plate: ${vehicle.plate}</span>
                                <span class="text-slate-300">|</span>
                                <span>Engine/Chassis: ${vehicle.engine}</span>
                            </div>
                        </div>
                    </div>
                    <div class="flex gap-2 pr-2">
                        <!-- NEW: View History Button Action -->
                        <button onclick="viewVehicleHistory('${vehicle.plate}')" class="text-slate-600 hover:text-blue-600 hover:bg-blue-50 font-medium text-xs border border-slate-200 bg-white px-3 py-1.5 rounded-md transition-colors flex items-center gap-1.5">
                            <i class="ph-bold ph-eye"></i> View History
                        </button>
                        <!-- NEW: Create Ticket Button Action -->
                        <button onclick="createRepairTicket('${vLabel}', '${vehicle.plate}')" class="text-white bg-blue-600 hover:bg-blue-700 font-bold text-xs px-3 py-1.5 rounded-md transition-colors flex items-center gap-1.5 shadow-sm">
                            <i class="ph-bold ph-wrench"></i> Create Ticket
                        </button>
                    </div>
                </div>
            `;
            }).join('');

            return `
                <tr class="hover:bg-slate-50 transition-colors cursor-pointer group" onclick="toggleCustomerRow('cust-row-${customer.id}')">
                    <td class="p-4 text-center">
                        <i class="ph-bold ph-caret-down text-slate-400 transition-transform group-hover:text-blue-500" id="cust-icon-${customer.id}"></i>
                    </td>
                    <td class="p-4">
                        <div class="font-bold text-slate-800 text-base">${customer.name}</div>
                        <div class="text-xs text-slate-500 mt-0.5">Joined: ${customer.joined}</div>
                    </td>
                    <td class="p-4">
                        <div class="flex items-center gap-2">
                            <span class="bg-slate-100 text-slate-600 font-bold px-2 py-0.5 rounded text-xs border border-slate-200">${customer.vehicles.length} Vehicle${customer.vehicles.length > 1 ? 's' : ''}</span>
                            ${customer.statusHtml}
                        </div>
                    </td>
                    <td class="p-4 text-center text-slate-600 font-mono">${customer.phone}</td>
                    <td class="p-4 text-right">
                        <!-- NEW: Edit Profile Button Action -->
                        <button class="text-blue-600 hover:bg-blue-50 font-medium text-xs border border-blue-200 bg-white px-3 py-1.5 rounded-md transition-colors" onclick="editCustomerProfile('${customer.name}', '${customer.phone}', event)">Edit Profile</button>
                    </td>
                </tr>
                <tr id="cust-row-${customer.id}" class="hidden bg-slate-50/50 border-b border-slate-200">
                    <td class="p-0 border-r border-slate-100"></td>
                    <td colspan="4" class="p-0">
                        <div class="divide-y divide-slate-100/50">
                            ${vehicleRows}
                        </div>
                    </td>
                </tr>
            `;
        }).join('');
    }

    if (mobileContainer) {
        mobileContainer.innerHTML = filtered.map(customer => {
            const inShopCount = (customer.vehicles || []).filter(v => v.status !== 'Cleared').length;
            const isCustomerInShop = customer.status === 'in-shop' || inShopCount > 0;
            const statusBadge = isCustomerInShop
                ? `<span class="inline-flex items-center gap-1 bg-orange-50 text-orange-700 px-2 py-0.5 rounded text-[10px] font-bold border border-orange-200 uppercase tracking-wider"><span class="w-1.5 h-1.5 rounded-full bg-orange-500 animate-pulse"></span> ${inShopCount > 0 ? inShopCount : 1} IN-SHOP</span>`
                : `<span class="inline-flex items-center gap-1 bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded text-[10px] font-bold border border-emerald-200 uppercase tracking-wider"><span class="w-1.5 h-1.5 rounded-full bg-emerald-500"></span> CLEARED</span>`;

            const vehicleCount = (customer.vehicles || []).length;
            const vehicleCountBadge = `<span class="bg-slate-100 text-slate-600 font-bold px-2 py-0.5 rounded text-[10px] border border-slate-200">${vehicleCount} Vehicle${vehicleCount === 1 ? '' : 's'}</span>`;

            const vehicleCardsHtml = (customer.vehicles || []).map(vehicle => {
                const bLabel = getBrandLabel(vehicle);
                const vLabel = (bLabel ? `${bLabel} ${vehicle.model || ''}`.trim() : (vehicle.make || 'Motorcycle')).trim();
                const vStatusClass = vehicle.statusClass || 'bg-slate-100 text-slate-700 border-slate-200';
                return `
                <div class="bg-slate-50 rounded-xl p-3 border border-slate-200/80 flex flex-col gap-1">
                    <div class="flex items-center justify-between pb-2 mb-1 border-b border-slate-200/60">
                        <div class="font-bold text-slate-800 text-sm flex items-center gap-1.5">
                            <i class="ph-fill ph-motorcycle text-blue-600"></i> ${vLabel}
                        </div>
                        <span class="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold border uppercase tracking-wider ${vStatusClass}">
                            ${vehicle.status}
                        </span>
                    </div>
                    <div class="m-row">
                        <span class="m-row-label">Brand</span>
                        <span class="m-row-value">${bLabel || 'Other'}</span>
                    </div>
                    <div class="m-row">
                        <span class="m-row-label">Model</span>
                        <span class="m-row-value">${vehicle.model || 'Model TBC'}</span>
                    </div>
                    <div class="m-row">
                        <span class="m-row-label">Plate</span>
                        <span class="m-row-value font-mono">${vehicle.plate}</span>
                    </div>
                    <div class="m-row">
                        <span class="m-row-label">Engine / Chassis</span>
                        <span class="m-row-value font-mono">${vehicle.engine || 'N/A'}</span>
                    </div>
                    <div class="m-actions grid-2 mt-2">
                        <button type="button" onclick="viewVehicleHistory('${vehicle.plate}')" class="bg-white hover:bg-slate-100 text-slate-700 border border-slate-300 font-bold text-xs py-2 px-3 rounded-lg flex items-center justify-center gap-1 transition-colors min-h-[44px]">
                            <i class="ph-bold ph-eye text-sm"></i> History
                        </button>
                        <button type="button" onclick="createRepairTicket('${vLabel}', '${vehicle.plate}')" class="bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs py-2 px-3 rounded-lg flex items-center justify-center gap-1 transition-colors shadow-sm min-h-[44px]">
                            <i class="ph-bold ph-wrench text-sm"></i> Ticket
                        </button>
                    </div>
                </div>
                `;
            }).join('');

            return `
                <div class="m-card" data-customer-id="${customer.id}">
                    <div class="m-card-head" role="button" tabindex="0" aria-expanded="false">
                        <div class="flex-1 pr-3 min-w-0">
                            <div class="font-bold text-slate-800 text-base leading-tight truncate">${customer.name}</div>
                            <div class="text-[11px] text-slate-400 mt-0.5 font-medium">Joined: ${customer.joined}</div>
                            <div class="flex flex-wrap items-center gap-1.5 mt-2">
                                ${vehicleCountBadge}
                                ${statusBadge}
                            </div>
                        </div>
                        <i class="ph-bold ph-caret-down m-card-chevron text-slate-400 text-lg shrink-0"></i>
                    </div>
                    <div class="m-card-body">
                        <div class="m-card-body-inner">
                            <div class="m-row">
                                <span class="m-row-label">Contact Number</span>
                                <span class="m-row-value font-mono flex items-center gap-1.5">
                                    <i class="ph-fill ph-phone text-blue-600"></i> ${customer.phone}
                                </span>
                            </div>
                            <div class="m-actions grid-2">
                                <button type="button" onclick="editCustomerProfile('${customer.name}', '${customer.phone}', event)" class="bg-blue-50 text-blue-700 hover:bg-blue-100 border border-blue-200 font-bold text-xs py-2.5 px-3 rounded-lg flex items-center justify-center gap-1.5 transition-colors min-h-[44px]">
                                    <i class="ph-bold ph-pencil-simple text-sm"></i> Edit Profile
                                </button>
                                <button type="button" onclick="openMotorcycleModal()" class="bg-slate-50 text-slate-700 hover:bg-slate-100 border border-slate-300 font-bold text-xs py-2.5 px-3 rounded-lg flex items-center justify-center gap-1.5 transition-colors min-h-[44px]">
                                    <i class="ph-bold ph-motorcycle text-sm"></i> Register Vehicle
                                </button>
                            </div>
                            <div class="mt-2 pt-3 border-t border-slate-100">
                                <div class="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">Registered Vehicles (${vehicleCount})</div>
                                <div class="flex flex-col gap-2.5">
                                    ${vehicleCardsHtml}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            `;
        }).join('');
    }
}


// 1. Edit Profile Logic (Pre-fills existing modal)
window.editCustomerProfile = function(name, phone, event) {
    event.stopPropagation(); // Prevents the row from expanding/collapsing when clicking the button
    
    // Open existing modal
    toggleModal('modal-customer', 'customer-backdrop', 'customer-content', true);
    
    // Change Title to 'Edit'
    const title = document.querySelector('#modal-customer h2');
    if (title) title.innerHTML = `<i class="ph-fill ph-pencil-simple text-blue-600"></i> Edit Customer Profile`;

    // Split name into First and Last and pre-fill inputs
    const inputs = document.querySelectorAll('#modal-customer input[type="text"], #modal-customer input[type="tel"]');
    if (inputs.length >= 3) {
        const nameParts = name.split(' ');
        inputs[0].value = nameParts[0] || ''; 
        inputs[1].value = nameParts.slice(1).join(' ') || '';
        inputs[2].value = phone || '';
    }
};

// 2. View History Logic (Auto-navigates and filters)
window.viewVehicleHistory = function(plate) {
    // Click the Service History navigation link programmatically
    const historyLink = document.querySelector('.nav-link[data-target="history"]');
    if (historyLink) {
        historyLink.click();
        
        // Wait a tiny bit for the HTML to fetch, then populate the search bar
        setTimeout(() => {
            const searchInput = document.getElementById('history-search');
            if (searchInput) {
                searchInput.value = plate;
                searchInput.dispatchEvent(new Event('input')); // Triggers the render function
            }
        }, 150);
    }
};

// 3. Create Ticket Logic (Auto-navigates to Diagnostics)
window.createRepairTicket = function(make, plate) {
    if(confirm(`Do you want to create a new active repair ticket and run a diagnostic scan for:\n\n${make} (${plate})?`)) {
        const diagLink = document.querySelector('.nav-link[data-target="diagnostics"]');
        if (diagLink) {
            diagLink.click();
        }
    }
};

window.toggleCustomerRow = function(rowId) {
    const detailRow = document.getElementById(rowId);
    const iconId = rowId.replace('cust-row-', 'cust-icon-');
    const icon = document.getElementById(iconId);
    
    if (detailRow.classList.contains('hidden')) {
        detailRow.classList.remove('hidden');
        if (icon) icon.classList.add('rotate-180', 'text-blue-500');
    } else {
        detailRow.classList.add('hidden');
        if (icon) icon.classList.remove('rotate-180', 'text-blue-500');
    }
};

window.toggleMobileCustomerCard = function(custId) {
    const card = document.querySelector(`.m-card[data-customer-id="${custId}"]`);
    if (card) {
        const head = card.querySelector('.m-card-head');
        if (head && typeof toggleMCard === 'function') {
            toggleMCard(head);
        }
    }
};

// Attach Listeners
document.addEventListener('input', function(e) {
    if (e.target.id === 'cust-search') renderCustomers();
});

document.addEventListener('change', function(e) {
    if (e.target.id === 'cust-filter-status') renderCustomers();
});


// =====================================================================
// --- Mobile App Mode (Mechanic) ---
// Only this role gets the mobile UI. Screens are converted one at a time:
// add the screen name to `mobileViews` once views/mobile/<name>.html exists.
// =====================================================================

let forceOwnerMobile = canSwitchUI() ? (sessionStorage.getItem('forceOwnerMobile') === 'true') : false;

function isMobileForRole(roleId) {
    const role = roleId || currentRole || 'admin';
    if (!canSwitchUI(role)) {
        return getDefaultUI(role) === 'mobile';
    }
    const hasSessionPref = sessionStorage.getItem('forceOwnerMobile');
    if (hasSessionPref !== null) {
        return hasSessionPref === 'true';
    }
    return forceOwnerMobile || (getDefaultUI(role) === 'mobile');
}

window.toggleOwnerMobileMode = function() {
    if (!canSwitchUI(currentRole)) return;
    const nextIsMobile = !isMobileForRole(currentRole);
    forceOwnerMobile = nextIsMobile;
    sessionStorage.setItem('forceOwnerMobile', nextIsMobile ? 'true' : 'false');
    localStorage.setItem('forceOwnerMobile', nextIsMobile ? 'true' : 'false');
    switchRole(currentRole); // Re-trigger UI setup
};

// Screens that already have a mobile version (views/mobile/<name>.html)
const mobileViews = ['dashboard', 'more'];

// Short app-bar titles (the sidebar labels are too long for a phone)
// Mock jobs for the mobile Home screen (mechanic names match systemUsers)
const mockMobileJobs = [
    { id: 'JOB #1042', plate: 'ABC-1234', brandId: 'yamaha', brandText: '', model: 'Sniper', task: 'Coolant sensor & brake pads', status: 'Waiting Parts', tone: 'orange', mechanic: 'Larpus' },
    { id: 'JOB #1041', plate: 'XYZ-9876', brandId: 'yamaha', brandText: '', model: 'Sniper', task: 'Throttle body cleaning & oil change', status: 'Pending Post-Scan', tone: 'purple', mechanic: 'Hiyo' },
    { id: 'JOB #1043', plate: 'DEF-5678', brandId: 'rusi', brandText: '', model: 'Model TBC', task: 'Chain & sprocket set', status: 'In Progress', tone: 'blue', mechanic: 'Hiyo' },
    { id: 'JOB #1044', plate: 'QRS-4455', brandId: 'other', brandText: '', model: 'Model TBC', task: 'Clutch lining replacement', status: 'In Progress', tone: 'blue', mechanic: 'Larpus' },
    { id: 'JOB #1045', plate: 'HON-5555', brandId: 'honda', brandText: '', model: 'Model TBC', task: 'Brake fluid flush and inspection', status: 'In Progress', tone: 'blue', mechanic: 'Larpus' },
    { id: 'JOB #1046', plate: 'KAW-6666', brandId: 'kawasaki', brandText: '', model: 'Model TBC', task: 'Drive belt replacement', status: 'Waiting Parts', tone: 'orange', mechanic: 'Hiyo' },
    { id: 'JOB #1047', plate: 'MOT-7777', brandId: 'motoposh', brandText: '', model: 'Model TBC', task: 'Carburetor tuning and cleaning', status: 'In Progress', tone: 'blue', mechanic: 'Larpus' }
];

const mobileTones = {
    orange: { chip: 'bg-orange-100 text-orange-700' },
    purple: { chip: 'bg-purple-100 text-purple-700' },
    blue:   { chip: 'bg-blue-100 text-blue-700' }
};

// Jobs visible to a role: Mechanic, Admin, and Super Admin see shop jobs
function getMobileJobs(roleId) {
    if (roleId === 'mechanic' || roleId === 'admin' || roleId === 'super_admin') return mockMobileJobs;
    return mockMobileJobs.filter(job => job.mechanic === (systemUsers[roleId] ? systemUsers[roleId].name : ''));
}

// Toggles mobile mode + fills the shell (app bar avatar, tab badge). Returns true if mobile.
function applyMobileMode(roleId) {
    const role = roleId || currentRole || 'admin';
    const isMobile = isMobileForRole(role);
    document.body.classList.toggle('mobile-app', isMobile);

    if (!isMobile) {
        mainContentArea.classList.remove('m-screen');
        return false;
    }

    const user = systemUsers[roleId] || systemUsers.admin;
    const headerAvatar = document.getElementById('m-header-avatar');
    if (headerAvatar) {
        headerAvatar.textContent = user.initials;
        headerAvatar.classList.remove('bg-blue-600', 'bg-purple-600', 'bg-slate-600', 'bg-slate-800', 'bg-emerald-600');
        headerAvatar.classList.add(user.color);
    }
    
    const jobsBadge = document.getElementById('m-jobs-badge');
    if (jobsBadge) {
        jobsBadge.textContent = getMobileJobs(roleId).length;
    }

    // Role-gated pieces of the mobile shell using rolePermissions
    document.querySelectorAll('.m-tab[data-mtab]').forEach(el => {
        const target = el.getAttribute('data-mtab');
        if (target && target !== 'more') {
            const allowed = rolePermissions[roleId] && rolePermissions[roleId].includes(target);
            el.style.display = allowed ? '' : 'none';
        }
    });

    return true;
}

// Bottom tab bar -> reuses the (hidden) sidebar links so all routing stays in one place
function mNav(target) {
    if (target === 'more') {
        syncMobileNav('more');
        loadView('more');
        return;
    }
    document.querySelector(`.nav-link[data-target="${target}"]`)?.click();
}

// Highlight the active tab; "More" owns the screens that have no tab of their own
function syncMobileNav(target) {
    const tabIds = ['dashboard', 'repairs', 'diagnostics', 'inventory'];
    const activeTab = tabIds.includes(target) ? target : 'more';
    document.querySelectorAll('.m-tab[data-mtab]').forEach(tab => {
        tab.classList.toggle('is-active', tab.dataset.mtab === activeTab);
    });
}

let mToastTimer = null;
function mToast(message) {
    const toast = document.getElementById('m-toast');
    if (!toast) return;
    toast.textContent = message;
    toast.classList.add('is-show');
    clearTimeout(mToastTimer);
    mToastTimer = setTimeout(() => toast.classList.remove('is-show'), 2000);
}

// Fills views/mobile/dashboard.html for the current role
function renderMobileHome() {
    const roleId = currentRole;
    const user = systemUsers[roleId] || systemUsers.admin;
    const isLeadOrSuper = roleId === 'mechanic' || roleId === 'admin';
    const jobs = getMobileJobs(roleId);
    const hour = new Date().getHours();

    // Hero (role-coloured) + greeting
    const hero = document.getElementById('m-hero');
    if (!hero) return;
    hero.classList.remove('from-purple-600', 'to-indigo-700', 'from-sky-600', 'to-blue-700');
    hero.classList.add(...(isLeadOrSuper ? ['from-purple-600', 'to-indigo-700'] : ['from-sky-600', 'to-blue-700']));
    document.getElementById('m-greeting').textContent = hour < 12 ? 'Good morning,' : hour < 18 ? 'Good afternoon,' : 'Good evening,';
    document.getElementById('m-name').textContent = user.name;
    document.getElementById('m-date').textContent = new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });
    const roleChipText = ROLES_CONFIG[roleId]?.shortLabel || ROLES_CONFIG[roleId]?.label || user.role;
    document.getElementById('m-role-chip').innerHTML = `<i class="ph-fill ${roleId === 'admin' ? 'ph-crown-simple' : 'ph-wrench'}"></i> ${roleChipText}`;

    // Role-gated blocks inside the view
    document.querySelectorAll('#m-home [data-mroles]').forEach(el => {
        el.style.display = el.dataset.mroles.split(',').includes(roleId) ? '' : 'none';
    });

    // Stats
    document.getElementById('m-stat-active').textContent = jobs.length;
    document.getElementById('m-stat-waiting').textContent = jobs.filter(j => j.status === 'Waiting Parts').length;

    // Job cards
    document.getElementById('m-jobs-title').textContent = isLeadOrSuper ? 'Shop Jobs' : 'My Jobs';
    const jobsList = document.getElementById('m-jobs-list');
    jobsList.innerHTML = jobs.length ? jobs.map((job, idx) => {
        const tone = mobileTones[job.tone];
        return `
            <div class="m-job-card bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden" id="m-job-card-${idx}">
                <button type="button"
                        onclick="toggleMobileJobCard(${idx})"
                        onkeydown="if(event.key==='Enter'||event.key===' '){event.preventDefault();toggleMobileJobCard(${idx});}"
                        aria-expanded="false"
                        aria-controls="m-job-body-${idx}"
                        id="m-job-header-${idx}"
                        class="m-job-header w-full text-left min-h-[44px] p-4 flex items-center justify-between gap-3 active:bg-slate-50 transition-colors cursor-pointer">
                    <div class="flex items-center gap-2 min-w-0">
                        <span class="font-extrabold text-slate-800 text-sm truncate">${job.plate}</span>
                        <span class="text-[10px] font-bold text-slate-400 shrink-0">${job.id}</span>
                    </div>
                    <div class="flex items-center gap-2 shrink-0">
                        <span class="px-2 py-1 rounded-lg text-[10px] font-bold whitespace-nowrap ${tone.chip}">${job.status}</span>
                        <i class="m-job-chevron ph-bold ph-caret-down text-slate-400 text-base shrink-0"></i>
                    </div>
                </button>
                <div id="m-job-body-${idx}" class="m-job-body-wrap" role="region" aria-labelledby="m-job-header-${idx}">
                    <div class="m-job-body-inner">
                        <div onclick="mNav('repairs')" class="px-4 pb-4 pt-1 border-t border-slate-50 cursor-pointer active:bg-slate-50/50 transition-colors">
                            <p class="text-xs text-slate-500 truncate">${getBrandLabel(job)} ${job.model}</p>
                            <p class="text-xs text-slate-600 mt-2">${job.task}</p>
                            ${isLeadOrSuper ? `<div class="mt-2.5 flex items-center gap-1.5 text-[11px] font-semibold text-slate-500"><i class="ph-fill ph-user-circle text-base text-slate-400"></i> ${job.mechanic}</div>` : ''}
                        </div>
                    </div>
                </div>
            </div>`;
    }).join('') : `
        <div class="bg-white rounded-2xl border border-slate-100 p-6 text-center text-xs font-semibold text-slate-400">
            <i class="ph-fill ph-coffee text-3xl block mb-1 text-slate-300"></i> No jobs assigned to you
        </div>`;

    // Team workload
    if (isLeadOrSuper) {
        const team = [
            { name: 'Larpus', initials: 'JB', color: 'bg-purple-600', role: ROLES_CONFIG.mechanic.label },
            { name: 'Hiyo', initials: 'F', color: 'bg-slate-600', role: ROLES_CONFIG.mechanic.label }
        ];
        document.getElementById('m-team-list').innerHTML = team.map(member => {
            const count = mockMobileJobs.filter(j => j.mechanic === member.name).length;
            const pct = Math.min(100, Math.round((count / mockMobileJobs.length) * 100));
            return `
                <div class="flex items-center gap-3 p-3.5">
                    <span class="w-9 h-9 rounded-full ${member.color} text-white flex items-center justify-center text-xs font-bold shrink-0">${member.initials}</span>
                    <div class="flex-1 min-w-0">
                        <div class="flex items-center justify-between">
                            <p class="text-sm font-bold text-slate-800">${member.name} <span class="text-[10px] font-semibold text-slate-400">${member.role}</span></p>
                            <span class="text-xs font-bold text-slate-500">${count} job${count === 1 ? '' : 's'}</span>
                        </div>
                        <div class="h-1.5 bg-slate-100 rounded-full overflow-hidden mt-1.5"><div class="h-full bg-blue-500 rounded-full" style="width:${pct}%"></div></div>
                    </div>
                </div>`;
        }).join('');
    }

    if (typeof lucide !== 'undefined' && lucide.createIcons) {
        lucide.createIcons();
    }
}

window.toggleMobileJobCard = function(index) {
    const list = document.getElementById('m-jobs-list');
    if (!list) return;
    const cards = list.querySelectorAll('.m-job-card');
    cards.forEach((card, idx) => {
        const btn = card.querySelector('.m-job-header');
        if (idx === index) {
            const willOpen = !card.classList.contains('is-open');
            card.classList.toggle('is-open', willOpen);
            if (btn) btn.setAttribute('aria-expanded', willOpen ? 'true' : 'false');
        } else {
            card.classList.remove('is-open');
            if (btn) btn.setAttribute('aria-expanded', 'false');
        }
    });
};


// =====================================================================
// --- Physical Inspection Log (Diagnostics) ---
// Grouped checklist with big OK / Watch / Fix buttons, defect tags,
// notes, photos, parts suggestions and a one-tap "Add to Final Findings".
// Draft is auto-saved on the device.
// =====================================================================

const INSPECTION_STORAGE_KEY = 'motocare_physical_inspection_draft';

const inspectionStatuses = [
    { key: 'ok',    label: 'OK',    icon: 'ph-check-circle' },
    { key: 'watch', label: 'Watch', icon: 'ph-warning' },
    { key: 'fix',   label: 'Fix',   icon: 'ph-wrench' },
    { key: 'na',    label: 'N/A',   icon: 'ph-minus-circle' }
];
const inspectionStatusLabels = { ok: 'OK', watch: 'Watch', fix: 'Fix', na: 'N/A' };

// part: id from mockInventory to suggest when the item is flagged
const inspectionSections = [
    {
        id: 'tires', title: 'Tires & Wheels', short: 'Tires', icon: 'ph-circle-notch',
        items: [
            { id: 'tire_f', label: 'Front Tire',
              tags: ['Worn tread', 'Cracked sidewall', 'Puncture / nail', 'Uneven wear', 'Bulge'] },
            { id: 'tire_r', label: 'Rear Tire',
              tags: ['Worn tread', 'Cracked sidewall', 'Puncture / nail', 'Uneven wear', 'Bulge'] },
            { id: 'psi_f', label: 'Front Tire Pressure',
              tags: ['Too low', 'Too high', 'Slow leak'] },
            { id: 'psi_r', label: 'Rear Tire Pressure',
              tags: ['Too low', 'Too high', 'Slow leak'] },
            { id: 'wheels', label: 'Wheels / Rims',
              tags: ['Bent rim', 'Loose spokes', 'Bearing play', 'Cracked'] }
        ]
    },
    {
        id: 'brakes', title: 'Brakes', short: 'Brakes', icon: 'ph-stop-circle',
        items: [
            { id: 'pad_f', label: 'Front Brake Pads',
              tags: ['Below minimum', 'Uneven wear', 'Glazed', 'Squealing'], part: 'PROTO-B01' },
            { id: 'pad_r', label: 'Rear Pads / Shoes',
              tags: ['Below minimum', 'Uneven wear', 'Glazed', 'Squealing'] },
            { id: 'brake_fluid', label: 'Brake Fluid',
              tags: ['Low level', 'Dark / dirty', 'Contaminated', 'Leak'] },
            { id: 'brake_feel', label: 'Lever / Pedal Feel',
              tags: ['Spongy', 'Too soft', 'Dragging', 'Needs adjustment'] },
            { id: 'brake_disc', label: 'Discs / Drums',
              tags: ['Warped', 'Scored', 'Rusted', 'Below min thickness'] }
        ]
    },
    {
        id: 'engine', title: 'Engine & Fluids', short: 'Engine', icon: 'ph-engine',
        items: [
            { id: 'oil', label: 'Engine Oil',
              tags: ['Low level', 'Black / dirty', 'Milky', 'Overdue change'], part: 'p4' },
            { id: 'coolant', label: 'Coolant',
              tags: ['Low level', 'Discoloured', 'Leak'] },
            { id: 'air_filter', label: 'Air Filter',
              tags: ['Clogged', 'Oily', 'Torn'] },
            { id: 'spark', label: 'Spark Plug',
              tags: ['Fouled', 'Worn electrode', 'Wet / oily', 'Wrong gap'], part: 'p5' },
            { id: 'leaks', label: 'Leaks (visual)',
              tags: ['Engine oil', 'Coolant', 'Fuel', 'Fork oil', 'Gasket'] }
        ]
    },
    {
        id: 'drive', title: 'Drivetrain', short: 'Drive', icon: 'ph-link',
        items: [
            { id: 'chain', label: 'Chain / CVT Belt',
              tags: ['Too loose', 'Too tight', 'Dry / rusty', 'Cracked belt', 'Stretched'], part: 'p3' },
            { id: 'sprocket', label: 'Sprockets / CVT Rollers',
              tags: ['Hooked teeth', 'Worn rollers', 'Noise', 'Flat spots'] },
            { id: 'clutch', label: 'Clutch / Free Play',
              tags: ['Slipping', 'Too stiff', 'Free play off', 'Cable frayed'] }
        ]
    },
    {
        id: 'electrical', title: 'Electrical', short: 'Electrical', icon: 'ph-lightning',
        items: [
            { id: 'battery', label: 'Battery Voltage',
              tags: ['Weak', 'Corroded terminals', 'Swollen', 'Old (2+ years)'] },
            { id: 'charging', label: 'Charging Voltage',
              tags: ['Undercharging', 'Overcharging', 'Bad regulator', 'Stator issue'] },
            { id: 'lights', label: 'Lights & Signals',
              tags: ['Headlight out', 'Brake light out', 'Signal out', 'Dim'] },
            { id: 'horn', label: 'Horn / Switches',
              tags: ['Weak horn', 'No sound', 'Sticky switch'] },
            { id: 'starter', label: 'Starter / Wiring',
              tags: ['Slow crank', 'Clicking', 'Loose / burnt wiring'] }
        ]
    },
    {
        id: 'chassis', title: 'Suspension & Steering', short: 'Chassis', icon: 'ph-steering-wheel',
        items: [
            { id: 'fork', label: 'Front Fork',
              tags: ['Leaking seals', 'Bottoming out', 'Stiff', 'Bent'] },
            { id: 'shock', label: 'Rear Shock(s)',
              tags: ['Leaking', 'Weak / soft', 'Noisy', 'Worn bushings'] },
            { id: 'steering', label: 'Steering Bearings',
              tags: ['Loose', 'Notchy', 'Too tight'] },
            { id: 'frame', label: 'Frame / Swingarm',
              tags: ['Crack', 'Bent', 'Rust', 'Loose bolts'] }
        ]
    }
];

const inspectionItems = inspectionSections.flatMap(sec => sec.items.map(item => ({ ...item, section: sec.id })));
const inspectionItemMap = Object.fromEntries(inspectionItems.map(item => [item.id, item]));

// --- State (auto-saved to this device so a refresh / lost signal never wipes the checklist) ---
function emptyInspectionState() {
    return { 
        intake: { odo: '', fuel: '', complaints: [] }, 
        vehicle: { mode: 'identified', brandId: 'yamaha', brandText: '', brand: 'Yamaha', model: 'Sniper', plate: '' },
        customer: { mode: 'walk-in', name: '', phone: '', email: '', selectedCustomerId: null },
        items: {} 
    };
}

function loadInspectionState() {
    try {
        const raw = localStorage.getItem(INSPECTION_STORAGE_KEY);
        if (raw) {
            const saved = JSON.parse(raw);
            const loadedVehicle = { ...emptyInspectionState().vehicle, ...(saved.vehicle || {}) };
            if (loadedVehicle.brandId && !MOTORCYCLE_BRANDS_CONFIG.some(b => b.id === loadedVehicle.brandId)) {
                loadedVehicle.brandText = (loadedVehicle.brandText && loadedVehicle.brandText.trim()) || 
                                          (loadedVehicle.brand && loadedVehicle.brand.trim()) || 
                                          String(loadedVehicle.brandId);
                loadedVehicle.brandId = 'other';
            }
            return {
                intake: { ...emptyInspectionState().intake, ...(saved.intake || {}) },
                vehicle: loadedVehicle,
                customer: { ...emptyInspectionState().customer, ...(saved.customer || {}) },
                items: saved.items || {}
            };
        }
    } catch (err) { /* storage unavailable or corrupt: start fresh */ }
    return emptyInspectionState();
}

function updateSharedDiagnosis() {
    const flagged = [];
    if (typeof inspectionItems === 'undefined' || typeof inspectionSections === 'undefined') return;
    inspectionItems.forEach(item => {
        const st = getInspItem(item.id);
        if (st.status === 'fix' || st.status === 'watch') {
            const sec = inspectionSections.find(s => s.id === item.section) || {};
            const category = sec.title || sec.short || 'General';
            let suggestedPart = null;
            
            // Find the first linked part in mockInventory
            const invPart = mockInventory.find(p => p.linkedInspectionItems && p.linkedInspectionItems.some(l => l.itemId === item.id));
            if (invPart) {
                suggestedPart = {
                    id: invPart.id,
                    name: invPart.name,
                    sku: invPart.sku,
                    price: invPart.price,
                    stock: invPart.stock
                };
            }
            flagged.push({
                id: item.id,
                category: category,
                name: item.label,
                status: st.status,
                suggestedPart: suggestedPart
            });
        }
    });
    inspectionState.flaggedItems = flagged;
}

function saveInspectionState() {
    updateSharedDiagnosis();
    try { localStorage.setItem(INSPECTION_STORAGE_KEY, JSON.stringify(inspectionState)); } catch (err) { /* ignore quota errors */ }
}

let inspectionState = loadInspectionState();
let inspectionPhotos = {};           // item id -> [dataURL] (memory only, photos are too large for localStorage)
const inspectionCollapsed = {};      // section id -> true when collapsed (sections start collapsed until opened)
const isInspectionCollapsed = id => inspectionCollapsed[id] !== false;

function getInspItem(id) {
    if (!inspectionState.items[id]) {
        inspectionState.items[id] = { status: null, manual: false, tags: [], note: '' };
    }
    return inspectionState.items[id];
}

function inspEsc(text) {
    return String(text ?? '').replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

// --- Rendering ---
function renderInspectionItem(item) {
    const st = getInspItem(item.id);
    const showDetail = st.status === 'watch' || st.status === 'fix';
    const part = item.part ? mockInventory.find(p => p.id === item.part) : null;

    const partHtml = !part ? '' : (part.stock > 0
        ? `<button type="button" data-insp="addpart" data-part="${part.id}" class="insp-part-btn"><i class="ph-bold ph-plus"></i> ${part.name} <span class="font-semibold opacity-70">· ${part.stock} in stock</span></button>`
        : `<button type="button" disabled class="insp-part-btn"><i class="ph-bold ph-prohibit"></i> ${part.name} · Out of stock</button>`);

    return `
        <div class="insp-item rounded-xl border border-slate-200" data-item="${item.id}" data-status="${st.status || 'none'}">
            <div class="p-2 sm:p-2.5 flex flex-col gap-2">
                <div class="insp-item-row flex flex-col sm:flex-row sm:items-center justify-between gap-1.5 sm:gap-2">
                    <div class="min-w-0 flex-1">
                        <p class="text-xs sm:text-sm font-extrabold text-slate-800 leading-snug">${item.label}</p>
                    </div>
                    <div class="insp-btn-group grid grid-cols-4 gap-1 shrink-0 w-full sm:w-auto">
                        ${inspectionStatuses.map(s => `
                            <button type="button" data-insp="status" data-item="${item.id}" data-status="${s.key}" class="insp-btn ${s.key} ${st.status === s.key ? 'is-active' : ''}">
                                <i class="ph-bold ${s.icon}"></i> <span>${s.label}</span>
                            </button>`).join('')}
                    </div>
                </div>
                <div class="insp-detail ${showDetail ? '' : 'hidden'} flex flex-col gap-2 pt-2 border-t border-slate-200/70" data-detail="${item.id}">
                    <div class="flex flex-wrap gap-1">
                        ${item.tags.map(tag => `<button type="button" data-insp="tag" data-item="${item.id}" data-tag="${inspEsc(tag)}" class="insp-chip ${st.tags.includes(tag) ? 'is-active' : ''}">${tag}</button>`).join('')}
                    </div>
                    <input type="text" placeholder="Add a note (optional)" value="${inspEsc(st.note)}" data-insp-input="note" data-item="${item.id}" class="w-full px-2.5 py-1.5 sm:py-2 rounded-lg border border-slate-300 bg-white text-xs sm:text-sm outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500">
                    <div class="flex flex-wrap items-center gap-2">
                        <label class="insp-photo-btn"><i class="ph-bold ph-camera text-base"></i> Photo
                            <input type="file" accept="image/*" capture="environment" class="hidden" data-insp-file data-item="${item.id}">
                        </label>
                        <div class="flex gap-1.5" data-photos="${item.id}"></div>
                        ${partHtml}
                    </div>
                </div>
            </div>
        </div>`;
}

function renderInspectionSection(sec) {
    const done = sec.items.filter(i => getInspItem(i.id).status).length;
    const countText = done === sec.items.length ? `All ${done} checked ✓` : `${done}/${sec.items.length} checked`;
    return `
        <div class="insp-section ${isInspectionCollapsed(sec.id) ? 'is-collapsed' : ''} bg-white border border-slate-200 rounded-xl overflow-hidden" id="insp-sec-${sec.id}" data-section="${sec.id}">
            <div class="insp-sec-header flex items-center gap-2 px-3 sm:px-3.5 py-2 sm:py-2.5 bg-slate-50 border-b border-slate-200">
                <button type="button" data-insp="toggle-section" data-section="${sec.id}" class="flex items-center gap-2.5 flex-1 min-w-0 text-left">
                    <span class="w-8 h-8 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center text-base shrink-0"><i class="ph-fill ${sec.icon}"></i></span>
                    <span class="min-w-0 flex-1">
                        <span class="block text-sm font-extrabold text-slate-800 leading-tight truncate">${sec.title}</span>
                        <span class="block text-[11px] font-semibold text-slate-400 leading-tight" data-sec-count="${sec.id}">${countText}</span>
                    </span>
                    <i class="ph-bold ph-caret-down insp-caret text-slate-400 ml-auto mr-1"></i>
                </button>
                <button type="button" data-insp="section-ok" data-section="${sec.id}" class="text-[11px] font-bold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 px-2.5 py-1.5 rounded-lg active:scale-95 transition-all whitespace-nowrap shrink-0">Rest OK</button>
            </div>
            <div class="insp-section-body p-2 sm:p-2.5 flex flex-col gap-1.5 sm:gap-2">
                ${sec.items.map(renderInspectionItem).join('')}
            </div>
        </div>`;
}

function renderInspection() {
    const host = document.getElementById('insp-sections');
    if (!host) return;
    host.innerHTML = `<div class="insp-grid-inner" style="align-items:start">${inspectionSections.map(renderInspectionSection).join('')}</div>`;
    restoreInspectionIntake();
    inspectionItems.forEach(item => renderInspectionThumbs(item.id));
    refreshInspectionSummary();
}

function restoreInspectionIntake() {
    const { complaints } = inspectionState.intake;
    document.querySelectorAll('[data-insp="complaint"]').forEach(btn => btn.classList.toggle('is-active', complaints.includes(btn.dataset.complaint)));
    restoreMotorcycleCard();
    validateStep1();
}

function restoreMotorcycleCard() {
    const v = inspectionState.vehicle;
    if (!v) return;

    setMotoMode(v.mode, true);

    if (!v.brandId) {
        v.brandId = DEFAULT_BRAND_ID;
        v.brand = 'Yamaha';
        if (v.model === undefined || v.model === null || v.model === '') {
            v.model = 'Sniper';
        }
    }

    const activeBrandId = v.brandId;
    const brandConfig = MOTORCYCLE_BRANDS_CONFIG.find(b => b.id === activeBrandId) || MOTORCYCLE_BRANDS_CONFIG[0];

    const chipsContainer = document.getElementById('moto-brand-chips');
    if (chipsContainer) {
        chipsContainer.innerHTML = MOTORCYCLE_BRANDS_CONFIG.map(b => 
            `<button type="button" onclick="setMotoBrand('${b.id}')" class="insp-chip ${activeBrandId === b.id ? 'is-active' : ''}">${b.label}</button>`
        ).join('');
    }

    const otherContainer = document.getElementById('moto-brand-other-container');
    const otherInput = document.getElementById('moto-brand-other');
    if (otherContainer && otherInput) {
        if (activeBrandId === 'other') {
            otherContainer.classList.remove('hidden');
            const displayVal = v.brandText || '';
            if (otherInput.value !== displayVal) otherInput.value = displayVal;
            otherInput.placeholder = 'e.g. exact brand';
        } else {
            otherContainer.classList.add('hidden');
            otherInput.value = '';
        }
    }

    const modelInput = document.getElementById('moto-model');
    const suggContainer = document.getElementById('moto-model-suggestions');

    if (modelInput) {
        if (activeBrandId === 'yamaha') {
            modelInput.placeholder = 'e.g. Sniper';
            if (v.model === undefined || v.model === null) {
                v.model = 'Sniper';
            }
            if (modelInput.value !== (v.model || '')) modelInput.value = v.model || '';
        } else if (activeBrandId === 'other') {
            modelInput.placeholder = 'e.g. exact model';
            if (modelInput.value !== (v.model || '')) modelInput.value = v.model || '';
        } else {
            modelInput.placeholder = 'e.g. model name';
            if (modelInput.value !== (v.model || '')) modelInput.value = v.model || '';
        }
    }

    if (suggContainer) {
        if (activeBrandId === 'yamaha' && brandConfig.suggestedModels && brandConfig.suggestedModels.length > 0) {
            suggContainer.innerHTML = brandConfig.suggestedModels.map(m => 
                `<button type="button" onclick="selectModelSuggestion('${m}')" class="text-[11px] font-semibold px-2 py-0.5 rounded bg-slate-100 text-slate-700 hover:bg-blue-50 hover:text-blue-600 border border-slate-200 transition-colors cursor-pointer">${m}</button>`
            ).join('');
            suggContainer.classList.remove('hidden');
        } else {
            suggContainer.innerHTML = '';
            suggContainer.classList.add('hidden');
        }
    }

    const plateInput = document.getElementById('moto-plate');
    if (plateInput && plateInput.value !== (v.plate || '')) plateInput.value = v.plate || '';
    if (typeof updateDtcReferenceUi === 'function') updateDtcReferenceUi();
}

window.selectModelSuggestion = function(modelName) {
    if (!inspectionState.vehicle) return;
    inspectionState.vehicle.model = modelName;
    const modelInput = document.getElementById('moto-model');
    if (modelInput) modelInput.value = modelName;
    saveInspectionState();
    if (typeof updateDtcReferenceUi === 'function') updateDtcReferenceUi();
};

function setMotoMode(mode, skipSave = false) {
    if (!skipSave) {
        inspectionState.vehicle.mode = mode;
        if (mode === 'identified' && !inspectionState.vehicle.brandId) {
            inspectionState.vehicle.brandId = DEFAULT_BRAND_ID;
            inspectionState.vehicle.brand = 'Yamaha';
            inspectionState.vehicle.brandText = '';
            inspectionState.vehicle.model = 'Sniper';
        }
        saveInspectionState();
    }
    
    const btnSelect = document.getElementById('btn-moto-select');
    const btnWalkin = document.getElementById('btn-moto-walkin');
    const fieldsIdentified = document.getElementById('moto-fields-identified');
    const fieldsWalkin = document.getElementById('moto-fields-walkin');
    if (!btnSelect) return;
    
    if (mode === 'walk-in') {
        btnWalkin.className = 'px-3 py-1 text-[11px] font-bold rounded-md bg-white text-slate-800 shadow-sm transition-all';
        btnSelect.className = 'px-3 py-1 text-[11px] font-bold rounded-md text-slate-500 hover:text-slate-700 transition-all';
        fieldsWalkin.classList.remove('hidden');
        fieldsIdentified.classList.add('hidden');
    } else {
        btnSelect.className = 'px-3 py-1 text-[11px] font-bold rounded-md bg-white text-slate-800 shadow-sm transition-all';
        btnWalkin.className = 'px-3 py-1 text-[11px] font-bold rounded-md text-slate-500 hover:text-slate-700 transition-all';
        fieldsIdentified.classList.remove('hidden');
        fieldsWalkin.classList.add('hidden');
        if (!skipSave) restoreMotorcycleCard();
    }
    if (typeof updateDtcReferenceUi === 'function') updateDtcReferenceUi();
}
window.setMotoMode = setMotoMode;

window.setMotoBrand = function(brandOrId) {
    const config = MOTORCYCLE_BRANDS_CONFIG.find(b => b.id === brandOrId || b.label === brandOrId);
    const targetId = config ? config.id : 'other';
    const currentId = inspectionState.vehicle.brandId;
    
    if (currentId !== targetId) {
        inspectionState.vehicle.brandId = targetId;
        inspectionState.vehicle.brand = config ? config.label : 'Other';
        inspectionState.vehicle.brandText = '';
        
        if (targetId === 'yamaha') {
            inspectionState.vehicle.model = (config && config.defaultModel) ? config.defaultModel : 'Sniper';
        } else {
            inspectionState.vehicle.model = '';
        }
    }
    saveInspectionState();
    restoreMotorcycleCard();
    if (typeof updateDtcReferenceUi === 'function') updateDtcReferenceUi();
};

window.updateMotoField = function(field, value) {
    if (field === 'brandOther') {
        inspectionState.vehicle.brandId = 'other';
        inspectionState.vehicle.brandText = value;
        inspectionState.vehicle.brand = value || 'Other';
    } else if (field === 'model') {
        inspectionState.vehicle.model = value;
    } else if (field === 'plate') {
        inspectionState.vehicle.plate = value;
    }
    saveInspectionState();
    if (typeof updateDtcReferenceUi === 'function') updateDtcReferenceUi();
};

function restoreCustomerCard() {
    const c = inspectionState.customer;
    if (!c) return;
    
    setCustomerMode(c.mode, true);
    
    const nameInput = document.getElementById('cust-name');
    if (nameInput && nameInput.value !== c.name) nameInput.value = c.name || '';
    
    const phoneInput = document.getElementById('cust-phone');
    if (phoneInput && phoneInput.value !== c.phone) phoneInput.value = c.phone || '';
    
    const emailInput = document.getElementById('cust-email');
    if (emailInput && emailInput.value !== c.email) emailInput.value = c.email || '';

    const badge = document.getElementById('cust-selected-badge');
    const stats = document.getElementById('cust-selected-stats');
    if (badge && stats) {
        if (c.selectedCustomerId) {
            const customer = mockCustomers.find(mc => mc.id === c.selectedCustomerId);
            if (customer) {
                const dateStr = customer.lastVisit || 'First visit';
                const visitStr = customer.totalVisits ? `${customer.totalVisits} visits` : '0 visits';
                const motoStr = (customer.motorcycles && customer.motorcycles.length > 0)
                    ? ` · Motorcycle: ${getBrandLabel(customer.motorcycles[0])} ${customer.motorcycles[0].model || ''}`.trim()
                    : '';
                stats.textContent = `Last visit: ${dateStr} · ${visitStr}${motoStr}`;
                badge.classList.remove('hidden');
                badge.classList.add('flex');
            } else {
                badge.classList.add('hidden');
                badge.classList.remove('flex');
            }
        } else {
            badge.classList.add('hidden');
            badge.classList.remove('flex');
        }
    }
}

function setCustomerMode(mode, skipSave = false) {
    if (!skipSave) {
        inspectionState.customer.mode = mode;
        if (mode === 'walk-in') {
            inspectionState.customer.selectedCustomerId = null;
            const badge = document.getElementById('cust-selected-badge');
            if (badge) {
                badge.classList.add('hidden');
                badge.classList.remove('flex');
            }
        } else {
            const searchInput = document.getElementById('cust-search-input');
            if (searchInput) searchInput.value = '';
        }
        saveInspectionState();
        if (typeof updateStep3Summaries === 'function') updateStep3Summaries();
    }
    
    const btnRegister = document.getElementById('btn-cust-register');
    const btnWalkin = document.getElementById('btn-cust-walkin');
    const fieldsRegistered = document.getElementById('cust-fields-registered');
    const fieldsWalkin = document.getElementById('cust-fields-walkin');
    if (!btnRegister) return;
    
    if (mode === 'walk-in') {
        btnWalkin.className = 'px-3 py-1 text-[11px] font-bold rounded-md bg-white text-slate-800 shadow-sm transition-all';
        btnRegister.className = 'px-3 py-1 text-[11px] font-bold rounded-md text-slate-500 hover:text-slate-700 transition-all';
        fieldsWalkin.classList.remove('hidden');
        fieldsWalkin.classList.add('block');
        fieldsRegistered.classList.add('hidden');
        fieldsRegistered.classList.remove('flex');
    } else {
        btnRegister.className = 'px-3 py-1 text-[11px] font-bold rounded-md bg-white text-slate-800 shadow-sm transition-all';
        btnWalkin.className = 'px-3 py-1 text-[11px] font-bold rounded-md text-slate-500 hover:text-slate-700 transition-all';
        fieldsRegistered.classList.remove('hidden');
        fieldsRegistered.classList.add('flex');
        fieldsWalkin.classList.add('hidden');
        fieldsWalkin.classList.remove('block');
    }
    if (typeof updateStep3Summaries === 'function') updateStep3Summaries();
}
window.setCustomerMode = setCustomerMode;

window.updateCustomerField = function(field, value) {
    inspectionState.customer.selectedCustomerId = null;
    if (field === 'name') {
        inspectionState.customer.name = value;
    } else if (field === 'phone') {
        inspectionState.customer.phone = value;
    } else if (field === 'email') {
        inspectionState.customer.email = value;
    }
    
    const badge = document.getElementById('cust-selected-badge');
    if (badge) {
        badge.classList.add('hidden');
        badge.classList.remove('flex');
    }
    
    saveInspectionState();
    if (typeof updateStep3Summaries === 'function') updateStep3Summaries();
}

function renderInspectionThumbs(id) {
    const box = document.querySelector(`[data-photos="${id}"]`);
    if (!box) return;
    box.innerHTML = (inspectionPhotos[id] || []).map((src, index) => `
        <div class="insp-thumb"><img src="${src}" alt="Inspection photo">
            <button type="button" data-insp="remove-photo" data-item="${id}" data-index="${index}" aria-label="Remove photo"><i class="ph-bold ph-x"></i></button>
        </div>`).join('');
}

// Patches one row in place
function refreshInspectionRow(id) {
    const row = document.querySelector(`.insp-item[data-item="${id}"]`);
    if (!row) return;
    const st = getInspItem(id);

    row.dataset.status = st.status || 'none';
    row.querySelectorAll('.insp-btn').forEach(btn => btn.classList.toggle('is-active', btn.dataset.status === st.status));
    row.querySelector('.insp-detail')?.classList.toggle('hidden', !(st.status === 'watch' || st.status === 'fix'));
    row.querySelectorAll('.insp-chip[data-tag]').forEach(chip => chip.classList.toggle('is-active', st.tags.includes(chip.dataset.tag)));

    refreshInspectionSummary();
}

function inspectionFormatEntry(item) {
    const st = getInspItem(item.id);
    const label = (item && item.label) || (item && item.id) || '';
    return `• ${label}${st.tags && st.tags.length ? ` — ${st.tags.join(', ')}` : ''}${st.note ? ` [${st.note}]` : ''}`;
}

function buildInspectionFindings() {
    const { odo, fuel, complaints } = (inspectionState && inspectionState.intake) || {};
    const fix = inspectionItems.filter(i => getInspItem(i.id).status === 'fix');
    const watch = inspectionItems.filter(i => getInspItem(i.id).status === 'watch');
    const checked = inspectionItems.filter(i => getInspItem(i.id).status).length;
    const unchecked = inspectionItems.length - checked;

    const lines = ['— PHYSICAL INSPECTION —'];
    const meta = [];
    if (odo) meta.push(`Odometer: ${Number(odo).toLocaleString()} km`);
    if (fuel) meta.push(`Fuel: ${fuel}`);
    if (meta.length) lines.push(meta.join(' | '));
    if (complaints && complaints.length) lines.push(`Complaint: ${complaints.join(', ')}`);
    if (fix.length) lines.push('', 'NEEDS REPAIR / REPLACEMENT:', ...fix.map(inspectionFormatEntry));
    if (watch.length) lines.push('', 'MONITOR / ADVISE CUSTOMER:', ...watch.map(inspectionFormatEntry));
    if (!fix.length && !watch.length && checked) lines.push('', 'No issues found on the checked items.');
    if (unchecked > 0) lines.push('', `(${unchecked} item${unchecked === 1 ? '' : 's'} not inspected)`);
    lines.push('— END INSPECTION —');
    return lines.join('\n');
}

function refreshInspectionSummary() {
    const total = inspectionItems.length;
    const counts = { ok: 0, watch: 0, fix: 0, na: 0 };
    inspectionItems.forEach(item => { const s = getInspItem(item.id).status; if (s) counts[s]++; });
    const checked = counts.ok + counts.watch + counts.fix + counts.na;

    const setText = (id, text) => { const el = document.getElementById(id); if (el) el.textContent = text; };
    setText('insp-progress-text', `${checked} / ${total} checked`);
    setText('insp-count-ok', counts.ok);
    setText('insp-count-watch', counts.watch);
    setText('insp-count-fix', counts.fix);
    const fill = document.getElementById('insp-progress-fill');
    if (fill) {
        fill.style.width = `${Math.round((checked / total) * 100)}%`;
        fill.classList.toggle('bg-emerald-500', checked === total);
        fill.classList.toggle('bg-blue-500', checked !== total);
    }

    // Per-section counters
    inspectionSections.forEach(sec => {
        const done = sec.items.filter(i => getInspItem(i.id).status).length;
        const label = document.querySelector(`[data-sec-count="${sec.id}"]`);
        if (label) label.textContent = done === sec.items.length ? `All ${done} checked ✓` : `${done}/${sec.items.length} checked`;
    });

    // Summary panel
    const summary = document.getElementById('insp-summary');
    if (!summary) return;

    if (checked === 0) {
        summary.innerHTML = `
            <div class="border border-dashed border-slate-300 rounded-xl p-4 text-center text-xs font-semibold text-slate-400">
                <i class="ph-fill ph-clipboard-text text-2xl block mb-1 text-slate-300"></i>
                Tap OK / Watch / Fix on each item. Flagged items and suggested parts will be summarized here.
            </div>`;
        return;
    }

    const fix = inspectionItems.filter(i => getInspItem(i.id).status === 'fix');
    const watch = inspectionItems.filter(i => getInspItem(i.id).status === 'watch');
    const suggested = getSuggestedParts();
    const partsOut = suggested.filter(s => s.level !== 'watch').map(s => mockInventory.find(p => p.id === s.id)).filter(p => p && p.stock === 0);

    const entry = (item, tone) => {
        const st = getInspItem(item.id);
        return `
            <li class="flex items-start gap-2.5 p-2.5 rounded-lg ${tone === 'fix' ? 'bg-red-50 border border-red-100' : 'bg-amber-50 border border-amber-100'}">
                <i class="ph-fill ${tone === 'fix' ? 'ph-wrench text-red-500' : 'ph-warning text-amber-500'} text-lg mt-0.5 shrink-0"></i>
                <div class="min-w-0 flex-1">
                    <p class="text-sm font-bold text-slate-800">${item.label}</p>
                    ${(st.tags.length || st.note) ? `<p class="text-xs text-slate-600 mt-0.5">${[...st.tags, st.note ? `“${inspEsc(st.note)}”` : ''].filter(Boolean).join(' · ')}</p>` : ''}
                </div>
                ${(inspectionPhotos[item.id] || []).length ? `<span class="text-[10px] font-bold text-slate-500 flex items-center gap-1 shrink-0"><i class="ph-bold ph-camera"></i>${inspectionPhotos[item.id].length}</span>` : ''}
            </li>`;
    };

    summary.innerHTML = `
        <div class="border border-slate-200 rounded-xl overflow-hidden">
            <div class="px-4 py-3 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
                <h3 class="text-sm font-extrabold text-slate-800 flex items-center gap-2"><i class="ph-fill ph-list-checks text-blue-500 text-lg"></i> Inspection Summary</h3>
                <span class="text-[11px] font-bold text-slate-400">${total - checked} not checked</span>
            </div>
            <div class="p-3 flex flex-col gap-3">
                ${(!fix.length && !watch.length) ? `<p class="text-sm font-bold text-emerald-700 bg-emerald-50 border border-emerald-100 rounded-lg p-3 flex items-center gap-2"><i class="ph-fill ph-check-circle text-lg"></i> No issues found on the checked items.</p>` : ''}
                ${fix.length ? `<div><p class="text-[11px] font-bold text-red-600 uppercase tracking-wider mb-1.5">Needs repair / replacement (${fix.length})</p><ul class="flex flex-col gap-1.5">${fix.map(i => entry(i, 'fix')).join('')}</ul></div>` : ''}
                ${watch.length ? `<div><p class="text-[11px] font-bold text-amber-600 uppercase tracking-wider mb-1.5">Monitor / advise customer (${watch.length})</p><ul class="flex flex-col gap-1.5">${watch.map(i => entry(i, 'watch')).join('')}</ul></div>` : ''}
                ${partsOut.length ? `<p class="text-xs font-semibold text-red-600 bg-red-50 border border-red-100 rounded-lg p-2.5 flex items-start gap-2"><i class="ph-fill ph-package text-base shrink-0"></i> Out of stock, order needed: ${partsOut.map(p => p.name).join(', ')}</p>` : ''}
                <div class="grid grid-cols-1 gap-2 pt-1">
                    <button type="button" data-insp="to-findings" class="min-h-[48px] rounded-xl bg-slate-800 hover:bg-slate-900 text-white text-sm font-bold flex items-center justify-center gap-2 active:scale-[0.98] transition-transform">
                        <i class="ph-bold ph-note-pencil text-lg"></i> Add to Final Findings
                    </button>
                </div>
            </div>
        </div>`;
    
    validateStep1();
    if (typeof renderInspectionOverview === 'function') renderInspectionOverview();
}

function validateStep1() {
    // Validation removed for prototype. Button always enabled.
}

// --- Actions ---
function setInspectionStatus(id, status) {
    const st = getInspItem(id);
    if (st.status === status) {          // tap the active button again to clear it
        st.status = null;
        st.manual = false;
    } else {
        st.status = status;
        st.manual = true;
    }
    saveInspectionState();
    refreshInspectionRow(id);

}

function handleInspectionPhoto(input) {
    const id = input.dataset.item;
    const file = input.files && input.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
        const img = new Image();
        img.onload = () => {
            const scale = Math.min(1, 900 / Math.max(img.width, img.height));   // downscale phone photos
            const canvas = document.createElement('canvas');
            canvas.width = Math.round(img.width * scale);
            canvas.height = Math.round(img.height * scale);
            canvas.getContext('2d').drawImage(img, 0, 0, canvas.width, canvas.height);
            if (!inspectionPhotos[id]) inspectionPhotos[id] = [];
            inspectionPhotos[id].push(canvas.toDataURL('image/jpeg', 0.7));
            renderInspectionThumbs(id);
            refreshInspectionSummary();
        };
        img.src = reader.result;
    };
    reader.readAsDataURL(file);
    input.value = '';
}

function resetInspection(skipConfirm) {
    if (!skipConfirm && !confirm('Clear all physical inspection results for this vehicle?')) return;
    inspectionState = emptyInspectionState();
    inspectionPhotos = {};
    saveInspectionState();
    renderInspection();
}

// Called after a vehicle is pushed to Active Repairs so the next inspection starts clean
function clearInspectionDraft() {
    inspectionState = emptyInspectionState();
    inspectionPhotos = {};
    saveInspectionState();
}

function flashInspectionButton(btn, html) {
    const original = btn.innerHTML;
    btn.innerHTML = html;
    setTimeout(() => { if (btn.isConnected) btn.innerHTML = original; }, 1600);
}

document.addEventListener('click', function(e) {
    const el = e.target.closest('[data-insp]');
    if (!el) return;
    const action = el.dataset.insp;

    if (action === 'status') {
        setInspectionStatus(el.dataset.item, el.dataset.status);

    } else if (action === 'tag') {
        const st = getInspItem(el.dataset.item);
        const tag = el.dataset.tag;
        st.tags = st.tags.includes(tag) ? st.tags.filter(t => t !== tag) : [...st.tags, tag];
        saveInspectionState();
        refreshInspectionRow(el.dataset.item);

    } else if (action === 'section-ok') {
        const sec = inspectionSections.find(s => s.id === el.dataset.section);
        sec.items.forEach(item => {
            const st = getInspItem(item.id);
            if (!st.status) { st.status = 'ok'; st.manual = true; refreshInspectionRow(item.id); }
        });
        saveInspectionState();
    

    } else if (action === 'toggle-section') {
        const id = el.dataset.section;
        inspectionCollapsed[id] = !isInspectionCollapsed(id);
        document.getElementById(`insp-sec-${id}`)?.classList.toggle('is-collapsed', inspectionCollapsed[id]);

    } else if (action === 'complaint') {
        const list = inspectionState.intake.complaints;
        const value = el.dataset.complaint;
        inspectionState.intake.complaints = list.includes(value) ? list.filter(c => c !== value) : [...list, value];
        saveInspectionState();
        restoreInspectionIntake();

    } else if (action === 'remove-photo') {
        inspectionPhotos[el.dataset.item]?.splice(parseInt(el.dataset.index, 10), 1);
        renderInspectionThumbs(el.dataset.item);
        refreshInspectionSummary();

    } else if (action === 'addpart') {
        const part = mockInventory.find(p => p.id === el.dataset.part);
        const added = el.dataset.entry
            ? addDtcPartToPlan(el.dataset.part, el.dataset.entry)
            : addPartToPlan(part);
        if (added && part) {
            document.querySelectorAll(`[data-insp="addpart"][data-part="${part.id}"]`).forEach(btn => {
                btn.classList.add('is-added');
                if (btn.dataset.entry) btn.className = "is-added w-full sm:w-auto min-h-[44px] px-3.5 py-2.5 rounded-lg text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center justify-center gap-1.5 cursor-default";
                btn.innerHTML = '<i class="ph-bold ph-check"></i> Added to plan';
            });
        }

    } else if (action === 'add-all-parts') {
        const fixParts = [...new Set(inspectionItems.filter(i => getInspItem(i.id).status === 'fix').map(i => i.part).filter(Boolean))]
            .map(id => mockInventory.find(p => p.id === id))
            .filter(p => p && p.stock > 0);
        fixParts.forEach(part => addPartToPlan(part));
        flashInspectionButton(el, `<i class="ph-bold ph-check text-lg"></i> ${fixParts.length} added to plan`);

    } else if (action === 'to-findings') {
        const block = buildInspectionFindings();
        const existing = /— PHYSICAL INSPECTION —[\s\S]*?— END INSPECTION —/;
        document.querySelectorAll('#final-findings').forEach(textarea => {
            textarea.value = existing.test(textarea.value)
                ? textarea.value.replace(existing, block)                      // refresh the earlier block instead of duplicating it
                : (textarea.value.trim() ? `${textarea.value.trim()}\n\n${block}` : block);
            textarea.style.height = 'auto';
            textarea.style.height = `${Math.max(96, textarea.scrollHeight)}px`;
        });
        applyDtcFindings();
        flashInspectionButton(el, '<i class="ph-bold ph-check text-lg"></i> Added to findings');

    } else if (action === 'dtc-to-findings') {
        applyDtcFindings();
        flashInspectionButton(el, '<i class="ph-bold ph-check text-lg"></i> Added to findings');

    } else if (action === 'reset') {
        resetInspection();
    }
});

document.addEventListener('input', function(e) {
    const target = e.target;
    if (target && target.id === 'final-findings') {
        document.querySelectorAll('#final-findings').forEach(ta => {
            if (ta !== target && ta.value !== target.value) {
                ta.value = target.value;
            }
        });
    }
    if (target.dataset && target.dataset.inspInput === 'note') {
        getInspItem(target.dataset.item).note = target.value;
        saveInspectionState();
    }
});

document.addEventListener('change', function(e) {
    if (e.target.matches && e.target.matches('[data-insp-file]')) handleInspectionPhoto(e.target);
});



window.toggleInvPartCard = function(id) {
    const body = document.getElementById(`m-inv-body-${id}`);
    const icon = document.getElementById(`m-inv-icon-${id}`);
    if (!body) return;
    
    const isHidden = body.classList.contains('hidden');
    
    // Close others
    document.querySelectorAll('[id^="m-inv-body-"]').forEach(b => {
        b.classList.add('hidden');
    });
    document.querySelectorAll('[id^="m-inv-icon-"]').forEach(i => {
        i.classList.remove('rotate-180', 'text-blue-500');
    });
    
    // Toggle current
    if (isHidden) {
        body.classList.remove('hidden');
        if (icon) icon.classList.add('rotate-180', 'text-blue-500');
    }
};

// AUTO-ASSIGN LINKS SCREEN LOGIC
window.openAutoAssignLinks = function() {
    if (!hasFeature('autoAssign')) {
        showToast("You don't have permission to do this.");
        return;
    }
    document.getElementById('view-inventory').classList.add('hidden');
    document.getElementById('view-autoassign').classList.remove('hidden');
    window.autoAssignOpenGroups = window.autoAssignOpenGroups || new Set();
    if (window.innerWidth >= 768) {
        inspectionSections.forEach(sec => window.autoAssignOpenGroups.add(sec.id));
    }
    renderAutoAssignLinks();
};

window.closeAutoAssignLinks = function() {
    document.getElementById('view-autoassign').classList.add('hidden');
    document.getElementById('view-inventory').classList.remove('hidden');
    renderInventory();
};

window.toggleAutoAssignGroup = function(groupId) {
    if (window.autoAssignOpenGroups.has(groupId)) {
        window.autoAssignOpenGroups.delete(groupId);
    } else {
        window.autoAssignOpenGroups.add(groupId);
    }
    renderAutoAssignLinks();
};

window.activeAASearch = null;

window.showAutoAssignSearch = function(itemId) {
    if (!hasFeature('autoAssign')) {
        showToast("You don't have permission to do this.");
        return;
    }
    window.activeAASearch = itemId;
    renderAutoAssignLinks();
    setTimeout(() => {
        const input = document.getElementById('aa-search-' + itemId);
        if (input) input.focus();
    }, 50);
};

window.closeAutoAssignSearch = function() {
    window.activeAASearch = null;
    renderAutoAssignLinks();
};

window.performAutoAssignSearch = function(itemId, query) {
    if (!hasFeature('autoAssign')) return;
    const resultsContainer = document.getElementById('aa-search-results-' + itemId);
    if (!query.trim()) {
        resultsContainer.innerHTML = '';
        return;
    }
    const lowerQuery = query.toLowerCase();
    const results = mockInventory.filter(p => p.name.toLowerCase().includes(lowerQuery) || p.sku.toLowerCase().includes(lowerQuery));
    if (results.length === 0) {
        resultsContainer.innerHTML = '<div class="p-2 text-sm text-gray-500">No parts found</div>';
        return;
    }
    
    let html = '';
    results.forEach(p => {
        let expText = '';
        if (typeof getExpiryStatus === 'function' && getExpiryStatus(p).status === 'expired') {
            expText = '<span class="text-red-600 text-[10px] font-bold ml-1.5">Expired</span>';
        }
        html += `
            <div class="flex items-center justify-between p-2 hover:bg-gray-50 border-b last:border-0">
                <div class="flex-1 min-w-0 pr-2">
                    <div class="text-sm font-medium text-gray-900 truncate">${p.name}${expText}</div>
                    <div class="text-xs text-gray-500">${p.sku} | \u20B1${p.price.toLocaleString()}</div>
                </div>
                <div class="flex items-center gap-2">
                    <input type="number" id="aa-qty-${itemId}-${p.id}" value="1" min="1" class="w-16 px-2 py-1 text-sm border rounded focus:ring-purple-500 focus:border-purple-500">
                    <button onclick="addAutoAssignLink('${itemId}', '${p.id}', document.getElementById('aa-qty-${itemId}-${p.id}').value)" class="px-3 py-1 bg-purple-600 text-white text-sm font-medium rounded hover:bg-purple-700">Add</button>
                </div>
            </div>
        `;
    });
    resultsContainer.innerHTML = html;
};

window.addAutoAssignLink = function(itemId, partId, qtyStr) {
    if (!hasFeature('autoAssign')) {
        showToast("You don't have permission to do this.");
        return;
    }
    const qty = parseInt(qtyStr, 10) || 1;
    const part = mockInventory.find(p => p.id === partId);
    if (!part) return;
    
    if (!part.linkedInspectionItems) {
        part.linkedInspectionItems = [];
    }
    
    const existing = part.linkedInspectionItems.find(l => l.itemId === itemId);
    if (existing) {
        existing.qty = qty;
    } else {
        part.linkedInspectionItems.push({ itemId, qty });
    }
    
    window.activeAASearch = null;
    renderAutoAssignLinks();
};

window.removeAutoAssignLink = function(itemId, partId) {
    if (!hasFeature('autoAssign')) {
        showToast("You don't have permission to do this.");
        return;
    }
    const part = mockInventory.find(p => p.id === partId);
    if (part && part.linkedInspectionItems) {
        part.linkedInspectionItems = part.linkedInspectionItems.filter(l => l.itemId !== itemId);
    }
    renderAutoAssignLinks();
};

window.renderAutoAssignLinks = function() {
    const container = document.getElementById('autoassign-groups');
    if (!container) return;
    
    if (typeof inspectionSections === 'undefined') {
        container.innerHTML = '<div class="text-red-500">Error: inspection data not found.</div>';
        return;
    }

    let html = '';
    let totalLinks = 0;
    
    inspectionSections.forEach(sec => {
        const isOpen = window.autoAssignOpenGroups.has(sec.id);
        const chevClass = isOpen ? 'rotate-180' : '';
        
        let secLinksCount = 0;
        sec.items.forEach(item => {
            const linkedParts = mockInventory.filter(p => p.linkedInspectionItems && p.linkedInspectionItems.some(l => l.itemId === item.id));
            secLinksCount += linkedParts.length;
            totalLinks += linkedParts.length;
        });
        
        html += `
        <div class="bg-white border rounded-lg overflow-hidden">
            <button onclick="toggleAutoAssignGroup('${sec.id}')" class="w-full flex items-center justify-between p-4 bg-gray-50 hover:bg-gray-100 transition-colors">
                <div class="flex items-center gap-3">
                    <h3 class="font-bold text-gray-900">${sec.title}</h3>
                    ${secLinksCount > 0 ? `<span class="bg-purple-100 text-purple-700 text-xs font-bold px-2 py-0.5 rounded-full">${secLinksCount} links</span>` : ''}
                </div>
                <svg class="w-5 h-5 text-gray-500 transform transition-transform ${chevClass}" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7-7-7-7"></path></svg>
            </button>
            <div class="divide-y ${isOpen ? '' : 'hidden'}">
        `;
        
        sec.items.forEach(item => {
            const linkedParts = mockInventory.filter(p => p.linkedInspectionItems && p.linkedInspectionItems.some(l => l.itemId === item.id));
            
            html += `<div class="p-4">`;
            html += `
                <div class="flex items-center justify-between mb-2">
                    <div class="font-medium text-gray-800">${item.label}</div>
                    ${window.activeAASearch !== item.id ? `
                        <button onclick="showAutoAssignSearch('${item.id}')" class="text-sm text-purple-600 hover:text-purple-800 font-medium flex items-center gap-1">
                            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path></svg>
                            Add Part
                        </button>
                    ` : ''}
                </div>
            `;
            
            // Search Box
            if (window.activeAASearch === item.id) {
                html += `
                    <div class="mb-3 p-3 bg-gray-50 border rounded-lg">
                        <div class="flex items-center gap-2 mb-2">
                            <div class="relative flex-1">
                                <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <svg class="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
                                </div>
                                <input type="text" id="aa-search-${item.id}" oninput="performAutoAssignSearch('${item.id}', this.value)" placeholder="Search inventory by name or SKU..." class="w-full pl-9 pr-3 py-2 border rounded-lg focus:ring-purple-500 focus:border-purple-500 text-sm">
                            </div>
                            <button onclick="closeAutoAssignSearch()" class="p-2 text-gray-500 hover:text-gray-700 bg-white border rounded-lg">Cancel</button>
                        </div>
                        <div id="aa-search-results-${item.id}" class="bg-white border rounded shadow-sm max-h-48 overflow-y-auto"></div>
                    </div>
                `;
            }
            
            // Linked Parts List
            if (linkedParts.length > 0) {
                html += `<div class="space-y-2">`;
                linkedParts.forEach(p => {
                    const link = p.linkedInspectionItems.find(l => l.itemId === item.id);
                    html += `
                        <div class="flex items-center justify-between p-2 bg-purple-50 border border-purple-100 rounded text-sm">
                            <div>
                                <span class="font-medium text-purple-900">${p.name}</span>
                                <span class="text-purple-600 ml-2">Qty: ${link.qty}</span>
                            </div>
                            <button onclick="removeAutoAssignLink('${item.id}', '${p.id}')" class="text-red-500 hover:text-red-700 p-1" title="Remove link">
                                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                            </button>
                        </div>
                    `;
                });
                html += `</div>`;
            } else {
                html += `<div class="text-sm text-gray-400 italic">No parts linked</div>`;
            }
            
            html += `</div>`;
        });
        html += `</div></div>`;
    });
    
    container.innerHTML = html;
    
    const countEl = document.getElementById('autoassign-count');
    if (countEl) {
        countEl.textContent = totalLinks === 1 ? '1 link mapped' : `${totalLinks} links mapped`;
    }
};

// Motorcycle DTC and Error Codes Reference for Yamaha Sniper 150 Version 2
const DTC_REFERENCE = {
  "yamaha_sniper": {
    label: "Yamaha Sniper 150 V2",
    partMap: {
      "Throttle Position Sensor (TPS)": "SNP-001",
      "Manifold Absolute Pressure (MAP) Sensor": "SNP-002",
      "Side Stand Switch": "SNP-003",
      "Intake Air Temperature (IAT) Sensor": "SNP-004",
      "Oxygen (O2) Sensor": "SNP-005",
      "Lean Angle Sensor (Bank Angle Sensor)": "SNP-006",
      "Speedometer Cable / Speed Sensor": "SNP-007",
      "Stator Assembly": "SNP-008",
      "Engine Coolant Temperature (ECT) Sensor": "SNP-009",
      "Yamaha Ignition Coil": "SNP-010",
      "Yamaha Regulator Rectifier": "SNP-011",
      "Fuel Injector": "SNP-012",
      "Fuel Injector Coupler": "SNP-013",
      "Spark Plug": "SNP-014",
      "Cooling Fan": "SNP-015",
      "Motorcycle Battery (12V)": "170010"
    },
    entries: [
      // COMMON (most encountered)
      {
        id: "tps",
        group: "common",
        codes: ["P0120", "P0122", "P0123"],
        errorNumbers: ["Error 15"],
        component: "Throttle Position Sensor (TPS)",
        description: "Defective or dirty TPS, causing poor acceleration or an unstable engine idle.",
        verification: [
          "Clean the throttle body with FI cleaner.",
          "Check for loose TPS wiring."
        ],
        parts: ["Throttle Position Sensor (TPS)"]
      },
      {
        id: "map",
        group: "common",
        codes: ["P0105", "P0107", "P0108"],
        errorNumbers: ["Error 13", "Error 14"],
        component: "Intake Air Pressure Sensor (MAP)",
        description: "Sensor circuit open/shorted, or a loose/disconnected vacuum hose line.",
        verification: [
          "Inspect the rubber vacuum hose for cracks or leaks.",
          "Check the 3-pin sensor connector."
        ],
        parts: ["Manifold Absolute Pressure (MAP) Sensor"]
      },
      {
        id: "side_stand",
        group: "common",
        codes: ["P1601", "P1901"],
        errorNumbers: ["Error 19"],
        component: "Side Stand Switch",
        description: "Broken or disconnected blue/green wire leading to the ECU. Prevents starting.",
        verification: [
          "Check if the side stand switch is stuck with mud/dirt.",
          "Inspect the blue/green wire under the frame."
        ],
        parts: ["Side Stand Switch"]
      },
      {
        id: "iat",
        group: "common",
        codes: ["P0110", "P0112", "P0113"],
        errorNumbers: ["Error 22"],
        component: "Intake Air Temperature (IAT) Sensor",
        description: "Faulty sensor or disconnected harness causing incorrect air temperature readings.",
        verification: [
          "Check the air filter box housing connector.",
          "Inspect for loose pins in the sensor wire."
        ],
        parts: ["Intake Air Temperature (IAT) Sensor"]
      },
      {
        id: "o2",
        group: "common",
        codes: ["P0130", "P0131", "P0132"],
        errorNumbers: ["Error 24"],
        component: "Oxygen (O2) Sensor",
        description: "The ECU is getting abnormal or no signals from the exhaust O2 sensor. Often triggers a fuel gauge blinking symptom.",
        verification: [
          "Inspect the exhaust pipe connection for leaks.",
          "Check for carbon buildup on the sensor tip."
        ],
        parts: ["Oxygen (O2) Sensor"]
      },
      {
        id: "lean_angle",
        group: "common",
        codes: ["P1500", "P1999"],
        errorNumbers: ["Error 30", "Error 41"],
        component: "Lean Angle Sensor",
        description: "Triggers if the motorcycle has rolled over, or if the sensor is dislodged/faulty. It shuts off the engine for safety.",
        verification: [
          "Check if the sensor has fallen out of its rubber mount.",
          "Ensure the sensor is oriented vertically."
        ],
        parts: ["Lean Angle Sensor (Bank Angle Sensor)"]
      },
      {
        id: "injector",
        group: "common",
        codes: ["P0201"],
        errorNumbers: ["Error 39"],
        component: "Fuel Injector",
        description: "Open or short circuit detected in the injector wiring, causing engine jerking.",
        verification: [
          "Listen if the injector clicks when priming.",
          "Inspect the injector harness connector for corrosion."
        ],
        parts: ["Fuel Injector Coupler", "Fuel Injector"]
      },
      {
        id: "speed_sensor",
        group: "common",
        codes: ["P0500"],
        errorNumbers: ["Error 42"],
        component: "Speed Sensor",
        description: "No normal signal received from the speed sensor. The digital speedometer on your cluster will stop reading correctly.",
        verification: [
          "Check the front wheel speed sensor cable for cuts.",
          "Inspect the digital gear/sensor at the wheel hub."
        ],
        parts: ["Speedometer Cable / Speed Sensor"]
      },
      // LEAST ENCOUNTERED
      {
        id: "ckp",
        group: "least",
        codes: ["P0335", "P0336"],
        errorNumbers: ["Error 12"],
        component: "Crankshaft Position Sensor (CKP)",
        description: "The ECU is not receiving normal signals from the crank sensor. The bike usually will not start or may misfire.",
        verification: [
          "Clean the stator/crank area from debris.",
          "Check the CKP sensor plug for water intrusion."
        ],
        parts: ["Stator Assembly"]
      },
      {
        id: "coolant_temp",
        group: "least",
        codes: ["P0115", "P0117", "P0118"],
        errorNumbers: ["Error 21"],
        component: "Coolant Temperature Sensor",
        description: "Open/short circuit in the sensor. Can cause the radiator fan to run continuously or the engine to run too rich.",
        verification: [
          "Check coolant level in the radiator and reservoir.",
          "Inspect the wiring plug on the back of the cylinder."
        ],
        parts: ["Engine Coolant Temperature (ECT) Sensor", "Cooling Fan"]
      },
      {
        id: "ignition_coil",
        group: "least",
        codes: ["P0351"],
        errorNumbers: ["Error 33"],
        component: "Ignition Coil",
        description: "Primary lead open or short circuit. Causes severe engine misfiring or no spark.",
        verification: [
          "Check the spark plug cap connection.",
          "Inspect the high-tension wire for burns/cuts."
        ],
        parts: ["Yamaha Ignition Coil", "Spark Plug"]
      },
      {
        id: "power_supply",
        group: "least",
        codes: ["P0560", "P0562", "P0563"],
        errorNumbers: ["Error 46"],
        component: "Power Supply / Charging System",
        description: "The ECU is receiving abnormal voltage (too low or too high). Usually caused by a dead battery, faulty rectifier/regulator, or stator issue.",
        verification: [
          "Measure battery voltage using a multimeter (should be 12.4V-12.8V off).",
          "Check for loose or corroded battery terminals."
        ],
        parts: ["Yamaha Regulator Rectifier", "Motorcycle Battery (12V)"]
      }
    ]
  }
};
window.DTC_REFERENCE = DTC_REFERENCE;

function findDtcEntry(codeOrErrorNumber) {
  if (!codeOrErrorNumber) return null;
  const query = String(codeOrErrorNumber).trim().toUpperCase();
  if (!query) return null;

  const ref = DTC_REFERENCE && DTC_REFERENCE.yamaha_sniper;
  if (!ref || !Array.isArray(ref.entries)) return null;

  const normalizedQuery = query.replace(/^ERROR(\d+)$/i, 'ERROR $1');

  for (const entry of ref.entries) {
    if (entry.codes && entry.codes.some(c => c.toUpperCase() === query)) {
      return entry;
    }
    if (entry.errorNumbers && entry.errorNumbers.some(e => {
      const eUpper = e.toUpperCase();
      return eUpper === query || eUpper === normalizedQuery;
    })) {
      return entry;
    }
  }
  return null;
}
window.findDtcEntry = findDtcEntry;

function getDtcReference(vehicle) {
  const v = vehicle || (typeof inspectionState !== 'undefined' ? inspectionState.vehicle : null);
  if (!v || v.mode === 'walk-in') {
    return null;
  }

  const brand = (v.brandId || (typeof getBrandLabel === 'function' ? getBrandLabel(v) : '') || v.brand || '').toLowerCase();
  const isYamaha = brand === 'yamaha';
  const model = String(v.model || '').toLowerCase();
  const isSniper = model.includes('sniper');

  if (isYamaha && isSniper) {
    return (DTC_REFERENCE && DTC_REFERENCE.yamaha_sniper) ? DTC_REFERENCE.yamaha_sniper : null;
  }

  return null;
}
window.getDtcReference = getDtcReference;

const demoScanCodes = ['P0118', 'P0562', 'P0120'];

function buildDtcCardHtml(entry, scannedCode) {
    if (!entry) return '';
    const ref = typeof getDtcReference === 'function' ? getDtcReference(inspectionState && inspectionState.vehicle) : (DTC_REFERENCE && DTC_REFERENCE.yamaha_sniper);
    const partMap = (ref && ref.partMap) ? ref.partMap : {};

    // 1. Header: code badges, Error badge (grey), component name title, group tag
    const codeBadges = (entry.codes || []).map(code => 
        `<span class="px-2.5 py-1 rounded-md text-xs font-bold bg-red-100 text-red-700 border border-red-200">${escHTML(code)}</span>`
    ).join(' ');

    const errorBadges = (entry.errorNumbers || []).map(err => 
        `<span class="px-2.5 py-1 rounded-md text-xs font-semibold bg-slate-100 text-slate-600 border border-slate-200">${escHTML(err)}</span>`
    ).join(' ');

    const groupLabel = entry.group === 'common' ? 'Common' : 'Less common';
    const groupBadge = `<span class="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${entry.group === 'common' ? 'bg-amber-50 text-amber-700 border border-amber-200' : 'bg-slate-100 text-slate-600 border border-slate-200'}">${groupLabel}</span>`;

    // 2. Body: Two columns on desktop, one on mobile
    const descriptionHtml = `
        <div>
            <span class="text-[11px] font-bold text-slate-700 uppercase tracking-wider block mb-1.5">Description</span>
            <p class="text-xs text-slate-600 leading-relaxed">${escHTML(entry.description || 'None recorded.')}</p>
        </div>
    `;

    const verificationHtml = `
        <div>
            <span class="text-[11px] font-bold text-slate-700 uppercase tracking-wider block mb-1.5">Verification</span>
            ${(entry.verification && entry.verification.length)
                ? `<ul class="list-disc pl-4 space-y-1 text-xs text-slate-600">${entry.verification.map(v => `<li>${escHTML(v)}</li>`).join('')}</ul>`
                : '<p class="text-xs text-slate-400 italic">None recorded.</p>'
            }
        </div>
    `;

    // 3. Related parts
    const relatedParts = (entry.parts || []).map(partName => {
        const partId = partMap[partName];
        return partId ? mockInventory.find(p => p.id === partId) : null;
    }).filter(Boolean);

    let partsHtml = '';
    if (relatedParts.length === 0) {
        partsHtml = '<p class="text-xs text-slate-400 italic">No related part recorded in inventory.</p>';
    } else {
        partsHtml = '<div class="flex flex-col gap-2">' + relatedParts.map(part => {
            let stockBadge = '';
            if (part.stock === 0) {
                stockBadge = '<span class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-bold bg-red-100 text-red-700 border border-red-200 shrink-0"><span class="w-2 h-2 rounded-full bg-red-500"></span> 0 Available</span>';
            } else if (part.stock <= (part.minStock !== undefined ? part.minStock : 5)) {
                stockBadge = `<span class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-bold bg-yellow-100 text-yellow-700 border border-yellow-200 shrink-0"><span class="w-2 h-2 rounded-full bg-yellow-500 animate-pulse"></span> ${part.stock} Available</span>`;
            } else {
                stockBadge = `<span class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-bold bg-emerald-100 text-emerald-700 border border-emerald-200 shrink-0"><span class="w-2 h-2 rounded-full bg-emerald-500"></span> ${part.stock} Available</span>`;
            }

            const isAlreadyAdded = typeof repairPlanParts !== 'undefined' && repairPlanParts.some(p => p.id === part.id && !p.obsolete);
            let btnHtml = '';
            if (isAlreadyAdded) {
                btnHtml = `<button type="button" class="is-added w-full sm:w-auto min-h-[44px] px-3.5 py-2.5 rounded-lg text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center justify-center gap-1.5 cursor-default"><i class="ph-bold ph-check"></i> Added to plan</button>`;
            } else if (part.stock === 0) {
                btnHtml = `<button type="button" data-insp="addpart" data-part="${part.id}" data-entry="${escHTML(entry.id)}" class="w-full sm:w-auto min-h-[44px] px-3.5 py-2.5 rounded-lg text-xs font-bold bg-amber-50 text-amber-700 border border-amber-300 hover:bg-amber-100 transition-colors flex items-center justify-center gap-1.5 active:scale-[0.98]"><i class="ph-bold ph-plus"></i> Add (out of stock)</button>`;
            } else {
                btnHtml = `<button type="button" data-insp="addpart" data-part="${part.id}" data-entry="${escHTML(entry.id)}" class="w-full sm:w-auto min-h-[44px] px-3.5 py-2.5 rounded-lg text-xs font-bold bg-blue-600 text-white hover:bg-blue-700 shadow-sm transition-colors flex items-center justify-center gap-1.5 active:scale-[0.98]"><i class="ph-bold ph-plus"></i> Add to parts plan</button>`;
            }

            return `
                <div class="flex flex-col sm:flex-row sm:items-center justify-between p-3 bg-slate-50 border border-slate-200 rounded-lg gap-3 text-xs">
                    <div class="flex flex-wrap items-center gap-2 min-w-0">
                        <span class="font-bold text-slate-800">${escHTML(part.name)}</span>
                        <span class="text-slate-400">·</span>
                        <span class="font-bold text-blue-600 shrink-0">\u20B1${Number(part.price || 0).toFixed(2)}</span>
                        ${stockBadge}
                    </div>
                    <div class="shrink-0 w-full sm:w-auto">
                        ${btnHtml}
                    </div>
                </div>
            `;
        }).join('') + '</div>';
    }

    const primaryCode = scannedCode || ((entry.codes && entry.codes[0]) ? entry.codes[0] : '');

    return `
        <div class="bg-white border border-slate-200 rounded-xl p-4 sm:p-5 shadow-sm flex flex-col gap-3.5" data-entry-id="${escHTML(entry.id)}" data-dtc="${escHTML(primaryCode)}">
            <div class="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-3">
                <div class="flex flex-wrap items-center gap-2">
                    ${codeBadges}
                    ${errorBadges}
                    <span class="text-sm font-bold text-slate-800 ml-1">${escHTML(entry.component)}</span>
                </div>
                <div>
                    ${groupBadge}
                </div>
            </div>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4 py-1">
                ${descriptionHtml}
                ${verificationHtml}
            </div>
            <div class="pt-3 border-t border-slate-100">
                <span class="text-[11px] font-bold text-slate-700 uppercase tracking-wider block mb-2">Related Parts</span>
                ${partsHtml}
            </div>
        </div>
    `;
}
window.buildDtcCardHtml = buildDtcCardHtml;

// Scanned DTC entries ({ id, code }) and parts the user added from them ({ partId, entryId })
const dtcScanState = { scanned: [], addedParts: [] };
window.dtcScanState = dtcScanState;

function getDtcEntryById(id) {
    const ref = (typeof DTC_REFERENCE !== 'undefined' && DTC_REFERENCE.yamaha_sniper) ? DTC_REFERENCE.yamaha_sniper : null;
    return (ref && Array.isArray(ref.entries)) ? (ref.entries.find(e => e.id === id) || null) : null;
}

// items: array of entries / codes to replace the results with; omit to re-render the current state
function renderDtcResults(items) {
    const container = document.getElementById('dtc-results-list');
    if (!container) return;

    if (items !== undefined) {
        const list = Array.isArray(items) ? items : [items];
        dtcScanState.scanned = [];
        list.forEach(item => {
            let entry = null;
            let code = '';
            if (item && typeof item === 'object' && item.component) {
                entry = item;
            } else if (typeof item === 'string') {
                entry = getDtcEntryById(item) || (typeof findDtcEntry === 'function' ? findDtcEntry(item) : null);
                if (entry && (entry.codes || []).includes(item.toUpperCase())) code = item.toUpperCase();
            }
            if (entry && !dtcScanState.scanned.some(s => s.id === entry.id)) {
                dtcScanState.scanned.push({ id: entry.id, code: code || ((entry.codes && entry.codes[0]) || '') });
            }
        });
        dtcScanState.addedParts = dtcScanState.addedParts.filter(a => dtcScanState.scanned.some(s => s.id === a.entryId));
    }

    container.innerHTML = dtcScanState.scanned
        .map(s => buildDtcCardHtml(getDtcEntryById(s.id), s.code))
        .join('');

    if (typeof lucide !== 'undefined' && lucide.createIcons) {
        lucide.createIcons();
    }
    if (typeof renderReports === 'function' && typeof currentReportRange !== 'undefined') {
        renderReports(currentReportRange);
    }
}
window.renderDtcResults = renderDtcResults;

function addDtcResultEntry(entry, code) {
    const container = document.getElementById('dtc-results-list');
    if (!container || !entry) return;

    const query = String(code || '').trim().toUpperCase();
    const scannedCode = (entry.codes || []).includes(query) ? query : ((entry.codes && entry.codes[0]) || '');

    const existing = container.querySelector(`[data-entry-id="${entry.id}"]`);
    if (existing) {
        existing.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        existing.classList.add('ring-2', 'ring-blue-500');
        setTimeout(() => existing.classList.remove('ring-2', 'ring-blue-500'), 1500);
        const item = dtcScanState.scanned.find(s => s.id === entry.id);
        if (item && (entry.codes || []).includes(query)) item.code = query;
        if (typeof renderReports === 'function' && typeof currentReportRange !== 'undefined') {
            renderReports(currentReportRange);
        }
        return;
    }

    if (!dtcScanState.scanned.some(s => s.id === entry.id)) {
        dtcScanState.scanned.push({ id: entry.id, code: scannedCode });
    }

    container.insertAdjacentHTML('beforeend', buildDtcCardHtml(entry, scannedCode));

    if (typeof lucide !== 'undefined' && lucide.createIcons) {
        lucide.createIcons();
    }
    if (typeof renderReports === 'function' && typeof currentReportRange !== 'undefined') {
        renderReports(currentReportRange);
    }
}
window.addDtcResultEntry = addDtcResultEntry;

function getDtcPlanTarget(entry) {
    return `ECU/OBD: ${entry && entry.component ? entry.component : 'Scan'}`;
}

// "Add to parts plan" from a DTC card: qty 1, tagged "From ECU/OBD scan", no duplicates
function addDtcPartToPlan(partId, entryId) {
    const part = mockInventory.find(p => p.id === partId);
    const entry = getDtcEntryById(entryId);
    if (!part || !entry) return false;

    if (!dtcScanState.addedParts.some(a => a.partId === partId)) {
        dtcScanState.addedParts.push({ partId: partId, entryId: entryId });
    }
    if (repairPlanParts.some(p => p.id === partId && !p.obsolete)) return true;

    const target = getDtcPlanTarget(entry);
    window.removedAutoSuggestions.delete(partId + '|' + target);
    const old = repairPlanParts.find(p => p.id === partId);
    if (old) {
        old.obsolete = false;
        old.target = target;
        old.source = 'ecu';
        old.isAuto = true;
        old.category = 'ECU / OBD';
        if (!old.handling) old.handling = 'order';
    } else {
        repairPlanParts.push({
            id: part.id,
            part: part,
            qty: 1,
            target: target,
            category: 'ECU / OBD',
            isAuto: true,
            source: 'ecu',
            stock: part.stock,
            handling: 'order'
        });
    }
    renderRepairPlan();
    updatePlanTotals();
    return true;
}
window.addDtcPartToPlan = addDtcPartToPlan;

// One line per scanned entry, e.g. "P0118 / Error 21 - Coolant Temperature Sensor: Open/short circuit..."
function buildDtcFindings() {
    if (!dtcScanState || !Array.isArray(dtcScanState.scanned)) return '';
    const lines = dtcScanState.scanned.map(s => {
        const entry = getDtcEntryById(s.id);
        if (!entry) return '';
        const codeStr = s.code || (entry.codes && entry.codes[0]) || '';
        const errors = (entry.errorNumbers || []).join(', ');
        const prefix = codeStr && errors ? `${codeStr} / ${errors}` : (codeStr || errors);
        return `${prefix ? prefix + ' - ' : ''}${entry.component}: ${entry.description}`;
    }).filter(Boolean);
    if (!lines.length) return '';
    return ['— ECU/OBD SCAN —', ...lines, '— END ECU/OBD —'].join('\n');
}
window.buildDtcFindings = buildDtcFindings;

function applyDtcFindings(textarea) {
    const block = buildDtcFindings();
    const existing = /— ECU\/OBD SCAN —[\s\S]*?— END ECU\/OBD —/;
    const all = textarea ? [textarea] : document.querySelectorAll('#final-findings');
    all.forEach(ta => {
        if (existing.test(ta.value)) {
            ta.value = block ? ta.value.replace(existing, block).replace(/\n{3,}/g, '\n\n').trim() : ta.value.replace(existing, '').replace(/\n{3,}/g, '\n\n').trim();
        } else if (block) {
            ta.value = ta.value.trim() ? `${ta.value.trim()}\n\n${block}` : block;
        }
        ta.style.height = 'auto';
        ta.style.height = `${Math.max(96, ta.scrollHeight)}px`;
    });
}
window.applyDtcFindings = applyDtcFindings;

function refreshDtcPlanButtons() {
    const list = document.getElementById('dtc-results-list');
    if (!list) return;
    list.querySelectorAll('[data-entry-id]').forEach(card => {
        card.querySelectorAll('button[data-part], button.is-added').forEach(btn => {
            const partId = btn.dataset.part;
            if (!partId) return;
            const part = mockInventory.find(p => p.id === partId);
            if (!part) return;
            const isAdded = (repairPlanParts || []).some(p => p.id === partId && !p.obsolete);
            if (isAdded) {
                btn.classList.add('is-added');
                btn.className = "is-added w-full sm:w-auto min-h-[44px] px-3.5 py-2.5 rounded-lg text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center justify-center gap-1.5 cursor-default";
                btn.innerHTML = '<i class="ph-bold ph-check"></i> Added to plan';
            } else {
                btn.classList.remove('is-added');
                if (part.stock === 0) {
                    btn.className = "w-full sm:w-auto min-h-[44px] px-3.5 py-2.5 rounded-lg text-xs font-bold bg-amber-50 text-amber-700 border border-amber-300 hover:bg-amber-100 transition-colors flex items-center justify-center gap-1.5 active:scale-[0.98]";
                    btn.innerHTML = '<i class="ph-bold ph-plus"></i> Add (out of stock)';
                } else {
                    btn.className = "w-full sm:w-auto min-h-[44px] px-3.5 py-2.5 rounded-lg text-xs font-bold bg-blue-600 text-white hover:bg-blue-700 shadow-sm transition-colors flex items-center justify-center gap-1.5 active:scale-[0.98]";
                    btn.innerHTML = '<i class="ph-bold ph-plus"></i> Add to parts plan';
                }
            }
        });
    });
}
window.refreshDtcPlanButtons = refreshDtcPlanButtons;

function clearDtcScanResults() {
    dtcScanState.scanned = [];
    dtcScanState.addedParts = [];
    const list = document.getElementById('dtc-results-list');
    if (list) list.innerHTML = '';
    const container = document.getElementById('dtc-results-container');
    if (container) container.classList.add('hidden');
    const msg = document.getElementById('dtc-lookup-message');
    if (msg) msg.classList.add('hidden');
    const input = document.getElementById('dtc-lookup-input');
    if (input) input.value = '';
    const step3EcuCard = document.getElementById('step3-ecu-card');
    if (step3EcuCard) step3EcuCard.classList.add('hidden');
    const step3EcuResults = document.getElementById('step3-ecu-results');
    if (step3EcuResults) step3EcuResults.innerHTML = '';
    if (typeof renderReports === 'function' && typeof currentReportRange !== 'undefined') {
        renderReports(currentReportRange);
    }
}
window.clearDtcScanResults = clearDtcScanResults;

function updateDtcReferenceUi() {
    const currentVehicle = inspectionState && inspectionState.vehicle;
    const ref = typeof getDtcReference === 'function' ? getDtcReference(currentVehicle) : (DTC_REFERENCE && DTC_REFERENCE.yamaha_sniper);
    const noRefMsg = document.getElementById('dtc-no-ref-message');
    const resultsContainer = document.getElementById('dtc-results-container');
    const subtitle = document.getElementById('dtc-ref-subtitle');

    if (!ref) {
        if (noRefMsg) noRefMsg.classList.remove('hidden');
        if (resultsContainer) resultsContainer.classList.add('hidden');
        if (subtitle) subtitle.textContent = 'Reference: None available for this motorcycle';
    } else {
        if (noRefMsg) noRefMsg.classList.add('hidden');
        if (subtitle) subtitle.textContent = `Reference: ${ref.label || 'Yamaha Sniper 150 V2'}`;
        if (resultsContainer && typeof dtcScanState !== 'undefined' && dtcScanState.scanned && dtcScanState.scanned.length > 0) {
            resultsContainer.classList.remove('hidden');
        }
    }
}
window.updateDtcReferenceUi = updateDtcReferenceUi;

function executeDtcLookup() {
    const inputEl = document.getElementById('dtc-lookup-input');
    if (!inputEl) return;
    const query = inputEl.value.trim();
    const msgEl = document.getElementById('dtc-lookup-message');
    const dtcResultsContainer = document.getElementById('dtc-results-container');
    const dtcNoRefMsg = document.getElementById('dtc-no-ref-message');

    if (!query) {
        if (msgEl) msgEl.classList.add('hidden');
        return;
    }

    const currentVehicle = inspectionState && inspectionState.vehicle;
    const ref = typeof getDtcReference === 'function' ? getDtcReference(currentVehicle) : (DTC_REFERENCE && DTC_REFERENCE.yamaha_sniper);

    if (!ref) {
        if (msgEl) {
            msgEl.textContent = 'No DTC reference loaded for this motorcycle.';
            msgEl.classList.remove('hidden');
        }
        if (dtcNoRefMsg) dtcNoRefMsg.classList.remove('hidden');
        return;
    }

    const entry = typeof findDtcEntry === 'function' ? findDtcEntry(query) : null;
    if (!entry) {
        if (msgEl) {
            msgEl.textContent = 'Code not found in the Yamaha Sniper 150 V2 reference.';
            msgEl.classList.remove('hidden');
        }
    } else {
        if (msgEl) msgEl.classList.add('hidden');
        inputEl.value = '';
        addDtcResultEntry(entry, query);
        if (dtcResultsContainer) {
            dtcResultsContainer.classList.remove('hidden');
        }
        if (typeof renderInspectionOverview === 'function') renderInspectionOverview();
    }
}
window.executeDtcLookup = executeDtcLookup;

document.addEventListener('keydown', function(e) {
    if (e.target && e.target.id === 'dtc-lookup-input' && (e.key === 'Enter' || e.keyCode === 13)) {
        e.preventDefault();
        executeDtcLookup();
    }
});

document.addEventListener('click', function(e) {
    if (e.target && (e.target.id === 'btn-dtc-lookup' || e.target.closest('#btn-dtc-lookup'))) {
        e.preventDefault();
        executeDtcLookup();
    }
});

document.addEventListener('input', function(e) {
    if (e.target && e.target.id === 'dtc-lookup-input') {
        const msgEl = document.getElementById('dtc-lookup-message');
        if (msgEl && !e.target.value.trim()) {
            msgEl.classList.add('hidden');
        }
    }
});

function renderInspectionOverview() {
    const overview = document.getElementById('inspection-overview');
    if (!overview) return;
    overview.innerHTML = '';

    // 1. Customer complaints
    const complaints = (inspectionState && inspectionState.intake && Array.isArray(inspectionState.intake.complaints))
        ? inspectionState.intake.complaints
        : [];
    let complaintsHtml = '<span class="text-xs text-slate-400 italic">None selected</span>';
    if (complaints.length > 0) {
        complaintsHtml = `<div class="flex flex-wrap gap-1.5">${complaints.map(c => 
            `<span class="inline-flex items-center gap-1 bg-slate-100 text-slate-700 px-2.5 py-1 rounded-full text-xs font-semibold border border-slate-200"><i class="ph-fill ph-warning-circle text-amber-500"></i> ${escHTML(c)}</span>`
        ).join('')}</div>`;
    }

    // 2. ECU / OBD Diagnostic
    const isEcuOn = document.getElementById('toggle-ecu')?.checked;
    let ecuHtml = '';
    if (!isEcuOn) {
        ecuHtml = '<span class="text-xs text-slate-400 italic">Not selected</span>';
    } else {
        const dtcNodes = document.querySelectorAll('#dtc-results-list [data-dtc]');
        if (dtcNodes.length === 0) {
            ecuHtml = '<span class="text-xs text-slate-400 italic">No scan run yet</span>';
        } else {
            const codes = Array.from(dtcNodes).map(el => (el.getAttribute('data-dtc') || el.dataset.dtc)?.trim()).filter(Boolean);
            const count = codes.length;
            const codeBadges = codes.map(c => `<span class="px-2 py-0.5 rounded text-[11px] font-bold bg-red-100 text-red-700 border border-red-200">${escHTML(c)}</span>`).join('');
            ecuHtml = `<div class="flex flex-wrap items-center gap-2 text-xs font-semibold text-slate-700"><span>${count} code${count === 1 ? '' : 's'} found</span>${codeBadges ? `<div class="flex flex-wrap gap-1">${codeBadges}</div>` : ''}</div>`;
        }
    }

    // 3. Physical inspection
    const isPhysicalOn = document.getElementById('toggle-physical')?.checked;
    let physHtml = '';
    if (!isPhysicalOn) {
        physHtml = '<span class="text-xs text-slate-400 italic">Not selected</span>';
    } else {
        let okCount = 0, watchCount = 0, fixCount = 0;
        if (typeof inspectionItems !== 'undefined' && typeof getInspItem === 'function') {
            inspectionItems.forEach(item => {
                const s = getInspItem(item.id)?.status;
                if (s === 'ok') okCount++;
                else if (s === 'watch') watchCount++;
                else if (s === 'fix') fixCount++;
            });
        }
        physHtml = `<div class="flex items-center gap-2 text-xs font-bold">
            <span class="px-2 py-0.5 rounded bg-emerald-100 text-emerald-700 border border-emerald-200">OK: ${okCount}</span>
            <span class="px-2 py-0.5 rounded bg-amber-100 text-amber-700 border border-amber-200">Watch: ${watchCount}</span>
            <span class="px-2 py-0.5 rounded bg-red-100 text-red-700 border border-red-200">Fix: ${fixCount}</span>
        </div>`;
    }

    overview.innerHTML = `
        <div class="flex flex-col divide-y divide-slate-100 text-xs">
            <div class="py-2.5 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <span class="font-bold text-slate-600 uppercase tracking-wider shrink-0">Customer Complaints</span>
                <div class="sm:text-right">${complaintsHtml}</div>
            </div>
            <div class="py-2.5 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <span class="font-bold text-slate-600 uppercase tracking-wider shrink-0">ECU / OBD Diagnostic</span>
                <div class="sm:text-right">${ecuHtml}</div>
            </div>
            <div class="py-2.5 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <span class="font-bold text-slate-600 uppercase tracking-wider shrink-0">Physical Inspection</span>
                <div class="sm:text-right">${physHtml}</div>
            </div>
        </div>
    `;

    if (typeof lucide !== 'undefined' && lucide.createIcons) {
        lucide.createIcons();
    }
}
window.renderInspectionOverview = renderInspectionOverview;

function partsForDtc(code) {
    const c = String(code || '').toUpperCase().trim();
    const out = [];
    const entry = typeof findDtcEntry === 'function' ? findDtcEntry(c) : null;
    const ref = (typeof DTC_REFERENCE !== 'undefined' && DTC_REFERENCE.yamaha_sniper) ? DTC_REFERENCE.yamaha_sniper : null;
    if (entry && Array.isArray(entry.parts) && ref && ref.partMap) {
        entry.parts.forEach(partName => {
            const partId = ref.partMap[partName];
            if (partId) {
                out.push({ id: partId, qty: 1 });
            }
        });
        if (out.length > 0) return out;
    }
    if (c === 'P0117' || c === 'P0118' || c === 'P0119' || c === 'P0115') {
        out.push({ id: 'SNP-009', qty: 1 });                       // coolant temp sensor circuit
    } else if (c === 'P0560' || c === 'P0562' || c === 'P0563') {
        out.push({ id: '170010', qty: 1 });                      // system voltage -> battery
    }
    return out;
}

window.getSuggestedParts = function(diagnosis = inspectionState) {
    const list = [];
    const add = (id, target, category, level, qty) => {
        const part = mockInventory.find(p => p.id === id);
        if (!part) return;
        const q = Math.max(1, qty || 1);
        let s = list.find(x => x.id === id && x.target === target);
        if (!s) {
            s = { id, qty: q, target, category, level, checked: level !== 'watch' };
            list.push(s);
        } else {
            s.qty = Math.max(s.qty, q);
        }
    };

    // 1. ECU / OBD codes
    const dtcVisible = document.getElementById('toggle-ecu')?.checked !== false && !document.getElementById('ecu-scan-card')?.classList.contains('hidden');
    if (dtcVisible) {
        document.querySelectorAll('#dtc-results-container [data-dtc]').forEach(tr => {
            const cells = tr.querySelectorAll('td');
            const code = (tr.dataset.dtc || cells[0]?.textContent)?.trim();
            if (!code) return;
            
            // from linkedDTCs in mockInventory
            mockInventory.forEach(p => {
                if (p.linkedDTCs && p.linkedDTCs.includes(code)) {
                    add(p.id, `DTC ${code}`, 'ECU / OBD', 'fix', 1);
                }
            });
            // from partsForDtc
            if (typeof partsForDtc === 'function') {
                const found = partsForDtc(code);
                found.forEach(f => add(f.id, `DTC ${code}`, 'ECU / OBD', 'fix', f.qty));
            }
        });
    }

    // 2. Physical inspection items mapped via Auto-Assign
    if (typeof inspectionSections !== 'undefined' && typeof getInspItem === 'function') {
        inspectionSections.forEach(sec => {
            sec.items.forEach(item => {
                const st = getInspItem(item.id);
                if (st.status === 'fix' || st.status === 'watch') {
                    const linkedParts = mockInventory.filter(p => p.linkedInspectionItems && p.linkedInspectionItems.some(l => l.itemId === item.id));
                    linkedParts.forEach(p => {
                        const link = p.linkedInspectionItems.find(l => l.itemId === item.id);
                        add(p.id, item.label, sec.title, st.status, link.qty);
                    });
                }
            });
        });
    }

    return list;
};

window.removedAutoSuggestions = window.removedAutoSuggestions || new Set();

window.syncPlanFromDiagnosis = function(firstTime = false, restoreRemoved = false) {
    if (firstTime && planReviewed) return; // Only auto-assign once if first time
    
    if (restoreRemoved) {
        window.removedAutoSuggestions.clear();
    }
    
    const complaintsContainer = document.getElementById('step2-complaints-container');
    if (complaintsContainer) {
        if (inspectionState.intake.complaints && inspectionState.intake.complaints.length > 0) {
            complaintsContainer.innerHTML = inspectionState.intake.complaints.map(c => 
                `<span class="inline-flex items-center gap-1 bg-slate-100 text-slate-600 px-2.5 py-1 rounded-full text-xs font-semibold border border-slate-200"><i class="ph-fill ph-warning-circle text-amber-500"></i> ${escHTML(c)}</span>`
            ).join('');
            complaintsContainer.parentElement?.classList.remove('hidden');
        } else {
            complaintsContainer.parentElement?.classList.add('hidden');
        }
    }

    const suggestions = window.getSuggestedParts();
    
    // 1. Identify unlinked fixes
    const unlinkedFixes = [];
    if (typeof inspectionSections !== 'undefined' && typeof getInspItem === 'function') {
        inspectionSections.forEach(sec => {
            sec.items.forEach(item => {
                const st = getInspItem(item.id);
                if (st.status === 'fix') {
                    const hasLink = mockInventory.some(p => p.linkedInspectionItems && p.linkedInspectionItems.some(l => l.itemId === item.id));
                    if (!hasLink) unlinkedFixes.push(item.label);
                }
            });
        });
    }
    window.unlinkedFixesList = unlinkedFixes;
    
    // 2. Add suggestions
    suggestions.forEach(r => {
        if (r.level === 'fix' || r.level === 'ecu' || r.level === 'watch') {
            const part = mockInventory.find(p => p.id === r.id);
            if (part && r.checked) {
                let target = r.target || 'Other / General';
                let category = r.category || 'Other / General';
                
                if (window.removedAutoSuggestions.has(part.id + '|' + target)) return; // Skipped intentionally removed
                
                const existing = repairPlanParts.find(p => p.id === r.id && p.target === target);
                if (!existing) {
                    repairPlanParts.push({
                        id: part.id,
                        part: part,
                        qty: r.qty,
                        target: target,
                        category: category,
                        isAuto: true,
                        stock: part.stock
                    });
                } else {
                    existing.obsolete = false;
                }
            }
        }
    });

    // 2b. Include parts from scanned DTC entries that the user added
    if (typeof dtcScanState !== 'undefined' && Array.isArray(dtcScanState.addedParts)) {
        dtcScanState.addedParts.forEach(a => {
            const entry = getDtcEntryById(a.entryId);
            const part = mockInventory.find(p => p.id === a.partId);
            if (!part || !entry) return;
            const isScanned = dtcScanState.scanned.some(s => s.id === a.entryId);
            if (!isScanned) return;

            const target = getDtcPlanTarget(entry);
            if (window.removedAutoSuggestions.has(part.id + '|' + target)) return;

            const existing = repairPlanParts.find(p => p.id === a.partId && p.target === target);
            if (!existing) {
                repairPlanParts.push({
                    id: part.id,
                    part: part,
                    qty: 1,
                    target: target,
                    category: 'ECU / OBD',
                    isAuto: true,
                    source: 'ecu',
                    stock: part.stock,
                    handling: 'order'
                });
            } else {
                existing.obsolete = false;
                if (!existing.handling) existing.handling = 'order';
            }
        });
    }
    
    // 3. Mark obsolete auto-assigned parts (No longer needed)
    repairPlanParts.forEach(p => {
        if (p.isAuto) {
            if (p.source === 'ecu' || (p.target && p.target.startsWith('ECU/OBD'))) {
                const stillScanned = dtcScanState && dtcScanState.scanned && dtcScanState.scanned.some(s => s.id === (dtcScanState.addedParts.find(a => a.partId === p.id)?.entryId));
                const userAdded = dtcScanState && dtcScanState.addedParts && dtcScanState.addedParts.some(a => a.partId === p.id);
                p.obsolete = !(stillScanned && userAdded);
            } else {
                const stillNeeded = suggestions.some(s => s.id === p.id && s.target === p.target && s.checked);
                p.obsolete = !stillNeeded;
            }
        }
    });
    
    planReviewed = true;
    renderRepairPlan();
    updatePlanTotals();
}

// Ensure function syncPlanFromDiagnosis delegates to window.syncPlanFromDiagnosis
function syncPlanFromDiagnosis(firstTime, restoreRemoved) {
    window.syncPlanFromDiagnosis(firstTime, restoreRemoved);
}

function getSuggestedParts(diag) {
    return window.getSuggestedParts(diag);
}

function updateDiagStepper() {
    const steps = document.querySelectorAll('#diag-stepper .diag-step');
    if (!steps.length) return;
    
    steps.forEach((el, i) => {
        const stepNum = i + 1;
        const isDone = stepNum < currentDiagStep;
        const isActive = stepNum === currentDiagStep;
        
        el.classList.toggle('is-done', isDone);
        el.classList.toggle('is-active', isActive);
        
        const dot = el.querySelector('.diag-step-dot');
        if (dot) dot.innerHTML = isDone ? '<i class="ph-bold ph-check"></i>' : stepNum;
        
        if (isDone) {
            el.classList.add('cursor-pointer', 'hover:text-blue-600');
            el.classList.remove('opacity-50', 'cursor-not-allowed');
            el.setAttribute('onclick', `switchDiagStep(${stepNum}, true)`);
        } else if (isActive) {
            el.classList.remove('cursor-pointer', 'hover:text-blue-600', 'opacity-50', 'cursor-not-allowed');
            el.removeAttribute('onclick');
        } else {
            el.classList.add('opacity-50', 'cursor-not-allowed');
            el.classList.remove('cursor-pointer', 'hover:text-blue-600');
            el.removeAttribute('onclick');
        }
    });
}

function updateStep3Summaries() {
    const v = inspectionState.vehicle;
    const c = inspectionState.customer;
    
    const motoSum = document.getElementById('step3-motorcycle-summary');
    if (motoSum) {
        if (v && v.mode === 'identified') {
            const brand = getBrandLabel(v) || 'Not provided';
            const model = v.model || 'Not provided';
            const plate = v.plate || 'Not provided';
            motoSum.innerHTML = `<span class="block"><span class="text-slate-400">Brand:</span> ${escHTML(brand)}</span>
                                 <span class="block mt-1"><span class="text-slate-400">Model:</span> ${escHTML(model)}</span>
                                 <span class="block mt-1"><span class="text-slate-400">Plate:</span> ${escHTML(plate)}</span>`;
        } else {
            motoSum.innerHTML = `<span class="italic">Unidentified / Walk-in</span>`;
        }
    }
    
    const custSum = document.getElementById('step3-customer-summary');
    if (custSum) {
        if (c && c.mode === 'registered') {
            const name = c.name || 'Not provided';
            const phone = c.phone || 'Not provided';
            const email = c.email || 'Not provided';
            custSum.innerHTML = `<span class="block"><span class="text-slate-400">Name:</span> ${escHTML(name)}</span>
                                 <span class="block mt-1"><span class="text-slate-400">Phone:</span> ${escHTML(phone)}</span>
                                 <span class="block mt-1"><span class="text-slate-400">Email:</span> ${escHTML(email)}</span>`;
        } else {
            custSum.innerHTML = `<span class="font-bold text-slate-800">Walk-in Customer</span>`;
        }
    }
}
window.updateStep3Summaries = updateStep3Summaries;

function renderStep3Summary() {
    const setText = (id, html) => { const el = document.getElementById(id); if (el) el.innerHTML = html; };
    
    restoreCustomerCard();
    updateStep3Summaries();

    // Job Status Badge
    let isWaitingForParts = false;
    let partsTotal = 0;
    
    // Calculate total and determine if waiting for parts
    const partsHtml = repairPlanParts.filter(p => !p.obsolete).map(p => {
        const partObj = p.part || (typeof mockInventory !== 'undefined' ? mockInventory.find(m => m.id === p.id) : null) || {};
        const partName = partObj.name || p.name || p.id || 'Part';
        const price = Number(partObj.price !== undefined ? partObj.price : (p.price || 0));
        const qty = Number(p.qty || 1);
        partsTotal += price * qty;
        const outOfStock = ((p.stock === 0 || p.stock < qty) && p.handling === 'order');
        if (outOfStock) isWaitingForParts = true;
        
        return `<li class="flex justify-between py-2 items-start gap-3">
            <div class="flex flex-col min-w-0">
                <span class="text-sm text-slate-800 font-semibold truncate">${qty} × ${escHTML(partName)}</span>
                ${outOfStock ? `<span class="text-[10px] text-amber-600 bg-amber-50 px-2 py-0.5 rounded border border-amber-200 w-max mt-1 font-bold uppercase">Out of Stock</span>` : ''}
            </div>
            <span class="text-sm font-bold text-slate-700 mt-0.5 shrink-0">${fmtPeso(price * qty)}</span>
        </li>`;
    }).join('') || '<li class="text-sm text-slate-500 py-2 italic">No parts added</li>';

    setText('step3-parts-list', partsHtml);
    
    // Status Badge
    const badgeEl = document.getElementById('step3-job-status');
    if (badgeEl) {
        if (isWaitingForParts) {
            badgeEl.className = 'px-3 py-1.5 rounded-full text-[11px] font-bold shadow-sm bg-amber-100 text-amber-700 border border-amber-200 inline-flex items-center gap-1.5';
            badgeEl.innerHTML = '<i class="ph-fill ph-warning-circle text-base"></i> Waiting for Parts';
        } else {
            badgeEl.className = 'px-3 py-1.5 rounded-full text-[11px] font-bold shadow-sm bg-emerald-100 text-emerald-700 border border-emerald-200 inline-flex items-center gap-1.5';
            badgeEl.innerHTML = '<i class="ph-fill ph-check-circle text-base"></i> Ready';
        }
    }

    // Customer Complaints
    const complaints = inspectionState.intake.complaints;
    setText('step3-complaints-list', complaints.length 
        ? complaints.map(c => `<span class="px-2 py-1 rounded bg-blue-50 text-blue-700 text-xs font-bold border border-blue-200">${escHTML(c)}</span>`).join('') 
        : '<span class="text-xs text-slate-400 italic">None recorded</span>'
    );

    // Inspection Results
    const flaggedItems = inspectionItems.filter(i => {
        const status = getInspItem(i.id).status;
        return status === 'fix' || status === 'watch';
    });
    setText('step3-inspection-results', flaggedItems.length
        ? flaggedItems.map(i => {
            const st = getInspItem(i.id);
            const isFix = st.status === 'fix';
            return `<li class="flex items-start gap-2 text-sm bg-slate-50 p-2 rounded-lg border border-slate-100">
                <i class="ph-fill ${isFix ? 'ph-wrench text-red-500' : 'ph-warning text-amber-500'} mt-0.5 shrink-0"></i>
                <div>
                    <span class="font-semibold text-slate-800 block">${i.label}</span>
                    ${st.note ? `<span class="text-xs text-slate-500 italic block mt-0.5">"${escHTML(st.note)}"</span>` : ''}
                </div>
            </li>`;
        }).join('')
        : '<li class="text-xs text-slate-400 italic py-1">No issues flagged.</li>'
    );

    // ECU/OBD Results
    const ecuCard = document.getElementById('step3-ecu-card');
    if (ecuCard) {
        if (typeof dtcScanState !== 'undefined' && dtcScanState.scanned && dtcScanState.scanned.length > 0) {
            ecuCard.classList.remove('hidden');
            const ecuHtml = dtcScanState.scanned.map(s => {
                const entry = getDtcEntryById(s.id);
                if (!entry) return '';
                const codeBadges = (entry.codes || (s.code ? [s.code] : [])).map(c => 
                    `<span class="px-1.5 py-0.5 rounded text-[10px] font-bold bg-blue-100 text-blue-700 font-mono">${escHTML(c)}</span>`
                ).join(' ');
                const errorBadges = (entry.errorNumbers || []).map(e => 
                    `<span class="px-1.5 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-600">${escHTML(e)}</span>`
                ).join(' ');

                const entryTarget = getDtcPlanTarget(entry);
                const chosenParts = (repairPlanParts || []).filter(p => !p.obsolete && (
                    p.target === entryTarget ||
                    (dtcScanState.addedParts || []).some(a => a.entryId === entry.id && a.partId === p.id)
                ));

                const partsText = chosenParts.length > 0
                    ? chosenParts.map(p => `${escHTML(p.part ? p.part.name : p.id)} (\u00D7${p.qty})`).join(', ')
                    : '<span class="italic text-slate-400">None chosen</span>';

                return `<li class="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-sm bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                    <div class="flex flex-wrap items-center gap-1.5 min-w-0">
                        <i class="ph-bold ph-cpu text-blue-600 shrink-0"></i>
                        ${codeBadges}
                        ${errorBadges}
                        <span class="font-bold text-slate-800 ml-1 truncate">${escHTML(entry.component)}</span>
                    </div>
                    <div class="text-xs text-slate-600 sm:text-right shrink-0">
                        <span class="text-slate-400 font-medium">Parts:</span> <span class="font-semibold text-slate-700">${partsText}</span>
                    </div>
                </li>`;
            }).filter(Boolean).join('');
            setText('step3-ecu-results', ecuHtml || '<li class="text-xs text-slate-400 italic py-1">No scanned codes recorded.</li>');
        } else {
            ecuCard.classList.add('hidden');
            setText('step3-ecu-results', '');
        }
    }

    // Final Findings
    const findings = (document.getElementById('final-findings')?.value || '').trim();
    setText('step3-final-findings', findings ? escHTML(findings) : '<span class="italic text-slate-400">No notes provided.</span>');

    // Total
    const labor = parseFloat(document.getElementById('labor-cost-input')?.value) || 0;
    setText('step3-grand-total', fmtPeso(partsTotal + labor));
}

function confirmStep3Push() {
    const btn = document.getElementById('btn-confirm-push');
    const originalHTML = btn.innerHTML;
    
    btn.innerHTML = `<i class="ph-bold ph-spinner animate-spin text-lg"></i> Processing...`;
    btn.disabled = true;

    setTimeout(() => {
        btn.innerHTML = originalHTML;
        btn.disabled = false;
        
        // Hide review grid and actions, show success state
        const reviewGrid = document.querySelector('#step-3-register .grid');
        if (reviewGrid) reviewGrid.classList.add('hidden');
        
        const statusBadge = document.getElementById('step3-job-status');
        if (statusBadge) statusBadge.classList.add('hidden');
        
        const actions = document.getElementById('step3-actions');
        if (actions) {
            actions.classList.add('hidden');
            actions.classList.remove('flex');
        }

        const successState = document.getElementById('step3-success-state');
        if (successState) {
            successState.classList.remove('hidden');
            successState.classList.add('flex');
            successState.classList.add('animate-[fadeIn_0.3s_ease-out]');
        }
        
        const successDetails = document.getElementById('step3-success-details');
        if (successDetails) {
            const v = inspectionState.vehicle;
            const c = inspectionState.customer;
            
            let custLabel = 'Walk-in Customer';
            if (c && c.mode === 'registered' && c.name) {
                custLabel = c.name;
            } else if (c && c.mode === 'registered') {
                custLabel = 'Registered Customer';
            }
            
            let motoLabel = 'Walk-in';
            if (v && v.mode === 'identified') {
                const b = getBrandLabel(v);
                motoLabel = b ? (v.model ? `${b} ${v.model}` : b) : (v.brand || 'Unidentified');
            }
            
            successDetails.innerHTML = `For ${escHTML(custLabel)} &bull; ${escHTML(motoLabel)}`;
        }
        
        // Mark stepper completely done (step 3 complete)
        currentDiagStep = 4;
        if (typeof updateDiagStepper === 'function') updateDiagStepper();
        
    }, 800);
}

// Added handlers for index.html inline calls
window.toggleDiagnosticSections = function() {
    const isPhysicalOn = document.getElementById('toggle-physical')?.checked;
    const isEcuOn = document.getElementById('toggle-ecu')?.checked;
    if (document.getElementById('physical-inspection-card')) document.getElementById('physical-inspection-card').classList.toggle('hidden', !isPhysicalOn);
    if (document.getElementById('ecu-scan-card')) document.getElementById('ecu-scan-card').classList.toggle('hidden', !isEcuOn);
    if (typeof updateSectionNumbering === 'function') updateSectionNumbering();
};

window.toggleStep3RegistrationMode = function(checkbox) {
    // Dummy handler for legacy template (diagnostics_temp)
    console.log('toggleStep3RegistrationMode called', checkbox.checked);
};
window.showLoginForm = function() {
    const loginForm = document.getElementById('login-form-view');
    if (loginForm) {
        loginForm.classList.remove('hidden');
        loginForm.classList.add('flex');
    }
    
    selectLoginRole('', null);
    const emailIn = document.getElementById('login-email');
    if (emailIn) emailIn.value = '';
    const pwdIn = document.getElementById('login-password');
    if (pwdIn) pwdIn.value = '';
    const roleErrorMsg = document.getElementById('login-role-error');
    if (roleErrorMsg) roleErrorMsg.classList.add('hidden');
    if (typeof openLoginEmailList === 'function') openLoginEmailList();
};

document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
        if (typeof isLoginEmailListOpen === 'function' && isLoginEmailListOpen()) {
            e.preventDefault();
            closeLoginEmailList();
        }
    }
});

// --- Overridden Login Logic ---
window.submitLogin = function() {
    const roleInput = document.getElementById('login-selected-role');
    const roleId = roleInput ? roleInput.value : '';
    const roleErrorMsg = document.getElementById('login-role-error');
    if (roleErrorMsg) {
        roleErrorMsg.textContent = 'Please choose an account.';
        roleErrorMsg.classList.add('hidden');
    }
    
    if (!roleId || !ROLES_CONFIG[roleId]) {
        if (roleErrorMsg) roleErrorMsg.classList.remove('hidden');
        return;
    }
    
    const user = systemUsers[roleId];
    if (!user) {
        return;
    }
    
    const btn = document.getElementById('btn-login-submit');
    const originalContent = btn ? btn.innerHTML : '';
    
    if (btn) btn.innerHTML = '<i class="ph-bold ph-spinner animate-spin text-xl"></i> Authenticating...';
    
    setTimeout(() => {
        if (btn) btn.innerHTML = originalContent; 
        
        try {
            // 1. Set the role & storage
            currentRole = roleId;
            localStorage.setItem('activeRole', roleId);
            sessionStorage.setItem('currentUserRole', roleId);
            sessionStorage.setItem('roles_version', 'v4_cashier');
            
            forceOwnerMobile = false;
            sessionStorage.removeItem('forceOwnerMobile');
            localStorage.removeItem('forceOwnerMobile');
            
            // 2. Apply UI mode & 3. Build sidebar
            switchRole(roleId, true);
        } catch (err) {
            console.error('Error during post-login setup:', err);
        } finally {
            // 4. Hide the login screen overlay
            const loginScreen = document.getElementById('login-screen');
            if (loginScreen) {
                loginScreen.classList.add('hidden');
                loginScreen.classList.remove('flex');
            }
            
            // 5. Call loadView() once for the role's first screen
            const targetView = 'dashboard';
            try {
                if (typeof setActiveNavLink === 'function') setActiveNavLink(targetView);
                if (typeof loadView === 'function') loadView(targetView);
            } catch (viewErr) {
                console.error('Error loading initial view:', viewErr);
            }
        }
    }, 600);
};

window.handleLogout = function() {
    const loginScreen = document.getElementById('login-screen');
    if (loginScreen) {
        loginScreen.classList.remove('hidden');
        loginScreen.classList.add('flex');
    }
    document.body.classList.remove('mobile-app');
    try {
        if (typeof backToProfiles === 'function') backToProfiles();
    } catch (e) {
        console.error('Error during backToProfiles on logout:', e);
    }
    if (typeof showLoginForm === 'function') showLoginForm();
    sessionStorage.removeItem('currentUserRole');
    localStorage.removeItem('activeRole');
    forceOwnerMobile = false;
    sessionStorage.removeItem('forceOwnerMobile');
    localStorage.removeItem('forceOwnerMobile');
};

// --- Settings Logic ---
const SETTINGS_CARDS_CONFIG = [
    { id: 'settings-card-session',          roles: ['super_admin', 'admin', 'cashier', 'mechanic'] },
    { id: 'settings-card-shop',             roles: ['super_admin', 'admin'] },
    { id: 'settings-card-password',         roles: ['super_admin', 'admin', 'cashier', 'mechanic'] },
    { id: 'settings-card-system',           roles: ['super_admin'] },
    { id: 'settings-card-session-controls', roles: ['super_admin', 'admin', 'mechanic'] }
];
window.SETTINGS_CARDS_CONFIG = SETTINGS_CARDS_CONFIG;

const SHOP_DETAILS_STORAGE_KEY = 'motocare_shop_settings';

function getSavedShopDetails() {
    try {
        const stored = localStorage.getItem(SHOP_DETAILS_STORAGE_KEY);
        if (stored) {
            return JSON.parse(stored);
        }
    } catch (e) {
        console.error(e);
    }
    return {
        name: (typeof shopConfig !== 'undefined' && shopConfig.name) ? shopConfig.name : "MotoCare Shop",
        address: (typeof shopConfig !== 'undefined' && shopConfig.address) ? shopConfig.address : "123 Example Street, City",
        phone: (typeof shopConfig !== 'undefined' && shopConfig.phone) ? shopConfig.phone : "+1 (555) 123-4567",
        receiptHeader: "JC's Motor Shop",
        receiptFooter: "THANK YOU FOR YOUR BUSINESS!"
    };
}
window.getSavedShopDetails = getSavedShopDetails;

function applyShopDetails() {
    const details = getSavedShopDetails();
    if (typeof shopConfig !== 'undefined') {
        shopConfig.name = details.name;
        shopConfig.address = details.address;
        shopConfig.phone = details.phone;
    }

    const receiptName = document.getElementById('receipt-shop-name');
    if (receiptName) receiptName.textContent = details.receiptHeader || details.name;
    const receiptAddr = document.getElementById('receipt-shop-address');
    if (receiptAddr) receiptAddr.textContent = details.address;
    const receiptPhone = document.getElementById('receipt-shop-phone');
    if (receiptPhone) receiptPhone.textContent = details.phone ? `Tel: ${details.phone}` : '';
    const receiptFooter = document.getElementById('receipt-footer-text');
    if (receiptFooter) receiptFooter.textContent = details.receiptFooter;
}
window.applyShopDetails = applyShopDetails;

function updateSettingsCardsVisibility(roleId) {
    const activeRole = roleId || currentRole || sessionStorage.getItem('currentUserRole') || 'admin';
    SETTINGS_CARDS_CONFIG.forEach(card => {
        const el = document.getElementById(card.id);
        if (el) {
            const isAllowed = card.roles.includes(activeRole);
            el.classList.toggle('hidden', !isAllowed);
        }
    });
}
window.updateSettingsCardsVisibility = updateSettingsCardsVisibility;

function loadShopDetailsIntoForm() {
    const details = getSavedShopDetails();
    const nameIn = document.getElementById('setting-shop-name');
    const addrIn = document.getElementById('setting-shop-address');
    const phoneIn = document.getElementById('setting-shop-phone');
    const headerIn = document.getElementById('setting-receipt-header');
    const footerIn = document.getElementById('setting-receipt-footer');
    
    if (nameIn) nameIn.value = details.name || '';
    if (addrIn) addrIn.value = details.address || '';
    if (phoneIn) phoneIn.value = details.phone || '';
    if (headerIn) headerIn.value = details.receiptHeader || '';
    if (footerIn) footerIn.value = details.receiptFooter || '';
}

window.saveShopDetails = function() {
    const nameIn = document.getElementById('setting-shop-name');
    const addrIn = document.getElementById('setting-shop-address');
    const phoneIn = document.getElementById('setting-shop-phone');
    const headerIn = document.getElementById('setting-receipt-header');
    const footerIn = document.getElementById('setting-receipt-footer');
    
    const details = {
        name: (nameIn ? nameIn.value.trim() : '') || 'MotoCare Shop',
        address: (addrIn ? addrIn.value.trim() : '') || '123 Example Street, City',
        phone: (phoneIn ? phoneIn.value.trim() : '') || '+1 (555) 123-4567',
        receiptHeader: (headerIn ? headerIn.value.trim() : '') || "JC's Motor Shop",
        receiptFooter: (footerIn ? footerIn.value.trim() : '') || 'THANK YOU FOR YOUR BUSINESS!'
    };
    
    try {
        localStorage.setItem(SHOP_DETAILS_STORAGE_KEY, JSON.stringify(details));
    } catch (e) {
        console.error(e);
    }
    
    applyShopDetails();
    
    const savedMsg = document.getElementById('setting-shop-saved-msg');
    if (savedMsg) {
        savedMsg.classList.remove('hidden');
        savedMsg.classList.add('inline-flex');
        clearTimeout(window._shopSavedTimeout);
        window._shopSavedTimeout = setTimeout(() => {
            savedMsg.classList.add('hidden');
            savedMsg.classList.remove('inline-flex');
        }, 2500);
    }
};

window.triggerSyncNow = function() {
    const btn = document.getElementById('btn-sync-now');
    const msg = document.getElementById('setting-sync-msg');
    if (btn) {
        btn.disabled = true;
        const origText = btn.innerHTML;
        btn.innerHTML = '<i class="ph-bold ph-arrows-clockwise animate-spin"></i> Syncing...';
        setTimeout(() => {
            btn.innerHTML = origText;
            btn.disabled = false;
            if (msg) {
                msg.textContent = 'Last synced: just now';
            }
        }, 600);
    } else if (msg) {
        msg.textContent = 'Last synced: just now';
    }
};

window.initSettingsView = function() {
    const rawRole = currentRole || sessionStorage.getItem('currentUserRole');
    const roleId = (rawRole && ROLES_CONFIG[rawRole]) ? rawRole : 'admin';
    const user = systemUsers[roleId] || systemUsers.admin;
    
    const accName = document.getElementById('acc-name');
    const accRole = document.getElementById('acc-role');
    if (accName) accName.textContent = user.name;
    if (accRole) accRole.textContent = ROLES_CONFIG[roleId]?.label || user.role;
    
    const avatar = document.getElementById('acc-avatar');
    if (avatar) {
        avatar.textContent = user.initials;
        avatar.className = "w-14 h-14 rounded-full text-white flex items-center justify-center font-bold text-xl shadow-inner shrink-0 " + user.color;
    }
    
    const currPw = document.getElementById('acc-pwd-current');
    const newPw = document.getElementById('acc-pwd-new');
    const confPw = document.getElementById('acc-pwd-confirm');
    if (currPw) currPw.value = '';
    if (newPw) newPw.value = '';
    if (confPw) confPw.value = '';
    
    const msg = document.getElementById('acc-pwd-msg');
    if (msg) msg.classList.add('hidden');
    
    updateSettingsCardsVisibility(roleId);
    loadShopDetailsIntoForm();
};

window.changePassword = function() {
    const current = document.getElementById('acc-pwd-current').value;
    const newPwd = document.getElementById('acc-pwd-new').value;
    const confirm = document.getElementById('acc-pwd-confirm').value;
    const msg = document.getElementById('acc-pwd-msg');
    
    const rawRole = currentRole || sessionStorage.getItem('currentUserRole');
    const roleId = (rawRole && ROLES_CONFIG[rawRole]) ? rawRole : 'admin';
    const user = systemUsers[roleId] || systemUsers.admin;
    
    msg.classList.remove('hidden', 'bg-emerald-50', 'text-emerald-600', 'border-emerald-200', 'bg-red-50', 'text-red-600', 'border-red-200');
    
    const savedPwdsCheck = JSON.parse(sessionStorage.getItem('mockUserPasswords') || '{}');
    const expectedPw = savedPwdsCheck[roleId] || user.password;
    if (current !== expectedPw) {
        msg.textContent = 'Incorrect current password.';
        msg.classList.add('bg-red-50', 'text-red-600', 'border-red-200');
        return;
    }
    if (newPwd.length < 4) {
        msg.textContent = 'New password must be at least 4 characters.';
        msg.classList.add('bg-red-50', 'text-red-600', 'border-red-200');
        return;
    }
    if (newPwd !== confirm) {
        msg.textContent = 'Passwords do not match.';
        msg.classList.add('bg-red-50', 'text-red-600', 'border-red-200');
        return;
    }
    
    user.password = newPwd;
    const savedPwds = JSON.parse(sessionStorage.getItem('mockUserPasswords') || '{}');
    savedPwds[roleId] = newPwd;
    sessionStorage.setItem('mockUserPasswords', JSON.stringify(savedPwds));
    
    msg.textContent = 'Password updated successfully.';
    msg.classList.add('bg-emerald-50', 'text-emerald-600', 'border-emerald-200');
    
    document.getElementById('acc-pwd-current').value = '';
    document.getElementById('acc-pwd-new').value = '';
    document.getElementById('acc-pwd-confirm').value = '';
};



window.toggleDiagnosticSections = function() {
    const isPhysicalOn = document.getElementById('toggle-physical')?.checked;
    const isEcuOn = document.getElementById('toggle-ecu')?.checked;
    if (document.getElementById('physical-inspection-card')) document.getElementById('physical-inspection-card').classList.toggle('hidden', !isPhysicalOn);
    if (document.getElementById('ecu-scan-card')) document.getElementById('ecu-scan-card').classList.toggle('hidden', !isEcuOn);
    if (typeof updateSectionNumbering === 'function') updateSectionNumbering();
};

// --- Saved Accounts / Login Email List Logic ---
let currentFilteredAccounts = [];
let activeAccountRowIndex = -1;

const ROLE_TILES = {
    super_admin: { icon: 'ph-bold ph-user-gear', bg: 'bg-purple-100 text-purple-600' },
    admin:       { icon: 'ph-bold ph-crown',     bg: 'bg-indigo-100 text-indigo-600' },
    cashier:     { icon: 'ph-bold ph-storefront',bg: 'bg-emerald-100 text-emerald-600' },
    mechanic:    { icon: 'ph-bold ph-wrench',    bg: 'bg-orange-100 text-orange-600' }
};

function isLoginEmailListOpen() {
    const list = document.getElementById('login-email-list');
    return !!(list && !list.classList.contains('hidden'));
}
window.isLoginEmailListOpen = isLoginEmailListOpen;

function openLoginEmailList() {
    const list = document.getElementById('login-email-list');
    if (!list) return;
    const input = document.getElementById('login-email');
    const val = input ? input.value.trim() : '';
    const isExactDemo = typeof getRoleByEmail === 'function' && getRoleByEmail(val);
    renderLoginEmailList(isExactDemo ? '' : val);
    list.classList.remove('hidden');
}
window.openLoginEmailList = openLoginEmailList;

function closeLoginEmailList() {
    const list = document.getElementById('login-email-list');
    if (list) {
        list.classList.add('hidden');
    }
    activeAccountRowIndex = -1;
}
window.closeLoginEmailList = closeLoginEmailList;

function renderLoginEmailList(query) {
    const list = document.getElementById('login-email-list');
    if (!list) return;

    const trimmed = (query || '').trim().toLowerCase();
    const allAccounts = typeof getDemoAccounts === 'function' ? getDemoAccounts() : [];

    currentFilteredAccounts = trimmed
        ? allAccounts.filter(acc => acc.email.toLowerCase().includes(trimmed) || acc.label.toLowerCase().includes(trimmed))
        : allAccounts;

    activeAccountRowIndex = -1;

    let html = `<div class="px-3 pt-2.5 pb-1 text-[10px] font-bold uppercase tracking-wider text-slate-400 border-b border-slate-100">Saved accounts</div>`;

    if (currentFilteredAccounts.length === 0) {
        html += `<div class="p-3 text-center text-xs text-slate-400 font-medium min-h-[48px] flex items-center justify-center">No saved account found.</div>`;
    } else {
        html += currentFilteredAccounts.map((acc, idx) => {
            const tile = ROLE_TILES[acc.roleId] || { icon: 'ph-bold ph-user', bg: 'bg-slate-100 text-slate-600' };
            return `
                <div class="account-row min-h-[48px] px-3 py-2 flex items-center gap-3 cursor-pointer hover:bg-slate-50 transition-colors text-left" data-index="${idx}" data-role-id="${acc.roleId}" onmouseenter="activeAccountRowIndex = ${idx}; updateActiveAccountRow()" onclick="pickDemoAccountByIndex(${idx})">
                    <div class="w-7 h-7 rounded-lg ${tile.bg} flex items-center justify-center shrink-0 text-sm">
                        <i class="${tile.icon}"></i>
                    </div>
                    <div class="flex-1 min-w-0">
                        <div class="font-bold text-slate-800 text-xs sm:text-sm truncate leading-tight">${acc.email}</div>
                        <div class="text-[11px] text-slate-400 font-medium truncate mt-0.5">${acc.label}</div>
                    </div>
                </div>
            `;
        }).join('');
    }

    list.innerHTML = html;

    if (typeof lucide !== 'undefined' && lucide.createIcons) {
        lucide.createIcons();
    }
}
window.renderLoginEmailList = renderLoginEmailList;

function updateActiveAccountRow() {
    const rows = document.querySelectorAll('#login-email-list .account-row');
    rows.forEach((row, idx) => {
        if (idx === activeAccountRowIndex) {
            row.classList.add('bg-blue-50/70');
            row.classList.remove('hover:bg-slate-50');
            row.scrollIntoView({ block: 'nearest' });
        } else {
            row.classList.remove('bg-blue-50/70');
            row.classList.add('hover:bg-slate-50');
        }
    });
}

function pickDemoAccount(acc) {
    if (!acc) return;
    const emailIn = document.getElementById('login-email');
    if (emailIn) emailIn.value = acc.email;
    selectLoginRole(acc.roleId, null);
    closeLoginEmailList();
}
window.pickDemoAccount = pickDemoAccount;

window.pickDemoAccountByIndex = function(idx) {
    if (currentFilteredAccounts[idx]) {
        pickDemoAccount(currentFilteredAccounts[idx]);
    }
};

window.selectLoginRole = function(roleId, btn, skipEmailSync) {
    const pwdIn = document.getElementById('login-password'); if (pwdIn) pwdIn.value = '';
    const roleInput = document.getElementById('login-selected-role');
    if (roleInput) roleInput.value = roleId || '';
    const roleErrorMsg = document.getElementById('login-role-error');
    if (roleErrorMsg) roleErrorMsg.classList.add('hidden');
    
    if (!skipEmailSync) {
        const emailIn = document.getElementById('login-email');
        if (emailIn) {
            if (roleId && ROLES_CONFIG[roleId]?.demoEmail) {
                emailIn.value = ROLES_CONFIG[roleId].demoEmail;
            } else if (!roleId) {
                emailIn.value = '';
            }
        }
        if (typeof closeLoginEmailList === 'function') {
            closeLoginEmailList();
        }
    }
    
    const submitBtn = document.getElementById('btn-login-submit');
    if (submitBtn) {
        if (roleId) {
            submitBtn.className = 'w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3.5 rounded-xl transition-all shadow-md shadow-blue-500/30 flex items-center justify-center gap-2 cursor-pointer';
        } else {
            submitBtn.className = 'w-full bg-slate-200 text-slate-500 cursor-not-allowed font-bold py-3.5 rounded-xl transition-all flex items-center justify-center gap-2';
        }
    }
};

document.addEventListener('input', function(e) {
    if (e.target.id === 'login-email') {
        const val = e.target.value;
        const roleErrorMsg = document.getElementById('login-role-error');
        if (roleErrorMsg) roleErrorMsg.classList.add('hidden');
        const list = document.getElementById('login-email-list');
        if (list) list.classList.remove('hidden');
        renderLoginEmailList(val);

        const matchedRoleId = typeof getRoleByEmail === 'function' ? getRoleByEmail(val) : null;
        if (matchedRoleId) {
            selectLoginRole(matchedRoleId, null, true);
        } else {
            selectLoginRole('', null, true);
        }
    }
});

document.addEventListener('focusin', function(e) {
    if (e.target.id === 'login-email') {
        openLoginEmailList();
    } else {
        const container = document.getElementById('login-email-container');
        if (container && !container.contains(e.target)) {
            closeLoginEmailList();
        }
    }
});

document.addEventListener('click', function(e) {
    if (e.target.id === 'login-email') {
        openLoginEmailList();
        return;
    }
    const container = document.getElementById('login-email-container');
    if (container && !container.contains(e.target)) {
        closeLoginEmailList();
    }
});

document.addEventListener('keydown', function(e) {
    if (e.target && e.target.id === 'login-email') {
        if (e.key === 'ArrowDown') {
            e.preventDefault();
            if (!isLoginEmailListOpen()) {
                openLoginEmailList();
                activeAccountRowIndex = 0;
            } else if (currentFilteredAccounts.length > 0) {
                if (activeAccountRowIndex === -1) {
                    activeAccountRowIndex = 0;
                } else {
                    activeAccountRowIndex = (activeAccountRowIndex + 1) % currentFilteredAccounts.length;
                }
            }
            updateActiveAccountRow();
        } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            if (isLoginEmailListOpen() && currentFilteredAccounts.length > 0) {
                if (activeAccountRowIndex === -1) {
                    activeAccountRowIndex = currentFilteredAccounts.length - 1;
                } else {
                    activeAccountRowIndex = (activeAccountRowIndex - 1 + currentFilteredAccounts.length) % currentFilteredAccounts.length;
                }
                updateActiveAccountRow();
            }
        } else if (e.key === 'Enter') {
            if (isLoginEmailListOpen()) {
                e.preventDefault();
                if (activeAccountRowIndex >= 0 && activeAccountRowIndex < currentFilteredAccounts.length) {
                    pickDemoAccount(currentFilteredAccounts[activeAccountRowIndex]);
                } else if (currentFilteredAccounts.length === 1) {
                    pickDemoAccount(currentFilteredAccounts[0]);
                } else {
                    closeLoginEmailList();
                    submitLogin();
                }
            } else {
                submitLogin();
            }
        }
    }
});

systemUsers.super_admin.password = 'admin123';
systemUsers.admin.password = 'admin123';
systemUsers.cashier.password = 'cashier123';
systemUsers.mechanic.password = 'mech123';

// Initialize widgets on load
updateDashboardWidgets();


document.addEventListener('input', function(e) {
    if (e.target.id === 'restock-search-input') {
        currentRestockPartId = null;
        const btn = document.getElementById('restock-clear-btn');
        if (btn) btn.classList.add('hidden');
        const list = document.getElementById('restock-dropdown-list');
        if (list) list.classList.remove('hidden');
        renderRestockDropdown(e.target.value);
    }
});

document.addEventListener('click', function(e) {
    const restockItem = e.target.closest('.restock-item');
    if (restockItem) {
        selectRestockPart(restockItem.getAttribute('data-id'));
    }
    
    const container = e.target.closest('#restock-dropdown-container');
    if (!container) {
        const list = document.getElementById('restock-dropdown-list');
        if (list && !list.classList.contains('hidden')) {
            list.classList.add('hidden');
        }
    }
});

document.addEventListener('focusin', function(e) {
    if (e.target.id === 'restock-search-input' && !currentRestockPartId) {
        const list = document.getElementById('restock-dropdown-list');
        if (list) list.classList.remove('hidden');
        renderRestockDropdown(e.target.value);
    }
});

document.addEventListener('keydown', function(e) {
    if (e.target.id === 'restock-search-input' || e.target.closest('#restock-dropdown-list')) {
        const list = document.getElementById('restock-dropdown-list');
        if (!list || list.classList.contains('hidden')) return;
        
        const items = Array.from(list.querySelectorAll('.restock-item'));
        if (items.length === 0) return;
        
        let currentIndex = items.findIndex(item => item === document.activeElement);
        
        if (e.key === 'ArrowDown') {
            e.preventDefault();
            if (currentIndex < items.length - 1) {
                items[currentIndex + 1].focus();
            } else if (currentIndex === -1) {
                items[0].focus();
            }
        } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            if (currentIndex > 0) {
                items[currentIndex - 1].focus();
            } else if (currentIndex === 0) {
                document.getElementById('restock-search-input').focus();
            }
        } else if (e.key === 'Enter') {
            e.preventDefault();
            if (currentIndex !== -1) {
                selectRestockPart(items[currentIndex].getAttribute('data-id'));
            }
        } else if (e.key === 'Escape') {
            e.preventDefault();
            list.classList.add('hidden');
            document.getElementById('restock-search-input').focus();
        }
    }
});

// --- Reusable Mobile Card Accordion Helper & Listeners ---
function toggleMCard(headEl) {
    if (!headEl) return;
    const card = headEl.closest('.m-card');
    if (!card) return;

    const head = card.querySelector('.m-card-head') || headEl;
    const list = card.closest('.m-cards, .m-card-list') || card.parentElement;
    const isCurrentlyOpen = card.classList.contains('open');

    // Close other open cards in the same container/list
    if (list) {
        const siblingCards = list.querySelectorAll('.m-card.open');
        siblingCards.forEach(sibling => {
            if (sibling !== card) {
                sibling.classList.remove('open');
                const sibHead = sibling.querySelector('.m-card-head');
                if (sibHead) {
                    sibHead.setAttribute('aria-expanded', 'false');
                }
            }
        });
    }

    // Toggle current card
    if (isCurrentlyOpen) {
        card.classList.remove('open');
        if (head && head.setAttribute) {
            head.setAttribute('aria-expanded', 'false');
        }
        if (card.hasAttribute('data-txn-id') && typeof openedTxnCardId !== 'undefined' && openedTxnCardId === card.getAttribute('data-txn-id')) {
            openedTxnCardId = null;
        }
    } else {
        card.classList.add('open');
        if (head && head.setAttribute) {
            head.setAttribute('aria-expanded', 'true');
        }
        if (card.hasAttribute('data-txn-id') && typeof openedTxnCardId !== 'undefined') {
            openedTxnCardId = card.getAttribute('data-txn-id');
        }
    }
}
window.toggleMCard = toggleMCard;

// Delegated click listener for mobile cards
document.addEventListener('click', function(e) {
    const head = e.target.closest('.m-card-head');
    if (!head) return;
    if (e.target.closest('button, a, input, select, textarea, [data-prevent-toggle]')) return;
    toggleMCard(head);
});

// Delegated keyboard support (Enter or Space) for mobile cards
document.addEventListener('keydown', function(e) {
    if (e.key !== 'Enter' && e.key !== ' ' && e.key !== 'Spacebar') return;
    const head = e.target.closest('.m-card-head');
    if (!head) return;
    if (e.target.matches('button, a, input, select, textarea')) return;
    e.preventDefault();
    toggleMCard(head);
});
