const w : number = window.innerWidth
const h : number = window.innerHeight
const scGap : number = 0.05
const scDiv : number = 0.51
const nodes : number = 5
const lines : number = 4
const strokeFactor : number = 90
const sizeFactor : number = 2.9
const foreColor : string = "#1565C0"
const backColor : string = "#BDBDBD"

class ScaleUtil {

    static scaleFactor(scale : number) : number {
        return scale / scDiv
    }

    static maxScale(scale : number, i : number, n : number) : number {
        return Math.max(0, scale - i / n)
    }

    static divideScale(scale : number, i : number, n : number) : number {
        return Math.min(1 / n, ScaleUtil.maxScale(scale, i, n)) * n
    }

    static mirrorValue(scale : number, a : number, b : number) : number {
        const k : number = ScaleUtil.scaleFactor(scale)
        return (1 - k) / a + k / b
    }

    static updateValue(scale : number, dir : number, a : number, b : number) : number {
        return ScaleUtil.mirrorValue(scale, a, b) * dir * scGap
    }
}

class DrawingUtil {

    static drawLine(context : CanvasRenderingContext2D, x1 : number, y1 : number, x2 : number, y2 : number) {
        context.beginPath()
        context.moveTo(x1, y1)
        context.lineTo(x2, y2)
        context.stroke()
    }

    static drawCrossLineStep(context : CanvasRenderingContext2D, size : number, sc : number) {
        const l : number = size / 2
        for (var i = 0; i < 2; i++) {
            context.save()
            context.translate(l * i , l * i)
            context.rotate(Math.PI / 4 * sc * i)
            DrawingUtil.drawLine(context, 0, 0, l, l)
            context.restore()
        }
    }

    static drawCLSNode(context : CanvasRenderingContext2D, i : number, scale : number) {
        const gap : number = w / (nodes + 1)
        const size : number = gap / sizeFactor
        const sc1 : number = ScaleUtil.divideScale(scale, 0, 2)
        const sc2 : number = ScaleUtil.divideScale(scale, 1, 2)
        context.lineCap = 'round'
        context.lineWidth = Math.min(w, h) / strokeFactor
        context.strokeStyle = foreColor
        context.save()
        context.translate(gap * (i + 1), h / 2)
        context.rotate(Math.PI / 2 * sc2)
        for (var j = 0; j < lines; j++) {
            context.save()
            context.rotate(Math.PI / 2 * j)
            DrawingUtil.drawCrossLineStep(context, size, ScaleUtil.divideScale(sc1, j, lines))
            context.restore()
        }
        context.restore()
    }
}

class CrossLineStepStage {

    canvas : HTMLCanvasElement = document.createElement('canvas')
    context : CanvasRenderingContext2D

    initCanvas() {
        this.canvas.width = w
        this.canvas.height = h
        this.context = this.canvas.getContext('2d')
        document.body.appendChild(this.canvas)
    }

    render() {
        this.context.fillStyle = backColor
        this.context.fillRect(0, 0, w, h)
    }

    handleTap() {
        this.canvas.onmousedown = () => {
            this.canvas.onmousedown = () => {

            }
        }
    }

    static init() {
        const stage : CrossLineStepStage = new CrossLineStepStage()
        stage.initCanvas()
        stage.render()
        stage.handleTap()
    }
}
