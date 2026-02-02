class AssessmentReportGenerator {
    constructor() {
        this.employees = {};
        this.currentSector = null;
        this.templates = this.loadTemplates();
        this.currentTemplateId = null;
        this.autoSaveTimeout = null;
        this.confirmAction = null;

        // Sample data per sector
        this.sampleEmployeesBySector = {
            katapang: [
                { name: "Rahmat Jafar K." },
                { name: "Adika" },
                { name: "Raka" },
                { name: "Irwan" },
                { name: "Misnoto" }
            ],
            margahayu: [
                { name: "Suparman" },
                { name: "Suryono" },
                { name: "Yudi" },
                { name: "Zainuddin Manshur" },
                { name: "Karim" }
            ],
            soreang: [
                { name: "Asep Saepulloh" },
                { name: "Hendrik" },
                { name: "Farhan" },
                { name: "Fahri" },
                { name: "Sandy" },
                { name: "Hari" }
            ]
        };

        this.init();
    }

    init() {
        this.initializeElements();
        this.bindEvents();
        this.updateUI();
        this.initializeLucide();
        this.setupKeyboardShortcuts();
        this.loadDraft();
    }

    initializeElements() {
        this.sectorSelect = document.getElementById('sector');
        this.assessmentNameInput = document.getElementById('assessmentName');
        this.periodInput = document.getElementById('period');
        this.addEmployeeBtn = document.getElementById('addEmployeeBtn');
        this.generateExcelBtn = document.getElementById('generateExcelBtn');
        this.saveTemplateBtn = document.getElementById('saveTemplateBtn');
        this.loadTemplateBtn = document.getElementById('loadTemplateBtn');
        this.clearAllBtn = document.getElementById('clearAllBtn');
        this.employeesTable = document.getElementById('employeesTable');
        this.employeesTableBody = document.getElementById('employeesTableBody');
        this.emptyState = document.getElementById('emptyState');
        this.employeeCount = document.getElementById('employeeCount');
        this.templateModal = document.getElementById('templateModal');
        this.confirmDialog = document.getElementById('confirmDialog');
        this.loadingOverlay = document.getElementById('loadingOverlay');
        this.toast = document.getElementById('toast');
    }

    bindEvents() {
        this.sectorSelect.addEventListener('change', () => this.handleSectorChange());

        this.addEmployeeBtn.addEventListener('click', (e) => {
            e.preventDefault();
            this.addEmployee();
        });

        this.generateExcelBtn.addEventListener('click', (e) => {
            e.preventDefault();
            this.generateExcel();
        });

        this.saveTemplateBtn.addEventListener('click', (e) => {
            e.preventDefault();
            this.saveTemplate();
        });

        this.loadTemplateBtn.addEventListener('click', (e) => {
            e.preventDefault();
            this.showLoadTemplateModal();
        });

        this.clearAllBtn.addEventListener('click', (e) => {
            e.preventDefault();
            this.confirmClearAll();
        });

        this.assessmentNameInput.addEventListener('input', this.debounce(() => {
            this.autoSave();
            this.updateUI();
        }, 1000));

        this.periodInput.addEventListener('input', this.debounce(() => {
            this.autoSave();
            this.updateUI();
        }, 1000));

        this.bindModalEvents();

        const toastClose = document.getElementById('toastClose');
        if (toastClose) {
            toastClose.addEventListener('click', () => this.hideToast());
        }
    }

    bindModalEvents() {
        const modalClose = document.getElementById('modalClose');
        const modalCancel = document.getElementById('modalCancel');
        const modalOverlay = document.getElementById('modalOverlay');

        if (modalClose) modalClose.addEventListener('click', () => this.hideModal());
        if (modalCancel) modalCancel.addEventListener('click', () => this.hideModal());
        if (modalOverlay) modalOverlay.addEventListener('click', () => this.hideModal());

        const confirmCancel = document.getElementById('confirmCancel');
        const confirmOk = document.getElementById('confirmOk');

        if (confirmCancel) confirmCancel.addEventListener('click', () => this.hideConfirmDialog());
        if (confirmOk) confirmOk.addEventListener('click', () => this.executeConfirmAction());
    }

    setupKeyboardShortcuts() {
        document.addEventListener('keydown', (e) => {
            if ((e.ctrlKey || e.metaKey) && e.key === 'n') {
                e.preventDefault();
                this.addEmployee();
            }
            if ((e.ctrlKey || e.metaKey) && e.key === 's') {
                e.preventDefault();
                this.saveTemplate();
            }
            if ((e.ctrlKey || e.metaKey) && e.key === 'o') {
                e.preventDefault();
                this.showLoadTemplateModal();
            }
            if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
                e.preventDefault();
                this.generateExcel();
            }
        });
    }

    initializeLucide() {
        if (typeof lucide !== 'undefined' && lucide.createIcons) {
            try {
                lucide.createIcons();
            } catch (error) {
                console.log('Lucide icons initialization skipped');
            }
        }
    }

    handleSectorChange() {
        const sector = this.sectorSelect.value;
        this.currentSector = sector;

        if (!sector) {
            this.renderAllEmployees();
            this.updateUI();
            return;
        }

        if (!this.employees[sector]) {
            this.employees[sector] = this.sampleEmployeesBySector[sector].map(emp => ({
                name: emp.name,
                kp: '',
                kursus: '',
                kontrol: '',
                kontak: '',
                lapGuru: '',
                hs: '',
                jm: '',
                spp: '',
                buletincetak: '',
                buletindigital: '',
                kajian: '',
                khutbah: ''
            }));
        }

        this.renderAllEmployees();
        this.updateUI();
        this.autoSave();
    }

    addEmployee(employeeData = null) {
        if (!this.currentSector) {
            this.showToast('Pilih sektor terlebih dahulu', 'error');
            return;
        }

        const employee = employeeData || {
            name: '',
            kp: '',
            kursus: '',
            kontrol: '',
            kontak: '',
            lapGuru: '',
            hs: '',
            jm: '',
            spp: '',
            buletincetak: '',
            buletindigital: '',
            kajian: '',
            khutbah: ''
        };

        if (!this.employees[this.currentSector]) {
            this.employees[this.currentSector] = [];
        }

        this.employees[this.currentSector].push(employee);
        this.renderEmployeeRow(employee, this.employees[this.currentSector].length - 1);
        this.updateUI();
        this.autoSave();

        setTimeout(() => {
            const newRow = this.employeesTableBody.lastElementChild;
            if (newRow) {
                const firstInput = newRow.querySelector('input');
                if (firstInput) firstInput.focus();
            }
        }, 100);

        this.showToast('Karyawan berhasil ditambahkan', 'success');
    }

    renderEmployeeRow(employee, index) {
        const row = document.createElement('tr');
        row.className = 'table-row-enter';
        row.dataset.index = index;

        row.innerHTML = `
            <td>
                <input type="text" class="table-input" value="${employee.name}" 
                    data-field="name" data-index="${index}">
            </td>
            <td>
                <select class="table-select" data-field="kp" data-index="${index}">
                    <option value="">-</option>
                    <option value="K" ${employee.kp === 'K' ? 'selected' : ''}>K</option>
                    <option value="P" ${employee.kp === 'P' ? 'selected' : ''}>P</option>
                </select>
            </td>
            <td>
                <select class="table-select" data-field="kursus" data-index="${index}">
                    <option value="">-</option>
                    <option value="✔" ${employee.kursus === '✔' ? 'selected' : ''}>✔</option>
                    <option value="S" ${employee.kursus === 'S' ? 'selected' : ''}>S</option>
                    <option value="I" ${employee.kursus === 'I' ? 'selected' : ''}>I</option>
                    <option value="G" ${employee.kursus === 'G' ? 'selected' : ''}>G</option>
                    <option value="T" ${employee.kursus === 'T' ? 'selected' : ''}>T</option>
                    <option value="A" ${employee.kursus === 'A' ? 'selected' : ''}>A</option>
                </select>
            </td>
            <td>
                <select class="table-select" data-field="kontrol" data-index="${index}">
                    <option value="">-</option>
                    <option value="✔" ${employee.kontrol === '✔' ? 'selected' : ''}>✔</option>
                    <option value="✕" ${employee.kontrol === '✕' ? 'selected' : ''}>✕</option>
                </select>
            </td>
            <td>
                <input type="text" class="table-input" value="${employee.kontak}" 
                    data-field="kontak" data-index="${index}">
            </td>
            <td>
                <select class="table-select" data-field="lapGuru" data-index="${index}">
                    <option value="">-</option>
                    <option value="✔" ${employee.lapGuru === '✔' ? 'selected' : ''}>✔</option>
                    <option value="✕" ${employee.lapGuru === '✕' ? 'selected' : ''}>✕</option>
                </select>
            </td>
            <td>
                <select class="table-select" data-field="hs" data-index="${index}">
                    <option value="">-</option>
                    <option value="✔" ${employee.hs === '✔' ? 'selected' : ''}>✔</option>
                    <option value="✕" ${employee.hs === '✕' ? 'selected' : ''}>✕</option>
                </select>
            </td>
            <td>
                <select class="table-select" data-field="jm" data-index="${index}">
                    <option value="">-</option>
                    <option value="✔" ${employee.jm === '✔' ? 'selected' : ''}>✔</option>
                    <option value="✕" ${employee.jm === '✕' ? 'selected' : ''}>✕</option>
                </select>
            </td>
            <td>
                <select class="table-select" data-field="spp" data-index="${index}">
                    <option value="">-</option>
                    <option value="✔" ${employee.spp === '✔' ? 'selected' : ''}>✔</option>
                    <option value="✕" ${employee.spp === '✕' ? 'selected' : ''}>✕</option>
                </select>
            </td>
            <td>
                <input type="text" class="table-input" value="${employee.buletincetak}" 
                    data-field="buletincetak" data-index="${index}">
            </td>
            <td>
                <input type="text" class="table-input" value="${employee.buletindigital}" 
                    data-field="buletindigital" data-index="${index}">
            </td>
            <td>
                <input type="text" class="table-input" value="${employee.kajian}" 
                    data-field="kajian" data-index="${index}">
            </td>
            <td>
                <input type="text" class="table-input" value="${employee.khutbah}" 
                    data-field="khutbah" data-index="${index}">
            </td>
            <td>
                <button class="btn-icon btn-icon--danger" onclick="app.deleteEmployee(${index})" 
                    title="Hapus karyawan">
                    <i data-lucide="trash-2"></i>
                </button>
            </td>
        `;

        this.employeesTableBody.appendChild(row);

        row.querySelectorAll('.table-input, .table-select').forEach(input => {
            input.addEventListener('input', (e) => {
                const field = e.target.dataset.field;
                const idx = parseInt(e.target.dataset.index);
                if (this.employees[this.currentSector] && this.employees[this.currentSector][idx]) {
                    this.employees[this.currentSector][idx][field] = e.target.value;
                    this.autoSave();
                }
            });
        });

        this.initializeLucide();
    }

    renderAllEmployees() {
        this.employeesTableBody.innerHTML = '';

        if (!this.currentSector || !this.employees[this.currentSector] || this.employees[this.currentSector].length === 0) {
            this.employeesTable.classList.add('hidden');
            this.emptyState.classList.remove('hidden');
            return;
        }

        this.employeesTable.classList.remove('hidden');
        this.emptyState.classList.add('hidden');

        this.employees[this.currentSector].forEach((employee, index) => {
            this.renderEmployeeRow(employee, index);
        });
    }

    deleteEmployee(index) {
        if (!this.currentSector) return;

        this.showConfirmDialog(
            'Hapus Karyawan',
            'Apakah Anda yakin ingin menghapus karyawan ini?',
            () => {
                this.employees[this.currentSector].splice(index, 1);
                this.renderAllEmployees();
                this.updateUI();
                this.autoSave();
                this.showToast('Karyawan berhasil dihapus', 'success');
            }
        );
    }

    updateUI() {
        const hasEmployees = this.currentSector && this.employees[this.currentSector] && this.employees[this.currentSector].length > 0;
        const count = hasEmployees ? this.employees[this.currentSector].length : 0;

        this.employeeCount.textContent = count;
        this.generateExcelBtn.disabled = !hasEmployees;
        this.clearAllBtn.disabled = !hasEmployees;
        this.saveTemplateBtn.disabled = !hasEmployees;
    }

    clearAllData() {
        if (this.currentSector) {
            this.employees[this.currentSector] = [];
        }
        this.renderAllEmployees();
        this.updateUI();
        this.autoSave();
    }

    confirmClearAll() {
        if (!this.currentSector || !this.employees[this.currentSector] || this.employees[this.currentSector].length === 0) {
            return;
        }

        this.showConfirmDialog(
            'Hapus Semua Data',
            'Apakah Anda yakin ingin menghapus semua data karyawan di sektor ini?',
            () => {
                this.clearAllData();
                this.showToast('Semua data berhasil dihapus', 'success');
            }
        );
    }

    generateExcel() {
        if (!this.currentSector || !this.employees[this.currentSector] || this.employees[this.currentSector].length === 0) {
            this.showToast('Tidak ada data untuk di-export', 'error');
            return;
        }

        this.showLoading();

        setTimeout(() => {
            try {
                const wb = XLSX.utils.book_new();
                const wsData = [];

                const assessmentName = this.assessmentNameInput.value || 'Assessment Report';
                const period = this.periodInput.value || '';
                const sectorName = this.getSectorName(this.currentSector);

                wsData.push([assessmentName]);
                wsData.push([`Periode: ${period}`]);
                wsData.push([`Sektor: ${sectorName}`]);
                wsData.push([]);

                wsData.push([
                    'No',
                    'Nama',
                    'K/P',
                    'Kursus',
                    'Kontrol',
                    'Kontak',
                    'Lap Guru',
                    'HS',
                    'JM',
                    'SPP',
                    'Buletin Cetak',
                    'Buletin Digital',
                    'Kajian',
                    'Khutbah'
                ]);

                this.employees[this.currentSector].forEach((emp, index) => {
                    wsData.push([
                        index + 1,
                        emp.name,
                        emp.kp,
                        emp.kursus,
                        emp.kontrol,
                        emp.kontak,
                        emp.lapGuru,
                        emp.hs,
                        emp.jm,
                        emp.spp,
                        emp.buletincetak,
                        emp.buletindigital,
                        emp.kajian,
                        emp.khutbah
                    ]);
                });

                const ws = XLSX.utils.aoa_to_sheet(wsData);

                ws['!cols'] = [
                    { wch: 5 },
                    { wch: 20 },
                    { wch: 8 },
                    { wch: 10 },
                    { wch: 10 },
                    { wch: 10 },
                    { wch: 12 },
                    { wch: 8 },
                    { wch: 8 },
                    { wch: 8 },
                    { wch: 15 },
                    { wch: 15 },
                    { wch: 10 },
                    { wch: 10 }
                ];

                XLSX.utils.book_append_sheet(wb, ws, 'Assessment Report');

                const fileName = `Assessment_${sectorName}_${period.replace(/\s+/g, '_')}_${new Date().getTime()}.xlsx`;
                XLSX.writeFile(wb, fileName);

                this.hideLoading();
                this.showToast('File Excel berhasil di-generate!', 'success');
            } catch (error) {
                console.error('Error generating Excel:', error);
                this.hideLoading();
                this.showToast('Gagal generate Excel. Silakan coba lagi.', 'error');
            }
        }, 500);
    }

    getSectorName(sector) {
        const names = {
            'katapang': 'Katapang',
            'margahayu': 'Margahayu',
            'soreang': 'Soreang'
        };
        return names[sector] || sector;
    }

    saveTemplate() {
        if (!this.currentSector || !this.employees[this.currentSector] || this.employees[this.currentSector].length === 0) {
            this.showToast('Tidak ada data untuk disimpan', 'error');
            return;
        }

        const templateName = prompt('Masukkan nama template:');
        if (!templateName) return;

        const template = {
            id: Date.now(),
            name: templateName,
            sector: this.currentSector,
            employees: JSON.parse(JSON.stringify(this.employees)),
            assessmentName: this.assessmentNameInput.value,
            period: this.periodInput.value,
            createdAt: new Date().toISOString()
        };

        this.templates.push(template);
        this.saveTemplatesToStorage();
        this.showToast('Template berhasil disimpan!', 'success');
    }

    showLoadTemplateModal() {
        if (this.templates.length === 0) {
            this.showToast('Belum ada template tersimpan', 'error');
            return;
        }

        const templateList = document.getElementById('templateList');
        templateList.innerHTML = '';

        this.templates.forEach(template => {
            const item = document.createElement('div');
            item.className = 'template-item';
            item.innerHTML = `
                <div class="template-name">${template.name}</div>
                <div class="template-meta">
                    <span>Sektor: ${this.getSectorName(template.sector)}</span>
                    <span>${new Date(template.createdAt).toLocaleDateString('id-ID')}</span>
                </div>
            `;
            item.addEventListener('click', () => {
                this.loadTemplate(template);
                this.hideModal();
            });
            templateList.appendChild(item);
        });

        this.templateModal.classList.remove('hidden');
    }

    loadTemplate(template) {
        this.employees = JSON.parse(JSON.stringify(template.employees));
        this.sectorSelect.value = template.sector;
        this.currentSector = template.sector;
        this.assessmentNameInput.value = template.assessmentName || '';
        this.periodInput.value = template.period || '';

        this.renderAllEmployees();
        this.updateUI();
        this.autoSave();

        this.showToast('Template berhasil dimuat!', 'success');
    }

    loadTemplates() {
        try {
            const stored = localStorage.getItem('assessmentTemplates');
            return stored ? JSON.parse(stored) : [];
        } catch (error) {
            console.error('Error loading templates:', error);
            return [];
        }
    }

    saveTemplatesToStorage() {
        try {
            localStorage.setItem('assessmentTemplates', JSON.stringify(this.templates));
        } catch (error) {
            console.error('Error saving templates:', error);
        }
    }

    autoSave() {
        clearTimeout(this.autoSaveTimeout);
        this.autoSaveTimeout = setTimeout(() => {
            this.saveDraft();
        }, 2000);
    }

    saveDraft() {
        try {
            const draft = {
                employees: this.employees,
                currentSector: this.currentSector,
                assessmentName: this.assessmentNameInput.value,
                period: this.periodInput.value,
                timestamp: new Date().toISOString()
            };
            localStorage.setItem('assessmentDraft', JSON.stringify(draft));
        } catch (error) {
            console.error('Error saving draft:', error);
        }
    }

    loadDraft() {
        try {
            const stored = localStorage.getItem('assessmentDraft');
            if (stored) {
                const draft = JSON.parse(stored);
                this.employees = draft.employees || {};
                this.currentSector = draft.currentSector || null;
                this.sectorSelect.value = this.currentSector || '';
                this.assessmentNameInput.value = draft.assessmentName || '';
                this.periodInput.value = draft.period || '';
                this.renderAllEmployees();
                this.updateUI();
            }
        } catch (error) {
            console.error('Error loading draft:', error);
        }
    }

    showConfirmDialog(title, message, onConfirm) {
        document.getElementById('confirmTitle').textContent = title;
        document.getElementById('confirmMessage').textContent = message;
        this.confirmAction = onConfirm;
        this.confirmDialog.classList.remove('hidden');
    }

    hideConfirmDialog() {
        this.confirmDialog.classList.add('hidden');
        this.confirmAction = null;
    }

    executeConfirmAction() {
        if (this.confirmAction) {
            this.confirmAction();
        }
        this.hideConfirmDialog();
    }

    hideModal() {
        this.templateModal.classList.add('hidden');
    }

    showLoading() {
        this.loadingOverlay.classList.remove('hidden');
    }

    hideLoading() {
        this.loadingOverlay.classList.add('hidden');
    }

    showToast(message, type = 'success') {
        const toastMessage = document.getElementById('toastMessage');
        const toastIcon = this.toast.querySelector('.toast-icon');

        toastMessage.textContent = message;

        if (type === 'error') {
            toastIcon.setAttribute('data-lucide', 'alert-circle');
            toastIcon.classList.add('error');
        } else {
            toastIcon.setAttribute('data-lucide', 'check-circle');
            toastIcon.classList.remove('error');
        }

        this.toast.classList.remove('hidden');
        this.initializeLucide();

        setTimeout(() => {
            this.hideToast();
        }, 3000);
    }

    hideToast() {
        this.toast.classList.add('hidden');
    }

    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }
}

const app = new AssessmentReportGenerator();
window.app = app;