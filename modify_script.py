import re

with open('script.js', 'r', encoding='utf-8') as f:
    text = f.read()

# 1. updateSectionNumbering
old_numbering = '''function updateSectionNumbering() {
    let count = 1;
    const setupTitle = document.getElementById('title-inspection-setup');
    if (setupTitle) setupTitle.textContent = ${count++}. Inspection Setup;

    const ecuCard = document.getElementById('ecu-scan-card');
    const ecuTitle = document.getElementById('title-ecu-scan');
    if (ecuCard && !ecuCard.classList.contains('hidden') && ecuTitle) {
        ecuTitle.textContent = ${count++}. ECU / OBD Diagnostic;
    }

    const physCard = document.getElementById('physical-inspection-card');
    const physTitle = document.getElementById('title-physical-inspection');
    if (physCard && !physCard.classList.contains('hidden') && physTitle) {
        physTitle.textContent = ${count++}. Physical Inspection Log;
    }
}'''

new_numbering = '''function updateSectionNumbering() {
    let count = 1;
    
    const complaintTitle = document.getElementById('title-customer-complaint');
    if (complaintTitle) complaintTitle.textContent = ${count++}. Customer Complaint;

    const setupTitle = document.getElementById('title-inspection-setup');
    if (setupTitle) setupTitle.textContent = ${count++}. Inspection Setup;

    const ecuCard = document.getElementById('ecu-scan-card');
    const ecuTitle = document.getElementById('title-ecu-scan');
    if (ecuCard && !ecuCard.classList.contains('hidden') && ecuTitle) {
        ecuTitle.textContent = ${count++}. ECU / OBD Diagnostic;
    }

    const physCard = document.getElementById('physical-inspection-card');
    const physTitle = document.getElementById('title-physical-inspection');
    if (physCard && !physCard.classList.contains('hidden') && physTitle) {
        physTitle.textContent = ${count++}. Physical Inspection Log;
    }
}'''
text = text.replace(old_numbering, new_numbering)


# 2. validateStep1
old_validate = '''function validateStep1() {
    const btn = document.getElementById('btn-next-step1');
    const hint = document.getElementById('hint-next-step1');
    if (!btn || !hint) return;

    const hasOdo = !!inspectionState.intake.odo;
    const hasFuel = !!inspectionState.intake.fuel;
    const hasInsp = typeof inspectionItems !== 'undefined' && inspectionItems.some(i => getInspItem(i.id).status);

    let missing = [];
    if (!hasOdo) missing.push('Odometer');
    if (!hasFuel) missing.push('Fuel level');
    if (!hasInsp) missing.push('1 inspection item');

    if (missing.length === 0) {
        btn.disabled = false;
        hint.textContent = '';
    } else {
        btn.disabled = true;
        hint.textContent = 'Please fill in: ' + missing.join(', ');
    }
}'''

new_validate = '''function validateStep1() {
    const btn = document.getElementById('btn-next-step1');
    const hint = document.getElementById('hint-next-step1');
    if (!btn || !hint) return;

    const hasInsp = typeof inspectionItems !== 'undefined' && inspectionItems.some(i => getInspItem(i.id).status);

    let missing = [];
    if (!hasInsp) missing.push('1 inspection item');

    if (missing.length === 0) {
        btn.disabled = false;
        hint.textContent = '';
    } else {
        btn.disabled = true;
        hint.textContent = 'Please check at least ' + missing.join(', ');
    }
}'''
text = text.replace(old_validate, new_validate)


# 3. restoreInspectionIntake
old_restore = '''function restoreInspectionIntake() {
    const { odo, fuel, complaints } = inspectionState.intake;
    const odoInput = document.getElementById('insp-odo');
    if (odoInput) odoInput.value = odo;
    document.querySelectorAll('[data-insp="fuel"]').forEach(btn => btn.classList.toggle('is-active', btn.dataset.fuel === fuel));
    document.querySelectorAll('[data-insp="complaint"]').forEach(btn => btn.classList.toggle('is-active', complaints.includes(btn.dataset.complaint)));
    validateStep1();
}'''

new_restore = '''function restoreInspectionIntake() {
    const { complaints } = inspectionState.intake;
    document.querySelectorAll('[data-insp="complaint"]').forEach(btn => btn.classList.toggle('is-active', complaints.includes(btn.dataset.complaint)));
    validateStep1();
}'''
text = text.replace(old_restore, new_restore)


# 4. fuel click
old_fuel = '''    } else if (action === 'fuel') {
        inspectionState.intake.fuel = inspectionState.intake.fuel === el.dataset.fuel ? '' : el.dataset.fuel;
        saveInspectionState();
        restoreInspectionIntake();

    } else if (action === 'complaint') {'''

new_fuel = '''    } else if (action === 'complaint') {'''
text = text.replace(old_fuel, new_fuel)


# 5. insp-odo input
old_odo = '''    if (target.id === 'insp-odo') {
        inspectionState.intake.odo = target.value;
        saveInspectionState();
        validateStep1();
    } else if (target.dataset && target.dataset.inspInput === 'measure') {'''

new_odo = '''    if (target.dataset && target.dataset.inspInput === 'measure') {'''
text = text.replace(old_odo, new_odo)


with open('script.js', 'w', encoding='utf-8') as f:
    f.write(text)

print("Done")
