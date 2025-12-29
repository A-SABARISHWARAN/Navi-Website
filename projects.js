// Projects Page Functionality
document.addEventListener('DOMContentLoaded', function() {
    // Filter functionality
    const filterButtons = document.querySelectorAll('.filter-btn');
    const projectCards = document.querySelectorAll('.project-card');
    const projectsContainer = document.getElementById('projectsContainer');
    
    if (filterButtons.length > 0 && projectCards.length > 0) {
        filterButtons.forEach(button => {
            button.addEventListener('click', () => {
                // Update active button
                filterButtons.forEach(btn => btn.classList.remove('active'));
                button.classList.add('active');
                
                const filterValue = button.getAttribute('data-filter');
                
                // Filter projects
                projectCards.forEach(card => {
                    const category = card.getAttribute('data-category');
                    
                    if (filterValue === 'all' || category === filterValue) {
                        card.classList.remove('hidden');
                        card.style.opacity = '0';
                        card.style.transform = 'translateY(20px)';
                        
                        // Re-animate
                        setTimeout(() => {
                            card.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
                            card.style.opacity = '1';
                            card.style.transform = 'translateY(0)';
                        }, 10);
                    } else {
                        card.style.opacity = '0';
                        card.style.transform = 'translateY(20px)';
                        setTimeout(() => {
                            card.classList.add('hidden');
                        }, 300);
                    }
                });
                
                // Reorder projects for better visual flow
                setTimeout(() => {
                    const visibleCards = Array.from(projectCards).filter(card => !card.classList.contains('hidden'));
                    visibleCards.forEach((card, index) => {
                        card.style.order = index;
                    });
                }, 350);
            });
        });
    }
    
    // Project modal functionality
    const viewDetailButtons = document.querySelectorAll('.view-details');
    const projectModal = document.getElementById('projectModal');
    const modalClose = document.getElementById('modalClose');
    const modalBody = document.getElementById('modalBody');
    
    // Project data for modal
    const projectData = {
        atlas: {
            title: 'Atlas Industrial Rover',
            version: 'v2.1',
            category: 'Industrial',
            status: 'Deployed',
            description: 'Heavy-duty autonomous platform designed for warehouse logistics and industrial material handling. Features multi-sensor SLAM, 500kg payload capacity, and integrated fleet management system.',
            specs: [
                { label: 'Payload Capacity', value: '500 kg' },
                { label: 'Maximum Speed', value: '3 m/s' },
                { label: 'Battery Life', value: '12 hours' },
                { label: 'Navigation', value: 'LiDAR + Visual SLAM' },
                { label: 'Connectivity', value: '5G, Wi-Fi 6' },
                { label: 'IP Rating', value: 'IP54' }
            ],
            features: [
                'Multi-sensor fusion for robust navigation',
                'Fleet coordination algorithms',
                'Predictive maintenance system',
                'Real-time load optimization',
                'Automatic charging station docking'
            ],
            applications: [
                'Warehouse material handling',
                'Manufacturing plant logistics',
                'Port and terminal operations',
                'Large-scale inventory management'
            ],
            metrics: [
                { label: 'Deployment Time', value: '2 weeks' },
                { label: 'ROI Period', value: '6 months' },
                { label: 'Uptime', value: '99.8%' },
                { label: 'Efficiency Gain', value: '300%' }
            ]
        },
        hermes: {
            title: 'Hermes Research Platform',
            version: 'v1.3',
            category: 'Research',
            status: 'Active Research',
            description: 'Modular research rover designed for academic and scientific applications. Supports interchangeable sensor payloads and open-source software stack with ROS 2 compatibility.',
            specs: [
                { label: 'Sensor Slots', value: '8 modular slots' },
                { label: 'Processing', value: 'NVIDIA Jetson AGX' },
                { label: 'Software', value: 'ROS 2, Python API' },
                { label: 'Payload', value: '50 kg' },
                { label: 'Runtime', value: '8 hours' },
                { label: 'Documentation', value: 'Full API docs' }
            ],
            features: [
                'Open-source software stack',
                'Modular sensor architecture',
                'ROS 2 compatibility',
                'Research SDK with examples',
                'Extensive documentation'
            ],
            applications: [
                'Academic research projects',
                'Sensor development testing',
                'Algorithm validation',
                'Autonomous systems education'
            ],
            metrics: [
                { label: 'Universities Using', value: '12+' },
                { label: 'Research Papers', value: '25+' },
                { label: 'Custom Configurations', value: '50+' },
                { label: 'Community Contributions', value: '200+' }
            ]
        },
        artemis: {
            title: 'Artemis Perimeter Patrol',
            version: 'v1.8',
            category: 'Industrial',
            status: 'Deployed',
            description: 'Autonomous security and surveillance rover with thermal imaging, night vision, and real-time threat detection for perimeter monitoring in challenging environments.',
            specs: [
                { label: 'Thermal Camera', value: 'FLIR Tau 2' },
                { label: 'Night Vision', value: '4K low-light' },
                { label: 'Patrol Range', value: '5 km radius' },
                { label: 'Detection Range', value: '200 m (thermal)' },
                { label: 'Operation', value: '24/7 autonomous' },
                { label: 'Weather Rating', value: 'IP67' }
            ],
            features: [
                'AI-powered threat detection',
                'Autonomous patrol routes',
                'Real-time alert system',
                'Perimeter breach detection',
                'Integration with security systems'
            ],
            applications: [
                'Industrial facility security',
                'Border patrol assistance',
                'Critical infrastructure protection',
                'Large campus monitoring'
            ],
            metrics: [
                { label: 'Response Time', value: '< 30 seconds' },
                { label: 'False Alarms', value: '< 2%' },
                { label: 'Area Coverage', value: '10x human guard' },
                { label: 'Cost Savings', value: '60% vs manual' }
            ]
        },
        apollo: {
            title: 'Apollo AI Navigator',
            version: 'Prototype',
            category: 'Development',
            status: 'R&D Phase',
            description: 'Next-generation rover with reinforcement learning-based navigation system capable of learning and adapting to new environments without pre-mapping or extensive training.',
            specs: [
                { label: 'AI Model', value: 'Reinforcement Learning' },
                { label: 'Processing', value: 'Dual NVIDIA GPUs' },
                { label: 'Learning', value: 'On-board adaptation' },
                { label: 'Sensors', value: '360° perception array' },
                { label: 'Memory', value: '1 TB NVMe' },
                { label: 'Status', value: 'Alpha testing' }
            ],
            features: [
                'Zero-shot environment adaptation',
                'Self-improving navigation',
                'Multi-modal learning',
                'Transfer learning capabilities',
                'Real-time decision making'
            ],
            applications: [
                'Dynamic environment navigation',
                'Disaster response scenarios',
                'Planetary exploration',
                'Unstructured terrain operations'
            ],
            metrics: [
                { label: 'Learning Speed', value: '2x faster' },
                { label: 'Adaptation Time', value: '< 1 hour' },
                { label: 'Success Rate', value: '94% new envs' },
                { label: 'Research Papers', value: '3 pending' }
            ]
        },
        surveyor: {
            title: 'Surveyor 3D Mapper',
            version: 'v2.4',
            category: 'Research',
            status: 'Field Deployed',
            description: 'High-precision topographic mapping rover with LiDAR scanning, photogrammetry, and RTK GPS for centimeter-accurate 3D terrain modeling and analysis.',
            specs: [
                { label: 'LiDAR System', value: '32-beam rotating' },
                { label: 'Position Accuracy', value: '±1 cm RTK' },
                { label: 'Scan Range', value: '100 m radius' },
                { label: 'Point Density', value: '1000 pts/m²' },
                { label: 'Camera System', value: '5x 20MP' },
                { label: 'Data Output', value: 'LAS, PLY, OBJ' }
            ],
            features: [
                'Simultaneous LiDAR and photography',
                'Real-time point cloud processing',
                'Automated ground classification',
                'Volume calculation algorithms',
                'Change detection over time'
            ],
            applications: [
                'Construction site monitoring',
                'Mining volume calculations',
                'Archaeological site mapping',
                'Environmental monitoring'
            ],
            metrics: [
                { label: 'Mapping Speed', value: '2 hectares/hour' },
                { label: 'Accuracy', value: '±1 cm' },
                { label: 'Processing Time', value: 'Real-time' },
                { label: 'Data Volume', value: '10 GB/hour' }
            ]
        },
        hazmat: {
            title: 'HAZMAT Inspector',
            version: 'v1.5',
            category: 'Industrial',
            status: 'Certified',
            description: 'Ruggedized rover for hazardous environment inspection with multi-gas sensors, radiation detectors, and ATEX certification for explosive atmospheres.',
            specs: [
                { label: 'Safety Rating', value: 'ATEX Zone 1' },
                { label: 'Gas Sensors', value: '6-type array' },
                { label: 'Radiation', value: 'Geiger-Muller' },
                { label: 'Protection', value: 'IP67 submersible' },
                { label: 'Temperature', value: '-20°C to 60°C' },
                { label: 'Communication', value: 'Explosion-proof' }
            ],
            features: [
                'Real-time hazardous gas monitoring',
                'Radiation level detection',
                'Remote sample collection',
                'Explosion-proof construction',
                'Emergency response protocols'
            ],
            applications: [
                'Chemical plant inspections',
                'Nuclear facility monitoring',
                'Oil and gas rig safety',
                'Emergency response support'
            ],
            metrics: [
                { label: 'Safety Incidents', value: '0' },
                { label: 'Inspection Time', value: '75% faster' },
                { label: 'Risk Reduction', value: '99.9% human exposure' },
                { label: 'Certifications', value: 'ATEX, IECEx' }
            ]
        }
    };
    
    // Open modal with project details
    viewDetailButtons.forEach(button => {
        button.addEventListener('click', () => {
            const projectId = button.getAttribute('data-project');
            const project = projectData[projectId];
            
            if (project) {
                // Build modal content
                modalBody.innerHTML = `
                    <div class="modal-project">
                        <div class="modal-header">
                            <div class="modal-title-section">
                                <h2>${project.title}</h2>
                                <div class="modal-badges">
                                    <span class="modal-version">${project.version}</span>
                                    <span class="modal-category">${project.category}</span>
                                    <span class="modal-status">${project.status}</span>
                                </div>
                            </div>
                        </div>
                        
                        <div class="modal-description">
                            <p>${project.description}</p>
                        </div>
                        
                        <div class="modal-grid">
                            <div class="modal-section">
                                <h3>Specifications</h3>
                                <div class="specs-grid">
                                    ${project.specs.map(spec => `
                                        <div class="modal-spec">
                                            <span class="spec-label">${spec.label}</span>
                                            <span class="spec-value">${spec.value}</span>
                                        </div>
                                    `).join('')}
                                </div>
                            </div>
                            
                            <div class="modal-section">
                                <h3>Key Features</h3>
                                <ul class="features-list">
                                    ${project.features.map(feature => `
                                        <li>${feature}</li>
                                    `).join('')}
                                </ul>
                            </div>
                            
                            <div class="modal-section">
                                <h3>Applications</h3>
                                <div class="applications-list">
                                    ${project.applications.map(app => `
                                        <span class="application-tag">${app}</span>
                                    `).join('')}
                                </div>
                            </div>
                            
                            <div class="modal-section">
                                <h3>Performance Metrics</h3>
                                <div class="metrics-grid">
                                    ${project.metrics.map(metric => `
                                        <div class="modal-metric">
                                            <span class="metric-value">${metric.value}</span>
                                            <span class="metric-label">${metric.label}</span>
                                        </div>
                                    `).join('')}
                                </div>
                            </div>
                        </div>
                        
                        <div class="modal-actions">
                            <a href="contact.html" class="btn btn-primary">
                                <span>Request Technical Consultation</span>
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                    <path d="M5 12h14M12 5l7 7-7 7"/>
                                </svg>
                            </a>
                            <button class="btn btn-secondary" id="closeModalBtn">
                                <span>Close Details</span>
                            </button>
                        </div>
                    </div>
                `;
                
                // Show modal
                projectModal.classList.add('active');
                document.body.style.overflow = 'hidden';
                
                // Add close event to new close button
                document.getElementById('closeModalBtn')?.addEventListener('click', closeModal);
            }
        });
    });
    
    // Close modal
    function closeModal() {
        projectModal.classList.remove('active');
        document.body.style.overflow = '';
    }
    
    // Close modal on close button click
    if (modalClose) {
        modalClose.addEventListener('click', closeModal);
    }
    
    // Close modal on background click
    projectModal.addEventListener('click', (e) => {
        if (e.target === projectModal) {
            closeModal();
        }
    });
    
    // Close modal on escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && projectModal.classList.contains('active')) {
            closeModal();
        }
    });
    
    // Add CSS for modal
    const modalStyles = `
        .modal-project {
            color: var(--primary-light);
        }
        
        .modal-header {
            margin-bottom: var(--space-lg);
        }
        
        .modal-title-section {
            margin-bottom: var(--space-md);
        }
        
        .modal-title-section h2 {
            margin-bottom: var(--space-sm);
            font-size: 2rem;
        }
        
        .modal-badges {
            display: flex;
            gap: var(--space-sm);
            flex-wrap: wrap;
        }
        
        .modal-version {
            background-color: rgba(0, 112, 243, 0.1);
            color: var(--accent);
            padding: 4px 12px;
            border-radius: var(--radius-sm);
            font-size: 0.875rem;
            font-weight: 600;
        }
        
        .modal-category {
            background-color: rgba(255, 255, 255, 0.1);
            color: rgba(255, 255, 255, 0.8);
            padding: 4px 12px;
            border-radius: var(--radius-sm);
            font-size: 0.875rem;
        }
        
        .modal-status {
            background-color: rgba(16, 185, 129, 0.1);
            color: #10B981;
            padding: 4px 12px;
            border-radius: var(--radius-sm);
            font-size: 0.875rem;
            font-weight: 600;
        }
        
        .modal-description {
            margin-bottom: var(--space-xl);
            padding-bottom: var(--space-lg);
            border-bottom: 1px solid rgba(255, 255, 255, 0.1);
        }
        
        .modal-description p {
            font-size: 1.125rem;
            line-height: 1.7;
        }
        
        .modal-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
            gap: var(--space-lg);
            margin-bottom: var(--space-xl);
        }
        
        .modal-section h3 {
            margin-bottom: var(--space-md);
            font-size: 1.25rem;
            color: var(--accent);
        }
        
        .specs-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
            gap: var(--space-sm);
        }
        
        .modal-spec {
            background-color: rgba(255, 255, 255, 0.05);
            padding: var(--space-sm);
            border-radius: var(--radius-md);
            display: flex;
            flex-direction: column;
        }
        
        .spec-label {
            font-size: 0.75rem;
            color: rgba(255, 255, 255, 0.6);
            margin-bottom: 4px;
        }
        
        .spec-value {
            font-weight: 600;
            font-size: 0.875rem;
        }
        
        .features-list {
            list-style: none;
            padding-left: 0;
        }
        
        .features-list li {
            position: relative;
            padding-left: var(--space-md);
            margin-bottom: var(--space-sm);
            line-height: 1.5;
        }
        
        .features-list li::before {
            content: '✓';
            position: absolute;
            left: 0;
            color: var(--accent);
            font-weight: bold;
        }
        
        .applications-list {
            display: flex;
            flex-direction: column;
            gap: var(--space-sm);
        }
        
        .application-tag {
            background-color: rgba(255, 255, 255, 0.1);
            color: rgba(255, 255, 255, 0.8);
            padding: 8px 12px;
            border-radius: var(--radius-md);
            font-size: 0.875rem;
            transition: var(--transition-base);
        }
        
        .application-tag:hover {
            background-color: rgba(0, 112, 243, 0.2);
            transform: translateX(4px);
        }
        
        .metrics-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
            gap: var(--space-sm);
        }
        
        .modal-metric {
            background-color: rgba(0, 112, 243, 0.1);
            padding: var(--space-sm);
            border-radius: var(--radius-md);
            display: flex;
            flex-direction: column;
            align-items: center;
            text-align: center;
        }
        
        .metric-value {
            font-family: var(--font-heading);
            font-size: 1.5rem;
            font-weight: 700;
            color: var(--accent);
            margin-bottom: 4px;
        }
        
        .metric-label {
            font-size: 0.75rem;
            color: rgba(255, 255, 255, 0.7);
            text-align: center;
            line-height: 1.3;
        }
        
        .modal-actions {
            display: flex;
            gap: var(--space-md);
            flex-wrap: wrap;
            padding-top: var(--space-lg);
            border-top: 1px solid rgba(255, 255, 255, 0.1);
        }
        
        @media (max-width: 768px) {
            .modal-grid {
                grid-template-columns: 1fr;
            }
            
            .modal-actions {
                flex-direction: column;
            }
            
            .modal-actions .btn {
                width: 100%;
                justify-content: center;
            }
        }
    `;
    
    const styleSheet = document.createElement('style');
    styleSheet.textContent = modalStyles;
    document.head.appendChild(styleSheet);
    
    // Add slider interaction for interface demo
    const autonomySlider = document.querySelector('.slider');
    if (autonomySlider) {
        autonomySlider.addEventListener('input', function() {
            const value = this.value;
            const roverMarker = document.querySelector('.rover-marker');
            
            // Update rover animation based on autonomy level
            if (value < 33) {
                roverMarker.style.animationDuration = '0.5s'; // Fast manual control
            } else if (value < 66) {
                roverMarker.style.animationDuration = '1s'; // Assisted
            } else {
                roverMarker.style.animationDuration = '2s'; // Full auto
            }
        });
    }
    
    // Add hover effects to project cards
    projectCards.forEach(card => {
        card.addEventListener('mouseenter', () => {
            const imagePlaceholder = card.querySelector('.image-placeholder svg');
            if (imagePlaceholder) {
                imagePlaceholder.style.transform = 'scale(1.1)';
                imagePlaceholder.style.transition = 'transform 0.3s ease';
            }
        });
        
        card.addEventListener('mouseleave', () => {
            const imagePlaceholder = card.querySelector('.image-placeholder svg');
            if (imagePlaceholder) {
                imagePlaceholder.style.transform = 'scale(1)';
            }
        });
    });
    
    // Add animation to control buttons
    const controlButtons = document.querySelectorAll('.control-btn');
    controlButtons.forEach(button => {
        button.addEventListener('click', function() {
            this.style.transform = 'scale(0.95)';
            setTimeout(() => {
                this.style.transform = 'scale(1)';
            }, 150);
        });
    });
});