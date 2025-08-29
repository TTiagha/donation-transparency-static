
document.addEventListener('DOMContentLoaded', () => {
    const demoWidget = document.querySelector('.demo-widget');
    if (!demoWidget) return;

    const expenses = [
        [
            { vendor: 'Office Depot', amount: 127.43, category: 'School Supplies', icon: '📚' },
            { vendor: 'Local Food Bank', amount: 500.00, category: 'Direct Aid', icon: '🥫' },
            { vendor: 'Community Center', amount: 250.00, category: 'Venue Rental', icon: '🏢' }
        ],
        [
            { vendor: 'Medical Supply Co', amount: 845.00, category: 'Medical Equipment', icon: '🏥' },
            { vendor: 'Volunteer Lunch', amount: 67.50, category: 'Team Support', icon: '🍕' },
            { vendor: 'AWS Services', amount: 12.99, category: 'Platform Hosting', icon: '☁️' }
        ],
        [
            { vendor: 'School District', amount: 1200.00, category: 'Scholarship Fund', icon: '🎓' },
            { vendor: 'Print Shop', amount: 89.99, category: 'Flyers & Outreach', icon: '🖨️' },
            { vendor: 'Zoom', amount: 14.99, category: 'Communication Tools', icon: '💻' }
        ]
    ];

    let currentExpenseSet = 0;
    let animationInterval;
    let isPaused = false;
    let totalBalance = 15420;

    function animateExpenses() {
        if (isPaused) return;
        
        const expenseSet = expenses[currentExpenseSet];
        currentExpenseSet = (currentExpenseSet + 1) % expenses.length;
        
        // Calculate total for this set
        const setTotal = expenseSet.reduce((sum, exp) => sum + exp.amount, 0);
        const newBalance = totalBalance - setTotal;

        // Build the demo content
        const content = `
            <h3 class="text-xl font-bold mb-4">Real-Time Expense Tracking</h3>
            <div class="mb-3 p-2 bg-blue-50 border border-blue-200 rounded-lg">
                <div class="flex items-center space-x-2">
                    <span class="text-blue-500">🤖</span>
                    <p class="text-xs text-blue-700 font-medium">100% Automated - No Manual Entry Required</p>
                </div>
            </div>
            <div class="mb-4 p-3 bg-emerald-50 rounded-lg">
                <div class="flex justify-between items-center">
                    <span class="text-sm text-gray-600">Account Balance</span>
                    <span class="text-lg font-bold text-emerald-600">$${totalBalance.toLocaleString()}</span>
                </div>
            </div>
            <div id="expense-header" class="mb-3 opacity-0 transition-opacity duration-500">
                <p class="text-sm font-semibold text-gray-600">📊 Automatically Captured from Bank</p>
            </div>
            <div id="processing" class="hidden text-center py-4">
                <div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-500"></div>
                <p class="mt-2 text-gray-600">Auto-syncing with bank account...</p>
            </div>
            <div id="expenses" class="hidden space-y-2">
                ${expenseSet.map((expense, i) => `
                    <div class="expense-item opacity-0 transition-all duration-500 bg-white border border-gray-200 rounded-lg p-3" data-index="${i}">
                        <div class="flex items-center justify-between">
                            <div class="flex items-center space-x-3">
                                <span class="text-2xl">${expense.icon}</span>
                                <div>
                                    <p class="font-semibold text-gray-800">${expense.vendor}</p>
                                    <p class="text-xs text-gray-500">${expense.category}</p>
                                </div>
                            </div>
                            <div class="text-right">
                                <p class="font-bold text-red-600">-$${expense.amount.toFixed(2)}</p>
                                <p class="text-xs text-gray-500">${new Date().toLocaleTimeString()}</p>
                            </div>
                        </div>
                    </div>
                `).join('')}
            </div>
            <div id="summary" class="hidden mt-4 p-3 bg-gray-50 rounded-lg">
                <div class="flex justify-between items-center mb-2">
                    <span class="text-sm text-gray-600">New Balance</span>
                    <span class="text-lg font-bold text-emerald-600">$${newBalance.toLocaleString()}</span>
                </div>
                <div class="flex justify-between items-center text-xs text-gray-500">
                    <span>Total Spent Today</span>
                    <span class="font-semibold">$${setTotal.toFixed(2)}</span>
                </div>
                <p class="text-xs text-gray-400 mt-2">✅ Zero manual work - Direct bank integration</p>
            </div>
            <div id="cta" class="hidden text-center mt-6">
                <p class="text-xs text-gray-600 mb-3 italic">Set up once, runs forever - no admin burden!</p>
                <a href="/onboarding/?step=1" class="inline-block bg-gradient-to-r from-emerald-500 to-cyan-500 text-white px-6 py-3 rounded-lg font-bold hover:shadow-lg transform hover:scale-105 transition-all duration-300">
                    Start Automated Transparency →
                </a>
            </div>
        `;
        
        demoWidget.innerHTML = content;

        // Get elements after updating content
        const header = demoWidget.querySelector('#expense-header');
        const processing = demoWidget.querySelector('#processing');
        const expensesDiv = demoWidget.querySelector('#expenses');
        const expenseItems = demoWidget.querySelectorAll('.expense-item');
        const summary = demoWidget.querySelector('#summary');
        const cta = demoWidget.querySelector('#cta');

        // Animation timeline
        setTimeout(() => header.classList.remove('opacity-0'), 100);
        
        setTimeout(() => {
            processing.classList.remove('hidden');
        }, 1000);

        setTimeout(() => {
            processing.classList.add('hidden');
            expensesDiv.classList.remove('hidden');
            
            expenseItems.forEach((item, index) => {
                setTimeout(() => {
                    item.classList.remove('opacity-0');
                }, index * 400);
            });
        }, 2500);

        setTimeout(() => {
            summary.classList.remove('hidden');
        }, 7000);

        setTimeout(() => {
            cta.classList.remove('hidden');
        }, 9000);
    }

    function startAnimation() {
        if (!isPaused) {
            animateExpenses();
            animationInterval = setInterval(animateExpenses, 12000);
        }
    }

    function stopAnimation() {
        clearInterval(animationInterval);
    }

    // Pause on hover
    demoWidget.addEventListener('mouseenter', () => {
        isPaused = true;
        stopAnimation();
    });
    
    demoWidget.addEventListener('mouseleave', () => {
        isPaused = false;
        startAnimation();
    });

    // Restart on click (except on links)
    demoWidget.addEventListener('click', (e) => {
        if (e.target.tagName !== 'A' && !e.target.closest('a')) {
            isPaused = false;
            stopAnimation();
            startAnimation();
        }
    });

    // Start the animation
    startAnimation();
});

