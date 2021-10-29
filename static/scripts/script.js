const canvasDiv = document.getElementById("canvasGrid");

const apiURL = 'http://192.168.1.100:3000';


let colorPicker;
let colors = [];
let tColors = [];
let nPixels = 0;
let pW = 0;
function setup() {
    let width = windowWidth;
    let height = 100;
    createCanvas(width,height);
    background(127);
    colorPicker = createColorPicker('#ed225d');
    colorPicker.position(0, height + 5);
    noStroke();

    fetch(apiURL+'/api/pixels', {
        method: 'GET'
    }).then(res => res.json())
    .then(data => {
        console.log(data);
        if(data.pixels>0){
            let tmpColor = [];
            data.leds.forEach(pixel => {
                tmpColor.push(color(pixel.r,pixel.g,pixel.b));
            });
            colors = tmpColor;
            tColors = [...colors];
            nPixels = data.pixels;
            pW = Math.floor(width/nPixels);
            colors.forEach((pixel, i) => {
                fill(pixel);
                rect(pW*i,0,pW,height);
                i++;
            });
        }
    });
}

function windowResized(){
    resizeCanvas(windowWidth,height);
    pW = windowWidth/nPixels;
}

function draw() {
    let edited = false;
    background(127);
    tColors.forEach((pixel,i) => {
        if(mouseIsPressed && 
            mouseX > pW*i &&
            mouseX < pW*i+pW &&
            mouseY > 0 &&
            mouseY < height ){
            pixel = colorPicker.color();
            tColors[i] = pixel;
            edited = true;
        }
        fill(pixel);
        rect(pW*i,0,pW,height);
    });
    if(edited){
        let txData = [];
        tColors.forEach((el,i) => {
            txData.push({
                r: el.levels[0],
                g: el.levels[1],
                b: el.levels[2]
            });
        });
        fetch('api/pixels', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(txData)
        }).then(res => res.json())
        .then(data => {
            if(data.res){
                colors = [...tColors];
                console.log('updated');
            } else {
                tColors = [...colors];
                console.error('error pushing new Colors');
            }
        })
    }
}




const neoPixel = {
    data() {
        return {
            demoStatus: "Loading..."
        }
    },
    methods: {
        toggleDemo(event){
            fetch(apiURL+'/api/demo', {
                method: 'POST'
            }).then(res => res.json())
            .then(data => {
                console.log(data);
                if(data.demo){
                    this.demoStatus = "Demo ON"
                } else {
                    this.demoStatus = "Demo OFF"
                }
            });
        },
        resetColour(event){
            fetch(apiURL+'/api/pixels', {
                method: 'DELETE'
            }).then(res => res.json())
            .then(data => {
                if(data.pixels == nPixels) {
                    let tmpColor = [];
                    data.leds.forEach((el,i) => {
                        colors[i].setRed(el.r);
                        colors[i].setGreen(el.g);
                        colors[i].setBlue(el.b);
                    });
                    tColors = [...colors];
                } else {
                    console.error('err resetting...');
                }
            });
        }
    },
    created() {
        fetch(apiURL+'/api/demo', {
            method: 'GET'
        }).then(res => res.json())
        .then(data => {
            console.log(data);
            if(data.demo){
                this.demoStatus = "Demo ON"
            } else {
                this.demoStatus = "Demo OFF"
            }
        });

        fetch(apiURL+'/api/demo', {
            method: 'GET'
        }).then(res => res.json())
        .then(data => {
            console.log(data);
            if(data.demo){
                this.demoStatus = "Demo ON"
            } else {
                this.demoStatus = "Demo OFF"
            }
        });
    }
}



Vue.createApp(neoPixel).mount('#neoPixel');



function randomColor(){
    return Math.floor(Math.random()*16777215).toString(16);
}