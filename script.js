// SolidWorks Portfolio - Interactive JavaScript with Dynamic Theming

document.addEventListener('DOMContentLoaded', function() {
    // Initialize welcome modal first (for first-time visitors)
    initWelcomeModal();
    
    // Initialize theme system
    initThemeSystem();
    
    // Initialize all components
    initTabNavigation();
    initTreeNavigation();
    initBOMTable();
    initSkillCategories();
    initContactForm();
    initResizePanel();
    initMobileMenu();
});

// ===== Welcome Modal for First-Time Visitors =====
function initWelcomeModal() {
    const modal = document.getElementById('welcomeModal');
    const closeBtn = document.getElementById('closeWelcome');
    const helpBtn = document.getElementById('helpBtn');
    const dontShowCheckbox = document.getElementById('dontShowAgain');
    
    // Check if user has seen the welcome modal before
    const hasSeenWelcome = localStorage.getItem('sw-portfolio-welcomed');
    
    if (hasSeenWelcome === 'true') {
        modal.classList.add('hidden');
    }
    
    // Close button handler
    if (closeBtn) {
        closeBtn.addEventListener('click', () => {
            modal.classList.add('hidden');
            
            // Save preference if checkbox is checked
            if (dontShowCheckbox && dontShowCheckbox.checked) {
                localStorage.setItem('sw-portfolio-welcomed', 'true');
            }
        });
    }
    
    // Help button to show modal again
    if (helpBtn) {
        helpBtn.addEventListener('click', () => {
            modal.classList.remove('hidden');
        });
    }
    
    // Close on background click
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.classList.add('hidden');
        }
    });
    
    // Close on Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
            modal.classList.add('hidden');
        }
    });
}

// ===== Dynamic Theme System =====
const THEME_PRESETS = [
    { name: 'SolidWorks Blue', accent: '#007acc', accentHover: '#1e90ff', rgb: '0, 122, 204' },
    { name: 'CATIA Red', accent: '#e74c3c', accentHover: '#ff6b5b', rgb: '231, 76, 60' },
    { name: 'Fusion Orange', accent: '#ff8c00', accentHover: '#ffa500', rgb: '255, 140, 0' },
    { name: 'Inventor Green', accent: '#27ae60', accentHover: '#2ecc71', rgb: '39, 174, 96' },
    { name: 'NX Purple', accent: '#9b59b6', accentHover: '#b07cc6', rgb: '155, 89, 182' },
    { name: 'Onshape Cyan', accent: '#00bcd4', accentHover: '#26c6da', rgb: '0, 188, 212' },
    { name: 'Creo Magenta', accent: '#e91e63', accentHover: '#f06292', rgb: '233, 30, 99' },
    { name: 'FreeCAD Teal', accent: '#009688', accentHover: '#26a69a', rgb: '0, 150, 136' },
];

let currentThemeIndex = 0;

function initThemeSystem() {
    // Check for saved theme or generate random one
    const savedTheme = localStorage.getItem('sw-portfolio-theme');
    
    if (savedTheme !== null) {
        currentThemeIndex = parseInt(savedTheme);
    } else {
        // Random theme for new visitors
        currentThemeIndex = Math.floor(Math.random() * THEME_PRESETS.length);
        localStorage.setItem('sw-portfolio-theme', currentThemeIndex);
    }
    
    applyTheme(currentThemeIndex);
    
    // Theme toggle button
    const themeBtn = document.getElementById('themeToggle');
    if (themeBtn) {
        themeBtn.addEventListener('click', () => {
            currentThemeIndex = (currentThemeIndex + 1) % THEME_PRESETS.length;
            applyTheme(currentThemeIndex);
            localStorage.setItem('sw-portfolio-theme', currentThemeIndex);
            
            // Visual feedback
            themeBtn.style.transform = 'rotate(360deg)';
            setTimeout(() => { themeBtn.style.transform = ''; }, 300);
            
            showNotification(`Theme: ${THEME_PRESETS[currentThemeIndex].name}`, 'success');
        });
    }
}

function applyTheme(index) {
    const theme = THEME_PRESETS[index];
    const root = document.documentElement;
    
    root.style.setProperty('--sw-accent', theme.accent);
    root.style.setProperty('--sw-accent-hover', theme.accentHover);
    root.style.setProperty('--sw-accent-rgb', theme.rgb);
    
    // Update meta theme color for mobile browsers
    let metaTheme = document.querySelector('meta[name="theme-color"]');
    if (!metaTheme) {
        metaTheme = document.createElement('meta');
        metaTheme.name = 'theme-color';
        document.head.appendChild(metaTheme);
    }
    metaTheme.content = theme.accent;
}

// ===== Tab Navigation (Command Manager) =====
function initTabNavigation() {
    const tabs = document.querySelectorAll('.sw-tab');
    const treeNodes = document.querySelectorAll('.sw-tree-node[data-section]');
    
    // Tab click handler
    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const sectionId = tab.dataset.section;
            navigateToSection(sectionId);
            
            // Update active tab
            tabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
        });
    });
    
    // Tree node navigation
    treeNodes.forEach(node => {
        node.addEventListener('click', (e) => {
            const sectionId = node.dataset.section;
            if (sectionId) {
                navigateToSection(sectionId);
                
                // Update corresponding tab
                tabs.forEach(tab => {
                    tab.classList.toggle('active', tab.dataset.section === sectionId);
                });
                
                // Highlight tree node
                treeNodes.forEach(n => n.classList.remove('selected'));
                node.classList.add('selected');
            }
        });
    });
}

function navigateToSection(sectionId) {
    const sections = document.querySelectorAll('.sw-section');
    sections.forEach(section => {
        section.classList.toggle('active', section.id === sectionId);
    });
    
    // Add smooth scroll effect simulation
    const activeSection = document.getElementById(sectionId);
    if (activeSection) {
        activeSection.style.opacity = '0';
        activeSection.style.transform = 'translateY(10px)';
        
        requestAnimationFrame(() => {
            activeSection.style.transition = 'opacity 0.3s, transform 0.3s';
            activeSection.style.opacity = '1';
            activeSection.style.transform = 'translateY(0)';
        });
    }
}

// ===== Tree Navigation (FeatureManager) =====
function initTreeNavigation() {
    const treeItems = document.querySelectorAll('.sw-tree-item');
    
    treeItems.forEach(item => {
        const toggle = item.querySelector(':scope > .sw-tree-node .sw-tree-toggle');
        const children = item.querySelector(':scope > .sw-tree-children');
        
        if (toggle && children) {
            toggle.addEventListener('click', (e) => {
                e.stopPropagation();
                item.classList.toggle('expanded');
            });
        }
    });
    
    // Double-click to expand/collapse all children
    treeItems.forEach(item => {
        const node = item.querySelector(':scope > .sw-tree-node');
        if (node) {
            node.addEventListener('dblclick', () => {
                const isExpanded = item.classList.contains('expanded');
                const allChildren = item.querySelectorAll('.sw-tree-item');
                
                allChildren.forEach(child => {
                    child.classList.toggle('expanded', !isExpanded);
                });
            });
        }
    });
}

// ===== BOM Table (Experience Section) =====
function initBOMTable() {
    const bomItems = document.querySelectorAll('.sw-bom-item');
    
    // Toggle individual items
    bomItems.forEach(item => {
        const row = item.querySelector('.sw-bom-row');
        
        row.addEventListener('click', () => {
            item.classList.toggle('expanded');
            
            // Update toggle icon
            const toggle = item.querySelector('.sw-tree-toggle');
            if (toggle) {
                toggle.classList.toggle('fa-chevron-right', !item.classList.contains('expanded'));
                toggle.classList.toggle('fa-chevron-down', item.classList.contains('expanded'));
            }
        });
    });
}

// ===== Skill Categories Toggle =====
function initSkillCategories() {
    const categoryHeaders = document.querySelectorAll('.sw-skill-category-header');
    
    categoryHeaders.forEach(header => {
        header.addEventListener('click', () => {
            const category = header.closest('.sw-skill-category');
            const content = category.querySelector('.sw-skill-items, .sw-clubs-list');
            const icon = header.querySelector('i:first-child');
            
            if (content) {
                const isHidden = content.style.display === 'none';
                content.style.display = isHidden ? '' : 'none';
                
                if (icon) {
                    icon.classList.toggle('fa-chevron-down', isHidden);
                    icon.classList.toggle('fa-chevron-right', !isHidden);
                }
            }
        });
    });
}

// ===== Contact Form =====
function initContactForm() {
    const form = document.getElementById('contactForm');
    
    if (form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            
            // Get form data
            const formData = new FormData(form);
            const data = {
                name: formData.get('name'),
                email: formData.get('email'),
                subject: formData.get('subject'),
                message: formData.get('message')
            };
            
            // Create mailto link
            const mailtoLink = `mailto:jalapat@lion.lmu.edu?subject=${encodeURIComponent(data.subject)}&body=${encodeURIComponent(`From: ${data.name} (${data.email})\n\n${data.message}`)}`;
            
            // Show confirmation
            showNotification('Opening email client...', 'success');
            
            // Open email client
            setTimeout(() => {
                window.location.href = mailtoLink;
            }, 500);
            
            // Reset form
            form.reset();
        });
    }
}

// ===== Resize Panel =====
function initResizePanel() {
    const resizeHandle = document.querySelector('.sw-panel-resize');
    const featureManager = document.querySelector('.sw-featuremanager');
    
    if (resizeHandle && featureManager) {
        let isResizing = false;
        let startX;
        let startWidth;
        
        resizeHandle.addEventListener('mousedown', (e) => {
            isResizing = true;
            startX = e.clientX;
            startWidth = featureManager.offsetWidth;
            
            document.addEventListener('mousemove', handleMouseMove);
            document.addEventListener('mouseup', handleMouseUp);
            
            // Prevent text selection
            document.body.style.userSelect = 'none';
        });
        
        function handleMouseMove(e) {
            if (!isResizing) return;
            
            const diff = e.clientX - startX;
            const newWidth = Math.max(200, Math.min(400, startWidth + diff));
            featureManager.style.width = `${newWidth}px`;
        }
        
        function handleMouseUp() {
            isResizing = false;
            document.removeEventListener('mousemove', handleMouseMove);
            document.removeEventListener('mouseup', handleMouseUp);
            document.body.style.userSelect = '';
        }
    }
}

// ===== Notification System =====
function showNotification(message, type = 'info') {
    // Remove existing notification
    const existing = document.querySelector('.sw-notification');
    if (existing) existing.remove();
    
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `sw-notification sw-notification-${type}`;
    notification.innerHTML = `
        <i class="fas ${type === 'success' ? 'fa-palette' : 'fa-info-circle'}"></i>
        <span>${message}</span>
    `;
    
    // Get current accent color
    const accentColor = getComputedStyle(document.documentElement).getPropertyValue('--sw-accent').trim();
    
    // Style the notification
    Object.assign(notification.style, {
        position: 'fixed',
        bottom: '20px',
        right: '20px',
        background: accentColor,
        color: 'white',
        padding: '12px 20px',
        borderRadius: '4px',
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
        boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
        zIndex: '1000',
        animation: 'slideIn 0.3s ease',
        fontWeight: '500'
    });
    
    // Add animation keyframes
    if (!document.getElementById('notification-styles')) {
        const style = document.createElement('style');
        style.id = 'notification-styles';
        style.textContent = `
            @keyframes slideIn {
                from { transform: translateX(100%); opacity: 0; }
                to { transform: translateX(0); opacity: 1; }
            }
            @keyframes slideOut {
                from { transform: translateX(0); opacity: 1; }
                to { transform: translateX(100%); opacity: 0; }
            }
        `;
        document.head.appendChild(style);
    }
    
    document.body.appendChild(notification);
    
    // Remove after delay
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    }, 2000);
}

// ===== Toolbar Button Interactions =====
document.querySelectorAll('.sw-toolbar-btn').forEach(btn => {
    btn.addEventListener('click', function(e) {
        // Add click feedback
        this.style.transform = 'scale(0.95)';
        setTimeout(() => {
            this.style.transform = '';
        }, 100);
    });
});

// ===== Keyboard Navigation =====
document.addEventListener('keydown', (e) => {
    // Tab navigation with number keys
    if (e.key >= '1' && e.key <= '6') {
        const tabs = document.querySelectorAll('.sw-tab');
        const index = parseInt(e.key) - 1;
        if (tabs[index]) {
            tabs[index].click();
        }
    }
    
    // Escape to go home
    if (e.key === 'Escape') {
        const homeTab = document.querySelector('.sw-tab[data-section="home"]');
        if (homeTab) {
            homeTab.click();
        }
    }
    
    // T key to toggle theme
    if (e.key === 't' || e.key === 'T') {
        const themeBtn = document.getElementById('themeToggle');
        if (themeBtn) {
            themeBtn.click();
        }
    }
});

// ===== Mobile Menu Toggle =====
function initMobileMenu() {
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    const sidebar = document.getElementById('sidebar');
    const overlay = document.getElementById('sidebarOverlay');
    
    if (!mobileMenuBtn || !sidebar) return;
    
    // Toggle sidebar on button click
    mobileMenuBtn.addEventListener('click', () => {
        sidebar.classList.toggle('open');
        if (overlay) overlay.classList.toggle('visible');
        
        // Change icon
        const icon = mobileMenuBtn.querySelector('i');
        if (icon) {
            icon.className = sidebar.classList.contains('open') ? 'fas fa-times' : 'fas fa-bars';
        }
    });
    
    // Close sidebar when clicking overlay
    if (overlay) {
        overlay.addEventListener('click', () => {
            sidebar.classList.remove('open');
            overlay.classList.remove('visible');
            const icon = mobileMenuBtn.querySelector('i');
            if (icon) icon.className = 'fas fa-bars';
        });
    }
    
    // Close sidebar when clicking a navigation item on mobile
    const navNodes = sidebar.querySelectorAll('.sw-tree-node');
    navNodes.forEach(node => {
        node.addEventListener('click', () => {
            if (window.innerWidth <= 900) {
                sidebar.classList.remove('open');
                if (overlay) overlay.classList.remove('visible');
                const icon = mobileMenuBtn.querySelector('i');
                if (icon) icon.className = 'fas fa-bars';
            }
        });
    });
    
    // Handle resize - close sidebar if screen becomes large
    window.addEventListener('resize', () => {
        if (window.innerWidth > 900) {
            sidebar.classList.remove('open');
            if (overlay) overlay.classList.remove('visible');
            const icon = mobileMenuBtn.querySelector('i');
            if (icon) icon.className = 'fas fa-bars';
        }
    });
    
    // Initialize mobile model sidebar (slide-up panel)
    initMobileModelSidebar();
}

// ===== Mobile Model Sidebar (Slide-up Panel) =====
function initMobileModelSidebar() {
    const modelSidebar = document.querySelector('.sw-model-sidebar');
    if (!modelSidebar) return;
    
    let startY = 0;
    let currentY = 0;
    let isDragging = false;
    
    // Touch start
    modelSidebar.addEventListener('touchstart', (e) => {
        // Only enable drag from top area of sidebar
        const touch = e.touches[0];
        const rect = modelSidebar.getBoundingClientRect();
        
        // Allow drag from top 50px of the sidebar
        if (touch.clientY - rect.top < 50) {
            startY = touch.clientY;
            isDragging = true;
            modelSidebar.style.transition = 'none';
        }
    }, { passive: true });
    
    // Touch move
    modelSidebar.addEventListener('touchmove', (e) => {
        if (!isDragging) return;
        
        currentY = e.touches[0].clientY;
        const deltaY = currentY - startY;
        
        // Only allow dragging down when expanded, or up when collapsed
        const isExpanded = modelSidebar.classList.contains('expanded');
        
        if (isExpanded && deltaY > 0) {
            // Dragging down while expanded - collapse
            const newTranslate = Math.min(deltaY, modelSidebar.offsetHeight - 60);
            modelSidebar.style.transform = `translateY(${newTranslate}px)`;
        } else if (!isExpanded && deltaY < 0) {
            // Dragging up while collapsed - expand
            const baseTranslate = modelSidebar.offsetHeight - 60;
            const newTranslate = Math.max(baseTranslate + deltaY, 0);
            modelSidebar.style.transform = `translateY(${newTranslate}px)`;
        }
    }, { passive: true });
    
    // Touch end
    modelSidebar.addEventListener('touchend', () => {
        if (!isDragging) return;
        
        isDragging = false;
        modelSidebar.style.transition = 'transform 0.3s ease';
        
        const deltaY = currentY - startY;
        const threshold = 50;
        
        if (Math.abs(deltaY) > threshold) {
            if (deltaY < 0) {
                // Swiped up - expand
                modelSidebar.classList.add('expanded');
            } else {
                // Swiped down - collapse
                modelSidebar.classList.remove('expanded');
            }
        }
        
        // Reset transform to let CSS handle positioning
        modelSidebar.style.transform = '';
    });
    
    // Click to toggle (on the handle area)
    modelSidebar.addEventListener('click', (e) => {
        // Only toggle if clicking near the top (handle area)
        const rect = modelSidebar.getBoundingClientRect();
        if (e.clientY - rect.top < 40) {
            modelSidebar.classList.toggle('expanded');
        }
    });
    
    // Collapse when a model is selected
    const modelCards = document.querySelectorAll('.sw-model-card');
    modelCards.forEach(card => {
        card.addEventListener('click', () => {
            if (window.innerWidth <= 600) {
                setTimeout(() => {
                    modelSidebar.classList.remove('expanded');
                }, 300);
            }
        });
    });
}

// ===== Smooth Loading Animation =====
window.addEventListener('load', () => {
    document.body.style.opacity = '0';
    document.body.style.transition = 'opacity 0.5s ease';
    
    requestAnimationFrame(() => {
        document.body.style.opacity = '1';
    });
});

// ===== Project Card Hover Effects =====
document.querySelectorAll('.sw-project-card').forEach(card => {
    card.addEventListener('mouseenter', function() {
        const preview = this.querySelector('.sw-preview-placeholder i');
        if (preview) {
            preview.style.transform = 'scale(1.1) rotateY(15deg)';
            preview.style.transition = 'transform 0.3s ease';
        }
    });
    
    card.addEventListener('mouseleave', function() {
        const preview = this.querySelector('.sw-preview-placeholder i');
        if (preview) {
            preview.style.transform = '';
        }
    });
});

// ===== Tree Selection Highlight =====
document.querySelectorAll('.sw-tree-node').forEach(node => {
    node.addEventListener('click', function() {
        // Remove previous selection
        document.querySelectorAll('.sw-tree-node.selected').forEach(n => {
            n.classList.remove('selected');
            n.style.background = '';
        });
        
        // Add selection to clicked node
        this.classList.add('selected');
        this.style.background = 'var(--sw-selection)';
    });
});

// ===== 3D STL Viewer =====
let stlScene, stlCamera, stlRenderer, stlControls, currentMesh;
let isWireframe = false;
let isAutoRotate = true; // Auto-rotate enabled by default

function initSTLViewer() {
    const container = document.getElementById('stlViewer');
    if (!container) return;
    
    // Scene setup
    stlScene = new THREE.Scene();
    stlScene.background = new THREE.Color(0x1a1a1a);
    
    // Camera setup
    const aspect = container.clientWidth / container.clientHeight;
    stlCamera = new THREE.PerspectiveCamera(45, aspect, 0.1, 1000);
    stlCamera.position.set(0, 0, 100);
    
    // Renderer setup
    stlRenderer = new THREE.WebGLRenderer({ antialias: true });
    stlRenderer.setSize(container.clientWidth, container.clientHeight);
    stlRenderer.setPixelRatio(Math.min(window.devicePixelRatio, 2)); // Limit pixel ratio for performance
    container.appendChild(stlRenderer.domElement);
    
    // Orbit Controls with touch support
    stlControls = new THREE.OrbitControls(stlCamera, stlRenderer.domElement);
    stlControls.enableDamping = true;
    stlControls.dampingFactor = 0.05;
    stlControls.autoRotate = true; // Auto-rotate enabled by default
    stlControls.autoRotateSpeed = 2;
    
    // Enhanced touch controls
    stlControls.touches = {
        ONE: THREE.TOUCH.ROTATE,
        TWO: THREE.TOUCH.DOLLY_PAN
    };
    stlControls.enablePan = true;
    stlControls.minDistance = 30;
    stlControls.maxDistance = 300;
    
    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    stlScene.add(ambientLight);
    
    const directionalLight1 = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight1.position.set(1, 1, 1);
    stlScene.add(directionalLight1);
    
    const directionalLight2 = new THREE.DirectionalLight(0xffffff, 0.4);
    directionalLight2.position.set(-1, -1, -1);
    stlScene.add(directionalLight2);
    
    // Grid helper
    const gridHelper = new THREE.GridHelper(100, 20, 0x444444, 0x333333);
    gridHelper.rotation.x = Math.PI / 2;
    stlScene.add(gridHelper);
    
    // Load sample cube by default
    loadSampleCube();
    
    // Handle window resize
    window.addEventListener('resize', onViewerResize);
    
    // Start animation loop
    animateSTL();
    
    // Setup controls
    setupViewerControls();
    
    // Setup file upload
    setupFileUpload();
}

function loadSampleCube() {
    // Create a sample geometry (a more interesting shape)
    const geometry = new THREE.BoxGeometry(30, 30, 30);
    
    // Get accent color from CSS
    const accentColor = getComputedStyle(document.documentElement)
        .getPropertyValue('--sw-accent').trim() || '#007acc';
    
    const material = new THREE.MeshPhongMaterial({
        color: accentColor,
        specular: 0x444444,
        shininess: 30,
        flatShading: true
    });
    
    if (currentMesh) {
        stlScene.remove(currentMesh);
    }
    
    currentMesh = new THREE.Mesh(geometry, material);
    stlScene.add(currentMesh);
    
    // Center camera on object
    centerCameraOnObject(currentMesh);
}

function loadSTLFile(file) {
    const loader = new THREE.STLLoader();
    const reader = new FileReader();
    
    reader.onload = function(e) {
        const geometry = loader.parse(e.target.result);
        
        // Get accent color from CSS
        const accentColor = getComputedStyle(document.documentElement)
            .getPropertyValue('--sw-accent').trim() || '#007acc';
        
        const material = new THREE.MeshPhongMaterial({
            color: accentColor,
            specular: 0x444444,
            shininess: 30,
            flatShading: true
        });
        
        if (currentMesh) {
            stlScene.remove(currentMesh);
        }
        
        currentMesh = new THREE.Mesh(geometry, material);
        
        // Center the geometry
        geometry.computeBoundingBox();
        geometry.center();
        
        stlScene.add(currentMesh);
        
        // Center camera on object
        centerCameraOnObject(currentMesh);
        
        // Add to model list
        addModelToList(file.name);
    };
    
    reader.readAsArrayBuffer(file);
}

function centerCameraOnObject(object) {
    const box = new THREE.Box3().setFromObject(object);
    const size = box.getSize(new THREE.Vector3());
    const center = box.getCenter(new THREE.Vector3());
    
    const maxDim = Math.max(size.x, size.y, size.z);
    const fov = stlCamera.fov * (Math.PI / 180);
    let cameraZ = Math.abs(maxDim / 2 / Math.tan(fov / 2)) * 1.5;
    
    stlCamera.position.set(center.x, center.y, cameraZ);
    stlControls.target.copy(center);
    stlControls.update();
}

function addModelToList(name) {
    const modelList = document.querySelector('.sw-model-list');
    if (!modelList) return;
    
    // Remove active class from all items
    modelList.querySelectorAll('.sw-model-item').forEach(item => {
        item.classList.remove('active');
    });
    
    // Check if model already exists
    const existingItems = modelList.querySelectorAll('.sw-model-item');
    let exists = false;
    existingItems.forEach(item => {
        if (item.querySelector('span').textContent === name) {
            item.classList.add('active');
            exists = true;
        }
    });
    
    if (!exists) {
        const modelItem = document.createElement('div');
        modelItem.className = 'sw-model-item active';
        modelItem.innerHTML = `<i class="fas fa-cube"></i><span>${name}</span>`;
        
        // Insert before the hint paragraph
        const hint = modelList.querySelector('.sw-model-upload-hint');
        if (hint) {
            modelList.insertBefore(modelItem, hint);
        } else {
            modelList.appendChild(modelItem);
        }
    }
}

function setupViewerControls() {
    const resetBtn = document.getElementById('resetView');
    const wireframeBtn = document.getElementById('toggleWireframe');
    const autoRotateBtn = document.getElementById('toggleAutoRotate');
    const toggleGalleryBtn = document.getElementById('toggleGallery');
    const gallery = document.getElementById('projectGallery');
    
    if (resetBtn) {
        resetBtn.addEventListener('click', () => {
            if (currentMesh) {
                centerCameraOnObject(currentMesh);
            }
        });
    }
    
    if (wireframeBtn) {
        wireframeBtn.addEventListener('click', () => {
            isWireframe = !isWireframe;
            wireframeBtn.classList.toggle('active', isWireframe);
            if (currentMesh) {
                currentMesh.material.wireframe = isWireframe;
            }
        });
    }
    
    if (autoRotateBtn) {
        // Sync button state with actual isAutoRotate value
        autoRotateBtn.classList.toggle('active', isAutoRotate);
        if (stlControls) {
            stlControls.autoRotate = isAutoRotate;
        }
        
        autoRotateBtn.addEventListener('click', () => {
            isAutoRotate = !isAutoRotate;
            autoRotateBtn.classList.toggle('active', isAutoRotate);
            if (stlControls) {
                stlControls.autoRotate = isAutoRotate;
            }
        });
    }
    
    // Gallery toggle button
    if (toggleGalleryBtn && gallery) {
        toggleGalleryBtn.addEventListener('click', () => {
            const isVisible = gallery.classList.toggle('visible');
            toggleGalleryBtn.classList.toggle('active', isVisible);
        });
    }
}

function setupFileUpload() {
    const fileInput = document.getElementById('stlUpload');
    if (fileInput) {
        fileInput.addEventListener('change', (e) => {
            const file = e.target.files[0];
            if (file && file.name.toLowerCase().endsWith('.stl')) {
                loadSTLFile(file);
                updateModelInfo(file.name, 'User uploaded model');
            }
        });
    }
    
    // Setup model card click handlers
    setupModelGallery();
    
    // Setup photo gallery
    setupPhotoGallery();
}

function setupModelGallery() {
    const modelCards = document.querySelectorAll('.sw-model-card');
    const projectGallery = document.getElementById('projectGallery');
    
    modelCards.forEach(card => {
        card.addEventListener('click', () => {
            const modelPath = card.dataset.model;
            const modelName = card.dataset.name;
            const description = card.querySelector('.sw-model-card-info p')?.textContent || '';
            const hasGallery = card.dataset.hasGallery === 'true';
            
            // Update active state
            modelCards.forEach(c => c.classList.remove('active'));
            card.classList.add('active');
            
            // Update info display
            updateModelInfo(modelName, description);
            
            // Show/hide photo gallery based on whether project has images
            if (projectGallery) {
                if (hasGallery) {
                    // Update gallery content dynamically
                    updateGalleryContent(card);
                    projectGallery.classList.add('visible');
                    updateGalleryToggleButton(true);
                } else {
                    projectGallery.classList.remove('visible');
                    updateGalleryToggleButton(false);
                }
            }
            
            // Load the model
            if (modelPath && modelPath !== 'sample') {
                loadSTLFromURL(modelPath);
            } else {
                loadSampleCube();
            }
        });
    });
    
    // Load the first model by default if it exists
    const firstCard = document.querySelector('.sw-model-card.active');
    if (firstCard) {
        const modelPath = firstCard.dataset.model;
        const modelName = firstCard.dataset.name;
        const description = firstCard.querySelector('.sw-model-card-info p')?.textContent || '';
        const hasGallery = firstCard.dataset.hasGallery === 'true';
        
        updateModelInfo(modelName, description);
        
        // Show gallery for first card if it has one
        if (projectGallery && hasGallery) {
            updateGalleryContent(firstCard);
            projectGallery.classList.add('visible');
            updateGalleryToggleButton(true);
        }
        
        // Try to load the STL, fall back to sample cube if not found
        if (modelPath) {
            loadSTLFromURL(modelPath);
        }
    }
}

function setupPhotoGallery() {
    const gallery = document.getElementById('projectGallery');
    const mainImage = document.getElementById('galleryMainImage');
    const closeBtn = document.getElementById('closeGallery');
    
    // Close button handler
    if (closeBtn && gallery) {
        closeBtn.addEventListener('click', () => {
            gallery.classList.remove('visible');
            updateGalleryToggleButton(false);
        });
    }
    
    // Click main image to open in new tab (full size)
    if (mainImage) {
        mainImage.addEventListener('click', () => {
            window.open(mainImage.src, '_blank');
        });
    }
    
    // Setup initial thumbnail handlers
    setupThumbnailHandlers();
}

function setupThumbnailHandlers() {
    const mainImage = document.getElementById('galleryMainImage');
    const thumbs = document.querySelectorAll('.sw-thumb');
    
    thumbs.forEach(thumb => {
        thumb.addEventListener('click', () => {
            const fullSrc = thumb.dataset.full;
            if (mainImage && fullSrc) {
                mainImage.src = fullSrc;
                thumbs.forEach(t => t.classList.remove('active'));
                thumb.classList.add('active');
            }
        });
    });
}

function updateGalleryContent(card) {
    const galleryImages = card.dataset.galleryImages;
    const galleryTitle = card.dataset.galleryTitle;
    const galleryDesc = card.dataset.galleryDesc;
    
    if (!galleryImages) return;
    
    const images = galleryImages.split(',');
    const mainImage = document.getElementById('galleryMainImage');
    const thumbsContainer = document.querySelector('.sw-gallery-thumbs');
    const titleEl = document.querySelector('.sw-gallery-description h5');
    const descEl = document.querySelector('.sw-gallery-description p');
    
    // Update main image
    if (mainImage && images[0]) {
        mainImage.src = images[0];
    }
    
    // Update thumbnails
    if (thumbsContainer) {
        thumbsContainer.innerHTML = images.map((img, index) => {
            const viewName = img.includes('front') ? 'Front view' : 
                            img.includes('side') ? 'Side view' : 
                            img.includes('top') ? 'Top view' : 'View ' + (index + 1);
            return `<img class="sw-thumb ${index === 0 ? 'active' : ''}" src="${img}" alt="${viewName}" data-full="${img}">`;
        }).join('');
        
        // Re-attach click handlers to new thumbnails
        setupThumbnailHandlers();
    }
    
    // Update title and description
    if (titleEl && galleryTitle) {
        titleEl.textContent = galleryTitle;
    }
    if (descEl && galleryDesc) {
        descEl.textContent = galleryDesc;
    }
}

function updateGalleryToggleButton(isVisible) {
    const toggleGalleryBtn = document.getElementById('toggleGallery');
    if (toggleGalleryBtn) {
        toggleGalleryBtn.classList.toggle('active', isVisible);
    }
}

function loadSTLFromURL(url) {
    const loader = new THREE.STLLoader();
    
    console.log('Loading STL from:', url);
    
    // Show loading overlay
    showLoadingOverlay();
    
    loader.load(
        url,
        function(geometry) {
            console.log('STL loaded successfully');
            
            // Hide loading overlay
            hideLoadingOverlay();
            
            // Get accent color from CSS
            const accentColor = getComputedStyle(document.documentElement)
                .getPropertyValue('--sw-accent').trim() || '#007acc';
            
            const material = new THREE.MeshPhongMaterial({
                color: accentColor,
                specular: 0x444444,
                shininess: 30,
                flatShading: true
            });
            
            if (currentMesh) {
                stlScene.remove(currentMesh);
            }
            
            // Center the geometry
            geometry.computeBoundingBox();
            geometry.center();
            
            // Normalize the scale - make the model fit nicely in view
            const boundingBox = geometry.boundingBox;
            const size = new THREE.Vector3();
            boundingBox.getSize(size);
            const maxDim = Math.max(size.x, size.y, size.z);
            
            // Scale to fit within a reasonable size (target ~50 units)
            const targetSize = 50;
            const scale = targetSize / maxDim;
            geometry.scale(scale, scale, scale);
            
            console.log('Model size:', size, 'Scale applied:', scale);
            
            currentMesh = new THREE.Mesh(geometry, material);
            stlScene.add(currentMesh);
            
            // Center camera on object
            centerCameraOnObject(currentMesh);
        },
        function(xhr) {
            // Progress callback
            if (xhr.total > 0) {
                const percent = Math.round((xhr.loaded / xhr.total) * 100);
                updateLoadingProgress(percent);
                console.log(percent + '% loaded');
            } else if (xhr.loaded) {
                // If total is unknown, show indeterminate progress
                updateLoadingProgress(-1, xhr.loaded);
            }
        },
        function(error) {
            // Error callback - fall back to sample cube
            console.log('STL file not found or failed to load, showing sample cube:', error);
            hideLoadingOverlay();
            loadSampleCube();
        }
    );
}

function showLoadingOverlay() {
    const overlay = document.getElementById('loadingOverlay');
    if (overlay) {
        overlay.classList.add('visible');
        updateLoadingProgress(0);
    }
}

function hideLoadingOverlay() {
    const overlay = document.getElementById('loadingOverlay');
    if (overlay) {
        overlay.classList.remove('visible');
    }
}

function updateLoadingProgress(percent, bytesLoaded) {
    const progressText = document.getElementById('loadingProgress');
    const progressFill = document.getElementById('loadingProgressFill');
    
    if (percent === -1 && bytesLoaded) {
        // Indeterminate progress - show bytes loaded
        if (progressText) {
            const kb = Math.round(bytesLoaded / 1024);
            progressText.textContent = `${kb} KB loaded...`;
        }
        if (progressFill) {
            // Animate indeterminate progress
            progressFill.style.width = '100%';
            progressFill.style.animation = 'indeterminate 1.5s ease-in-out infinite';
        }
    } else {
        if (progressText) {
            progressText.textContent = `${percent}%`;
        }
        if (progressFill) {
            progressFill.style.width = `${percent}%`;
            progressFill.style.animation = 'none';
        }
    }
}

function updateModelInfo(title, description) {
    const titleEl = document.getElementById('modelTitle');
    const descEl = document.getElementById('modelDesc');
    
    if (titleEl) titleEl.textContent = title;
    if (descEl) descEl.textContent = description;
}

function onViewerResize() {
    const container = document.getElementById('stlViewer');
    if (!container || !stlCamera || !stlRenderer) return;
    
    stlCamera.aspect = container.clientWidth / container.clientHeight;
    stlCamera.updateProjectionMatrix();
    stlRenderer.setSize(container.clientWidth, container.clientHeight);
}

function animateSTL() {
    requestAnimationFrame(animateSTL);
    
    if (stlControls) {
        stlControls.update();
    }
    
    if (stlRenderer && stlScene && stlCamera) {
        stlRenderer.render(stlScene, stlCamera);
    }
}

// Initialize STL viewer when Models section is shown
document.addEventListener('DOMContentLoaded', function() {
    // Initialize when the models tab is clicked
    const modelsTab = document.querySelector('[data-section="models"]');
    if (modelsTab) {
        modelsTab.addEventListener('click', () => {
            // Small delay to ensure container is visible
            setTimeout(() => {
                if (!stlScene) {
                    initSTLViewer();
                } else {
                    onViewerResize();
                }
            }, 100);
        });
    }
    
    // Also handle tree node clicks
    document.querySelectorAll('.sw-tree-node[data-section="models"]').forEach(node => {
        node.addEventListener('click', () => {
            setTimeout(() => {
                if (!stlScene) {
                    initSTLViewer();
                } else {
                    onViewerResize();
                }
            }, 100);
        });
    });
});

console.log('🔧 SolidWorks Portfolio Loaded Successfully');
console.log('🎨 Press T to toggle themes, or click the palette icon');
console.log('⌨️  Keyboard shortcuts: 1-6 for sections, Escape for home');
