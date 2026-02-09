// ============================================
// 全局变量和选择器
// ============================================
const navbar = document.querySelector('.navbar');
const navToggle = document.getElementById('navToggle');
const navMenu = document.getElementById('navMenu');
const navLinks = document.querySelectorAll('.nav-link');
const backToTopBtn = document.getElementById('backToTop');
const contactForm = document.getElementById('contactForm');

// ============================================
// 打字动画效果 - AI创作者相关
// ============================================
const typingTexts = [
    'AIGC内容创作者',
    '提示词工程师',
    'AI Agent开发者',
    'AI视频创作者',
    '创意点燃者',
    '与你一起探索AI'
];

let textIndex = 0;
let charIndex = 0;
let isDeleting = false;
let typingDelay = 100;
let erasingDelay = 50;
let newTextDelay = 2000;

function typeEffect() {
    const typingElement = document.getElementById('typingText');
    const currentText = typingTexts[textIndex];

    if (isDeleting) {
        typingElement.textContent = currentText.substring(0, charIndex - 1);
        charIndex--;
    } else {
        typingElement.textContent = currentText.substring(0, charIndex + 1);
        charIndex++;
    }

    let typeSpeed = isDeleting ? erasingDelay : typingDelay;

    if (!isDeleting && charIndex === currentText.length) {
        typeSpeed = newTextDelay;
        isDeleting = true;
    } else if (isDeleting && charIndex === 0) {
        isDeleting = false;
        textIndex = (textIndex + 1) % typingTexts.length;
        typeSpeed = 500;
    }

    setTimeout(typeEffect, typeSpeed);
}

// ============================================
// 导航栏功能
// ============================================

// 滚动时改变导航栏样式
function handleNavbarScroll() {
    if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
}

// 移动端导航菜单切换
function toggleMobileMenu() {
    navToggle.classList.toggle('active');
    navMenu.classList.toggle('active');
}

// 关闭移动端菜单
function closeMobileMenu() {
    navToggle.classList.remove('active');
    navMenu.classList.remove('active');
}

// 平滑滚动到锚点
function smoothScrollToSection(e) {
    e.preventDefault();
    const targetId = this.getAttribute('href');
    const targetSection = document.querySelector(targetId);

    if (targetSection) {
        const offsetTop = targetSection.offsetTop - 70;
        window.scrollTo({
            top: offsetTop,
            behavior: 'smooth'
        });

        // 更新活动链接
        navLinks.forEach(link => link.classList.remove('active'));
        this.classList.add('active');

        // 关闭移动端菜单
        closeMobileMenu();
    }
}

// ============================================
// 滚动动画和观察器
// ============================================

// 创建观察器选项
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
};

// 淡入动画观察器
const fadeObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
        }
    });
}, observerOptions);

// 技能进度条观察器
const skillsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const progressBars = entry.target.querySelectorAll('.skill-progress');
            progressBars.forEach(bar => {
                const progress = bar.getAttribute('data-progress');
                setTimeout(() => {
                    bar.style.width = progress + '%';
                }, 200);
            });
        }
    });
}, { threshold: 0.5 });

// 数字计数动画观察器
const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const statNumbers = entry.target.querySelectorAll('.stat-number');
            statNumbers.forEach(stat => {
                const target = parseInt(stat.getAttribute('data-count'));
                animateCounter(stat, target);
            });
            statsObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.5 });

// 数字计数动画
function animateCounter(element, target) {
    let current = 0;
    const increment = target / 50;
    const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
            element.textContent = target;
            clearInterval(timer);
        } else {
            element.textContent = Math.floor(current);
        }
    }, 30);
}

// ============================================
// 节流函数
// ============================================
function throttle(func, delay) {
    let lastCall = 0;
    return function(...args) {
        const now = new Date().getTime();
        if (now - lastCall < delay) {
            return;
        }
        lastCall = now;
        return func(...args);
    };
}

// ============================================
// 活动部分检测
// ============================================
function updateActiveSection() {
    const sections = document.querySelectorAll('section[id]');
    const scrollPosition = window.scrollY + 100;

    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.offsetHeight;
        const sectionId = section.getAttribute('id');

        if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
            navLinks.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === `#${sectionId}`) {
                    link.classList.add('active');
                }
            });
        }
    });
}

// ============================================
// 回到顶部按钮
// ============================================
function handleBackToTop() {
    const scrollPosition = window.scrollY;

    if (scrollPosition > 500) {
        backToTopBtn.classList.add('visible');
    } else {
        backToTopBtn.classList.remove('visible');
    }
}

function scrollToTop() {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
}

// ============================================
// 表单处理
// ============================================
function handleFormSubmit(e) {
    e.preventDefault();

    const formData = new FormData(contactForm);
    const data = {
        name: formData.get('name'),
        email: formData.get('email'),
        subject: formData.get('subject'),
        message: formData.get('message')
    };

    // 这里可以添加实际的表单提交逻辑
    // 例如发送到服务器或使用第三方服务

    console.log('表单数据:', data);

    // 显示成功消息
    showNotification('消息发送成功！我会尽快回复您。', 'success');

    // 重置表单
    contactForm.reset();
}

// 通知提示
function showNotification(message, type = 'info') {
    // 创建通知元素
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;

    // 添加样式
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        padding: 1rem 1.5rem;
        background: linear-gradient(135deg, #8b5cf6, #ec4899);
        color: var(--text-primary);
        border-radius: var(--radius-lg);
        box-shadow: var(--shadow-glow);
        z-index: 10000;
        animation: slideInRight 0.3s ease;
    `;

    document.body.appendChild(notification);

    // 3秒后自动移除
    setTimeout(() => {
        notification.style.animation = 'slideOutRight 0.3s ease';
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 3000);
}

// 添加通知动画样式
const style = document.createElement('style');
style.textContent = `
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

    @keyframes slideOutRight {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// ============================================
// 鼠标跟随效果（可选）
// ============================================
let mouseX = 0;
let mouseY = 0;

document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;

    // 移动渐变球体
    const orbs = document.querySelectorAll('.gradient-orb');
    orbs.forEach((orb, index) => {
        const speed = (index + 1) * 0.01;
        const x = (window.innerWidth / 2 - mouseX) * speed;
        const y = (window.innerHeight / 2 - mouseY) * speed;
        orb.style.transform = `translate(${x}px, ${y}px)`;
    });
});

// ============================================
// 初始化
// ============================================
function init() {
    // 启动打字动画
    setTimeout(typeEffect, 1000);

    // 添加淡入动画到元素 (v2.0 更新)
    const fadeElements = document.querySelectorAll(
        '.about-content, .skill-card, .project-card, .contact-item, .info-card, .experience-card, .knowledge-card, .qr-card'
    );
    fadeElements.forEach(el => {
        el.classList.add('fade-in');
        fadeObserver.observe(el);
    });

    // 观察技能部分
    const skillsSection = document.querySelector('.skills-section');
    if (skillsSection) {
        skillsObserver.observe(skillsSection);
    }

    // 观察统计数字
    const statsSection = document.querySelector('.about-stats');
    if (statsSection) {
        statsObserver.observe(statsSection);
    }

    // 事件监听器
    window.addEventListener('scroll', throttle(handleNavbarScroll, 100));
    window.addEventListener('scroll', throttle(updateActiveSection, 100));
    window.addEventListener('scroll', throttle(handleBackToTop, 100));
    navToggle.addEventListener('click', toggleMobileMenu);
    navLinks.forEach(link => link.addEventListener('click', smoothScrollToSection));
    backToTopBtn.addEventListener('click', scrollToTop);

    // 表单提交
    if (contactForm) {
        contactForm.addEventListener('submit', handleFormSubmit);
    }

    // 初始调用
    handleNavbarScroll();
    updateActiveSection();
}

// ============================================
// DOM 加载完成后初始化
// ============================================
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}

// ============================================
// 平滑滚动增强（兼容旧浏览器）
// ============================================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const href = this.getAttribute('href');
        if (href !== '#' && href.length > 1) {
            e.preventDefault();
            const target = document.querySelector(href);
            if (target) {
                const headerOffset = 70;
                const elementPosition = target.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        }
    });
});

// ============================================
// 视差效果（为背景元素添加）
// ============================================
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const parallaxElements = document.querySelectorAll('.parallax');

    parallaxElements.forEach(element => {
        const speed = element.dataset.speed || 0.5;
        element.style.transform = `translateY(${scrolled * speed}px)`;
    });
});

// ============================================
// 控制台彩蛋 (v2.0 更新)
// ============================================
console.log('%c欢迎来到卢嘉豪的AI创意空间！', 'font-size: 24px; font-weight: bold; background: linear-gradient(135deg, #8b5cf6, #ec4899); -webkit-background-clip: text; -webkit-text-fill-color: transparent;');
console.log('%cAIGC内容创作者 | 提示词工程师 | AI视频创作者', 'font-size: 14px; color: #a5b4fc;');
console.log('%c✨ 用AI点燃你的创意 ✨', 'font-size: 14px; color: #06b6d4;');
console.log('%c📦 网站版本: v2.0 - 新增项目路演、Vibe Coding 经验、知识库专区', 'font-size: 12px; color: #22c55e;');
console.log('%c小红书: https://xhslink.com/m/7aRJQuIQxD6', 'font-size: 12px; color: #ec4899;');
console.log('%c抖音: https://v.douyin.com/3m_41CNYT80/', 'font-size: 12px; color: #ec4899;');
console.log('%c飞书知识库: https://pcn3kvelf0s9.feishu.cn/wiki/CnhWwGw0ciaaA7k2VEVckqz1nOc', 'font-size: 12px; color: #06b6d4;');
