const fs = require('fs');

let js = fs.readFileSync('script.js', 'utf8');

const desktopTarget = `        let expBadgeDesktop = '';
        if (typeof getExpiryStatus === 'function') {
            const st = getExpiryStatus(item);
            if (st.status === 'expired') {
                expBadgeDesktop = \`<div class="mt-1.5 inline-flex items-center gap-1 text-[10px] font-bold text-red-600 border border-red-200 bg-red-50 px-1.5 py-0.5 rounded"><i class="ph ph-calendar"></i> Expired \${item.expiryDate}</div>\`;
            } else if (st.status === 'soon') {
                expBadgeDesktop = \`<div class="mt-1.5 inline-flex items-center gap-1 text-[10px] font-bold text-orange-600 border border-orange-200 bg-orange-50 px-1.5 py-0.5 rounded"><i class="ph ph-calendar"></i> Expires in \${st.days} days</div>\`;
            } else if (st.status === 'ok') {
                expBadgeDesktop = \`<div class="mt-1.5 inline-flex items-center gap-1 text-[10px] font-bold text-slate-500 border border-slate-200 bg-slate-50 px-1.5 py-0.5 rounded"><i class="ph ph-calendar"></i> Exp: \${item.expiryDate}</div>\`;
            }
        }`;

const desktopReplace = `        let expBadgeDesktop = '';
        if (typeof getExpiryStatus === 'function') {
            const st = getExpiryStatus(item);
            let fDate = item.expiryDate;
            if (item.expiryDate) {
                const [y, m, d] = item.expiryDate.split('-');
                const dt = new Date(y, m - 1, d);
                fDate = dt.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
            }
            if (st.status === 'expired') {
                expBadgeDesktop = \`<div class="mt-1.5 inline-flex items-center gap-1 text-[10px] font-bold text-red-600 border border-red-200 bg-red-50 px-1.5 py-0.5 rounded"><i class="ph ph-calendar"></i> Expired \${fDate}</div>\`;
            } else if (st.status === 'soon') {
                expBadgeDesktop = \`<div class="mt-1.5 inline-flex items-center gap-1 text-[10px] font-bold text-orange-600 border border-orange-200 bg-orange-50 px-1.5 py-0.5 rounded"><i class="ph ph-calendar"></i> Expires in \${st.days} days</div>\`;
            } else if (st.status === 'ok') {
                expBadgeDesktop = \`<div class="mt-1.5 inline-flex items-center gap-1 text-[10px] font-bold text-slate-500 border border-slate-200 bg-slate-50 px-1.5 py-0.5 rounded"><i class="ph ph-calendar"></i> Exp: \${fDate}</div>\`;
            }
        }`;

const mobileTarget = `            let expDot = '';
            let expRow = '';
            if (typeof getExpiryStatus === 'function') {
                const st = getExpiryStatus(item);
                if (st.status === 'expired') {
                    expDot = '<span class="w-2 h-2 rounded-full bg-red-500 inline-block ml-2 mb-0.5 shadow-sm border border-red-200"></span>';
                    expRow = \`<div class="flex justify-between items-center"><span class="font-bold">Expires</span><span class="text-red-600 font-bold flex items-center gap-1"><i class="ph ph-calendar"></i> \${item.expiryDate}</span></div>\`;
                } else if (st.status === 'soon') {
                    expDot = '<span class="w-2 h-2 rounded-full bg-orange-500 inline-block ml-2 mb-0.5 shadow-sm border border-orange-200"></span>';
                    expRow = \`<div class="flex justify-between items-center"><span class="font-bold">Expires</span><span class="text-orange-600 font-bold flex items-center gap-1"><i class="ph ph-calendar"></i> In \${st.days} days</span></div>\`;
                } else if (st.status === 'ok') {
                    expRow = \`<div class="flex justify-between items-center"><span class="font-bold">Expires</span><span class="text-slate-500 font-medium flex items-center gap-1"><i class="ph ph-calendar"></i> \${item.expiryDate}</span></div>\`;
                }
            }`;

const mobileReplace = `            let expDot = '';
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
                    expRow = \`<div class="flex justify-between items-center"><span class="font-bold">Expires</span><span class="text-red-600 font-bold flex items-center gap-1"><i class="ph ph-calendar"></i> \${fDate}</span></div>\`;
                } else if (st.status === 'soon') {
                    expDot = '<span class="w-2 h-2 rounded-full bg-orange-500 inline-block ml-2 mb-0.5 shadow-sm border border-orange-200"></span>';
                    expRow = \`<div class="flex justify-between items-center"><span class="font-bold">Expires</span><span class="text-orange-600 font-bold flex items-center gap-1"><i class="ph ph-calendar"></i> In \${st.days} days</span></div>\`;
                } else if (st.status === 'ok') {
                    expRow = \`<div class="flex justify-between items-center"><span class="font-bold">Expires</span><span class="text-slate-500 font-medium flex items-center gap-1"><i class="ph ph-calendar"></i> \${fDate}</span></div>\`;
                }
            }`;

js = js.replace(desktopTarget.replace(/\r\n/g, '\n'), desktopReplace);
js = js.replace(mobileTarget.replace(/\r\n/g, '\n'), mobileReplace);

fs.writeFileSync('script.js', js, 'utf8');
console.log('Patched script.js date formatting');

