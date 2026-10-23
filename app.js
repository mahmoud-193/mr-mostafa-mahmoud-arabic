(() => {
  const $ = (selector) => document.querySelector(selector);
  const menu = $('#siteNav');
  $('#menuToggle').addEventListener('click', () => {
    const open = menu.classList.toggle('open');
    $('#menuToggle').setAttribute('aria-expanded', String(open));
  });
  menu.querySelectorAll('a').forEach((link) => link.addEventListener('click', () => {
    menu.classList.remove('open');
    $('#menuToggle').setAttribute('aria-expanded', 'false');
  }));

  const questions = [
    { q: 'ما إعراب كلمة «العلمُ» في: «العلمُ نورٌ»؟', options: ['خبر مرفوع', 'مبتدأ مرفوع', 'فاعل مرفوع', 'مفعول به'], answer: 1, why: 'بدأت الجملة الاسمية بكلمة العلمُ، فهي مبتدأ مرفوع.' },
    { q: 'ما نوع الخبر في: «الطالبُ مجتهدٌ»؟', options: ['جملة فعلية', 'شبه جملة', 'مفرد', 'جملة اسمية'], answer: 2, why: 'مجتهدٌ كلمة واحدة، لذلك الخبر مفرد.' },
    { q: 'أي الكلمات الآتية فعل ماضٍ؟', options: ['يكتبُ', 'اكتبْ', 'كاتبٌ', 'كتبَ'], answer: 3, why: 'كتبَ فعل يدل على حدث وقع في الزمن الماضي.' },
    { q: 'ما نوع الصورة في: «الكتاب صديقٌ»؟', options: ['تشبيه بليغ', 'كناية', 'طباق', 'جناس'], answer: 0, why: 'شُبّه الكتاب بالصديق من غير أداة تشبيه أو وجه شبه؛ فهو تشبيه بليغ.' },
    { q: 'اختر علامة الترقيم المناسبة بعد السؤال: «أين الكتاب»', options: ['النقطة .', 'الفاصلة ،', 'علامة الاستفهام ؟', 'علامة التعجب !'], answer: 2, why: 'الجملة سؤال، وتوضع علامة الاستفهام في نهايتها.' },
    { q: 'ما جمع كلمة «قلم»؟', options: ['أقلام', 'قلمان', 'قلمات', 'قلمون'], answer: 0, why: 'جمع التكسير لكلمة قلم هو أقلام.' }
  ];
  let questionIndex = 0;
  let selectedAnswer = null;
  let responses = [];
  function showQuiz(id) {
    ['#quizStart', '#quizQuestion', '#quizResult'].forEach((selector) => { $(selector).hidden = selector !== id; });
  }
  function renderQuestion() {
    selectedAnswer = null;
    const item = questions[questionIndex];
    $('#quizCount').textContent = `سؤال ${questionIndex + 1} من ${questions.length}`;
    $('#progressFill').style.width = `${(questionIndex / questions.length) * 100}%`;
    $('#questionText').textContent = item.q;
    $('#answerOptions').replaceChildren();
    item.options.forEach((option, index) => {
      const button = document.createElement('button');
      button.type = 'button';
      button.className = 'answer-option';
      button.textContent = option;
      button.addEventListener('click', () => {
        selectedAnswer = index;
        $('#quizError').hidden = true;
        $('#answerOptions').querySelectorAll('button').forEach((el) => el.classList.remove('selected'));
        button.classList.add('selected');
      });
      $('#answerOptions').append(button);
    });
    $('#nextQuestion').textContent = questionIndex === questions.length - 1 ? 'عرض النتيجة ←' : 'السؤال التالي ←';
    $('#quizError').hidden = true;
    showQuiz('#quizQuestion');
  }
  function renderResult() {
    const correct = responses.filter((answer, i) => answer === questions[i].answer).length;
    const percent = Math.round(correct / questions.length * 100);
    $('#scorePercent').textContent = `${percent}%`;
    $('#resultTitle').textContent = correct >= 5 ? 'ممتاز، كمل تطبيق!' : correct >= 3 ? 'بداية جيدة، راجع أفكارك.' : 'ابدأ بالمفاهيم الأساسية.';
    $('#resultSummary').textContent = `إجابات صحيحة: ${correct} من ${questions.length}. راجع التفسير تحت كل سؤال ثم جرّب مرة ثانية.`;
    $('#answerReview').replaceChildren();
    questions.forEach((item, i) => {
      const row = document.createElement('div');
      row.className = `review-item ${responses[i] === item.answer ? 'correct' : 'wrong'}`;
      const title = document.createElement('b');
      title.textContent = `${i + 1}. ${item.q} — ${responses[i] === item.answer ? 'صحيح' : 'راجع الإجابة'}`;
      const explanation = document.createElement('span');
      explanation.textContent = `الإجابة: ${item.options[item.answer]}. ${item.why}`;
      row.append(title, explanation);
      $('#answerReview').append(row);
    });
    showQuiz('#quizResult');
  }
  $('#startQuiz').addEventListener('click', () => { questionIndex = 0; responses = []; renderQuestion(); });
  $('#retryQuiz').addEventListener('click', () => { questionIndex = 0; responses = []; renderQuestion(); });
  $('#nextQuestion').addEventListener('click', () => {
    if (selectedAnswer === null) { $('#quizError').hidden = false; return; }
    responses.push(selectedAnswer);
    if (questionIndex < questions.length - 1) { questionIndex += 1; renderQuestion(); }
    else renderResult();
  });

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  let viewMonth = new Date(today.getFullYear(), today.getMonth(), 1);
  let selectedDate = null;
  const maxDate = new Date(today);
  maxDate.setDate(maxDate.getDate() + 90);
  const dateFormat = new Intl.DateTimeFormat('ar-EG', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
  const monthFormat = new Intl.DateTimeFormat('ar-EG', { month: 'long', year: 'numeric' });
  const isoDate = (date) => `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
  function renderCalendar() {
    $('#calendarMonth').textContent = monthFormat.format(viewMonth);
    $('#prevMonth').disabled = viewMonth.getFullYear() === today.getFullYear() && viewMonth.getMonth() === today.getMonth();
    $('#nextMonth').disabled = new Date(viewMonth.getFullYear(), viewMonth.getMonth() + 1, 1) > maxDate;
    const container = $('#calendarDays');
    container.replaceChildren();
    const offset = (new Date(viewMonth.getFullYear(), viewMonth.getMonth(), 1).getDay() + 1) % 7;
    for (let i = 0; i < offset; i++) {
      const blank = document.createElement('span');
      blank.className = 'empty';
      container.append(blank);
    }
    const days = new Date(viewMonth.getFullYear(), viewMonth.getMonth() + 1, 0).getDate();
    for (let day = 1; day <= days; day++) {
      const date = new Date(viewMonth.getFullYear(), viewMonth.getMonth(), day);
      const button = document.createElement('button');
      button.type = 'button';
      button.textContent = String(day);
      button.disabled = date < today || date > maxDate;
      button.setAttribute('aria-label', dateFormat.format(date));
      const active = selectedDate && isoDate(date) === isoDate(selectedDate);
      button.setAttribute('aria-pressed', String(Boolean(active)));
      if (active) button.classList.add('selected');
      button.addEventListener('click', () => {
        selectedDate = date;
        $('#selectedDateLabel').textContent = dateFormat.format(date);
        $('#bookingError').hidden = true;
        renderCalendar();
      });
      container.append(button);
    }
  }
  $('#prevMonth').addEventListener('click', () => { viewMonth = new Date(viewMonth.getFullYear(), viewMonth.getMonth() - 1, 1); renderCalendar(); });
  $('#nextMonth').addEventListener('click', () => { viewMonth = new Date(viewMonth.getFullYear(), viewMonth.getMonth() + 1, 1); renderCalendar(); });
  renderCalendar();
  $('#bookingForm').addEventListener('submit', (event) => {
    event.preventDefault();
    if (!selectedDate) { $('#bookingError').hidden = false; $('#calendar').scrollIntoView({ behavior: 'smooth' }); return; }
    const name = $('#studentName').value.trim();
    const level = $('#studentLevel').value;
    const period = $('#preferredPeriod').value;
    if (!name || !level || !period) { $('#bookingForm').reportValidity(); return; }
    const notes = $('#bookingNotes').value.trim();
    const message = `مرحبًا أستاذ مصطفى، أود الاستفسار عن حصة اللغة العربية.\nاسم الطالب: ${name}\nالصف الدراسي: ${level}\nاليوم المفضل: ${dateFormat.format(selectedDate)}\nالوقت المفضل: ${period}${notes ? `\nملاحظات: ${notes}` : ''}\nأرجو تأكيد الموعد المتاح والتفاصيل. شكرًا.`;
    window.open(`https://wa.me/201019862880?text=${encodeURIComponent(message)}`, '_blank', 'noopener');
  });
})();










