import re

with open(r'views\repairs.html', 'r', encoding='utf-8') as f:
    content = f.read()

paid_chip = '\n            <button class="repair-filter-btn px-4 py-1.5 rounded-full text-xs font-semibold shadow-sm whitespace-nowrap transition-colors bg-slate-50 text-slate-600 border border-slate-200 hover:bg-slate-100" data-filter="paid" data-default="bg-slate-50 text-slate-600 border border-slate-200 hover:bg-slate-100">Paid</button>'

content = content.replace(
    '<button class="repair-filter-btn px-4 py-1.5 rounded-full text-xs font-semibold shadow-sm whitespace-nowrap transition-colors bg-emerald-50 text-emerald-600 border border-emerald-200 hover:bg-emerald-100" data-filter="ready" data-default="bg-emerald-50 text-emerald-600 border border-emerald-200 hover:bg-emerald-100">Ready for Billing</button>',
    '<button class="repair-filter-btn px-4 py-1.5 rounded-full text-xs font-semibold shadow-sm whitespace-nowrap transition-colors bg-emerald-50 text-emerald-600 border border-emerald-200 hover:bg-emerald-100" data-filter="ready" data-default="bg-emerald-50 text-emerald-600 border border-emerald-200 hover:bg-emerald-100">Ready for Billing</button>' + paid_chip
)

# Also wrap the main content in a container if not already, to toggle it easily
if 'id="repairs-list-container"' not in content:
    # Find the top action bar
    top_bar = '<div class="bg-white p-4 rounded-xl shadow-sm border border-slate-200 mb-6 flex flex-col gap-4">'
    grid = '<!-- JS will inject dynamic repair cards here -->\n    </div>'
    
    # Actually just add the payment screen container before the repair modal
    payment_screen = """
    <!-- Payment Screen (Inline) -->
    <div id="payment-screen-container" class="hidden max-w-3xl mx-auto bg-white p-6 rounded-xl shadow-sm border border-slate-200">
        <button onclick="closePaymentScreen()" class="mb-4 text-sm font-semibold text-slate-500 hover:text-slate-800 flex items-center gap-1"><i class="ph-bold ph-arrow-left"></i> Back to Active Repairs</button>
        
        <div id="payment-success-state" class="hidden text-center py-10">
            <div class="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <i class="ph-bold ph-check text-3xl"></i>
            </div>
            <h2 class="text-2xl font-bold text-slate-800 mb-2">Payment Complete!</h2>
            <p id="payment-success-summary" class="text-slate-500 mb-6"></p>
            <div class="flex justify-center gap-3">
                <button class="px-4 py-2 bg-slate-800 text-white rounded font-semibold text-sm hover:bg-slate-900"><i class="ph-bold ph-printer"></i> Print Receipt</button>
                <button onclick="closePaymentScreen()" class="px-4 py-2 border border-slate-300 text-slate-700 rounded font-semibold text-sm hover:bg-slate-50">Back to Active Repairs</button>
            </div>
        </div>

        <div id="payment-form-state">
            <h2 class="text-xl font-bold text-slate-800 mb-1">Process Payment</h2>
            <p id="payment-job-summary" class="text-sm text-slate-500 mb-6"></p>

            <div class="border border-slate-200 rounded-lg overflow-hidden mb-6">
                <div class="bg-slate-50 p-3 border-b border-slate-200 font-semibold text-sm text-slate-700">Itemized Bill</div>
                <div id="payment-items" class="p-3 flex flex-col gap-2"></div>
                <div class="bg-slate-50 p-3 flex justify-between font-bold text-slate-800 border-t border-slate-200">
                    <span>Grand Total</span>
                    <span id="payment-grand-total"></span>
                </div>
            </div>

            <div class="mb-6">
                <label class="block text-sm font-bold text-slate-700 mb-2">Payment Method</label>
                <div class="flex gap-2">
                    <button class="pay-method-btn flex-1 py-2 border border-blue-500 bg-blue-50 text-blue-700 rounded font-semibold text-sm" data-method="Cash">Cash</button>
                    <button class="pay-method-btn flex-1 py-2 border border-slate-200 bg-white text-slate-600 rounded font-semibold text-sm hover:bg-slate-50" data-method="GCash">GCash</button>
                    <button class="pay-method-btn flex-1 py-2 border border-slate-200 bg-white text-slate-600 rounded font-semibold text-sm hover:bg-slate-50" data-method="Card">Card</button>
                </div>
            </div>

            <div id="cash-payment-section" class="mb-6 flex gap-4">
                <div class="flex-1">
                    <label class="block text-sm font-bold text-slate-700 mb-1">Amount Received (₱)</label>
                    <input type="number" id="payment-amount" class="w-full p-2 border border-slate-300 rounded focus:ring-2 focus:ring-blue-500 outline-none text-right font-mono" placeholder="0.00">
                </div>
                <div class="flex-1">
                    <label class="block text-sm font-bold text-slate-700 mb-1">Change (₱)</label>
                    <div id="payment-change" class="w-full p-2 border border-slate-200 bg-slate-100 rounded text-right font-mono font-bold text-slate-800">0.00</div>
                </div>
            </div>

            <button id="btn-complete-payment" onclick="completePayment()" class="w-full bg-slate-800 text-white font-bold py-3 rounded-lg hover:bg-slate-900 disabled:opacity-50 disabled:cursor-not-allowed">Complete Payment</button>
        </div>
    </div>
    """
    
    # We will wrap the existing active repairs content in a div
    content = content.replace('<!-- Top Action Bar & Quick Filters -->', '<div id="active-repairs-main">\n    <!-- Top Action Bar & Quick Filters -->')
    content = content.replace('<!-- Repair Modal (Remains exactly the same) -->', '</div>\n\n    ' + payment_screen + '\n\n    <!-- Repair Modal (Remains exactly the same) -->')

with open(r'views\repairs.html', 'w', encoding='utf-8') as f:
    f.write(content)

print("HTML updated.")

