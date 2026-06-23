import * as THREE from 'three'

export class InventoryManager {
    constructor() {
        this.items = {
            shards: [],
            relicCharges: 10,
            blueprints: 0
        }
    }

    addShard(shardId) {
        this.items.shards.push(shardId)
        return this.items.shards.length
    }

    useRelicCharge() {
        if (this.items.relicCharges > 0) {
            this.items.relicCharges--
            return true
        }
        return false
    }

    restoreRelicCharges(amount = 5) {
        this.items.relicCharges = Math.min(20, this.items.relicCharges + amount)
    }

    getShardCount() {
        return this.items.shards.length
    }

    getRelicCharges() {
        return this.items.relicCharges
    }
}

export class PowerUp {
    constructor(position, type) {
        this.position = position.clone()
        this.type = type // 'health', 'energy', 'relic', 'speed'
        this.collected = false
        this.createMesh()
    }

    createMesh() {
        const geometry = new THREE.BoxGeometry(1, 1, 1)
        let color = 0xff0000

        if (this.type === 'health') color = 0xff6b6b
        else if (this.type === 'energy') color = 0xffff00
        else if (this.type === 'relic') color = 0x00ff00
        else if (this.type === 'speed') color = 0x00ffff

        const material = new THREE.MeshStandardMaterial({
            color: color,
            metalness: 0.6,
            roughness: 0.4,
            emissive: color
        })

        this.mesh = new THREE.Mesh(geometry, material)
        this.mesh.position.copy(this.position)
        this.mesh.castShadow = true
    }

    update(deltaTime) {
        if (this.collected) return
        this.mesh.rotation.x += 0.02
        this.mesh.rotation.y += 0.03
        this.mesh.position.y += Math.sin(Date.now() * 0.003) * 0.01
    }

    getMesh() {
        return this.mesh
    }

    getPosition() {
        return this.position
    }

    collect() {
        this.collected = true
    }
}

export class PowerUpManager {
    constructor(scene) {
        this.scene = scene
        this.powerUps = []
    }

    spawnPowerUp(position, type) {
        const powerUp = new PowerUp(position, type)
        this.scene.add(powerUp.getMesh())
        this.powerUps.push(powerUp)
        return powerUp
    }

    spawnRandomPowerUps(count = 3) {
        const types = ['health', 'energy', 'relic', 'speed']
        const positions = [
            new THREE.Vector3(-40, 20, 0),
            new THREE.Vector3(40, 20, 0),
            new THREE.Vector3(0, 25, -40)
        ]

        for (let i = 0; i < Math.min(count, positions.length); i++) {
            const type = types[Math.floor(Math.random() * types.length)]
            this.spawnPowerUp(positions[i], type)
        }
    }

    update(deltaTime) {
        this.powerUps.forEach(powerUp => {
            powerUp.update(deltaTime)
        })
    }

    checkCollision(playerPosition) {
        for (let i = this.powerUps.length - 1; i >= 0; i--) {
            const powerUp = this.powerUps[i]
            if (powerUp.collected) continue

            const distance = playerPosition.distanceTo(powerUp.getPosition())
            if (distance < 3) {
                powerUp.collect()
                this.scene.remove(powerUp.getMesh())
                this.powerUps.splice(i, 1)
                return powerUp.type
            }
        }
        return null
    }

    clear() {
        this.powerUps.forEach(powerUp => {
            this.scene.remove(powerUp.getMesh())
        })
        this.powerUps = []
    }
}