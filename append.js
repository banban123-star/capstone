const fs = require('fs');
const content = \
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
            el.setAttribute('onclick', \\\switchDiagStep(\\\, true)\\\);
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
\;
fs.appendFileSync('script.js', content, 'utf8');
