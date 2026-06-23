import * as THREE from 'three'

export class MiniMap {
    constructor(canvas) {
        this.canvas = document.createElement('canvas')
        this.canvas.width = 200
        this.canvas.height = 200
        this.canvas.style.position = 'absolute'
        this.canvas.style.top = '20px'
        this.canvas.style.right = '20px'
        this.canvas.style.border = '2px solid #fff'
        this.canvas.style.backgroundColor = 'rgba(0, 0, 0, 0.7)'
        this.canvas.style.zIndex = '100'
        
        document.body.appendChild(this.canvas)
        this.ctx = this.canvas.getContext('2d')
        this.mapScale = 3
    }

    update(playerPosition, enemies, interactables) {
        this.ctx.fillStyle = 'rgba(0, 0, 0, 0.9)'
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height)

        // Draw grid
        this.ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)'
        this.ctx.lineWidth = 1
        for (let i = 0; i < this.canvas.width; i += 20) {
            this.ctx.beginPath()
            this.ctx.moveTo(i, 0)
            this.ctx.lineTo(i, this.canvas.height)
            this.ctx.stroke()
        }

        // Draw border
        this.ctx.strokeStyle = '#fff'
        this.ctx.lineWidth = 2
        this.ctx.strokeRect(0, 0, this.canvas.width, this.canvas.height)

        const centerX = this.canvas.width / 2
        const centerY = this.canvas.height / 2

        // Draw enemies
        enemies.forEach(enemy => {
            const x = centerX + (enemy.getPosition().x - playerPosition.x) / this.mapScale
            const y = centerY + (enemy.getPosition().z - playerPosition.z) / this.mapScale

            if (x > 0 && x < this.canvas.width && y > 0 && y < this.canvas.height) {
                this.ctx.fillStyle = '#ff4444'
                this.ctx.fillRect(x - 3, y - 3, 6, 6)
            }
        })

        // Draw interactables
        interactables.forEach(item => {
            const x = centerX + (item.x - playerPosition.x) / this.mapScale
            const y = centerY + (item.z - playerPosition.z) / this.mapScale

            if (x > 0 && x < this.canvas.width && y > 0 && y < this.canvas.height) {
                this.ctx.fillStyle = item.color
                this.ctx.beginPath()
                this.ctx.arc(x, y, 3, 0, Math.PI * 2)
                this.ctx.fill()
            }
        })

        // Draw player
        this.ctx.fillStyle = '#00ff00'
        this.ctx.fillRect(centerX - 4, centerY - 4, 8, 8)
    }
}

export class HUD {
    constructor() {
        this.createHUD()
    }

    createHUD() {
        // Relic charge bar
        const chargeContainer = document.createElement('div')
        chargeContainer.id = 'relic-charges'
        chargeContainer.style.cssText = `
            position: absolute;
            bottom: 100px;
            left: 20px;
            z-index: 100;
        `
        document.body.appendChild(chargeContainer)

        // Wave counter
        const waveCounter = document.createElement('div')
        waveCounter.id = 'wave-counter'
        waveCounter.style.cssText = `
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translateX(-50%);
            color: #fff;
            font-size: 36px;
            font-weight: bold;
            z-index: 100;
            text-align: center;
            text-shadow: 0 0 10px #000;
            display: none;
        `
        document.body.appendChild(waveCounter)

        // Crosshair
        const crosshair = document.createElement('div')
        crosshair.style.cssText = `
            position: absolute;
            top: 50%;
            left: 50%;
            width: 20px;
            height: 20px;
            border: 2px solid #00ff00;
            border-radius: 50%;
            transform: translate(-50%, -50%);
            pointer-events: none;
            z-index: 99;
            opacity: 0.5;
        `
        document.body.appendChild(crosshair)
    }

    updateRelicCharges(current, max) {
        const container = document.getElementById('relic-charges')
        container.innerHTML = ''
        
        for (let i = 0; i < max; i++) {
            const charge = document.createElement('div')
            charge.style.cssText = `
                display: inline-block;
                width: 20px;
                height: 20px;
                margin: 2px;
                background: ${i < current ? '#00ff00' : 'rgba(0,255,0,0.2)'};
                border: 1px solid #00ff00;
                border-radius: 2px;
            `
            container.appendChild(charge)
        }
    }

    showWaveMessage(waveNumber) {
        const waveCounter = document.getElementById('wave-counter')
        waveCounter.textContent = `WAVE ${waveNumber}`
        waveCounter.style.display = 'block'
        setTimeout(() => {
            waveCounter.style.display = 'none'
        }, 2000)
    }

    updateCombo(count) {
        const message = document.getElementById('message')
        if (count > 0) {
            message.textContent = `COMBO x${count}!`
            message.style.color = '#fbbf24'
        }
    }
}