// DOM読み込み完了後に実行
document.addEventListener('DOMContentLoaded', function() {
    // タイピングエフェクト
    initTypingEffect();
    
    // スクロールアニメーション
    initScrollAnimations();
    
    // スムーススクロール
    initSmoothScroll();
    
    // パーティクル効果
    initParticleEffect();
    
    // ボタンアニメーション
    initButtonAnimations();
    
    // 数値カウントアップアニメーション
    initStatsAnimation();
});

// タイピングエフェクト
function initTypingEffect() {
    const typingElements = document.querySelectorAll('.typing-text');
    
    typingElements.forEach(element => {
        const text = element.getAttribute('data-text');
        if (!text) return;
        
        element.textContent = '';
        let index = 0;
        
        function type() {
            if (index < text.length) {
                element.textContent += text.charAt(index);
                index++;
                setTimeout(type, 50); // 50msずつ文字を追加
            } else {
                // タイピング完了後、カーソルを点滅させる
                element.style.animation = 'blink 1s infinite';
            }
        }
        
        // 少し遅らせてタイピング開始
        setTimeout(type, 1000);
    });
}

// スクロールアニメーション
function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                
                // 子要素のアニメーション（遅延実行）
                const children = entry.target.querySelectorAll('.trust-item, .problem-item, .solution-item, .community-item, .premium-item, .testimonial-item');
                children.forEach((child, index) => {
                    setTimeout(() => {
                        child.style.animation = `fadeInUp 0.6s ease forwards`;
                        child.style.animationDelay = `${index * 0.1}s`;
                    }, index * 100);
                });
                
                // 一度アニメーションが実行された要素の監視を解除
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    // 観察対象の要素を追加
    const animateElements = document.querySelectorAll('section, .trust-item, .problem-item, .solution-item, .community-item, .premium-item, .testimonial-item');
    animateElements.forEach(element => {
        element.classList.add('fade-in');
        observer.observe(element);
    });
}

// スムーススクロール
function initSmoothScroll() {
    // アンカーリンクのクリック処理
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

// セクションスクロール関数
function scrollToSection(sectionId) {
    const section = document.getElementById(sectionId);
    if (section) {
        section.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });
    }
}

// パーティクル効果
function initParticleEffect() {
    const particleContainer = document.querySelector('.particle-container');
    if (!particleContainer) return;
    
    function createParticle() {
        const particle = document.createElement('div');
        particle.className = 'particle';
        particle.style.cssText = `
            position: absolute;
            width: 3px;
            height: 3px;
            background: ${Math.random() > 0.5 ? '#00ffff' : '#ff00ff'};
            border-radius: 50%;
            pointer-events: none;
            opacity: 0;
            left: ${Math.random() * 100}%;
            top: 100%;
            animation: particleFloat ${5 + Math.random() * 3}s linear forwards;
        `;
        
        particleContainer.appendChild(particle);
        
        // アニメーション終了後に要素を削除
        setTimeout(() => {
            if (particle.parentNode) {
                particle.parentNode.removeChild(particle);
            }
        }, 8000);
    }
    
    // パーティクルを定期的に生成
    setInterval(createParticle, 2000);
}

// ボタンアニメーション
function initButtonAnimations() {
    const buttons = document.querySelectorAll('.cta-button');
    
    buttons.forEach(button => {
        button.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-2px) scale(1.05)';
        });
        
        button.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
        
        button.addEventListener('click', function(e) {
            // クリック時のリップル効果
            const ripple = document.createElement('span');
            const rect = this.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            const x = e.clientX - rect.left - size / 2;
            const y = e.clientY - rect.top - size / 2;
            
            ripple.style.cssText = `
                position: absolute;
                width: ${size}px;
                height: ${size}px;
                left: ${x}px;
                top: ${y}px;
                background: rgba(255, 255, 255, 0.3);
                border-radius: 50%;
                transform: scale(0);
                animation: ripple 0.6s ease-out;
                pointer-events: none;
            `;
            
            this.appendChild(ripple);
            
            setTimeout(() => {
                ripple.remove();
            }, 600);
        });
    });
}

// カウントアップアニメーション
function animateCountUp(element, start, end, duration) {
    let startTime = null;
    element.classList.add('counting');
    
    function animate(currentTime) {
        if (startTime === null) startTime = currentTime;
        const timeElapsed = currentTime - startTime;
        const progress = Math.min(timeElapsed / duration, 1);
        
        const currentValue = Math.floor(progress * (end - start) + start);
        element.textContent = currentValue.toLocaleString();
        
        if (progress < 1) {
            requestAnimationFrame(animate);
        } else {
            element.classList.remove('counting');
        }
    }
    
    requestAnimationFrame(animate);
}

// 統計数値のアニメーション
function initStatsAnimation() {
    const statsObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const statElement = entry.target;
                const endValue = parseInt(statElement.getAttribute('data-count'));
                animateCountUp(statElement, 0, endValue, 2000);
                statsObserver.unobserve(statElement);
            }
        });
    });
    
    document.querySelectorAll('.stat-number').forEach(stat => {
        statsObserver.observe(stat);
    });
}

// 背景のグラデーション変更（mel1.png背景画像を保持）
function initBackgroundAnimation() {
    const hero = document.querySelector('.hero');
    if (!hero) return;
    
    let mouseX = 0;
    let mouseY = 0;
    
    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX / window.innerWidth;
        mouseY = e.clientY / window.innerHeight;
        
        // 背景画像を保持しつつ、上にグラデーションエフェクトを追加
        hero.style.background = `
            radial-gradient(circle at ${mouseX * 100}% ${mouseY * 100}%, 
                rgba(0, 255, 255, 0.05) 0%, transparent 50%),
            radial-gradient(circle at ${(1 - mouseX) * 100}% ${(1 - mouseY) * 100}%, 
                rgba(255, 0, 255, 0.05) 0%, transparent 50%),
            url('./mel1.png')
        `;
        hero.style.backgroundSize = 'cover, cover, cover';
        hero.style.backgroundPosition = 'center, center, center';
        hero.style.backgroundRepeat = 'no-repeat, no-repeat, no-repeat';
    });
}

// パララックス効果
function initParallaxEffect() {
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        const parallaxElements = document.querySelectorAll('.parallax');
        
        parallaxElements.forEach(element => {
            const speed = element.getAttribute('data-speed') || 0.5;
            const yPos = -(scrolled * speed);
            element.style.transform = `translateY(${yPos}px)`;
        });
    });
}

// フォームバリデーション（将来的に問い合わせフォームを追加する場合）
function initFormValidation() {
    const forms = document.querySelectorAll('form');
    
    forms.forEach(form => {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // バリデーション処理
            const inputs = form.querySelectorAll('input, textarea');
            let isValid = true;
            
            inputs.forEach(input => {
                if (input.hasAttribute('required') && !input.value.trim()) {
                    isValid = false;
                    input.classList.add('error');
                } else {
                    input.classList.remove('error');
                }
            });
            
            if (isValid) {
                // フォーム送信処理
                console.log('Form submitted successfully');
                showSuccessMessage('お問い合わせありがとうございます！');
            }
        });
    });
}

// 成功メッセージの表示
function showSuccessMessage(message) {
    const successDiv = document.createElement('div');
    successDiv.className = 'success-message';
    successDiv.textContent = message;
    successDiv.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: var(--gradient-primary);
        color: var(--primary-bg);
        padding: 1rem 2rem;
        border-radius: 5px;
        z-index: 9999;
        animation: slideInRight 0.5s ease;
    `;
    
    document.body.appendChild(successDiv);
    
    setTimeout(() => {
        successDiv.remove();
    }, 3000);
}

// ローディングアニメーション
function showLoading(button) {
    const originalText = button.textContent;
    button.innerHTML = '<span class="loading"></span> 読み込み中...';
    button.disabled = true;
    
    return () => {
        button.textContent = originalText;
        button.disabled = false;
    };
}

// スクロール位置の保存と復元
function saveScrollPosition() {
    localStorage.setItem('scrollPosition', window.scrollY);
}

function restoreScrollPosition() {
    const scrollPosition = localStorage.getItem('scrollPosition');
    if (scrollPosition) {
        window.scrollTo(0, parseInt(scrollPosition));
        localStorage.removeItem('scrollPosition');
    }
}

// ダークモード/ライトモード切り替え（将来的な拡張用）
function initThemeToggle() {
    const themeToggle = document.querySelector('.theme-toggle');
    if (!themeToggle) return;
    
    const currentTheme = localStorage.getItem('theme') || 'dark';
    document.documentElement.setAttribute('data-theme', currentTheme);
    
    themeToggle.addEventListener('click', () => {
        const newTheme = document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
    });
}

// 追加のCSS Keyframes
const additionalStyles = `
    @keyframes fadeInUp {
        from {
            opacity: 0;
            transform: translateY(30px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
    
    @keyframes particleFloat {
        0% {
            opacity: 0;
            transform: translateY(0) scale(0);
        }
        10% {
            opacity: 1;
        }
        90% {
            opacity: 1;
        }
        100% {
            opacity: 0;
            transform: translateY(-100vh) scale(1);
        }
    }
    
    @keyframes ripple {
        to {
            transform: scale(2);
            opacity: 0;
        }
    }
    
    @keyframes slideInRight {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    .error {
        border-color: #ff4444 !important;
        box-shadow: 0 0 10px rgba(255, 68, 68, 0.3) !important;
    }
`;

// 追加のスタイルを挿入
const styleSheet = document.createElement('style');
styleSheet.textContent = additionalStyles;
document.head.appendChild(styleSheet);

// ページ離脱前の処理
window.addEventListener('beforeunload', saveScrollPosition);

// ページ読み込み時の処理
window.addEventListener('load', () => {
    restoreScrollPosition();
    initBackgroundAnimation(); // mel1.png背景画像を保持するよう修正済み
    initParallaxEffect();
    initStatsAnimation();
    initThemeToggle();
});