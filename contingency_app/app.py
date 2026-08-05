from flask import Flask, render_template, request, jsonify

app = Flask(__name__)

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/calculate', methods=['POST'])
def calculate():
    data = request.json
    try:
        # Lấy dữ liệu GDP1
        G_BT_TDC = float(data.get('G_BT_TDC', 0))
        G_XD = float(data.get('G_XD', 0))
        G_TB = float(data.get('G_TB', 0))
        G_QLDA = float(data.get('G_QLDA', 0))
        G_TV = float(data.get('G_TV', 0))
        G_K = float(data.get('G_K', 0))
        k_ps = float(data.get('k_ps', 0)) / 100.0
        
        GDP1 = (G_BT_TDC + G_XD + G_TB + G_QLDA + G_TV + G_K) * k_ps
        
        # Lấy dữ liệu trượt giá (I_XDCTbq)
        I_n_values = data.get('I_n', [])
        T_past = len(I_n_values) - 1
        
        if T_past >= 1: # Tối thiểu có 2 chỉ số để tính tỷ lệ
            sum_ratio = 0
            I_ratios = []
            for i in range(T_past):
                if float(I_n_values[i]) != 0:
                    r = float(I_n_values[i+1]) / float(I_n_values[i])
                else:
                    r = 1 # Avoid division by zero
                sum_ratio += r
                I_ratios.append(r)
            I_XDCTbq = sum_ratio / T_past
        else:
            I_XDCTbq = 0
            I_ratios = []
            
        Delta_I_XDCT = float(data.get('Delta_I_XDCT', 0)) / 100.0
        
        # Lấy dữ liệu phân bổ vốn (GDP2)
        V_t_values = data.get('V_t', [])
        L_Vayt_values = data.get('L_Vayt', [])
        T_future = len(V_t_values)
        
        GDP2 = 0
        year_breakdown = []
        for t in range(T_future):
            V_t = float(V_t_values[t])
            L_Vayt = float(L_Vayt_values[t]) if t < len(L_Vayt_values) else 0
            # Công thức (1.13): term = (I_XDCTbq + Delta_I_XDCT)^t - 1
            # t = 1, 2, ..., T_future, trong code thì t đang từ 0, nên cần t+1
            inflation_factor = (I_XDCTbq + Delta_I_XDCT)**(t + 1)
            term = inflation_factor - 1
            contingency_t = (V_t - L_Vayt) * term
            GDP2 += contingency_t
            
            projected_cost = V_t + contingency_t
            
            year_breakdown.append({
                'year': t + 1,
                'V_t': V_t,
                'L_Vayt': L_Vayt,
                'inflation_factor': inflation_factor,
                'term': term,
                'contingency_t': contingency_t,
                'projected_cost': projected_cost
            })
            
        GDP = GDP1 + GDP2
        
        return jsonify({
            'success': True,
            'GDP1': GDP1,
            'I_XDCTbq': I_XDCTbq,
            'I_ratios': I_ratios,
            'GDP2': GDP2,
            'GDP': GDP,
            'breakdown': year_breakdown
        })
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)})

if __name__ == '__main__':
    app.run(debug=True, port=5000)
