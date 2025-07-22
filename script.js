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
    
    // Tilt.js初期化
    initTiltEffect();
    
    // GSAPアニメーション初期化
    initGSAPAnimations();
    
    // tsParticles初期化（動的パーティクルエフェクト）- 少し遅らせて実行
    setTimeout(() => {
        initTsParticles();
    }, 100);
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
                // GSAPで制御される要素は除外（全てGSAPで制御）
                const children = entry.target.querySelectorAll('.non-gsap-elements'); // 実際にはGSAP制御外の要素がないため空
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
    
    // 観察対象の要素を追加（GSAPで制御される要素は除外）
    const animateElements = document.querySelectorAll('section');
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

// Tilt.js初期化
function initTiltEffect() {
    // VanillaTilt.js使用可能かチェック
    if (typeof VanillaTilt === 'undefined') {
        console.warn('VanillaTilt is not loaded. Please check if the library is properly included.');
        return;
    }
    
    // data-tilt属性を持つ要素を全て取得
    const tiltElements = document.querySelectorAll('[data-tilt]');
    
    if (tiltElements.length === 0) {
        console.warn('No elements with data-tilt attribute found');
        return;
    }
    
    // 各要素にTiltエフェクトを適用
    tiltElements.forEach(element => {
        // 既に初期化されている場合はスキップ
        if (element.vanillaTilt) {
            return;
        }
        
        VanillaTilt.init(element, {
            max: 15,          // 最大傾き角度（少し小さくして自然に）
            speed: 400,       // アニメーション速度
            glare: true,      // 光沢エフェクトを有効
            'max-glare': 0.3, // 光沢の最大値（少し控えめに）
            scale: 1.02,      // ホバー時の拡大率
            perspective: 1000, // 3D効果の強さ
            transition: true,  // CSS transitionを使用
            'reset-to-start': false // マウスが離れた後の動作
        });
    });
    
    console.log(`Tilt effect initialized on ${tiltElements.length} elements`);
}

// =====================================
// GSAPとScrollTriggerを使用したアニメーション機能
// =====================================

// GSAPアニメーション初期化
function initGSAPAnimations() {
    // GSAPとScrollTriggerが読み込まれているかチェック
    if (typeof gsap === 'undefined') {
        console.warn('GSAP library is not loaded');
        return;
    }
    
    if (typeof ScrollTrigger === 'undefined') {
        console.warn('ScrollTrigger plugin is not loaded');
        return;
    }
    
    // ScrollTriggerプラグインを登録
    gsap.registerPlugin(ScrollTrigger);
    
    // 既存のCSSアニメーション設定をリセット（GSAP制御要素のみ）
    resetGSAPControlledElements();
    
    // 各セクションのアニメーションを初期化
    initProblemsAnimation();      // 課題セクション
    initSolutionAnimation();      // 解決策セクション
    initTrustAnimation();         // 信頼性セクション
    initCommunityAnimation();     // コミュニティセクション
    initPremiumAnimation();       // 有料プランセクション
    initTestimonialsAnimation();  // 参加者の声セクション
    initFinalCTAAnimation();      // 最終CTAセクション
    
    console.log('GSAP animations initialized successfully');
}

// GSAP制御要素のCSS設定をリセット
function resetGSAPControlledElements() {
    const gsapElements = document.querySelectorAll(`
        #problems .problem-item, 
        #solution .solution-item, 
        .operator-image, 
        .operator-info,
        #community .community-item,
        #premium .premium-item,
        #testimonials .testimonial-item,
        #final-cta .final-message,
        #final-cta .cta-button
    `);
    
    gsapElements.forEach(element => {
        // 既存のCSSクラスを削除
        element.classList.remove('fade-in', 'visible');
        // CSSアニメーションを無効化
        element.style.animation = 'none';
        element.style.transition = 'none';
    });
    
    console.log(`Reset ${gsapElements.length} GSAP-controlled elements`);
}

// アニメーション1: 「課題」セクション (#problems)
function initProblemsAnimation() {
    const problemItems = document.querySelectorAll('#problems .problem-item');
    
    if (problemItems.length === 0) {
        console.warn('Problem items not found');
        return;
    }
    
    // 初期状態を設定（透明 + 下に50px移動）
    gsap.set(problemItems, {
        opacity: 0,
        y: 50
    });
    
    // スクロールトリガーアニメーション
    gsap.to(problemItems, {
        opacity: 1,
        y: 0,
        duration: 1.0,
        stagger: 0.2, // 各カードを0.2秒差で順番にアニメーション
        ease: "power2.out",
        scrollTrigger: {
            trigger: "#problems",
            start: "top 80%", // セクションが画面下部から20%の位置に表示されたとき
            end: "bottom center",
            toggleActions: "play none none reverse",
            // デバッグ用（本番では削除可能）
            onEnter: () => console.log('Problems animation triggered'),
            markers: false // デバッグ時はtrueに設定
        }
    });
    
    console.log(`Problems animation set up for ${problemItems.length} items`);
}

// アニメーション2: 「解決策」セクション (#solution)
function initSolutionAnimation() {
    const solutionItems = document.querySelectorAll('#solution .solution-item');
    
    if (solutionItems.length < 2) {
        console.warn('Solution items not found or insufficient');
        return;
    }
    
    const solutionItem1 = solutionItems[0];
    const solutionItem2 = solutionItems[1];
    
    // 初期状態を設定
    gsap.set(solutionItem1, {
        opacity: 0,
        x: -100 // 左側に100px移動
    });
    
    gsap.set(solutionItem2, {
        opacity: 0,
        x: 100 // 右側に100px移動
    });
    
    // タイムラインを作成して同時アニメーション
    const tl = gsap.timeline({
        scrollTrigger: {
            trigger: "#solution",
            start: "top 75%", // セクションが画面中央より少し下に表示されたとき
            end: "bottom center",
            toggleActions: "play none none reverse",
            onEnter: () => console.log('Solution animation triggered'),
            markers: false
        }
    });
    
    // 1つ目のカード（左からスライドイン）
    tl.to(solutionItem1, {
        opacity: 1,
        x: 0,
        duration: 0.8,
        ease: "power2.out"
    })
    // 2つ目のカード（右からスライドイン）- 同時に開始
    .to(solutionItem2, {
        opacity: 1,
        x: 0,
        duration: 0.8,
        ease: "power2.out"
    }, 0); // 0秒後（同時）に開始
    
    console.log('Solution animation set up for 2 items');
}

// アニメーション3: 「信頼性」セクション (#trust)
function initTrustAnimation() {
    const operatorImage = document.querySelector('.operator-image');
    const operatorInfo = document.querySelector('.operator-info');
    const operatorProfile = document.querySelector('.operator-profile');
    
    if (!operatorImage || !operatorInfo || !operatorProfile) {
        console.warn('Trust section elements not found');
        return;
    }
    
    // 初期状態を設定
    gsap.set(operatorImage, {
        opacity: 0,
        x: -50 // 左に50px移動
    });
    
    gsap.set(operatorInfo, {
        opacity: 0,
        x: 50 // 右に50px移動
    });
    
    // タイムラインを作成して左右から合わさるアニメーション
    const tl = gsap.timeline({
        scrollTrigger: {
            trigger: operatorProfile,
            start: "top 80%", // 要素が画面に入り始めたとき
            end: "bottom center",
            toggleActions: "play none none reverse",
            onEnter: () => console.log('Trust animation triggered'),
            markers: false
        }
    });
    
    // 画像（左からフェードイン）
    tl.to(operatorImage, {
        opacity: 1,
        x: 0,
        duration: 0.8,
        ease: "power2.out"
    })
    // 情報テキスト（右からフェードイン）- 0.1秒遅れで開始
    .to(operatorInfo, {
        opacity: 1,
        x: 0,
        duration: 0.8,
        ease: "power2.out"
    }, 0.1);
    
    console.log('Trust animation set up for operator profile');
}

// アニメーション4: 「コミュニティ」セクション (#community)
function initCommunityAnimation() {
    const communityItems = document.querySelectorAll('#community .community-item');
    const communityFeatures = document.querySelector('#community .community-features');
    const communityButton = document.querySelector('#community .cta-button');
    
    if (communityItems.length === 0) {
        console.warn('Community items not found');
        return;
    }
    
    // 初期状態を設定
    gsap.set(communityItems, {
        opacity: 0,
        scale: 0.8,
        y: 30
    });
    
    gsap.set(communityFeatures, {
        opacity: 0,
        y: 20
    });
    
    gsap.set(communityButton, {
        opacity: 0,
        scale: 0.9
    });
    
    // タイムラインを作成
    const tl = gsap.timeline({
        scrollTrigger: {
            trigger: "#community",
            start: "top 75%",
            end: "bottom center", 
            toggleActions: "play none none reverse",
            onEnter: () => console.log('Community animation triggered'),
            markers: false
        }
    });
    
    // 4つのコミュニティアイテムを2x2グリッドのように表示
    tl.to(communityItems, {
        opacity: 1,
        scale: 1,
        y: 0,
        duration: 0.6,
        stagger: {
            amount: 0.6,
            grid: [2, 2],  // 2x2グリッドレイアウト
            from: "start"
        },
        ease: "back.out(1.7)"
    })
    // 特徴タグをフワッと表示
    .to(communityFeatures, {
        opacity: 1,
        y: 0,
        duration: 0.5,
        ease: "power2.out"
    }, "-=0.3")
    // ボタンを最後に拡大表示
    .to(communityButton, {
        opacity: 1,
        scale: 1,
        duration: 0.4,
        ease: "back.out(1.7)"
    }, "-=0.2");
    
    console.log(`Community animation set up for ${communityItems.length} items`);
}

// アニメーション5: 「有料プラン」セクション (#premium)
function initPremiumAnimation() {
    const premiumItems = document.querySelectorAll('#premium .premium-item');
    const pricingCard = document.querySelector('#premium .pricing-card');
    
    if (premiumItems.length === 0) {
        console.warn('Premium items not found');
        return;
    }
    
    // 初期状態を設定
    gsap.set(premiumItems, {
        opacity: 0,
        y: 40,
        rotationX: -15
    });
    
    gsap.set(pricingCard, {
        opacity: 0,
        scale: 0.8,
        y: 50
    });
    
    // タイムラインを作成
    const tl = gsap.timeline({
        scrollTrigger: {
            trigger: "#premium",
            start: "top 70%",
            end: "bottom center",
            toggleActions: "play none none reverse", 
            onEnter: () => console.log('Premium animation triggered'),
            markers: false
        }
    });
    
    // プレミアム機能を順番に表示（左右交互）
    tl.to(premiumItems, {
        opacity: 1,
        y: 0,
        rotationX: 0,
        duration: 0.5,  // 0.7から0.5に短縮
        stagger: {
            amount: 0.5,  // 0.8から0.5に短縮
            grid: [2, 2],
            from: "edges" // 外側から内側に向かって表示
        },
        ease: "power2.out"
    })
    // 価格カードを最後に印象的に表示
    .to(pricingCard, {
        opacity: 1,
        scale: 1,
        y: 0,
        duration: 0.8,
        ease: "back.out(1.4)"
    }, "-=0.4");
    
    console.log(`Premium animation set up for ${premiumItems.length} items`);
}

// アニメーション6: 「参加者の声」セクション (#testimonials)
function initTestimonialsAnimation() {
    const testimonialItems = document.querySelectorAll('#testimonials .testimonial-item');
    
    if (testimonialItems.length === 0) {
        console.warn('Testimonial items not found');
        return;
    }
    
    // 初期状態を設定
    gsap.set(testimonialItems, {
        opacity: 0,
        x: -60,
        y: 30
    });
    
    // スクロールトリガーアニメーション
    gsap.to(testimonialItems, {
        opacity: 1,
        x: 0,
        y: 0,
        duration: 0.8,
        stagger: 0.3, // 参加者の声を順番に表示
        ease: "power2.out",
        scrollTrigger: {
            trigger: "#testimonials",
            start: "top 75%",
            end: "bottom center",
            toggleActions: "play none none reverse",
            onEnter: () => console.log('Testimonials animation triggered'),
            markers: false
        }
    });
    
    console.log(`Testimonials animation set up for ${testimonialItems.length} items`);
}

// アニメーション7: 「最終CTA」セクション (#final-cta)
function initFinalCTAAnimation() {
    const finalMessage = document.querySelector('#final-cta .final-message');
    const finalButton = document.querySelector('#final-cta .cta-button');
    
    if (!finalMessage || !finalButton) {
        console.warn('Final CTA elements not found');
        return;
    }
    
    // 初期状態を設定
    gsap.set(finalMessage, {
        opacity: 0,
        y: 40,
        scale: 0.95
    });
    
    gsap.set(finalButton, {
        opacity: 0,
        y: 30,
        scale: 0.8
    });
    
    // タイムラインを作成してクライマックス演出
    const tl = gsap.timeline({
        scrollTrigger: {
            trigger: "#final-cta",
            start: "top 80%",
            end: "bottom center",
            toggleActions: "play none none reverse",
            onEnter: () => console.log('Final CTA animation triggered'),
            markers: false
        }
    });
    
    // メッセージを印象的にフェードイン
    tl.to(finalMessage, {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 1.0,
        ease: "power2.out"
    })
    // ボタンを最後の決め手として強調表示
    .to(finalButton, {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 0.6,
        ease: "back.out(2.0)"
    }, "-=0.3")
    // ボタンにパルスエフェクトを追加
    .to(finalButton, {
        scale: 1.05,
        duration: 0.5,
        ease: "power2.inOut",
        yoyo: true,
        repeat: -1
    });
    
    console.log('Final CTA animation set up');
}

// =====================================
// 動的パーティクルエフェクト（particles.js）
// =====================================

// particles.js初期化
function initTsParticles() {
    // particles.jsライブラリが読み込まれているかチェック
    if (typeof particlesJS === 'undefined') {
        console.warn('particles.js library is not loaded');
        return;
    }
    
    console.log('Initializing particles.js...');
    
    // particles.jsを設定して初期化
    particlesJS("particles-js", {
        particles: {
            number: {
                value: 80,
                density: {
                    enable: true,
                    value_area: 800
                }
            },
            color: {
                value: ["#00ffff", "#ff00ff"] // サイトのネオンカラー
            },
            shape: {
                type: "circle"
            },
            opacity: {
                value: 0.3,
                random: true,
                anim: {
                    enable: false
                }
            },
            size: {
                value: 3,
                random: true,
                anim: {
                    enable: false
                }
            },
            line_linked: {
                enable: true,
                distance: 150,
                color: "#ffffff",
                opacity: 0.1,
                width: 1
            },
            move: {
                enable: true,
                speed: 1,
                direction: "none",
                random: false,
                straight: false,
                out_mode: "out",
                bounce: false,
                attract: {
                    enable: false
                }
            }
        },
        interactivity: {
            detect_on: "window",  // "canvas"から"window"に変更で確実に検出
            events: {
                onhover: {
                    enable: true,
                    mode: "repulse"
                },
                onclick: {
                    enable: true,  // クリック時の効果も有効化
                    mode: "push"
                },
                resize: true
            },
            modes: {
                repulse: {
                    distance: 100,  // 距離を少し大きく
                    duration: 0.4
                },
                push: {
                    particles_nb: 4
                }
            }
        },
        retina_detect: true
    });
    
    console.log('particles.js initialized successfully');
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