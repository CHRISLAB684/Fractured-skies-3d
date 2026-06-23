import * as THREE from 'three'

export class Enemy {
    constructor(position, scene, id) {
        this.position = position.clone()
        this.scene = scene
        this.id = id
        this.health = 30
        this.maxHealth = 30
        this.defeated = false
        this.attackCooldown = 0

        this.createMesh()
    }

    createMesh() {
        // Enemy body
        const bodyGeometry = new THREE.IcosahedronGeometry(1.5, 2)
        const bodyMaterial = new THREE.MeshStandardMaterial({
            color: 0xff4444,
            metalness: 0.5,
            roughness: 0.5,
            emissive: 0xaa0000
        })
        this.mesh = new THREE.Mesh(bodyGeometry, bodyMaterial)
        this.mesh.position.copy(this.position)
        this.mesh.castShadow = true
        this.scene.add(this.mesh)

        // Health bar
        this.healthBarGeometry = new THREE.BoxGeometry(3, 0.3, 0.1)
        this.healthBarMaterial = new THREE.MeshBasicMaterial({ color: 0xff0000 })
        this.healthBar = new THREE.Mesh(this.healthBarGeometry, this.healthBarMaterial)
        this.healthBar.position.y = 3
        this.mesh.add(this.healthBar)
    }

    takeDamage(amount) {
        this.health -= amount
        this.updateHealthBar()

        if (this.health <= 0) {
            this.defeat()
        }
    }

    updateHealthBar() {
        const healthPercent = Math.max(0, this.health / this.maxHealth)
        this.healthBar.scale.x = healthPercent
    }

    defeat() {
        this.defeated = true
    }

    update(deltaTime, playerPosition) {
        if (this.defeated) return

        // Move towards player
        const direction = new THREE.Vector3().subVectors(playerPosition, this.position)
        const distance = direction.length()

        if (distance > 0.5) {
            direction.normalize()
            this.position.add(direction.multiplyScalar(0.05))
        }

        this.mesh.position.copy(this.position)
        this.mesh.rotation.y += 0.02

        this.attackCooldown = Math.max(0, this.attackCooldown - deltaTime)
    }

    getPosition() {
        return this.position
    }

    getMesh() {
        return this.mesh
    }
}

export class EnemyManager {
    constructor(scene) {
        this.scene = scene
        this.enemies = []
    }

    spawnEnemy(position) {
        const enemy = new Enemy(position, this.scene, this.enemies.length)
        this.enemies.push(enemy)
        return enemy
    }

    spawnWave(count, centerPosition) {
        const enemies = []
        for (let i = 0; i < count; i++) {
            const angle = (i / count) * Math.PI * 2
            const distance = 20
            const x = centerPosition.x + Math.cos(angle) * distance
            const z = centerPosition.z + Math.sin(angle) * distance
            const enemy = this.spawnEnemy(new THREE.Vector3(x, 10, z))
            enemies.push(enemy)
        }
        return enemies
    }

    damageEnemy(index, amount) {
        if (this.enemies[index]) {
            this.enemies[index].takeDamage(amount)
        }
    }

    updateAll(deltaTime, playerPosition) {
        this.enemies.forEach(enemy => {
            enemy.update(deltaTime, playerPosition)
        })
    }

    getDefeatedCount() {
        return this.enemies.filter(e => e.defeated).length
    }

    getAliveCount() {
        return this.enemies.filter(e => !e.defeated).length
    }

    clear() {
        this.enemies.forEach(enemy => {
            this.scene.remove(enemy.getMesh())
        })
        this.enemies = []
    }
}