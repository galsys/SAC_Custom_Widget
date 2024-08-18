(function () {

    const template = document.createElement('template')
    template.innerHTML = `
        <style>
            :host {
                display: block;
                width: 100%;
                height: 100%;
            }
            #root {
                width: 100%;
                height: 100%;
            }
        </style>
        <div id="root">
        </div>
      `;

    // 웹 컴포넌트 정의
    class BGBox extends HTMLElement {
        //맨처음 위젯을 생성하면 발동..
        constructor() {
            super(); // Shadow DOM 생성 
            this._shadowRoot = this.attachShadow({ mode: 'open' });
            this._shadowRoot.appendChild(template.content.cloneNode(true));

            this._root = this._shadowRoot.getElementById('root')

            this._d3 = null;

            console.log('생성자');
        }

        loadLib() {
            if (!this._d3) {
                const src = 'https://d3js.org/d3.v4.min.js';
                console.log('d3.js initial loading..');

                this.loadD3Lib(src).then(() => {
                    this._d3 = d3;
                    this.render();
                });

            } else {
                console.log('d3.js skip load..');
                this.render();
            }
        }

        loadD3Lib(src) {
            return new Promise((resolve, reject) => {
                const script = document.createElement('script');
                script.src = src;
                script.onload = resolve;
                script.onerror = reject;
                document.head.appendChild(script);
            })
        }

        connectedCallback() {
            console.log('connectedCallback');
            this.loadLib();
        }

        onCustomWidgetResize(width, height) {
            console.log('onCustomWidgetResize');
            console.log(["width/height",width,height]);
            this.loadLib();
        }

        onCustomWidgetAfterUpdate(changedProps) {
            console.log('onCustomWidgetAfterUpdate');
            this.loadLib();
        }

        onCustomWidgetDestroy() {
            console.log('onCustomWidgetDestroy');
            this._root.innerHTML = '';
        }

        setHeader_height (height) {
            console.log(['setHeader_height',height]);
            // 여기서 변화가 생기는 것 같음..

            const header_height = Number.parseInt(height); //받아오는 값은 string 이고 property 에 넣어주는 값은 integer 로 변경해야 함.
            this.header_height = header_height; // 이것을 해야 render() 할 때 값을 반영해서 다시 그린다. 꼭 해줘야 함.

            // 이건 프로퍼티 정보를 업데이트 하는 것임. 위에 this.header_height 값을 변경하는 것과는 목적이 다름
            this.dispatchEvent(new CustomEvent('propertiesChanged', { detail: { properties: { header_height } } })); 
            
            this.loadLib();
        }

        render() { //위에 async 관련된 처리가 있으므로 굳이 async 로 할 필요 없을 것 같다.
            console.log('render()');

            const d3 = this._d3;
            //박스를 다시 그리기 위해 기존 Box 를 삭제하고 다시 그립니다.
            d3.select(this._root).selectAll("*").remove();

            this.printProperties();

            let width = this.offsetWidth;; // 넓이 격자 갯수
            let height = this.offsetHeight; // 전체 높이
            
            let header_color_type = this.header_color_type;
            let header_color = this.header_color; //
            let header_color1 = this.header_color1; //
            let header_color2 = this.header_color2; //
            let header_color3 = this.header_color3; //
			let offset1 = Number.parseInt(this.offset1); //
			let offset2 = Number.parseInt(this.offset2); //
            let body_color = this.body_color;
			let body_color_opacity = this.body_color_opacity;

            let header_radius = this.header_radius; // 헤더 상단 라운드 반지름
            let body_radius = this.body_radius; // 컨텐츠 하단 라운드 반지름

            // 아래 3개의 높이를 더하면 전체 Box 의 height 와 동일하다.
            let header_height = Number.parseInt(this.header_height); // 격자 고정 header 높이 프로퍼티에 string으로 입력될 수 있기 때문에 cast
            let gap = Number.parseInt(this.gap); // 헤더와 컨텐츠 사이의 틈
            let body_height = height - header_height; // 바디 높이


            // let gradient_or_flat = header_color; //"url(#grad1)"
            let gradient_or_single = header_color; //"url(#grad1)"

            if (header_color_type === 'gradation') gradient_or_single = "url(#grad1)";

			
            
            console.log(['gradient_or_single',gradient_or_single]);
            // Saving the gradient SVG content with transparent stroke to a file
            // let header_color1 = "#763D54"; //#763D54
            // let header_color2 = "#251836"; //#251836

            // 그라데이션과 관련된 세팅 나중에 사용.
            //let offset1 = 10 * 100 / width // 왼쪽 그라데이션 10px 영역차지.
            //let offset2 = 200 * 100 / width // 왼쪽 그라데이션 30px 영역차지.

            const svgElement = document.createElementNS("http://www.w3.org/2000/svg", "svg");
            const svg = d3.select(svgElement)
                .attr("width", width)
                .attr("height", header_height + gap + body_height)
                .attr("xmlns", "http://www.w3.org/2000/svg");
                
            // const svg = d3.select(this._root)
            //     .append("svg")
            //     .attr("width", width)
            //     .attr("height", header_height + gap + body_height)
            //     .attr("xmlns", "http://www.w3.org/2000/svg");
            // defs 요소 생성 
            const defs = svg.append("defs");
            
            // linearGradient 생성 
            const gradient = defs.append("linearGradient")
              .attr("id", "grad1")
              .attr("x1", "0%")
              .attr("y1", "0%")
              .attr("x2", "100%")
              .attr("y2", "0%");
            // 첫 번째 stop 생성 
            gradient.append("stop")
              .attr("offset", `${offset1}%`)
              .attr("style", `stop-color:${header_color1};stop-opacity:1`);
            // 두 번째 stop 생성 
            gradient.append("stop")
              .attr("offset", `${offset2}%`)
              .attr("style", `stop-color:${header_color2};stop-opacity:1`);
            // 세 번째 stop 생성 
            gradient.append("stop")
              .attr("offset", "100%")
              .attr("style", `stop-color:${header_color3};stop-opacity:1`);
            

            // 첫 번째 path 생성 
            svg.append("path")
                .attr("d", `M ${header_radius} 0 `
                    + `H ${width - header_radius} `
                    + `A ${header_radius} ${header_radius} 0 0 1 ${width} ${header_radius} `
                    + `V ${header_height} `
                    + `H 0 `
                    + `V ${header_radius} `
                    + `A ${header_radius} ${header_radius} 0 0 1 ${header_radius} 0 `
                    + `Z`)
                .attr("fill", gradient_or_single)
                .attr("stroke", "none")
                .attr("stroke-width", "0");
            // 두 번째 path 생성 
            svg.append("path")
                .attr("d", `M 0 ${header_height + gap} `
                    + `H ${width} `
                    + `V ${header_height + body_height - body_radius} `
                    + `A ${body_radius} ${body_radius} 0 0 1 ${width - body_radius} ${header_height + body_height} `
                    + `H ${body_radius} `
                    + `A ${body_radius} ${body_radius} 0 0 1 0 ${header_height + body_height - body_radius} `
                    + `Z`)
                .attr("fill", body_color)
				.attr("fill-opacity", body_color_opacity)
                .attr("stroke", "none")
                .attr("stroke-width", "0");

            // 3. this._root에 SVG 요소를 추가
            d3.select(this._root).node().appendChild(svgElement);
        }

        printProperties() {
            console.log(['width',this.offsetWidth]);
            console.log(['height',this.offsetHeight]);
            console.log(['header_color',this.header_color]);
			console.log(['header_color1',this.header_color1]);
            console.log(['header_color2',this.header_color2]);
            console.log(['header_color3',this.header_color3]);
            console.log(['body_color',this.body_color]);
			console.log(['body_color_opacity',this.body_color_opacity]);			
            console.log(['header_radius',this.header_radius]);
            console.log(['body_color',this.body_color]);
            console.log(['header_height',this.header_height]);
            console.log(['gap',this.gap]);
            console.log(['header_color',this.header_color]);
        }
    }

    customElements.define('com-bsg-sac-bgbox_headerbox-main', BGBox);
})();
