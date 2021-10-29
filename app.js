const express = require('express');
const livereload = require('livereload');
const connectLiveReload = require('connect-livereload');
const path = require("path");

//livereload
const liveReloadServer = livereload.createServer();
liveReloadServer.watch(path.join(__dirname, 'static'));
liveReloadServer.server.once("connection", () => {
    setTimeout(()=>{
        liveReloadServer.refresh("/");
    },100)
});


const app = express();
const port = 3050;

const numb_pixels = 60;

let pixels = generateRainbow(numb_pixels);

let demo = false;

app.use(express.static(path.join(__dirname, 'static')));
app.use(express.json());
app.use(connectLiveReload());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));



app.get('/api/helloWorld', (_req, res) => {
    res.json({
        hello:'world'
    });
});

app.get('/api/rgb', (_req, res) => {
    if(demo){
        res.json({
            demo:true,
            delay: 10
        })
    } else {
        res.json({
            demo:false,
            pixels: numb_pixels,
            leds: pixels
        });
    }
});

app.get('/api/pixels',  (_req,res) => {
    res.json({
        pixels: numb_pixels,
        leds: pixels
    });
});

app.post('/api/pixels', (req,res) => {
    let len = req.body.length;
    let resp = false;
    if(len == numb_pixels){
        req.body.forEach((el,i)=> {
            if(el.hasOwnProperty('r') &&
            el.hasOwnProperty('g') &&
            el.hasOwnProperty('b')){
                pixels[i] = el;
            } else {
                console.log('illegal Format'+JSON.stringify(el));
            }
        })
        resp = true;
    }
    res.json({
        res: resp
    });
    
});

app.delete('/api/pixels',(req,res) => {
    let r = generateRainbow(numb_pixels);
    if(r.length == numb_pixels){
        pixels = [...r];
        res.json({
            pixels: numb_pixels,
            leds: pixels
        });
    } else {
        res.json({
            err:'whoops',
            r: r.length,
            np: numb_pixels
        });
    }
});

app.get('/api/demo', (_req,res) =>{
    res.json({
        demo: demo
    });
});

app.post('/api/demo',(req,res) => {
    demo = !demo;
    res.json({
        demo: demo
    });
});


app.use(function(req,res,next){
    res.status(404).send("Whoops! could not find..")
});


app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
});






function getRandomInt(max) {
    return Math.floor(Math.random() * max);
}


function rgb2hsv(r,g,b) {
    let v=Math.max(r,g,b), c=v-Math.min(r,g,b);
    let h= c && ((v==r) ? (g-b)/c : ((v==g) ? 2+(b-r)/c : 4+(r-g)/c)); 
    return [60*(h<0?h+6:h), v&&c/v, v];
}

function hsv2rgb(h,s,v) {                              
  let f= (n,k=(n+h/60)%6) => v - v*s*Math.max( Math.min(k,4-k,1), 0);     
  return [f(5)*255,f(3)*255,f(1)*255];       
}   


function generateRainbow(n=numb_pixels) {
    let dS = 360/n;
    let tmpOut = [];
    for(let i=0;i<n;i++){
        let c = hsv2rgb((dS*i),1,1);
        tmpOut.push({
            r: Math.floor(c[0]),
            g: Math.floor(c[1]),
            b: Math.floor(c[2])
        });
    }
    return tmpOut;
    
}