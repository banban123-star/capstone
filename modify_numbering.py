import re

with open('script.js', 'r', encoding='utf-8') as f:
    text = f.read()

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

    const intakeTitle = document.getElementById('title-vehicle-intake');
    if (intakeTitle) {
        intakeTitle.textContent = ${count++}. Vehicle Intake;
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

with open('script.js', 'w', encoding='utf-8') as f:
    f.write(text)

print("Done")
