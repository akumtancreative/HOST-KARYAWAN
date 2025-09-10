class AssessmentReportGenerator {
    constructor() {
        this.employees = [];
        this.templates = this.loadTemplates();
        this.currentTemplateId = null;
        this.autoSaveTimeout = null;
        this.confirmAction = null;
        
        // Sample data matching the exact structure provided
        this.sampleEmployees = [
            { "id": 1, "name": "Rahmat Jafar K.", "kp": "", "kursus": "", "kontrol": "", "kontak": "", "lapGuru": "", "hs": "", "jm": "", "spp": "", "buletincetak": "", "buletindigital": "", "kajian": "", "khutbah": "" },
            { "id": 2, "name": "Adika", "kp": "", "kursus": "", "kontrol": "", "kontak": "", "lapGuru": "", "hs": "", "jm": "", "spp": "", "buletincetak": "", "buletindigital": "", "kajian": "", "khutbah": "" },
            { "id": 3, "name": "Raka", "kp": "", "kursus": "", "kontrol": "", "kontak": "", "lapGuru": "", "hs": "", "jm": "", "spp": "", "buletincetak": "", "buletindigital": "", "kajian": "", "khutbah": "" },
            { "id": 4, "name": "Irwan", "kp": "", "kursus": "", "kontrol": "", "kontak": "", "lapGuru": "", "hs": "", "jm": "", "spp": "", "buletincetak": "", "buletindigital": "", "kajian": "", "khutbah": "" },
            { "id": 5, "name": "Misnoto", "kp": "", "kursus": "", "kontrol": "", "kontak": "", "lapGuru": "", "hs": "", "jm": "", "spp": "", "buletincetak": "", "buletindigital": "", "kajian": "", "khutbah": "" },
            { "id": 6, "name": "Suparman", "kp": "", "kursus": "", "kontrol": "", "kontak": "", "lapGuru": "", "hs": "", "jm": "", "spp": "", "buletincetak": "", "buletindigital": "", "kajian": "", "khutbah": "" },
            { "id": 7, "name": "Suryono", "kp": "", "kursus": "", "kontrol": "", "kontak": "", "lapGuru": "", "hs": "", "jm": "", "spp": "", "buletincetak": "", "buletindigital": "", "kajian": "", "khutbah": "" },
            { "id": 8, "name": "Yudi", "kp": "", "kursus": "", "kontrol": "", "kontak": "", "lapGuru": "", "hs": "", "jm": "", "spp": "", "buletincetak": "", "buletindigital": "", "kajian": "", "khutbah": "" },
            { "id": 9, "name": "Zainuddin Manshur", "kp": "", "kursus": "", "kontrol": "", "kontak": "", "lapGuru": "", "hs": "", "jm": "", "spp": "", "buletincetak": "", "buletindigital": "", "kajian": "", "khutbah": "" },
            { "id": 10, "name": "Karim", "kp": "", "kursus": "", "kontrol": "", "kontak": "", "lapGuru": "", "hs": "", "jm": "", "spp": "", "buletincetak": "", "buletindigital": "", "kajian": "", "khutbah": "" },
            { "id": 11, "name": "Asep Saepulloh", "kp": "", "kursus": "", "kontrol": "", "kontak": "", "lapGuru": "", "hs": "", "jm": "", "spp": "", "buletincetak": "", "buletindigital": "", "kajian": "", "khutbah": "" },
            { "id": 12, "name": "Hendrik", "kp": "", "kursus": "", "kontrol": "", "kontak": "", "lapGuru": "", "hs": "", "jm": "", "spp": "", "buletincetak": "", "buletindigital": "", "kajian": "", "khutbah": "" },
            { "id": 13, "name": "Farhan", "kp": "", "kursus": "", "kontrol": "", "kontak": "", "lapGuru": "", "hs": "", "jm": "", "spp": "", "buletincetak": "", "buletindigital": "", "kajian": "", "khutbah": "" },
            { "id": 14, "name": "Fahri", "kp": "", "kursus": "", "kontrol": "", "kontak": "", "lapGuru": "", "hs": "", "jm": "", "spp": "", "buletincetak": "", "buletindigital": "", "kajian": "", "khutbah": "" },
            { "id": 15, "name": "Sandy", "kp": "", "kursus": "", "kontrol": "", "kontak": "", "lapGuru": "", "hs": "", "jm": "", "spp": "", "buletincetak": "", "buletindigital": "", "kajian": "", "khutbah": "" },
            { "id": 16, "name": "Hari", "kp": "", "kursus": "", "kontrol": "", "kontak": "", "lapGuru": "", "hs": "", "jm": "", "spp": "", "buletincetak": "", "buletindigital": "", "kajian": "", "khutbah": "" }
        ];

        this.init();
    }

    init() {
        this.initializeElements();
        this.bindEvents();
        this.loadSampleData();
        this.updateUI();
        this.initializeLucide();
        this.setupKeyboardShortcuts();
        this.loadDraft();
    }

    initializeElements() {
        // Form elements
        this.assessmentNameInput = document.getElementById('assessmentName');
        this.periodInput = document.getElementById('period');
        
        // Buttons
        this.addEmployeeBtn = document.getElementById('addEmployeeBtn');
        this.generateExcelBtn = document.getElementById('generateExcelBtn');
        this.saveTemplateBtn = document.getElementById('saveTemplateBtn');
        this.loadTemplateBtn = document.getElementById('loadTemplateBtn');
        this.clearAllBtn = document.getElementById('clearAllBtn');
        
        // Table
        this.employeesTable = document.getElementById('employeesTable');
        this.employeesTableBody = document.getElementById('employeesTableBody');
        this.emptyState = document.getElementById('emptyState');
        this.employeeCount = document.getElementById('employeeCount');
        
        // Modal elements
        this.templateModal = document.getElementById('templateModal');
        this.confirmDialog = document.getElementById('confirmDialog');
        this.loadingOverlay = document.getElementById('loadingOverlay');
        this.toast = document.getElementById('toast');
    }

    bindEvents() {
        // Button events
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
        
        // Form input events with debouncing
        this.assessmentNameInput.addEventListener('input', this.debounce(() => {
            this.autoSave();
            this.updateUI();
        }, 1000));
        
        this.periodInput.addEventListener('input', this.debounce(() => {
            this.autoSave();
            this.updateUI();
        }, 1000));
        
        // Modal events
        this.bindModalEvents();
        
        // Toast events
        const toastClose = document.getElementById('toastClose');
        if (toastClose) {
            toastClose.addEventListener('click', () => this.hideToast());
        }
    }

    bindModalEvents() {
        // Template modal
        const modalClose = document.getElementById('modalClose');
        const modalCancel = document.getElementById('modalCancel');
        const modalOverlay = document.getElementById('modalOverlay');
        
        if (modalClose) {
            modalClose.addEventListener('click', () => this.hideModal());
        }
        if (modalCancel) {
            modalCancel.addEventListener('click', () => this.hideModal());
        }
        if (modalOverlay) {
            modalOverlay.addEventListener('click', () => this.hideModal());
        }
        
        // Confirm dialog
        const confirmCancel = document.getElementById('confirmCancel');
        const confirmOk = document.getElementById('confirmOk');
        
        if (confirmCancel) {
            confirmCancel.addEventListener('click', () => this.hideConfirmDialog());
        }
        if (confirmOk) {
            confirmOk.addEventListener('click', () => this.executeConfirmAction());
        }
    }

    setupKeyboardShortcuts() {
        document.addEventListener('keydown', (e) => {
            // Ctrl/Cmd + N: Add new employee
            if ((e.ctrlKey || e.metaKey) && e.key === 'n') {
                e.preventDefault();
                this.addEmployee();
            }
            
            // Ctrl/Cmd + S: Save template
            if ((e.ctrlKey || e.metaKey) && e.key === 's') {
                e.preventDefault();
                this.saveTemplate();
            }
            
            // Ctrl/Cmd + O: Open template
            if ((e.ctrlKey || e.metaKey) && e.key === 'o') {
                e.preventDefault();
                this.showLoadTemplateModal();
            }
            
            // Ctrl/Cmd + Enter: Generate Excel
            if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
                e.preventDefault();
                this.generateExcel();
            }
        });
    }

    initializeLucide() {
        // Initialize Lucide icons
        if (typeof lucide !== 'undefined' && lucide.createIcons) {
            try {
                lucide.createIcons();
            } catch (error) {
                console.log('Lucide icons initialization skipped');
            }
        }
    }

    loadSampleData() {
        // Load sample employees without the id field for internal use
        this.employees = this.sampleEmployees.map(emp => ({
            name: emp.name,
            kp: emp.kp,
            kursus: emp.kursus,
            kontrol: emp.kontrol,
            kontak: emp.kontak,
            lapGuru: emp.lapGuru,
            hs: emp.hs,
            jm: emp.jm,
            spp: emp.spp,
            buletincetak: emp.buletincetak,
            buletindigital: emp.buletindigital,
            kajian: emp.kajian,
            khutbah: emp.khutbah
        }));
        
        this.renderAllEmployees();
    }

    addEmployee(employeeData = null) {
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
        
        this.employees.push(employee);
        this.renderEmployeeRow(employee, this.employees.length - 1);
        this.updateUI();
        this.autoSave();
        
        // Focus on the first input of the new row
        setTimeout(() => {
            const newRow = this.employeesTableBody.lastElementChild;
            if (newRow) {
                const firstInput = newRow.querySelector('input');
                if (firstInput) {
                    firstInput.focus();
                }
            }
        }, 100);
        
        this.showToast('Karyawan berhasil ditambahkan', 'success');
    }

    renderEmployeeRow(employee, index) {
        const row = document.createElement('tr');
        row.className = 'table-row-enter';
        row.innerHTML = `
            <td class="table-number">${index + 1}</td>
            <td>
                <input type="text" class="table-input" 
                       placeholder="Nama karyawan" 
                       value="${employee.name}"
                       data-field="name" data-index="${index}">
            </td>
            <td>
                <input type="text" class="table-input" 
                       placeholder="K/P"
                       value="${employee.kp}"
                       data-field="kp" data-index="${index}">
            </td>
            <td>
                <input type="text" class="table-input" 
                       placeholder="Kursus"
                       value="${employee.kursus}"
                       data-field="kursus" data-index="${index}">
            </td>
            <td>
                <input type="text" class="table-input" 
                       placeholder="Kontrol"
                       value="${employee.kontrol}"
                       data-field="kontrol" data-index="${index}">
            </td>
            <td>
                <input type="text" class="table-input" 
                       placeholder="Kontak"
                       value="${employee.kontak}"
                       data-field="kontak" data-index="${index}">
            </td>
            <td>
                <input type="text" class="table-input" 
                       placeholder="Lap. Guru"
                       value="${employee.lapGuru}"
                       data-field="lapGuru" data-index="${index}">
            </td>
            <td>
                <input type="text" class="table-input" 
                       placeholder="HS"
                       value="${employee.hs}"
                       data-field="hs" data-index="${index}">
            </td>
            <td>
                <input type="text" class="table-input" 
                       placeholder="JM"
                       value="${employee.jm}"
                       data-field="jm" data-index="${index}">
            </td>
            <td>
                <input type="text" class="table-input" 
                       placeholder="SPP"
                       value="${employee.spp}"
                       data-field="spp" data-index="${index}">
            </td>
            <td>
                <input type="text" class="table-input" 
                       placeholder="Buletin Cetak"
                       value="${employee.buletincetak}"
                       data-field="buletincetak" data-index="${index}">
            </td>
            <td>
                <input type="text" class="table-input" 
                       placeholder="Buletin Digital"
                       value="${employee.buletindigital}"
                       data-field="buletindigital" data-index="${index}">
            </td>
            <td>
                <input type="text" class="table-input" 
                       placeholder="Kajian"
                       value="${employee.kajian}"
                       data-field="kajian" data-index="${index}">
            </td>
            <td>
                <input type="text" class="table-input" 
                       placeholder="Khutbah"
                       value="${employee.khutbah}"
                       data-field="khutbah" data-index="${index}">
            </td>
            <td>
                <div class="table-actions">
                    <button class="btn-icon btn-icon--danger" onclick="window.app.removeEmployee(${index})" 
                            title="Hapus karyawan">
                        <i data-lucide="trash-2"></i>
                    </button>
                </div>
            </td>
        `;
        
        this.employeesTableBody.appendChild(row);
        
        // Bind input events
        const inputs = row.querySelectorAll('input');
        inputs.forEach(input => {
            input.addEventListener('input', this.debounce((e) => {
                this.updateEmployeeData(e.target);
                this.autoSave();
            }, 500));
            
            input.addEventListener('change', (e) => {
                this.updateEmployeeData(e.target);
                this.autoSave();
            });
        });
        
        // Re-initialize Lucide icons
        this.initializeLucide();
    }

    updateEmployeeData(input) {
        const index = parseInt(input.dataset.index);
        const field = input.dataset.field;
        
        if (this.employees[index]) {
            this.employees[index][field] = input.value;
        }
    }

    removeEmployee(index) {
        this.employees.splice(index, 1);
        this.renderAllEmployees();
        this.updateUI();
        this.autoSave();
        this.showToast('Karyawan berhasil dihapus', 'success');
    }

    renderAllEmployees() {
        this.employeesTableBody.innerHTML = '';
        this.employees.forEach((employee, index) => {
            this.renderEmployeeRow(employee, index);
        });
    }

    updateUI() {
        const hasEmployees = this.employees.length > 0;
        
        // Show/hide table and empty state
        if (this.employeesTable && this.emptyState) {
            this.employeesTable.style.display = hasEmployees ? 'table' : 'none';
            this.emptyState.classList.toggle('hidden', hasEmployees);
        }
        
        // Update employee count
        if (this.employeeCount) {
            this.employeeCount.textContent = `${this.employees.length} karyawan`;
        }
        
        // Enable/disable generate button
        const hasAssessmentData = this.assessmentNameInput?.value?.trim() && this.periodInput?.value?.trim();
        if (this.generateExcelBtn) {
            this.generateExcelBtn.disabled = !hasEmployees || !hasAssessmentData;
        }
        
        // Update save template button state
        if (this.saveTemplateBtn) {
            this.saveTemplateBtn.disabled = !hasEmployees && !hasAssessmentData;
        }
    }

    async generateExcel() {
        if (!this.validateForm()) {
            return;
        }

        this.showLoading('Membuat laporan Excel...');
        
        try {
            // Check if XLSX is available
            if (typeof XLSX === 'undefined') {
                throw new Error('Library Excel tidak tersedia');
            }
            
            // Simulate processing time for better UX
            await this.delay(1000);
            
            const wb = XLSX.utils.book_new();
            
            // Create worksheet data with exact column headers
            const wsData = [
                ['LAPORAN ASESMEN KARYAWAN'],
                [''],
                ['Nama Asesmen:', this.assessmentNameInput.value],
                ['Periode:', this.periodInput.value],
                ['Tanggal Dibuat:', new Date().toLocaleDateString('id-ID')],
                [''],
                ['NO', 'NAMA', 'K/P', 'KURSUS', 'KONTROL', 'KONTAK', 'LAP. GURU', 'HS', 'JM', 'SPP', 'BULETIN CETAK', 'BULETIN DIGITAL', 'KAJIAN', 'KHUTBAH']
            ];
            
            // Add employee data
            this.employees.forEach((employee, index) => {
                wsData.push([
                    index + 1,
                    employee.name || '',
                    employee.kp || '',
                    employee.kursus || '',
                    employee.kontrol || '',
                    employee.kontak || '',
                    employee.lapGuru || '',
                    employee.hs || '',
                    employee.jm || '',
                    employee.spp || '',
                    employee.buletincetak || '',
                    employee.buletindigital || '',
                    employee.kajian || '',
                    employee.khutbah || ''
                ]);
            });
            
            // Add summary
            wsData.push(['']);
            wsData.push(['RINGKASAN']);
            wsData.push(['Total Karyawan:', this.employees.length]);
            
            const ws = XLSX.utils.aoa_to_sheet(wsData);
            
            // Set column widths for better formatting
            ws['!cols'] = [
                {wch: 5}, {wch: 20}, {wch: 10}, {wch: 12}, {wch: 12}, {wch: 12}, 
                {wch: 12}, {wch: 8}, {wch: 8}, {wch: 8}, {wch: 15}, {wch: 15}, 
                {wch: 12}, {wch: 12}
            ];
            
            XLSX.utils.book_append_sheet(wb, ws, 'Laporan Asesmen');
            
            // Generate filename
            const assessmentName = this.assessmentNameInput.value.replace(/[^a-zA-Z0-9]/g, '_') || 'Asesmen';
            const filename = `Laporan_${assessmentName}_${Date.now()}.xlsx`;
            
            XLSX.writeFile(wb, filename);
            
            this.showToast('Laporan Excel berhasil dibuat dan diunduh!', 'success');
            
        } catch (error) {
            console.error('Error generating Excel:', error);
            this.showToast('Terjadi kesalahan saat membuat laporan Excel: ' + error.message, 'error');
        } finally {
            this.hideLoading();
        }
    }

    validateForm() {
        const errors = [];
        
        if (!this.assessmentNameInput?.value?.trim()) {
            errors.push('Nama asesmen harus diisi');
        }
        
        if (!this.periodInput?.value?.trim()) {
            errors.push('Periode harus diisi');
        }
        
        if (this.employees.length === 0) {
            errors.push('Minimal harus ada 1 karyawan');
        }
        
        // Validate employee data
        this.employees.forEach((employee, index) => {
            if (!employee.name?.trim()) {
                errors.push(`Nama karyawan baris ${index + 1} harus diisi`);
            }
        });
        
        if (errors.length > 0) {
            this.showToast(errors[0], 'error');
            return false;
        }
        
        return true;
    }

    saveTemplate() {
        if (!this.hasData()) {
            this.showToast('Tidak ada data untuk disimpan', 'error');
            return;
        }

        const templateName = prompt('Masukkan nama template:', 
            this.assessmentNameInput?.value || `Template ${new Date().toLocaleDateString('id-ID')}`);
        
        if (!templateName) return;
        
        const template = {
            id: Date.now().toString(),
            name: templateName,
            assessmentName: this.assessmentNameInput?.value || '',
            period: this.periodInput?.value || '',
            employees: [...this.employees],
            createdAt: new Date().toISOString()
        };
        
        this.templates.push(template);
        this.saveTemplates();
        this.currentTemplateId = template.id;
        
        this.showToast('Template berhasil disimpan!', 'success');
    }

    showLoadTemplateModal() {
        if (this.templates.length === 0) {
            this.showToast('Tidak ada template tersimpan', 'error');
            return;
        }

        const modalTitle = document.getElementById('modalTitle');
        const modalBody = document.getElementById('modalBody');
        const modalFooter = document.getElementById('modalFooter');
        
        if (!modalTitle || !modalBody || !modalFooter) return;
        
        modalTitle.textContent = 'Pilih Template';
        
        modalBody.innerHTML = `
            <div class="template-list">
                ${this.templates.map(template => `
                    <div class="template-item" data-template-id="${template.id}">
                        <div class="template-name">${template.name}</div>
                        <div class="template-meta">
                            <span>${template.employees.length} karyawan</span>
                            <span>${new Date(template.createdAt).toLocaleDateString('id-ID')}</span>
                        </div>
                    </div>
                `).join('')}
            </div>
        `;
        
        modalFooter.innerHTML = `
            <button class="btn btn--outline" id="modalCancel">Batal</button>
            <button class="btn btn--outline btn--sm" id="deleteTemplateBtn" disabled>
                <i data-lucide="trash-2"></i> Hapus Template
            </button>
            <button class="btn btn--primary" id="loadTemplateConfirm" disabled>Muat Template</button>
        `;
        
        this.showModal();
        this.initializeLucide();
        
        let selectedTemplateId = null;
        
        // Template selection
        modalBody.querySelectorAll('.template-item').forEach(item => {
            item.addEventListener('click', () => {
                modalBody.querySelectorAll('.template-item').forEach(i => i.classList.remove('selected'));
                item.classList.add('selected');
                selectedTemplateId = item.dataset.templateId;
                const loadBtn = document.getElementById('loadTemplateConfirm');
                const deleteBtn = document.getElementById('deleteTemplateBtn');
                if (loadBtn) loadBtn.disabled = false;
                if (deleteBtn) deleteBtn.disabled = false;
            });
        });
        
        // Load template
        const loadBtn = document.getElementById('loadTemplateConfirm');
        if (loadBtn) {
            loadBtn.addEventListener('click', () => {
                if (selectedTemplateId) {
                    this.loadTemplate(selectedTemplateId);
                    this.hideModal();
                }
            });
        }
        
        // Delete template
        const deleteBtn = document.getElementById('deleteTemplateBtn');
        if (deleteBtn) {
            deleteBtn.addEventListener('click', () => {
                if (selectedTemplateId) {
                    this.deleteTemplate(selectedTemplateId);
                    this.showLoadTemplateModal(); // Refresh the modal
                }
            });
        }
        
        // Re-bind cancel button
        const cancelBtn = document.getElementById('modalCancel');
        if (cancelBtn) {
            cancelBtn.addEventListener('click', () => this.hideModal());
        }
    }

    loadTemplate(templateId) {
        const template = this.templates.find(t => t.id === templateId);
        if (!template) return;
        
        if (this.assessmentNameInput) this.assessmentNameInput.value = template.assessmentName;
        if (this.periodInput) this.periodInput.value = template.period;
        this.employees = [...template.employees];
        this.currentTemplateId = templateId;
        
        this.renderAllEmployees();
        this.updateUI();
        
        this.showToast(`Template "${template.name}" berhasil dimuat!`, 'success');
    }

    deleteTemplate(templateId) {
        const template = this.templates.find(t => t.id === templateId);
        if (!template) return;
        
        if (confirm(`Hapus template "${template.name}"?`)) {
            this.templates = this.templates.filter(t => t.id !== templateId);
            this.saveTemplates();
            this.showToast('Template berhasil dihapus', 'success');
        }
    }

    confirmClearAll() {
        if (!this.hasData()) {
            this.showToast('Tidak ada data untuk dihapus', 'error');
            return;
        }

        this.showConfirmDialog(
            'Hapus Semua Data',
            'Apakah Anda yakin ingin menghapus semua data? Tindakan ini tidak dapat dibatalkan.',
            () => this.clearAll()
        );
    }

    clearAll() {
        if (this.assessmentNameInput) this.assessmentNameInput.value = '';
        if (this.periodInput) this.periodInput.value = '';
        this.employees = [];
        this.currentTemplateId = null;
        
        this.renderAllEmployees();
        this.updateUI();
        this.clearAutoSave();
        
        this.showToast('Semua data berhasil dihapus', 'success');
    }

    hasData() {
        return (this.assessmentNameInput?.value?.trim()) || 
               (this.periodInput?.value?.trim()) || 
               this.employees.length > 0;
    }

    // Auto-save functionality
    autoSave() {
        if (!this.hasData()) return;
        
        clearTimeout(this.autoSaveTimeout);
        this.autoSaveTimeout = setTimeout(() => {
            const draft = {
                assessmentName: this.assessmentNameInput?.value || '',
                period: this.periodInput?.value || '',
                employees: [...this.employees],
                savedAt: new Date().toISOString()
            };
            
            try {
                localStorage.setItem('assessmentDraft', JSON.stringify(draft));
            } catch (error) {
                console.error('Error saving draft:', error);
            }
        }, 2000);
    }

    loadDraft() {
        // Don't load draft if we already have sample data
        if (this.employees.length > 0) return;
        
        try {
            const draft = JSON.parse(localStorage.getItem('assessmentDraft') || '{}');
            if (draft && (draft.assessmentName || draft.period || (draft.employees && draft.employees.length > 0))) {
                if (this.assessmentNameInput) this.assessmentNameInput.value = draft.assessmentName || '';
                if (this.periodInput) this.periodInput.value = draft.period || '';
                this.employees = draft.employees || [];
                
                this.renderAllEmployees();
                this.updateUI();
                
                // Show toast about loaded draft
                const savedAt = new Date(draft.savedAt).toLocaleString('id-ID');
                this.showToast(`Draft terakhir dimuat (disimpan: ${savedAt})`, 'success');
            }
        } catch (error) {
            console.error('Error loading draft:', error);
        }
    }

    clearAutoSave() {
        try {
            localStorage.removeItem('assessmentDraft');
        } catch (error) {
            console.error('Error clearing draft:', error);
        }
    }

    // Template persistence
    saveTemplates() {
        try {
            localStorage.setItem('assessmentTemplates', JSON.stringify(this.templates));
        } catch (error) {
            console.error('Error saving templates:', error);
        }
    }

    loadTemplates() {
        try {
            return JSON.parse(localStorage.getItem('assessmentTemplates') || '[]');
        } catch (error) {
            console.error('Error loading templates:', error);
            return [];
        }
    }

    // Modal utilities
    showModal() {
        if (this.templateModal) {
            this.templateModal.classList.remove('hidden');
            document.body.style.overflow = 'hidden';
        }
    }

    hideModal() {
        if (this.templateModal) {
            this.templateModal.classList.add('hidden');
            document.body.style.overflow = 'auto';
        }
    }

    showConfirmDialog(title, message, onConfirm) {
        const confirmTitle = document.getElementById('confirmTitle');
        const confirmMessage = document.getElementById('confirmMessage');
        
        if (confirmTitle) confirmTitle.textContent = title;
        if (confirmMessage) confirmMessage.textContent = message;
        
        this.confirmAction = onConfirm;
        if (this.confirmDialog) {
            this.confirmDialog.classList.remove('hidden');
            document.body.style.overflow = 'hidden';
        }
    }

    hideConfirmDialog() {
        if (this.confirmDialog) {
            this.confirmDialog.classList.add('hidden');
            document.body.style.overflow = 'auto';
        }
        this.confirmAction = null;
    }

    executeConfirmAction() {
        if (this.confirmAction) {
            this.confirmAction();
        }
        this.hideConfirmDialog();
    }

    // Loading utilities
    showLoading(message = 'Memproses...') {
        if (this.loadingOverlay) {
            const loadingText = this.loadingOverlay.querySelector('p');
            if (loadingText) loadingText.textContent = message;
            this.loadingOverlay.classList.remove('hidden');
        }
    }

    hideLoading() {
        if (this.loadingOverlay) {
            this.loadingOverlay.classList.add('hidden');
        }
    }

    // Toast utilities
    showToast(message, type = 'success') {
        if (!this.toast) return;
        
        const toastIcon = this.toast.querySelector('.toast-icon');
        const toastMessage = this.toast.querySelector('.toast-message');
        
        if (toastMessage) toastMessage.textContent = message;
        
        // Update icon and color based on type
        if (toastIcon) {
            toastIcon.classList.remove('error');
            if (type === 'error') {
                toastIcon.classList.add('error');
                toastIcon.setAttribute('data-lucide', 'alert-circle');
            } else {
                toastIcon.setAttribute('data-lucide', 'check-circle');
            }
        }
        
        this.initializeLucide();
        
        this.toast.classList.remove('hidden');
        
        // Auto-hide after 5 seconds
        setTimeout(() => {
            this.hideToast();
        }, 5000);
    }

    hideToast() {
        if (this.toast) {
            this.toast.classList.add('hidden');
        }
    }

    // Utility functions
    debounce(func, delay) {
        let timeoutId;
        return (...args) => {
            clearTimeout(timeoutId);
            timeoutId = setTimeout(() => func.apply(this, args), delay);
        };
    }

    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    try {
        window.app = new AssessmentReportGenerator();
    } catch (error) {
        console.error('Error initializing application:', error);
    }
});