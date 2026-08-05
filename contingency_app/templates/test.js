
        let indexCount = 0;
        let capitalCount = 0;
        let calcTimeout = null;

        const constructionIndices = {
            "Công trình nhà ở": [102.48, 103.25, 106.09, 105.94, 107.35, 105.96],
            "Công trình giáo dục": [102.10, 102.47, 105.56, 105.79, 106.94, 106.54],
            "Công trình trụ sở cơ quan, văn phòng": [102.32, 102.61, 105.45, 106.11, 107.01, 106.48],
            "Công trình y tế": [102.49, 102.57, 105.00, 105.51, 106.25, 105.73],
            "Công trình văn hóa": [103.06, 103.66, 106.75, 106.76, 108.14, 107.27],
            "Công trình đường dây": [106.27, 106.34, 106.94, 110.41, 111.89, 111.74],
            "Công trình trạm biến áp": [104.92, 104.79, 105.59, 108.28, 109.40, 109.36],
            "Công trình SX VLXD (gạch, ngói)": [104.59, 105.40, 108.50, 107.98, 109.10, 107.92],
            "Công trình nhà xưởng khung thép": [101.78, 102.40, 105.73, 105.51, 106.50, 105.51],
            "Đường bê tông xi măng": [107.27, 108.67, 114.28, 111.96, 114.04, 111.56],
            "Đường láng nhựa": [107.38, 108.97, 116.35, 114.90, 116.01, 113.45],
            "Đường bê tông nhựa": [108.73, 109.63, 121.16, 124.66, 123.38, 120.39],
            "Công trình cầu bê tông xi măng": [104.22, 105.22, 111.29, 110.74, 111.57, 109.75],
            "Công trình Kênh thủy lợi kết hợp đê bao": [106.38, 107.94, 115.92, 116.64, 115.89, 111.35],
            "Công trình Cống các loại": [102.92, 103.82, 108.41, 108.52, 109.28, 106.93],
            "Công trình Kè bê tông cốt thép": [105.07, 106.01, 111.71, 111.43, 111.83, 109.87],
            "Công trình nạo vét kênh": [104.10, 105.17, 114.53, 117.62, 113.05, 109.95],
            "Công trình nhà máy cấp nước": [101.21, 101.25, 103.90, 104.26, 105.01, 104.55],
            "Công trình tuyến ống cấp nước": [102.01, 102.52, 104.49, 106.41, 106.11, 105.78],
            "Công trình mạng thoát nước": [102.06, 102.75, 106.05, 107.51, 107.28, 106.29],
            "Công trình HT chiếu sáng công cộng": [103.26, 103.33, 105.37, 108.57, 109.90, 109.77],
            "Công trình Hạ tầng kỹ thuật đô thị": [108.02, 108.88, 115.48, 116.90, 117.35, 115.39]
        };

        const selectAutoIndex = document.getElementById('auto-index-select');
        if (selectAutoIndex) {
            for(let key in constructionIndices) {
                const opt = document.createElement('option');
                opt.value = key;
                opt.textContent = key;
                selectAutoIndex.appendChild(opt);
            }
        }

        function applyAutoIndices() {
            const val = document.getElementById('auto-index-select').value;
            if(!val) return;
            const arr = constructionIndices[val];
            document.getElementById('index-container').innerHTML = ''; 
            indexCount = 0;
            arr.forEach((v, i) => {
                indexCount++;
                const div = document.createElement('div');
                div.className = 'flex items-center gap-2';
                div.innerHTML = `
                    <span class="text-xs text-slate-600 font-medium w-12 text-center bg-slate-100 py-1.5 rounded border border-slate-200">T${i+1}/26</span>
                    <input type="number" placeholder="Chỉ số" class="year-index w-full input-field rounded px-2 py-1.5 text-sm" step="0.01" value="${v}">
                    <button onclick="this.parentElement.remove(); indexCount--; triggerCalculate();" class="text-red-400 hover:text-red-600 p-1 rounded" title="Xóa">✕</button>
                `;
                document.getElementById('index-container').appendChild(div);
            });
            triggerCalculate();
        }

        function triggerCalculate() {
            clearTimeout(calcTimeout);
            document.getElementById('loading-spinner').classList.remove('hidden');
            document.getElementById('results-wrapper').classList.add('loading-results');
            calcTimeout = setTimeout(() => {
                calculate();
            }, 400); // Đợi 400ms sau khi người dùng ngừng gõ để tính
        }

        const selectSampleGdp1 = document.getElementById('sample-gdp1');
        if (selectSampleGdp1) {
            for (let i = 10; i <= 200; i += 5) {
                const opt = document.createElement('option');
                opt.value = i;
                opt.textContent = `Dự án ${i} Tỷ`;
                selectSampleGdp1.appendChild(opt);
            }
        }

        function loadSampleGDP1() {
            const val = parseFloat(document.getElementById('sample-gdp1').value);
            if (!val) return;
            
            document.getElementById('G_BT_TDC').value = +(val * 0.10).toFixed(2);
            document.getElementById('G_XD').value = +(val * 0.60).toFixed(2);
            document.getElementById('G_TB').value = +(val * 0.15).toFixed(2);
            document.getElementById('G_QLDA').value = +(val * 0.02).toFixed(2);
            document.getElementById('G_TV').value = +(val * 0.08).toFixed(2);
            document.getElementById('G_K').value = +(val * 0.05).toFixed(2);
            
            triggerCalculate();
        }

        // Auto trigger on any input changes
        document.addEventListener('input', function(e) {
            if(e.target.tagName === 'INPUT') {
                triggerCalculate();
            }
        });

        function addYearIndex() {
            indexCount++;
            const div = document.createElement('div');
            div.className = 'flex items-center gap-2';
            div.innerHTML = `
                <span class="text-xs text-slate-600 font-medium w-12 text-center bg-slate-100 py-1.5 rounded border border-slate-200">I<sub>${indexCount}</sub></span>
                <input type="number" placeholder="Chỉ số" class="year-index w-full input-field rounded px-2 py-1.5 text-sm" step="0.01">
                <button onclick="this.parentElement.remove(); indexCount--; triggerCalculate();" class="text-red-400 hover:text-red-600 p-1 rounded" title="Xóa">✕</button>
            `;
            document.getElementById('index-container').appendChild(div);
            triggerCalculate();
        }

        function addCapitalRow() {
            capitalCount++;
            const div = document.createElement('div');
            div.className = 'flex items-center gap-2 bg-slate-50 p-2 rounded border border-slate-200 shadow-sm';
            div.innerHTML = `
                <div class="flex items-center justify-center w-8 h-8 bg-white border border-slate-200 rounded text-xs font-bold text-slate-600">
                    t=${capitalCount}
                </div>
                <div class="flex-1 grid grid-cols-2 gap-2">
                    <input type="number" placeholder="Vốn V_t" class="capital-v w-full input-field rounded px-2 py-1 text-sm font-semibold text-blue-700" step="0.01">
                    <input type="number" placeholder="Lãi vay" class="capital-l w-full input-field rounded px-2 py-1 text-sm" step="0.01" value="0">
                </div>
                <button onclick="this.parentElement.remove(); capitalCount--; triggerCalculate();" class="text-red-400 hover:text-red-600 p-1" title="Xóa">✕</button>
            `;
            document.getElementById('capital-container').appendChild(div);
            triggerCalculate();
        }

        function loadSampleData() {
            const val = document.getElementById('sample-data').value;
            
            // Clear current
            document.getElementById('index-container').innerHTML = ''; indexCount = 0;
            document.getElementById('capital-container').innerHTML = ''; capitalCount = 0;
            document.getElementById('G_BT_TDC').value = 0;
            document.getElementById('G_XD').value = 0;
            document.getElementById('G_TB').value = 0;
            document.getElementById('G_QLDA').value = 0;
            document.getElementById('G_TV').value = 0;
            document.getElementById('G_K').value = 0;
            document.getElementById('k_ps').value = 10;
            document.getElementById('Delta_I_XDCT').value = 0;
            
            if (val === 'sample1') {
                document.getElementById('G_XD').value = 30; 
                
                const indices = [100, 103.5, 106.8, 110.2];
                indices.forEach(v => {
                    addYearIndex();
                    const inputs = document.querySelectorAll('.year-index');
                    inputs[inputs.length - 1].value = v;
                });
                
                document.getElementById('Delta_I_XDCT').value = 1.5;
                
                for(let i=0; i<3; i++) {
                    addCapitalRow();
                    const vInputs = document.querySelectorAll('.capital-v');
                    vInputs[vInputs.length - 1].value = 10; 
                }
            } else {
                for(let i=0; i<3; i++) addYearIndex();
                for(let i=0; i<2; i++) addCapitalRow();
            }
            triggerCalculate();
        }

        // Init default rows and calculate
        for(let i=0; i<3; i++) addYearIndex();
        for(let i=0; i<2; i++) addCapitalRow();
        triggerCalculate();

        async function calculate() {
            const data = {
                G_BT_TDC: document.getElementById('G_BT_TDC').value || 0,
                G_XD: document.getElementById('G_XD').value || 0,
                G_TB: document.getElementById('G_TB').value || 0,
                G_QLDA: document.getElementById('G_QLDA').value || 0,
                G_TV: document.getElementById('G_TV').value || 0,
                G_K: document.getElementById('G_K').value || 0,
                k_ps: document.getElementById('k_ps').value || 0,
                Delta_I_XDCT: document.getElementById('Delta_I_XDCT').value || 0,
                I_n: Array.from(document.querySelectorAll('.year-index')).map(el => el.value || 0),
                V_t: Array.from(document.querySelectorAll('.capital-v')).map(el => el.value || 0),
                L_Vayt: Array.from(document.querySelectorAll('.capital-l')).map(el => el.value || 0)
            };

            try {
                const response = await fetch('/calculate', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(data)
                });
                const result = await response.json();
                
                if (result.success) {
                    const formatNum = (num) => new Intl.NumberFormat('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 3 }).format(num);
                    
                    document.getElementById('res-gdp1').innerText = formatNum(result.GDP1);
                    document.getElementById('res-ixdct').innerText = formatNum(result.I_XDCTbq);
                    document.getElementById('res-gdp2').innerText = formatNum(result.GDP2);
                    document.getElementById('res-gdp').innerText = formatNum(result.GDP);
                    
                    if (result.breakdown && result.breakdown.length > 0) {
                        const tbody = document.getElementById('breakdown-body');
                        tbody.innerHTML = '';
                        result.breakdown.forEach(row => {
                            const tr = document.createElement('tr');
                            tr.className = 'hover:bg-slate-100 transition-colors';
                            tr.innerHTML = `
                                <td class="py-2 px-3">t=${row.year}</td>
                                <td class="py-2 px-3 text-right font-medium">${formatNum(row.V_t)}</td>
                                <td class="py-2 px-3 text-right text-orange-600">${formatNum(row.term * 100)}%</td>
                                <td class="py-2 px-3 text-right text-purple-600">${formatNum(row.contingency_t)}</td>
                                <td class="py-2 px-3 text-right font-bold text-emerald-600">${formatNum(row.projected_cost)}</td>
                            `;
                            tbody.appendChild(tr);
                        });
                        document.getElementById('breakdown-container').classList.remove('hidden');
                        
                        // Generate Bảng 4.4
                        const i_n_inputs = Array.from(document.querySelectorAll('.year-index')).map(el => parseFloat(el.value) || 0);
                        let reportHTML = '';
                        // I
                        reportHTML += `<tr class="font-bold bg-slate-50"><td class="border border-slate-300 p-2 text-center">I</td><td class="border border-slate-300 p-2" colspan="5">CHỈ SỐ GIÁ CÁC NĂM</td></tr>`;
                        i_n_inputs.forEach((val, idx) => {
                            reportHTML += `<tr><td class="border border-slate-300 p-2"></td><td class="border border-slate-300 p-2">Năm ${idx + 1}</td><td class="border border-slate-300 p-2 text-center">a${idx + 1}</td><td class="border border-slate-300 p-2 text-center">Theo công bố giá của SXD</td><td class="border border-slate-300 p-2 text-right">${val.toFixed(2).replace('.', ',')}</td><td class="border border-slate-300 p-2 text-center">%</td></tr>`;
                        });
                        // II
                        reportHTML += `<tr class="font-bold bg-slate-50"><td class="border border-slate-300 p-2 text-center">II</td><td class="border border-slate-300 p-2" colspan="5">CHỈ SỐ TRƯỢT GIÁ NĂM SAU/NĂM TRƯỚC</td></tr>`;
                        if (result.I_ratios) {
                            result.I_ratios.forEach((val, idx) => {
                                reportHTML += `<tr><td class="border border-slate-300 p-2"></td><td class="border border-slate-300 p-2">Năm ${idx + 2}/${idx + 1}</td><td class="border border-slate-300 p-2 text-center">b${idx + 1}</td><td class="border border-slate-300 p-2 text-center">a${idx + 2}/a${idx + 1}</td><td class="border border-slate-300 p-2 text-right">${val.toFixed(4).replace('.', ',')}</td><td class="border border-slate-300 p-2 text-center"></td></tr>`;
                            });
                        }
                        // III
                        let c_calc = (result.I_ratios && result.I_ratios.length > 0) ? `(b1+...+b${result.I_ratios.length})/${result.I_ratios.length}` : '-';
                        reportHTML += `<tr class="font-bold bg-slate-50"><td class="border border-slate-300 p-2 text-center">III</td><td class="border border-slate-300 p-2 font-bold">CHỈ SỐ TRƯỢT GIÁ BÌNH QUÂN</td><td class="border border-slate-300 p-2 text-center font-bold">c</td><td class="border border-slate-300 p-2 text-center font-bold">${c_calc}</td><td class="border border-slate-300 p-2 text-right font-bold">${result.I_XDCTbq.toFixed(4).replace('.', ',')}</td><td class="border border-slate-300 p-2 text-right font-bold">${((result.I_XDCTbq - 1) * 100).toFixed(2).replace('.', ',')}</td></tr>`;
                        // IV
                        reportHTML += `<tr class="font-bold bg-slate-50"><td class="border border-slate-300 p-2 text-center">IV</td><td class="border border-slate-300 p-2" colspan="5">CHỈ SỐ TRƯỢT GIÁ CÁC NĂM</td></tr>`;
                        result.breakdown.forEach((row) => {
                            reportHTML += `<tr><td class="border border-slate-300 p-2"></td><td class="border border-slate-300 p-2 font-bold">Năm t=${row.year}</td><td class="border border-slate-300 p-2 text-center font-bold">d${row.year}</td><td class="border border-slate-300 p-2 text-center font-bold">c^${row.year}</td><td class="border border-slate-300 p-2 text-right font-bold">${row.inflation_factor.toFixed(4).replace('.', ',')}</td><td class="border border-slate-300 p-2 text-right font-bold">${(row.term * 100).toFixed(2).replace('.', ',')}</td></tr>`;
                        });
                        
                        document.getElementById('full-report-body').innerHTML = reportHTML;
                        document.getElementById('full-report-table-container').classList.remove('hidden');
                    } else {
                        document.getElementById('breakdown-container').classList.add('hidden');
                    }
                } else {
                    console.error('Lỗi tính toán: ' + result.error);
                }
            } catch (error) {
                console.error('Lỗi kết nối máy chủ!');
            } finally {
                document.getElementById('loading-spinner').classList.add('hidden');
                document.getElementById('results-wrapper').classList.remove('loading-results');
            }
        }
    
