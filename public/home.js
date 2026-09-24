let fechaInicio = '';
let fechaFin = '';
let currentChart = null;
let topChart = null;
let sparkTicketsChart = null;
let sparkAvgChart = null;

export function init() {
    configurarSaludo();
    inyectarControlesGlobalesFecha();

    if (window.lucide) {
        lucide.createIcons();
    }
}

function configurarSaludo() {
    const lbl = document.getElementById('lblGreeting');
    if(!lbl) return;

    const hora = new Date().getHours();
    let saludo = "Hola";
    if(hora < 12) saludo = "Buenos días";
    else if(hora < 19) saludo = "Buenas tardes";
    else saludo = "Buenas noches";

    let nombreMostrado = "Administrador";
    try {
        const userStr = localStorage.getItem('quodo_user');
        if(userStr) {
            const user = JSON.parse(userStr);
            let fullName = user.nombre || user.uname || "Administrador";
            let primerNombre = fullName.trim().split(' ')[0];
            nombreMostrado = primerNombre.charAt(0).toUpperCase() + primerNombre.slice(1).toLowerCase();
        }
    } catch(e) {}
    lbl.innerText = `${saludo}, ${nombreMostrado}`;
}

function inyectarControlesGlobalesFecha() {
    const topbarCenter = document.getElementById('topbar-center');
    const template = document.getElementById('globalDateControlsTemplate');

    if (topbarCenter && template) {
        topbarCenter.innerHTML = '';

        let contentToInject;
        if (template.tagName === 'TEMPLATE') {
            contentToInject = template.content.cloneNode(true);
        } else {
            contentToInject = template.cloneNode(true);
            contentToInject.classList.remove('hidden');
            contentToInject.id = 'dashboardDateControls';
        }

        topbarCenter.appendChild(contentToInject);

        const wrapper = topbarCenter.querySelector('.controls-wrapper-top');
        if (wrapper) {
            wrapper.style.display = 'flex';
            wrapper.style.alignItems = 'center';
            wrapper.style.justifyContent = 'center';
            wrapper.style.gap = '15px';
        }

        const selector = document.getElementById('globalPeriodSelector');
        const customRange = document.getElementById('globalCustomRange');
        const btnFilter = document.getElementById('globalBtnFilter');
        const btnSendReport = document.getElementById('globalBtnSendReport');
        const startDate = document.getElementById('globalStartDate');
        const endDate = document.getElementById('globalEndDate');

        // 1. INYECTAR LAS NUEVAS OPCIONES AL SELECT OCULTO
        if (selector) {
            selector.innerHTML = `
                <option value="hoy">Hoy</option>
                <option value="ayer">Ayer</option>
                <option value="semana">Esta Semana</option>
                <option value="mes">Este Mes</option>
                <option value="ultimos_30">Últimos 30 días</option>
                <option value="3_meses">3 Meses</option>
                <option value="6_meses">6 Meses</option>
                <option value="1_ano">1 Año</option>
                <option value="este_ano">Este Año</option>
                <option value="ano_pasado">Año Pasado</option>
                <option value="custom">Personalizado...</option>
            `;
        }

        const formatDate = (date) => {
            const d = String(date.getDate()).padStart(2, '0');
            const m = String(date.getMonth() + 1).padStart(2, '0');
            const y = date.getFullYear();
            return `${y}-${m}-${d}`;
        };

        const aplicarFiltro = () => {
            if(!selector) return;
            const val = selector.value;
            const hoy = new Date();

            // Mostrar/Ocultar el rango personalizado
            if (val === 'custom') {
                if(customRange) customRange.classList.remove('hidden');
                return;
            } else {
                if(customRange) customRange.classList.add('hidden');
            }

            // 2. LÓGICA DE CÁLCULO DE FECHAS (Protegida con Scope {})
            switch (val) {
                case 'hoy': {
                    fechaInicio = formatDate(hoy);
                    fechaFin = formatDate(hoy);
                    break;
                }
                case 'ayer': {
                    const d = new Date(hoy);
                    d.setDate(d.getDate() - 1);
                    fechaInicio = formatDate(d);
                    fechaFin = formatDate(d);
                    break;
                }
                case 'semana': {
                    const d = new Date(hoy);
                    d.setDate(d.getDate() - 6);
                    fechaInicio = formatDate(d);
                    fechaFin = formatDate(hoy);
                    break;
                }
                case 'mes': {
                    const d = new Date(hoy.getFullYear(), hoy.getMonth(), 1);
                    fechaInicio = formatDate(d);
                    fechaFin = formatDate(hoy);
                    break;
                }
                case 'ultimos_30': {
                    const d = new Date(hoy);
                    d.setDate(d.getDate() - 30);
                    fechaInicio = formatDate(d);
                    fechaFin = formatDate(hoy);
                    break;
                }
                case '3_meses': {
                    const d = new Date(hoy);
                    d.setMonth(d.getMonth() - 3);
                    fechaInicio = formatDate(d);
                    fechaFin = formatDate(hoy);
                    break;
                }
                case '6_meses': {
                    const d = new Date(hoy);
                    d.setMonth(d.getMonth() - 6);
                    fechaInicio = formatDate(d);
                    fechaFin = formatDate(hoy);
                    break;
                }
                case '1_ano': {
                    const d = new Date(hoy);
                    d.setFullYear(d.getFullYear() - 1);
                    fechaInicio = formatDate(d);
                    fechaFin = formatDate(hoy);
                    break;
                }
                case 'este_ano': {
                    const dInicio = new Date(hoy.getFullYear(), 0, 1);
                    const dFin = new Date(hoy.getFullYear(), 11, 31);
                    fechaInicio = formatDate(dInicio);
                    fechaFin = formatDate(dFin);
                    break;
                }
                case 'ano_pasado': {
                    const dInicio = new Date(hoy.getFullYear() - 1, 0, 1);
                    const dFin = new Date(hoy.getFullYear() - 1, 11, 31);
                    fechaInicio = formatDate(dInicio);
                    fechaFin = formatDate(dFin);
                    break;
                }
            }

            if (startDate) startDate.value = fechaInicio;
            if (endDate) endDate.value = fechaFin;

            cargarDatosDesdeBackend(fechaInicio, fechaFin);
        };

        if(selector) selector.addEventListener('change', aplicarFiltro);

        if(btnFilter) {
            btnFilter.addEventListener('click', () => {
                if (startDate && endDate && startDate.value && endDate.value) {
                    fechaInicio = startDate.value;
                    fechaFin = endDate.value;
                    cargarDatosDesdeBackend(fechaInicio, fechaFin);
                } else {
                    if (window.showToast) window.showToast("Selecciona un rango de fechas válido", "warning");
                }
            });
        }

        if (btnSendReport) {
            btnSendReport.addEventListener('click', async () => {
                const val = selector ? selector.value : 'hoy';

                let tipoReporte = 'personalizado';
                let endpointType = 'custom';

                if (val === 'hoy' || val === 'ayer') {
                    tipoReporte = 'diario';
                    endpointType = 'daily';
                } else if (val === 'semana') {
                    tipoReporte = 'semanal';
                    endpointType = 'weekly';
                } else if (val === 'mes') {
                    tipoReporte = 'mensual';
                    endpointType = 'monthly';
                } else if (val === 'ultimos_30') {
                    tipoReporte = 'de los últimos 30 días';
                    endpointType = 'custom';
                } else if (val === 'custom') {
                    if (fechaInicio && fechaFin) {
                        const d1 = new Date(fechaInicio);
                        const d2 = new Date(fechaFin);
                        const diffDays = Math.ceil(Math.abs(d2 - d1) / (1000 * 60 * 60 * 24));
                        if (diffDays >= 6 && diffDays <= 7) {
                            tipoReporte = 'semanal';
                            endpointType = 'weekly';
                        }
                    }
                }

                if (await window.showConfirm(`¿Deseas generar y enviar el reporte ${tipoReporte} por correo electrónico?`)) {
                    enviarReporteManual(endpointType, fechaInicio, fechaFin);
                }
            });
        }

        // Valor por defecto al cargar: Forzar la interfaz para que diga "Este Mes"
        if(selector) {
            selector.value = 'mes';
            const btnText = document.getElementById('globalPeriodText');
            if (btnText) btnText.innerText = 'Este Mes';

            // Marcar la opción "Este Mes" como activa en el menú visual
            const activeItem = document.querySelector('.gooey-menu-item[data-value="mes"]');
            if (activeItem) activeItem.classList.add('active');
        }

        aplicarFiltro();

        if (window.lucide) lucide.createIcons({ root: topbarCenter });
    }
}

async function cargarDatosDesdeBackend(start, end) {
    try {
        const url = `/api/dashboard?start=${start}&end=${end}`;
        const token = localStorage.getItem('quodo_token') || '';
        let privilegio = 0;

        const userStr = localStorage.getItem('quodo_user');
        if (userStr) {
            try {
                const user = JSON.parse(userStr);
                privilegio = (user.privilegio !== undefined) ? user.privilegio : (user.rol === 'admin' ? 1 : 0);
            } catch (err) { console.warn("Error user session:", err); }
        }

        const res = await fetch(url, {
            method: 'GET',
            headers: {
                'X-Quodo-Token': token,
                'X-Quodo-Privilege': privilegio.toString()
            }
        });

        if (!res.ok) throw new Error("Error obteniendo datos del servidor");

        const data = await res.json();

        // Enviamos data.totalCitas. Si el backend no lo mandó, mandamos null para que procesarKpis decida.
        procesarKpis(data.kpis, data.citas, data.stockBajo, data.totalCitas);
        procesarActividad(data.citas, data.stockBajo);

        if (typeof Chart === 'undefined') {
            await loadScript('https://cdn.jsdelivr.net/npm/chart.js');
        }
        renderSalesChart(data.graficaVentas);
        renderTopProductsChart(data.topProductos);
        renderSparklines(data);

    } catch (e) {
        console.error("Error en Dashboard:", e);
        // En caso de error total, mostramos ceros en lugar de dejar vacío
        procesarKpis(null, [], [], 0);
        procesarActividad([], []);
    }
}

// ==============================================================
//  ENVÍO DE REPORTE MANUAL
// ==============================================================
async function enviarReporteManual(type, start, end) {
    try {
        if (window.showToast) window.showToast("Preparando y enviando reporte...", "info");

        // MODIFICADO: Apunta a la ruta correcta definida en App.java (/api/email/manual)
        const res = await fetch(`/api/email/manual?type=${type}&start=${start}&end=${end}`, {
            method: 'POST'
        });

        if (res.ok) {
            if (window.showToast) window.showToast("Reporte enviado correctamente a tu correo", "success", "¡Enviado!");
        } else {
            const err = await res.text();
            if (window.showToast) window.showToast("Error del servidor: " + err, "error");
        }
    } catch (error) {
        console.error("Error enviando reporte:", error);
        if (window.showToast) window.showToast("Error de conexión al intentar enviar el correo", "error");
    }
}

function procesarKpis(kpis, citas, stockBajo, totalCitasBack) {
    // 1. Obtener valores financieros o 0 por defecto
    const ventas = kpis ? (kpis.ventas || 0) : 0;
    const tickets = kpis ? (kpis.transacciones || 0) : 0;
    const ticketPromedio = kpis ? (kpis.ticketPromedio || 0) : 0;

    // 2. Lógica robusta para el conteo de citas
    let numCitas = 0;
    if (typeof totalCitasBack === 'number') {
        numCitas = totalCitasBack;
    } else if (Array.isArray(citas)) {
        numCitas = citas.length;
    }

    const elSales = document.getElementById('dashSales');
    const elTickets = document.getElementById('dashTickets');
    const elAppointments = document.getElementById('dashAppointments');
    const elAvg = document.getElementById('dashAvg');

    // Renderizar Valores Principales
    if(elSales) elSales.innerText = formatearMoneda(ventas);
    if(elAvg) elAvg.innerText = formatearMoneda(ticketPromedio);

    if(elTickets) {
        elTickets.innerText = String(tickets);
        const subT = document.querySelector('#cardTickets .kpi-sub');
        if(subT) subT.innerText = (tickets === 0) ? "Sin operaciones" : "Operaciones completadas";
    }

    if(elAppointments) {
        elAppointments.innerText = String(numCitas);
        const subA = document.querySelector('#cardAppointments .kpi-sub');
        if(subA) {
            subA.innerText = (numCitas === 0) ? "Sin citas en el periodo" : "Total de citas agendadas";
        }
    }

    // --- FUNCIÓN DE APOYO PARA DIBUJAR LOS PORCENTAJES Y TOOLTIPS ---
    const actualizarTendencia = (elementId, valorTendencia, valorBase, isMoneda) => {
        const el = document.getElementById(elementId);
        if (!el) return;

        // Aseguramos que el contenedor sea el ancla del tooltip
        el.style.position = 'relative';
        el.style.cursor = 'help';

        // 1. Calcular el valor exacto del periodo anterior
        let previoNum = 0;
        if (valorTendencia === 100 && valorBase > 0) {
            previoNum = 0; // Crecimiento desde 0
        } else if (valorTendencia !== 0) {
            // Despejamos el valor previo de la fórmula de tendencia
            previoNum = valorBase / (1 + (valorTendencia / 100));
        } else {
            previoNum = valorBase;
        }

        const formatter = isMoneda ? formatearMoneda : (val) => Math.round(val);
        const previoFormat = formatter(previoNum);

        // 2. Construir el texto explicativo del Tooltip
        let tooltipText = '';
        if (!kpis || (valorBase === 0 && valorTendencia === 0)) {
            tooltipText = 'Sin datos históricos<br><span style="opacity:0.85; font-size:0.7rem; font-weight:400;">para comparar periodos.</span>';
        } else if (valorTendencia > 0) {
            tooltipText = `Aumento del ${valorTendencia.toFixed(1)}%<br><span style="opacity:0.9; font-size:0.75rem; font-weight:400;">El periodo anterior fue de ${previoFormat}</span>`;
        } else if (valorTendencia < 0) {
            tooltipText = `Caída del ${Math.abs(valorTendencia).toFixed(1)}%<br><span style="opacity:0.9; font-size:0.75rem; font-weight:400;">El periodo anterior fue de ${previoFormat}</span>`;
        } else {
            tooltipText = `Se mantuvo igual<br><span style="opacity:0.9; font-size:0.75rem; font-weight:400;">El periodo anterior fue de ${previoFormat}</span>`;
        }

        const tooltipHTML = `<div class="kpi-trend-tooltip">${tooltipText}</div>`;

        // 3. Inyectar clases, icono, porcentaje y el tooltip
        if (!kpis || (valorBase === 0 && valorTendencia === 0)) {
            el.className = 'kpi-trend neutral';
            el.innerHTML = `<i data-lucide="minus"></i> <span>Sin histórico</span> ${tooltipHTML}`;
        } else {
            if (valorTendencia >= 0) {
                el.className = 'kpi-trend positive';
                el.innerHTML = `<i data-lucide="trending-up"></i> <span>+${valorTendencia.toFixed(1)}%</span> ${tooltipHTML}`;
            } else {
                el.className = 'kpi-trend negative';
                el.innerHTML = `<i data-lucide="trending-down"></i> <span>${valorTendencia.toFixed(1)}%</span> ${tooltipHTML}`;
            }
        }
    };

    // Aplicar las tendencias indicando si es moneda (true) o número entero (false)
    actualizarTendencia('dashSalesTrend', kpis ? (kpis.ventas_trend || 0) : 0, ventas, true);
    actualizarTendencia('dashTicketsTrend', kpis ? (kpis.transacciones_trend || 0) : 0, tickets, false);
    actualizarTendencia('dashAvgTrend', kpis ? (kpis.ticket_trend || 0) : 0, ticketPromedio, true);

    // Refrescar íconos de Lucide
    if (window.lucide) lucide.createIcons();
}

function hexToRgbA(hex, alpha){
    let c;
    if(/^#([A-Fa-f0-9]{3}){1,2}$/.test(hex)){
        c= hex.substring(1).split('');
        if(c.length== 3){
            c= [c[0], c[0], c[1], c[1], c[2], c[2]];
        }
        c= '0x'+c.join('');
        return 'rgba('+[(c>>16)&255, (c>>8)&255, c&255].join(',')+','+alpha+')';
    }
    return `rgba(59, 130, 246, ${alpha})`;
}

function renderSalesChart(data) {
    const canvas = document.getElementById('salesChart');
    const emptyContainer = document.getElementById('salesChartEmpty');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const rootStyle = getComputedStyle(document.documentElement);
    const bgPanel = rootStyle.getPropertyValue('--bg-panel').trim() || '#ffffff';
    const textMain = rootStyle.getPropertyValue('--text-main').trim() || '#111827';
    const textMuted = rootStyle.getPropertyValue('--text-muted').trim() || '#9ca3af';
    const borderColor = rootStyle.getPropertyValue('--border-color').trim() || '#e5e7eb';
    const accentColor = rootStyle.getPropertyValue('--accent-color').trim() || '#3b82f6';

    if (!data || !data.values || data.values.length === 0 || data.values.every(v => v === 0)) {
        if (currentChart) currentChart.destroy();
        canvas.style.display = 'none';
        if(emptyContainer) {
            emptyContainer.classList.remove('hidden');
            if(window.lucide) lucide.createIcons({root: emptyContainer});
        }
        return;
    }

    canvas.style.display = 'block';
    if(emptyContainer) emptyContainer.classList.add('hidden');

    if (currentChart) currentChart.destroy();

    const cleanLabels = data.labels.map(label => {
        if(label.includes('-') && !data.isHourly) {
            const parts = label.split('-');
            return `${parts[2]}/${parts[1]}`;
        }
        return label;
    });

    currentChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: cleanLabels,
            datasets: [{
                label: 'Ventas',
                data: data.values,
                borderColor: '#2563eb',
                borderWidth: 3,
                fill: true,
                backgroundColor: (context) => {
                    const chart = context.chart;
                    const {ctx, chartArea} = chart;

                    if (!chartArea) {
                        return null;
                    }

                    const gradient = ctx.createLinearGradient(0, chartArea.top, 0, chartArea.bottom);
                    gradient.addColorStop(0, 'rgba(37, 99, 235, 0.15)');
                    gradient.addColorStop(1, 'rgba(37, 99, 235, 0.0)');

                    return gradient;
                },
                tension: 0.4
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            interaction: { mode: 'index', intersect: false },
            plugins: {
                legend: { display: false },
                tooltip: {
                    backgroundColor: bgPanel,
                    titleColor: textMain,
                    bodyColor: textMain,
                    borderColor: borderColor,
                    borderWidth: 1,
                    padding: 12,
                    boxPadding: 4,
                    usePointStyle: true,
                    titleFont: { size: 13, family: "'Roboto Flex', sans-serif" },
                    bodyFont: { size: 14, weight: 'bold', family: "'Roboto Flex', sans-serif" },
                    callbacks: {
                        label: function(context) {
                            let label = context.dataset.label || '';
                            if (label) { label += ': '; }
                            if (context.parsed.y !== null) {
                                label += new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN' }).format(context.parsed.y);
                            }
                            return label;
                        }
                    }
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    border: { display: false },
                    grid: { color: borderColor, borderDash: [4, 4] },
                    ticks: { color: textMuted, font: { family: "'Roboto Flex', sans-serif" } }
                },
                x: {
                    border: { display: false },
                    grid: { display: false },
                    ticks: { color: textMuted, font: { family: "'Roboto Flex', sans-serif" }, maxTicksLimit: 8 }
                }
            }
        }
    });
}

function renderTopProductsChart(data) {
    const canvas = document.getElementById('topProductsChart');
    const listContainer = document.getElementById('topProductsList');
    if (!canvas || !listContainer) return;

    const ctx = canvas.getContext('2d');
    const rootStyle = getComputedStyle(document.documentElement);
    const textMain = rootStyle.getPropertyValue('--text-main').trim();
    const bgPanel = rootStyle.getPropertyValue('--bg-panel').trim();
    const accentColor = rootStyle.getPropertyValue('--accent-color').trim();

    listContainer.innerHTML = '';

    if (!data || !data.labels || data.labels.length === 0 || data.values.every(v => v === 0)) {
        if (topChart) topChart.destroy();
        canvas.parentElement.style.display = 'none';
        listContainer.style.justifyContent = 'center';
        listContainer.style.alignItems = 'center';
        listContainer.innerHTML = `
            <div style="display: flex; flex-direction: column; align-items: center; opacity: 0.6; padding-top: 10px;">
                <i data-lucide="package-x" style="width: 32px; height: 32px; color: var(--text-muted);"></i>
                <span style="color: var(--text-muted); font-size: 0.85rem; margin-top: 8px;">Sin ventas</span>
            </div>`;
        if (window.lucide) lucide.createIcons({root: listContainer});
        return;
    }
    canvas.parentElement.style.display = 'block';
    canvas.style.display = 'block';
    listContainer.style.justifyContent = 'flex-start';
    listContainer.style.alignItems = 'stretch';
    if (topChart) topChart.destroy();

    const colors = [
        accentColor,
        hexToRgbA(accentColor, 0.7),
        hexToRgbA(accentColor, 0.4),
        hexToRgbA(accentColor, 0.2),
        hexToRgbA(accentColor, 0.1)
    ];

    const labels = data.labels;
    const values = data.values;

    topChart = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: labels,
            datasets: [{
                data: values,
                backgroundColor: colors,
                borderWidth: 2,
                borderColor: bgPanel,
                hoverOffset: 2
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            cutout: '75%',
            plugins: {
                legend: { display: false },
                tooltip: {
                    backgroundColor: bgPanel,
                    titleColor: textMain,
                    bodyColor: textMain,
                    borderColor: rootStyle.getPropertyValue('--border-color'),
                    borderWidth: 1,
                    titleFont: { size: 11, family: "'Roboto Flex', sans-serif" },
                    bodyFont: { size: 12, family: "'Roboto Flex', sans-serif" }
                }
            }
        }
    });

    const mergedData = labels.map((lbl, idx) => ({ producto: lbl, cantidad: values[idx] }));

    mergedData.slice(0, 3).forEach((item, index) => {
        const row = document.createElement('div');
        row.className = 'top-prod-item';
        row.style.fontSize = '0.75rem';
        row.style.gap = '6px';

        row.innerHTML = `
            <div class="top-prod-rank" style="width: 16px; height: 16px; font-size: 0.65rem;">${index + 1}</div>
            <div class="top-prod-name">${item.producto}</div>
            <div class="top-prod-val">${item.cantidad}</div>
        `;
        listContainer.appendChild(row);
    });
}

function procesarActividad(citas, stock) {
    const feed = document.getElementById('activityFeed');
    if(!feed) return;

    let html = '';

    if (stock && stock.length > 0) {
        stock.forEach(item => {
            html += `
                <div class="feed-item fade-in">
                    <div class="feed-icon warning">
                        <i data-lucide="package-minus"></i>
                    </div>
                    <div class="feed-content">
                        <h4 class="feed-title">Stock Bajo: ${item.producto}</h4>
                        <span class="feed-time">Quedan ${item.stock} unidades</span>
                    </div>
                </div>
            `;
        });
    }

    if (citas && citas.length > 0) {
        const hoyStr = new Date().toISOString().split('T')[0];
        const ayerObj = new Date();
        ayerObj.setDate(ayerObj.getDate() - 1);
        const ayerStr = ayerObj.toISOString().split('T')[0];

        citas.forEach(cita => {
            let etiquetaFecha = cita.fecha;
            if (cita.fecha === hoyStr) {
                etiquetaFecha = "Hoy";
            } else if (cita.fecha === ayerStr) {
                etiquetaFecha = "Ayer";
            } else {
                const partes = cita.fecha.split('-');
                if(partes.length === 3) etiquetaFecha = `${partes[2]}/${partes[1]}`;
            }

            html += `
                <div class="feed-item fade-in">
                    <div class="feed-icon app">
                        <i data-lucide="calendar-clock"></i>
                    </div>
                    <div class="feed-content">
                        <h4 class="feed-title">Cita: ${cita.cliente}</h4>
                        <span class="feed-time">${etiquetaFecha} a las ${cita.hora} - ${cita.servicio}</span>
                    </div>
                </div>
            `;
        });
    }

    if (html === '') {
        feed.innerHTML = `
            <div class="activity-empty">
                <i data-lucide="check-circle-2" style="width: 40px; height: 40px; margin-bottom: 10px; color: var(--success-color); opacity: 0.7;"></i>
                <p style="margin:0; font-weight: 600; color: var(--text-main);">Todo tranquilo por aquí</p>
                <span style="font-size: 0.8rem; color: var(--text-muted); text-align: center; margin-top: 4px;">No tienes citas programadas ni alertas de stock recientes.</span>
            </div>
        `;
    } else {
        feed.innerHTML = html;
    }

    if (window.lucide) lucide.createIcons({root: feed});
}

function formatearMoneda(valor) {
    return new Intl.NumberFormat('es-MX', {
        style: 'currency',
        currency: 'MXN'
    }).format(valor);
}

function loadScript(src) {
    return new Promise((resolve, reject) => {
        const script = document.createElement('script');
        script.src = src;
        script.onload = resolve;
        script.onerror = reject;
        document.head.appendChild(script);
    });
}

// ==============================================================
//  SPARKLINES (MINI GRÁFICOS) CON INTERPOLACIÓN INTELIGENTE
// ==============================================================
function renderSparklines(data) {
    let rawLabels = ['L','M','M','J','V','S','D'];
    if (data && data.graficaVentas && data.graficaVentas.labels) {
        rawLabels = data.graficaVentas.labels.map(label => {
            if(label.includes('-') && !data.graficaVentas.isHourly) {
                const parts = label.split('-');
                return `${parts[2]}/${parts[1]}`;
            }
            return label;
        });
    }

    const rawTickets = (data && data.sparkTickets) ? data.sparkTickets : [0, 0, 5, 8, 0, 9, 14];
    const rawAvg = (data && data.sparkAvg) ? data.sparkAvg : [120, 135, 125, 145, 160, 150, 175];

    // 1. Aplicamos Chunking (Agrupación para no saturar de barras)
    const ticketsComprimidos = comprimirSparkline(rawLabels, rawTickets, false, 7);
    const avgComprimidos = comprimirSparkline(rawLabels, rawAvg, true, 7);

    // 2. Interpolamos los ceros para crear la transición suave de la tendencia
    let ticketsTrend = interpolarHuecos(ticketsComprimidos.data);
    let avgTrend = interpolarHuecos(avgComprimidos.data);

    const barColors = ticketsComprimidos.data.map(val =>
        val === 0 ? 'rgba(156, 163, 175, 0.15)' : 'rgba(156, 163, 175, 0.8)'
    );

    // ==========================================
    // GRÁFICA DE BARRAS (Tickets Emitidos)
    // ==========================================
    const ctxTickets = document.getElementById('sparklineTickets');
    if (ctxTickets) {
        if (sparkTicketsChart) sparkTicketsChart.destroy();

        let maxTicketVal = Math.max(...ticketsTrend);

        if (maxTicketVal === 0) {
            maxTicketVal = 10;
            ticketsTrend = ticketsTrend.map(() => 2); // Barritas al 20% de altura
        }

        sparkTicketsChart = new Chart(ctxTickets.getContext('2d'), {
            type: 'bar',
            data: {
                labels: ticketsComprimidos.labels,
                datasets: [{
                    data: ticketsTrend,
                    backgroundColor: barColors,
                    borderRadius: 4,
                    borderSkipped: false,
                    barPercentage: 0.65
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: { legend: { display: false }, tooltip: { enabled: false } },
                scales: {
                    x: { display: false },
                    y: { display: false, beginAtZero: true, max: maxTicketVal }
                },
                interaction: { mode: null },
                animation: { duration: 800 },
                layout: { padding: 0 }
            }
        });
    }

    // ==========================================
    // GRÁFICA DE PULSO (Ticket Promedio)
    // ==========================================
    const ctxAvg = document.getElementById('sparklineAvg');
    if (ctxAvg) {
        if (sparkAvgChart) sparkAvgChart.destroy();

        const minVal = Math.min(...avgTrend) * 0.95;
        const maxVal = Math.max(...avgTrend);

        sparkAvgChart = new Chart(ctxAvg.getContext('2d'), {
            type: 'line',
            data: {
                labels: avgComprimidos.labels,
                datasets: [{
                    data: avgTrend,
                    borderColor: '#9ca3af',
                    borderWidth: 2.5,
                    tension: 0.4,
                    cubicInterpolationMode: 'monotone',
                    pointRadius: 0,
                    fill: false,
                    borderCapStyle: 'round',
                    borderJoinStyle: 'round'
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: { legend: { display: false }, tooltip: { enabled: false } },
                scales: {
                    x: { display: false },
                    y: { display: false, min: minVal, max: maxVal }
                },
                interaction: { mode: null },
                layout: { padding: { top: 3, bottom: 2, left: 0, right: 0 } }
            }
        });
    }
}

// ==============================================================
//  FUNCIONES MATEMÁTICAS DE APOYO
// ==============================================================

// 1. Chunking: Agrupa la data si excede el límite de columnas
function comprimirSparkline(labels, data, isAverage = false, maxBars = 7) {
    if (!data || data.length === 0) return { labels: [], data: [] };
    if (data.length <= maxBars) return { labels, data };

    const chunkSize = Math.ceil(data.length / maxBars);
    const newLabels = [];
    const newData = [];

    for (let i = 0; i < data.length; i += chunkSize) {
        const chunkData = data.slice(i, i + chunkSize);
        let sum = chunkData.reduce((a, b) => a + b, 0);
        let finalValue = isAverage ? (sum / chunkData.length) : sum;

        newLabels.push(`Bloque ${newData.length + 1}`);
        newData.push(Math.round(finalValue * 100) / 100);
    }
    return { labels: newLabels, data: newData };
}

// 2. Interpolación Lineal: Calcula la altura inteligente para los ceros
function interpolarHuecos(arr) {
    let result = [...arr];
    let n = result.length;

    for (let i = 0; i < n; i++) {
        if (result[i] === 0) {
            let prevIdx = i - 1;
            while (prevIdx >= 0 && result[prevIdx] === 0) prevIdx--;

            let nextIdx = i + 1;
            while (nextIdx < n && result[nextIdx] === 0) nextIdx++;

            let prevVal = prevIdx >= 0 ? result[prevIdx] : null;
            let nextVal = nextIdx < n ? result[nextIdx] : null;

            if (prevVal !== null && nextVal !== null) {
                let steps = nextIdx - prevIdx;
                let diff = nextVal - prevVal;
                result[i] = prevVal + (diff / steps) * (i - prevIdx);
            } else if (prevVal !== null) {
                result[i] = prevVal;
            } else if (nextVal !== null) {
                result[i] = nextVal;
            }
        }
    }
    return result;
}