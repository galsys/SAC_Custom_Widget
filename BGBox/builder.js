(function () {
    const template = document.createElement('template')
    template.innerHTML = `
      <style>
        .container {
            margin: 5px;
            padding: 20px;
            border: 1px solid #ccc;
            background-color: #ffffff;
            border-radius: 8px;
            box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
            font-family: Arial, sans-serif;
            font-size: 14px;
        }

        .form-group {
            margin-bottom: 5px;
            display: flex;
            align-items: center;
        }

        .form-group label {
            display: block;
            color: #333;
            margin-bottom: 5px;
            margin-right:20px;
        }

        .form-group input[type="text"] {
            /* width: 50px; */
            padding: 4px;
            border: 1px solid #ccc;
            border-radius: 4px;
            box-sizing: border-box;
        }

        .form-group input[type="color"] {
            width: 40px;
            height: 30px;
            border: none;
            cursor: pointer;
            border-radius: 4px;
        }

        .section {
            padding: 10px;
            margin-bottom: 15px;
            border: 1px solid #ddd;
            border-radius: 4px;
            background-color: #f9f9f9;
        }

        .section-title {
            width: 390px;
            text-align: center;
            color: #21121B;
            font-size: 15px;
            font-weight: bold;
            margin-bottom: 10px;
        }

        .apply-button {
            display: flex;
            justify-content: center;
        }

        .apply-button input[type="button"] {
            padding: 8px 16px;
            background-color: #427CAC;
            border: none;
            color: #ffffff;
            border-radius: 4px;
            cursor: pointer;
        }

        .apply-button input[type="button"]:hover {
            background-color: #346187;
        }
      </style>
      <div id="root" class="container" style="width: 413px; height: 100%;">
        <div id="header_section" class="section">
            <div class="section-title">헤더 설정</div>
            <div class="form-group">
                <label for="header_height">헤더 높이</label>
                <input type="text" id="header_height" style="width:100px" value="48">
                <span style="padding:5px"> px</span>
            </div>
            <div class="form-group">
                <label for="header_radius">헤더 곡선</label>
                <input type="text" id="header_radius" style="width:50px;text-align: right;" value="30" /> 
                <input id="header_radius_slide" type="range" min="0" max="90" value="30" class="slide" />                
                <span style="padding:5px"> (0 ~ 90)</span>
            </div>
            <div class="form-group">
                <label for="header_color">색상 유형</label>
                <label>
                    <input type="radio" name="header_color_type" value="single" checked>
                    단색
                </label>
                <label>
                    <input type="radio" name="header_color_type" value="gradation">
                    그라데이션
                </label>
            </div>
            <div class="form-group">
                <label for="header_color">헤더 색상 (단색)</label>
                <input type="color" id="header_color" value="#5A3E4F">
            </div>
            <div class="form-group">
                <label for="header_color">헤더 색상 (그라데이션)</label>
                <input type="color" id="header_color1" value="#763D54"><input type="text" id="offset1" style="width:25px;text-align: right;" value="10">%
                <input type="color" id="header_color2" value="#251836"><input type="text" id="offset2" style="width:25px;text-align: right;" value="50">%
				<input type="color" id="header_color3" value="#251836">
            </div>
            <div class="form-group">
                <label for="gap">사이 간격</label>
                <input type="text" id="gap" style="width:50px;text-align: right;" value="0">
                <span style="padding:5px"> px</span>
            </div>
        </div>
        <div id="body_section" class="section">
            <div class="section-title">바디 설정</div>
            <div class="form-group">
                <label for="body_radius">바디 곡선</label>
                <input type="text" id="body_radius" style="width:50px;text-align: right;" value="30" />
                <input id="body_radius_slide" type="range" min="0" max="90" value="30" class="slide" />                
                <span style="padding:5px"> (0 ~ 90)</span>
            </div>
            <div class="form-group">
                <label for="body_color">바디 색상</label>
                <input type="color" id="body_color" value="#4D304D">
                
                <label id="body_color_opacity" style="width:30px;text-align: right;">1</label>
                <input id="body_color_opacity_value" type="range" min="1" max="100" value="100" class="slide" />
                <span style="padding:5px">투명도</span>

            </div>
        </div>

        <div class="apply-button">
            <input type="button" id="button" value="적용">
        </div>
      </div>
      `
    class Buiilder extends HTMLElement {
      constructor () {
        super()
  
        this._shadowRoot = this.attachShadow({ mode: 'open' })
        this._shadowRoot.appendChild(template.content.cloneNode(true))
        this._root = this._shadowRoot.getElementById('root')
  
        this._button = this._shadowRoot.getElementById('button');
        this._button.addEventListener('click', () => this._applyChanges());
		
        // 이벤트 리스너 추가
        this._shadowRoot.getElementById('header_radius').addEventListener('change', (e) => this._headerRound(e.target.value));
        this._shadowRoot.getElementById('header_radius_slide').addEventListener('change', (e) => this._headerRound(e.target.value));
        this._shadowRoot.getElementById('body_radius').addEventListener('change', (e) => this._bodyRound(e.target.value));
        this._shadowRoot.getElementById('body_radius_slide').addEventListener('change', (e) => this._bodyRound(e.target.value));
        this._shadowRoot.getElementById('body_color_opacity_value').addEventListener('change', (e) => this._bodyColorOpacity(e.target.value));

      }
      
  
      // 맨처음에만 발동한다.. 왜?
      async onCustomWidgetAfterUpdate (changedProps) {
        console.log('-----------------------초기에 기본값으로 속성 항목에 설정해주는 곳으로 사용합니다. ------------------');
		console.log(['changedProps',changedProps]);
		
        if (changedProps.header_height) {
          this._shadowRoot.getElementById('header_height').value = changedProps.header_height;
        }

		if (changedProps.gap) {
          this._shadowRoot.getElementById('gap').value = changedProps.gap;
        }
		
		if (changedProps.header_color_type) {
			const radioButtons = this.shadowRoot.querySelectorAll('input[type="radio"][name="header_color_type"]');
			radioButtons.forEach(radio => {
			  if(radio.value === changedProps.header_color_type) {
				radio.checked = true;
			  }else {
				radio.checked = false;
			  }
			});
        }
		
        if (changedProps.header_color) {
          this._shadowRoot.getElementById('header_color').value = changedProps.header_color;
        }
		
		if (changedProps.header_color1) {
          this._shadowRoot.getElementById('header_color1').value = changedProps.header_color1;
        }
		
		if (changedProps.header_color2) {
          this._shadowRoot.getElementById('header_color2').value = changedProps.header_color2;
        }
		
		if (changedProps.header_color3) {
          this._shadowRoot.getElementById('header_color3').value = changedProps.header_color3;
        }
		
		if (changedProps.offset1) {
          this._shadowRoot.getElementById('offset1').value = changedProps.offset1;
        }
		
		if (changedProps.offset2) {
          this._shadowRoot.getElementById('offset2').value = changedProps.offset2;
        }

        if (changedProps.body_color) {
          this._shadowRoot.getElementById('body_color').value = changedProps.body_color;
        }
		
		if (changedProps.header_radius) {
          this._shadowRoot.getElementById('header_radius').value = changedProps.header_radius;
		  this._shadowRoot.getElementById('header_radius_slide').value = changedProps.header_radius; 
        }
		
		if (changedProps.body_radius) {
          this._shadowRoot.getElementById('body_radius').value = changedProps.body_radius;
		  this._shadowRoot.getElementById('body_radius_slide').value = changedProps.body_radius; 
        }
		
		if (changedProps.body_color_opacity) {
			
		  let body_color_opacity = Number.parseFloat(changedProps.body_color_opacity);
		  console.log(['changedProps.body_color_opacity',changedProps.body_color_opacity])
		  console.log(['body_color_opacity',body_color_opacity])
          this._shadowRoot.getElementById('body_color_opacity').innerText = body_color_opacity;
		  this._shadowRoot.getElementById('body_color_opacity_value').value = body_color_opacity*100;
		  
        }
		
		
      }

      _applyChanges() {
        let header_height = this._shadowRoot.getElementById('header_height').value;
        let header_color = this._shadowRoot.getElementById('header_color').value;
        let header_color1 = this._shadowRoot.getElementById('header_color1').value;
        let header_color2 = this._shadowRoot.getElementById('header_color2').value;
		let header_color3 = this._shadowRoot.getElementById('header_color3').value;
		let offset1 = this._shadowRoot.getElementById('offset1').value;
		let offset2 = this._shadowRoot.getElementById('offset2').value;
        let body_color = this._shadowRoot.getElementById('body_color').value;
		let body_color_opacity = this._shadowRoot.getElementById('body_color_opacity').innerText;
        let header_radius = this._shadowRoot.getElementById('header_radius').value;
        let body_radius = this._shadowRoot.getElementById('body_radius').value;
        let gap = this._shadowRoot.getElementById('gap').value;

        const radioButtons = this.shadowRoot.querySelectorAll('input[type="radio"][name="header_color_type"]');
        let header_color_type = "single";
        radioButtons.forEach(radio => {
          if(radio.checked && radio.value === 'gradation') {
            header_color_type = 'gradation';
          }
        });

        console.log(["body_color_opacity",body_color_opacity]);


        
        this.dispatchEvent(new CustomEvent('propertiesChanged', 
          { detail: 
            { properties: 
              { header_height,
                header_color,
                header_color1,
                header_color2,
				header_color3,
				offset1,
				offset2,
                body_color,
				body_color_opacity,
                header_radius,
                body_radius,
                gap,
                header_color_type
              } 
            } 
          }
        ));
      }

      _headerRound(val) {
        if(val>90) val = 90;
        if(val<0) val = 0;
        
        this._shadowRoot.getElementById('header_radius').value = val ;
        this._shadowRoot.getElementById('header_radius_slide').value = val ;
      }

      _bodyRound(val) {
        if(val > 90) val = 90;
        if(val < 0) val = 0;
        
        this._shadowRoot.getElementById('body_radius').value = val ;
        this._shadowRoot.getElementById('body_radius_slide').value = val ;
      }

      _bodyColorOpacity(val) {
        const value = val / 100;
        this._shadowRoot.getElementById('body_color_opacity').innerText = value;
      }

      
    }
  
    customElements.define('com-bsg-sac-bgbox_headerbox-builder', Buiilder);

    
  })()