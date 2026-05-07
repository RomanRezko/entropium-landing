// Mobile menu toggle
const burger = document.getElementById('burger');
const nav = document.querySelector('.nav');
if (burger && nav) {
    burger.addEventListener('click', () => {
        const isOpen = nav.classList.toggle('nav--open');
        if (isOpen) {
            nav.style.cssText = 'display:flex;flex-direction:column;position:absolute;top:64px;left:0;right:0;background:#fff;padding:24px;border-bottom:1px solid #E2E8F0;gap:16px;margin:0;';
        } else {
            nav.style.cssText = '';
        }
    });
}

// Phone input mask
document.querySelectorAll('input[type="tel"]').forEach(input => {
    input.addEventListener('input', e => {
        let value = e.target.value.replace(/\D/g, '');
        if (value.startsWith('8')) value = '7' + value.slice(1);
        if (!value.startsWith('7') && value.length > 0) value = '7' + value;
        let formatted = '';
        if (value.length > 0) formatted = '+7';
        if (value.length > 1) formatted += ' ' + value.slice(1, 4);
        if (value.length > 4) formatted += ' ' + value.slice(4, 7);
        if (value.length > 7) formatted += ' ' + value.slice(7, 9);
        if (value.length > 9) formatted += ' ' + value.slice(9, 11);
        e.target.value = formatted;
    });
});

// Form submit handler (placeholder — replace with real backend)
document.querySelectorAll('form').forEach(form => {
    form.addEventListener('submit', e => {
        e.preventDefault();
        const data = new FormData(form);
        const payload = Object.fromEntries(data.entries());

        // TODO: replace with real submission (CRM API, Bitrix24, AmoCRM, etc.)
        console.log('Form submitted:', form.id, payload);

        // Optimistic UX
        const btn = form.querySelector('button[type="submit"]');
        const original = btn.textContent;
        btn.textContent = 'Отправлено — перезвоним в течение 30 минут';
        btn.disabled = true;
        btn.style.background = '#10B981';

        // Reset form after 3s and close popup if applicable
        setTimeout(() => {
            form.reset();
            btn.textContent = original;
            btn.disabled = false;
            const popup = document.getElementById('exit-popup');
            if (popup && form.id === 'form-exit') popup.hidden = true;
        }, 3000);

        // TODO: send Yandex.Metrica goal
        // if (window.ym) ym(XXXXXX, 'reachGoal', 'lead_form_' + form.id);
    });
});

// Exit-intent popup
let exitShown = false;
const popup = document.getElementById('exit-popup');
const popupClose = document.getElementById('exit-popup-close');

if (popup && popupClose) {
    document.addEventListener('mouseleave', e => {
        if (e.clientY <= 0 && !exitShown && !sessionStorage.getItem('exitShown')) {
            popup.hidden = false;
            exitShown = true;
            sessionStorage.setItem('exitShown', '1');
        }
    });

    popupClose.addEventListener('click', () => { popup.hidden = true; });
    popup.querySelector('.exit-popup__overlay').addEventListener('click', () => { popup.hidden = true; });

    // Mobile fallback — show on scroll-up after deep scroll
    let lastScroll = 0;
    let deepScrolled = false;
    window.addEventListener('scroll', () => {
        const cur = window.scrollY;
        if (cur > document.body.scrollHeight * 0.4) deepScrolled = true;
        if (deepScrolled && cur < lastScroll - 100 && !exitShown && !sessionStorage.getItem('exitShown')) {
            popup.hidden = false;
            exitShown = true;
            sessionStorage.setItem('exitShown', '1');
        }
        lastScroll = cur;
    });
}
