/**
 * TASKFLOW HYPER STUDIO — NEXT-GEN PRODUCTIVITY ENGINE
 * Architecture: Modular Vanilla ES6+ Interactive Studio Engine
 * Features:
 *  - Floating Stardust Particle Physics Canvas
 *  - 3D Perspective Card Tilt & Specular Light Glare
 *  - Distraction-Free Fullscreen Zen Focus Portal
 *  - Dynamic Island Focus HUD with Live Countdown
 *  - AI Productivity Coach with Smart Sprint Launcher
 *  - 30-Day Activity Velocity Heatmap
 *  - Trophies & Achievements Showcase System (8 Badges)
 *  - Web Audio Synthesizer + Volume Slider + Canvas Equalizer
 *  - Physics Confetti Cannon Celebration
 *  - Natural Language Task Parser (!high, #dev, @tomorrow)
 *  - Quick Date Chips (Today, Tmrw, +7d)
 *  - Double-Click Inline Task Title Editing
 *  - Kanban "+ Add Card" Quick Triggers & Column Badges
 *  - Dynamic "Reset Filters" Visibility Trigger
 *  - AI Subtask Generator & Web Speech Voice Dictation
 *  - Slide-Over Inspector Drawer & Dual List / Kanban Views
 *  - 5 Iridescent Theme Suites & Data Backup (JSON / CSV)
 */

(() => {
    'use strict';

    /* ==========================================================================
       1. WEB AUDIO API SYNTHESIZER
       ========================================================================== */
    class SoundEngine {
        constructor() {
            this.audioCtx = null;
            this.muted = localStorage.getItem('tf_hyper_muted') === 'true';
            this.ambientNode = null;
            this.ambientGain = null;
            this.currentAmbient = 'none';
            this.ambientVolume = 0.7;
        }

        init() {
            if (!this.audioCtx) {
                const AudioCtx = window.AudioContext || window.webkitAudioContext;
                if (AudioCtx) this.audioCtx = new AudioCtx();
            }
            if (this.audioCtx && this.audioCtx.state === 'suspended') {
                this.audioCtx.resume();
            }
        }

        toggleMute() {
            this.muted = !this.muted;
            localStorage.setItem('tf_hyper_muted', this.muted);
            if (this.muted) this.stopAmbient();
            return !this.muted;
        }

        setAmbientVolume(vol) {
            this.ambientVolume = Math.max(0, Math.min(1, vol));
            if (this.ambientGain && this.audioCtx) {
                this.ambientGain.gain.setValueAtTime(this.ambientVolume * 0.1, this.audioCtx.currentTime);
            }
        }

        playPop() {
            if (this.muted) return;
            this.init();
            if (!this.audioCtx) return;

            const osc = this.audioCtx.createOscillator();
            const gain = this.audioCtx.createGain();
            const now = this.audioCtx.currentTime;

            osc.type = 'sine';
            osc.frequency.setValueAtTime(450, now);
            osc.frequency.exponentialRampToValueAtTime(850, now + 0.08);

            gain.gain.setValueAtTime(0.15, now);
            gain.gain.exponentialRampToValueAtTime(0.01, now + 0.08);

            osc.connect(gain);
            gain.connect(this.audioCtx.destination);
            osc.start(now);
            osc.stop(now + 0.09);
        }

        playChime() {
            if (this.muted) return;
            this.init();
            if (!this.audioCtx) return;

            const notes = [523.25, 659.25, 783.99, 1046.5]; // C5, E5, G5, C6
            notes.forEach((f, i) => {
                const osc = this.audioCtx.createOscillator();
                const gain = this.audioCtx.createGain();
                const now = this.audioCtx.currentTime + (i * 0.04);

                osc.type = 'triangle';
                osc.frequency.setValueAtTime(f, now);

                gain.gain.setValueAtTime(0.12, now);
                gain.gain.exponentialRampToValueAtTime(0.001, now + 0.4);

                osc.connect(gain);
                gain.connect(this.audioCtx.destination);
                osc.start(now);
                osc.stop(now + 0.45);
            });
        }

        playSwoosh() {
            if (this.muted) return;
            this.init();
            if (!this.audioCtx) return;

            const osc = this.audioCtx.createOscillator();
            const gain = this.audioCtx.createGain();
            const now = this.audioCtx.currentTime;

            osc.type = 'sine';
            osc.frequency.setValueAtTime(360, now);
            osc.frequency.exponentialRampToValueAtTime(90, now + 0.14);

            gain.gain.setValueAtTime(0.12, now);
            gain.gain.exponentialRampToValueAtTime(0.01, now + 0.14);

            osc.connect(gain);
            gain.connect(this.audioCtx.destination);
            osc.start(now);
            osc.stop(now + 0.15);
        }

        playAlarm() {
            if (this.muted) return;
            this.init();
            if (!this.audioCtx) return;

            [0, 0.2, 0.4].forEach(d => {
                const osc = this.audioCtx.createOscillator();
                const gain = this.audioCtx.createGain();
                const now = this.audioCtx.currentTime + d;

                osc.type = 'square';
                osc.frequency.setValueAtTime(880, now);

                gain.gain.setValueAtTime(0.1, now);
                gain.gain.exponentialRampToValueAtTime(0.001, now + 0.14);

                osc.connect(gain);
                gain.connect(this.audioCtx.destination);
                osc.start(now);
                osc.stop(now + 0.15);
            });
        }

        startAmbient(type) {
            this.stopAmbient();
            if (type === 'none' || this.muted) {
                this.currentAmbient = 'none';
                return;
            }

            this.init();
            if (!this.audioCtx) return;
            this.currentAmbient = type;

            try {
                if (type === 'rain' || type === 'whitenoise' || type === 'ocean') {
                    const bufSize = 2 * this.audioCtx.sampleRate;
                    const noiseBuffer = this.audioCtx.createBuffer(1, bufSize, this.audioCtx.sampleRate);
                    const output = noiseBuffer.getChannelData(0);
                    for (let i = 0; i < bufSize; i++) {
                        output[i] = Math.random() * 2 - 1;
                    }

                    const noise = this.audioCtx.createBufferSource();
                    noise.buffer = noiseBuffer;
                    noise.loop = true;

                    const filter = this.audioCtx.createBiquadFilter();
                    filter.type = type === 'rain' ? 'lowpass' : (type === 'ocean' ? 'bandpass' : 'notch');
                    filter.frequency.value = type === 'rain' ? 800 : (type === 'ocean' ? 300 : 550);

                    const gain = this.audioCtx.createGain();
                    gain.gain.setValueAtTime(this.ambientVolume * 0.08, this.audioCtx.currentTime);

                    noise.connect(filter);
                    filter.connect(gain);
                    gain.connect(this.audioCtx.destination);

                    noise.start();
                    this.ambientNode = noise;
                    this.ambientGain = gain;
                } else if (type === 'binaural') {
                    const osc1 = this.audioCtx.createOscillator();
                    const osc2 = this.audioCtx.createOscillator();
                    const gain = this.audioCtx.createGain();

                    osc1.frequency.value = 140;
                    osc2.frequency.value = 148; // 8Hz Alpha beat
                    gain.gain.setValueAtTime(this.ambientVolume * 0.07, this.audioCtx.currentTime);

                    osc1.connect(gain);
                    osc2.connect(gain);
                    gain.connect(this.audioCtx.destination);

                    osc1.start();
                    osc2.start();

                    this.ambientNode = {
                        stop: () => {
                            try { osc1.stop(); osc2.stop(); } catch (e) {}
                        }
                    };
                    this.ambientGain = gain;
                }
            } catch (e) {
                console.warn('Ambient sound error:', e);
            }
        }

        stopAmbient() {
            if (this.ambientNode) {
                try { this.ambientNode.stop(); } catch (e) {}
                this.ambientNode = null;
            }
        }
    }

    const sound = new SoundEngine();

    /* ==========================================================================
       2. CANVAS SOUND EQUALIZER ANIMATION
       ========================================================================== */
    class EqualizerVisualizer {
        constructor(canvasId) {
            this.canvas = document.getElementById(canvasId);
            this.ctx = this.canvas ? this.canvas.getContext('2d') : null;
            this.bars = [0.3, 0.7, 0.4, 0.9, 0.5, 0.8];
            this.frame = null;
            if (this.ctx) this.animate();
        }

        animate() {
            if (!this.ctx) return;
            this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

            const isPlaying = sound.ambientNode !== null;
            const barWidth = 6;
            const gap = 4;

            this.bars.forEach((b, i) => {
                if (isPlaying) {
                    this.bars[i] = Math.max(0.15, Math.min(1, b + (Math.random() - 0.5) * 0.25));
                } else {
                    this.bars[i] = 0.15;
                }

                const height = this.bars[i] * this.canvas.height;
                const x = i * (barWidth + gap);
                const y = this.canvas.height - height;

                this.ctx.fillStyle = isPlaying ? '#06b6d4' : 'rgba(255,255,255,0.2)';
                this.ctx.fillRect(x, y, barWidth, height);
            });

            this.frame = requestAnimationFrame(() => this.animate());
        }
    }

    const equalizer = new EqualizerVisualizer('equalizer-canvas');

    /* ==========================================================================
       3. FLOATING STARDUST PARTICLE ENGINE
       ========================================================================== */
    class StardustEngine {
        constructor(canvasId) {
            this.canvas = document.getElementById(canvasId);
            this.ctx = this.canvas ? this.canvas.getContext('2d') : null;
            this.particles = [];
            this.mouse = { x: null, y: null };
            this.maxDistance = 110;

            if (this.ctx) {
                this.resize();
                this.initParticles(60);
                window.addEventListener('resize', () => this.resize());
                window.addEventListener('mousemove', (e) => {
                    this.mouse.x = e.clientX;
                    this.mouse.y = e.clientY;
                });
                window.addEventListener('mouseleave', () => {
                    this.mouse.x = null;
                    this.mouse.y = null;
                });
                this.animate();
            }
        }

        resize() {
            if (!this.canvas) return;
            this.canvas.width = window.innerWidth;
            this.canvas.height = window.innerHeight;
        }

        initParticles(count) {
            this.particles = [];
            for (let i = 0; i < count; i++) {
                this.particles.push({
                    x: Math.random() * (this.canvas.width || 1200),
                    y: Math.random() * (this.canvas.height || 800),
                    vx: (Math.random() - 0.5) * 0.45,
                    vy: (Math.random() - 0.5) * 0.45,
                    radius: 1.2 + Math.random() * 2,
                    alpha: 0.25 + Math.random() * 0.45
                });
            }
        }

        animate() {
            if (!this.ctx) return;
            this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

            const isDark = document.documentElement.getAttribute('data-theme') !== 'liquid-pearl';
            const nodeColor = isDark ? 'rgba(139, 92, 246,' : 'rgba(99, 102, 241,';
            const strokeColor = isDark ? 'rgba(6, 182, 212,' : 'rgba(59, 130, 246,';

            // Update & draw particles
            for (let i = 0; i < this.particles.length; i++) {
                const p = this.particles[i];
                p.x += p.vx;
                p.y += p.vy;

                // Screen bounce
                if (p.x < 0 || p.x > this.canvas.width) p.vx *= -1;
                if (p.y < 0 || p.y > this.canvas.height) p.vy *= -1;

                // Mouse interaction
                if (this.mouse.x !== null && this.mouse.y !== null) {
                    const dx = p.x - this.mouse.x;
                    const dy = p.y - this.mouse.y;
                    const dist = Math.hypot(dx, dy);
                    if (dist < 130) {
                        const force = (130 - dist) / 130;
                        p.x += (dx / dist) * force * 1.5;
                        p.y += (dy / dist) * force * 1.5;

                        // Mouse connection line
                        this.ctx.beginPath();
                        this.ctx.moveTo(p.x, p.y);
                        this.ctx.lineTo(this.mouse.x, this.mouse.y);
                        this.ctx.strokeStyle = `${strokeColor} ${(1 - dist / 130) * 0.25})`;
                        this.ctx.lineWidth = 0.8;
                        this.ctx.stroke();
                    }
                }

                // Draw Particle
                this.ctx.beginPath();
                this.ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
                this.ctx.fillStyle = `${nodeColor} ${p.alpha})`;
                this.ctx.fill();

                // Particle pair connections
                for (let j = i + 1; j < this.particles.length; j++) {
                    const p2 = this.particles[j];
                    const dist = Math.hypot(p.x - p2.x, p.y - p2.y);
                    if (dist < this.maxDistance) {
                        const alpha = (1 - dist / this.maxDistance) * 0.15;
                        this.ctx.beginPath();
                        this.ctx.moveTo(p.x, p.y);
                        this.ctx.lineTo(p2.x, p2.y);
                        this.ctx.strokeStyle = `${nodeColor} ${alpha})`;
                        this.ctx.lineWidth = 0.6;
                        this.ctx.stroke();
                    }
                }
            }

            requestAnimationFrame(() => this.animate());
        }
    }

    const stardust = new StardustEngine('stardust-canvas');

    /* ==========================================================================
       4. 3D CARD PERSPECTIVE TILT & SPECULAR GLARE
       ========================================================================== */
    function init3DTiltPhysics() {
        const tiltCards = document.querySelectorAll('.tilt-card');
        tiltCards.forEach(card => {
            const glare = card.querySelector('.specular-glare');

            card.addEventListener('mousemove', (e) => {
                const rect = card.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;

                const centerX = rect.width / 2;
                const centerY = rect.height / 2;

                const rotateX = ((y - centerY) / centerY * -6).toFixed(2);
                const rotateY = ((x - centerX) / centerX * 6).toFixed(2);

                card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-4px)`;

                if (glare) {
                    glare.style.opacity = '1';
                    glare.style.background = `radial-gradient(circle at ${x}px ${y}px, rgba(255,255,255,0.18) 0%, rgba(255,255,255,0) 65%)`;
                }
            });

            card.addEventListener('mouseleave', () => {
                card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0)';
                if (glare) glare.style.opacity = '0';
            });
        });
    }

    /* ==========================================================================
       5. CONFETTI CELEBRATION CANNON
       ========================================================================== */
    class ConfettiCannon {
        constructor() {
            this.canvas = document.getElementById('confetti-canvas');
            this.ctx = this.canvas ? this.canvas.getContext('2d') : null;
            this.particles = [];
            this.frame = null;

            if (this.canvas) {
                this.resize();
                window.addEventListener('resize', () => this.resize());
            }
        }

        resize() {
            if (!this.canvas) return;
            this.canvas.width = window.innerWidth;
            this.canvas.height = window.innerHeight;
        }

        burst(x = window.innerWidth / 2, y = window.innerHeight / 3) {
            if (!this.ctx) return;
            const colors = ['#8b5cf6', '#06b6d4', '#10b981', '#f59e0b', '#f43f5e', '#ec4899', '#ffe600'];
            for (let i = 0; i < 75; i++) {
                const angle = Math.random() * Math.PI * 2;
                const spd = 4 + Math.random() * 8;
                this.particles.push({
                    x, y,
                    vx: Math.cos(angle) * spd,
                    vy: Math.sin(angle) * spd - 3,
                    size: 6 + Math.random() * 6,
                    color: colors[Math.floor(Math.random() * colors.length)],
                    rot: Math.random() * 360,
                    rotSpeed: (Math.random() - 0.5) * 12,
                    alpha: 1,
                    decay: 0.015 + Math.random() * 0.015
                });
            }
            if (!this.frame) this.render();
        }

        render() {
            if (!this.ctx) return;
            this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

            this.particles.forEach((p, idx) => {
                p.x += p.vx;
                p.y += p.vy;
                p.vy += 0.22;
                p.rot += p.rotSpeed;
                p.alpha -= p.decay;

                if (p.alpha <= 0) {
                    this.particles.splice(idx, 1);
                    return;
                }

                this.ctx.save();
                this.ctx.globalAlpha = p.alpha;
                this.ctx.translate(p.x, p.y);
                this.ctx.rotate((p.rot * Math.PI) / 180);
                this.ctx.fillStyle = p.color;
                this.ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * 0.6);
                this.ctx.restore();
            });

            if (this.particles.length > 0) {
                this.frame = requestAnimationFrame(() => this.render());
            } else {
                this.frame = null;
            }
        }
    }

    const confetti = new ConfettiCannon();

    /* ==========================================================================
       6. TOAST NOTIFICATIONS WITH UNDO
       ========================================================================== */
    class ToastManager {
        constructor() {
            this.container = document.getElementById('toast-container');
        }

        show({ message, icon = 'ℹ️', duration = 4000, actionText = null, onAction = null }) {
            if (!this.container) return;

            const toast = document.createElement('div');
            toast.className = 'toast';

            const content = document.createElement('div');
            content.className = 'toast-content';
            content.innerHTML = `<span>${icon}</span> <span>${message}</span>`;
            toast.appendChild(content);

            if (actionText && onAction) {
                const btn = document.createElement('button');
                btn.className = 'toast-undo-btn';
                btn.textContent = actionText;
                btn.onclick = () => {
                    onAction();
                    this.remove(toast);
                };
                toast.appendChild(btn);
            }

            const bar = document.createElement('div');
            bar.className = 'toast-progress';
            bar.style.animationDuration = `${duration}ms`;
            toast.appendChild(bar);

            this.container.appendChild(toast);
            const timer = setTimeout(() => this.remove(toast), duration);
            toast._timer = timer;
        }

        remove(toast) {
            if (toast._timer) clearTimeout(toast._timer);
            toast.style.opacity = '0';
            toast.style.transform = 'translateY(15px)';
            setTimeout(() => {
                if (toast.parentElement) toast.parentElement.removeChild(toast);
            }, 200);
        }
    }

    const toast = new ToastManager();

    /* ==========================================================================
       7. DEMO TASKS & SYSTEM STATE
       ========================================================================== */
    const DEMO_TASKS = [
        {
            id: 1702000001,
            text: "Design futuristic holographic Bento Grid & Spotlight UI",
            completed: true,
            status: "completed",
            priority: "high",
            category: "🎨 Creative",
            dueDate: new Date().toISOString().split('T')[0],
            starred: true,
            notes: "Next-gen iridescent neon aesthetic with interactive cursor spotlight and animated sound equalizer.",
            subtasks: [
                { id: 1, text: "Build interactive cursor spotlight glow", completed: true },
                { id: 2, text: "Design live digital clock & theme popover", completed: true }
            ],
            createdAt: Date.now() - 3600000 * 6,
            completedAt: Date.now() - 3600000 * 5
        },
        {
            id: 1702000002,
            text: "Implement procedural audio synthesizer & focus soundscapes",
            completed: false,
            status: "inprogress",
            priority: "high",
            category: "💻 Development",
            dueDate: new Date(Date.now() + 86400000).toISOString().split('T')[0],
            starred: true,
            notes: "Zero external audio files required! Synthesizes rain, flow white noise, ocean, and 432Hz binaural beats.",
            subtasks: [
                { id: 10, text: "Binaural alpha wave focus oscillator", completed: true },
                { id: 11, text: "Live canvas equalizer bars animation", completed: true }
            ],
            createdAt: Date.now() - 3600000 * 3
        },
        {
            id: 1702000003,
            text: "Master daily mobility & intense workout routine",
            completed: false,
            status: "todo",
            priority: "medium",
            category: "💪 Fitness",
            dueDate: "",
            starred: false,
            notes: "Hydrate and hit progressive overload targets.",
            subtasks: [
                { id: 20, text: "5 min warmup & joint mobility", completed: false },
                { id: 21, text: "Main lifting compound sets", completed: false }
            ],
            createdAt: Date.now() - 3600000 * 1
        }
    ];

    const State = {
        tasks: [],
        currentFilter: 'all', // 'all' | 'active' | 'completed'
        filterCategory: 'all',
        filterPriority: 'all',
        sortOrder: 'newest',
        searchTerm: '',
        viewMode: 'list', // 'list' | 'kanban'
        activeComposerPriority: 'medium',
        stagedSubtasks: [],
        lastDeleted: null,

        // Profile & Gamification
        userProfile: {
            name: 'Shivam Chauhan',
            xp: 220,
            streak: 3,
            lastStreakDate: new Date().toISOString().split('T')[0]
        },

        // Focus Studio
        pomodoro: {
            mode: 'work',
            duration: 25 * 60,
            timeLeft: 25 * 60,
            isRunning: false,
            interval: null,
            targetTaskId: null
        }
    };

    /* ==========================================================================
       8. DOM ELEMENTS CACHE
       ========================================================================== */
    const DOM = {
        // Spotlight & Live Clock
        cursorGlow: document.getElementById('cursor-glow'),
        liveClockDigits: document.getElementById('live-clock-digits'),
        liveClockDate: document.getElementById('live-clock-date'),
        soundBtn: document.getElementById('sound-btn'),
        themeBtn: document.getElementById('theme-btn'),
        themeMenu: document.getElementById('theme-menu'),
        themeOptions: document.querySelectorAll('.theme-option'),
        shortcutsBtn: document.getElementById('shortcuts-btn'),
        dataBackupBtn: document.getElementById('data-backup-btn'),

        // Gamification & Trophies
        openAchievementsBtn: document.getElementById('open-achievements-btn'),
        achievementsModal: document.getElementById('achievements-modal'),
        achievementsClose: document.getElementById('achievements-close'),
        trophiesGrid: document.getElementById('trophies-grid'),
        streakCount: document.getElementById('streak-count'),
        levelTitle: document.getElementById('level-title'),
        levelXp: document.getElementById('level-xp'),
        xpMeterBar: document.getElementById('xp-meter-bar'),

        // Dynamic Island Focus HUD & Zen Mode
        dynamicIslandHud: document.getElementById('dynamic-island-hud'),
        hudTime: document.getElementById('hud-time'),
        hudTaskName: document.getElementById('hud-task-name'),
        openZenBtn: document.getElementById('open-zen-btn'),
        zenOverlay: document.getElementById('zen-overlay'),
        zenExitBtn: document.getElementById('zen-exit-btn'),
        zenTimerDigits: document.getElementById('zen-timer-digits'),
        zenTaskTitle: document.getElementById('zen-task-title'),
        zenToggleBtn: document.getElementById('zen-toggle-btn'),
        zenResetBtn: document.getElementById('zen-reset-btn'),
        zenQuote: document.getElementById('zen-quote'),

        // AI Productivity Coach Banner
        coachBanner: document.getElementById('coach-banner'),
        coachText: document.getElementById('coach-text'),
        coachSprintBtn: document.getElementById('coach-sprint-btn'),
        coachInspireBtn: document.getElementById('coach-inspire-btn'),

        // Composer
        taskInput: document.getElementById('task-input'),
        voiceBtn: document.getElementById('voice-btn'),
        voicePulse: document.getElementById('voice-pulse'),
        addTaskBtn: document.getElementById('add-task-btn'),
        prioChips: document.querySelectorAll('.priority-segmented .prio-chip'),
        projectSelect: document.getElementById('project-select'),
        dueDateInput: document.getElementById('due-date-input'),
        dateChips: document.querySelectorAll('.date-chip'),
        aiBreakdownBtn: document.getElementById('ai-breakdown-btn'),
        subtasksShelf: document.getElementById('subtasks-shelf'),
        shelfItems: document.getElementById('shelf-items'),
        clearShelfBtn: document.getElementById('clear-shelf-btn'),

        // Focus Studio & Ambient Volume
        timerDigits: document.getElementById('timer-digits'),
        timerProgressRing: document.getElementById('timer-progress-ring'),
        timerTargetTag: document.getElementById('timer-target-tag'),
        timerToggleBtn: document.getElementById('timer-toggle-btn'),
        timerResetBtn: document.getElementById('timer-reset-btn'),
        focusPills: document.querySelectorAll('.f-pill'),
        ambientChips: document.querySelectorAll('.amb-chip'),
        ambientVolSlider: document.getElementById('ambient-vol-slider'),
        ambientVolVal: document.getElementById('ambient-vol-val'),
        ambientVolIcon: document.getElementById('ambient-vol-icon'),

        // Stats Matrix & Heatmap
        scorePercent: document.getElementById('score-percent'),
        scoreRing: document.getElementById('score-ring'),
        statRatio: document.getElementById('stat-ratio'),
        statQuote: document.getElementById('stat-quote'),
        heatmapGrid: document.getElementById('heatmap-grid'),
        statTotal: document.getElementById('stat-total'),
        statActive: document.getElementById('stat-active'),
        statDone: document.getElementById('stat-done'),

        // Toolbar, Tasks & Kanban
        searchInput: document.getElementById('search-input'),
        searchClearBtn: document.getElementById('search-clear-btn'),
        filterTabs: document.querySelectorAll('.filter-tab'),
        tabCountAll: document.getElementById('tab-count-all'),
        tabCountActive: document.getElementById('tab-count-active'),
        tabCountCompleted: document.getElementById('tab-count-completed'),
        filterCategory: document.getElementById('filter-category'),
        filterPriority: document.getElementById('filter-priority'),
        sortOrder: document.getElementById('sort-order'),
        btnResetFilters: document.getElementById('reset-filters-btn'),
        btnViewList: document.getElementById('btn-view-list'),
        btnViewKanban: document.getElementById('btn-view-kanban'),
        clearDoneBtn: document.getElementById('clear-done-btn'),
        tasksListView: document.getElementById('tasks-list-view'),
        taskStream: document.getElementById('task-stream'),
        kanbanView: document.getElementById('kanban-view'),
        kbZones: {
            todo: document.getElementById('kb-zone-todo'),
            inprogress: document.getElementById('kb-zone-inprogress'),
            completed: document.getElementById('kb-zone-completed')
        },
        kbCounts: {
            todo: document.getElementById('kb-count-todo'),
            inprogress: document.getElementById('kb-count-inprogress'),
            completed: document.getElementById('kb-count-completed')
        },
        kbQuickAdds: document.querySelectorAll('.kb-quick-add'),

        // Inspector Drawer
        drawerBackdrop: document.getElementById('drawer-backdrop'),
        inspectorDrawer: document.getElementById('inspector-drawer'),
        drawerTaskId: document.getElementById('drawer-task-id'),
        drawerTaskTitle: document.getElementById('drawer-task-title'),
        drawerTaskStatus: document.getElementById('drawer-task-status'),
        drawerTaskPrio: document.getElementById('drawer-task-prio'),
        drawerTaskCat: document.getElementById('drawer-task-cat'),
        drawerTaskDue: document.getElementById('drawer-task-due'),
        drawerSubtasksCount: document.getElementById('drawer-subtasks-count'),
        drawerNewSubtask: document.getElementById('drawer-new-subtask'),
        drawerAddSubtaskBtn: document.getElementById('drawer-add-subtask-btn'),
        drawerSubtasksList: document.getElementById('drawer-subtasks-list'),
        drawerTaskNotes: document.getElementById('drawer-task-notes'),
        drawerStarBtn: document.getElementById('drawer-star-btn'),
        drawerCloseBtn: document.getElementById('drawer-close-btn'),
        drawerDeleteBtn: document.getElementById('drawer-delete-btn'),
        drawerSaveBtn: document.getElementById('drawer-save-btn'),

        // Modals
        shortcutsModal: document.getElementById('shortcuts-modal'),
        shortcutsClose: document.getElementById('shortcuts-close'),
        backupModal: document.getElementById('backup-modal'),
        backupClose: document.getElementById('backup-close'),
        btnExportJson: document.getElementById('btn-export-json'),
        btnExportCsv: document.getElementById('btn-export-csv'),
        btnLoadDemo: document.getElementById('btn-load-demo')
    };

    /* ==========================================================================
       9. STORAGE & STATE PERSISTENCE
       ========================================================================== */
    function loadStorage() {
        try {
            const raw = localStorage.getItem('tf_hyper_tasks');
            State.tasks = raw ? JSON.parse(raw) : JSON.parse(JSON.stringify(DEMO_TASKS));

            const rawProfile = localStorage.getItem('tf_hyper_profile');
            if (rawProfile) State.userProfile = Object.assign(State.userProfile, JSON.parse(rawProfile));

            const savedTheme = localStorage.getItem('tf_hyper_theme') || 'hyper-prism';
            document.documentElement.setAttribute('data-theme', savedTheme);
            updateThemeActiveUI(savedTheme);
        } catch (e) {
            console.error('Storage error:', e);
            State.tasks = JSON.parse(JSON.stringify(DEMO_TASKS));
        }
    }

    function saveStorage() {
        try {
            localStorage.setItem('tf_hyper_tasks', JSON.stringify(State.tasks));
            localStorage.setItem('tf_hyper_profile', JSON.stringify(State.userProfile));
        } catch (e) {
            console.error('Save error:', e);
        }
    }

    /* ==========================================================================
       10. GAMIFICATION & LEVELS
       ========================================================================== */
    const LEVEL_TIERS = [
        { min: 0, title: 'Novice I' },
        { min: 100, title: 'Apprentice II' },
        { min: 250, title: 'Achiever III' },
        { min: 500, title: 'Focus Champion IV' },
        { min: 900, title: 'Productivity Ninja V' },
        { min: 1400, title: 'Hyper Grandmaster 🧙‍♂️' }
    ];

    function getLevelInfo(xp) {
        let cur = LEVEL_TIERS[0];
        let next = LEVEL_TIERS[1];
        for (let i = 0; i < LEVEL_TIERS.length; i++) {
            if (xp >= LEVEL_TIERS[i].min) {
                cur = LEVEL_TIERS[i];
                next = LEVEL_TIERS[i + 1] || null;
            }
        }
        const prevMin = cur.min;
        const nextMin = next ? next.min : prevMin + 500;
        const percent = Math.min(100, Math.floor(((xp - prevMin) / (nextMin - prevMin)) * 100));
        return { title: cur.title, xp, nextXp: nextMin, percent };
    }

    function awardXp(amount) {
        const oldInfo = getLevelInfo(State.userProfile.xp);
        State.userProfile.xp += amount;
        const newInfo = getLevelInfo(State.userProfile.xp);

        if (newInfo.title !== oldInfo.title) {
            confetti.burst();
            sound.playChime();
            toast.show({ message: `🎉 LEVEL UP! You reached ${newInfo.title}!`, icon: '⚡', duration: 5000 });
        }
        updateProfileDisplay();
        saveStorage();
    }

    function updateStreakOnCompletion() {
        const todayStr = new Date().toISOString().split('T')[0];
        const last = State.userProfile.lastStreakDate;
        if (!last) {
            State.userProfile.streak = 1;
            State.userProfile.lastStreakDate = todayStr;
        } else if (last === todayStr) {
            // Already counted today
        } else {
            const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];
            if (last === yesterday) {
                State.userProfile.streak += 1;
            } else {
                State.userProfile.streak = 1;
            }
            State.userProfile.lastStreakDate = todayStr;
        }
        updateProfileDisplay();
    }

    function updateProfileDisplay() {
        const info = getLevelInfo(State.userProfile.xp);
        if (DOM.streakCount) DOM.streakCount.textContent = State.userProfile.streak;
        if (DOM.levelTitle) DOM.levelTitle.textContent = info.title;
        if (DOM.levelXp) DOM.levelXp.textContent = `${info.xp} / ${info.nextXp} XP`;
        if (DOM.xpMeterBar) DOM.xpMeterBar.style.width = `${info.percent}%`;
    }

    /* ==========================================================================
       11. TROPHIES & ACHIEVEMENTS SHOWCASE SYSTEM
       ========================================================================== */
    const TROPHIES = [
        {
            id: 'first_step',
            title: 'First Step',
            icon: '🌱',
            desc: 'Conquer your first completed task in TaskFlow Hyper.',
            check: () => State.tasks.filter(t => t.completed).length >= 1
        },
        {
            id: 'rapid_fire',
            title: 'Rapid Fire',
            icon: '⚡',
            desc: 'Complete 3 tasks across your active workspaces.',
            check: () => State.tasks.filter(t => t.completed).length >= 3
        },
        {
            id: 'high_impact',
            title: 'High-Impact Pro',
            icon: '🔥',
            desc: 'Conquer a critical High-Priority task.',
            check: () => State.tasks.some(t => t.completed && t.priority === 'high')
        },
        {
            id: 'streak_igniter',
            title: 'Streak Igniter',
            icon: '🌟',
            desc: 'Maintain a 3+ day consecutive activity streak.',
            check: () => State.userProfile.streak >= 3
        },
        {
            id: 'checklist_pro',
            title: 'Checklist Pro',
            icon: '📋',
            desc: 'Check off at least 3 nested subtasks.',
            check: () => State.tasks.reduce((acc, t) => acc + (t.subtasks || []).filter(s => s.completed).length, 0) >= 3
        },
        {
            id: 'xp_hunter',
            title: 'XP Hunter',
            icon: '💎',
            desc: 'Amass 200+ Experience Points in your journey.',
            check: () => State.userProfile.xp >= 200
        },
        {
            id: 'deep_diver',
            title: 'Deep Diver',
            icon: '🧘',
            desc: 'Initiate or finish a Cyber Focus Studio session.',
            check: () => State.pomodoro.isRunning || State.userProfile.xp >= 250
        },
        {
            id: 'grandmaster',
            title: 'Hyper Grandmaster',
            icon: '👑',
            desc: 'Achieve 350+ XP and conquer 5+ tasks.',
            check: () => State.userProfile.xp >= 350 && State.tasks.filter(t => t.completed).length >= 5
        }
    ];

    function renderTrophies() {
        if (!DOM.trophiesGrid) return;
        DOM.trophiesGrid.innerHTML = '';

        TROPHIES.forEach(tr => {
            const unlocked = tr.check();
            const card = document.createElement('div');
            card.className = `trophy-card ${unlocked ? 'unlocked' : 'locked'}`;

            card.innerHTML = `
                <div class="trophy-icon">${tr.icon}</div>
                <div class="trophy-info">
                    <div class="trophy-title">${escapeHtml(tr.title)}</div>
                    <div class="trophy-desc">${escapeHtml(tr.desc)}</div>
                    <span class="trophy-status ${unlocked ? 'unlocked' : 'locked'}">
                        ${unlocked ? '✓ Unlocked' : '🔒 Locked'}
                    </span>
                </div>
            `;
            DOM.trophiesGrid.appendChild(card);
        });
    }

    if (DOM.openAchievementsBtn) {
        DOM.openAchievementsBtn.onclick = () => {
            renderTrophies();
            DOM.achievementsModal.classList.remove('hidden');
            sound.playPop();
        };
    }

    if (DOM.achievementsClose) {
        DOM.achievementsClose.onclick = () => {
            DOM.achievementsModal.classList.add('hidden');
        };
    }

    /* ==========================================================================
       12. LIVE CLOCK & MOUSE SPOTLIGHT
       ========================================================================== */
    function startLiveClock() {
        function update() {
            const now = new Date();
            const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
            const dateStr = now.toLocaleDateString([], { weekday: 'short', month: 'short', day: 'numeric' });
            if (DOM.liveClockDigits) DOM.liveClockDigits.textContent = timeStr;
            if (DOM.liveClockDate) DOM.liveClockDate.textContent = dateStr;
        }
        update();
        setInterval(update, 1000);
    }

    function setupSpotlight() {
        window.addEventListener('mousemove', (e) => {
            if (DOM.cursorGlow) {
                DOM.cursorGlow.style.left = `${e.clientX}px`;
                DOM.cursorGlow.style.top = `${e.clientY}px`;
            }

            document.querySelectorAll('.spotlight-card').forEach(card => {
                const rect = card.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                card.style.setProperty('--mouse-x', `${x}px`);
                card.style.setProperty('--mouse-y', `${y}px`);
            });
        });
    }

    /* ==========================================================================
       13. 30-DAY ACTIVITY VELOCITY HEATMAP
       ========================================================================== */
    function renderHeatmap() {
        if (!DOM.heatmapGrid) return;
        DOM.heatmapGrid.innerHTML = '';

        // Tally completions over the last 30 days
        const today = new Date();
        const counts = {};

        // Seed with realistic demo velocity baseline for richness
        for (let i = 29; i >= 0; i--) {
            const d = new Date();
            d.setDate(today.getDate() - i);
            const key = d.toISOString().split('T')[0];
            counts[key] = (i === 0 ? 1 : (i % 7 === 1 ? 4 : (i % 3 === 0 ? 2 : (i % 5 === 0 ? 3 : 0))));
        }

        // Add real task completions
        State.tasks.forEach(t => {
            if (t.completed) {
                const dateKey = new Date(t.completedAt || t.createdAt).toISOString().split('T')[0];
                counts[dateKey] = (counts[dateKey] || 0) + 1;
            }
        });

        // Render 30 cells
        for (let i = 29; i >= 0; i--) {
            const d = new Date();
            d.setDate(today.getDate() - i);
            const key = d.toISOString().split('T')[0];
            const dateStr = d.toLocaleDateString([], { month: 'short', day: 'numeric' });
            const c = counts[key] || 0;

            let level = 'lv0';
            if (c >= 5) level = 'lv3';
            else if (c >= 3) level = 'lv2';
            else if (c >= 1) level = 'lv1';

            const cell = document.createElement('div');
            cell.className = `heatmap-cell ${level}`;
            cell.title = `${dateStr}: ${c} tasks conquered`;
            DOM.heatmapGrid.appendChild(cell);
        }
    }

    /* ==========================================================================
       14. AI PRODUCTIVITY COACH
       ========================================================================== */
    const COACH_ADVICE = [
        "Focus on one high-impact task at a time. Multi-tasking reduces productivity by up to 40%.",
        "Action breeds clarity. Don't wait for motivation — launch a 5-minute timer and flow will follow.",
        "The 80/20 Rule: 20% of your tasks generate 80% of your results. Conquer them first!",
        "Take a 5-minute break every 25 minutes to restore cognitive reserves and prevent fatigue.",
        "Break large overwhelming goals into bite-sized 10-minute checklist milestones.",
        "Celebrate small wins! Every task checked off triggers dopamine and reinforces momentum."
    ];

    let coachIndex = 0;

    function initCoach() {
        updateCoachAdvice();

        if (DOM.coachInspireBtn) {
            DOM.coachInspireBtn.onclick = () => {
                coachIndex = (coachIndex + 1) % COACH_ADVICE.length;
                if (DOM.coachText) DOM.coachText.textContent = COACH_ADVICE[coachIndex];
                sound.playPop();
            };
        }

        if (DOM.coachSprintBtn) {
            DOM.coachSprintBtn.onclick = () => {
                // Find highest priority active task
                const activeHigh = State.tasks.find(t => !t.completed && t.priority === 'high');
                const anyActive = activeHigh || State.tasks.find(t => !t.completed);

                if (anyActive) {
                    setFocusTarget(anyActive.id);
                }

                // Switch to 25m work pill
                DOM.focusPills.forEach(p => p.classList.toggle('active', p.dataset.mins === '25'));
                State.pomodoro.duration = 25 * 60;
                State.pomodoro.timeLeft = 25 * 60;

                if (!State.pomodoro.isRunning) {
                    toggleTimer();
                }

                sound.playChime();
                toast.show({ message: '⚡ 25-Minute Focus Sprint Launched!', icon: '🎯' });
            };
        }
    }

    function updateCoachAdvice() {
        if (!DOM.coachText) return;
        const activeHigh = State.tasks.filter(t => !t.completed && t.priority === 'high').length;
        if (activeHigh > 0) {
            DOM.coachText.textContent = `You have ${activeHigh} high-priority task${activeHigh > 1 ? 's' : ''} in your pipeline. Ready for a 25-minute deep focus sprint?`;
        } else {
            DOM.coachText.textContent = COACH_ADVICE[coachIndex];
        }
    }

    /* ==========================================================================
       15. FULLSCREEN ZEN MODE PORTAL
       ========================================================================== */
    const ZEN_QUOTES = [
        '"Focus is a muscle. Train it in silence."',
        '"Do one thing with complete devotion."',
        '"Simplicity is the prerequisite for great focus."',
        '"Distraction is the thief of your potential."',
        '"Deep focus transforms minutes into mastery."'
    ];

    function openZenMode() {
        if (!DOM.zenOverlay) return;
        DOM.zenOverlay.classList.remove('hidden');

        // Pick random quote
        if (DOM.zenQuote) {
            const rand = ZEN_QUOTES[Math.floor(Math.random() * ZEN_QUOTES.length)];
            DOM.zenQuote.textContent = rand;
        }

        updateZenDisplay();
        sound.playPop();
    }

    function closeZenMode() {
        if (!DOM.zenOverlay) return;
        DOM.zenOverlay.classList.add('hidden');
        sound.playPop();
    }

    function updateZenDisplay() {
        if (!DOM.zenTimerDigits) return;
        DOM.zenTimerDigits.textContent = formatTime(State.pomodoro.timeLeft);

        let targetName = 'General Deep Focus';
        if (State.pomodoro.targetTaskId) {
            const t = State.tasks.find(tk => tk.id === State.pomodoro.targetTaskId);
            if (t) targetName = t.text;
        }
        if (DOM.zenTaskTitle) DOM.zenTaskTitle.textContent = targetName;
        if (DOM.zenToggleBtn) DOM.zenToggleBtn.textContent = State.pomodoro.isRunning ? 'Pause Focus' : 'Start Focus';
    }

    if (DOM.openZenBtn) DOM.openZenBtn.onclick = openZenMode;
    if (DOM.zenExitBtn) DOM.zenExitBtn.onclick = closeZenMode;
    if (DOM.zenToggleBtn) DOM.zenToggleBtn.onclick = toggleTimer;
    if (DOM.zenResetBtn) DOM.zenResetBtn.onclick = resetTimer;
    if (DOM.dynamicIslandHud) DOM.dynamicIslandHud.onclick = openZenMode;

    /* ==========================================================================
       16. NATURAL LANGUAGE PARSER & AI SUBTASKS
       ========================================================================== */
    function parseNaturalLanguage(raw) {
        let text = raw;
        let priority = null;
        let category = null;
        let dueDate = null;

        const pMatch = text.match(/!(high|med|medium|low)\b/i);
        if (pMatch) {
            const p = pMatch[1].toLowerCase();
            priority = (p === 'med' || p === 'medium') ? 'medium' : p;
            text = text.replace(pMatch[0], '');
        }

        const catMatch = text.match(/#(work|personal|dev|coding|fitness|health|creative)\b/i);
        if (catMatch) {
            const c = catMatch[1].toLowerCase();
            if (c.includes('work')) category = '💼 Work';
            else if (c.includes('dev') || c.includes('cod')) category = '💻 Development';
            else if (c.includes('fit') || c.includes('health')) category = '💪 Fitness';
            else if (c.includes('creat')) category = '🎨 Creative';
            else category = '👤 Personal';
            text = text.replace(catMatch[0], '');
        }

        const dMatch = text.match(/@(today|tomorrow)\b/i);
        if (dMatch) {
            const d = dMatch[1].toLowerCase();
            const date = new Date();
            if (d === 'tomorrow') date.setDate(date.getDate() + 1);
            dueDate = date.toISOString().split('T')[0];
            text = text.replace(dMatch[0], '');
        }

        return { cleanText: text.trim().replace(/\s{2,}/g, ' '), priority, category, dueDate };
    }

    function generateAiSubtasks(title) {
        const t = title.toLowerCase();
        if (t.includes('landing') || t.includes('website') || t.includes('app') || t.includes('code')) {
            return ['Plan component architecture', 'Code interactive UI features', 'Test responsiveness & deploy'];
        } else if (t.includes('presentation') || t.includes('deck') || t.includes('pitch')) {
            return ['Outline narrative & slide flow', 'Design key graphics and data visuals', 'Rehearse speech & timing'];
        } else if (t.includes('workout') || t.includes('gym') || t.includes('run')) {
            return ['5 min warmup mobility', 'Main progressive overload sets', 'Cooldown stretch & recovery'];
        } else if (t.includes('study') || t.includes('exam') || t.includes('book')) {
            return ['Review core chapters', 'Create active recall flashcards', 'Practice sample mock questions'];
        } else {
            return ['Define requirements & scope', 'Execute milestone tasks', 'Review and finalize deliverable'];
        }
    }

    /* ==========================================================================
       17. TASK CREATION, EDITING & DELETION
       ========================================================================== */
    function addTask() {
        const raw = DOM.taskInput.value.trim();
        if (!raw) return;

        const parsed = parseNaturalLanguage(raw);
        const title = parsed.cleanText || raw;

        const priority = parsed.priority || State.activeComposerPriority;
        const category = parsed.category || DOM.projectSelect.value;
        const dueDate = parsed.dueDate || DOM.dueDateInput.value;

        const subtasks = State.stagedSubtasks.map((st, i) => ({
            id: Date.now() + i,
            text: st,
            completed: false
        }));

        const newTask = {
            id: Date.now(),
            text: title,
            completed: false,
            status: 'todo',
            priority,
            category,
            dueDate,
            starred: false,
            notes: '',
            subtasks,
            createdAt: Date.now()
        };

        State.tasks.unshift(newTask);
        sound.playPop();

        DOM.taskInput.value = '';
        DOM.dueDateInput.value = '';
        State.stagedSubtasks = [];
        renderStagedShelf();

        saveStorage();
        renderAll();
        updateCoachAdvice();

        toast.show({ message: `Added to ${category}!`, icon: '✨' });
    }

    function toggleTask(id) {
        const task = State.tasks.find(t => t.id === id);
        if (!task) return;

        task.completed = !task.completed;
        task.status = task.completed ? 'completed' : 'todo';
        if (task.completed) task.completedAt = Date.now();

        if (task.completed) {
            sound.playChime();
            confetti.burst();
            const xpGains = { high: 50, medium: 35, low: 20 };
            const gain = xpGains[task.priority] || 25;
            awardXp(gain);
            updateStreakOnCompletion();
            toast.show({ message: `Task completed! +${gain} XP`, icon: '🏆' });
        } else {
            sound.playPop();
        }

        saveStorage();
        renderAll();
        updateCoachAdvice();
    }

    function deleteTask(id) {
        const idx = State.tasks.findIndex(t => t.id === id);
        if (idx === -1) return;

        const removed = State.tasks.splice(idx, 1)[0];
        State.lastDeleted = { task: removed, index: idx };
        sound.playSwoosh();

        if (DOM.drawerBackdrop && !DOM.drawerBackdrop.classList.contains('hidden')) {
            DOM.drawerBackdrop.classList.add('hidden');
        }

        saveStorage();
        renderAll();
        updateCoachAdvice();

        toast.show({
            message: `Deleted "${removed.text.slice(0, 20)}..."`,
            icon: '🗑️',
            actionText: 'Undo',
            duration: 5000,
            onAction: () => {
                if (State.lastDeleted) {
                    State.tasks.splice(State.lastDeleted.index, 0, State.lastDeleted.task);
                    sound.playPop();
                    saveStorage();
                    renderAll();
                    updateCoachAdvice();
                    toast.show({ message: 'Task restored!', icon: '↩️' });
                    State.lastDeleted = null;
                }
            }
        });
    }

    function toggleStar(id) {
        const task = State.tasks.find(t => t.id === id);
        if (!task) return;
        task.starred = !task.starred;
        sound.playPop();
        saveStorage();
        renderAll();
    }

    function clearDone() {
        const doneCount = State.tasks.filter(t => t.completed).length;
        if (doneCount === 0) {
            toast.show({ message: 'No completed tasks to clear.', icon: 'ℹ️' });
            return;
        }

        State.tasks = State.tasks.filter(t => !t.completed);
        sound.playSwoosh();
        saveStorage();
        renderAll();
        updateCoachAdvice();
        toast.show({ message: `Cleared ${doneCount} completed tasks!`, icon: '🧹' });
    }

    /* ==========================================================================
       18. FILTER & SORT PIPELINE
       ========================================================================== */
    function getProcessedTasks() {
        let result = [...State.tasks];

        // Status Filter
        if (State.currentFilter === 'active') result = result.filter(t => !t.completed);
        else if (State.currentFilter === 'completed') result = result.filter(t => t.completed);

        // Category Filter
        if (State.filterCategory !== 'all') result = result.filter(t => t.category === State.filterCategory);

        // Priority Filter
        if (State.filterPriority !== 'all') result = result.filter(t => t.priority === State.filterPriority);

        // Search Query
        if (State.searchTerm) {
            const q = State.searchTerm.toLowerCase();
            result = result.filter(t => {
                const titleMatch = t.text.toLowerCase().includes(q);
                const catMatch = t.category.toLowerCase().includes(q);
                const subMatch = t.subtasks && t.subtasks.some(s => s.text.toLowerCase().includes(q));
                return titleMatch || catMatch || subMatch;
            });
        }

        // Sorting
        const prioWeights = { high: 3, medium: 2, low: 1 };
        result.sort((a, b) => {
            // Starred items stay at the top
            if (a.starred !== b.starred) return b.starred ? 1 : -1;
            // Incomplete before completed
            if (a.completed !== b.completed) return a.completed ? 1 : -1;

            switch (State.sortOrder) {
                case 'priority':
                    return (prioWeights[b.priority] || 0) - (prioWeights[a.priority] || 0);
                case 'due':
                    if (!a.dueDate) return 1;
                    if (!b.dueDate) return -1;
                    return new Date(a.dueDate) - new Date(b.dueDate);
                case 'az':
                    return a.text.localeCompare(b.text);
                case 'newest':
                default:
                    return b.createdAt - a.createdAt;
            }
        });

        return result;
    }

    /* ==========================================================================
       19. RENDERING & UI SYNC
       ========================================================================== */
    function renderAll() {
        renderStats();
        renderHeatmap();
        if (State.viewMode === 'list') {
            DOM.tasksListView.classList.remove('hidden');
            DOM.kanbanView.classList.add('hidden');
            renderListView();
        } else {
            DOM.tasksListView.classList.add('hidden');
            DOM.kanbanView.classList.remove('hidden');
            renderKanbanView();
        }
    }

    function renderStats() {
        const total = State.tasks.length;
        const done = State.tasks.filter(t => t.completed).length;
        const active = total - done;
        const pct = total === 0 ? 0 : Math.round((done / total) * 100);

        if (DOM.statTotal) DOM.statTotal.textContent = total;
        if (DOM.statActive) DOM.statActive.textContent = active;
        if (DOM.statDone) DOM.statDone.textContent = done;
        if (DOM.scorePercent) DOM.scorePercent.textContent = `${pct}%`;
        if (DOM.statRatio) DOM.statRatio.textContent = `${done} of ${total} Completed`;

        // Update score SVG ring
        if (DOM.scoreRing) {
            const circumference = 2 * Math.PI * 38; // ~238.7
            const offset = circumference - (pct / 100) * circumference;
            DOM.scoreRing.style.strokeDashoffset = offset;
        }

        // Update filter tabs counters
        if (DOM.tabCountAll) DOM.tabCountAll.textContent = total;
        if (DOM.tabCountActive) DOM.tabCountActive.textContent = active;
        if (DOM.tabCountCompleted) DOM.tabCountCompleted.textContent = done;

        // Reset Filters visibility
        if (DOM.btnResetFilters) {
            const hasFilter = State.currentFilter !== 'all' || State.filterCategory !== 'all' || State.filterPriority !== 'all' || State.searchTerm !== '';
            DOM.btnResetFilters.classList.toggle('hidden', !hasFilter);
        }
    }

    function renderListView() {
        const tasks = getProcessedTasks();
        DOM.taskStream.innerHTML = '';

        if (tasks.length === 0) {
            DOM.taskStream.innerHTML = `
                <div style="text-align: center; padding: 50px 20px; color: var(--text-muted);">
                    <div style="font-size: 2.5rem; margin-bottom: 8px;">🚀</div>
                    <h3 style="font-size: 1.2rem; color: var(--text-primary); font-family: var(--font-heading);">All Clear!</h3>
                    <p style="font-size: 0.86rem; margin-top: 4px;">No tasks match your current view. Add one with the composer above.</p>
                </div>
            `;
            return;
        }

        tasks.forEach(t => {
            const li = document.createElement('li');
            li.className = `task-card-row ${t.completed ? 'is-completed' : ''}`;
            li.dataset.prio = t.priority;
            li.dataset.id = t.id;

            const prioClass = t.priority === 'high' ? 'tag-prio-high' : (t.priority === 'low' ? 'tag-prio-low' : 'tag-prio-med');
            const prioEmoji = t.priority === 'high' ? '🔥 High' : (t.priority === 'low' ? '🟢 Low' : '⚡ Med');

            // Due Date Badge
            let dueBadge = '';
            if (t.dueDate) {
                const today = new Date().toISOString().split('T')[0];
                const isOverdue = t.dueDate < today && !t.completed;
                const isToday = t.dueDate === today;
                dueBadge = `<span class="tag-bubble tag-due ${isOverdue ? 'overdue' : (isToday ? 'today' : '')}">📅 ${isToday ? 'Today' : (isOverdue ? 'Overdue' : t.dueDate)}</span>`;
            }

            // Subtasks Count
            let subtasksBadge = '';
            if (t.subtasks && t.subtasks.length > 0) {
                const completedSub = t.subtasks.filter(s => s.completed).length;
                subtasksBadge = `<span class="tag-bubble tag-subtasks">✓ ${completedSub}/${t.subtasks.length}</span>`;
            }

            li.innerHTML = `
                <div class="task-check-circle ${t.completed ? 'checked' : ''}" title="${t.completed ? 'Mark pending' : 'Mark done'}">
                    ${t.completed ? '✓' : ''}
                </div>

                <div class="task-info-block">
                    <span class="task-text-title" title="Double click to rename inline">${escapeHtml(t.text)}</span>
                    <div class="task-tags-row">
                        <span class="tag-bubble ${prioClass}">${prioEmoji}</span>
                        <span class="tag-bubble tag-category">${escapeHtml(t.category)}</span>
                        ${dueBadge}
                        ${subtasksBadge}
                    </div>
                </div>

                <div class="task-actions-group">
                    <button class="action-btn star-btn ${t.starred ? 'starred' : ''}" title="Star / Pin">
                        ${t.starred ? '★' : '☆'}
                    </button>
                    <button class="action-btn focus-btn" title="Send to Focus Studio">
                        ⏱️
                    </button>
                    <button class="action-btn delete-btn" title="Delete">
                        &times;
                    </button>
                </div>
            `;

            // Inline Double-Click Edit
            const titleSpan = li.querySelector('.task-text-title');
            titleSpan.ondblclick = (e) => {
                e.stopPropagation();
                const input = document.createElement('input');
                input.type = 'text';
                input.className = 'inline-edit-input';
                input.value = t.text;
                titleSpan.replaceWith(input);
                input.focus();
                input.select();

                let committed = false;
                const commitEdit = () => {
                    if (committed) return;
                    committed = true;
                    const newText = input.value.trim();
                    if (newText && newText !== t.text) {
                        t.text = newText;
                        sound.playPop();
                        saveStorage();
                        renderAll();
                        toast.show({ message: 'Task renamed!', icon: '✏️' });
                    } else {
                        renderAll();
                    }
                };

                input.onkeydown = (ke) => {
                    if (ke.key === 'Enter') {
                        ke.preventDefault();
                        commitEdit();
                    } else if (ke.key === 'Escape') {
                        committed = true;
                        renderAll();
                    }
                };
                input.onblur = commitEdit;
            };

            // Card Event Handlers
            li.querySelector('.task-check-circle').onclick = (e) => {
                e.stopPropagation();
                toggleTask(t.id);
            };

            li.querySelector('.star-btn').onclick = (e) => {
                e.stopPropagation();
                toggleStar(t.id);
            };

            li.querySelector('.focus-btn').onclick = (e) => {
                e.stopPropagation();
                setFocusTarget(t.id);
            };

            li.querySelector('.delete-btn').onclick = (e) => {
                e.stopPropagation();
                deleteTask(t.id);
            };

            li.onclick = (e) => {
                if (e.target.closest('.task-check-circle') || e.target.closest('.task-actions-group') || e.target.closest('.inline-edit-input')) return;
                openInspector(t.id);
            };

            DOM.taskStream.appendChild(li);
        });
    }

    function renderKanbanView() {
        const tasks = getProcessedTasks();
        Object.values(DOM.kbZones).forEach(z => z.innerHTML = '');

        const counts = { todo: 0, inprogress: 0, completed: 0 };

        tasks.forEach(t => {
            const status = t.completed ? 'completed' : (t.status || 'todo');
            if (counts[status] !== undefined) counts[status]++;

            const card = document.createElement('div');
            card.className = 'kb-item-card';
            card.draggable = true;
            card.dataset.id = t.id;

            card.innerHTML = `
                <div style="font-size:0.9rem; font-weight:600; color:var(--text-primary); word-break:break-word;">
                    ${escapeHtml(t.text)}
                </div>
                <div style="display:flex; justify-content:space-between; font-size:0.72rem; color:var(--text-muted); margin-top:4px;">
                    <span>${t.priority === 'high' ? '🔥 High' : (t.priority === 'low' ? '🟢 Low' : '⚡ Med')}</span>
                    <span>${escapeHtml(t.category)}</span>
                </div>
            `;

            card.ondragstart = (e) => {
                e.dataTransfer.setData('text/plain', t.id);
                card.style.opacity = '0.5';
            };
            card.ondragend = () => card.style.opacity = '1';
            card.onclick = () => openInspector(t.id);

            if (DOM.kbZones[status]) DOM.kbZones[status].appendChild(card);
        });

        DOM.kbCounts.todo.textContent = counts.todo;
        DOM.kbCounts.inprogress.textContent = counts.inprogress;
        DOM.kbCounts.completed.textContent = counts.completed;
    }

    // Kanban Dropzone Listeners
    Object.entries(DOM.kbZones).forEach(([status, zone]) => {
        zone.ondragover = (e) => {
            e.preventDefault();
            zone.classList.add('drag-over');
        };
        zone.ondragleave = () => zone.classList.remove('drag-over');
        zone.ondrop = (e) => {
            e.preventDefault();
            zone.classList.remove('drag-over');
            const id = Number(e.dataTransfer.getData('text/plain'));
            const task = State.tasks.find(t => t.id === id);
            if (task) {
                task.status = status;
                task.completed = (status === 'completed');
                if (task.completed) task.completedAt = Date.now();
                sound.playPop();
                if (task.completed) {
                    confetti.burst();
                    sound.playChime();
                    awardXp(30);
                }
                saveStorage();
                renderAll();
                updateCoachAdvice();
            }
        };
    });

    // Kanban Quick Add Buttons
    document.querySelectorAll('.kb-quick-add').forEach(btn => {
        btn.onclick = () => {
            const status = btn.dataset.status;
            DOM.taskInput.focus();
            window.scrollTo({ top: 0, behavior: 'smooth' });
            sound.playPop();
            toast.show({ message: `Type in composer to add to "${status.toUpperCase()}"`, icon: '💡' });
        };
    });

    /* ==========================================================================
       20. FOCUS POMODORO STUDIO
       ========================================================================== */
    function setFocusTarget(taskId) {
        const task = State.tasks.find(t => t.id === taskId);
        if (!task) return;
        State.pomodoro.targetTaskId = taskId;
        DOM.timerTargetTag.textContent = `Target: ${task.text}`;
        if (DOM.hudTaskName) DOM.hudTaskName.textContent = task.text;
        if (DOM.zenTaskTitle) DOM.zenTaskTitle.textContent = task.text;
        sound.playPop();
        toast.show({ message: `Target focused: "${task.text.slice(0, 24)}..."`, icon: '🎯' });
    }

    function formatTime(s) {
        const m = Math.floor(s / 60);
        const sec = s % 60;
        return `${m.toString().padStart(2, '0')}:${sec.toString().padStart(2, '0')}`;
    }

    function updateTimerDisplay() {
        const timeStr = formatTime(State.pomodoro.timeLeft);
        DOM.timerDigits.textContent = timeStr;

        // Dynamic Island HUD
        if (DOM.hudTime) DOM.hudTime.textContent = timeStr;
        if (DOM.dynamicIslandHud) {
            DOM.dynamicIslandHud.classList.toggle('hidden', !State.pomodoro.isRunning);
        }

        // Zen Mode digits
        if (DOM.zenTimerDigits) DOM.zenTimerDigits.textContent = timeStr;
        if (DOM.zenToggleBtn) DOM.zenToggleBtn.textContent = State.pomodoro.isRunning ? 'Pause Focus' : 'Start Focus';

        const circumference = 2 * Math.PI * 76; // ~477.5
        const frac = State.pomodoro.timeLeft / State.pomodoro.duration;
        const offset = circumference * (1 - frac);
        DOM.timerProgressRing.style.strokeDashoffset = offset;

        if (State.pomodoro.isRunning) {
            document.title = `(${timeStr}) Cyber Focus Studio`;
        } else {
            document.title = 'TaskFlow Hyper Studio — Next-Gen Productivity Experience';
        }
    }

    function toggleTimer() {
        if (State.pomodoro.isRunning) {
            clearInterval(State.pomodoro.interval);
            State.pomodoro.isRunning = false;
            DOM.timerToggleBtn.textContent = 'Resume Focus';
            sound.playPop();
        } else {
            State.pomodoro.isRunning = true;
            DOM.timerToggleBtn.textContent = 'Pause Focus';
            sound.playPop();

            State.pomodoro.interval = setInterval(() => {
                if (State.pomodoro.timeLeft > 0) {
                    State.pomodoro.timeLeft--;
                    updateTimerDisplay();
                } else {
                    clearInterval(State.pomodoro.interval);
                    State.pomodoro.isRunning = false;
                    DOM.timerToggleBtn.textContent = 'Start Focus';
                    sound.playAlarm();
                    confetti.burst();

                    const mins = Math.round(State.pomodoro.duration / 60);
                    awardXp(mins * 2);

                    toast.show({
                        message: `🏆 Session Finished! +${mins * 2} XP earned`,
                        icon: '🌟',
                        duration: 6000
                    });

                    if (State.pomodoro.targetTaskId) {
                        const target = State.tasks.find(t => t.id === State.pomodoro.targetTaskId);
                        if (target && !target.completed) {
                            if (confirm(`Did you complete your target task: "${target.text}"?`)) {
                                toggleTask(target.id);
                            }
                        }
                    }
                    resetTimer();
                }
            }, 1000);
        }
        updateTimerDisplay();
    }

    function resetTimer() {
        clearInterval(State.pomodoro.interval);
        State.pomodoro.isRunning = false;
        State.pomodoro.timeLeft = State.pomodoro.duration;
        DOM.timerToggleBtn.textContent = 'Start Focus';
        updateTimerDisplay();
    }

    DOM.timerToggleBtn.onclick = toggleTimer;
    DOM.timerResetBtn.onclick = resetTimer;

    DOM.focusPills.forEach(pill => {
        pill.onclick = () => {
            DOM.focusPills.forEach(p => p.classList.remove('active'));
            pill.classList.add('active');
            const mins = Number(pill.dataset.mins);
            State.pomodoro.duration = mins * 60;
            resetTimer();
            sound.playPop();
        };
    });

    DOM.ambientChips.forEach(chip => {
        chip.onclick = () => {
            DOM.ambientChips.forEach(c => c.classList.remove('active'));
            chip.classList.add('active');
            sound.startAmbient(chip.dataset.sound);
        };
    });

    if (DOM.ambientVolSlider) {
        DOM.ambientVolSlider.oninput = (e) => {
            const val = Number(e.target.value);
            sound.setAmbientVolume(val / 100);
            if (DOM.ambientVolVal) DOM.ambientVolVal.textContent = `${val}%`;
            if (DOM.ambientVolIcon) {
                DOM.ambientVolIcon.textContent = val === 0 ? '🔇' : (val < 50 ? '🔉' : '🔊');
            }
        };
    }

    /* ==========================================================================
       21. SLIDE-OVER INSPECTOR DRAWER
       ========================================================================== */
    function openInspector(taskId) {
        const task = State.tasks.find(t => t.id === taskId);
        if (!task) return;

        DOM.drawerTaskId.value = task.id;
        DOM.drawerTaskTitle.value = task.text;
        DOM.drawerTaskStatus.value = task.status || (task.completed ? 'completed' : 'todo');
        DOM.drawerTaskPrio.value = task.priority || 'medium';
        DOM.drawerTaskCat.value = task.category || '👤 Personal';
        DOM.drawerTaskDue.value = task.dueDate || '';
        DOM.drawerTaskNotes.value = task.notes || '';

        if (task.starred) DOM.drawerStarBtn.classList.add('starred');
        else DOM.drawerStarBtn.classList.remove('starred');

        renderDrawerSubtasks(task);
        DOM.drawerBackdrop.classList.remove('hidden');
        sound.playPop();
    }

    function renderDrawerSubtasks(task) {
        DOM.drawerSubtasksList.innerHTML = '';
        const subtasks = task.subtasks || [];
        const done = subtasks.filter(s => s.completed).length;
        DOM.drawerSubtasksCount.textContent = `${done}/${subtasks.length}`;

        subtasks.forEach((st, idx) => {
            const li = document.createElement('li');
            li.className = `drawer-st-item ${st.completed ? 'checked' : ''}`;
            li.innerHTML = `
                <input type="checkbox" class="st-box" ${st.completed ? 'checked' : ''}>
                <span>${escapeHtml(st.text)}</span>
                <button type="button" class="st-del" style="background:none; border:none; color:var(--text-muted); cursor:pointer;">&times;</button>
            `;

            li.querySelector('.st-box').onchange = (e) => {
                st.completed = e.target.checked;
                saveStorage();
                renderDrawerSubtasks(task);
                renderAll();
            };

            li.querySelector('.st-del').onclick = () => {
                task.subtasks.splice(idx, 1);
                saveStorage();
                renderDrawerSubtasks(task);
                renderAll();
            };

            DOM.drawerSubtasksList.appendChild(li);
        });
    }

    DOM.drawerAddSubtaskBtn.onclick = () => {
        const text = DOM.drawerNewSubtask.value.trim();
        if (!text) return;
        const taskId = Number(DOM.drawerTaskId.value);
        const task = State.tasks.find(t => t.id === taskId);
        if (task) {
            if (!task.subtasks) task.subtasks = [];
            task.subtasks.push({ id: Date.now(), text, completed: false });
            DOM.drawerNewSubtask.value = '';
            renderDrawerSubtasks(task);
            saveStorage();
            renderAll();
        }
    };

    DOM.drawerStarBtn.onclick = () => {
        const taskId = Number(DOM.drawerTaskId.value);
        toggleStar(taskId);
        const task = State.tasks.find(t => t.id === taskId);
        if (task && task.starred) DOM.drawerStarBtn.classList.add('starred');
        else DOM.drawerStarBtn.classList.remove('starred');
    };

    DOM.drawerSaveBtn.onclick = () => {
        const taskId = Number(DOM.drawerTaskId.value);
        const task = State.tasks.find(t => t.id === taskId);
        if (!task) return;

        task.text = DOM.drawerTaskTitle.value.trim() || task.text;
        task.status = DOM.drawerTaskStatus.value;
        task.completed = (task.status === 'completed');
        if (task.completed && !task.completedAt) task.completedAt = Date.now();
        task.priority = DOM.drawerTaskPrio.value;
        task.category = DOM.drawerTaskCat.value;
        task.dueDate = DOM.drawerTaskDue.value;
        task.notes = DOM.drawerTaskNotes.value.trim();

        saveStorage();
        renderAll();
        updateCoachAdvice();
        DOM.drawerBackdrop.classList.add('hidden');
        toast.show({ message: 'Task updated!', icon: '✅' });
        sound.playPop();
    };

    DOM.drawerDeleteBtn.onclick = () => {
        const taskId = Number(DOM.drawerTaskId.value);
        deleteTask(taskId);
    };

    DOM.drawerCloseBtn.onclick = () => DOM.drawerBackdrop.classList.add('hidden');
    DOM.drawerBackdrop.onclick = (e) => {
        if (e.target === DOM.drawerBackdrop) DOM.drawerBackdrop.classList.add('hidden');
    };

    /* ==========================================================================
       22. STAGED AI SUBTASKS & QUICK DATE CHIPS
       ========================================================================== */
    function renderStagedShelf() {
        DOM.shelfItems.innerHTML = '';
        if (State.stagedSubtasks.length === 0) {
            DOM.subtasksShelf.classList.add('hidden');
            return;
        }

        DOM.subtasksShelf.classList.remove('hidden');
        State.stagedSubtasks.forEach((st, idx) => {
            const chip = document.createElement('div');
            chip.className = 'shelf-item-chip';
            chip.innerHTML = `
                <span>${idx + 1}. ${escapeHtml(st)}</span>
                <button type="button">&times;</button>
            `;
            chip.querySelector('button').onclick = () => {
                State.stagedSubtasks.splice(idx, 1);
                renderStagedShelf();
            };
            DOM.shelfItems.appendChild(chip);
        });
    }

    DOM.aiBreakdownBtn.onclick = () => {
        const title = DOM.taskInput.value.trim();
        if (!title) {
            toast.show({ message: 'Type a task title first so AI can break it down!', icon: '💡' });
            return;
        }
        sound.playPop();
        State.stagedSubtasks = generateAiSubtasks(title);
        renderStagedShelf();
        toast.show({ message: `Generated ${State.stagedSubtasks.length} actionable subtasks!`, icon: '✨' });
    };

    DOM.clearShelfBtn.onclick = () => {
        State.stagedSubtasks = [];
        renderStagedShelf();
    };

    // Quick Date Chips
    document.querySelectorAll('.date-chip').forEach(chip => {
        chip.onclick = () => {
            const days = Number(chip.dataset.days);
            const d = new Date();
            d.setDate(d.getDate() + days);
            DOM.dueDateInput.value = d.toISOString().split('T')[0];
            sound.playPop();
        };
    });

    // Voice Dictation
    DOM.voiceBtn.onclick = () => {
        const Speech = window.SpeechRecognition || window.webkitSpeechRecognition;
        if (!Speech) {
            toast.show({ message: 'Speech recognition not supported in this browser.', icon: '⚠️' });
            return;
        }
        const rec = new Speech();
        rec.lang = 'en-US';
        rec.start();
        DOM.voicePulse.classList.remove('hidden');
        toast.show({ message: 'Listening... Speak your task!', icon: '🎙️' });

        rec.onresult = (e) => {
            const transcript = e.results[0][0].transcript;
            if (transcript) {
                DOM.taskInput.value = transcript;
                DOM.taskInput.focus();
                sound.playPop();
                toast.show({ message: `Captured: "${transcript}"`, icon: '🎤' });
            }
        };

        rec.onend = () => {
            DOM.voicePulse.classList.add('hidden');
        };
    };

    /* ==========================================================================
       23. THEME & AUDIO SWITCHER
       ========================================================================== */
    function updateThemeActiveUI(themeName) {
        DOM.themeOptions.forEach(opt => {
            opt.classList.toggle('active', opt.dataset.theme === themeName);
        });
    }

    function applyTheme(themeName) {
        document.documentElement.setAttribute('data-theme', themeName);
        localStorage.setItem('tf_hyper_theme', themeName);
        updateThemeActiveUI(themeName);
        sound.playPop();
        toast.show({ message: `Theme: ${themeName}`, icon: '🎨' });
    }

    DOM.themeBtn.onclick = (e) => {
        e.stopPropagation();
        DOM.themeMenu.classList.toggle('hidden');
        sound.playPop();
    };

    DOM.themeOptions.forEach(opt => {
        opt.onclick = () => {
            applyTheme(opt.dataset.theme);
            DOM.themeMenu.classList.add('hidden');
        };
    });

    document.addEventListener('click', (e) => {
        if (!DOM.themeBtn.contains(e.target) && !DOM.themeMenu.contains(e.target)) {
            DOM.themeMenu.classList.add('hidden');
        }
    });

    DOM.soundBtn.onclick = () => {
        const unmuted = sound.toggleMute();
        DOM.soundBtn.querySelector('.btn-icon').textContent = unmuted ? '🔊' : '🔇';
        toast.show({ message: unmuted ? 'Sound FX Enabled' : 'Audio Muted', icon: unmuted ? '🔊' : '🔇' });
    };

    /* ==========================================================================
       24. TOOLBAR, SEARCH & FILTER EVENTS
       ========================================================================== */
    DOM.prioChips.forEach(chip => {
        chip.onclick = () => {
            DOM.prioChips.forEach(c => c.classList.remove('active'));
            chip.classList.add('active');
            State.activeComposerPriority = chip.dataset.prio;
            sound.playPop();
        };
    });

    DOM.addTaskBtn.onclick = addTask;
    DOM.taskInput.onkeydown = (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            addTask();
        }
    };

    DOM.filterTabs.forEach(tab => {
        tab.onclick = () => {
            DOM.filterTabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            State.currentFilter = tab.dataset.filter;
            sound.playPop();
            renderAll();
        };
    });

    DOM.searchInput.oninput = (e) => {
        State.searchTerm = e.target.value.trim();
        DOM.searchClearBtn.classList.toggle('hidden', !State.searchTerm);
        renderAll();
    };

    DOM.searchClearBtn.onclick = () => {
        DOM.searchInput.value = '';
        State.searchTerm = '';
        DOM.searchClearBtn.classList.add('hidden');
        renderAll();
    };

    DOM.filterCategory.onchange = (e) => {
        State.filterCategory = e.target.value;
        renderAll();
    };

    DOM.filterPriority.onchange = (e) => {
        State.filterPriority = e.target.value;
        renderAll();
    };

    DOM.sortOrder.onchange = (e) => {
        State.sortOrder = e.target.value;
        renderAll();
    };

    if (DOM.btnResetFilters) {
        DOM.btnResetFilters.onclick = () => {
            State.currentFilter = 'all';
            State.filterCategory = 'all';
            State.filterPriority = 'all';
            State.searchTerm = '';
            DOM.searchInput.value = '';
            DOM.filterCategory.value = 'all';
            DOM.filterPriority.value = 'all';
            DOM.filterTabs.forEach(t => t.classList.toggle('active', t.dataset.filter === 'all'));
            DOM.searchClearBtn.classList.add('hidden');
            sound.playPop();
            renderAll();
            toast.show({ message: 'All filters reset', icon: '↺' });
        };
    }

    DOM.btnViewList.onclick = () => {
        State.viewMode = 'list';
        DOM.btnViewList.classList.add('active');
        DOM.btnViewKanban.classList.remove('active');
        sound.playPop();
        renderAll();
    };

    DOM.btnViewKanban.onclick = () => {
        State.viewMode = 'kanban';
        DOM.btnViewKanban.classList.add('active');
        DOM.btnViewList.classList.remove('active');
        sound.playPop();
        renderAll();
    };

    DOM.clearDoneBtn.onclick = clearDone;

    // Backup & Shortcuts Modal Handlers
    DOM.shortcutsBtn.onclick = () => {
        DOM.shortcutsModal.classList.remove('hidden');
        sound.playPop();
    };
    DOM.shortcutsClose.onclick = () => DOM.shortcutsModal.classList.add('hidden');

    DOM.dataBackupBtn.onclick = () => {
        DOM.backupModal.classList.remove('hidden');
        sound.playPop();
    };
    DOM.backupClose.onclick = () => DOM.backupModal.classList.add('hidden');

    DOM.btnExportJson.onclick = () => {
        const blob = new Blob([JSON.stringify(State.tasks, null, 2)], { type: 'application/json' });
        const a = document.createElement('a');
        a.href = URL.createObjectURL(blob);
        a.download = `taskflow-backup-${new Date().toISOString().split('T')[0]}.json`;
        a.click();
        toast.show({ message: 'JSON backup downloaded!', icon: '📥' });
        sound.playPop();
    };

    DOM.btnExportCsv.onclick = () => {
        let csv = 'ID,Task,Completed,Priority,Category,DueDate,CreatedAt\n';
        State.tasks.forEach(t => {
            csv += `${t.id},"${(t.text || '').replace(/"/g, '""')}",${t.completed},${t.priority},"${t.category}",${t.dueDate || ''},${new Date(t.createdAt).toISOString()}\n`;
        });
        const blob = new Blob([csv], { type: 'text/csv' });
        const a = document.createElement('a');
        a.href = URL.createObjectURL(blob);
        a.download = `taskflow-tasks-${new Date().toISOString().split('T')[0]}.csv`;
        a.click();
        toast.show({ message: 'CSV downloaded!', icon: '📊' });
        sound.playPop();
    };

    DOM.btnLoadDemo.onclick = () => {
        State.tasks = JSON.parse(JSON.stringify(DEMO_TASKS));
        saveStorage();
        renderAll();
        updateCoachAdvice();
        DOM.backupModal.classList.add('hidden');
        confetti.burst();
        sound.playChime();
        toast.show({ message: 'Showcase tasks loaded!', icon: '✨' });
    };

    /* ==========================================================================
       25. KEYBOARD SHORTCUTS
       ========================================================================== */
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            document.querySelectorAll('.modal-backdrop').forEach(m => m.classList.add('hidden'));
            if (DOM.drawerBackdrop) DOM.drawerBackdrop.classList.add('hidden');
            if (DOM.themeMenu) DOM.themeMenu.classList.add('hidden');
            if (DOM.zenOverlay) DOM.zenOverlay.classList.add('hidden');
            return;
        }

        const isTyping = ['INPUT', 'TEXTAREA', 'SELECT'].includes(document.activeElement.tagName);
        if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
            e.preventDefault();
            DOM.searchInput.focus();
            DOM.searchInput.select();
            return;
        }

        if (isTyping) return;

        if (e.key.toLowerCase() === 'n') {
            e.preventDefault();
            DOM.taskInput.focus();
        } else if (e.key.toLowerCase() === 'z') {
            if (DOM.zenOverlay.classList.contains('hidden')) openZenMode();
            else closeZenMode();
        } else if (e.key.toLowerCase() === 'p') {
            DOM.timerToggleBtn.click();
        } else if (e.key.toLowerCase() === 'm') {
            DOM.soundBtn.click();
        } else if (e.key.toLowerCase() === 't') {
            DOM.themeBtn.click();
        } else if (e.key.toLowerCase() === 'v') {
            if (State.viewMode === 'list') DOM.btnViewKanban.click();
            else DOM.btnViewList.click();
        } else if (e.key === '?') {
            DOM.shortcutsModal.classList.remove('hidden');
        }
    });

    /* ==========================================================================
       26. UTILITIES & INITIAL BOOTSTRAP
       ========================================================================== */
    function escapeHtml(str) {
        if (!str) return '';
        return String(str)
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#039;');
    }

    function init() {
        loadStorage();
        startLiveClock();
        setupSpotlight();
        init3DTiltPhysics();
        initCoach();
        updateProfileDisplay();
        updateTimerDisplay();
        renderAll();

        console.log('⚡ TaskFlow Hyper Studio initialized successfully.');
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
