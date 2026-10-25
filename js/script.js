/**
 * TASKFLOW — CLEAN & MINIMAL PRODUCTIVITY ENGINE
 * Architecture: Modular Vanilla ES6+ Web Application
 * Features:
 *  - 100% Zero Dummy Data on First Run (Ready for real daily use)
 *  - Distraction-Free Minimal Design (Linear / Apple / Notion aesthetic)
 *  - Full Responsiveness (Mobile 320px+ through Ultra-wide desktop)
 *  - Theme Engine: Light & Dark modes with persistent preference
 *  - Task Lifecycle: To Do, In Progress, Completed
 *  - Priority, Category, Due Dates & Overdue Badging
 *  - Subtasks Checklist & Smart Breakdown Suggestions
 *  - Dual View: Clean List View & Full Drag-and-Drop Kanban Board
 *  - Inline Double-Click Title Editing
 *  - Slide-Over Task Inspector / Edit Drawer
 *  - Built-in Focus Studio (Pomodoro timer with live nav indicator)
 *  - Web Audio Synthesizer: UI clicks/chimes + Generative Ambient Soundscapes
 *  - Comprehensive Search, Multi-Filter & Sort Ordering
 *  - Data Portability: JSON & CSV Export / Optional Demo Data Loader
 *  - Undo Toast System & Keyboard Shortcuts
 */

(() => {
    'use strict';

    /* ==========================================================================
       1. WEB AUDIO SYNTHESIZER & AMBIENT NOISE GENERATOR
       ========================================================================== */
    class SoundEngine {
        constructor() {
            this.audioCtx = null;
            this.muted = localStorage.getItem('taskflow_muted') === 'true';
            this.ambientNode = null;
            this.ambientGain = null;
            this.currentAmbient = 'none';
            this.ambientVolume = parseFloat(localStorage.getItem('taskflow_amb_vol') || '0.7');
        }

        init() {
            if (!this.audioCtx) {
                const AudioCtx = window.AudioContext || window.webkitAudioContext;
                if (AudioCtx) {
                    this.audioCtx = new AudioCtx();
                }
            }
            if (this.audioCtx && this.audioCtx.state === 'suspended') {
                this.audioCtx.resume();
            }
        }

        toggleMute() {
            this.muted = !this.muted;
            localStorage.setItem('taskflow_muted', this.muted);
            if (this.muted) {
                this.stopAmbient();
            }
            return !this.muted;
        }

        setAmbientVolume(vol) {
            this.ambientVolume = Math.max(0, Math.min(1, vol));
            localStorage.setItem('taskflow_amb_vol', this.ambientVolume);
            if (this.ambientGain && this.audioCtx) {
                this.ambientGain.gain.setValueAtTime(this.ambientVolume * 0.12, this.audioCtx.currentTime);
            }
        }

        playPop() {
            if (this.muted) return;
            this.init();
            if (!this.audioCtx) return;

            try {
                const osc = this.audioCtx.createOscillator();
                const gain = this.audioCtx.createGain();
                const now = this.audioCtx.currentTime;

                osc.type = 'sine';
                osc.frequency.setValueAtTime(400, now);
                osc.frequency.exponentialRampToValueAtTime(750, now + 0.06);

                gain.gain.setValueAtTime(0.12, now);
                gain.gain.exponentialRampToValueAtTime(0.001, now + 0.07);

                osc.connect(gain);
                gain.connect(this.audioCtx.destination);
                osc.start(now);
                osc.stop(now + 0.08);
            } catch (e) {}
        }

        playChime() {
            if (this.muted) return;
            this.init();
            if (!this.audioCtx) return;

            try {
                const notes = [523.25, 659.25, 783.99, 1046.5]; // C5, E5, G5, C6
                notes.forEach((f, i) => {
                    const osc = this.audioCtx.createOscillator();
                    const gain = this.audioCtx.createGain();
                    const now = this.audioCtx.currentTime + (i * 0.04);

                    osc.type = 'triangle';
                    osc.frequency.setValueAtTime(f, now);

                    gain.gain.setValueAtTime(0.08, now);
                    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.28);

                    osc.connect(gain);
                    gain.connect(this.audioCtx.destination);
                    osc.start(now);
                    osc.stop(now + 0.3);
                });
            } catch (e) {}
        }

        playSwoosh() {
            if (this.muted) return;
            this.init();
            if (!this.audioCtx) return;

            try {
                const osc = this.audioCtx.createOscillator();
                const gain = this.audioCtx.createGain();
                const now = this.audioCtx.currentTime;

                osc.type = 'sine';
                osc.frequency.setValueAtTime(600, now);
                osc.frequency.exponentialRampToValueAtTime(250, now + 0.08);

                gain.gain.setValueAtTime(0.1, now);
                gain.gain.exponentialRampToValueAtTime(0.001, now + 0.09);

                osc.connect(gain);
                gain.connect(this.audioCtx.destination);
                osc.start(now);
                osc.stop(now + 0.1);
            } catch (e) {}
        }

        setAmbient(type) {
            this.stopAmbient();
            this.currentAmbient = type;
            if (type === 'none' || this.muted) return;

            this.init();
            if (!this.audioCtx) return;

            try {
                const bufferSize = this.audioCtx.sampleRate * 2;
                const buffer = this.audioCtx.createBuffer(1, bufferSize, this.audioCtx.sampleRate);
                const data = buffer.getChannelData(0);

                if (type === 'rain') {
                    for (let i = 0; i < bufferSize; i++) {
                        data[i] = (Math.random() * 2 - 1) * 0.5;
                    }
                } else if (type === 'whitenoise') {
                    for (let i = 0; i < bufferSize; i++) {
                        data[i] = (Math.random() * 2 - 1) * 0.35;
                    }
                } else if (type === 'ocean') {
                    let lastOut = 0.0;
                    for (let i = 0; i < bufferSize; i++) {
                        const white = Math.random() * 2 - 1;
                        data[i] = (lastOut + (0.02 * white)) / 1.02;
                        lastOut = data[i];
                        data[i] *= 2.8;
                    }
                } else if (type === 'binaural') {
                    for (let i = 0; i < bufferSize; i++) {
                        const t = i / this.audioCtx.sampleRate;
                        data[i] = Math.sin(2 * Math.PI * 136.1 * t) * 0.25;
                    }
                }

                const noise = this.audioCtx.createBufferSource();
                noise.buffer = buffer;
                noise.loop = true;

                const filter = this.audioCtx.createBiquadFilter();
                filter.type = type === 'rain' ? 'lowpass' : (type === 'whitenoise' ? 'bandpass' : 'lowpass');
                filter.frequency.setValueAtTime(type === 'rain' ? 850 : (type === 'whitenoise' ? 1200 : 420), this.audioCtx.currentTime);

                this.ambientGain = this.audioCtx.createGain();
                this.ambientGain.gain.setValueAtTime(this.ambientVolume * 0.12, this.audioCtx.currentTime);

                noise.connect(filter);
                filter.connect(this.ambientGain);
                this.ambientGain.connect(this.audioCtx.destination);

                noise.start();
                this.ambientNode = noise;
            } catch (e) {
                console.warn('Ambient sound unavailable:', e);
            }
        }

        stopAmbient() {
            if (this.ambientNode) {
                try {
                    this.ambientNode.stop();
                    this.ambientNode.disconnect();
                } catch (e) {}
                this.ambientNode = null;
            }
            this.currentAmbient = 'none';
        }
    }

    /* ==========================================================================
       2. APPLICATION STATE & PERSISTENCE
       ========================================================================== */
    const STORAGE_KEY_TASKS = 'taskflow_tasks_v2';
    const STORAGE_KEY_THEME = 'taskflow_theme';
    const STORAGE_KEY_VIEW = 'taskflow_view';
    const STORAGE_KEY_PROFILE = 'taskflow_profile';

    class AppState {
        constructor() {
            this.tasks = [];
            this.filterStatus = 'all'; // 'all' | 'active' | 'completed'
            this.filterCategory = 'all';
            this.filterPriority = 'all';
            this.sortOrder = 'newest';
            this.searchQuery = '';
            this.currentView = localStorage.getItem(STORAGE_KEY_VIEW) || 'list'; // 'list' | 'kanban'
            this.theme = localStorage.getItem(STORAGE_KEY_THEME) || 'dark';
            this.profile = {
                streak: 0,
                lastCompletedDate: null
            };
            this.stagedSubtasks = [];
            this.deletedTaskBackup = null;

            this.load();
        }

        load() {
            try {
                const rawTasks = localStorage.getItem(STORAGE_KEY_TASKS);
                if (rawTasks) {
                    this.tasks = JSON.parse(rawTasks);
                } else {
                    // Deployment ready: Zero dummy data on first launch
                    this.tasks = [];
                }
            } catch (e) {
                console.error('Failed to parse stored tasks:', e);
                this.tasks = [];
            }

            try {
                const rawProfile = localStorage.getItem(STORAGE_KEY_PROFILE);
                if (rawProfile) {
                    this.profile = { ...this.profile, ...JSON.parse(rawProfile) };
                }
            } catch (e) {}
        }

        save() {
            try {
                localStorage.setItem(STORAGE_KEY_TASKS, JSON.stringify(this.tasks));
                localStorage.setItem(STORAGE_KEY_PROFILE, JSON.stringify(this.profile));
                localStorage.setItem(STORAGE_KEY_VIEW, this.currentView);
                localStorage.setItem(STORAGE_KEY_THEME, this.theme);
            } catch (e) {
                console.error('Storage quota exceeded or error saving:', e);
            }
        }

        checkStreak() {
            const todayStr = new Date().toISOString().split('T')[0];
            if (this.profile.lastCompletedDate === todayStr) return;

            const yesterday = new Date();
            yesterday.setDate(yesterday.getDate() - 1);
            const yesterdayStr = yesterday.toISOString().split('T')[0];

            if (this.profile.lastCompletedDate === yesterdayStr) {
                this.profile.streak += 1;
            } else if (!this.profile.lastCompletedDate) {
                this.profile.streak = 1;
            } else {
                this.profile.streak = 1;
            }
            this.profile.lastCompletedDate = todayStr;
            this.save();
        }

        addTask(taskData) {
            const newTask = {
                id: 'task_' + Date.now() + '_' + Math.random().toString(36).substr(2, 6),
                title: taskData.title.trim(),
                status: taskData.status || 'todo', // 'todo' | 'inprogress' | 'completed'
                priority: taskData.priority || 'medium', // 'low' | 'medium' | 'high'
                category: taskData.category || '👤 Personal',
                dueDate: taskData.dueDate || '',
                notes: taskData.notes || '',
                subtasks: taskData.subtasks ? [...taskData.subtasks] : [],
                starred: !!taskData.starred,
                createdAt: new Date().toISOString(),
                completedAt: taskData.status === 'completed' ? new Date().toISOString() : null
            };

            this.tasks.unshift(newTask);
            this.save();
            return newTask;
        }

        updateTask(id, patch) {
            const task = this.tasks.find(t => t.id === id);
            if (!task) return null;

            const prevStatus = task.status;
            Object.assign(task, patch);

            if (patch.status === 'completed' && prevStatus !== 'completed') {
                task.completedAt = new Date().toISOString();
                this.checkStreak();
            } else if (patch.status && patch.status !== 'completed') {
                task.completedAt = null;
            }

            this.save();
            return task;
        }

        deleteTask(id) {
            const index = this.tasks.findIndex(t => t.id === id);
            if (index === -1) return null;

            const removed = this.tasks.splice(index, 1)[0];
            this.deletedTaskBackup = { task: removed, index };
            this.save();
            return removed;
        }

        restoreLastDeleted() {
            if (!this.deletedTaskBackup) return null;
            const { task, index } = this.deletedTaskBackup;
            const insertIdx = Math.min(index, this.tasks.length);
            this.tasks.splice(insertIdx, 0, task);
            this.deletedTaskBackup = null;
            this.save();
            return task;
        }

        clearCompleted() {
            const removed = this.tasks.filter(t => t.status === 'completed');
            this.tasks = this.tasks.filter(t => t.status !== 'completed');
            this.save();
            return removed.length;
        }

        getFilteredTasks() {
            return this.tasks.filter(task => {
                // Status Filter
                if (this.filterStatus === 'active') {
                    if (task.status === 'completed') return false;
                } else if (this.filterStatus === 'completed') {
                    if (task.status !== 'completed') return false;
                }

                // Category Filter
                if (this.filterCategory !== 'all' && task.category !== this.filterCategory) {
                    return false;
                }

                // Priority Filter
                if (this.filterPriority !== 'all' && task.priority !== this.filterPriority) {
                    return false;
                }

                // Search Query
                if (this.searchQuery) {
                    const q = this.searchQuery.toLowerCase();
                    const titleMatch = task.title.toLowerCase().includes(q);
                    const catMatch = task.category.toLowerCase().includes(q);
                    const notesMatch = (task.notes || '').toLowerCase().includes(q);
                    const subtaskMatch = task.subtasks && task.subtasks.some(st => st.text.toLowerCase().includes(q));
                    if (!titleMatch && !catMatch && !notesMatch && !subtaskMatch) {
                        return false;
                    }
                }

                return true;
            }).sort((a, b) => {
                // Pinned / Starred items float to top
                if (a.starred && !b.starred) return -1;
                if (!a.starred && b.starred) return 1;

                if (this.sortOrder === 'priority') {
                    const weight = { high: 3, medium: 2, low: 1 };
                    return (weight[b.priority] || 0) - (weight[a.priority] || 0);
                }
                if (this.sortOrder === 'due') {
                    if (!a.dueDate) return 1;
                    if (!b.dueDate) return -1;
                    return new Date(a.dueDate) - new Date(b.dueDate);
                }
                if (this.sortOrder === 'az') {
                    return a.title.localeCompare(b.title);
                }
                // Default 'newest'
                return new Date(b.createdAt) - new Date(a.createdAt);
            });
        }
    }

    /* ==========================================================================
       3. FOCUS TIMER (POMODORO) ENGINE
       ========================================================================== */
    class FocusTimer {
        constructor(soundEngine, onTick, onComplete) {
            this.soundEngine = soundEngine;
            this.onTick = onTick;
            this.onComplete = onComplete;
            this.duration = 25 * 60; // in seconds
            this.remaining = 25 * 60;
            this.isRunning = false;
            this.timerInterval = null;
            this.targetTask = null;
        }

        setDuration(minutes) {
            this.pause();
            this.duration = minutes * 60;
            this.remaining = this.duration;
            this.onTick(this.remaining, this.duration);
        }

        setTarget(task) {
            this.targetTask = task;
        }

        start() {
            if (this.isRunning) return;
            this.soundEngine.init();
            this.soundEngine.playPop();
            this.isRunning = true;

            this.timerInterval = setInterval(() => {
                if (this.remaining > 0) {
                    this.remaining--;
                    this.onTick(this.remaining, this.duration);
                } else {
                    this.finish();
                }
            }, 1000);
        }

        pause() {
            if (!this.isRunning) return;
            this.soundEngine.playPop();
            this.isRunning = false;
            clearInterval(this.timerInterval);
            this.timerInterval = null;
        }

        reset() {
            this.pause();
            this.remaining = this.duration;
            this.onTick(this.remaining, this.duration);
        }

        finish() {
            this.pause();
            this.soundEngine.playChime();
            if (this.onComplete) {
                this.onComplete(this.targetTask);
            }
        }
    }

    /* ==========================================================================
       4. MAIN CONTROLLER & DOM INTEGRATION
       ========================================================================== */
    class TaskFlowApp {
        constructor() {
            this.state = new AppState();
            this.sound = new SoundEngine();

            // Cache DOM Elements
            this.cacheDom();

            // Initialize Focus Timer
            this.timer = new FocusTimer(
                this.sound,
                (rem, total) => this.handleTimerTick(rem, total),
                (task) => this.handleTimerComplete(task)
            );

            // Bind Events & Initial Render
            this.initTheme();
            this.initDate();
            this.bindEvents();
            this.renderAll();
        }

        cacheDom() {
            // Header
            this.elCurrentDate = document.getElementById('current-date');
            this.elNavFocusPill = document.getElementById('nav-focus-pill');
            this.elNavFocusTime = document.getElementById('nav-focus-time');
            this.elSoundBtn = document.getElementById('sound-btn');
            this.elSoundIcon = document.getElementById('sound-icon');
            this.elThemeBtn = document.getElementById('theme-btn');
            this.elThemeIcon = document.getElementById('theme-icon');
            this.elBackupBtn = document.getElementById('backup-btn');
            this.elShortcutsBtn = document.getElementById('shortcuts-btn');

            // Overview Strip
            this.elStatRatio = document.getElementById('stat-ratio');
            this.elProgressBar = document.getElementById('progress-bar-fill');
            this.elStatTotal = document.getElementById('stat-total');
            this.elStatActive = document.getElementById('stat-active');
            this.elStatDone = document.getElementById('stat-done');
            this.elStatStreak = document.getElementById('stat-streak');

            // Composer
            this.elTaskForm = document.getElementById('task-form');
            this.elTaskInput = document.getElementById('task-input');
            this.elAddTaskBtn = document.getElementById('add-task-btn');
            this.elPriorityChips = document.querySelectorAll('.chip-prio');
            this.elProjectSelect = document.getElementById('project-select');
            this.elDueDateInput = document.getElementById('due-date-input');
            this.elDateChips = document.querySelectorAll('.chip-date');
            this.elAiBreakdownBtn = document.getElementById('ai-breakdown-btn');
            this.elStagedShelf = document.getElementById('staged-shelf');
            this.elShelfList = document.getElementById('shelf-list');
            this.elClearShelfBtn = document.getElementById('clear-shelf-btn');

            // Focus Timer
            this.elTimerDisplay = document.getElementById('timer-display');
            this.elTimerTarget = document.getElementById('timer-target');
            this.elTimerStartBtn = document.getElementById('timer-start-btn');
            this.elTimerResetBtn = document.getElementById('timer-reset-btn');
            this.elPresetBtns = document.querySelectorAll('.preset-btn');
            this.elAmbChips = document.querySelectorAll('.amb-chip');
            this.elVolSlider = document.getElementById('vol-slider');
            this.elVolIcon = document.getElementById('vol-icon');

            // Toolbar & Views
            this.elSearchInput = document.getElementById('search-input');
            this.elSearchClearBtn = document.getElementById('search-clear-btn');
            this.elTabBtns = document.querySelectorAll('.tab-btn');
            this.elTabCntAll = document.getElementById('tab-cnt-all');
            this.elTabCntActive = document.getElementById('tab-cnt-active');
            this.elTabCntDone = document.getElementById('tab-cnt-done');
            this.elFilterCategory = document.getElementById('filter-category');
            this.elFilterPriority = document.getElementById('filter-priority');
            this.elSortOrder = document.getElementById('sort-order');
            this.elViewListBtn = document.getElementById('view-list-btn');
            this.elViewKanbanBtn = document.getElementById('view-kanban-btn');
            this.elClearDoneBtn = document.getElementById('clear-done-btn');
            this.elFiltersBanner = document.getElementById('filters-active-banner');
            this.elResetFiltersBtn = document.getElementById('reset-filters-btn');

            // Containers
            this.elListView = document.getElementById('list-view');
            this.elTaskList = document.getElementById('task-list');
            this.elKanbanView = document.getElementById('kanban-view');
            this.elKbDropTodo = document.getElementById('kb-drop-todo');
            this.elKbDropInprog = document.getElementById('kb-drop-inprogress');
            this.elKbDropDone = document.getElementById('kb-drop-completed');
            this.elKbCntTodo = document.getElementById('kb-cnt-todo');
            this.elKbCntInprog = document.getElementById('kb-cnt-inprogress');
            this.elKbCntDone = document.getElementById('kb-cnt-completed');
            this.elKbAddBtns = document.querySelectorAll('.kb-add-btn');

            // Slide-over Drawer
            this.elDrawerBackdrop = document.getElementById('drawer-backdrop');
            this.elTaskDrawer = document.getElementById('task-drawer');
            this.elDrawerTaskId = document.getElementById('drawer-task-id');
            this.elDrawerTitle = document.getElementById('drawer-task-title');
            this.elDrawerStatus = document.getElementById('drawer-task-status');
            this.elDrawerPrio = document.getElementById('drawer-task-prio');
            this.elDrawerCat = document.getElementById('drawer-task-cat');
            this.elDrawerDue = document.getElementById('drawer-task-due');
            this.elDrawerChecklistCnt = document.getElementById('drawer-checklist-cnt');
            this.elDrawerNewSubtask = document.getElementById('drawer-new-subtask');
            this.elDrawerAddSubtaskBtn = document.getElementById('drawer-add-subtask-btn');
            this.elDrawerSubtasksList = document.getElementById('drawer-subtasks-list');
            this.elDrawerNotes = document.getElementById('drawer-task-notes');
            this.elDrawerStarBtn = document.getElementById('drawer-star-btn');
            this.elDrawerCloseBtn = document.getElementById('drawer-close-btn');
            this.elDrawerDeleteBtn = document.getElementById('drawer-delete-btn');
            this.elDrawerSaveBtn = document.getElementById('drawer-save-btn');

            // Modals
            this.elShortcutsModal = document.getElementById('shortcuts-modal');
            this.elShortcutsClose = document.getElementById('shortcuts-close');
            this.elBackupModal = document.getElementById('backup-modal');
            this.elBackupClose = document.getElementById('backup-close');
            this.elBtnExportJson = document.getElementById('btn-export-json');
            this.elBtnExportCsv = document.getElementById('btn-export-csv');
            this.elBtnLoadDemo = document.getElementById('btn-load-demo');

            // Toast Container
            this.elToastContainer = document.getElementById('toast-container');
        }

        /* ----------------------------------------------------------------------
           THEME & DATE SETUP
           ---------------------------------------------------------------------- */
        initTheme() {
            const currentTheme = this.state.theme || 'dark';
            document.documentElement.setAttribute('data-theme', currentTheme);
            if (this.elThemeIcon) {
                this.elThemeIcon.textContent = currentTheme === 'dark' ? '🌙' : '☀️';
            }
            if (this.elSoundIcon) {
                this.elSoundIcon.textContent = this.sound.muted ? '🔇' : '🔊';
            }
            if (this.elVolSlider) {
                this.elVolSlider.value = Math.round(this.sound.ambientVolume * 100);
            }
        }

        toggleTheme() {
            const current = document.documentElement.getAttribute('data-theme') || 'dark';
            const next = current === 'dark' ? 'light' : 'dark';
            document.documentElement.setAttribute('data-theme', next);
            this.state.theme = next;
            this.state.save();
            if (this.elThemeIcon) {
                this.elThemeIcon.textContent = next === 'dark' ? '🌙' : '☀️';
            }
            this.sound.playPop();
            this.showToast(`Switched to ${next === 'dark' ? 'Dark' : 'Light'} theme`);
        }

        initDate() {
            if (!this.elCurrentDate) return;
            const now = new Date();
            const opts = { weekday: 'short', month: 'short', day: 'numeric' };
            this.elCurrentDate.textContent = now.toLocaleDateString('en-US', opts);
        }

        /* ----------------------------------------------------------------------
           EVENT BINDINGS
           ---------------------------------------------------------------------- */
        bindEvents() {
            // Theme & Sound Header Buttons
            if (this.elThemeBtn) {
                this.elThemeBtn.addEventListener('click', () => this.toggleTheme());
            }
            if (this.elSoundBtn) {
                this.elSoundBtn.addEventListener('click', () => {
                    const unmuted = this.sound.toggleMute();
                    this.elSoundIcon.textContent = unmuted ? '🔊' : '🔇';
                    this.showToast(unmuted ? 'Sound enabled' : 'Sound muted');
                });
            }

            // Shortcuts & Backup Modals
            if (this.elShortcutsBtn) {
                this.elShortcutsBtn.addEventListener('click', () => this.openModal(this.elShortcutsModal));
            }
            if (this.elShortcutsClose) {
                this.elShortcutsClose.addEventListener('click', () => this.closeModal(this.elShortcutsModal));
            }
            if (this.elBackupBtn) {
                this.elBackupBtn.addEventListener('click', () => this.openModal(this.elBackupModal));
            }
            if (this.elBackupClose) {
                this.elBackupClose.addEventListener('click', () => this.closeModal(this.elBackupModal));
            }

            // Backup Actions
            if (this.elBtnExportJson) {
                this.elBtnExportJson.addEventListener('click', () => this.exportJSON());
            }
            if (this.elBtnExportCsv) {
                this.elBtnExportCsv.addEventListener('click', () => this.exportCSV());
            }
            if (this.elBtnLoadDemo) {
                this.elBtnLoadDemo.addEventListener('click', () => this.loadShowcaseData());
            }

            // Priority Chips Selection in Composer
            this.elPriorityChips.forEach(chip => {
                chip.addEventListener('click', () => {
                    this.elPriorityChips.forEach(c => c.classList.remove('active'));
                    chip.classList.add('active');
                    this.sound.playPop();
                });
            });

            // Quick Date Chips in Composer
            this.elDateChips.forEach(chip => {
                chip.addEventListener('click', () => {
                    const days = parseInt(chip.dataset.days, 10);
                    const d = new Date();
                    d.setDate(d.getDate() + days);
                    const formatted = d.toISOString().split('T')[0];
                    if (this.elDueDateInput) {
                        this.elDueDateInput.value = formatted;
                    }
                    this.sound.playPop();
                });
            });

            // Task Composer Submit
            if (this.elTaskForm) {
                this.elTaskForm.addEventListener('submit', (e) => {
                    e.preventDefault();
                    this.handleAddTask();
                });
            }

            // AI Subtask Breakdown Trigger
            if (this.elAiBreakdownBtn) {
                this.elAiBreakdownBtn.addEventListener('click', () => this.generateSubtasks());
            }
            if (this.elClearShelfBtn) {
                this.elClearShelfBtn.addEventListener('click', () => {
                    this.state.stagedSubtasks = [];
                    this.renderStagedShelf();
                });
            }

            // Focus Timer Presets
            this.elPresetBtns.forEach(btn => {
                btn.addEventListener('click', () => {
                    this.elPresetBtns.forEach(b => b.classList.remove('active'));
                    btn.classList.add('active');
                    const mins = parseInt(btn.dataset.mins, 10);
                    this.timer.setDuration(mins);
                    this.sound.playPop();
                });
            });

            // Focus Timer Controls
            if (this.elTimerStartBtn) {
                this.elTimerStartBtn.addEventListener('click', () => {
                    if (this.timer.isRunning) {
                        this.timer.pause();
                        this.elTimerStartBtn.textContent = 'Resume';
                    } else {
                        this.timer.start();
                        this.elTimerStartBtn.textContent = 'Pause';
                        if (this.elNavFocusPill) this.elNavFocusPill.classList.remove('hidden');
                    }
                });
            }
            if (this.elTimerResetBtn) {
                this.elTimerResetBtn.addEventListener('click', () => {
                    this.timer.reset();
                    if (this.elTimerStartBtn) this.elTimerStartBtn.textContent = 'Start';
                    if (this.elNavFocusPill) this.elNavFocusPill.classList.add('hidden');
                });
            }
            if (this.elNavFocusPill) {
                this.elNavFocusPill.addEventListener('click', () => {
                    const focusCard = document.querySelector('.focus-card');
                    if (focusCard) {
                        focusCard.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    }
                });
            }

            // Ambient Soundscapes
            this.elAmbChips.forEach(chip => {
                chip.addEventListener('click', () => {
                    this.elAmbChips.forEach(c => c.classList.remove('active'));
                    chip.classList.add('active');
                    const soundType = chip.dataset.sound;
                    this.sound.setAmbient(soundType);
                });
            });
            if (this.elVolSlider) {
                this.elVolSlider.addEventListener('input', (e) => {
                    const val = parseFloat(e.target.value) / 100;
                    this.sound.setAmbientVolume(val);
                    if (this.elVolIcon) {
                        this.elVolIcon.textContent = val === 0 ? '🔇' : (val < 0.5 ? '🔉' : '🔊');
                    }
                });
            }

            // Search Bar & Clear Search
            if (this.elSearchInput) {
                this.elSearchInput.addEventListener('input', (e) => {
                    this.state.searchQuery = e.target.value.trim();
                    if (this.elSearchClearBtn) {
                        this.elSearchClearBtn.classList.toggle('hidden', !this.state.searchQuery);
                    }
                    this.renderTasks();
                    this.checkActiveFilters();
                });
            }
            if (this.elSearchClearBtn) {
                this.elSearchClearBtn.addEventListener('click', () => {
                    if (this.elSearchInput) this.elSearchInput.value = '';
                    this.state.searchQuery = '';
                    this.elSearchClearBtn.classList.add('hidden');
                    this.renderTasks();
                    this.checkActiveFilters();
                });
            }

            // Filter Tabs (All / Active / Completed)
            this.elTabBtns.forEach(btn => {
                btn.addEventListener('click', () => {
                    this.elTabBtns.forEach(b => b.classList.remove('active'));
                    btn.classList.add('active');
                    this.state.filterStatus = btn.dataset.filter;
                    this.sound.playPop();
                    this.renderTasks();
                    this.checkActiveFilters();
                });
            });

            // Secondary Filters: Category, Priority, Sort Order
            if (this.elFilterCategory) {
                this.elFilterCategory.addEventListener('change', (e) => {
                    this.state.filterCategory = e.target.value;
                    this.renderTasks();
                    this.checkActiveFilters();
                });
            }
            if (this.elFilterPriority) {
                this.elFilterPriority.addEventListener('change', (e) => {
                    this.state.filterPriority = e.target.value;
                    this.renderTasks();
                    this.checkActiveFilters();
                });
            }
            if (this.elSortOrder) {
                this.elSortOrder.addEventListener('change', (e) => {
                    this.state.sortOrder = e.target.value;
                    this.renderTasks();
                });
            }

            // Reset Active Filters
            if (this.elResetFiltersBtn) {
                this.elResetFiltersBtn.addEventListener('click', () => {
                    this.resetAllFilters();
                });
            }

            // View Switcher (List vs Kanban)
            if (this.elViewListBtn) {
                this.elViewListBtn.addEventListener('click', () => this.switchView('list'));
            }
            if (this.elViewKanbanBtn) {
                this.elViewKanbanBtn.addEventListener('click', () => this.switchView('kanban'));
            }

            // Clear Completed Tasks
            if (this.elClearDoneBtn) {
                this.elClearDoneBtn.addEventListener('click', () => {
                    const count = this.state.clearCompleted();
                    if (count > 0) {
                        this.sound.playPop();
                        this.renderAll();
                        this.showToast(`Cleared ${count} completed task${count > 1 ? 's' : ''}`);
                    } else {
                        this.showToast('No completed tasks to clear');
                    }
                });
            }

            // Kanban Column Quick Add Buttons
            this.elKbAddBtns.forEach(btn => {
                btn.addEventListener('click', () => {
                    const colStatus = btn.dataset.status;
                    const title = prompt(`Add a new card to "${colStatus.toUpperCase()}":`);
                    if (title && title.trim()) {
                        this.state.addTask({
                            title: title.trim(),
                            status: colStatus,
                            priority: 'medium',
                            category: '💼 Work'
                        });
                        this.sound.playChime();
                        this.renderAll();
                        this.showToast('Card added');
                    }
                });
            });

            // Drawer Controls
            if (this.elDrawerCloseBtn) {
                this.elDrawerCloseBtn.addEventListener('click', () => this.closeDrawer());
            }
            if (this.elDrawerBackdrop) {
                this.elDrawerBackdrop.addEventListener('click', (e) => {
                    if (e.target === this.elDrawerBackdrop) this.closeDrawer();
                });
            }
            if (this.elDrawerSaveBtn) {
                this.elDrawerSaveBtn.addEventListener('click', () => this.saveDrawerTask());
            }
            if (this.elDrawerDeleteBtn) {
                this.elDrawerDeleteBtn.addEventListener('click', () => {
                    const id = this.elDrawerTaskId.value;
                    if (id) {
                        this.deleteTaskWithUndo(id);
                        this.closeDrawer();
                    }
                });
            }
            if (this.elDrawerStarBtn) {
                this.elDrawerStarBtn.addEventListener('click', () => {
                    const id = this.elDrawerTaskId.value;
                    const task = this.state.tasks.find(t => t.id === id);
                    if (task) {
                        task.starred = !task.starred;
                        this.elDrawerStarBtn.classList.toggle('active', task.starred);
                        this.state.save();
                        this.renderTasks();
                        this.sound.playPop();
                    }
                });
            }
            if (this.elDrawerAddSubtaskBtn) {
                this.elDrawerAddSubtaskBtn.addEventListener('click', () => this.addDrawerSubtask());
            }
            if (this.elDrawerNewSubtask) {
                this.elDrawerNewSubtask.addEventListener('keydown', (e) => {
                    if (e.key === 'Enter') {
                        e.preventDefault();
                        this.addDrawerSubtask();
                    }
                });
            }

            // Keyboard Shortcuts
            window.addEventListener('keydown', (e) => {
                const activeTag = document.activeElement ? document.activeElement.tagName.toLowerCase() : '';
                const isInputActive = activeTag === 'input' || activeTag === 'textarea' || activeTag === 'select';

                if (e.key === 'Escape') {
                    this.closeDrawer();
                    this.closeModal(this.elShortcutsModal);
                    this.closeModal(this.elBackupModal);
                    return;
                }

                if (isInputActive) return;

                if (e.key === 'n' || e.key === 'N') {
                    e.preventDefault();
                    if (this.elTaskInput) {
                        this.elTaskInput.focus();
                        this.elTaskInput.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    }
                } else if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
                    e.preventDefault();
                    if (this.elSearchInput) {
                        this.elSearchInput.focus();
                    }
                } else if (e.key === 'p' || e.key === 'P') {
                    e.preventDefault();
                    if (this.elTimerStartBtn) this.elTimerStartBtn.click();
                } else if (e.key === 'm' || e.key === 'M') {
                    e.preventDefault();
                    if (this.elSoundBtn) this.elSoundBtn.click();
                } else if (e.key === 't' || e.key === 'T') {
                    e.preventDefault();
                    this.toggleTheme();
                } else if (e.key === 'v' || e.key === 'V') {
                    e.preventDefault();
                    this.switchView(this.state.currentView === 'list' ? 'kanban' : 'list');
                } else if (e.key === '?') {
                    e.preventDefault();
                    this.openModal(this.elShortcutsModal);
                }
            });

            // Drag and drop setup for Kanban columns
            this.setupKanbanDragAndDrop();
        }

        /* ----------------------------------------------------------------------
           FOCUS TIMER HANDLERS
           ---------------------------------------------------------------------- */
        handleTimerTick(remaining, total) {
            const mins = Math.floor(remaining / 60);
            const secs = remaining % 60;
            const formatted = `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;

            if (this.elTimerDisplay) {
                this.elTimerDisplay.textContent = formatted;
            }
            if (this.elNavFocusTime) {
                this.elNavFocusTime.textContent = formatted;
            }
        }

        handleTimerComplete(targetTask) {
            if (this.elTimerStartBtn) this.elTimerStartBtn.textContent = 'Start';
            if (this.elNavFocusPill) this.elNavFocusPill.classList.add('hidden');

            if (targetTask) {
                this.showToast(`Focus session completed for "${targetTask.title}"! 🎉`);
            } else {
                this.showToast('Focus session complete! Take a mindful breather. 🍵');
            }
        }

        /* ----------------------------------------------------------------------
           MODALS & TOASTS
           ---------------------------------------------------------------------- */
        openModal(modal) {
            if (!modal) return;
            modal.classList.remove('hidden');
            this.sound.playPop();
        }

        closeModal(modal) {
            if (!modal) return;
            modal.classList.add('hidden');
        }

        showToast(message, actionText = null, onAction = null) {
            if (!this.elToastContainer) return;

            const toast = document.createElement('div');
            toast.className = 'toast';

            const msgSpan = document.createElement('span');
            msgSpan.textContent = message;
            toast.appendChild(msgSpan);

            if (actionText && onAction) {
                const actionBtn = document.createElement('button');
                actionBtn.className = 'toast-undo';
                actionBtn.textContent = actionText;
                actionBtn.addEventListener('click', () => {
                    onAction();
                    toast.remove();
                });
                toast.appendChild(actionBtn);
            }

            this.elToastContainer.appendChild(toast);

            setTimeout(() => {
                toast.style.transition = 'opacity 0.25s ease';
                toast.style.opacity = '0';
                setTimeout(() => toast.remove(), 250);
            }, 3500);
        }

        /* ----------------------------------------------------------------------
           TASK CREATION & NATURAL LANGUAGE PARSING
           ---------------------------------------------------------------------- */
        handleAddTask() {
            if (!this.elTaskInput) return;
            let rawTitle = this.elTaskInput.value.trim();
            if (!rawTitle) return;

            let priority = 'medium';
            const activePrioChip = document.querySelector('.chip-prio.active');
            if (activePrioChip && activePrioChip.dataset.prio) {
                priority = activePrioChip.dataset.prio;
            }

            let category = this.elProjectSelect ? this.elProjectSelect.value : '👤 Personal';
            let dueDate = this.elDueDateInput ? this.elDueDateInput.value : '';

            // Check for !high, !medium, !low
            if (rawTitle.includes('!high')) {
                priority = 'high';
                rawTitle = rawTitle.replace('!high', '');
            } else if (rawTitle.includes('!med') || rawTitle.includes('!medium')) {
                priority = 'medium';
                rawTitle = rawTitle.replace(/!med(ium)?/, '');
            } else if (rawTitle.includes('!low')) {
                priority = 'low';
                rawTitle = rawTitle.replace('!low', '');
            }

            // Check for #work, #dev, #personal, #fitness, #creative
            const catMap = {
                '#work': '💼 Work',
                '#dev': '💻 Development',
                '#code': '💻 Development',
                '#personal': '👤 Personal',
                '#life': '👤 Personal',
                '#fit': '💪 Fitness',
                '#fitness': '💪 Fitness',
                '#creative': '🎨 Creative',
                '#design': '🎨 Creative'
            };
            for (const [tag, mappedCat] of Object.entries(catMap)) {
                if (rawTitle.toLowerCase().includes(tag)) {
                    category = mappedCat;
                    rawTitle = rawTitle.replace(new RegExp(tag, 'i'), '');
                    break;
                }
            }

            // Check for @today or @tomorrow
            if (rawTitle.toLowerCase().includes('@today')) {
                dueDate = new Date().toISOString().split('T')[0];
                rawTitle = rawTitle.replace(/@today/i, '');
            } else if (rawTitle.toLowerCase().includes('@tomorrow') || rawTitle.toLowerCase().includes('@tmrw')) {
                const tmrw = new Date();
                tmrw.setDate(tmrw.getDate() + 1);
                dueDate = tmrw.toISOString().split('T')[0];
                rawTitle = rawTitle.replace(/@(tomorrow|tmrw)/i, '');
            }

            const cleanTitle = rawTitle.replace(/\s+/g, ' ').trim();
            if (!cleanTitle) return;

            // Create task
            const newTask = this.state.addTask({
                title: cleanTitle,
                priority,
                category,
                dueDate,
                subtasks: [...this.state.stagedSubtasks]
            });

            // Reset Composer
            this.elTaskInput.value = '';
            this.state.stagedSubtasks = [];
            this.renderStagedShelf();
            if (this.elDueDateInput) this.elDueDateInput.value = '';

            this.sound.playChime();
            this.renderAll();
            this.showToast(`Task added: "${newTask.title}"`);
        }

        /* ----------------------------------------------------------------------
           AI SUBTASK BREAKDOWN
           ---------------------------------------------------------------------- */
        generateSubtasks() {
            const rawTitle = (this.elTaskInput ? this.elTaskInput.value : '').trim();
            if (!rawTitle) {
                this.showToast('Please type a task title first to generate subtasks.');
                if (this.elTaskInput) this.elTaskInput.focus();
                return;
            }

            const suggestions = this.getSmartSubtasks(rawTitle);
            this.state.stagedSubtasks = suggestions.map(text => ({ text, completed: false }));
            this.renderStagedShelf();
            this.sound.playPop();
            this.showToast('Subtasks generated!');
        }

        getSmartSubtasks(title) {
            const lower = title.toLowerCase();
            if (lower.includes('deploy') || lower.includes('release') || lower.includes('launch')) {
                return [
                    'Run full test suite & linting',
                    'Verify responsive layout & accessibility',
                    'Configure environment & domain DNS',
                    'Execute deployment & monitor health logs'
                ];
            } else if (lower.includes('design') || lower.includes('ui') || lower.includes('ux')) {
                return [
                    'Research inspiring references & moodboard',
                    'Draft component wireframes & tokens',
                    'Implement high-fidelity responsive layout',
                    'Test contrast, touch targets, and hover states'
                ];
            } else if (lower.includes('bug') || lower.includes('fix') || lower.includes('issue')) {
                return [
                    'Reproduce issue and write isolated test case',
                    'Trace root cause in inspector / call stack',
                    'Implement fix and verify across edge cases',
                    'Review diff and commit clean patch'
                ];
            } else if (lower.includes('meeting') || lower.includes('sync') || lower.includes('call')) {
                return [
                    'Outline agenda and key decisions needed',
                    'Gather relevant links and metrics',
                    'Facilitate discussion & record action items',
                    'Send post-meeting recap to stakeholders'
                ];
            } else if (lower.includes('write') || lower.includes('article') || lower.includes('docs')) {
                return [
                    'Brainstorm core takeaways & outline',
                    'Draft first pass without editing',
                    'Refine prose, formatting, and code snippets',
                    'Publish and share with audience'
                ];
            } else {
                return [
                    `Define scope and objectives for "${title.slice(0, 24)}..."`,
                    'Break down initial implementation steps',
                    'Execute core task and review quality',
                    'Final review and wrap up'
                ];
            }
        }

        renderStagedShelf() {
            if (!this.elStagedShelf || !this.elShelfList) return;

            if (this.state.stagedSubtasks.length === 0) {
                this.elStagedShelf.classList.add('hidden');
                this.elShelfList.innerHTML = '';
                return;
            }

            this.elStagedShelf.classList.remove('hidden');
            this.elShelfList.innerHTML = '';

            this.state.stagedSubtasks.forEach((st, idx) => {
                const item = document.createElement('div');
                item.className = 'shelf-item';

                const textSpan = document.createElement('span');
                textSpan.className = 'shelf-item-text';
                textSpan.textContent = `• ${st.text}`;

                const rmBtn = document.createElement('button');
                rmBtn.type = 'button';
                rmBtn.className = 'shelf-item-remove';
                rmBtn.innerHTML = '&times;';
                rmBtn.title = 'Remove';
                rmBtn.addEventListener('click', () => {
                    this.state.stagedSubtasks.splice(idx, 1);
                    this.renderStagedShelf();
                });

                item.appendChild(textSpan);
                item.appendChild(rmBtn);
                this.elShelfList.appendChild(item);
            });
        }

        /* ----------------------------------------------------------------------
           VIEW SWITCHER (LIST vs KANBAN)
           ---------------------------------------------------------------------- */
        switchView(viewName) {
            this.state.currentView = viewName;
            this.state.save();
            this.sound.playPop();

            if (this.elViewListBtn) {
                this.elViewListBtn.classList.toggle('active', viewName === 'list');
            }
            if (this.elViewKanbanBtn) {
                this.elViewKanbanBtn.classList.toggle('active', viewName === 'kanban');
            }

            if (this.elListView) {
                this.elListView.classList.toggle('hidden', viewName !== 'list');
            }
            if (this.elKanbanView) {
                this.elKanbanView.classList.toggle('hidden', viewName !== 'kanban');
            }

            this.renderTasks();
        }

        /* ----------------------------------------------------------------------
           MAIN RENDERING: OVERVIEW, STATS & TASKS
           ---------------------------------------------------------------------- */
        renderAll() {
            this.renderOverview();
            this.renderTasks();
            this.checkActiveFilters();
        }

        renderOverview() {
            const total = this.state.tasks.length;
            const completed = this.state.tasks.filter(t => t.status === 'completed').length;
            const active = total - completed;
            const pct = total === 0 ? 0 : Math.round((completed / total) * 100);

            if (this.elStatRatio) {
                this.elStatRatio.textContent = `${completed} of ${total} Completed (${pct}%)`;
            }
            if (this.elProgressBar) {
                this.elProgressBar.style.width = `${pct}%`;
            }
            if (this.elStatTotal) this.elStatTotal.textContent = total;
            if (this.elStatActive) this.elStatActive.textContent = active;
            if (this.elStatDone) this.elStatDone.textContent = completed;
            if (this.elStatStreak) this.elStatStreak.textContent = `${this.state.profile.streak}🔥`;

            // Update Tab counts
            if (this.elTabCntAll) this.elTabCntAll.textContent = total;
            if (this.elTabCntActive) this.elTabCntActive.textContent = active;
            if (this.elTabCntDone) this.elTabCntDone.textContent = completed;
        }

        renderTasks() {
            const filtered = this.state.getFilteredTasks();

            if (this.state.currentView === 'list') {
                this.renderListView(filtered);
            } else {
                this.renderKanbanView(filtered);
            }
        }

        /* ----------------------------------------------------------------------
           LIST VIEW RENDERING
           ---------------------------------------------------------------------- */
        renderListView(tasks) {
            if (!this.elTaskList) return;
            this.elTaskList.innerHTML = '';

            if (tasks.length === 0) {
                const empty = document.createElement('li');
                empty.className = 'empty-state';
                const hasFilters = this.state.searchQuery || this.state.filterStatus !== 'all' || this.state.filterCategory !== 'all' || this.state.filterPriority !== 'all';
                empty.innerHTML = `
                    <div class="empty-icon">${hasFilters ? '🔍' : '📝'}</div>
                    <h3 class="empty-title">${hasFilters ? 'No tasks match your filters' : 'No tasks yet'}</h3>
                    <p class="empty-desc">${hasFilters ? 'Try resetting your search query or filters above.' : 'Type a task in the composer above and press Enter to get started.'}</p>
                `;
                this.elTaskList.appendChild(empty);
                return;
            }

            tasks.forEach(task => {
                const li = this.createTaskListItem(task);
                this.elTaskList.appendChild(li);
            });
        }

        createTaskListItem(task) {
            const li = document.createElement('li');
            li.className = `task-item ${task.status === 'completed' ? 'is-done' : ''}`;
            li.setAttribute('data-prio', task.priority);
            li.dataset.id = task.id;

            // Custom Checkbox
            const check = document.createElement('div');
            check.className = `task-checkbox ${task.status === 'completed' ? 'checked' : ''}`;
            check.innerHTML = task.status === 'completed' ? '✓' : '';
            check.addEventListener('click', (e) => {
                e.stopPropagation();
                const newStatus = task.status === 'completed' ? 'todo' : 'completed';
                this.state.updateTask(task.id, { status: newStatus });
                if (newStatus === 'completed') {
                    this.sound.playChime();
                } else {
                    this.sound.playPop();
                }
                this.renderAll();
            });

            // Main Content Area
            const main = document.createElement('div');
            main.className = 'task-main';

            // Title with double-click inline editing
            const titleSpan = document.createElement('span');
            titleSpan.className = 'task-title';
            titleSpan.textContent = task.title;
            titleSpan.title = 'Double click to inline edit title';
            titleSpan.addEventListener('dblclick', () => {
                this.startInlineEdit(titleSpan, task);
            });
            main.appendChild(titleSpan);

            // Meta tags (Priority, Category, Due Date, Subtasks)
            const metaDiv = document.createElement('div');
            metaDiv.className = 'task-meta-tags';

            // Priority badge
            const prioPill = document.createElement('span');
            prioPill.className = `tag-pill tag-prio-${task.priority === 'medium' ? 'med' : task.priority}`;
            prioPill.textContent = task.priority.toUpperCase();
            metaDiv.appendChild(prioPill);

            // Category badge
            const catPill = document.createElement('span');
            catPill.className = 'tag-pill tag-cat';
            catPill.textContent = task.category;
            metaDiv.appendChild(catPill);

            // Due Date badge
            if (task.dueDate) {
                const duePill = document.createElement('span');
                const isOverdue = new Date(task.dueDate) < new Date(new Date().toDateString()) && task.status !== 'completed';
                const isToday = task.dueDate === new Date().toISOString().split('T')[0];
                duePill.className = `tag-pill tag-due ${isOverdue ? 'overdue' : (isToday ? 'today' : '')}`;
                duePill.textContent = `📅 ${task.dueDate}${isOverdue ? ' (Overdue)' : ''}`;
                metaDiv.appendChild(duePill);
            }

            // Subtask count badge
            if (task.subtasks && task.subtasks.length > 0) {
                const doneSt = task.subtasks.filter(st => st.completed).length;
                const subPill = document.createElement('span');
                subPill.className = 'tag-pill tag-sub';
                subPill.textContent = `☑ ${doneSt}/${task.subtasks.length}`;
                metaDiv.appendChild(subPill);
            }

            main.appendChild(metaDiv);

            // Actions Area
            const actions = document.createElement('div');
            actions.className = 'task-actions';

            // Star Button
            const starBtn = document.createElement('button');
            starBtn.className = `action-icon-btn ${task.starred ? 'starred' : ''}`;
            starBtn.innerHTML = task.starred ? '⭐' : '☆';
            starBtn.title = task.starred ? 'Unpin' : 'Star / Pin to top';
            starBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                this.state.updateTask(task.id, { starred: !task.starred });
                this.sound.playPop();
                this.renderTasks();
            });

            // Focus Sprint Button
            const focusBtn = document.createElement('button');
            focusBtn.className = 'action-icon-btn';
            focusBtn.innerHTML = '⏱️';
            focusBtn.title = 'Set as focus target';
            focusBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                this.timer.setTarget(task);
                if (this.elTimerTarget) {
                    this.elTimerTarget.textContent = `Focusing on: "${task.title}"`;
                }
                const focusCard = document.querySelector('.focus-card');
                if (focusCard) {
                    focusCard.scrollIntoView({ behavior: 'smooth', block: 'center' });
                }
                this.sound.playPop();
                this.showToast(`Focus target set: "${task.title}"`);
            });

            // Edit / Details Button
            const editBtn = document.createElement('button');
            editBtn.className = 'action-icon-btn';
            editBtn.innerHTML = '✏️';
            editBtn.title = 'View / Edit details';
            editBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                this.openDrawer(task);
            });

            // Delete Button
            const delBtn = document.createElement('button');
            delBtn.className = 'action-icon-btn';
            delBtn.innerHTML = '🗑️';
            delBtn.title = 'Delete task';
            delBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                this.deleteTaskWithUndo(task.id);
            });

            actions.appendChild(starBtn);
            actions.appendChild(focusBtn);
            actions.appendChild(editBtn);
            actions.appendChild(delBtn);

            li.appendChild(check);
            li.appendChild(main);
            li.appendChild(actions);

            return li;
        }

        /* ----------------------------------------------------------------------
           INLINE TITLE EDITING
           ---------------------------------------------------------------------- */
        startInlineEdit(titleSpan, task) {
            const input = document.createElement('input');
            input.type = 'text';
            input.className = 'inline-edit-box';
            input.value = task.title;

            const finishEdit = () => {
                const val = input.value.trim();
                if (val && val !== task.title) {
                    this.state.updateTask(task.id, { title: val });
                    this.sound.playPop();
                    this.showToast('Task title updated');
                }
                this.renderTasks();
            };

            input.addEventListener('blur', finishEdit);
            input.addEventListener('keydown', (e) => {
                if (e.key === 'Enter') {
                    finishEdit();
                } else if (e.key === 'Escape') {
                    this.renderTasks();
                }
            });

            titleSpan.replaceWith(input);
            input.focus();
            input.select();
        }

        /* ----------------------------------------------------------------------
           KANBAN VIEW RENDERING
           ---------------------------------------------------------------------- */
        renderKanbanView(tasks) {
            if (!this.elKbDropTodo || !this.elKbDropInprog || !this.elKbDropDone) return;

            this.elKbDropTodo.innerHTML = '';
            this.elKbDropInprog.innerHTML = '';
            this.elKbDropDone.innerHTML = '';

            const todoTasks = tasks.filter(t => t.status === 'todo');
            const inprogTasks = tasks.filter(t => t.status === 'inprogress');
            const doneTasks = tasks.filter(t => t.status === 'completed');

            if (this.elKbCntTodo) this.elKbCntTodo.textContent = todoTasks.length;
            if (this.elKbCntInprog) this.elKbCntInprog.textContent = inprogTasks.length;
            if (this.elKbCntDone) this.elKbCntDone.textContent = doneTasks.length;

            todoTasks.forEach(t => this.elKbDropTodo.appendChild(this.createKanbanCard(t)));
            inprogTasks.forEach(t => this.elKbDropInprog.appendChild(this.createKanbanCard(t)));
            doneTasks.forEach(t => this.elKbDropDone.appendChild(this.createKanbanCard(t)));
        }

        createKanbanCard(task) {
            const card = document.createElement('div');
            card.className = 'kb-card';
            card.setAttribute('data-prio', task.priority);
            card.draggable = true;
            card.dataset.id = task.id;

            // Card Title
            const title = document.createElement('div');
            title.className = 'kb-card-title';
            title.textContent = task.title;

            // Card Meta
            const meta = document.createElement('div');
            meta.className = 'kb-card-meta';

            const catSpan = document.createElement('span');
            catSpan.textContent = task.category;

            const prioSpan = document.createElement('span');
            prioSpan.textContent = (task.starred ? '⭐ ' : '') + task.priority.toUpperCase();

            meta.appendChild(catSpan);
            meta.appendChild(prioSpan);

            card.appendChild(title);
            card.appendChild(meta);

            // Drag Events
            card.addEventListener('dragstart', (e) => {
                e.dataTransfer.setData('text/plain', task.id);
                card.style.opacity = '0.4';
                this.sound.playPop();
            });

            card.addEventListener('dragend', () => {
                card.style.opacity = '1';
            });

            // Click to open details in drawer
            card.addEventListener('click', () => {
                this.openDrawer(task);
            });

            return card;
        }

        setupKanbanDragAndDrop() {
            const dropzones = [this.elKbDropTodo, this.elKbDropInprog, this.elKbDropDone];

            dropzones.forEach(zone => {
                if (!zone) return;

                zone.addEventListener('dragover', (e) => {
                    e.preventDefault();
                    zone.classList.add('drag-over');
                });

                zone.addEventListener('dragleave', () => {
                    zone.classList.remove('drag-over');
                });

                zone.addEventListener('drop', (e) => {
                    e.preventDefault();
                    zone.classList.remove('drag-over');
                    const taskId = e.dataTransfer.getData('text/plain');
                    const newStatus = zone.dataset.status;

                    if (taskId && newStatus) {
                        this.state.updateTask(taskId, { status: newStatus });
                        this.sound.playSwoosh();
                        this.renderAll();
                        this.showToast(`Card moved to ${newStatus.toUpperCase()}`);
                    }
                });
            });
        }

        /* ----------------------------------------------------------------------
           ACTIVE FILTERS RESET BANNER
           ---------------------------------------------------------------------- */
        checkActiveFilters() {
            if (!this.elFiltersBanner) return;

            const isFiltered = (
                this.state.searchQuery !== '' ||
                this.state.filterStatus !== 'all' ||
                this.state.filterCategory !== 'all' ||
                this.state.filterPriority !== 'all'
            );

            this.elFiltersBanner.classList.toggle('hidden', !isFiltered);
        }

        resetAllFilters() {
            this.state.searchQuery = '';
            this.state.filterStatus = 'all';
            this.state.filterCategory = 'all';
            this.state.filterPriority = 'all';
            this.state.sortOrder = 'newest';

            if (this.elSearchInput) this.elSearchInput.value = '';
            if (this.elSearchClearBtn) this.elSearchClearBtn.classList.add('hidden');
            if (this.elFilterCategory) this.elFilterCategory.value = 'all';
            if (this.elFilterPriority) this.elFilterPriority.value = 'all';
            if (this.elSortOrder) this.elSortOrder.value = 'newest';

            this.elTabBtns.forEach(btn => {
                btn.classList.toggle('active', btn.dataset.filter === 'all');
            });

            this.sound.playPop();
            this.renderTasks();
            this.checkActiveFilters();
            this.showToast('All filters reset');
        }

        /* ----------------------------------------------------------------------
           TASK INSPECTOR / DRAWER
           ---------------------------------------------------------------------- */
        openDrawer(task) {
            if (!this.elTaskDrawer || !this.elDrawerBackdrop) return;

            this.currentDrawerTaskId = task.id;
            this.elDrawerTaskId.value = task.id;
            this.elDrawerTitle.value = task.title;
            this.elDrawerStatus.value = task.status;
            this.elDrawerPrio.value = task.priority;
            this.elDrawerCat.value = task.category;
            this.elDrawerDue.value = task.dueDate || '';
            this.elDrawerNotes.value = task.notes || '';

            if (this.elDrawerStarBtn) {
                this.elDrawerStarBtn.classList.toggle('active', !!task.starred);
            }

            this.renderDrawerSubtasks(task);

            this.elDrawerBackdrop.classList.remove('hidden');
            this.sound.playPop();
        }

        closeDrawer() {
            if (!this.elDrawerBackdrop) return;
            this.elDrawerBackdrop.classList.add('hidden');
        }

        renderDrawerSubtasks(task) {
            if (!this.elDrawerSubtasksList || !this.elDrawerChecklistCnt) return;
            this.elDrawerSubtasksList.innerHTML = '';

            const subtasks = task.subtasks || [];
            const done = subtasks.filter(s => s.completed).length;
            this.elDrawerChecklistCnt.textContent = `${done}/${subtasks.length}`;

            subtasks.forEach((st, idx) => {
                const li = document.createElement('li');
                li.className = `cl-item ${st.completed ? 'checked' : ''}`;

                const chk = document.createElement('input');
                chk.type = 'checkbox';
                chk.checked = !!st.completed;
                chk.addEventListener('change', () => {
                    st.completed = chk.checked;
                    this.state.save();
                    this.renderDrawerSubtasks(task);
                    this.renderTasks();
                    this.sound.playPop();
                });

                const txt = document.createElement('span');
                txt.textContent = st.text;

                const del = document.createElement('span');
                del.className = 'cl-del';
                del.innerHTML = '&times;';
                del.title = 'Delete subtask';
                del.addEventListener('click', () => {
                    subtasks.splice(idx, 1);
                    this.state.save();
                    this.renderDrawerSubtasks(task);
                    this.renderTasks();
                });

                li.appendChild(chk);
                li.appendChild(txt);
                li.appendChild(del);
                this.elDrawerSubtasksList.appendChild(li);
            });
        }

        addDrawerSubtask() {
            if (!this.elDrawerNewSubtask) return;
            const text = this.elDrawerNewSubtask.value.trim();
            if (!text) return;

            const id = this.elDrawerTaskId.value;
            const task = this.state.tasks.find(t => t.id === id);
            if (!task) return;

            if (!task.subtasks) task.subtasks = [];
            task.subtasks.push({ text, completed: false });
            this.state.save();

            this.elDrawerNewSubtask.value = '';
            this.renderDrawerSubtasks(task);
            this.renderTasks();
            this.sound.playPop();
        }

        saveDrawerTask() {
            const id = this.elDrawerTaskId.value;
            const task = this.state.tasks.find(t => t.id === id);
            if (!task) return;

            const newTitle = this.elDrawerTitle.value.trim();
            if (!newTitle) {
                this.showToast('Task title cannot be empty');
                return;
            }

            this.state.updateTask(id, {
                title: newTitle,
                status: this.elDrawerStatus.value,
                priority: this.elDrawerPrio.value,
                category: this.elDrawerCat.value,
                dueDate: this.elDrawerDue.value,
                notes: this.elDrawerNotes.value.trim()
            });

            this.sound.playChime();
            this.closeDrawer();
            this.renderAll();
            this.showToast('Task saved successfully');
        }

        /* ----------------------------------------------------------------------
           DELETE WITH 1-CLICK UNDO
           ---------------------------------------------------------------------- */
        deleteTaskWithUndo(id) {
            const removed = this.state.deleteTask(id);
            if (!removed) return;

            this.sound.playPop();
            this.renderAll();

            this.showToast(`Deleted "${removed.title}"`, 'Undo', () => {
                const restored = this.state.restoreLastDeleted();
                if (restored) {
                    this.sound.playChime();
                    this.renderAll();
                    this.showToast(`Restored "${restored.title}"`);
                }
            });
        }

        /* ----------------------------------------------------------------------
           DATA EXPORT & OPTIONAL SHOWCASE DATA
           ---------------------------------------------------------------------- */
        exportJSON() {
            const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(this.state.tasks, null, 2));
            const downloadAnchor = document.createElement('a');
            downloadAnchor.setAttribute('href', dataStr);
            downloadAnchor.setAttribute('download', `taskflow_backup_${new Date().toISOString().split('T')[0]}.json`);
            document.body.appendChild(downloadAnchor);
            downloadAnchor.click();
            downloadAnchor.remove();
            this.sound.playPop();
            this.showToast('JSON export downloaded');
        }

        exportCSV() {
            if (this.state.tasks.length === 0) {
                this.showToast('No tasks available to export');
                return;
            }

            const headers = ['ID', 'Title', 'Status', 'Priority', 'Category', 'DueDate', 'Starred', 'CreatedAt'];
            const rows = this.state.tasks.map(t => [
                `"${t.id}"`,
                `"${(t.title || '').replace(/"/g, '""')}"`,
                `"${t.status}"`,
                `"${t.priority}"`,
                `"${t.category}"`,
                `"${t.dueDate || ''}"`,
                `"${t.starred ? 'Yes' : 'No'}"`,
                `"${t.createdAt}"`
            ]);

            const csvContent = 'data:text/csv;charset=utf-8,' + encodeURIComponent([headers.join(','), ...rows.map(e => e.join(','))].join('\n'));
            const downloadAnchor = document.createElement('a');
            downloadAnchor.setAttribute('href', csvContent);
            downloadAnchor.setAttribute('download', `taskflow_backup_${new Date().toISOString().split('T')[0]}.csv`);
            document.body.appendChild(downloadAnchor);
            downloadAnchor.click();
            downloadAnchor.remove();
            this.sound.playPop();
            this.showToast('CSV export downloaded');
        }

        loadShowcaseData() {
            const demoTasks = [
                {
                    title: 'Deploy TaskFlow to Production (Vercel)',
                    priority: 'high',
                    category: '💻 Development',
                    dueDate: new Date().toISOString().split('T')[0],
                    starred: true,
                    status: 'inprogress',
                    notes: 'Check responsive layout on iOS Safari and Android Chrome before final verification.',
                    subtasks: [
                        { text: 'Verify cross-browser CSS variables', completed: true },
                        { text: 'Test offline local storage persistence', completed: true },
                        { text: 'Audit mobile touch target accessibility', completed: false }
                    ]
                },
                {
                    title: 'Weekly Sprint Planning & Backlog Grooming',
                    priority: 'high',
                    category: '💼 Work',
                    dueDate: new Date(Date.now() + 86400000).toISOString().split('T')[0],
                    starred: false,
                    status: 'todo',
                    notes: 'Prepare slide deck and review metrics with engineering team.',
                    subtasks: [
                        { text: 'Review bug tracker and prioritize high impact fixes', completed: false },
                        { text: 'Assign milestones to team members', completed: false }
                    ]
                },
                {
                    title: '45-minute High-Intensity Interval Workout',
                    priority: 'medium',
                    category: '💪 Fitness',
                    dueDate: new Date().toISOString().split('T')[0],
                    starred: false,
                    status: 'todo',
                    notes: 'Warm up thoroughly, hydrate every 15 minutes.',
                    subtasks: []
                },
                {
                    title: 'Sketch Minimalist UI Component Guidelines',
                    priority: 'low',
                    category: '🎨 Creative',
                    dueDate: '',
                    starred: false,
                    status: 'completed',
                    notes: 'Focus on typography scales, 8px grid alignment, and gentle shadows.',
                    subtasks: []
                }
            ];

            demoTasks.forEach(t => this.state.addTask(t));
            this.sound.playChime();
            this.closeModal(this.elBackupModal);
            this.renderAll();
            this.showToast('Sample tasks loaded! Ready to explore.');
        }
    }

    // Launch App when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => new TaskFlowApp());
    } else {
        new TaskFlowApp();
    }
})();
