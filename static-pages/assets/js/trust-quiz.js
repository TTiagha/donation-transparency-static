
document.addEventListener('DOMContentLoaded', () => {
    const quizQuestionsEl = document.getElementById('quiz-questions');
    const quizResultsEl = document.getElementById('quiz-results');

    const questions = [
        {
            question: "What's your primary goal when choosing a fundraising platform?",
            type: "choice",
            options: ["Minimize costs", "Maximize ease of use", "Build donor trust", "Reach more people"],
        },
        {
            question: "How important are low platform fees to you?",
            type: "scale",
            options: ["Not important", "Slightly important", "Moderately important", "Very important", "Essential"],
        },
        {
            question: "What type of organization are you fundraising for?",
            type: "choice",
            options: ["Small nonprofit/charity", "Large established nonprofit", "Personal cause", "Religious organization"],
        },
        {
            question: "How tech-savvy is your team?",
            type: "choice",
            options: ["Beginner", "Intermediate", "Advanced", "Expert"],
        },
        {
            question: "What's most important for donor confidence?",
            type: "choice",
            options: ["Brand recognition", "Detailed reporting", "Low fees", "User-friendly design"],
        },
    ];

    let currentQuestionIndex = 0;
    let userAnswers = [];

    function renderQuestion() {
        if (currentQuestionIndex >= questions.length) {
            showResults();
            return;
        }

        const question = questions[currentQuestionIndex];
        let optionsHtml = '';

        if (question.type === 'scale') {
            optionsHtml = question.options.map((opt, i) => `
                <button class="quiz-option scale" data-value="${i + 1}">${opt}</button>
            `).join('');
        } else {
            optionsHtml = question.options.map(opt => `
                <button class="quiz-option choice" data-value="${opt}">${opt}</button>
            `).join('');
        }

        quizQuestionsEl.innerHTML = `
            <div class="text-center">
                <p class="text-lg font-semibold mb-4">${question.question}</p>
                <div class="flex flex-wrap justify-center gap-4">${optionsHtml}</div>
                <p class="text-sm text-gray-500 mt-4">Question ${currentQuestionIndex + 1} of ${questions.length}</p>
            </div>
        `;
    }

    function handleAnswer(e) {
        if (!e.target.classList.contains('quiz-option')) return;

        userAnswers.push({ 
            question: questions[currentQuestionIndex].question,
            answer: e.target.dataset.value 
        });
        currentQuestionIndex++;
        renderQuestion();
    }

    function calculateRecommendation() {
        const answers = {};
        userAnswers.forEach(answer => {
            answers[answer.question] = answer.answer;
        });

        // Determine best platform based on neutral criteria
        const primaryGoal = answers[questions[0].question];
        const orgType = answers[questions[2].question];
        const techLevel = answers[questions[3].question];
        const donorConfidence = answers[questions[4].question];

        if (primaryGoal === 'Minimize costs' || answers[questions[1].question] === 'Essential') {
            return {
                platform: 'Zero-fee platforms',
                description: 'Consider platforms like Donation Transparency, Givebutter, or GoFundMe that offer 0% platform fees.'
            };
        } else if (orgType === 'Large established nonprofit') {
            return {
                platform: 'Enterprise solutions',
                description: 'Platforms like Classy or CharityEngine offer advanced features for large organizations.'
            };
        } else if (techLevel === 'Beginner' || primaryGoal === 'Maximize ease of use') {
            return {
                platform: 'User-friendly platforms',
                description: 'Platforms like Givebutter or GoFundMe offer simple setup and management.'
            };
        } else if (donorConfidence === 'Detailed reporting' || primaryGoal === 'Build donor trust') {
            return {
                platform: 'Transparency-focused platforms',
                description: 'Platforms with detailed reporting like Donation Transparency or Donorbox build donor confidence.'
            };
        } else {
            return {
                platform: 'Balanced approach',
                description: 'Consider your specific needs and compare features across multiple platforms.'
            };
        }
    }

    function showResults() {
        const recommendation = calculateRecommendation();

        quizQuestionsEl.classList.add('hidden');
        quizResultsEl.classList.remove('hidden');
        quizResultsEl.innerHTML = `
            <div class="text-center">
                <p class="text-xl font-bold">Recommended Platform Type:</p>
                <p class="text-3xl font-extrabold text-cyan-500 my-4">${recommendation.platform}</p>
                <p class="text-lg mb-6">${recommendation.description}</p>
                <p class="text-sm text-gray-600 mb-4">This recommendation is based on your responses and general platform characteristics. Be sure to compare specific features and pricing for your needs.</p>
                <button id="retake-quiz" class="bg-emerald-500 text-white px-6 py-2 rounded-lg hover:bg-emerald-600">Retake Quiz</button>
            </div>
        `;
    }

    function retakeQuiz() {
        currentQuestionIndex = 0;
        userAnswers = [];
        quizResultsEl.classList.add('hidden');
        quizQuestionsEl.classList.remove('hidden');
        renderQuestion();
    }

    quizQuestionsEl.addEventListener('click', handleAnswer);
    quizResultsEl.addEventListener('click', e => {
        if (e.target.id === 'retake-quiz') {
            retakeQuiz();
        }
    });

    renderQuestion();
});

