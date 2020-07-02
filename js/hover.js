const image = document.getElementById('image');
const magnifier = document.getElementById('magnifier');
const infoBox = document.getElementById('info');
const nextBtn = document.getElementById('next');
let layers = [];
let lid = 0;
let st = true;

$.get( "data.json", function( data ) {
    for (let i=0; i<data.length; i++){
        let layerId = -1;
        for (let j=0; j<layers.length; j++){
            if (layers[j].src === data[i].src){
                layerId = j;
            }
        }
        if (layerId > -1){
            layers[layerId].points.push({
                x: data[i].x,
                y: data[i].y,
                r: data[i].r,
            });
        } else {
            layers.push({
                src: data[i].src,
                text: data[i].text,
                points: [{
                    x: data[i].x,
                    y: data[i].y,
                    r: data[i].r,
                }]
            });
        }
    }
    image.style.backgroundImage = 'url(' + layers[lid].src + ')';
    magnifier.style.backgroundImage = 'url(' + layers[lid+1].src + ')';
    nextBtn.style.display = 'none';

    image.addEventListener('mousemove', function (ev) {
        magnifier.style.top = ev.y - 50 + 'px';
        magnifier.style.left = ev.x - 50 + 'px';
        magnifier.style.backgroundPositionX = -ev.x + 50 + 'px';
        magnifier.style.backgroundPositionY = -ev.y + 50 + 'px';
    });

    image.addEventListener('click', function (ev) {
        if (st){
            let points = layers[lid].points;
            for (let p=0; p<points.length; p++){
                let r = points[p].r;
                if (Math.abs(ev.x - points[p].x ) < r &&  Math.abs(ev.y - points[p].y) < r && lid < layers.length - 1){
                    lid = lid +1;
                    image.style.backgroundImage = 'url(' + layers[lid].src + ')';
                    infoBox.innerHTML =  layers[lid].text;
                    if (lid < layers.length - 1){
                        magnifier.style.backgroundImage = 'url(' + layers[lid+1].src + ')';
                        nextBtn.style.display = 'block';
                    }
                    st = false;
                    magnifier.style.display = 'none';
                    return;
                }
            }
        }
    });

    nextBtn.addEventListener('click', function () {
        magnifier.style.display = 'block';
        st = true;
        this.style.display = 'none';
    });
});
